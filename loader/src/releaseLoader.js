async function insertRelease(connection, juegoId, platformId, year) {
  try {
    const [result] = await connection.execute(
      'INSERT INTO lanzamiento (id_juego, id_plataforma, anio) VALUES (?, ?, ?)',
      [juegoId, platformId, year]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const [rows] = await connection.execute(
        'SELECT id_lanzamiento FROM lanzamiento WHERE id_juego = ? AND id_plataforma = ?',
        [juegoId, platformId]
      );
      return rows[0].id_lanzamiento;
    }
    throw error;
  }
}

async function insertSales(connection, lanzamientoId, category, amount) {
  if (amount === null) return false;
  await connection.execute(
    'INSERT INTO ventas (id_lanzamiento, categoria_venta, monto) VALUES (?, ?, ?)',
    [lanzamientoId, category, amount]
  );
  return true;
}

module.exports = { insertRelease, insertSales };
