const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const { getPool, initDatabase, DB_NAME } = require('./db');
const { CATEGORY_ORDER } = require('./catalog');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_DIR));

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, 'patacon-pisao-salt', 64, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(derivedKey.toString('hex'));
        });
    });
}

async function comparePassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return crypto.timingSafeEqual(Buffer.from(passwordHash, 'hex'), Buffer.from(hash, 'hex'));
}

function calculateTotal(items) {
    return items.reduce((accumulator, item) => accumulator + Number(item.subtotal || 0), 0);
}

app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        database: DB_NAME
    });
});

app.get('/api/productos', async (req, res) => {
    try {
        const db = getPool();
        const [productos] = await db.query(
            `SELECT id, categoria, nombre, descripcion, precio, imagen, disponible
             FROM productos
             WHERE disponible = 1
             ORDER BY FIELD(categoria, ${CATEGORY_ORDER.map(() => '?').join(', ')}), id ASC`,
            CATEGORY_ORDER
        );

        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'No fue posible consultar los productos.' });
    }
});

app.post('/api/auth/registro', async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        return;
    }

    try {
        const db = getPool();
        const [existingUsers] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            res.status(409).json({ message: 'Ya existe una cuenta con este correo.' });
            return;
        }

        const passwordHash = await hashPassword(password);
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
            [nombre, email, passwordHash]
        );

        res.status(201).json({
            message: 'Registro exitoso.',
            user: {
                id: result.insertId,
                nombre,
                email,
                rol: 'cliente'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'No fue posible registrar el usuario.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Correo y contrasena son obligatorios.' });
        return;
    }

    try {
        const db = getPool();
        const [users] = await db.query(
            'SELECT id, nombre, email, rol, password_hash FROM usuarios WHERE email = ? LIMIT 1',
            [email]
        );

        if (users.length === 0) {
            res.status(401).json({ message: 'Credenciales invalidas.' });
            return;
        }

        const user = users[0];
        const isValid = await comparePassword(password, user.password_hash);

        if (!isValid) {
            res.status(401).json({ message: 'Credenciales invalidas.' });
            return;
        }

        res.json({
            message: 'Inicio de sesion exitoso.',
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'No fue posible iniciar sesion.' });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const db = getPool();
        const [pedidos] = await db.query(`
            SELECT
                p.id,
                p.cliente_nombre,
                p.cliente_email,
                p.cliente_direccion,
                p.cliente_telefono,
                p.estado,
                p.total,
                p.created_at,
                COUNT(d.id) AS items
            FROM pedidos p
            LEFT JOIN pedido_detalles d ON d.pedido_id = p.id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);

        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'No fue posible consultar los pedidos.' });
    }
});

app.post('/api/pedidos', async (req, res) => {
    const {
        usuarioId = null,
        clienteNombre,
        clienteEmail,
        clienteDireccion,
        clienteTelefono,
        observaciones = '',
        items = []
    } = req.body;

    if (!clienteNombre || !clienteEmail || !clienteDireccion || !clienteTelefono || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ message: 'Debes enviar datos del cliente y al menos un producto.' });
        return;
    }

    const productIds = items.map((item) => Number(item.productoId)).filter(Boolean);

    if (productIds.length !== items.length) {
        res.status(400).json({ message: 'Hay productos invalidos en el carrito.' });
        return;
    }

    const db = getPool();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [products] = await connection.query(
            `SELECT id, nombre, precio FROM productos WHERE disponible = 1 AND id IN (${productIds.map(() => '?').join(', ')})`,
            productIds
        );

        if (products.length !== items.length) {
            await connection.rollback();
            res.status(400).json({ message: 'Hay productos invalidos en el carrito.' });
            return;
        }

        const normalizedItems = items.map((item) => {
            const product = products.find((productItem) => productItem.id === Number(item.productoId));
            const cantidad = Number(item.cantidad) || 1;
            const precioUnitario = Number(product.precio);
            const subtotal = cantidad * precioUnitario;

            return {
                productoId: product.id,
                nombre: product.nombre,
                cantidad,
                precioUnitario,
                subtotal
            };
        });

        const total = calculateTotal(normalizedItems);

        const [pedidoResult] = await connection.query(
            `INSERT INTO pedidos
            (usuario_id, cliente_nombre, cliente_email, cliente_direccion, cliente_telefono, observaciones, estado, total)
            VALUES (?, ?, ?, ?, ?, ?, 'recibido', ?)`,
            [usuarioId, clienteNombre, clienteEmail, clienteDireccion, clienteTelefono, observaciones, total]
        );

        for (const item of normalizedItems) {
            await connection.query(
                `INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [pedidoResult.insertId, item.productoId, item.cantidad, item.precioUnitario, item.subtotal]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Pedido registrado correctamente.',
            pedido: {
                id: pedidoResult.insertId,
                estado: 'recibido',
                total,
                items: normalizedItems
            }
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'No fue posible registrar el pedido.' });
    } finally {
        connection.release();
    }
});

app.patch('/api/pedidos/:id/estado', async (req, res) => {
    const { estado } = req.body;
    const allowedStates = ['recibido', 'en_preparacion', 'listo', 'entregado', 'cancelado'];

    if (!allowedStates.includes(estado)) {
        res.status(400).json({ message: 'Estado invalido.' });
        return;
    }

    try {
        const db = getPool();
        const [result] = await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, req.params.id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Pedido no encontrado.' });
            return;
        }

        res.json({ message: 'Estado actualizado.' });
    } catch (error) {
        res.status(500).json({ message: 'No fue posible actualizar el pedido.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

(async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
})();
