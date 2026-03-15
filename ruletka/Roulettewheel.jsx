import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import './RouletteWheel.css';

const data = [
    { option: '0', style: { backgroundColor: 'green', textColor: 'white' } },
    { option: '32', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '15', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '19', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '4', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '21', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '2', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '25', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '17', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '34', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '6', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '27', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '13', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '36', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '11', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '30', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '8', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '23', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '10', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '5', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '24', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '16', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '33', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '1', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '20', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '14', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '31', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '9', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '22', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '18', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '29', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '7', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '28', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '12', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '35', style: { backgroundColor: 'black', textColor: 'white' } },
    { option: '3', style: { backgroundColor: 'red', textColor: 'white' } },
    { option: '26', style: { backgroundColor: 'black', textColor: 'white' } }
];

const RouletteWheel = ({ updateBalance, betAmount, currentBet, betType }) => {
  const [number, setNumber] = useState(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setNumber(null);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    const winningNumber = data[prizeNumber].option;
    setNumber(winningNumber);
    handleBetResult(winningNumber);
  };

  const handleBetResult = (winningNumber) => {
    if (betAmount !== null && betType !== null) {
      if (winningNumber === '0') {
        updateBalance(betAmount * 35); 
      } else if (betType === 'number' && winningNumber === currentBet) {
        updateBalance(betAmount * 2);
      } else if (betType === 'color' && data[prizeNumber].style.backgroundColor === currentBet) {
        updateBalance(betAmount * 2); 
      }
    }
  };

  return (
    <div className="roulette-wheel">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={['#3e3e3e', '#df3428']}
        textColors={['#ffffff']}
        onStopSpinning={handleStopSpinning}
      />
      <button onClick={handleSpinClick}>Spin the Wheel!</button>
      <div>{number !== null ? `Result: ${number}` : "Click to spin"}</div>
    </div>
  );
};
//da
export default RouletteWheel;
