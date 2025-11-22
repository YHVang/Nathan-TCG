from flask import Flask, render_template
app = Flask(__name__)

cards = [
    {
        "name": "Mega Sableye & Tyranitar GX (Secret)",
        "set": "Unified Minds",
        "number": "245 / 236",
        "price": "$53.00",
        "marketPrice": "$59.39",
        "img": "/static/images/mega-sableye-tyranitar.jpg",
        "category": "singles"
    },
    {
        "name": "Latias & Latios GX (Alternate Full Art)",
        "set": "Darkness Ablaze",
        "number": "170 / 181",
        "price": "$973.07",
        "marketPrice": "$769.81",
        "img": "/static/images/latias-latios.jpg",
        "category": "singles"
    },
    {
        "name": "Pokemon Base Set (Shadowless)",
        "set": "Shadowless",
        "number": "",
        "price": "$5000.00",
        "marketPrice": "$2,830.00",
        "img": "/static/images/pokemon-base-set-shadowless.jpg",
        "category": "sealed"
    },
    {
        "name": "Moneky.D.Luffy (119) (Alternate Art)",
        "set": "Awakening of the New Era",
        "number": "OP05-119",
        "price": "$5,595.79",
        "marketPrice": "$3,122.69",
        "img": "/static/images/monkey-d-luffy.jpg",
        "category": "singles"
    },
    {
        "name": "Sanji (Treasure Cup 2025)",
        "set": "One Piece Promotion Cards",
        "number": "OP10-005",
        "price": "$2,499.99",
        "marketPrice": "$2,330.00",
        "img": "/static/images/sanji-treasure-cup-2025.jpg",
        "category": "singles"
    },
    {
        "name": "Vampire Princess of Night Fog, Nightrose (RLR)",
        "set": "Butterfly d'Moonlight",
        "number": "V-BT09/RLR002EN - RLR",
        "price": "$2,000.00",
        "marketPrice": "$2,000.00",
        "img": "/static/images/vampire-princess-of-night-fog.jpg",
        "category": "singles"
    },
    {
        "name": "History Collection Booster Box Case - D-PV01",
        "set": "D-PV01: History Collection",
        "number": "",
        "price": "$2,014.94",
        "marketPrice": "$1,257.49",
        "img": "/static/images/history-collection-booster-box-case.jpg",
        "category": "sealed"
    }
]


@app.route("/")
def home():
    return render_template("index.html", cards_json=cards)

@app.route("/admin")
def admin():
    return render_template("admin.html")

from flask import request

@app.route("/item")
def item():
    set_name = request.args.get("set")
    card_number = request.args.get("number")

    # Find the card
    card = next(
        (c for c in cards
         if c["set"].strip() == set_name.strip() and c["number"].strip() == card_number.strip()),
        None
    )

    if card:
        return render_template("item.html", card=card)
    return "Item not found", 404


if __name__ == "__main__":
    app.run(debug=True)
