const express = require('express');

const app = express();
const PORT = 3000;
const listings = [];

app.use(express.json());

app.get('/', (req, res) => {
  res.send('AgroLink API running');
});

app.post('/listings', (req, res) => {
  const { productName, pricePerKg, quantityKg, cooperativeName } = req.body;

  if (!productName || pricePerKg === undefined || !cooperativeName) {
    return res.status(400).json({
      error:
        'Validation error: productName, pricePerKg, and cooperativeName are required',
    });
  }

  const listing = {
    id: listings.length + 1,
    productName,
    pricePerKg,
    quantityKg: quantityKg ?? 0,
    cooperativeName,
  };

  listings.push(listing);
  return res.status(201).json(listing);
});

app.get('/listings', (req, res) => {
  return res.json(listings);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

