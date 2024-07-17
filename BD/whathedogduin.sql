-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para whathedogduin
CREATE DATABASE IF NOT EXISTS `whathedogduin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `whathedogduin`;

-- Volcando estructura para tabla whathedogduin.empresa
CREATE TABLE IF NOT EXISTS `empresa` (
  `RUT` varchar(10) NOT NULL,
  `PASSWORD` varchar(20) NOT NULL,
  `NOMBRE` varchar(100) NOT NULL,
  `DIRECCION` varchar(100) NOT NULL,
  `TELEFONO` varchar(100) NOT NULL,
  `SITIO_WEB` varchar(100) DEFAULT NULL,
  `TIPO_SERVICIO` varchar(100) DEFAULT NULL,
  `EMAIL` varchar(100) NOT NULL,
  PRIMARY KEY (`RUT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla whathedogduin.empresa: ~0 rows (aproximadamente)
DELETE FROM `empresa`;
INSERT INTO `empresa` (`RUT`, `PASSWORD`, `NOMBRE`, `DIRECCION`, `TELEFONO`, `SITIO_WEB`, `TIPO_SERVICIO`, `EMAIL`) VALUES
	('21564842-7', '123456789', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'www.ola.cl', 'Scorts', 'joaquin@gmail.com');

-- Volcando estructura para tabla whathedogduin.facturas
CREATE TABLE IF NOT EXISTS `facturas` (
  `numero_orden` int NOT NULL AUTO_INCREMENT,
  `fecha_orden` date DEFAULT NULL,
  `rut_proveedor` varchar(255) DEFAULT NULL,
  `razon_social_proveedor` varchar(255) DEFAULT NULL,
  `direccion_proveedor` varchar(255) DEFAULT NULL,
  `telefono_proveedor` varchar(15) DEFAULT NULL,
  `correo_proveedor` varchar(255) DEFAULT NULL,
  `sitio_web_proveedor` varchar(255) DEFAULT NULL,
  `tipo_servicio` varchar(255) DEFAULT NULL,
  `rut_cliente` varchar(255) DEFAULT NULL,
  `nombre_cliente` varchar(255) DEFAULT NULL,
  `direccion_cliente` varchar(255) DEFAULT NULL,
  `telefono_cliente` varchar(15) DEFAULT NULL,
  `correo_cliente` varchar(255) DEFAULT NULL,
  `subtotal` int DEFAULT NULL,
  `iva` int DEFAULT NULL,
  `total` int DEFAULT NULL,
  `productos` json DEFAULT NULL,
  `regionDespacho` varchar(90) DEFAULT NULL,
  `comunaDespacho` varchar(90) DEFAULT NULL,
  `direccionDespacho` varchar(90) DEFAULT NULL,
  `fechaDespacho` date DEFAULT NULL,
  `estado_factura` varchar(50) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT 'creada',
  `estado_entrega` varchar(50) DEFAULT 'por entregar',
  `motivo_rechazo` text,
  `direccion_entrega` varchar(255) DEFAULT NULL,
  `rut_receptor` varchar(255) DEFAULT NULL,
  `foto_evidencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`numero_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf16;

-- Volcando datos para la tabla whathedogduin.facturas: ~5 rows (aproximadamente)
DELETE FROM `facturas`;
INSERT INTO `facturas` (`numero_orden`, `fecha_orden`, `rut_proveedor`, `razon_social_proveedor`, `direccion_proveedor`, `telefono_proveedor`, `correo_proveedor`, `sitio_web_proveedor`, `tipo_servicio`, `rut_cliente`, `nombre_cliente`, `direccion_cliente`, `telefono_cliente`, `correo_cliente`, `subtotal`, `iva`, `total`, `productos`, `regionDespacho`, `comunaDespacho`, `direccionDespacho`, `fechaDespacho`, `estado_factura`, `estado_entrega`, `motivo_rechazo`, `direccion_entrega`, `rut_receptor`, `foto_evidencia`) VALUES
	(1, '2024-07-04', '21564842-7', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'joaquin@gmail.com', 'www.ola.cl', 'Scorts', '12123123-5', 'Angel', 'Del jornalero2969', '229993862', 'asdasdsad@duoc.cl', 121312, 23049, 123617, '[{"total": 121312, "nombre": "asdsd", "precio": "121312", "cantidad": "1"}]', 'Metropolitana de Santiago', 'puente alto', 'Del jornalero2969', '2024-08-02', 'rectificada', 'aceptado', '', 'Del jornalero 2969', '21564842-7', NULL),
	(2, '2024-07-16', '21564842-7', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'joaquin@gmail.com', 'www.ola.cl', 'Scorts', '25456456-7', 'baltazar', 'Del jornalero2969', '229993862', 'asdasdsad@duoc.cl', 14000, 2660, 14950, '[{"total": 4000, "nombre": "aloaasdasdasd", "precio": "2000", "cantidad": "2"}, {"total": 10000, "nombre": "aaaaaa", "precio": "10000", "cantidad": "1"}]', 'Region3', 'Viña del Mar', 'Del jornalero2969', '2024-07-24', 'anulada', 'rechazado', NULL, '', '', NULL),
	(3, '2024-07-16', '21564842-7', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'joaquin@gmail.com', 'www.ola.cl', 'Scorts', '21564842-7', 'Joaquin Galarce', 'Del ola 321', '229993862', 'asdasdsad@duoc.cl', 10000, 1900, 10000, '[{"total": 10000, "nombre": "asdasdasd", "precio": "10000", "cantidad": "1"}]', 'Region1', 'Maipú', 'Del ola 321', '2024-08-10', 'rectificada', 'rechazado', NULL, 'Del jornalero 2969', '21564842-8', 'glep.jpg'),
	(4, '2024-07-16', '21564842-7', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'joaquin@gmail.com', 'www.ola.cl', 'Scorts', '12123123-4', 'asdasddas', 'asdasddsasdasd', '12341234', 'asdasdsad@duoc.cl', 2000, 380, 2038, '[{"total": 2000, "nombre": "aloaasdasdasd", "precio": "2000", "cantidad": "1"}]', 'Region1', 'Maipú', 'asdasdds', '2024-08-01', 'creada', 'por entregar', NULL, NULL, NULL, NULL),
	(5, '2024-07-16', '21564842-7', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'joaquin@gmail.com', 'www.ola.cl', 'Scorts', '21564842-7', 'Joaquin Galarce', 'Del ola 321', '229993862', 'asdasdsad@duoc.cl', 10000, 1900, 10000, '[{"total": 10000, "nombre": "asdasdasd", "precio": "10000", "cantidad": "1"}]', 'Region1', 'Maipú', 'Del ola 321', '2024-08-10', 'rectificada', 'rechazado', NULL, 'Del jornalero 2969', '21564842-8', 'glep.jpg'),
	(6, '2024-07-16', '21564842-7', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'joaquin@gmail.com', 'www.ola.cl', 'Scorts', '21563777-8', 'Angel', 'Del jornalero2969', '229993862', 'asdasdsad@duoc.cl', 20000, 3800, 20380, '[{"total": 20000, "nombre": "producto 2222", "precio": "10000", "cantidad": "2"}]', 'Región de Arica y Parinacota', 'General Lagos', 'Del jornalero2969', '2024-07-19', 'creada', 'por entregar', NULL, NULL, NULL, NULL),
	(7, '2024-07-16', '21564842-7', 'joaquin', 'calle falsa 321', '+56 9 99999999', 'joaquin@gmail.com', 'www.ola.cl', 'Scorts', '21564842-7', 'alvaro', 'Calle bonita 321', '99999999', 'asdasdsad@duoc.cl', 12000, 2280, 12228, '[{"total": 12000, "nombre": "aloaasdasdasd", "precio": "12000", "cantidad": "1"}]', 'Región de Antofagasta', 'Calama', 'Calle fea 321', '2024-07-24', 'creada', 'por entregar', NULL, NULL, NULL, NULL);

-- Volcando estructura para tabla whathedogduin.rechazos
CREATE TABLE IF NOT EXISTS `rechazos` (
  `id_rechazo` int NOT NULL AUTO_INCREMENT,
  `numero_orden` int NOT NULL,
  `fecha_rechazo` date NOT NULL,
  `motivo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id_rechazo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla whathedogduin.rechazos: ~7 rows (aproximadamente)
DELETE FROM `rechazos`;
INSERT INTO `rechazos` (`id_rechazo`, `numero_orden`, `fecha_rechazo`, `motivo`) VALUES
	(1, 1, '2024-07-09', 'asdasdasdasdasdasdasd'),
	(2, 1, '2024-07-09', 'Rechazada porque si'),
	(3, 1, '2024-07-09', 'Rechazada porque si'),
	(4, 1, '2024-07-09', 'Rechazau'),
	(5, 1, '2024-07-09', 'rechazo  923232'),
	(6, 1, '2024-07-09', ''),
	(7, 1, '2024-07-09', '');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
