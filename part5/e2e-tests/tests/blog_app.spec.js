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

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Iniciamos sesión antes de cada prueba de este bloque
      await page.getByRole('textbox').first().fill('joao')
      await page.getByRole('textbox').nth(1).fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill('Prueba unica de creacion')
      await inputs.nth(1).fill('Joao Giraldo')
      await inputs.nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.locator('.blogSummary').getByText('Prueba unica de creacion')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // 1. Creamos un blog con un título único para identificarlo fácilmente
      await page.getByRole('button', { name: 'new blog' }).click()
      
      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill('Blog para probar likes unicos')
      await inputs.nth(1).fill('Joao Giraldo')
      await inputs.nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      // 2. Buscamos el contenedor principal del blog (.blog) que contiene el título
      const blog = page.locator('.blog', { hasText: 'Blog para probar likes unicos' })
      
      // Hacemos clic en el botón 'view' para desplegar los detalles
      await blog.getByRole('button', { name: 'view' }).click()

      // 3. Hacemos clic en el botón 'like' y verificamos que el contador aumente a 1
      await blog.getByRole('button', { name: 'like' }).click()
      
      await expect(blog.getByText('likes 1')).toBeVisible()
    })
  })
})