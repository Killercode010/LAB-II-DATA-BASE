const { createPool } = require('./db');
const { loadRows } = require('./csvLoader');
const { loadCatalogs } = require('./catalogLoader');
const { insertGame } = require('./gameLoader');
const { insertRelease, insertSales } = require('./releaseLoader');
const { printCounts } = require('./verify');

async function run() {
  const { rows, skipped } = loadRows();
  console.log(`filas validas: ${rows.length}, descartadas en el CSV: ${skipped}`);

  const pool = createPool();
  const connection = await pool.getConnection();
  const gameIds = new Map();
  let errorCount = 0;

  try {
    const { genreIds, publisherIds, platformIds } = await loadCatalogs(connection, rows);

    for (const row of rows) {
      try {
        let juegoId = gameIds.get(row.name);
        if (juegoId === undefined) {
          const game = await insertGame(
            connection,
            row.name,
            genreIds.get(row.genre),
            publisherIds.get(row.publisher)
          );
          juegoId = game.id;
          gameIds.set(row.name, juegoId);
        }

        const lanzamientoId = await insertRelease(
          connection,
          juegoId,
          platformIds.get(row.platform),
          row.year
        );

        const sales = [
          ['NA', row.naSales],
          ['JP', row.jpSales],
          ['Global', row.globalSales],
        ];
        for (const [category, amount] of sales) {
          await insertSales(connection, lanzamientoId, category, amount);
        }
      } catch (error) {
        errorCount += 1;
        console.error(`error al cargar "${row.name}" (${row.platform}): ${error.message}`);
      }
    }

    console.log(`filas con error durante la insercion: ${errorCount}`);
    console.log('conteo final por tabla:');
    await printCounts(connection);
  } finally {
    connection.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error('la carga fallo:', error.message);
  process.exitCode = 1;
});
