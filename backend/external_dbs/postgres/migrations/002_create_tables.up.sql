-- Create admins table
CREATE TABLE admins (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in millimes (1 TND = 1000 millimes)
  image_url TEXT,
  video_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  governorate VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  product_id BIGINT REFERENCES products(id),
  product_price INTEGER NOT NULL,
  shipping_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
  id BIGSERIAL PRIMARY KEY,
  shipping_price INTEGER DEFAULT 8000, -- 8 TND in millimes
  product_price INTEGER DEFAULT 99000, -- 99 TND in millimes
  facebook_pixel_id VARCHAR(255),
  google_analytics_id VARCHAR(255),
  google_ads_id VARCHAR(255),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin (username: admin, password: admin123)
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2b$10$J4pHJ.DzOUHN.hG4dXZR5eP7fZKlJZKlJZKlJZKlJZKlJZKlJZKlJa');

-- Insert default mystery box product
INSERT INTO products (name, slug, description, price) 
VALUES (
  'Mystery Box - Découvrez la surprise !',
  'mystery-box',
  'Une boîte mystère pleine de surprises d''une valeur supérieure au prix d''achat',
  99000
);

-- Insert default settings
INSERT INTO settings (shipping_price, product_price) 
VALUES (8000, 99000);
