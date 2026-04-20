import { useEffect, useState } from 'react'
import { Wheel } from 'react-custom-roulette'
import './RouletteWheel.css'

const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
])

const wheelData = Array.from({ length: 37 }, (_, value) => ({
  option: String(value),
  style: { backgroundColor: getColorForNumber(value), textColor: '#fff' },
}))

export function getColorForNumber(number) {
  if (number === 0) return 'green'
  return RED_NUMBERS.has(number) ? 'red' : 'black'
}

function RouletteWheel({ spinning, onSpinEnd }) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)

  useEffect(() => {
    if (!spinning || mustSpin) return
    setPrizeNumber(Math.floor(Math.random() * 37))
    setMustSpin(true)
  }, [spinning, mustSpin])

  return (
    <section className="roulette-wheel">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        outerBorderColor="#2f2f2f"
        radiusLineColor="#666"
        fontSize={14}
        onStopSpinning={() => {
          setMustSpin(false)
          onSpinEnd(prizeNumber)
        }}
      />
    </section>
  )
}

export default RouletteWheel
