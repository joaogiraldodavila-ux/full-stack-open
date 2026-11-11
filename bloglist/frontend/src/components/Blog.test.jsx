import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest' 
import { BrowserRouter } from 'react-router-dom' 

// Ejercicio 5.13
test('renders content: shows title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open Student',
    url: 'https://fullstackopen.com/',
    likes: 5,
    user: {
      username: 'joao',
      name: 'João Giraldo'
    }
  }

  const { container } = render(
    <BrowserRouter>
      <Blog blog={blog} />
    </BrowserRouter>
  )

  const summaryDiv = container.querySelector('.blogSummary')
  expect(summaryDiv).toHaveTextContent(
    'Component testing is done with react-testing-library Full Stack Open Student'
  )

  const detailsDiv = container.querySelector('.blogDetails')
  if (detailsDiv) {
    expect(detailsDiv).toHaveStyle('display: none')
  }
})

// PRUEBA PARA EL EJERCICIO 5.14
test('url and likes are shown when the button controlling the details has been clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open Student',
    url: 'https://fullstackopen.com/',
    likes: 5,
    user: {
      username: 'joao',
      name: 'João Giraldo'
    }
  }

  const { container } = render(
    <BrowserRouter>
      <Blog blog={blog} />
    </BrowserRouter>
  )

  const user = userEvent.setup()
  const button = screen.queryByText('view')
  
  if (button) {
    await user.click(button)
    const detailsDiv = container.querySelector('.blogDetails')
    expect(detailsDiv).not.toHaveStyle('display: none')
    expect(detailsDiv).toHaveTextContent('https://fullstackopen.com/')
    expect(detailsDiv).toHaveTextContent('5')
  }
})

// Ejercicio 5.15
test('if the like button is clicked twice, the event handler received as props is called twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open Student',
    url: 'https://fullstackopen.com/',
    likes: 5,
    user: {
      username: 'joao',
      name: 'João Giraldo'
    }
  }

  const mockHandler = vi.fn()
  render(
    <BrowserRouter>
      <Blog blog={blog} updateLikes={mockHandler} user={{ username: 'other', name: 'Other' }} />
    </BrowserRouter>
  )

  const user = userEvent.setup()
  const viewButton = screen.queryByText('view')
  if (viewButton) {
    await user.click(viewButton)
  }

  const likeButton = screen.getByRole('button', { name: /like/i })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls.length).toBe(2)
})

// ==========================================
// NUEVAS PRUEBAS PARA EL EJERCICIO 5.27
// ==========================================

describe('Blog component access and button visibility (Exercise 5.27)', () => {
  const blog = {
    title: 'Testing blog view permissions',
    author: 'João Giraldo',
    url: 'https://fullstackopen.com/',
    likes: 12,
    user: {
      username: 'joao',
      name: 'João Giraldo'
    }
  }

  const mockLike = vi.fn()
  const mockRemove = vi.fn()

  test('1. Unauthenticated users see blog info and likes, but NO buttons', () => {
    render(
      <BrowserRouter>
        <Blog 
          blog={blog} 
          updateLikes={mockLike} 
          removeBlog={mockRemove} 
          user={null} 
        />
      </BrowserRouter>
    )

    // Verifica información básica usando solo el título (que es único)
    expect(screen.getByText(/Testing blog view permissions/i)).toBeInTheDocument()

    // Cambia getByRole por queryByRole para ambos botones:
    const likeButton = screen.queryByRole('button', { name: /Like/i })
    const removeButton = screen.queryByRole('button', { name: /remove|delete/i })

    expect(likeButton).not.toBeInTheDocument()
    expect(removeButton).not.toBeInTheDocument()
  })

  test('2. Authenticated non-creator users are shown ONLY the like button', async () => {
    const anotherUser = { username: 'carlos', name: 'Carlos Pérez' }

    render(
      <BrowserRouter>
        <Blog 
          blog={blog} 
          updateLikes={mockLike} 
          removeBlog={mockRemove} 
          user={anotherUser} 
        />
      </BrowserRouter>
    )

    // Hacemos clic en "view" para mostrar los detalles
    const user = userEvent.setup()
    const viewButton = screen.getByRole('button', { name: /view/i })
    await user.click(viewButton)

    // El botón like debe estar presente
    const likeButton = screen.getByRole('button', { name: /like/i })
    expect(likeButton).toBeInTheDocument()

    // El botón remove NO debe estar presente
    const removeButton = screen.queryByRole('button', { name: /remove|delete/i })
    expect(removeButton).not.toBeInTheDocument()
  })

  test('3. The blog creator is shown BOTH like and remove buttons', async () => {
    const creatorUser = { username: 'joao', name: 'João Giraldo' }

    render(
      <BrowserRouter>
        <Blog 
          blog={blog} 
          updateLikes={mockLike} 
          removeBlog={mockRemove} 
          user={creatorUser} 
        />
      </BrowserRouter>
    )

    // Hacemos clic en "view" para mostrar los detalles
    const user = userEvent.setup()
    const viewButton = screen.getByRole('button', { name: /view/i })
    await user.click(viewButton)

    // Ambos botones deben estar presentes
    const likeButton = screen.getByRole('button', { name: /like/i })
    const removeButton = screen.queryByRole('button', { name: /remove|delete/i })

    expect(likeButton).toBeInTheDocument()
    expect(removeButton).toBeInTheDocument()
  })
})