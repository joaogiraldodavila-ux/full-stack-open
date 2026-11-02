import useCounterStore from '../counterReducer'

const Statistics = () => {
  const good = useCounterStore((state) => state.good)
  const neutral = useCounterStore((state) => state.neutral)
  const bad = useCounterStore((state) => state.bad)

  const all = good + neutral + bad

  if (all === 0) {
    return (
      <div>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  }

  const average = (good * 1 + neutral * 0 + bad * -1) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average.toFixed(1)}</td></tr>
          <tr><td>positive</td><td>{positive.toFixed(1)} %</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics