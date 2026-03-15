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

