-- Force client encoding to UTF8
SET CLIENT_ENCODING TO 'UTF8';

-- =====================================
-- 1. Create the 'cards' table
-- =====================================
DROP TABLE IF EXISTS cards;

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    set_name TEXT NOT NULL,
    number TEXT,
    quantity INT DEFAULT 1,
    price NUMERIC(10,2) DEFAULT 0,
    market_price NUMERIC(10,2) DEFAULT 0,
    img TEXT,
    category TEXT
);

-- =====================================
-- 2. Grant full privileges on the table
-- =====================================
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cards TO tcg_db_v44i_user;

-- =====================================
-- 3. Grant privileges on the sequence
-- =====================================
GRANT USAGE, SELECT, UPDATE ON SEQUENCE cards_id_seq TO tcg_db_v44i_user;

-- =====================================
-- 4. Insert initial cards
-- =====================================
INSERT INTO cards (name, set_name, number, quantity, price, market_price, img, category) VALUES
('Mega Sableye & Tyranitar GX (Secret)', 'Unified Minds', '245 / 236', 5, 53.00, 59.39, '/static/images/mega-sableye-tyranitar.jpg', 'singles'),
('Latias & Latios GX (Alternate Full Art)', 'Darkness Ablaze', '170 / 181', 3, 973.07, 769.81, '/static/images/latias-latios.jpg', 'singles'),
('Shining Charizard - Neo Destiny (N4)', 'Neo Destiny', '107/105', 2, 699.99, 600.20, '/static/images/shining-charizard.jpg', 'singles'),
('Ancient Origins Elite Trainer Box - XY - Ancient Origins (AOR)', 'XY - Ancient Origins', '-', 1, 3500.00, 4000.00, '/static/images/ancient-origins-etb.jpg', 'boxes'),
('Monkey.D.Luffy (119) (Alternate Art) (Manga)', 'Awakening of the New Era', '119', 1, 12345.67, 3915.86, '/static/images/monkey-luffy.jpg', 'singles'),
('SSB Gogeta, Shining Blue Strongest Warrior (GDR)', 'Ultimate Advent', 'BT26-138', 1, 23000.00, 0.00, '/static/images/ssb-gogeta.jpg', 'singles'),
('FINAL FANTASY - Collector Booster Display Master Case', 'FINAL FANTASY', '-', 1, 28999.00, 0.00, '/static/images/ff-booster-display.jpg', 'boxes');
