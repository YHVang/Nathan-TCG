import os
from flask import Flask, render_template, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import config
from werkzeug.utils import secure_filename

app = Flask(__name__)

# -----------------------------
# Upload configuration
# -----------------------------
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024  # 2MB max upload

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
ALLOWED_MIME_TYPES = {"image/png", "image/jpeg", "image/gif"}


def allowed_file(file):
    return (
        "." in file.filename
        and file.filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
        and file.mimetype in ALLOWED_MIME_TYPES
    )


# -----------------------------
# Routes
# -----------------------------
@app.route("/")
def home():
    cards = load_cards_from_db()
    return render_template("index.html", cards_json=cards)


@app.route("/home")
def main():
    cards = load_cards_from_db()
    return render_template("home.html", cards_json=cards)


@app.route("/admin")
def admin():
    cards = load_cards_from_db()
    return render_template("admin.html", cards_json=cards)


@app.route("/admin/add_card", methods=["POST"])
def add_card():
    # JSON (image URL only)
    if request.content_type.startswith("application/json"):
        card = request.get_json()
        if not card:
            return jsonify({"success": False, "error": "No card data provided"}), 400
        img_path = card.get("img", "")

    # multipart/form-data (file upload)
    else:
        card = request.form.to_dict()
        file = request.files.get("image_file")

        if file and allowed_file(file):
            filename = secure_filename(file.filename)
            save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(save_path)
            img_path = f"/static/uploads/{filename}"
        else:
            img_path = card.get("image_url", "")

    number = card.get("number") or None

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO cards (name, set_name, number, price, market_price, img, category)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
            """,
            (
                card.get("name"),
                card.get("set_name"),
                number,
                float(card.get("price", 0)),
                float(card.get("market_price", 0)),
                img_path,
                card.get("category", "all"),
            ),
        )

        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify(
            {
                "success": True,
                "card": {
                    "id": new_id,
                    "name": card.get("name"),
                    "set_name": card.get("set_name"),
                    "number": number,
                    "price": float(card.get("price", 0)),
                    "market_price": float(card.get("market_price", 0)),
                    "category": card.get("category", "all"),
                    "img": img_path,
                },
            }
        )

    except Exception as e:
        print("DB insert failed:", e)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/admin/delete_card", methods=["POST"])
def delete_card():
    data = request.get_json()
    card_id = data.get("id")

    if not card_id:
        return jsonify({"success": False, "error": "No card ID provided"}), 400

    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Fetch image path first
        cur.execute("SELECT img FROM cards WHERE id = %s;", (card_id,))
        card = cur.fetchone()

        if not card:
            return jsonify({"success": False, "error": "Card not found"}), 404

        img_path = card["img"]

        # Delete card
        cur.execute("DELETE FROM cards WHERE id = %s;", (card_id,))
        conn.commit()

        # Delete uploaded image file (only if local)
        if img_path and img_path.startswith("/static/uploads/"):
            file_path = os.path.join(
                os.path.dirname(__file__), img_path.lstrip("/")
            )
            if os.path.exists(file_path):
                os.remove(file_path)

        cur.close()
        conn.close()

        return jsonify({"success": True, "id": card_id})

    except Exception as e:
        print("Failed to delete card:", e)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/item")
def item():
    card_id = request.args.get("id")

    if not card_id:
        return "Missing card ID", 400

    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM cards WHERE id = %s", (card_id,))
        card = cur.fetchone()
        cur.close()
        conn.close()

        if not card:
            return "Item not found", 404

        return render_template("item.html", card_json=card)

    except Exception as e:
        print("DB query failed:", e)
        return "Internal server error", 500


@app.route("/cart")
def cart():
    return render_template("cart.html")


@app.route("/404")
def error():
    return render_template("404.html")


# -----------------------------
# DB helpers
# -----------------------------
def get_connection():
    if isinstance(config.DB_CONFIG, str):
        # DATABASE_URL from Render
        return psycopg2.connect(config.DB_CONFIG)
    else:
        # Local DB config dictionary
        return psycopg2.connect(**config.DB_CONFIG)



def load_cards_from_db():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM cards;")
        cards = cur.fetchall()
        cur.close()
        conn.close()
        return cards
    except Exception as e:
        print("DB read failed:", e)
        return []


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
