

const express = require('express');
const axios = require('axios');
const net = require('net');

const app = express();

// Enviar registros a Logstash
function enviarLog(datos) {
    const cliente = net.createConnection(
        { host: 'logstash', port: 5000 },
        () => {
            cliente.end(JSON.stringify(datos) + '\n');
        }
    );

    // Evitar que un error de conexión detenga el Gateway
    cliente.on('error', () => {});
}

// Registrar las solicitudes que recibe el Gateway
app.use((req, res, next) => {
    enviarLog({
        servicio: 'gateway',
        mensaje: 'Solicitud recibida',
        metodo: req.method,
        ruta: req.path,
        nivel: 'INFO'
    });

    next();
});

// Redirigir a Users Service
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get(
            'http://user-service:3001/users'
        );
        res.json(response.data);
    } catch (error) {
        enviarLog({
            servicio: 'gateway',
            mensaje: 'Error al consultar Users Service',
            nivel: 'ERROR'
        });
        res.status(500).json({ error: 'Error en Users Service' });
    }
});

// Redirigir a Products Service
app.get('/products', async (req, res) => {
    try {
        const response = await axios.get(
            'http://product-service:3002/products'
        );
        res.json(response.data);
    } catch (error) {
        enviarLog({
            servicio: 'gateway',
            mensaje: 'Error al consultar Products Service',
            nivel: 'ERROR'
        });
        res.status(500).json({ error: 'Error en Products Service' });
    }
});

app.listen(3000, () => {
    console.log('Gateway running on port 3000');
});
