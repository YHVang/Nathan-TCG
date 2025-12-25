// --------------------------
// Admin JS
// --------------------------

// Menu toggle
function menuFunction(x) {
    x.classList.toggle("change");
}

// Generic render function
function renderItems(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (!items.length) {
        container.innerHTML = `<tr id="no-results-row"><td colspan="6" style="text-align:center;">No items found.</td></tr>`;
        return;
    }

    items.forEach(card => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="Image">${card.img ? `<img src="${card.img}" alt="${card.name}" class="thumb-img">` : 'N/A'}</td>
            <td data-label="Set">${card.set_name}</td>
            <td data-label="Number">${card.number || '—'}</td>
            <td data-label="Quantity">${card.quantity || 0}</td>
            <td data-label="Price">${card.price}</td>
            <td class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn" data-set="${card.set_name}" data-number="${card.number}">Delete</button>
            </td>
        `;
        container.appendChild(row);
    });
}

// Filter/search function
function filterItems(category = "all", query = "") {
    query = query.toLowerCase();
    const filtered = cards.filter(card => {
        const matchesCategory = category === "all" || card.category === category;
        const matchesSearch = card.name.toLowerCase().includes(query) || card.set_name.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });
    renderItems(filtered, "inventory-body");
}

// --------------------------
// DOMContentLoaded
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
            filterItems(activeCategory, searchInput.value);
        });
    }

    // Initial render
    filterItems(activeCategory, searchInput?.value || "");

    // --------------------------
    // Add Card Form
    // --------------------------
    const addCardForm = document.getElementById("add-card-form");
    if (addCardForm) {
        const preview = {
            img: document.getElementById("preview-img"),
            name: document.getElementById("preview-name"),
            set: document.getElementById("preview-set"),
            number: document.getElementById("preview-number"),
            price: document.getElementById("preview-price"),
            market: document.getElementById("preview-market")
        };

        const inputs = {
            name: document.getElementById("card-name"),
            set: document.getElementById("card-set"),
            number: document.getElementById("card-number"),
            quantity: document.getElementById("card-quantity"),
            price: document.getElementById("card-price"),
            market: document.getElementById("card-market-price"),
            img: document.getElementById("card-img")
        };

        function updatePreview() {
            preview.name.textContent = inputs.name.value || "Card Name";
            preview.set.textContent = inputs.set.value || "Set";
            preview.number.textContent = inputs.number.value || "—";
            preview.price.textContent = inputs.price.value ? `$${parseFloat(inputs.price.value).toFixed(2)}` : "$0.00";
            preview.market.textContent = inputs.market.value ? `$${parseFloat(inputs.market.value).toFixed(2)}` : "$0.00";
            preview.img.src = inputs.img.value.trim() || "/static/images/preview-image.jpg";
            preview.img.onerror = () => { preview.img.src = "/static/images/preview-image.jpg"; };
            preview.img.alt = inputs.name.value || "Card preview";
        }

        Object.values(inputs).forEach(input => input?.addEventListener("input", updatePreview));
        updatePreview();

        addCardForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const newCard = {
                name: inputs.name.value,
                set_name: inputs.set.value,
                number: inputs.number.value || "",
                quantity: parseInt(inputs.quantity.value) || 0,
                price: parseFloat(inputs.price.value) || 0,
                category: document.getElementById("card-category").value || "all",
                img: inputs.img.value || "",
                market_price: parseFloat(inputs.market.value) || 0
            };

            try {
                const res = await fetch("/admin/add_card", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCard)
                });
                const result = await res.json();
                if (result.success) {
                    cards.push(newCard);
                    renderItems(cards, "inventory-body");
                    addCardForm.reset();
                    updatePreview();
                } else {
                    alert("Failed to add card: " + (result.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Add card error:", err);
            }
        });
    }

    // --------------------------
    // Delete Card (event delegation)
    // --------------------------
    document.addEventListener("click", async (e) => {
        if (e.target && e.target.classList.contains("delete-btn")) {
            const setName = e.target.getAttribute("data-set");
            const number = e.target.getAttribute("data-number");

            if (!confirm(`Are you sure you want to delete ${setName} - ${number}?`)) return;

            try {
                const res = await fetch("/admin/delete_card", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ set: setName, number: number })
                });
                const result = await res.json();
                if (result.success) {
                    const index = cards.findIndex(c => c.set_name === setName && c.number === number);
                    if (index > -1) cards.splice(index, 1);
                    renderItems(cards, "inventory-body");
                } else {
                    alert("Failed to delete card: " + (result.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Delete card error:", err);
            }
        }
    });



});
