
import React, { useState } from 'react';
import RouletteWheel from './components/RouletteWheel';
import BetControls from './components/BetControls';
import RecentResults from './components/RecentResults';

const App = () => {
  const [currentBet, setCurrentBet] = useState(null);
  const [balance, setBalance] = useState(1000);
  const [betType, setBetType] = useState(null);
  const [betValue, setBetValue] = useState(null);
  const [betAmount, setBetAmount] = useState(null);
  const [results, setResults] = useState([]);

  const placeBet = (bet, type, value) => {
    if (bet <= balance) {
      setCurrentBet(value);
      setBetType(type);
      setBetValue(value);
      setBetAmount(bet); 
      console.log(`Bet placed: ${bet} on ${type} ${value}`);
      updateBalance(-bet);
    } else {
      alert("You don't have enough balance to place this bet.");
    }
  };

  const updateBalance = (amount) => {
    setBalance(balance + amount);
  };

  const handleSpinEnd = (result) => {
    setResults((prevResults) => {
      const newResults = [result, ...prevResults];
      return newResults.slice(0, 5);
    });
  };

  return (
    <div className="App">
      <h1>Roulette Game</h1>
      <p>Your current balance: {balance}$</p>
      <RouletteWheel updateBalance={updateBalance} betAmount={betAmount} currentBet={currentBet} betType={betType} onSpinEnd={handleSpinEnd} />
      <BetControls placeBet={placeBet} selectedBetValue={betValue} updateBalance={updateBalance} balance={balance} />
      {currentBet !== null && betType !== null && <p>Your current bet: {betAmount} $ on {betType} {betValue}</p>}
      <RecentResults results={results} />
    </div>
  );
};

export default App;
