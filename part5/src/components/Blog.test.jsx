import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
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

  // Renderizamos el componente
  const { container } = render(<Blog blog={blog} />)

  // 1. Verificamos que se muestren el título y el autor
  const summaryDiv = container.querySelector('.blogSummary')
  expect(summaryDiv).toHaveTextContent(
    'Component testing is done with react-testing-library Full Stack Open Student'
  )

  // 2. Verificamos que la URL y los likes NO se muestren por defecto
  const detailsDiv = container.querySelector('.blogDetails')
  expect(detailsDiv).toHaveStyle('display: none')
})