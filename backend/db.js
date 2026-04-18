const mysql = require('mysql2/promise');
const { PRODUCT_CATALOG } = require('./catalog');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'patacon_pisao';

let pool;

function catalogKey(categoria, nombre) {
    return `${String(categoria).trim().toLowerCase()}::${String(nombre).trim().toLowerCase()}`;
}

async function ensureDatabase() {
    const connection = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.end();
}

function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    return pool;
}

async function ensureProductSchema(db) {
    const [categoryColumn] = await db.query("SHOW COLUMNS FROM productos LIKE 'categoria'");

    if (categoryColumn.length === 0) {
        await db.query("ALTER TABLE productos ADD COLUMN categoria VARCHAR(100) NOT NULL DEFAULT 'General' AFTER nombre");
    }
}

async function syncCatalog() {
    const db = getPool();
    await ensureProductSchema(db);

    const [existingProducts] = await db.query('SELECT id, categoria, nombre FROM productos');
    const existingByKey = new Map(
        existingProducts.map((product) => [catalogKey(product.categoria, product.nombre), product])
    );
    const currentCatalogKeys = new Set();

    for (const product of PRODUCT_CATALOG) {
        const key = catalogKey(product.categoria, product.nombre);
        currentCatalogKeys.add(key);

        if (existingByKey.has(key)) {
            const current = existingByKey.get(key);
            await db.query(
                `UPDATE productos
                 SET categoria = ?, nombre = ?, descripcion = ?, precio = ?, imagen = ?, disponible = 1
                 WHERE id = ?`,
                [product.categoria, product.nombre, product.descripcion, product.precio, product.imagen, current.id]
            );
            continue;
        }

        await db.query(
            `INSERT INTO productos (categoria, nombre, descripcion, precio, imagen, disponible)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [product.categoria, product.nombre, product.descripcion, product.precio, product.imagen]
        );
    }

    const productsToHide = existingProducts
        .filter((product) => !currentCatalogKeys.has(catalogKey(product.categoria, product.nombre)))
        .map((product) => product.id);

    if (productsToHide.length > 0) {
        await db.query(
            `UPDATE productos SET disponible = 0 WHERE id IN (${productsToHide.map(() => '?').join(', ')})`,
            productsToHide
        );
    }

    await db.query(`
        DELETE productos
        FROM productos
        LEFT JOIN pedido_detalles ON pedido_detalles.producto_id = productos.id
        WHERE productos.disponible = 0 AND pedido_detalles.id IS NULL
    `);
}

async function initDatabase() {
    await ensureDatabase();

    const db = getPool();

    await db.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(120) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS productos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(120) NOT NULL,
            categoria VARCHAR(100) NOT NULL DEFAULT 'General',
            descripcion TEXT,
            precio DECIMAL(10,2) NOT NULL,
            imagen VARCHAR(255),
            disponible TINYINT(1) NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS pedidos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NULL,
            cliente_nombre VARCHAR(120) NOT NULL,
            cliente_email VARCHAR(150) NOT NULL,
            cliente_direccion VARCHAR(255) NOT NULL,
            cliente_telefono VARCHAR(50) NOT NULL,
            observaciones TEXT,
            estado ENUM('recibido', 'en_preparacion', 'listo', 'entregado', 'cancelado') NOT NULL DEFAULT 'recibido',
            total DECIMAL(10,2) NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
        )
    `);

    await db.query(`
        CREATE TABLE IF NOT EXISTS pedido_detalles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            pedido_id INT NOT NULL,
            producto_id INT NOT NULL,
            cantidad INT NOT NULL DEFAULT 1,
            precio_unitario DECIMAL(10,2) NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
            CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
        )
    `);

    await syncCatalog();
}

module.exports = {
    DB_NAME,
    getPool,
    initDatabase,
    syncCatalog
};
