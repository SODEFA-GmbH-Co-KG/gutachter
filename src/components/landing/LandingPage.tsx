import { CtaSection } from './CtaSection'
import { FeaturesSection } from './FeaturesSection'
import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { TrustSection } from './TrustSection'

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <CtaSection />
    </>
  )
}
