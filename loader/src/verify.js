const TABLES = ['genero', 'editorial', 'plataforma', 'juego', 'lanzamiento', 'ventas'];

async function printCounts(connection) {
  for (const table of TABLES) {
    const [rows] = await connection.execute(`SELECT COUNT(*) AS total FROM ${table}`);
    console.log(`${table}: ${rows[0].total}`);
  }
}

module.exports = { printCounts };
