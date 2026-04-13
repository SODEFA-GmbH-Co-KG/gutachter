import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function SectionHeader({
  overline,
  heading,
  description,
  className,
  align = 'left',
}: {
  overline?: string
  heading: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={cn(
        'mb-16 max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {overline && (
        <Badge
          variant="secondary"
          className="mb-4 font-medium text-xs tracking-wide uppercase"
        >
          {overline}
        </Badge>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-none text-foreground">
        {heading}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-[65ch]">
          {description}
        </p>
      )}
    </div>
  )
}
