const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // 1. Limpiar la base de datos usando el endpoint de test del backend
    await request.post('http://localhost:3003/api/testing/reset')

    // 2. Crear un usuario de prueba en el backend para que pueda hacer login
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'João Giraldo',
        username: 'joao',
        password: 'password123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form can be opened', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('textbox').nth(1)).toBeVisible()
  })

  test('Succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByRole('textbox').first().fill('joao')
    await page.getByRole('textbox').nth(1).fill('password123')
    await page.getByRole('button', { name: 'login' }).click()

    // Usar .first() para evitar conflicto si hay más de un elemento de logout en la vista
    await expect(page.getByRole('button', { name: 'logout' }).first()).toBeVisible()
  })

  test('Fails with wrong credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByRole('textbox').first().fill('joao')
    await page.getByRole('textbox').nth(1).fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toBeVisible()
    await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'João Giraldo',
          username: 'joao',
          password: 'password123'
        }
      })

      await page.goto('http://localhost:5173')
      
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('joao')
      await page.getByRole('textbox').nth(1).fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByRole('button', { name: 'logout' }).first()).toBeVisible()
    })

    test('A new blog can be created', async ({ page }) => {
      const uniqueTitle = `Test Blog ${Date.now()}`
      await page.getByRole('button', { name: 'new blog' }).click()
      
      await page.getByRole('textbox').nth(0).fill(uniqueTitle)
      await page.getByRole('textbox').nth(1).fill('João Giraldo')
      await page.getByRole('textbox').nth(2).fill('https://fullstackopen.com/')
      
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.locator('.blog', { hasText: uniqueTitle })).toBeVisible()
    })

    test('A blog can be liked', async ({ page }) => {
      const uniqueTitle = `Liked Blog ${Date.now()}`
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox').nth(0).fill(uniqueTitle)
      await page.getByRole('textbox').nth(1).fill('João')
      await page.getByRole('textbox').nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      const blogElement = page.locator('.blog', { hasText: uniqueTitle })
      await blogElement.getByRole('button', { name: 'view' }).click()
      await blogElement.getByRole('button', { name: 'like' }).click()
      await expect(blogElement.getByText('likes 1')).toBeVisible()
    })

    test('A blog can be deleted by its creator', async ({ page }) => {
      const uniqueTitle = `Delete Blog ${Date.now()}`
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox').nth(0).fill(uniqueTitle)
      await page.getByRole('textbox').nth(1).fill('João')
      await page.getByRole('textbox').nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      const blogElement = page.locator('.blog', { hasText: uniqueTitle })
      await blogElement.getByRole('button', { name: 'view' }).click()
      
      page.on('dialog', dialog => dialog.accept())
      await blogElement.getByRole('button', { name: 'remove' }).click()
      
      await expect(blogElement).not.toBeVisible()
    })

    test('only the creator can see the delete button of a blog', async ({ page, request }) => {
      const uniqueTitle = `Creator Blog ${Date.now()}`
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByRole('textbox').nth(0).fill(uniqueTitle)
      await page.getByRole('textbox').nth(1).fill('Joao Giraldo')
      await page.getByRole('textbox').nth(2).fill('https://fullstackopen.com/')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog', { hasText: uniqueTitle })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).first().click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'seconduser',
          name: 'Second User',
          password: 'password123'
        }
      })

      await page.getByRole('link', { name: 'login' }).click()
      await page.getByRole('textbox').first().fill('seconduser')
      await page.getByRole('textbox').nth(1).fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes with the one with most likes first', async ({ page }) => {
      const uniqueId = Date.now()
      const titleLess = `Blog menos ${uniqueId}`
      const titleMost = `Blog mas ${uniqueId}`
      const titleMedium = `Blog intermedio ${uniqueId}`
      const blogTitles = [titleLess, titleMost, titleMedium]

      for (const title of blogTitles) {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByRole('textbox').nth(0).fill(title)
        await page.getByRole('textbox').nth(1).fill('Joao Giraldo')
        await page.getByRole('textbox').nth(2).fill('https://fullstackopen.com/')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.locator('.blog', { hasText: title })).toBeVisible()
      }

      // 1. Blog con más likes (le damos 2 likes con pausas para estabilidad de React)
      const blogMostLikes = page.locator('.blog', { hasText: titleMost })
      await blogMostLikes.getByRole('button', { name: 'view' }).click()
      await blogMostLikes.getByRole('button', { name: 'like' }).click()
      await expect(blogMostLikes.getByText('likes 1')).toBeVisible()
      
      await page.waitForTimeout(600)

      await blogMostLikes.getByRole('button', { name: 'like' }).click()
      await expect(blogMostLikes.getByText('likes 2')).toBeVisible()

      // 2. Blog con likes intermedios (le damos 1 like)
      const blogMediumLikes = page.locator('.blog', { hasText: titleMedium })
      await blogMediumLikes.getByRole('button', { name: 'view' }).click()
      await blogMediumLikes.getByRole('button', { name: 'like' }).click()
      await expect(blogMediumLikes.getByText('likes 1')).toBeVisible()

      // Pausa final para que React reordene los elementos en el DOM de la vista principal
      await page.waitForTimeout(800)

      // 3. Verificamos que el primer blog de la lista general sea el que tiene más likes
      const firstBlog = page.locator('.blog').first()
      await expect(firstBlog).toContainText(titleMost)
    })
  })
})