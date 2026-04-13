import { Button } from '@/components/ui/button'
import {
  Camera,
  CheckSquare,
  FileText,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { FadeIn } from './FadeIn'

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-emerald/[0.03]" />

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1fr_0.85fr] md:gap-16 md:px-8 md:py-0">
        {/* Left — Copy */}
        <FadeIn className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            KI-Textgenerierung
          </p>
          <h1 className="text-4xl font-bold tracking-tighter leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
            Immobiliengutachten.
            <br />
            <span className="text-primary">Per KI generiert.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-base text-muted-foreground leading-relaxed md:text-lg">
            GutachterKI verwandelt Ihre Eingaben, Dokumente und Fotos in
            professionelle Gutachtertexte. Direkt vor Ort, auf jedem
            Endger&auml;t.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/auth/login">
                Jetzt starten
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 px-8 text-base text-muted-foreground"
            >
              <a href="#features">
                Mehr erfahren
                <ChevronDown className="ml-1 size-4" />
              </a>
            </Button>
          </div>
        </FadeIn>

        {/* Right — Abstract visual */}
        <FadeIn delay={200} className="flex items-center justify-center">
          <div className="relative grid w-full max-w-md grid-cols-2 gap-4">
            {/* Floating cards representing input types */}
            <HeroCard
              icon={<CheckSquare />}
              label="Checkbox-Matrix"
              description="Lage, Zustand, Ausstattung"
              className="col-span-2"
            />
            <HeroCard
              icon={<FileText />}
              label="PDF-Analyse"
              description="Grundrisse & Pl&auml;ne"
            />
            <HeroCard
              icon={<Camera />}
              label="Foto-KI"
              description="Fassade, R&auml;ume, Technik"
            />

            {/* Decorative connector */}
            <div className="col-span-2 flex justify-center">
              <div className="flex h-12 w-px items-center bg-gradient-to-b from-border to-primary/40">
                <div className="size-2 -translate-x-[3px] rounded-full bg-primary" />
              </div>
            </div>

            {/* Result card */}
            <div className="col-span-2 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Ergebnis
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Detaillierte Geb&auml;udebeschreibung als Fliesstext, bereit
                f&uuml;r Ihr Gutachten.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function HeroCard({
  icon,
  label,
  description,
  className,
}: {
  icon: React.ReactNode
  label: string
  description: string
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] ${className ?? ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4 [&_svg]:stroke-[1.5]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
