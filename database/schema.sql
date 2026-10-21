-- RoadVision AI: database schema
-- Create the database, then import this file:
--   CREATE DATABASE smart_pothole_system CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS pothole_reports (
  id            INT(11)      NOT NULL AUTO_INCREMENT,
  image_url     VARCHAR(255) DEFAULT NULL,
  location_name VARCHAR(100) DEFAULT NULL,
  latitude      DOUBLE       DEFAULT NULL,
  longitude     DOUBLE       DEFAULT NULL,
  severity      VARCHAR(50)  DEFAULT NULL,
  detected_time DATETIME     DEFAULT NULL,
  status        VARCHAR(50)  DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
