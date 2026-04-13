import { cn } from '@/lib/utils'

export function Section({
  id,
  children,
  className,
  variant = 'default',
}: {
  id?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'muted' | 'gradient'
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 md:py-32',
        variant === 'muted' && 'bg-muted/50',
        variant === 'gradient' &&
          'bg-gradient-to-b from-primary/5 to-transparent',
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-8">{children}</div>
    </section>
  )
}
