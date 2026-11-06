CREATE DATABASE IF NOT EXISTS inventario_nova CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventario_nova;
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(24) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX ix_name(name), INDEX ix_category(category)
) ENGINE=InnoDB;
INSERT IGNORE INTO products(id,sku,name,category,price,stock) VALUES
(1,'TEC-001','Laptop Lenovo ThinkPad','Computación',6299.00,18),
(2,'TEC-002','Monitor Samsung 24 pulgadas','Monitores',1299.00,12),
(3,'TEC-003','Mouse Logitech M185','Accesorios',115.00,4),
(4,'TEC-004','Teclado mecánico Redragon','Accesorios',395.00,9),
(5,'TEC-005','Impresora Epson EcoTank','Impresoras',2499.00,3),
(6,'TEC-006','SSD Kingston 1 TB','Almacenamiento',549.00,25),
(7,'TEC-007','Memoria RAM DDR4 16 GB','Componentes',429.00,11),
(8,'TEC-008','Router TP-Link Archer','Redes',339.00,6),
(9,'TEC-009','Webcam Logitech C270','Accesorios',289.00,0),
(10,'TEC-010','Audífonos HyperX Cloud','Audio',799.00,7),
(11,'TEC-011','Hub USB-C 7 en 1','Accesorios',245.00,5),
(12,'TEC-012','UPS Forza 1000 VA','Energía',749.00,8);
