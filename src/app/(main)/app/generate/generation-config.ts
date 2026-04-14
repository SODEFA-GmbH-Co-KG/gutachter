import { z } from 'zod'

export const GENERATION_CATEGORIES = {
  lage: {
    label: 'Lage',
    groups: {
      makrolage: {
        label: 'Makrolage',
        options: [
          'zentrale Stadtlage',
          'gute Wohnlage',
          'Stadtrandlage',
          'laendliche Lage',
        ],
      },
      mikrolage: {
        label: 'Mikrolage',
        options: ['ruhig', 'maessig belebt', 'stark belebt'],
      },
      infrastruktur: {
        label: 'Infrastruktur',
        options: ['sehr gut', 'gut', 'befriedigend', 'mangelhaft'],
      },
    },
  },
  zustand: {
    label: 'Zustand',
    groups: {
      technischerZustand: {
        label: 'Technischer Zustand',
        options: [
          'sehr gut',
          'gut',
          'befriedigend',
          'ausreichend',
          'mangelhaft',
        ],
      },
      baulicherZustand: {
        label: 'Baulicher Zustand',
        options: [
          'sehr gut',
          'gut',
          'befriedigend',
          'ausreichend',
          'mangelhaft',
        ],
      },
      modernisierungsgrad: {
        label: 'Modernisierungsgrad',
        options: [
          'vollstaendig modernisiert',
          'ueberwiegend modernisiert',
          'teilweise modernisiert',
          'nicht modernisiert',
        ],
      },
    },
  },
} as const

export type CategoryKey = keyof typeof GENERATION_CATEGORIES
export type GroupKey<C extends CategoryKey> =
  keyof (typeof GENERATION_CATEGORIES)[C]['groups']

// Zod schema for form validation — one selection per group
export const GenerateFormSchema = z.object({
  lage: z.object({
    makrolage: z.string().min(1, 'Bitte eine Option waehlen'),
    mikrolage: z.string().min(1, 'Bitte eine Option waehlen'),
    infrastruktur: z.string().min(1, 'Bitte eine Option waehlen'),
  }),
  zustand: z.object({
    technischerZustand: z.string().min(1, 'Bitte eine Option waehlen'),
    baulicherZustand: z.string().min(1, 'Bitte eine Option waehlen'),
    modernisierungsgrad: z.string().min(1, 'Bitte eine Option waehlen'),
  }),
})

export type GenerateFormData = z.infer<typeof GenerateFormSchema>

export const FILE_CONSTRAINTS = {
  maxFiles: 20,
  maxFileSizeMB: 10,
  maxFileSizeBytes: 10 * 1024 * 1024,
  acceptedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/heic',
  ] as const,
  acceptString: '.pdf,.jpg,.jpeg,.png,.heic',
}

export const DOCUMENT_CATEGORIES = [
  {
    id: 'fotos',
    label: 'Objektfotos',
    description: 'Aussen- & Innenansichten, Schaeden',
    acceptTypes: ['image/jpeg', 'image/png', 'image/heic'],
    acceptString: '.jpg,.jpeg,.png,.heic',
  },
  {
    id: 'grundbuch',
    label: 'Grundbuchauszug & Lageplan',
    description: 'Grundbuch, Flurkarte, Katasterplan',
    acceptTypes: ['application/pdf'],
    acceptString: '.pdf',
  },
  {
    id: 'plaene',
    label: 'Bauplaene & Grundrisse',
    description: 'Grundrisse, Schnitte, Ansichten',
    acceptTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'],
    acceptString: '.pdf,.jpg,.jpeg,.png,.heic',
  },
  {
    id: 'flaeche',
    label: 'Flaechenberechnung',
    description: 'Wohn- & Nutzflaechenberechnung',
    acceptTypes: ['application/pdf'],
    acceptString: '.pdf',
  },
  {
    id: 'energie',
    label: 'Energieausweis',
    description: 'Energiebedarfs- oder Verbrauchsausweis',
    acceptTypes: ['application/pdf'],
    acceptString: '.pdf',
  },
  {
    id: 'sonstiges',
    label: 'Sonstige Unterlagen',
    description: 'Mietvertraege, Baubeschreibung, weitere Dokumente',
    acceptTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'],
    acceptString: '.pdf,.jpg,.jpeg,.png,.heic',
  },
] as const

export type CategorizedFiles = Record<string, File[]>
