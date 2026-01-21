// --------------------------
// DOM elements
// --------------------------
const cartContainer = document.getElementById("cart-container");
const totalAmountEl = document.getElementById("total-amount");

// --------------------------
// Render cart items
// --------------------------
function renderCart() {
    cartContainer.innerHTML = "";

    if (!cart || cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalAmountEl.textContent = "0.00";
        updateCartBadge();
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += Number(item.price);

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.set_name}</p>
                <p class="price">$${Number(item.price).toFixed(2)}</p>
                <button class="cart-btn remove-btn">Remove</button>
            </div>
        `;

        cartItem
            .querySelector(".remove-btn")
            .addEventListener("click", () => {
                removeFromCart(item.id);
                renderCart();
            });

        cartContainer.appendChild(cartItem);
    });

    totalAmountEl.textContent = total.toFixed(2);
    updateCartBadge();
}

// --------------------------
// Init
// --------------------------
document.addEventListener("DOMContentLoaded", renderCart);
