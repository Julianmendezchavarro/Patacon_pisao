const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./db');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/pedido', (req, res) => {
    const { total } = req.body;

    db.query(
        'INSERT INTO pedidos (estado, total) VALUES (?, ?)',
        ['recibido', total],
        (err, result) => {
            if (err) throw err;
            res.json({ mensaje: 'Pedido creado' });
        }
    );
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
