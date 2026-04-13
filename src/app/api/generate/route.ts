import {
  FILE_CONSTRAINTS,
  GenerateFormSchema,
} from '@/app/(main)/app/generate/generation-config'
import { auth } from '@/auth/auth'
import { db } from '@/db/db'
import { generations } from '@/db/schema-generations'
import { recordGenerationBilling } from '@/lib/crm-billing'
import { buildUserPrompt, SYSTEM_PROMPT } from '@/lib/gemini-prompt'
import { superCache } from '@/lib/superCache'
import { createVertex } from '@ai-sdk/google-vertex'
import { streamText } from 'ai'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  // 1. Auth
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  // 2. Check Vertex AI config
  if (!process.env.GOOGLE_VERTEX_PROJECT) {
    return NextResponse.json(
      { error: 'GOOGLE_VERTEX_PROJECT ist nicht konfiguriert' },
      { status: 500 },
    )
  }

  // 3. Parse FormData
  const formData = await req.formData()
  const checkboxDataRaw = formData.get('checkboxData')
  if (typeof checkboxDataRaw !== 'string') {
    return NextResponse.json({ error: 'Missing checkboxData' }, { status: 400 })
  }

  const checkboxParsed = GenerateFormSchema.safeParse(
    JSON.parse(checkboxDataRaw),
  )
  if (!checkboxParsed.success) {
    return NextResponse.json(
      { error: 'Invalid checkboxData', details: checkboxParsed.error.issues },
      { status: 400 },
    )
  }
  const checkboxData = checkboxParsed.data

  const files = formData.getAll('files') as File[]

  // 4. Validate files
  if (files.length > FILE_CONSTRAINTS.maxFiles) {
    return NextResponse.json(
      { error: `Maximal ${FILE_CONSTRAINTS.maxFiles} Dateien erlaubt` },
      { status: 400 },
    )
  }
  for (const file of files) {
    if (file.size > FILE_CONSTRAINTS.maxFileSizeBytes) {
      return NextResponse.json(
        {
          error: `${file.name} ist groesser als ${FILE_CONSTRAINTS.maxFileSizeMB} MB`,
        },
        { status: 400 },
      )
    }
    if (
      !FILE_CONSTRAINTS.acceptedTypes.includes(
        file.type as (typeof FILE_CONSTRAINTS.acceptedTypes)[number],
      )
    ) {
      return NextResponse.json(
        { error: `${file.name} hat ein nicht unterstuetztes Format` },
        { status: 400 },
      )
    }
  }

  // 5. Create generation record
  const [generation] = await db
    .insert(generations)
    .values({
      userId,
      checkboxData,
      fileNames: files.map((f) => f.name),
      status: 'streaming',
    })
    .returning()

  // 6. Build multimodal content parts
  const fileParts = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      if (file.type === 'application/pdf') {
        return {
          type: 'file' as const,
          data: buffer,
          mediaType: file.type as 'application/pdf',
        }
      }
      return {
        type: 'image' as const,
        image: buffer,
        mediaType: file.type,
      }
    }),
  )

  const startTime = Date.now()
  const userPrompt = buildUserPrompt(checkboxData)
  console.log('[Generate] Starting for user', userId, '| files:', files.length)

  // 7. Stream from Gemini — manual streaming for proper error handling
  try {
    const vertex = createVertex({
      project: process.env.GOOGLE_VERTEX_PROJECT,
      location: process.env.GOOGLE_VERTEX_LOCATION || 'europe-west1',
      googleAuthOptions: {
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
          private_key: process.env.GOOGLE_PRIVATE_KEY!,
        },
      },
    })
    const result = streamText({
      model: vertex('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: userPrompt }, ...fileParts],
        },
      ],
    })

    // Use a custom ReadableStream so we can catch errors and update DB
    const encoder = new TextEncoder()
    let fullText = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const delta of result.textStream) {
            fullText += delta
            controller.enqueue(encoder.encode(delta))
          }
          controller.close()

          // Success: update DB
          const durationMs = Date.now() - startTime
          console.log(
            '[Generate] Completed in',
            durationMs,
            'ms | text length:',
            fullText.length,
          )
          await db
            .update(generations)
            .set({ resultText: fullText, status: 'completed', durationMs })
            .where(eq(generations.id, generation.id))
          superCache.userGenerations({ userId }).revalidate()
          await recordGenerationBilling({
            userId,
            generationId: generation.id,
            durationMs,
          })
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : 'Generation failed'
          console.error('[Generate] Stream error:', errorMsg)

          // Try to send error to client
          controller.enqueue(encoder.encode(`\n\n---\n**Fehler:** ${errorMsg}`))
          controller.close()

          await db
            .update(generations)
            .set({
              status: 'failed',
              errorText: errorMsg,
              resultText: fullText,
              durationMs: Date.now() - startTime,
            })
            .where(eq(generations.id, generation.id))
          superCache.userGenerations({ userId }).revalidate()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    // Synchronous error (e.g., invalid model, bad config)
    const errorMsg = err instanceof Error ? err.message : 'Generation failed'
    console.error('[Generate] Sync error:', errorMsg)

    await db
      .update(generations)
      .set({
        status: 'failed',
        errorText: errorMsg,
        durationMs: Date.now() - startTime,
      })
      .where(eq(generations.id, generation.id))

    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
