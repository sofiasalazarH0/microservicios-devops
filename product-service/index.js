const express = require('express');
const app = express();

app.use(express.json());

const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Mouse" }
];

// Obtener productos
app.get('/products', (req, res) => {
    res.json(products);
});

app.listen(3002, () => {
    console.log("Products Service running on port 3002");
});
