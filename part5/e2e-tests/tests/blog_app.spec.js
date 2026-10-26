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
    beforeEach(async ({ page, request }) => {
      // 1. Reiniciamos la base de datos y creamos el usuario base mediante la API del backend
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'joao',
          name: 'Joao Giraldo',
          password: 'password123'
        }
      })

      // 2. Iniciamos sesión en la interfaz
      await page.goto('http://localhost:5173')
      await page.getByRole('textbox').first().fill('joao')
      await page.getByRole('textbox').nth(1).fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      const title = `Unico blog de creacion test ${Date.now()}`
      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill(title)
      await inputs.nth(1).fill('Joao Giraldo')
      await inputs.nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.locator('.blogSummary', { hasText: title })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      
      const title = `Blog unico para likes ${Date.now()}`
      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill(title)
      await inputs.nth(1).fill('Joao Giraldo')
      await inputs.nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog', { hasText: title })
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()
      
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      const title = `Blog para ser eliminado ${Date.now()}`
      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill(title)
      await inputs.nth(1).fill('Joao Giraldo')
      await inputs.nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog', { hasText: title })
      await blog.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(blog).not.toBeVisible()
    })

    test('only the creator can see the delete button of a blog', async ({ page, request }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      const title = `Blog exclusivo del creador ${Date.now()}`
      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill(title)
      await inputs.nth(1).fill('Joao Giraldo')
      await inputs.nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog', { hasText: title })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'seconduser',
          name: 'Second User',
          password: 'password123'
        }
      })

      await page.getByRole('textbox').first().fill('seconduser')
      await page.getByRole('textbox').nth(1).fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes with the one with most likes first', async ({ page }) => {
      const uniqueId = Date.now()
      const titleLess = `Blog con menos likes ${uniqueId}`
      const titleMost = `Blog con mas likes ${uniqueId}`
      const titleMedium = `Blog con likes intermedios ${uniqueId}`
      const blogTitles = [titleLess, titleMost, titleMedium]

      for (const title of blogTitles) {
        await page.getByRole('button', { name: 'new blog' }).click()
        const inputs = page.getByRole('textbox')
        await inputs.nth(0).fill(title)
        await inputs.nth(1).fill('Joao Giraldo')
        await inputs.nth(2).fill('https://fullstackopen.com/')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.locator('.blog', { hasText: title })).toBeVisible()
      }

      // 1. Blog con más likes (le damos 2 likes con una pausa de estabilidad para React)
      const blogMostLikes = page.locator('.blog', { hasText: titleMost })
      await blogMostLikes.getByRole('button', { name: 'view' }).click()

      // Primer like
      await page.locator('.blog', { hasText: titleMost }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog', { hasText: titleMost }).getByText('likes 1').first()).toBeVisible()
      
      // Pequeña pausa para que el estado de React se asiente por completo
      await page.waitForTimeout(500)

      // Segundo like
      await page.locator('.blog', { hasText: titleMost }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog', { hasText: titleMost }).getByText('likes 2').first()).toBeVisible()

      // 2. Blog con likes intermedios (le damos 1 like)
      const blogMediumLikes = page.locator('.blog', { hasText: titleMedium })
      await blogMediumLikes.getByRole('button', { name: 'view' }).click()
      await page.locator('.blog', { hasText: titleMedium }).getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.blog', { hasText: titleMedium }).getByText('likes 1').first()).toBeVisible()

      // 3. Verificamos que el primer blog de la lista sea el que tiene más likes
      const firstBlog = page.locator('.blog').first()
      await expect(firstBlog).toContainText(titleMost)
    })
  })
})