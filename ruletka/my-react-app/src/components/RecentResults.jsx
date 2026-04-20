import { getColorForNumber } from './RouletteWheel'
import './RecentResults.css'

function RecentResults({ results }) {
  return (
    <section className="recent-results">
      <h2>Ostatnie wyniki</h2>
      {results.length === 0 ? (
        <p>Brak wynikow.</p>
      ) : (
        <ul>
          {results.map((result, index) => (
            <li key={`${result}-${index}`}>
              <span className={`pill ${getColorForNumber(result)}`}>{result}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default RecentResults
