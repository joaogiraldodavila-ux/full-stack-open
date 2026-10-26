const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // Verificamos que el formulario de login aparezca por defecto
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
  })
})