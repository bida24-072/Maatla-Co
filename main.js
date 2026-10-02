// --- PRODUCT DATA ---
const products = [
    { id: 1, name: "Tailored Brown Trousers", price: 450.00, category: "Trousers", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, name: "Classic White Tee", price: 150.00, category: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 3, name: "Silk Pattern Scarf", price: 200.00, category: "Scarfs", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 4, name: "Leather Loafers", price: 800.00, category: "Shoes", img: "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, name: "Beaded Bracelet Set", price: 120.00, category: "Bracelets", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, name: "Satin Headband", price: 80.00, category: "Head Bands", img: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 7, name: "Black Slim Fit Trousers", price: 420.00, category: "Trousers", img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 8, name: "Graphic Print Tee", price: 180.00, category: "T-Shirts", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
];

// --- CART STATE (Persistent via LocalStorage) ---
let cart = JSON.parse(localStorage.getItem('maatlaCart')) || [];

// --- RENDER PRODUCTS ---
function renderProducts() {
    const shopGrid = document.getElementById('all-products');
    const featuredGrid = document.getElementById('featured-products');
    
    if (!shopGrid && !featuredGrid) return; // Exit if not on a page with products

    if(shopGrid) shopGrid.innerHTML = '';
    if(featuredGrid) featuredGrid.innerHTML = '';

    products.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">P${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        
        if(shopGrid) shopGrid.innerHTML += productHTML;
        
        // Add first 4 to featured
        if(featuredGrid && featuredGrid.children.length < 4) {
            featuredGrid.innerHTML += productHTML;
        }
    });
}

// --- CART LOGIC ---
function toggleCart() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-overlay');
    if(drawer && overlay) {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added!";
    btn.style.backgroundColor = "var(--primary-brown)";
    btn.style.color = "white";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "transparent";
        btn.style.color = "var(--primary-black)";
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('maatlaCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total-price');

    if (!cartContainer) return; // Not on a page with a cart

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #999; margin-top: 50px;">Your bag is empty.</p>';
        cartCount.innerText = '0';
        cartTotal.innerText = 'P0.00';
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>P${item.price.toFixed(2)} x ${item.quantity}</p>
                    <span class="remove-item" onclick="removeFromCart(${item.id})">Remove</span>
                </div>
            </div>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = `P${total.toFixed(2)}`;
}

function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for shopping at Maatla & Co. Your order has been placed. You will receive a confirmation SMS shortly.");
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
