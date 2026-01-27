import os
from dotenv import load_dotenv

# Load .env ONLY for local development
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "tcg_website_db")
DB_USER = os.getenv("DB_USER", "tcg_website_user")
DB_PASS = os.getenv("DB_PASS", "password")
DB_PORT = int(os.getenv("DB_PORT", 5432))
