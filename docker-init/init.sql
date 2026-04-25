CREATE DATABASE IF NOT EXISTS vulnerable_app;
USE vulnerable_app;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10, 2)
);

-- Create users table (for UNION-based extraction)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100)
);

-- Insert sample products
INSERT INTO products (name, description, price) VALUES
('Laptop', 'High performance laptop with 16GB RAM', 999.99),
('Desktop PC', 'Gaming desktop computer', 1299.99),
('Keyboard', 'Mechanical RGB keyboard', 89.99),
('Mouse', 'Wireless gaming mouse', 49.99),
('Monitor', '4K UHD monitor 27 inch', 399.99),
('Headphones', 'Noise cancelling headphones', 199.99);

-- Insert sample users (for extraction practice)
INSERT INTO users (username, password, email) VALUES
('admin', 'Admin@1234!Secure', 'admin@vulnerable.local'),
('john_doe', 'SecurePass123!', 'john@vulnerable.local'),
('jane_smith', 'MyPassword456!', 'jane@vulnerable.local'),
('root', 'RootPassword789!', 'root@vulnerable.local');

COMMIT;