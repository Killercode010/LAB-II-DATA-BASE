USE online_game_sales;

-- basica 1: filtrado con dos condiciones
SELECT id_lanzamiento, monto
FROM ventas
WHERE categoria_venta = 'NA' AND monto > 1
ORDER BY monto DESC;

-- basica 2: join entre dos entidades
SELECT j.nombre, g.nombre_genero
FROM juego j
JOIN genero g ON j.id_genero = g.id_genero
ORDER BY j.nombre
LIMIT 20;

-- basica 3: join entre tres o mas entidades
SELECT j.nombre AS juego, p.nombre_plataforma AS plataforma, l.anio
FROM lanzamiento l
JOIN juego j ON l.id_juego = j.id_juego
JOIN plataforma p ON l.id_plataforma = p.id_plataforma
ORDER BY l.anio DESC
LIMIT 20;

-- basica 4: agregacion con group by
SELECT g.nombre_genero, COUNT(*) AS total_juegos
FROM juego j
JOIN genero g ON j.id_genero = g.id_genero
GROUP BY g.nombre_genero
ORDER BY total_juegos DESC;

-- analisis 1: liderazgo de editorial, total vs promedio por juego
SELECT nombre_editorial,
       COUNT(*) AS total_juegos,
       SUM(ventas_juego) AS ventas_totales,
       AVG(ventas_juego) AS promedio_por_juego
FROM (
  SELECT e.nombre_editorial, j.id_juego, SUM(v.monto) AS ventas_juego
  FROM editorial e
  JOIN juego j ON j.id_editorial = e.id_editorial
  JOIN lanzamiento l ON l.id_juego = j.id_juego
  JOIN ventas v ON v.id_lanzamiento = l.id_lanzamiento
  WHERE v.categoria_venta = 'Global'
  GROUP BY e.nombre_editorial, j.id_juego
) AS ventas_por_juego
GROUP BY nombre_editorial
ORDER BY ventas_totales DESC
LIMIT 10;

-- analisis 2: plataforma que concentra mas juegos de un genero despues de un anio
SELECT p.nombre_plataforma, COUNT(*) AS total_juegos
FROM lanzamiento l
JOIN juego j ON j.id_juego = l.id_juego
JOIN genero g ON g.id_genero = j.id_genero
JOIN plataforma p ON p.id_plataforma = l.id_plataforma
WHERE g.nombre_genero = 'Sports' AND l.anio > 2010
GROUP BY p.nombre_plataforma
ORDER BY total_juegos DESC
LIMIT 10;

-- analisis 3: juegos que vendieron mas en japon que en norteamerica
SELECT j.nombre AS juego, p.nombre_plataforma AS plataforma, g.nombre_genero AS genero,
       vna.monto AS ventas_na, vjp.monto AS ventas_jp
FROM lanzamiento l
JOIN juego j ON j.id_juego = l.id_juego
JOIN plataforma p ON p.id_plataforma = l.id_plataforma
JOIN genero g ON g.id_genero = j.id_genero
JOIN ventas vna ON vna.id_lanzamiento = l.id_lanzamiento AND vna.categoria_venta = 'NA'
JOIN ventas vjp ON vjp.id_lanzamiento = l.id_lanzamiento AND vjp.categoria_venta = 'JP'
WHERE vjp.monto > vna.monto
ORDER BY (vjp.monto - vna.monto) DESC
LIMIT 20;

-- analisis 4: genero con mayor promedio de ventas vs genero con mas juegos
SELECT g.nombre_genero,
       COUNT(DISTINCT j.id_juego) AS total_juegos,
       AVG(ventas_juego.total_global) AS promedio_ventas_por_juego
FROM genero g
JOIN juego j ON j.id_genero = g.id_genero
JOIN (
  SELECT l.id_juego, SUM(v.monto) AS total_global
  FROM lanzamiento l
  JOIN ventas v ON v.id_lanzamiento = l.id_lanzamiento
  WHERE v.categoria_venta = 'Global'
  GROUP BY l.id_juego
) AS ventas_juego ON ventas_juego.id_juego = j.id_juego
GROUP BY g.nombre_genero
ORDER BY promedio_ventas_por_juego DESC;


SELECT nombre_editorial,
       COUNT(*) AS total_juegos,
       SUM(ventas_juego) AS ventas_totales,
       AVG(ventas_juego) AS promedio_por_juego
FROM (
  SELECT e.nombre_editorial, j.id_juego, SUM(v.monto) AS ventas_juego
  FROM editorial e
  JOIN juego j ON j.id_editorial = e.id_editorial
  JOIN lanzamiento l ON l.id_juego = j.id_juego
  JOIN ventas v ON v.id_lanzamiento = l.id_lanzamiento
  WHERE v.categoria_venta = 'Global'
  GROUP BY e.nombre_editorial, j.id_juego
) AS t
GROUP BY nombre_editorial
ORDER BY promedio_por_juego DESC
LIMIT 10;