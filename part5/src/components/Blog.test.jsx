import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

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

  const { container } = render(<Blog blog={blog} />)

  const summaryDiv = container.querySelector('.blogSummary')
  expect(summaryDiv).toHaveTextContent(
    'Component testing is done with react-testing-library Full Stack Open Student'
  )

  const detailsDiv = container.querySelector('.blogDetails')
  expect(detailsDiv).toHaveStyle('display: none')
})

// NUEVA PRUEBA PARA EL EJERCICIO 5.14
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

  const { container } = render(<Blog blog={blog} />)

  // 1. Inicializamos userEvent para simular acciones del usuario
  const user = userEvent.setup()
  
  // 2. Buscamos el botón de ver detalles ("view") y hacemos clic en él
  const button = screen.getByText('view')
  await user.click(button)

  // 3. Verificamos que el contenedor de detalles ya NO esté oculto
  const detailsDiv = container.querySelector('.blogDetails')
  expect(detailsDiv).not.toHaveStyle('display: none')

  // 4. Comprobamos que ahora se muestren la URL y los likes
  expect(detailsDiv).toHaveTextContent('https://fullstackopen.com/')
  expect(detailsDiv).toHaveTextContent('5')
})