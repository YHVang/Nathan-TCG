import os
import psycopg2
from config import DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render / production
    conn = psycopg2.connect(DATABASE_URL)
else:
    # Local development
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )
