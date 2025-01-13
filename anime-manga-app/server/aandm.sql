-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           8.0.30 - MySQL Community Server - GPL
-- SO do servidor:               Win64
-- HeidiSQL Versão:              12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- A despejar estrutura para tabela aandm.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `photo` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `bio` text,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela aandm.users: ~0 rows (aproximadamente)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `photo`, `cover_image`, `date_of_birth`, `bio`) VALUES
	(1, 'SlayerX', 'goncalomoreira373@gmail.com', '$2b$10$y0xpjEEAsyJfuxqsuy0EROf.C/bDXXytRT1kfNSgDIEnkEdMnqI9K', '2024-10-24 18:03:26', 'darkknight.png', 'darksect.png', '1999-10-04', 'Somos todos bons '),
	(2, 'padifjsd', 'ss+dopfjsljdn@gmail.com', '$2b$10$7JDgghpOvXGhgBVrbErssuvDnZrQ5YcielZt9ixoN6JqQK8uXzRh.', '2024-10-25 16:59:49', NULL, NULL, NULL, NULL),
	(3, 'admin', 'admin@admin.pt', '$2b$10$EITBlvXnfwYbJpxcu/tjbuV9sI5BBwcxfkViy04hqcR3Q2IhCptBG', '2024-10-26 11:27:36', 'soloweb.jpg', 'GonÃ§alo_Moreira_searching_anime_and_manga_on_monitor_0c71e04d-f178-4831-9fd4-823fef6ff1e8.png', '2024-10-03', 'jhgfdsa');

-- A despejar estrutura para tabela aandm.user_lists
CREATE TABLE IF NOT EXISTS `user_lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `external_id` int NOT NULL,
  `content_type` enum('anime','manga') NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('plan_to_watch','watching','completed','on_hold','dropped') DEFAULT 'plan_to_watch',
  `score` tinyint unsigned DEFAULT NULL,
  `comments` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`external_id`,`content_type`),
  CONSTRAINT `user_lists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- A despejar dados para tabela aandm.user_lists: ~11 rows (aproximadamente)
INSERT INTO `user_lists` (`id`, `user_id`, `external_id`, `content_type`, `added_at`, `status`, `score`, `comments`) VALUES
	(1, 1, 52991, 'anime', '2024-10-28 16:27:56', 'plan_to_watch', NULL, NULL),
	(6, 1, 58224, 'anime', '2024-10-28 16:48:31', 'plan_to_watch', NULL, NULL),
	(7, 3, 52299, 'anime', '2024-10-28 17:00:44', 'plan_to_watch', NULL, NULL),
	(22, 1, 2, 'manga', '2024-10-29 15:35:14', 'plan_to_watch', NULL, NULL),
	(23, 1, 146878, 'manga', '2024-10-29 16:22:44', 'plan_to_watch', NULL, NULL),
	(24, 1, 32281, 'anime', '2024-10-29 16:59:18', 'plan_to_watch', NULL, NULL),
	(25, 1, 49387, 'anime', '2024-10-29 16:59:21', 'plan_to_watch', NULL, NULL),
	(26, 1, 55690, 'anime', '2024-10-29 16:59:23', 'plan_to_watch', NULL, NULL),
	(27, 1, 40028, 'anime', '2024-10-29 16:59:27', 'plan_to_watch', NULL, NULL),
	(31, 1, 121496, 'manga', '2024-10-29 17:25:20', 'plan_to_watch', NULL, NULL),
	(33, 1, 164, 'anime', '2024-11-01 21:45:42', 'plan_to_watch', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
