import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test('root route respects locale cookie for anonymous users', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/de$/)
  await expect(page.getByText(/immobiliengutachten/i).first()).toBeVisible()
})

test('anonymous auth-protected routes redirect to login with redirect param', async ({
  page,
}) => {
  await page.goto('/app')
  await expect(page).toHaveURL(/\/auth\/login\?redirect=/)

  await page.goto('/auth/change-password')
  await expect(page).toHaveURL(/\/auth\/login/)

  await page.goto('/auth/change-username')
  await expect(page).toHaveURL(/\/auth\/login/)
})

test('logged-in root and login page redirects behave as expected', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto('/')
  await expect(page).toHaveURL(/\/app/)

  await page.goto('/auth/login?redirect=%2Fusers')
  await expect(page).toHaveURL(/\/users/)
})
