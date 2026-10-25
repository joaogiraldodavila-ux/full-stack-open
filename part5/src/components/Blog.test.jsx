import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest' 


//Ejercicio 5.13
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

  //Ejercicio 5.15
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

  // 1. Creamos una función mock con Vitest
  const mockHandler = vi.fn()

  // 2. Renderizamos el componente pasándole la función mock como prop 
  // (asegúrate de que el nombre de la prop coincida con el que usa tu componente Blog, ej: handleLike o updateBlog)
   const { container } = render(<Blog blog={blog} updateLikes={mockHandler} />)

  const user = userEvent.setup()

  // 3. Hacemos clic en el botón "view" para mostrar los detalles donde está el botón like
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // 4. Buscamos el botón "like" y hacemos clic en él dos veces
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  // 5. Verificamos que la función mock haya sido llamada exactamente 2 veces
  expect(mockHandler.mock.calls.length).toBe(2)
})
