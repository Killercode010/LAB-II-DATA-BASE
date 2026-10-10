async function insertAndGetId(connection, table, column, value) {
  try {
    const [result] = await connection.execute(
      `INSERT INTO ${table} (${column}) VALUES (?)`,
      [value]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const [rows] = await connection.execute(
        `SELECT id_${table} AS id FROM ${table} WHERE ${column} = ?`,
        [value]
      );
      return rows[0].id;
    }
    throw error;
  }
}

async function loadCatalogs(connection, rows) {
  const genres = new Set();
  const publishers = new Set();
  const platforms = new Set();

  for (const row of rows) {
    genres.add(row.genre);
    publishers.add(row.publisher);
    platforms.add(row.platform);
  }

  const genreIds = new Map();
  for (const name of genres) {
    genreIds.set(name, await insertAndGetId(connection, 'genero', 'nombre_genero', name));
  }

  const publisherIds = new Map();
  for (const name of publishers) {
    publisherIds.set(name, await insertAndGetId(connection, 'editorial', 'nombre_editorial', name));
  }

  const platformIds = new Map();
  for (const name of platforms) {
    platformIds.set(name, await insertAndGetId(connection, 'plataforma', 'nombre_plataforma', name));
  }

  return { genreIds, publisherIds, platformIds };
}

module.exports = { loadCatalogs };
