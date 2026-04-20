import { useMemo, useState } from 'react'
import './App.css'
import BetControls from './components/BetControls'
import RecentResults from './components/RecentResults'
import RouletteWheel, { getColorForNumber } from './components/RouletteWheel'

function App() {
  const [balance, setBalance] = useState(1000)
  const [betType, setBetType] = useState('number')
  const [betValue, setBetValue] = useState(0)
  const [betAmount, setBetAmount] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [results, setResults] = useState([])

  const canSpin = useMemo(
    () => !isSpinning && betAmount > 0 && betAmount <= balance,
    [isSpinning, betAmount, balance],
  )

  const handleSpinStart = () => {
    if (!canSpin) return
    setBalance((prev) => prev - betAmount)
    setIsSpinning(true)
  }

  const handleSpinEnd = (result) => {
    const isWin =
      betType === 'number'
        ? Number(betValue) === result
        : getColorForNumber(result) === betType

    if (isWin) {
      const multiplier = betType === 'number' ? 36 : 2
      setBalance((prev) => prev + betAmount * multiplier)
    }

    setResults((prev) => [result, ...prev].slice(0, 10))
    setIsSpinning(false)
  }

  return (
    <main className="app">
      <h1>Roulette Game</h1>
      <p className="balance">Stan konta: ${balance}</p>

      <RouletteWheel spinning={isSpinning} onSpinEnd={handleSpinEnd} />

      <BetControls
        betType={betType}
        setBetType={setBetType}
        betValue={betValue}
        setBetValue={setBetValue}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        canSpin={canSpin}
        onSpin={handleSpinStart}
      />

      <RecentResults results={results} />
    </main>
  )
}

export default App
