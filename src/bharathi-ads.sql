CREATE DATABASE IF NOT EXISTS bharathi_ads;
USE bharathi_ads;

-- Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Portraits Table
CREATE TABLE IF NOT EXISTS portraits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) DEFAULT 'Custom',
    description TEXT,
    image_data LONGTEXT, -- Storing base64 images (Note: in production, it's better to store image URLs and save files to a cloud bucket)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
