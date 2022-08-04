// code from video https://www.youtube.com/watch?v=MTrj3tNf9jA

import { $fetch } from 'ohmyfetch';
import express from 'express';

const app = express();
const PORT = 5000;

const getCountries = async (currencyCode) => {
  try {
    const response = await $fetch(
      `https://restcountries.com/v3.1/currency/${currencyCode}`,
      { parseResponse: JSON.parse }
    );

    return response.map((country) => country.name.common);
  } catch (error) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const countries = await getCountries(toCurrency);
  // just mock, not real converter
  // !TODO real fetch from exchange api
  const convertedAmount = (amount * 0.96 + Math.random()).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

// convertCurrency('USD', 'CHF', 20)
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// simple api
app.get('/', async (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.query;

  if (!fromCurrency || !toCurrency || !parseInt(amount)) {
    res.status(404).json({ message: 'Missing or wrong parameters' });
  } else {
    const message = await convertCurrency(
      fromCurrency,
      toCurrency,
      parseInt(amount)
    );
    res.json({ message });
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
