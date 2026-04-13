'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { createZodForm } from '@/lib/useZodForm'
import { Loader2, Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { CheckboxMatrix } from './CheckboxMatrix'
import { FileUpload } from './FileUpload'
import { GenerateFormSchema } from './generation-config'
import { ResultDisplay } from './ResultDisplay'

const [useGenerateForm] = createZodForm(GenerateFormSchema)

export function GenerateForm() {
  const form = useGenerateForm({
    defaultValues: {
      lage: { makrolage: '', mikrolage: '', infrastruktur: '' },
      zustand: {
        technischerZustand: '',
        baulicherZustand: '',
        modernisierungsgrad: '',
      },
    },
  })

  const [files, setFiles] = useState<File[]>([])
  const [resultText, setResultText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const onSubmit = useCallback(
    async (
      data: typeof form extends { getValues: () => infer T } ? T : never,
    ) => {
      setIsStreaming(true)
      setResultText('')

      const formData = new FormData()
      formData.set('checkboxData', JSON.stringify(data))
      for (const file of files) {
        formData.append('files', file)
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const err = await response.json().catch(() => null)
          throw new Error(err?.error || 'Die Generierung ist fehlgeschlagen.')
        }

        const contentType = response.headers.get('content-type') || ''

        // If JSON error response (not a stream)
        if (contentType.includes('application/json')) {
          const err = await response.json()
          throw new Error(err?.error || 'Die Generierung ist fehlgeschlagen.')
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Keine Antwort vom Server')

        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setResultText(accumulated)
        }

        if (!accumulated.trim()) {
          throw new Error(
            'Die KI hat keine Antwort geliefert. Bitte pruefen Sie den API-Key und versuchen Sie es erneut.',
          )
        }

        toast.success('Gutachtentext generiert')
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Die Generierung ist fehlgeschlagen.'
        toast.error(message)
      } finally {
        setIsStreaming(false)
      }
    },
    [files],
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit as never)}
        className="flex flex-col gap-8"
      >
        <CheckboxMatrix />

        <FileUpload files={files} onChange={setFiles} />

        <Button
          type="submit"
          size="lg"
          disabled={isStreaming}
          className="self-start"
        >
          {isStreaming ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Wird generiert...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 size-4" />
              Gutachten generieren
            </>
          )}
        </Button>

        <ResultDisplay text={resultText} isStreaming={isStreaming} />
      </form>
    </Form>
  )
}
