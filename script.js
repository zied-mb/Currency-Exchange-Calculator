// Fetch exchange rates and convert currencies
const API_KEY = "YOUR_API_KEY";
let exchangeRates = {};

async function fetchExchangeRates() {
  try {
    const response = await fetch(`https://api.apilayer.com/exchangerates_data/latest?apikey=${API_KEY}`);
    const data = await response.json();
    exchangeRates = data.rates;
    document.getElementById('last-updated').textContent = `Rates updated on: ${new Date(data.date).toDateString()}`;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    document.getElementById('result').textContent = "Unable to retrieve live rates. Please check your internet connection.";
  }
}

async function calculateExchange() {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;
  const resultElement = document.getElementById('result');

  if (!amount || amount <= 0) {
    resultElement.textContent = "Please enter a valid amount.";
    return;
  }

  if (!exchangeRates[fromCurrency]) {
    await fetchExchangeRates(); // Fetch rates if not already available
  }

  if (fromCurrency === toCurrency) {
    resultElement.textContent = `Converted amount: ${amount.toFixed(2)} ${toCurrency}`;
    return;
  }

  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];

  if (!fromRate || !toRate) {
    resultElement.textContent = "Exchange rate not available for this currency pair.";
    return;
  }

  const convertedAmount = ((amount / fromRate) * toRate).toFixed(2);
  resultElement.textContent = `Converted amount: ${convertedAmount} ${toCurrency}`;
}

// Fetch rates on page load
fetchExchangeRates();
