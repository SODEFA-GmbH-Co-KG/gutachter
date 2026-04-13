import { mergeDeep } from 'remeda'
import { t as email } from './emailTranslations.de'
import { t as clientT } from './translations.de'

const serverT = {
  email,
}

export type TranslationsServerOnly = typeof serverT

export const t = mergeDeep(serverT, clientT)
export type TranslationsServerAndClient = typeof t
