import useCounterStore from '../counterReducer'

const Buttons = () => {
  const incrementGood = useCounterStore((state) => state.incrementGood)
  const incrementNeutral = useCounterStore((state) => state.incrementNeutral)
  const incrementBad = useCounterStore((state) => state.incrementBad)

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>
    </div>
  )
}

export default Buttons