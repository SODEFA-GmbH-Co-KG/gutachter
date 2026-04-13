import { type ExpirationTime } from '@/organization/inviteCodes/expirationTimes'

export const ORGS = {
  isActive: true,
  onlyAdminsCanCreateOrgs: false,
  defaultExpirationEmailInvitation: '1d' satisfies ExpirationTime,
} as const

export const BRAND = {
  name: 'GutachterKI',
  logoUrl: '/logo.svg',
  TextLogo: () => (
    <strong>
      Gutachter<span className="text-primary">KI</span>
    </strong>
  ),
  metadata: {
    description:
      'KI-gestutzte Textgenerierung fur Immobiliengutachten. Aus Checkboxen, PDFs und Fotos werden professionelle Gutachtertexte.',
  },
  github: {
    active: false,
    url: '',
  },
  colors: {
    primary: '#2563eb',
    primaryForeground: '#ffffff',
  },
}

export const LOCALIZATION = {
  isActive: false,
}

export const SIDEBAR = {
  activeInMain: 'loggedIn' as 'loggedIn' | boolean,
}
