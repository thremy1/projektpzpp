import './BetControls.css'

function BetControls({
  betType,
  setBetType,
  betValue,
  setBetValue,
  betAmount,
  setBetAmount,
  canSpin,
  onSpin,
}) {
  return (
    <section className="bet-controls">
      <div className="control-row">
        <label htmlFor="bet-amount">Kwota zakladu</label>
        <input
          id="bet-amount"
          type="number"
          min="1"
          value={betAmount}
          onChange={(event) => setBetAmount(Number(event.target.value || 0))}
        />
      </div>

      <div className="control-row">
        <label htmlFor="bet-type">Typ zakladu</label>
        <select
          id="bet-type"
          value={betType}
          onChange={(event) => setBetType(event.target.value)}
        >
          <option value="number">Numer (x36)</option>
          <option value="red">Czerwony (x2)</option>
          <option value="black">Czarny (x2)</option>
        </select>
      </div>

      {betType === 'number' && (
        <div className="control-row">
          <label htmlFor="bet-number">Numer (0-36)</label>
          <input
            id="bet-number"
            type="number"
            min="0"
            max="36"
            value={betValue}
            onChange={(event) => setBetValue(Number(event.target.value || 0))}
          />
        </div>
      )}

      <button type="button" onClick={onSpin} disabled={!canSpin}>
        Zakrec ruletka
      </button>
    </section>
  )
}

export default BetControls
