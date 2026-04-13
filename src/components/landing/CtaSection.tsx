import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FadeIn } from './FadeIn'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/[0.06] via-primary/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tighter leading-none text-foreground md:text-5xl">
              Bereit fur intelligentere Gutachten?
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed md:text-lg max-w-[55ch]">
              Starten Sie jetzt mit GutachterKI und generieren Sie Ihre ersten
              Gutachtertexte in wenigen Minuten.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/auth/login">
                  Jetzt starten
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
