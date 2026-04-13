import { getMyUserOrLogin } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'
import { GenerateForm } from './GenerateForm'

export default async function Page() {
  await getMyUserOrLogin({
    forceRedirectUrl: '/app/generate',
  })

  return (
    <>
      <TopHeader>Gutachten generieren</TopHeader>
      <GenerateForm />
    </>
  )
}
