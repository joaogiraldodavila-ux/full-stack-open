import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAnecdotes } from './hooks'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'

const App = () => {
  // Obtenemos las anécdotas directamente desde el nuevo custom hook
  const { anecdotes } = useAnecdotes()

  const addAnecdote = (anecdote) => {
    // Función temporal para evitar errores en este ejercicio (se implementará en el próximo)
    console.log(anecdote)
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addAnecdote={addAnecdote} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App