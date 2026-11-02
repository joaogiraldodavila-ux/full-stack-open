import { useEffect } from 'react'
import Filter from './components/Filter'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import anecdoteService from './services/anecdotes'
import { useAnecdotes } from './store'
import Notification from './components/Notification'

const App = () => {
  const setAnecdotes = useAnecdotes((state) => state.setAnecdotes)

  useEffect(() => {
    anecdoteService.getAll().then((anecdotes) => {
      setAnecdotes(anecdotes)
    })
  }, [setAnecdotes])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App