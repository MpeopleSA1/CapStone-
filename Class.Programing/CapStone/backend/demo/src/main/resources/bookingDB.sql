-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS BookingDB;
USE BookingDB;

-- =====================================================
-- USERS TABLE
-- =====================================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
                       id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
                          id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                          customer_name VARCHAR(255) NOT NULL,
                          date DATE NOT NULL,
                          seats INTEGER NOT NULL,
                          status VARCHAR(50) DEFAULT 'PENDING',
                          notes TEXT,
                          user_id BIGINT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraint
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    -- Indexes for better performance
                          INDEX idx_user_id (user_id),
                          INDEX idx_date (date),
                          INDEX idx_status (status),
                          INDEX idx_customer_name (customer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




-- Check foreign key constraints
SELECT
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'BookingDB'
  AND TABLE_NAME = 'bookings'
  AND REFERENCED_TABLE_NAME IS NOT NULL;