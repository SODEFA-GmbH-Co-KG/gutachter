import { Camera, CheckSquare, FileUp } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { FeatureCard } from './FeatureCard'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'

const features = [
  {
    icon: <CheckSquare />,
    title: 'Strukturierte Objektklassifizierung',
    description:
      'Definieren Sie die Eckdaten per Checkbox-Matrix: Makro- und Mikrolage, technischer Zustand, Modernisierungsgrad und Infrastruktur. Die KI nutzt Ihre Auswahl als Grundlage fur den Gutachtertext.',
  },
  {
    icon: <FileUp />,
    title: 'Automatische PDF-Analyse',
    description:
      'Laden Sie Grundrisse, Baubeschreibungen und Lageplane hoch. GutachterKI extrahiert Masse, rechtliche Vorgaben und technische Spezifikationen und verarbeitet sie direkt im Text.',
    reverse: true,
  },
  {
    icon: <Camera />,
    title: 'Multimodale Foto-Analyse',
    description:
      'Fotografieren Sie Fassade, Innenraume, Heizungsanlage oder Dachstuhl. Die KI erkennt Materialien, Bodenbelage, Fensterarten und sichtbare Baumangel und beschreibt sie fachgerecht.',
  },
] as const

export function FeaturesSection() {
  return (
    <Section id="features" variant="muted">
      <FadeIn>
        <SectionHeader
          overline="Funktionen"
          heading="Drei Eingabearten, ein Ergebnis"
          description="GutachterKI fusioniert Ihre strukturierten Eingaben, Dokumentdaten und visuelle Informationen zu einem konsistenten Fliesstext."
        />
      </FadeIn>

      <div className="flex flex-col gap-20 md:gap-28">
        {features.map((feature, i) => (
          <FadeIn key={feature.title} delay={i * 100}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              reverse={'reverse' in feature && feature.reverse}
            />
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}
