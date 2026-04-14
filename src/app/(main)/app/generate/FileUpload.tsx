'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Camera,
  FileText,
  FolderPlus,
  ImageIcon,
  LayoutGrid,
  Ruler,
  Scale,
  X,
  Zap,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import {
  type CategorizedFiles,
  DOCUMENT_CATEGORIES,
  FILE_CONSTRAINTS,
} from './generation-config'

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  fotos: Camera,
  grundbuch: Scale,
  plaene: Ruler,
  flaeche: LayoutGrid,
  energie: Zap,
  sonstiges: FolderPlus,
}

export function FileUpload({
  categorizedFiles,
  onChange,
}: {
  categorizedFiles: CategorizedFiles
  onChange: (files: CategorizedFiles) => void
}) {
  const [error, setError] = useState<string | null>(null)

  const totalFiles = Object.values(categorizedFiles).reduce(
    (sum, files) => sum + files.length,
    0,
  )

  const addFiles = useCallback(
    ({
      categoryId,
      newFiles,
    }: {
      categoryId: string
      newFiles: FileList | File[]
    }) => {
      setError(null)
      const incoming = Array.from(newFiles)
      const currentCategoryFiles = categorizedFiles[categoryId] || []
      const newTotal = totalFiles + incoming.length

      if (newTotal > FILE_CONSTRAINTS.maxFiles) {
        setError(
          `Maximal ${FILE_CONSTRAINTS.maxFiles} Dateien insgesamt erlaubt.`,
        )
        return
      }

      const category = DOCUMENT_CATEGORIES.find((c) => c.id === categoryId)

      for (const file of incoming) {
        if (file.size > FILE_CONSTRAINTS.maxFileSizeBytes) {
          setError(
            `${file.name} ist groesser als ${FILE_CONSTRAINTS.maxFileSizeMB} MB.`,
          )
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
        if (
          category &&
          !(category.acceptTypes as readonly string[]).includes(file.type)
        ) {
          setError(
            `${file.name} passt nicht zu "${category.label}". Bitte unter "Sonstige Unterlagen" hochladen.`,
          )
          return
        }
      }

      onChange({
        ...categorizedFiles,
        [categoryId]: [...currentCategoryFiles, ...incoming],
      })
    },
    [categorizedFiles, totalFiles, onChange],
  )

  const removeFile = useCallback(
    ({
      categoryId,
      fileIndex,
    }: {
      categoryId: string
      fileIndex: number
    }) => {
      const categoryFiles = categorizedFiles[categoryId] || []
      onChange({
        ...categorizedFiles,
        [categoryId]: categoryFiles.filter((_, i) => i !== fileIndex),
      })
    },
    [categorizedFiles, onChange],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium tracking-tight">
          Unterlagen hochladen
        </p>
        {totalFiles > 0 && (
          <p className="tabular-nums text-xs text-muted-foreground">
            {totalFiles} / {FILE_CONSTRAINTS.maxFiles}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DOCUMENT_CATEGORIES.map((category) => (
          <CategoryDropzone
            key={category.id}
            category={category}
            files={categorizedFiles[category.id] || []}
            onAddFiles={(files) =>
              addFiles({ categoryId: category.id, newFiles: files })
            }
            onRemoveFile={(fileIndex) =>
              removeFile({ categoryId: category.id, fileIndex })
            }
            disabled={totalFiles >= FILE_CONSTRAINTS.maxFiles}
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function CategoryDropzone({
  category,
  files,
  onAddFiles,
  onRemoveFile,
  disabled,
}: {
  category: (typeof DOCUMENT_CATEGORIES)[number]
  files: File[]
  onAddFiles: (files: FileList) => void
  onRemoveFile: (index: number) => void
  disabled: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const Icon = CATEGORY_ICONS[category.id] || FileText

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (!disabled && e.dataTransfer.files.length) {
            onAddFiles(e.dataTransfer.files)
          }
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'group flex cursor-pointer items-start gap-3 rounded-2xl border border-dashed p-4',
          'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'active:scale-[0.98]',
          isDragging
            ? 'border-primary/60 bg-primary/5 shadow-sm'
            : disabled
              ? 'cursor-not-allowed opacity-40'
              : 'border-border hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm',
          files.length > 0 &&
            !isDragging &&
            !disabled &&
            'border-primary/20 bg-primary/[0.02]',
        )}
      >
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl',
            'bg-muted/80 transition-colors duration-300 group-hover:bg-muted',
          )}
        >
          <Icon className="size-[18px] text-muted-foreground" />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-sm font-medium leading-tight tracking-tight">
            {category.label}
          </p>
          <p className="text-xs leading-snug text-muted-foreground/70">
            {category.description}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={category.acceptString}
          onChange={(e) => {
            if (e.target.files?.length) {
              onAddFiles(e.target.files)
              e.target.value = ''
            }
          }}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-1 pl-1">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="group/file flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-1.5 transition-colors duration-200 hover:bg-muted/60"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon className="size-3.5 shrink-0 text-muted-foreground/70" />
              ) : (
                <FileText className="size-3.5 shrink-0 text-muted-foreground/70" />
              )}
              <span className="flex-1 truncate text-xs text-foreground/80">
                {file.name}
              </span>
              <span className="tabular-nums text-[10px] text-muted-foreground/60">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="shrink-0 opacity-60 transition-opacity duration-200 group-hover/file:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFile(i)
                }}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
