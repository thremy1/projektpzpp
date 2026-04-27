import { useEffect, useState } from 'react'
import { Wheel } from 'react-custom-roulette'
import './RouletteWheel.css'

const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
])

// European roulette order around the wheel.
const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
]

const wheelData = ROULETTE_ORDER.map((value) => ({
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
  const [isLightTheme, setIsLightTheme] = useState(false)

  useEffect(() => {
    if (!spinning || mustSpin) return
    setPrizeNumber(Math.floor(Math.random() * ROULETTE_ORDER.length))
    setMustSpin(true)
  }, [spinning, mustSpin])

  useEffect(() => {
    const updateTheme = () => {
      setIsLightTheme(document.documentElement.dataset.theme === 'light')
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="roulette-wheel">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        outerBorderColor={isLightTheme ? '#cbd5e1' : '#2f2f2f'}
        radiusLineColor={isLightTheme ? '#94a3b8' : '#666'}
        fontSize={14}
        onStopSpinning={() => {
          setMustSpin(false)
          onSpinEnd(ROULETTE_ORDER[prizeNumber])
        }}
      />
    </section>
  )
}

export default RouletteWheel
