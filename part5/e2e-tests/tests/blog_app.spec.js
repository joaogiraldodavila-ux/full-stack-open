const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // 1. Vaciar la base de datos a través del endpoint de prueba del backend
    await request.post('http://localhost:3003/api/testing/reset')

    // 2. Crear un usuario de prueba en el backend
    const newUser = {
      username: 'joao',
      name: 'Joao Giraldo',
      password: 'password123'
    }
    await request.post('http://localhost:3003/api/users', { data: newUser })

    // 3. Ir a la aplicación frontend
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // Rellenamos el formulario con las credenciales correctas
      await page.getByRole('textbox').first().fill('joao')
      await page.getByRole('textbox').nth(1).fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      // Verificamos que el usuario haya iniciado sesión correctamente (ej. mensaje de bienvenida)
      await expect(page.getByText('Joao Giraldo logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // Rellenamos el formulario con una contraseña incorrecta
      await page.getByRole('textbox').first().fill('joao')
      await page.getByRole('textbox').nth(1).fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      // Verificamos que aparezca el mensaje de error correspondiente
      await expect(page.getByText('wrong username or password')).toBeVisible()

      // Verificamos que el formulario de login siga visible en pantalla
      await expect(page.getByText('log in to application')).toBeVisible()
    })
  })
})