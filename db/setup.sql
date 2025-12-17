-- =====================================
-- 1. Create the database (if not exists)
-- =====================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'tcg_website_db'
    ) THEN
        CREATE DATABASE tcg_website_db;
    END IF;
END $$;

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
-- 3. Give the user privileges
-- =====================================
GRANT CONNECT ON DATABASE tcg_website_db TO tcg_website_user;
-- switch to the new database
\c tcg_website_db


-- =====================================
-- 4. Create the 'cards' table if it doesn't exist
-- =====================================
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    set_name TEXT NOT NULL,
    number TEXT,
    price TEXT,
    market_price TEXT,
    img TEXT,
    category TEXT
);

-- =====================================
-- 5. Give the user full privileges on the table
-- =====================================
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cards TO tcg_website_user;

-- =====================================
-- 6. Optional: insert initial cards
-- =====================================
INSERT INTO cards (name, set_name, number, price, market_price, img, category) VALUES
('Mega Sableye & Tyranitar GX (Secret)', 'Unified Minds', '245 / 236', '$53.00', '$59.39', '/static/images/mega-sableye-tyranitar.jpg', 'singles'),
('Latias & Latios GX (Alternate Full Art)', 'Darkness Ablaze', '170 / 181', '$973.07', '$769.81', '/static/images/latias-latios.jpg', 'singles');
