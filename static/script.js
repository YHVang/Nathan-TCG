// Render cards
function renderCards(filteredCards) {
    const container = document.getElementById("card-container");
    if (!container) return; // Skip if no card container on the page
    container.innerHTML = "";

    filteredCards.forEach(card => {
        const cardHTML = `
            <a href="/item?set=${encodeURIComponent(card.set)}&number=${encodeURIComponent(card.number)}">
                <div class="card">
                    <img class="card-img" src="${card.img}" alt="${card.name}">
                    <div class="card-info">
                        <div class="card-details">
                            <h3 class="card-name">${card.name}</h3>
                            <p class="card-set">${card.set}</p>
                            <p class="card-number">${card.number}</p>
                        </div>

                        <div class="card-prices">
                            <p class="price"><strong>Price:</strong> ${card.price}</p>
                            <p class="market-price"><strong>Market:</strong> ${card.marketPrice}</p>
                        </div>
                    </div>
                </div>
            </a>
        `;
        container.insertAdjacentHTML("beforeend", cardHTML);
    });
}

// Initial render
renderCards(cards);

// Tab filtering (only attach if #card-container exists)
const cardContainer = document.getElementById("card-container");
if (cardContainer) {
    const tabs = document.querySelectorAll(".tab-bar a[data-tab]");
    tabs.forEach(tab => {
        tab.addEventListener("click", e => {
            e.preventDefault(); // Only prevent if filtering cards

            // Set active tab
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Filter and render cards
            const category = tab.getAttribute("data-tab");
            const filtered = category === "all" ? cards : cards.filter(c => c.category === category);
            renderCards(filtered);
        });
    });
}

// Menu toggle function
function menuFunction(x) {
    x.classList.toggle("change");
}
