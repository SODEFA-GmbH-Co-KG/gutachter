import { cn } from '@/lib/utils'

export function StepCard({
  number,
  icon,
  title,
  description,
  isLast = false,
}: {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  isLast?: boolean
}) {
  return (
    <div className="relative flex gap-6">
      {/* Vertical connector line */}
      <div className="flex flex-col items-center">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
          {number}
        </div>
        {!isLast && (
          <div className="mt-3 w-px flex-1 bg-gradient-to-b from-primary/30 to-border" />
        )}
      </div>

      {/* Content */}
      <div className={cn('pb-12', isLast && 'pb-0')}>
        <div className="text-primary [&_svg]:size-5 [&_svg]:stroke-[1.5] mb-2">
          {icon}
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-[45ch]">
          {description}
        </p>
      </div>
    </div>
  )
}
