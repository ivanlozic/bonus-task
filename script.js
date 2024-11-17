const DOM_ELEMENTS = {
  searchInput: document.getElementById("search"),
  categoryFilter: document.getElementById("category-filter"),
  sortOptions: document.getElementById("sort-options"),
  cartToggleButton: document.getElementById("cart-toggle"),
  cartOverlay: document.getElementById("cart-overlay"),
  closeCartButton: document.getElementById("close-cart"),
  cartItemsList: document.getElementById("cart-items"),
  totalPriceElement: document.getElementById("total-price"),
  cartCountElement: document.getElementById("cart-count"),
  checkoutButton: document.querySelector(".cart__checkout"),
  checkoutModal: document.getElementById("checkout-modal"),
  closeModalButton: document.getElementById("close-modal"),
  clearCartButton: document.getElementById("delete-all"),
  productContainer: document.querySelector(".product-container"),
};

const products = [
  {
    id: 1,
    name: "Blender",
    category: "kitchen",
    price: 50,
    quantity: 10,
    imageUrl: "public/assets/images/blender.jpg",
  },
  {
    id: 2,
    name: "Toaster",
    category: "kitchen",
    price: 25,
    quantity: 5,
    imageUrl: "public/assets/images/toaster.jpg",
  },
  {
    id: 3,
    name: "Knife Set",
    category: "kitchen",
    price: 40,
    quantity: 7,
    imageUrl: "public/assets/images/knife-set.jpg",
  },
  {
    id: 4,
    name: "Microwave",
    category: "kitchen",
    price: 100,
    quantity: 3,
    imageUrl: "public/assets/images/microwave.jpg",
  },
  {
    id: 5,
    name: "Stove",
    category: "kitchen",
    price: 200,
    quantity: 2,
    imageUrl: "public/assets/images/stove.jpg",
  },
  {
    id: 6,
    name: "Kettle",
    category: "kitchen",
    price: 30,
    quantity: 8,
    imageUrl: "public/assets/images/kettle.jpg",
  },
  {
    id: 7,
    name: "Couch",
    category: "furniture",
    price: 300,
    quantity: 2,
    imageUrl: "public/assets/images/couch.jpg",
  },
  {
    id: 8,
    name: "Chair",
    category: "furniture",
    price: 50,
    quantity: 10,
    imageUrl: "public/assets/images/chair.jpg",
  },
  {
    id: 9,
    name: "Table",
    category: "furniture",
    price: 150,
    quantity: 5,
    imageUrl: "public/assets/images/table.jpg",
  },
  {
    id: 10,
    name: "Lamp",
    category: "furniture",
    price: 75,
    quantity: 4,
    imageUrl: "public/assets/images/lamp.jpg",
  },
  {
    id: 11,
    name: "Shelf",
    category: "furniture",
    price: 120,
    quantity: 6,
    imageUrl: "public/assets/images/shelf.jpg",
  },
  {
    id: 12,
    name: "Rug",
    category: "furniture",
    price: 90,
    quantity: 3,
    imageUrl: "public/assets/images/rug.jpg",
  },
];

const VALID_DISCOUNT_CODE = "coi_discount";
const DISCOUNT_RATE = 0.15;

function applyDiscount() {
  const discountInput = document.getElementById("discount-code").value.trim();
  const discountMessage = document.getElementById("discount-message");
  const discountButton = document.getElementById("apply-discount");

  if (discountInput === VALID_DISCOUNT_CODE) {
    discount = DISCOUNT_RATE;
    discountMessage.textContent = "Discount applied successfully! 15% off.";
    discountMessage.style.color = "green";

    discountButton.setAttribute("disabled", "true");
    discountButton.style.backgroundColor = "#ccc";
    discountButton.style.cursor = "not-allowed";
    discountButton.style.color = "#666";
    discountButton.textContent = "Discount Applied";
  } else {
    discount = 0;
    discountMessage.textContent = "Invalid discount code. Please try again.";
    discountMessage.style.color = "red";
  }

  updateCart();
}

document
  .getElementById("apply-discount")
  .addEventListener("click", applyDiscount);

let cart = [];
let discount = 0;

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  addEventListeners();
});

function renderProducts(productList) {
  DOM_ELEMENTS.productContainer.innerHTML = "";
  productList.forEach((product) => {
    const productCard = createProductCard(product);
    DOM_ELEMENTS.productContainer.innerHTML += productCard;
  });
  addEventListenersToProductCards();
}

function createProductCard(product) {
  return `
        <div class="product-card" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
          <img src=${product.imageUrl} alt="${product.name}" loading="lazy">
          <h3>${product.name}</h3>
          <p class="price">$${product.price}</p>
          <div class="quantity-control">
            <button class="quantity-minus">-</button>
            <input type="number" value="1" min="1" class="quantity" />
            <button class="quantity-plus">+</button>
          </div>
          <button class="add-to-cart">Add to Cart</button>
        </div>`;
}

