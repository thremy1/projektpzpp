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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isRegisterPasswordOpen, setIsRegisterPasswordOpen] = useState(false)
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'light' || stored === 'dark' ? stored : 'dark'
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [topUpAmount, setTopUpAmount] = useState(50)
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('currentUser')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerUsername, setRegisterUsername] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registerBillingAddress, setRegisterBillingAddress] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
  const [registerPasswordError, setRegisterPasswordError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const settingsMenuRef = useRef(null)
  const userMenuRef = useRef(null)

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

  useEffect(() => {
    if (!isUserMenuOpen) return

    const handleOutsideClick = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isUserMenuOpen])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    setIsSettingsOpen(false)
  }

  const handleLogin = () => {
    setIsUserMenuOpen(false)
    setLoginError('')
    setIsLoginOpen(true)
  }

  const handleRegister = () => {
    setIsUserMenuOpen(false)
    setIsRegisterOpen(true)
  }

  const readUsers = () => {
    try {
      const raw = localStorage.getItem('users')
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const writeUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users))
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()

    const identifier = loginIdentifier.trim()
    if (!identifier || !loginPassword) return

    const users = readUsers()
    const found = users.find((user) => {
      const id = identifier.toLowerCase()
      return (
        user.username?.toLowerCase() === id ||
        user.email?.toLowerCase() === id ||
        user.phone?.toLowerCase() === id
      )
    })

    if (!found || found.password !== loginPassword) {
      setLoginError('Nieprawidłowy login lub hasło.')
      return
    }

    const safeUser = {
      firstName: found.firstName,
      lastName: found.lastName,
      username: found.username,
      email: found.email,
      phone: found.phone,
      billingAddress: found.billingAddress,
    }

    setCurrentUser(safeUser)
    localStorage.setItem('currentUser', JSON.stringify(safeUser))
    setIsLoginOpen(false)
    setLoginIdentifier('')
    setLoginPassword('')
    setLoginError('')
  }

  const handleRegisterSubmit = (event) => {
    event.preventDefault()

    if (
      !registerFirstName.trim() ||
      !registerLastName.trim() ||
      !registerUsername.trim() ||
      !registerEmail.trim() ||
      !registerPhone.trim() ||
      !registerBillingAddress.trim()
    ) {
      return
    }

    setRegisterPassword('')
    setRegisterPasswordConfirm('')
    setRegisterPasswordError('')
    setIsRegisterOpen(false)
    setIsRegisterPasswordOpen(true)
  }

  const handleRegisterPasswordSubmit = (event) => {
    event.preventDefault()

    if (!registerPassword || !registerPasswordConfirm) return

    if (registerPassword !== registerPasswordConfirm) {
      setRegisterPasswordError('Hasła muszą być takie same.')
      return
    }

    setRegisterPasswordError('')
    const users = readUsers()
    const nextUser = {
      firstName: registerFirstName.trim(),
      lastName: registerLastName.trim(),
      username: registerUsername.trim(),
      email: registerEmail.trim(),
      phone: registerPhone.trim(),
      billingAddress: registerBillingAddress.trim(),
      password: registerPassword,
    }

    const isDuplicate = users.some((u) => {
      const usernameSame =
        u.username?.toLowerCase() === nextUser.username.toLowerCase()
      const emailSame = u.email?.toLowerCase() === nextUser.email.toLowerCase()
      const phoneSame = u.phone?.toLowerCase() === nextUser.phone.toLowerCase()
      return usernameSame || emailSame || phoneSame
    })

    if (isDuplicate) {
      setRegisterPasswordError('Użytkownik o takich danych już istnieje.')
      return
    }

    writeUsers([...users, nextUser])
    setIsRegisterPasswordOpen(false)

    setIsLoginOpen(true)
    setLoginIdentifier(nextUser.email || nextUser.username || nextUser.phone)
    setLoginPassword('')
    setLoginError('')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    setIsUserMenuOpen(false)
  }

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
            onClick={() => {
              setIsSettingsOpen((prev) => !prev)
              setIsUserMenuOpen(false)
            }}
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
                <button
                  type="button"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={handleToggleTheme}
                >
                  Zmien motyw ({theme === 'dark' ? 'jasny' : 'ciemny'})
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="wallet-badge" aria-live="polite">
          <span className="wallet-label">Portfel</span>
          <strong className="wallet-value">${balance}</strong>
        </div>

        <div className="settings-menu" ref={userMenuRef}>
          <button
            type="button"
            className="icon-button"
            aria-label="Konto"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            onClick={() => {
              setIsUserMenuOpen((prev) => !prev)
              setIsSettingsOpen(false)
            }}
          >
            <span aria-hidden="true" className="nav-icon">
              👤
            </span>
          </button>

          {isUserMenuOpen && (
            <ul className="dropdown-menu" role="menu" aria-label="Menu konta">
              {currentUser ? (
                <li role="none">
                  <button
                    type="button"
                    className="dropdown-item"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Wyloguj się ({currentUser.username})
                  </button>
                </li>
              ) : (
                <>
                  <li role="none">
                    <button
                      type="button"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={handleLogin}
                    >
                      Zaloguj się
                    </button>
                  </li>
                  <li role="none">
                    <button
                      type="button"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={handleRegister}
                    >
                      Zarejestruj się
                    </button>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </header>

      <h1>Roulette Game</h1>

      {isLoginOpen && (
        <section className="auth-overlay" aria-label="Logowanie">
          <div className="auth-card" role="dialog" aria-modal="true" aria-label="Panel logowania">
            <header className="auth-header">
              <h2>Zaloguj się</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Zamknij logowanie"
                onClick={() => setIsLoginOpen(false)}
              >
                ✕
              </button>
            </header>

            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-row">
                <label htmlFor="login-identifier">Email / numer telefonu</label>
                <input
                  id="login-identifier"
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  value={loginIdentifier}
                  onChange={(event) => {
                    setLoginIdentifier(event.target.value)
                    setLoginError('')
                  }}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="login-password">Hasło</label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(event) => {
                    setLoginPassword(event.target.value)
                    setLoginError('')
                  }}
                  required
                />
              </div>

              {loginError && <p className="form-error">{loginError}</p>}

              <div className="form-actions">
                <button type="button" onClick={() => setIsLoginOpen(false)}>
                  Anuluj
                </button>
                <button type="submit">Zaloguj się</button>
              </div>
            </form>
          </div>
        </section>
      )}

      {isRegisterOpen && (
        <section className="auth-overlay" aria-label="Rejestracja">
          <div className="auth-card" role="dialog" aria-modal="true" aria-label="Panel rejestracji">
            <header className="auth-header">
              <h2>Zarejestruj się</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Zamknij rejestrację"
                onClick={() => setIsRegisterOpen(false)}
              >
                ✕
              </button>
            </header>

            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-row">
                <label htmlFor="register-first-name">Imię</label>
                <input
                  id="register-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={registerFirstName}
                  onChange={(event) => setRegisterFirstName(event.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="register-last-name">Nazwisko</label>
                <input
                  id="register-last-name"
                  type="text"
                  autoComplete="family-name"
                  value={registerLastName}
                  onChange={(event) => setRegisterLastName(event.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="register-username">Nazwa użytkownika</label>
                <input
                  id="register-username"
                  type="text"
                  autoComplete="nickname"
                  value={registerUsername}
                  onChange={(event) => setRegisterUsername(event.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="register-phone">Numer telefonu</label>
                <input
                  id="register-phone"
                  type="tel"
                  autoComplete="tel"
                  value={registerPhone}
                  onChange={(event) => setRegisterPhone(event.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="register-billing-address">Adres rozliczeniowy</label>
                <input
                  id="register-billing-address"
                  type="text"
                  autoComplete="street-address"
                  value={registerBillingAddress}
                  onChange={(event) => setRegisterBillingAddress(event.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setIsRegisterOpen(false)}>
                  Anuluj
                </button>
                <button type="submit">Dalej</button>
              </div>
            </form>
          </div>
        </section>
      )}

      {isRegisterPasswordOpen && (
        <section className="auth-overlay" aria-label="Ustaw hasło">
          <div className="auth-card" role="dialog" aria-modal="true" aria-label="Ustaw hasło">
            <header className="auth-header">
              <h2>Ustaw hasło</h2>
              <button
                type="button"
                className="icon-button"
                aria-label="Zamknij ustawianie hasła"
                onClick={() => setIsRegisterPasswordOpen(false)}
              >
                ✕
              </button>
            </header>

            <form className="auth-form" onSubmit={handleRegisterPasswordSubmit}>
              <div className="form-row">
                <label htmlFor="register-password">Hasło</label>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  value={registerPassword}
                  onChange={(event) => {
                    setRegisterPassword(event.target.value)
                    setRegisterPasswordError('')
                  }}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="register-password-confirm">Potwierdź hasło</label>
                <input
                  id="register-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={registerPasswordConfirm}
                  onChange={(event) => {
                    setRegisterPasswordConfirm(event.target.value)
                    setRegisterPasswordError('')
                  }}
                  required
                />
              </div>

              {registerPasswordError && <p className="form-error">{registerPasswordError}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterPasswordOpen(false)
                    setIsRegisterOpen(true)
                  }}
                >
                  Wstecz
                </button>
                <button type="submit">Zatwierdź</button>
              </div>
            </form>
          </div>
        </section>
      )}

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
                <strong>{currentUser?.firstName || '—'}</strong>
              </p>
              <p>
                <span>Nazwisko</span>
                <strong>{currentUser?.lastName || '—'}</strong>
              </p>
              <p>
                <span>Data urodzenia</span>
                <strong>—</strong>
              </p>
            </article>

            <article className="account-block">
              <h3>Kontakt</h3>
              <p>
                <span>Adres email</span>
                <strong>{currentUser?.email || '—'}</strong>
              </p>
              <p>
                <span>Numer telefonu</span>
                <strong>{currentUser?.phone || '—'}</strong>
              </p>
              <p>
                <span>Adres rozliczeniowy</span>
                <strong>{currentUser?.billingAddress || '—'}</strong>
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
