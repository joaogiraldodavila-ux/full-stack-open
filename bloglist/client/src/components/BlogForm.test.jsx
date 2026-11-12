import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // Obtenemos todos los inputs de texto del formulario
  const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  // Cambiamos 'save' por 'create' para que coincida con tu componente BlogForm
  const sendButton = screen.getByText('create')
  
  // Escribimos en los inputs
  await user.type(titleInput, 'Testing forms with react-testing-library')
  await user.type(authorInput, 'Full Stack Open Student')
  await user.type(urlInput, 'https://fullstackopen.com/')

  // Hacemos clic en el botón
  await user.click(sendButton)

  // Verificaciones
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing forms with react-testing-library')
  expect(createBlog.mock.calls[0][0].author).toBe('Full Stack Open Student')
  expect(createBlog.mock.calls[0][0].url).toBe('https://fullstackopen.com/')
})