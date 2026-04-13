import { cn } from '@/lib/utils'

export function FeatureCard({
  icon,
  title,
  description,
  className,
  reverse = false,
}: {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
  reverse?: boolean
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center',
        reverse && 'md:[&>:first-child]:order-2',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-muted/60 border border-border/50 p-12 md:p-16',
          'transition-[transform,box-shadow] duration-300 ease-out',
          'hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-1',
        )}
        style={{
          // @ts-expect-error -- CSS media query handled by browser
          '@media(hover:hover)': {},
        }}
      >
        <div className="text-primary [&_svg]:size-16 md:[&_svg]:size-20 [&_svg]:stroke-[1.25]">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-[50ch]">
          {description}
        </p>
      </div>
    </div>
  )
}
