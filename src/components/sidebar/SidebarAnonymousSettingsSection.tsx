import { getIsLoggedIn } from '@/auth/getMyUser'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { ThemeSwitcher } from '../layout/ThemeSwitcher'

export const SidebarAnonymousSettingsSection = async () => {
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) return null
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Einstellungen</SidebarGroupLabel>
        <SidebarMenu>
          <ThemeSwitcher variant="sidebar" />
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
