async function insertGame(connection, name, genreId, publisherId) {
  try {
    const [result] = await connection.execute(
      'INSERT INTO juego (nombre, id_genero, id_editorial) VALUES (?, ?, ?)',
      [name, genreId, publisherId]
    );
    return { id: result.insertId, isNew: true };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const [rows] = await connection.execute(
        'SELECT id_juego, id_genero, id_editorial FROM juego WHERE nombre = ?',
        [name]
      );
      const existing = rows[0];
      if (existing.id_genero !== genreId || existing.id_editorial !== publisherId) {
        console.warn(`aviso: "${name}" trae genero/editorial distintos entre filas; se conserva el primero cargado`);
      }
      return { id: existing.id_juego, isNew: false };
    }
    throw error;
  }
}

module.exports = { insertGame };
