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
    if card:
        cards.append(card)  # <-- actually adds to the server-side array
        return jsonify({"success": True})
    return jsonify({"success": False}), 400


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


# @app.route("/item")
# def item():
#     set_name = request.args.get("set")
#     card_number = request.args.get("number")

#     # Find the card
#     card = next(
#         (c for c in cards
#          if c["set"].strip() == set_name.strip() and c["number"].strip() == card_number.strip()),
#         None
#     )

#     if card:
#         return render_template("item.html", card=card)
#     return "Item not found", 404

@app.route("/item")
def item():
    set_name = request.args.get("set")
    card_number = request.args.get("number")

    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Query the DB for the specific card
        cur.execute("""
            SELECT * FROM cards
            WHERE set_name = %s AND number = %s
            LIMIT 1;
        """, (set_name, card_number))

        card = cur.fetchone()
        cur.close()
        conn.close()

        if card:
            return render_template("item.html", card=card)
        else:
            return "Item not found", 404

    except Exception as e:
        print("DB query failed:", e)
        return "Internal server error", 500


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
