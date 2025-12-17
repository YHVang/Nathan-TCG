INSERT INTO cards (name, set_name, number, price, market_price, img, category)
VALUES (%(name)s, %(set_name)s, %(number)s, %(price)s, %(market_price)s, %(img)s, %(category)s)
RETURNING id;
