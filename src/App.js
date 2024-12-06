import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    // Fetch available currencies from the API
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      .then((response) => {
        setCurrencies(Object.keys(response.data.rates));
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      // Fetch exchange rates when either from or to currency changes
      axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then((response) => {
          const rate = response.data.rates[toCurrency];
          setExchangeRate(rate);
          setConvertedAmount(amount * rate);
        });
    }
  }, [fromCurrency, toCurrency, amount]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Currency Converter</h1>
      <div className="converter-container">
        <div className="converter-box">
          <div className="currency-selector">
            <input 
              type="number" 
              value={amount} 
              onChange={handleAmountChange} 
              className="amount-input" 
            />
            <select onChange={handleFromCurrencyChange} value={fromCurrency} className="currency-select">
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <span className="arrow">⇌</span>

          <div className="currency-selector">
            <input 
              type="text" 
              value={convertedAmount ? convertedAmount.toFixed(2) : ''} 
              readOnly 
              className="amount-input" 
            />
            <select onChange={handleToCurrencyChange} value={toCurrency} className="currency-select">
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {convertedAmount && (
          <div className="result-box">
            <p className="result-text">
              {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
