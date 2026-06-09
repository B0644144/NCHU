export async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) return 1.0;
  
  try {
    const response = await fetch(`https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`);
    if (!response.ok) throw new Error('Failed to fetch exchange rate');
    const data = await response.json();
    return data.rates[toCurrency] || 1.0;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Fallback to 1.0 if API fails
    return 1.0;
  }
}
