const express = require('express');
const app = express();

app.use(express.json());

const users = [
    { id: 1, name: "Juan" },
    { id: 2, name: "Ana" }
];

// Obtener usuarios
app.get('/users', (req, res) => {
    res.json(users);
});

// Crear usuario
app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.json(user);
});

app.listen(3001, () => {
    console.log("Users Service running on port 3001");
});
