import { useAnecdotes } from '../store'

const Filter = () => {
  const setFilter = useAnecdotes((state) => state.setFilter)

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} data-testid="filter" />
    </div>
  )
}

export default Filter