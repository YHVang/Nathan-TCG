-- =====================================
-- 1. Drop and recreate the database
-- =====================================
DROP DATABASE IF EXISTS tcg_website_db;

CREATE DATABASE tcg_website_db;

-- =====================================
-- 2. Create the app user (if not exists)
-- =====================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_roles WHERE rolname = 'tcg_website_user'
    ) THEN
        CREATE USER tcg_website_user WITH PASSWORD 'password';
    END IF;
END $$;

-- =====================================
-- 3. Grant privileges on the new database
-- =====================================
GRANT CONNECT ON DATABASE tcg_website_db TO tcg_website_user;

-- =====================================
-- 4. Switch to the new database
-- =====================================
\c tcg_website_db

-- =====================================
-- 5. Create the 'cards' table
-- =====================================
DROP TABLE IF EXISTS cards;

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    set_name TEXT NOT NULL,
    number TEXT,
    price NUMERIC(10,2) DEFAULT 0,
    market_price NUMERIC(10,2) DEFAULT 0,
    img TEXT,
    category TEXT
);

-- =====================================
-- 6. Grant full privileges on the table
-- =====================================
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cards TO tcg_website_user;

-- =====================================
-- 7. Insert initial cards
-- =====================================
INSERT INTO cards (name, set_name, number, price, market_price, img, category) VALUES
('Mega Sableye & Tyranitar GX (Secret)', 'Unified Minds', '245 / 236', 53.00, 59.39, '/static/images/mega-sableye-tyranitar.jpg', 'singles'),
('Latias & Latios GX (Alternate Full Art)', 'Darkness Ablaze', '170 / 181', 973.07, 769.81, '/static/images/latias-latios.jpg', 'singles');
