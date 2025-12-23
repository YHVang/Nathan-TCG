// --------------------------
// Menu toggle (both pages)
// --------------------------
function menuFunction(x) {
    x.classList.toggle("change");
}

// --------------------------
// Generic render function
// --------------------------
function renderItems(items, containerId, isTable = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (!items.length) {
        if (isTable) {
            container.innerHTML = `<tr id="no-results-row"><td colspan="6" style="text-align:center;">No items found.</td></tr>`;
        } else {
            container.innerHTML = `<p style="text-align:center;">No cards found.</p>`;
        }
        return;
    }

    if (isTable) {
        // Render table rows for admin.html
        items.forEach(card => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td data-label="Image">
                    ${card.img ? `<img src="${card.img}" alt="${card.name}" class="thumb-img">` : 'N/A'}
                </td>
                <td data-label="Set">${card.set_name}</td>
                <td data-label ="Quantity">${card.quantity || 0}</td>
                <td data-label ="Price">${card.price}</td>
                <td class="actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            `;
            container.appendChild(row);
        });
    } else {
        // Render card grid for index.html
        items.forEach(card => {
            const cardHTML = `
                <a href="/item?set=${encodeURIComponent(card.set_name)}&number=${encodeURIComponent(card.number)}">
                    <div class="card">
                        <img class="card-img" src="${card.img}" alt="${card.name}">
                        <div class="card-info">
                            <div class="card-details">
                                <h3 class="card-name">${card.name}</h3>
                                <p class="card-set">${card.set_name}</p>
                                <p class="card-number">${card.number}</p>
                            </div>
                            <div class="card-prices">
                                <p class="price"><strong>Price:</strong> ${card.price}</p>
                                <p class="market-price"><strong>Market:</strong> ${card.market_price}</p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            container.insertAdjacentHTML("beforeend", cardHTML);
        });
    }
}

// --------------------------
// Filter function
// --------------------------
function filterItems(category = "all", query = "") {
    query = query.toLowerCase();

    const filtered = cards.filter(card => {
        const matchesCategory = category === "all" || card.category === category;
        const matchesSearch = card.name.toLowerCase().includes(query) || card.set_name.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    if (document.getElementById("card-container")) {
        renderItems(filtered, "card-container", false);
    } else if (document.getElementById("inventory-body")) {
        renderItems(filtered, "inventory-body", true);
    }
}

// --------------------------
// Setup tabs & search
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
    let activeCategory = "all";

    // Tabs
    const tabs = document.querySelectorAll(".tab-bar a[data-tab]");
    tabs.forEach(tab => {
        tab.addEventListener("click", e => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            activeCategory = tab.getAttribute("data-tab") || "all";
            const query = document.getElementById("search-input")?.value || "";
            filterItems(activeCategory, query);
        });
    });

    // Search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value;
            filterItems(activeCategory, query);
        });
    }

    // Initial render in Admin page
    if (document.getElementById("card-container") || document.getElementById("inventory-body")) {
        filterItems(activeCategory, searchInput?.value || "");
    }

    // --------------------------
    // Admin Add Card Form
    // --------------------------
    const addCardForm = document.getElementById("add-card-form");
    if (addCardForm) {
        addCardForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const newCard = {
                name: document.getElementById("card-name").value,
                set: document.getElementById("card-set").value,
                quantity: parseInt(document.getElementById("card-quantity").value) || 0,
                price: parseFloat(document.getElementById("card-price").value) || 0,
                category: document.getElementById("card-category").value || "all",
                img: document.getElementById("card-img").value || "",
                marketPrice: parseFloat(document.getElementById("card-market-price").value) || 0
            };

            try {
                const response = await fetch("/admin/add_card", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCard)
                });

                const result = await response.json();
                if (result.success) {
                    // Add to client-side array
                    cards.push(newCard);

                    // Re-render inventory table
                    renderItems(cards, "inventory-body", true);

                    // Reset form
                    addCardForm.reset();
                } else {
                    alert("Failed to add card on server.");
                }
            } catch (err) {
                console.error("Error adding card:", err);
            }
        });
    }
});

// --------------------------
// Live Card preview --- Admin
// --------------------------

// Preview DOM elements
document.addEventListener("DOMContentLoaded", () => {
    // Preview DOM elements
    const previewImg = document.getElementById("preview-img");
    const previewName = document.getElementById("preview-name");
    const previewSet = document.getElementById("preview-set");
    const previewNumber = document.getElementById("preview-number");
    const previewPrice = document.getElementById("preview-price");
    const previewMarket = document.getElementById("preview-market");

    // Form inputs
    const inputs = {
        name: document.getElementById("card-name"),
        set: document.getElementById("card-set"),
        number: document.getElementById("card-number"),
        quantity: document.getElementById("card-quantity"),
        price: document.getElementById("card-price"),
        market: document.getElementById("card-market-price"),
        img: document.getElementById("card-img"),
    };

    function updateLivePreview() {
        previewName.textContent = inputs.name.value || "Card Name";
        previewSet.textContent = inputs.set.value || "Set";
        previewNumber.textContent = inputs.number.value || "—";

        previewPrice.textContent = inputs.price.value ? `$${parseFloat(inputs.price.value).toFixed(2)}` : "$0.00";
        previewMarket.textContent = inputs.market.value ? `$${parseFloat(inputs.market.value).toFixed(2)}` : "$0.00";

        previewImg.src = inputs.img.value.trim() || "/static/images/preview-image.jpg";
        previewImg.onerror = () => {
            previewImg.src = "/static/images/preview-image.jpg";
        };

        previewImg.alt = inputs.name.value || "Card preview";
    }

    // Attach input listener to all fields
    Object.values(inputs).forEach(input => {
        if (input) input.addEventListener("input", updateLivePreview);
    });

    // Optional: initialize preview on page load
    updateLivePreview();
});





