import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render / production
    DB_CONFIG = DATABASE_URL
else:
    # Local
    DB_CONFIG = {
        "host": os.getenv("DB_HOST", "localhost"),
        "dbname": os.getenv("DB_NAME", "tcg_website_db"),
        "user": os.getenv("DB_USER", "tcg_website_user"),
        "password": os.getenv("DB_PASS", "password"),
        "port": int(os.getenv("DB_PORT", 5432)),
    }
