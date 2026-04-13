import { CheckSquare, Cpu, FileText, Upload } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'
import { StepCard } from './StepCard'

const steps = [
  {
    icon: <CheckSquare />,
    title: 'Objekt klassifizieren',
    description:
      'Wahlen Sie Lage, Zustand und Ausstattungsmerkmale uber die Checkbox-Matrix aus.',
  },
  {
    icon: <Upload />,
    title: 'Dokumente und Fotos hochladen',
    description:
      'Laden Sie Grundrisse als PDF und Objektfotos direkt vom Smartphone oder Desktop hoch.',
  },
  {
    icon: <Cpu />,
    title: 'KI analysiert alle Quellen',
    description:
      'Gemini verarbeitet Checkboxen, PDFs und Fotos parallel in einem multimodalen Analyseschritt.',
  },
  {
    icon: <FileText />,
    title: 'Gutachtertext erhalten',
    description:
      'Sie erhalten eine detaillierte Gebaudebeschreibung als Fliesstext, bereit zur Ubernahme in Ihr Gutachten.',
  },
]

export function HowItWorksSection() {
  return (
    <Section>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <FadeIn>
          <SectionHeader
            overline="So funktioniert es"
            heading="In vier Schritten zum fertigen Text"
            description="Vom Ortstermin bis zum Gutachtertext in wenigen Minuten."
          />
        </FadeIn>

        <FadeIn delay={150}>
          <div>
            {steps.map((step, i) => (
              <StepCard
                key={step.title}
                number={i + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}
