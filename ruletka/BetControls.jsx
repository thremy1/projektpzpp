import React, { useState, useEffect } from 'react';
import './BetControls.css';

const BetControls = ({ placeBet, selectedBetValue, updateBalance }) => {
  const [betAmount, setBetAmount] = useState(0);
  const [betType, setBetType] = useState('number');
  const [betValue, setBetValue] = useState('');

  useEffect(() => {
    setBetValue(selectedBetValue);
  }, [selectedBetValue]);

  const handleBetAmountChange = (e) => {
    setBetAmount(e.target.value);
  };

  const handleBetTypeChange = (e) => {
    setBetType(e.target.value);
    setBetValue('');
  };

  const handleBetValueChange = (e) => {
    setBetValue(e.target.value);
  };

  const handleBetSubmit = () => {
    placeBet(Number(betAmount), betType, betValue);
    updateBalance(-Number(betAmount));
  };

  return (
    <div className="bet-controls">
      <h2>Place Your Bet</h2>
      <input
        type="number"
        value={betAmount}
        onChange={handleBetAmountChange}
        placeholder="Bet amount"
      />
      <select value={betType} onChange={handleBetTypeChange}>
        <option value="number">Number</option>
        <option value="color">Color</option>
      </select>
      {betType === 'number' ? (
        <input
          type="number"
          value={betValue}
          onChange={handleBetValueChange}
          placeholder="Enter number (0-36)"
        />
      ) : (
        <select value={betValue} onChange={handleBetValueChange}>
          <option value="">Select color</option>
          <option value="red">Red</option>
          <option value="black">Black</option>
          <option value="green">Green</option>
        </select>
      )}
      <button onClick={handleBetSubmit}>Bet</button>
    </div>
  );
};

export default BetControls;
