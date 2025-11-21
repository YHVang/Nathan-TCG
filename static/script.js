// Array of card objects
// const cards = [
//     {
//         name: "Mega Sableye & Tyranitar GX (Secret)",
//         set: "Unified Minds",
//         number: "245 / 236",
//         price: "$53.00",
//         marketPrice: "$59.39",
//         img: "static/images/mega-sableye-tyranitar.jpg",
//         category: "singles"
//     },
//     {
//         name: "Latias & Latios GX (Alternate Full Art)",
//         set: "Darkness Ablaze",
//         number: "170 / 181",
//         price: "$973.07",
//         marketPrice: "$769.81",
//         img: "/static/images/latias-latios.jpg",
//         category: "singles"
//     },
//     {
//         name: "Pokemon Base Set (Shadowless)",
//         set: "Shadowless",
//         number: "",
//         price: "$5000.00",
//         marketPrice: "$2,830.00",
//         img: "/static/images/pokemon-base-set-shadowless.jpg",
//         category: "sealed"
//     },
//     {
//         name: "Moneky.D.Luffy (119) (Alternate Art)",
//         set: "Awakening of the New Era",
//         number: "OP05-119",
//         price: "$5,595.79",
//         marketPrice: "$3,122.69",
//         img: "/static/images/monkey-d-luffy.jpg",
//         category: "singles"
//     },
//     {
//         name: "Sanji (Treasure Cup 2025)",
//         set: "One Piece Promotion Cards",
//         number: "OP10-005",
//         price: "$2,499.99",
//         marketPrice: "$2,330.00",
//         img: "/static/images/pokemon-base-set-shadowless.jpg",
//         category: "singles"
//     },
//     {
//         name: "Vampire Princess of Night Fog, Nightrose (RLR)",
//         set: "Butterfly d'Moonlight",
//         number: "V-BT09/RLR002EN - RLR",
//         price: "$2,000.00",
//         marketPrice: "$2,000.00",
//         img: "/static/images/vampire-princess-of-night-fog.jpg",
//         category: "singles"
//     },
//     {
//         name: "History Collection Booster Box Case - D-PV01",
//         set: "D-PV01: History Collection",
//         number: "",
//         price: "$2,014.94",
//         marketPrice: "$1,257.49",
//         img: "/static/images/history-collection-booster-box-case.jpg",
//         category: "sealed"
//     }
// ];

// Render cards
function renderCards(filteredCards) {
    const container = document.getElementById("card-container");
    container.innerHTML = "";

    filteredCards.forEach(card => {
        const cardHTML = `
            <a href="/item?set=${encodeURIComponent(card.set)}&number=${encodeURIComponent(card.number)}" class="card-link">
                <div class="card">
                    <img class="card-img" src="${card.img}" alt="${card.name}">
                    <div class="card-info">
                        <h3 class="card-name">${card.name}</h3>
                        <p class="card-set">${card.set}</p>
                        <p class="card-number">${card.number}</p>
                        <p class="price"><strong>Price:</strong> ${card.price}</p>
                        <p class="market-price"><strong>Market:</strong> ${card.marketPrice}</p>
                    </div>
                </div>
            </a>
        `;
        container.insertAdjacentHTML("beforeend", cardHTML);
    });
}


// Initial render
renderCards(cards);

// Tab filtering
const tabs = document.querySelectorAll(".tab-bar a");
tabs.forEach(tab => {
    tab.addEventListener("click", e => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const category = tab.getAttribute("data-tab");
        const filtered = category === "all" ? cards : cards.filter(c => c.category === category);
        renderCards(filtered);
    });
});

function menuFunction(x) {
    x.classList.toggle("change");
}
