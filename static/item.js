document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("item-container");
    if (!card) {
        container.innerHTML = "<p>Item not found.</p>";
        return;
    }

    const cardHTML = `
                <h2 class="results-title">${card.name}</h2>
                <div class="card">
                    <img class="card-img" src="${card.img || '/static/images/preview-image.jpg'}" alt="${card.name}">
                    <div class="card-info">
                        <h3 class="card-name">${card.name}</h3>
                        <p class="card-set"><strong>Set:</strong> ${card.set_name}</p>
                        ${card.number ? `<p class="card-number"><strong>Number:</strong> ${card.number}</p>` : ""}
                        <p class="price"><strong>Price:</strong> ${card.price}</p>
                        <p class="market-price"><strong>Market:</strong> ${card.market_price}</p>
                        ${card.category ? `<p class="card-category"><strong>Category:</strong> ${card.category}</p>` : ""}
                        <a href="/" class="back-button">← Back to Search</a>
                    </div>
                </div>
            `;

    container.innerHTML = cardHTML;
});