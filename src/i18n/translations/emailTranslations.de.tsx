import { BRAND } from '@/lib/starter.config'

export const t = {
  defaultTemplate: {
    footer: {
      signature: (
        <>
          Beste Grüße
          <br />
          Dein {BRAND.name} Team
        </>
      ),
    },
  },
  orgInvite: {
    subjectText: ({ orgName }: { orgName: string }) =>
      `Tritt ${orgName} auf ${BRAND.name} bei`,

    greeting: 'Hallo',
    welcome: (orgName: string) => (
      <>
        Tritt <strong>{orgName}</strong> auf <BRAND.TextLogo /> bei
      </>
    ),
    description: ({
      invitedByUsername,
      invitedByEmail,
      orgName,
      role,
    }: {
      invitedByUsername: string | null
      invitedByEmail: string
      orgName: string
      role: string
    }) => (
      <>
        <strong>{invitedByUsername ?? invitedByEmail}</strong>
        {invitedByUsername && ` (${invitedByEmail})`} hat dich eingeladen, um
        der Organisation <strong>{orgName}</strong> auf {BRAND.name} als {role}{' '}
        beizutreten.
      </>
    ),
    joinButton: (orgName: string) => `${orgName} beitreten`,
    fallback: 'oder kopiere und füge diese URL in deinen Browser ein',
  },
  verifyEmail: {
    subjectText: `Login zu ${BRAND.name}`,
    previewText: 'Bestätige deine E-Mail-Adresse',
    title: 'Bestätige deine E-Mail-Adresse',
    greeting: 'Hallo',
    description:
      'Bitte bestätige deine E-Mail-Adresse, indem du auf den Link unten klickst',
    verifyButton: '👉 Bestätigen 👈',
    fallback: 'oder kopiere und füge diese URL in deinen Browser ein',
  },
}
