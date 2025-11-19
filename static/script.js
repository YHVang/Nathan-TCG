const cards = [
    {
        name: "Mega Sableye & Tyranitar GX (Full Art)",
        set: "Unified Minds",
        number: "225 / 236",
        price: "$20.00",
        marketPrice: "$44.87",
        img: "https://product-images.tcgplayer.com/fit-in/437x437/193234.jpg",
        category: "singles"
    },
    {
        name: "Charizard VMAX",
        set: "Darkness Ablaze",
        number: "100 / 189",
        price: "$150.00",
        marketPrice: "$200.00",
        img: "https://product-images.tcgplayer.com/fit-in/437x437/196525.jpg",
        category: "sealed"
    },
    {
        name: "Pikachu V",
        set: "Vivid Voltage",
        number: "25 / 185",
        price: "$10.00",
        marketPrice: "$20.00",
        img: "https://product-images.tcgplayer.com/fit-in/437x437/195023.jpg",
        category: "singles"
    }
];

// Function to render a given array of cards
function renderCards(filteredCards) {
    const container = document.getElementById("card-container");
    container.innerHTML = "";

    filteredCards.forEach(card => {
        const cardHTML = `
        <div class="card">
            <img class="card-img" src="${card.img}" alt="${card.name}">
            <div class="card-info">
                <h3 class="card-name">${card.name}</h3>
                <p class="card-set">${card.set} • #${card.number}</p>
                <p class="price"><strong>Price:</strong> ${card.price}</p>
                <p class="market-price"><strong>Market:</strong> ${card.marketPrice}</p>
            </div>
        </div>
    `;
        container.insertAdjacentHTML("beforeend", cardHTML);
    });

}