function addEventListenersToProductCards() {
  document.querySelectorAll(".quantity-plus").forEach((button) => {
    button.addEventListener("click", (e) => updateQuantity(e, 1));
  });

  document.querySelectorAll(".quantity-minus").forEach((button) => {
    button.addEventListener("click", (e) => updateQuantity(e, -1));
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => addProductToCart(e));
  });
}

function updateQuantity(event, change) {
  const quantityInput = event.target
    .closest(".quantity-control")
    .querySelector(".quantity");
  let quantity = parseInt(quantityInput.value);
  quantityInput.value = Math.max(1, quantity + change);
}

function addProductToCart(event) {
  const productCard = event.target.closest(".product-card");
  const productId = parseInt(productCard.getAttribute("data-id"));
  const productName = productCard.getAttribute("data-name");
  const productPrice = parseFloat(productCard.getAttribute("data-price"));
  const quantity = parseInt(productCard.querySelector(".quantity").value);
  addToCart(productId, productName, productPrice, quantity);
}

function addToCart(id, name, price, quantity) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id, name, price, quantity });
  }
  updateCart();
}

function updateCart() {
  DOM_ELEMENTS.cartItemsList.innerHTML = "";
  cart.forEach((item) => {
    const listItem = createCartItem(item);
    DOM_ELEMENTS.cartItemsList.appendChild(listItem);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = total - total * discount;
  DOM_ELEMENTS.totalPriceElement.textContent = `Total: $${discountedTotal.toFixed(
    2
  )}`;
  DOM_ELEMENTS.cartCountElement.textContent = cart.length;

  DOM_ELEMENTS.checkoutButton.disabled = cart.length === 0;
}

function createCartItem(item) {
  const listItem = document.createElement("li");
  listItem.classList.add("cart-item-container");

  listItem.innerHTML = `
          <div class="cart-item">
            <span class="item-details">
              ${item.name} - $${item.price * item.quantity}
            </span>
            <button class="delete-item" data-id="${item.id}">Delete</button>
          </div>`;

  const deleteButton = listItem.querySelector(".delete-item");
  deleteButton.addEventListener("click", () => {
    deleteItemFromCart(item.id);
    listItem.remove();
  });

  return listItem;
}

function deleteItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

DOM_ELEMENTS.clearCartButton.addEventListener("click", clearCart);

function filterAndSortProducts() {
  const searchInput = DOM_ELEMENTS.searchInput.value.toLowerCase();
  const categoryFilter = DOM_ELEMENTS.categoryFilter.value;
  const sortOption = DOM_ELEMENTS.sortOptions.value;

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchInput);
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (sortOption === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(filteredProducts);
}

function addEventListeners() {
  DOM_ELEMENTS.searchInput.addEventListener("input", filterAndSortProducts);
  DOM_ELEMENTS.categoryFilter.addEventListener("change", filterAndSortProducts);
  DOM_ELEMENTS.sortOptions.addEventListener("change", filterAndSortProducts);
  DOM_ELEMENTS.cartToggleButton.addEventListener("click", toggleCartOverlay);
  DOM_ELEMENTS.closeCartButton.addEventListener("click", closeCartOverlay);
  DOM_ELEMENTS.checkoutButton.addEventListener("click", openCheckoutModal);
  DOM_ELEMENTS.closeModalButton.addEventListener("click", closeCheckoutModal);
  window.addEventListener("click", closeCheckoutModalOnClickOutside);
}

function toggleCartOverlay() {
  DOM_ELEMENTS.cartOverlay.style.display =
    DOM_ELEMENTS.cartOverlay.style.display === "flex" ? "none" : "flex";
}

function closeCartOverlay() {
  DOM_ELEMENTS.cartOverlay.style.display = "none";
}

function openCheckoutModal() {
  if (cart.length === 0) {
    alert(
      "Your cart is empty! Please add items to your cart before proceeding."
    );
    return;
  }

  closeCartOverlay();
  clearCart();
  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  document.getElementById(
    "order-number-message"
  ).textContent = `Your order number is #${orderNumber}.`;
  DOM_ELEMENTS.checkoutModal.style.display = "flex";
}

function closeCheckoutModal() {
  DOM_ELEMENTS.checkoutModal.style.display = "none";
}

function closeCheckoutModalOnClickOutside(event) {
  if (event.target === DOM_ELEMENTS.checkoutModal) {
    DOM_ELEMENTS.checkoutModal.style.display = "none";
    closeCartOverlay();
  }
}
