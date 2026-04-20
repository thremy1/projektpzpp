import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [topUpAmount, setTopUpAmount] = useState(50)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const settingsMenuRef = useRef(null)

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

  useEffect(() => {
    if (!isSettingsOpen) return

    const handleOutsideClick = (event) => {
      if (!settingsMenuRef.current?.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isSettingsOpen])

  const handleAddFundsSubmit = (event) => {
    event.preventDefault()
    if (topUpAmount <= 0) return
    setBalance((prev) => prev + topUpAmount)
    setIsAddFundsOpen(false)
  }

  return (
    <main className="app">
      <header className="top-nav">
        <div className="settings-menu" ref={settingsMenuRef}>
          <button
            type="button"
            className="icon-button"
            aria-label="Ustawienia"
            aria-expanded={isSettingsOpen}
            aria-haspopup="menu"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
          >
            <span aria-hidden="true" className="nav-icon">
              ⚙
            </span>
          </button>

          {isSettingsOpen && (
            <ul className="dropdown-menu" role="menu" aria-label="Menu ustawien">
              <li role="none">
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsAddFundsOpen(true)
                    setIsAccountOpen(false)
                    setIsSettingsOpen(false)
                  }}
                >
                  Dodaj srodki
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setIsAccountOpen(true)
                    setIsAddFundsOpen(false)
                    setIsSettingsOpen(false)
                  }}
                >
                  Ustawienia konta
                </button>
              </li>
              <li role="none">
                <button type="button" className="dropdown-item" role="menuitem">
                  Zmien motyw
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="wallet-badge" aria-live="polite">
          <span className="wallet-label">Portfel</span>
          <strong className="wallet-value">${balance}</strong>
        </div>

        <button type="button" className="icon-button" aria-label="Awatar gracza">
          <span aria-hidden="true" className="nav-icon">
            👤
          </span>
        </button>
      </header>

      <h1>Roulette Game</h1>

      {isAddFundsOpen && (
        <section className="top-up-form-card" aria-label="Formularz dodawania srodkow">
          <h2>Dodaj srodki</h2>
          <form className="top-up-form" onSubmit={handleAddFundsSubmit}>
            <div className="form-row">
              <label htmlFor="payment-method">Sposob platnosci</label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option value="card">Karta platnicza</option>
                <option value="blik">BLIK</option>
                <option value="transfer">Przelew bankowy</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="top-up-amount">Kwota</label>
              <input
                id="top-up-amount"
                type="number"
                min="1"
                value={topUpAmount}
                onChange={(event) => setTopUpAmount(Number(event.target.value || 0))}
              />
            </div>

            <div className="form-row">
              <label htmlFor="first-name">Imie</label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="last-name">Nazwisko</label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="billing-address">Adres rozliczeniowy</label>
              <input
                id="billing-address"
                type="text"
                value={billingAddress}
                onChange={(event) => setBillingAddress(event.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setIsAddFundsOpen(false)
                }}
              >
                Anuluj
              </button>
              <button type="submit">Potwierdz i dodaj srodki</button>
            </div>
          </form>
        </section>
      )}

      {isAccountOpen && (
        <section className="account-card" aria-label="Informacje o koncie gracza">
          <h2>Konto gracza</h2>

          <div className="account-grid">
            <article className="account-block">
              <h3>Dane osobowe</h3>
              <p>
                <span>Imie</span>
                <strong>{firstName || 'Jan'}</strong>
              </p>
              <p>
                <span>Nazwisko</span>
                <strong>{lastName || 'Nowak'}</strong>
              </p>
              <p>
                <span>Data urodzenia</span>
                <strong>1995-06-18</strong>
              </p>
            </article>

            <article className="account-block">
              <h3>Kontakt</h3>
              <p>
                <span>Adres email</span>
                <strong>gracz@roulette.com</strong>
              </p>
              <p>
                <span>Numer telefonu</span>
                <strong>+48 500 123 456</strong>
              </p>
              <p>
                <span>Adres zamieszkania</span>
                <strong>{billingAddress || 'ul. Kwiatowa 10, Warszawa'}</strong>
              </p>
            </article>

            <article className="account-block">
              <h3>Bezpieczenstwo</h3>
              <p>
                <span>Status konta</span>
                <strong>Zweryfikowane</strong>
              </p>
              <p>
                <span>2FA</span>
                <strong>Wlaczone</strong>
              </p>
              <p>
                <span>Ostatnie logowanie</span>
                <strong>Dzisiaj, 10:42</strong>
              </p>
            </article>

            <article className="account-block">
              <h3>Pozostale informacje</h3>
              <p>
                <span>Waluta konta</span>
                <strong>PLN</strong>
              </p>
              <p>
                <span>Data rejestracji</span>
                <strong>2024-03-11</strong>
              </p>
              <p>
                <span>Poziom gracza</span>
                <strong>Srebrny</strong>
              </p>
            </article>
          </div>
        </section>
      )}

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
