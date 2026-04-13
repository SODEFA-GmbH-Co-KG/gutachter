import { Building2, Shield, Smartphone, Star } from 'lucide-react'
import { FadeIn } from './FadeIn'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'
import { TrustBadge } from './TrustBadge'

const trustItems = [
  {
    icon: <Shield />,
    label: 'DSGVO-konform',
    description:
      'Alle hochgeladenen Dateien werden nach der Textgenerierung sofort geloscht.',
  },
  {
    icon: <Building2 />,
    label: 'CRM-Integration',
    description:
      'Login uber Ihr bestehendes CRM. Automatische Abrechnung pro Generierung.',
  },
  {
    icon: <Smartphone />,
    label: 'Mobil nutzbar',
    description:
      'Optimiert fur Tablets und Smartphones. Fotos direkt vor Ort am Objekt hochladen.',
  },
  {
    icon: <Star />,
    label: 'Gutachter-Qualitat',
    description:
      'Texte nach fachspezifischen Kriterien generiert. KI-Entwurf zur finalen Prufung markiert.',
  },
]

export function TrustSection() {
  return (
    <Section variant="muted">
      <FadeIn>
        <SectionHeader
          overline="Vertrauen"
          heading="Fur den professionellen Einsatz gebaut"
          description="Datenschutz, Integration und Qualitat stehen im Mittelpunkt."
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12">
          {trustItems.map((item) => (
            <TrustBadge
              key={item.label}
              icon={item.icon}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </FadeIn>
    </Section>
  )
}
