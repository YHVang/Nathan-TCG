// --------------------------
// Admin JS
// --------------------------

// Menu toggle
function menuFunction(x) {
    x.classList.toggle("change");
}

// --------------------------
// Render inventory items
// --------------------------
function renderItems(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (!items.length) {
        container.innerHTML = `<tr id="no-results-row"><td colspan="5" style="text-align:center;">No items found.</td></tr>`;
        return;
    }

    items.forEach(card => {
        const price = card.price != null ? parseFloat(String(card.price).replace(/,/g, "")) : 0;
        const displayPrice = isNaN(price) ? "0.00" : price.toFixed(2);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="Card Name">
                ${card.name || 'N/A'}
                ${card.img ? `<br><img src="${card.img}" alt="${card.name}" class="thumb-img">` : ''}
            </td>
            <td data-label="Set Name">${card.set_name || '—'}</td>
            <td data-label="Card Number">${card.number || '—'}</td>
            <td data-label="Price">$${displayPrice}</td>
            <td class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn" data-id="${card.id}">Delete</button>
            </td>
        `;
        container.appendChild(row);
    });
}

// --------------------------
// Filter/search function
// --------------------------
function filterItems(category = "all", query = "") {
    query = query.toLowerCase();
    const filtered = cards.filter(card => {
        const matchesCategory = category === "all" || card.category === category;
        const matchesSearch = (card.name || "").toLowerCase().includes(query) ||
            (card.set_name || "").toLowerCase().includes(query);
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

        const fileInput = document.getElementById("card-img-file");

        function updatePreview() {
            preview.name.textContent = inputs.name.value || "Card Name";
            preview.set.textContent = inputs.set.value || "Set";
            preview.number.textContent = inputs.number.value || "—";

            const priceVal = parseFloat(inputs.price.value) || 0;
            const marketVal = parseFloat(inputs.market.value) || 0;
            preview.price.textContent = `$${priceVal.toFixed(2)}`;
            preview.market.textContent = `$${marketVal.toFixed(2)}`;

            if (fileInput && fileInput.files[0]) {
                preview.img.src = URL.createObjectURL(fileInput.files[0]);
            } else {
                preview.img.src = inputs.img.value.trim() || "/static/images/preview-image.jpg";
            }

            preview.img.onerror = () => { preview.img.src = "/static/images/preview-image.jpg"; };
            preview.img.alt = inputs.name.value || "Card preview";
        }

        Object.values(inputs).forEach(input => input?.addEventListener("input", updatePreview));
        if (fileInput) fileInput.addEventListener("change", updatePreview);
        updatePreview();

        addCardForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const formData = new FormData();
                formData.append("name", inputs.name.value);
                formData.append("set_name", inputs.set.value);
                formData.append("number", inputs.number.value || "");
                formData.append("quantity", parseInt(inputs.quantity.value) || 0);
                formData.append("price", parseFloat(inputs.price.value) || 0);
                formData.append("market_price", parseFloat(inputs.market.value) || 0);
                formData.append("category", document.getElementById("card-category").value || "all");

                if (fileInput && fileInput.files[0]) {
                    formData.append("image_file", fileInput.files[0]);
                }
                formData.append("image_url", inputs.img.value || "");

                const res = await fetch("/admin/add_card", { method: "POST", body: formData });
                const result = await res.json();

                if (result.success && result.card) {
                    cards.push(result.card);
                    renderItems(cards, "inventory-body");
                    addCardForm.reset();
                    updatePreview();
                } else {
                    alert("Failed to add card: " + (result.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Add card error:", err);
                alert("Failed to add card due to network or server error.");
            }
        });
    }

    // --------------------------
    // Delete Card (event delegation)
    // --------------------------
    document.addEventListener("click", async (e) => {
        if (e.target && e.target.classList.contains("delete-btn")) {
            const cardId = e.target.getAttribute("data-id");
            if (!cardId) return;

            if (!confirm("Are you sure you want to delete this card?")) return;

            try {
                const res = await fetch("/admin/delete_card", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: cardId })
                });
                const result = await res.json();

                if (result.success) {
                    const index = cards.findIndex(c => String(c.id) === String(cardId));
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
