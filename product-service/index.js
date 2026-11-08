
const express = require('express');
const net = require('net');

const app = express();

app.use(express.json());

const products = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Mouse" }
];

// Enviar registros a Logstash
function enviarLog(datos) {
    const cliente = net.createConnection(
        { host: 'logstash', port: 5000 },
        () => {
            cliente.end(JSON.stringify(datos) + '\n');
        }
    );

    cliente.on('error', () => {});
}

// Obtener productos
app.get('/products', (req, res) => {
    enviarLog({
        servicio: 'product-service',
        mensaje: 'Consulta de productos',
        metodo: 'GET',
        ruta: '/products',
        nivel: 'INFO'
    });

    res.json(products);
});

app.listen(3002, () => {
    console.log("Products Service running on port 3002");
});
