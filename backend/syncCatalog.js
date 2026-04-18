const { initDatabase, getPool } = require('./db');

(async () => {
    try {
        await initDatabase();
        const db = getPool();
        const [rows] = await db.query(
            'SELECT categoria, COUNT(*) AS total FROM productos WHERE disponible = 1 GROUP BY categoria ORDER BY categoria'
        );
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('No fue posible sincronizar el catalogo:', error.message);
        process.exit(1);
    }
})();
