// --------------------------
// Cart setup (available across all pages)
// --------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.querySelector(".cart .badge");
    if (badge) badge.textContent = cart.length;
}

function addToCart(card) {
    cart.push(card);
    saveCart();
    updateCartBadge();
}

function removeFromCart(cardId) {
    const index = cart.findIndex(c => c.id === cardId); // find first matching item
    if (index !== -1) {
        cart.splice(index, 1); // remove only that one
    }
    saveCart();
    updateCartBadge();
}

// Initialize badge on page load
updateCartBadge();

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
        items.forEach(card => {
            const cardHTML = `
                <div class="card">
                    <a href="/item?id=${card.id}">
                        <img class="card-img" src="${card.img}" alt="${card.name}">
                    </a>
                    <div class="card-info">
                        <div class="card-details">
                            <h3 class="card-name">${card.name}</h3>
                            <p class="card-set">${card.set_name}</p>
                            <p class="card-number">${card.number ? card.number : '—'}</p>
                        </div>
                        <div class="card-prices">
                            <p class="price"><strong>Price:</strong> ${card.price}</p>
                            <p class="market-price"><strong>Market:</strong> ${card.market_price}</p>
                        </div>
                    </div>
                    <button class="add-to-cart-btn" data-id="${card.id}">Add to Cart</button>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", cardHTML);
        });

        // Attach event listeners to all add-to-cart buttons
        document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const cardId = parseInt(btn.getAttribute("data-id"));
                const card = cards.find(c => c.id === cardId);
                if (card) {
                    addToCart(card);
                    alert(`${card.name} added to cart!`);
                }
            });
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
});
