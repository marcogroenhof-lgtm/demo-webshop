const products = {
  apple: { name: "Apple", emoji: "🍏", price: 1.5 },
  banana: { name: "Banana", emoji: "🍌", price: 1.2 },
  lemon: { name: "Lemon", emoji: "🍋", price: 1.0 },
  pear: { name: "Pear", emoji: "🍐", price: 1.3 },
  chicken: { name: "Chicken", emoji: "🍗", price: 5.0 } // Toegevoegd
};

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : {};
}

function addToBasket(product) {
  const basket = getBasket();
  if (basket[product]) {
    basket[product] += 1;
  } else {
    basket[product] = 1;
  }
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basket-list");
  const basketTotal = document.getElementById("basket-total");
  basketList.innerHTML = "";
  let total = 0;

  Object.entries(basket).forEach(([productKey, quantity]) => {
    const product = products[productKey];
    if (product) {
      const itemTotal = product.price * quantity;
      total += itemTotal;
      const li = document.createElement("li");
      li.textContent = `${product.emoji} ${product.name} x${quantity} – €${itemTotal.toFixed(2)}`;
      basketList.appendChild(li);
    }
  });

  if (basketTotal) {
    basketTotal.textContent = `Totaal: €${total.toFixed(2)}`;
  }
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link"); // get the basket link
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  const basketKeys = Object.keys(basket);
  if (basketKeys.length > 0) {
    const totalQuantity = basketKeys.reduce((sum, key) => sum + basket[key], 0);
    indicator.textContent = totalQuantity;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
