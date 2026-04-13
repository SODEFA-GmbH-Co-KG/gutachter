'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FileText, ImageIcon, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { FILE_CONSTRAINTS } from './generation-config'

export function FileUpload({
  files,
  onChange,
}: {
  files: File[]
  onChange: (files: File[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null)
      const incoming = Array.from(newFiles)
      const combined = [...files, ...incoming]

      if (combined.length > FILE_CONSTRAINTS.maxFiles) {
        setError(`Maximal ${FILE_CONSTRAINTS.maxFiles} Dateien erlaubt.`)
        return
      }

      for (const file of incoming) {
        if (file.size > FILE_CONSTRAINTS.maxFileSizeBytes) {
          setError(`${file.name} ist groesser als ${FILE_CONSTRAINTS.maxFileSizeMB} MB.`)
          return
        }
        if (
          !FILE_CONSTRAINTS.acceptedTypes.includes(
            file.type as (typeof FILE_CONSTRAINTS.acceptedTypes)[number],
          )
        ) {
          setError(`${file.name} hat ein nicht unterstuetztes Format.`)
          return
        }
      }

      onChange(combined)
    },
    [files, onChange],
  )

  const removeFile = useCallback(
    (index: number) => {
      onChange(files.filter((_, i) => i !== index))
    },
    [files, onChange],
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files)
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors duration-200',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40 hover:bg-muted/30',
        )}
      >
        <Upload className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          PDFs, Fotos (JPG, PNG, HEIC) hierher ziehen oder klicken
        </p>
        <p className="text-xs text-muted-foreground/70">
          Max. {FILE_CONSTRAINTS.maxFiles} Dateien, je{' '}
          {FILE_CONSTRAINTS.maxFileSizeMB} MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={FILE_CONSTRAINTS.acceptString}
          onChange={(e) => {
            if (e.target.files?.length) {
              addFiles(e.target.files)
              e.target.value = ''
            }
          }}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className="flex-1 truncate text-sm">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(i)
                }}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
