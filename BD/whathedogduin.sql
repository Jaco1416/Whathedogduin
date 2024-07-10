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

-- La exportación de datos fue deseleccionada.

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
  `estado_factura` enum('creada','rectificada') DEFAULT 'creada',
  `estado_entrega` varchar(50) DEFAULT 'por entregar',
  `motivo_rechazo` text,
  `direccion_entrega` varchar(255) DEFAULT NULL,
  `rut_receptor` varchar(255) DEFAULT NULL,
  `foto_evidencia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`numero_orden`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf16;

-- La exportación de datos fue deseleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
