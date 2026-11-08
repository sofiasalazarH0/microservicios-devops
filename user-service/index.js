
const express = require('express');
const net = require('net');

const app = express();

app.use(express.json());

const users = [
    { id: 1, name: "Juan" },
    { id: 2, name: "Ana" }
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

// Obtener usuarios
app.get('/users', (req, res) => {
    enviarLog({
        servicio: 'user-service',
        mensaje: 'Consulta de usuarios',
        metodo: 'GET',
        ruta: '/users',
        nivel: 'INFO'
    });

    res.json(users);
});

// Crear usuario
app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);

    enviarLog({
        servicio: 'user-service',
        mensaje: 'Usuario creado',
        metodo: 'POST',
        ruta: '/users',
        nivel: 'INFO'
    });

    res.json(user);
});

app.listen(3001, () => {
    console.log("Users Service running on port 3001");
});

