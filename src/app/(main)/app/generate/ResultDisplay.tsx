'use client'

import { Markdown } from '@/components/demo/Markdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function ResultDisplay({
  text,
  isStreaming,
}: {
  text: string
  isStreaming: boolean
}) {
  const [copied, setCopied] = useState(false)

  if (!text && !isStreaming) return null

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg">Ergebnis</CardTitle>
          <Badge variant="secondary" className="text-xs">
            KI-Entwurf
          </Badge>
          {isStreaming && <Spinner className="size-4" />}
        </div>
        {text && (
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(text)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
          >
            {copied ? (
              <>
                <Check className="mr-1 size-3.5" />
                Kopiert
              </>
            ) : (
              <>
                <Copy className="mr-1 size-3.5" />
                Kopieren
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <Markdown>{text || ''}</Markdown>
        </div>
      </CardContent>
    </Card>
  )
}
