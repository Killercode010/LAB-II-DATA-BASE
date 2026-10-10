CREATE DATABASE IF NOT EXISTS online_game_sales
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE online_game_sales;

CREATE TABLE genero (
  id_genero INT AUTO_INCREMENT PRIMARY KEY,
  nombre_genero VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE editorial (
  id_editorial INT AUTO_INCREMENT PRIMARY KEY,
  nombre_editorial VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE plataforma (
  id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
  nombre_plataforma VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE juego (
  id_juego INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL UNIQUE,
  id_genero INT NOT NULL,
  id_editorial INT NOT NULL,
  FOREIGN KEY (id_genero) REFERENCES genero(id_genero),
  FOREIGN KEY (id_editorial) REFERENCES editorial(id_editorial)
);

CREATE TABLE lanzamiento (
  id_lanzamiento INT AUTO_INCREMENT PRIMARY KEY,
  id_juego INT NOT NULL,
  id_plataforma INT NOT NULL,
  anio YEAR NOT NULL,
  FOREIGN KEY (id_juego) REFERENCES juego(id_juego),
  FOREIGN KEY (id_plataforma) REFERENCES plataforma(id_plataforma),
  UNIQUE (id_juego, id_plataforma)
);

CREATE TABLE ventas (
  id_lanzamiento INT NOT NULL,
  categoria_venta ENUM('NA', 'JP', 'Global') NOT NULL,
  monto DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (id_lanzamiento, categoria_venta),
  FOREIGN KEY (id_lanzamiento) REFERENCES lanzamiento(id_lanzamiento)
    ON DELETE CASCADE
);
