from flask import Flask, render_template, request, jsonify

import psycopg2
from psycopg2.extras import RealDictCursor
import config

app = Flask(__name__)

# cards = load_cards_from_db()


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
    card = request.get_json()
    if not card:
        return jsonify({"success": False, "error": "No card data provided"}), 400

    # Normalize empty number to None (stored as NULL in DB)
    number = card.get("number") or None

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO cards (name, set_name, number, price, market_price, img, category)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            card.get("name"),
            card.get("set_name"),
            number,
            card.get("price"),
            card.get("market_price"),
            card.get("img"),
            card.get("category", "all")
        ))

        new_id = cur.fetchone()[0]  # Get DB id of inserted card
        conn.commit()
        cur.close()
        conn.close()

        # Return the DB id so client can track it
        card["id"] = new_id
        card["number"] = number  # ensure client array matches DB
        return jsonify({"success": True, "card": card})

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
        cur = conn.cursor()

        cur.execute(
            "DELETE FROM cards WHERE id = %s RETURNING id;",
            (card_id,)
        )

        deleted = cur.fetchone()
        if not deleted:
            return jsonify({"success": False, "error": "Card not found"}), 404

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"success": True, "id": deleted[0]})

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

        cur.execute(
            "SELECT * FROM cards WHERE id = %s",
            (card_id,)
        )

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

def get_connection():
    return psycopg2.connect(
        host=config.DB_HOST,
        database=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASS,
        port=config.DB_PORT
    )

def load_cards_from_db():
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM cards;")
        cards_in_db = cur.fetchall()
        cur.close()
        conn.close()
        return cards_in_db
    except Exception as e:
        print("DB read failed:", e)
        return []  # fallback to empty list if DB read fails


if __name__ == "__main__":
    # test_db_rw()

    # Test DB connection and read existing cards
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Simple read: get all cards
        cur.execute("SELECT * FROM cards;")
        cards_in_db = cur.fetchall()
        print(f"Cards currently in DB ({len(cards_in_db)}):")
        # for card in cards_in_db:
        #     print(card)

        cur.close()
        conn.close()
    except Exception as e:
        print("DB read failed:", e)
    app.run(host="0.0.0.0", port=8080, debug=True)
