// services/api.js
// All API calls go here. We use axios (instead of fetch) because
// it automatically converts JSON and has cleaner error handling.

import axios from 'axios'

// This free API gives us exchange rates with INR as the base
const EXCHANGE_API = 'https://api.exchangerate-api.com/v4/latest/INR'

// Fetches live exchange rates
// Returns an object like: { USD: 0.012, EUR: 0.011, GBP: 0.0095, ... }
export async function getExchangeRates() {
  const response = await axios.get(EXCHANGE_API)
  return response.data.rates
}
