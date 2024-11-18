// app.js
const express = require('express');
const bodyParser = require('body-parser');
const carsRoutes = require('./routes/carRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(carsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});