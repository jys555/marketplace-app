// DEMO DATA
const banners = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
];
const categories = [
  { id: 1, name: "Smartfonlar", icon: "📱" },
  { id: 2, name: "Quloqchinlar", icon: "🎧" },
  { id: 3, name: "Noutbuklar", icon: "💻" },
  { id: 4, name: "Soatlar", icon: "⌚" }
];
const products = [
  {
    id: 1,
    name: "Apple iPhone 14 Pro",
    desc: "So‘nggi model, zamonaviy dizayn va yuqori tezlik.",
    price: 9000000,
    old_price: 11000000,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    uzum_url: "https://uzum.uz/product/iphone-14-pro",
    yandex_url: "https://market.yandex.uz/product--iphone-14-pro/123456",
    category: 1
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    desc: "Yangi Snapdragon, super kamera va uzoq batareya.",
    price: 8500000,
    old_price: 9500000,
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
    ],
    uzum_url: "https://uzum.uz/product/samsung-galaxy-s23",
    yandex_url: "https://market.yandex.uz/product--samsung-galaxy-s23/654321",
    category: 1
  },
  {
    id: 3,
    name: "Xiaomi Mi Band 8",
    desc: "Aqlli soat, 2 haftagacha batareya, IP68.",
    price: 400000,
    old_price: 550000,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
    ],
    uzum_url: "https://uzum.uz/product/mi-band-8",
    yandex_url: "https://market.yandex.uz/product--mi-band-8/323232",
    category: 4
  }
];
// STATE
let favs = [];
let cart = [];
let page = "home";
let currentProductId = null;

// --- NAVBAR ICONS (SVG) ---
const homeSVG = `<svg class="nav-ico" width="24" height="24" fill="none"><path d="M4 10v9a1 1 0 001 1h4v-5h2v5h4a1 1 0 001-1v-9m-9 0L12 5l7 5" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const catSVG = `<svg class="nav-ico" width="24" height="24" fill="none"><rect x="3" y="3" width="7" height="7" rx="2" stroke="#888" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="2" stroke="#888" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="2" stroke="#888" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="2" stroke="#888" stroke-width="2"/></svg>`;
const heartSVG = `<svg class="nav-ico" width="24" height="24" fill="none"><path d="M12 21s-7-4.35-7-10a5 5 0 0110 0a5 5 0 0110 0c0 5.65-7 10-7 10z" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const cartSVG = `<svg class="nav-ico" width="24" height="24" fill="none"><path d="M6 6H21L20 16H7L6 6Z" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1" stroke="#888" stroke-width="2"/><circle cx="18" cy="20" r="1" stroke="#888" stroke-width="2"/></svg>`;

// --- HELPERS ---
function calcDiscount(p) {
  if (!p.old_price || p.old_price <= p.price) return null;
  return Math.round(100 - (p.price * 100) / p.old_price);
}

// --- NAVBAR RENDERING ---
function renderNavbar(active) {
  return `
    <nav class="bottom-nav">
      <button id="nav-home" class="nav-btn${active==="home"?" active":""}" title="Bosh sahifa">${homeSVG}</button>
      <button id="nav-category" class="nav-btn${active==="category"?" active":""}" title="Kategoriyalar">${catSVG}</button>
      <button id="nav-favorites" class="nav-btn${active==="favorites"?" active":""}" title="Sevimlilar">${heartSVG}</button>
      <button id="nav-cart" class="nav-btn${active==="cart"?" active":""}" title="Savat">${cartSVG}<span id="cart-badge"${cart.length ? ' style="display:flex"' : ''}>${cart.length || ""}</span></button>
    </nav>
  `;
}
function setNavbarEvents() {
  document.getElementById("nav-home")?.addEventListener("click", function() { setActive(this); page="home"; renderHome(); });
  document.getElementById("nav-category")?.addEventListener("click", function() { setActive(this); page="category"; renderCategory(); });
  document.getElementById("nav-favorites")?.addEventListener("click", function() { setActive(this); page="favorites"; renderFavorites(); });
  document.getElementById("nav-cart")?.addEventListener("click", function() { setActive(this); page="cart"; renderCart(); });
}
function setActive(btn) {
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
}

// --- MAIN ---
function renderHome() {
  document.getElementById("header").style.display = "none";
  document.getElementById("main").innerHTML = `
    <div class="amazing-banner">
      <img src="${banners[0]}" alt="Amazing Store">
      <div class="amazing-title">AMAZING STORE</div>
    </div>
    <div class="banner-carousel">
      ${banners.map((src,i)=>`<div class="banner${i===0?" active":""}"><img src="${src}"></div>`).join("")}
    </div>
    <div class="product-grid">${products.map(productCardHTML).join("")}</div>
    ${renderNavbar("home")}
  `;
  products.forEach((p,i) => setupCardCarousel(p,i));
  setNavbarEvents();
}
function productCardHTML(p, idx) {
  const disc = calcDiscount(p);
  const isInCart = cart.includes(p.id);
  const isFav = favs.includes(p.id);
  return `
    <div class="product-card" data-pid="${p.id}">
      <div class="product-img-carousel" id="carousel-${p.id}">
        <img src="${p.images[0]}" alt="${p.name}" onclick="openProduct(${p.id})">
        <button class="badge-like"
          onclick="event.stopPropagation();toggleFavCard(${p.id});"
          title="Sevimli">
          ${isFav ? "❤️" : "🤍"}
        </button>
        ${disc ? `<div class="badge-discount">-${disc}%</div>` : ""}
        <button class="cart-add-btn${isInCart ? " disabled" : ""}"
          onclick="event.stopPropagation();${!isInCart ? `addToCartCard(${p.id})` : ""}"
          ${isInCart ? "disabled" : ""}
          title="Savatga">&#128722;
        </button>
        <button class="carousel-arrow left" style="display:none"
          onclick="event.stopPropagation();"></button>
        <button class="carousel-arrow right"${p.images.length<=1?' style="display:none"':''}
          onclick="event.stopPropagation();"></button>
        <div class="carousel-dots">
          ${p.images.map((_,i) => `<span class="carousel-dot${i===0?" active":""}" onclick="event.stopPropagation();"></span>`).join("")}
        </div>
      </div>
      <div class="product-info" style="cursor:pointer" onclick="openProduct(${p.id})">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString('uz-UZ')} so'm</div>
      </div>
    </div>
  `;
}

// Kartochkadagi yurak va savat uchun faqat sahifani yangilash
window.toggleFavCard = function(pid) {
  if(favs.includes(pid)) favs = favs.filter(id=>id!==pid); else favs.push(pid);
  refreshPage();
};
window.addToCartCard = function(pid) {
  if(!cart.includes(pid)) cart.push(pid);
  refreshPage();
};
function refreshPage() {
  if (page === "home") renderHome();
  else if (page === "favorites") renderFavorites();
  else if (page === "category") renderCategory();
  else if (page === "cart") renderCart();
}

// MODAL/PRODUCT sahifa uchun - eski funksiya: modalni qayta ochish
window.toggleFav = function(pid) {
  if(favs.includes(pid)) favs = favs.filter(id=>id!==pid); else favs.push(pid);
  openProduct(pid);
};
window.addToCart = function(pid) {
  if(!cart.includes(pid)) cart.push(pid);
  openProduct(pid);
};

// Carousel setup
function setupCardCarousel(p, idx) {
  let cidx = 0;
  const card = document.querySelectorAll(".product-card")[idx];
  if (!card) return;
  const carouselDiv = card.querySelector(".product-img-carousel");
  const img = carouselDiv.querySelector("img");
  const leftBtn = carouselDiv.querySelector(".carousel-arrow.left");
  const rightBtn = carouselDiv.querySelector(".carousel-arrow.right");
  const dots = carouselDiv.querySelectorAll(".carousel-dot");
  function update() {
    img.src = p.images[cidx];
    leftBtn.style.display = cidx === 0 ? "none" : "";
    rightBtn.style.display = cidx === p.images.length - 1 ? "none" : "";
    dots.forEach((dot, i) => dot.classList.toggle("active", i === cidx));
  }
  leftBtn.onclick = (ev) => { ev.stopPropagation(); if (cidx > 0) { cidx--; update(); } };
  rightBtn.onclick = (ev) => { ev.stopPropagation(); if (cidx < p.images.length - 1) { cidx++; update(); } };
  dots.forEach((dot, i) => dot.onclick = (ev) => { ev.stopPropagation(); cidx = i; update(); });
  img.onclick = (ev) => { ev.stopPropagation(); openProduct(p.id); };
}

// MODAL/PRODUCT PAGE - Yandex/Uzum style
window.openProduct = function(pid) {
  const p = products.find(pr=>pr.id===pid);
  const isInCart = cart.includes(p.id);
  const isFav = favs.includes(p.id);
  document.getElementById("header").style.display = "none";
  document.getElementById("main").innerHTML = `
    <div class="full-modal" id="fullProductModal">
      <div class="modal-header">
        <button class="back-btn" onclick="renderHome()">&larr;</button>
        <div style="flex:1"></div>
        <button class="badge-like" onclick="toggleFav(${p.id});event.stopPropagation();">${isFav ? "❤️" : "🤍"}</button>
      </div>
      <div class="carousel-wrap" style="margin:16px 0 5px 0;">${productModalCarousel(p)}</div>
      <div class="modal-content">
        <div class="product-title">${p.name}</div>
        <div class="price-row">
          <span class="price-main">${p.price.toLocaleString('uz-UZ')} so'm</span>
          ${p.old_price ? `<span class="price-old">${p.old_price.toLocaleString('uz-UZ')} so'm</span>` : ""}
        </div>
        <div class="product-desc">${p.desc}</div>
      </div>
      <div class="sticky-btns">
        <button class="main-btn" onclick="showBuySheet(${p.id})">Hozir sotib olish</button>
        <button class="cart-btn${isInCart ? " disabled" : ""}" onclick="${!isInCart ? `addToCart(${p.id})` : ""}" ${isInCart ? "disabled" : ""}>🛒 Savatga</button>
      </div>
    </div>
    ${renderNavbar("home")}
    <div id="buy-sheet-root"></div>
  `;
  setupModalCarousel(p);
  setNavbarEvents();
};
function productModalCarousel(p) {
  return `
    <div class="product-img-carousel" style="margin:0 auto;max-width:340px;">
      <button class="carousel-arrow left" style="display:none">&lt;</button>
      <img src="${p.images[0]}" alt="${p.name}">
      <button class="carousel-arrow right"${p.images.length<=1?' style="display:none"':''}>&gt;</button>
      <div class="carousel-dots">
        ${p.images.map((_,i) => `<span class="carousel-dot${i===0?" active":""}"></span>`).join("")}
      </div>
      ${calcDiscount(p)?`<div class="badge-discount" style="left:12px;bottom:12px;">-${calcDiscount(p)}%</div>`:""}
    </div>
  `;
}
function setupModalCarousel(p) {
  let cidx = 0;
  const carouselDiv = document.querySelector(".product-img-carousel");
  const img = carouselDiv.querySelector("img");
  const leftBtn = carouselDiv.querySelector(".carousel-arrow.left");
  const rightBtn = carouselDiv.querySelector(".carousel-arrow.right");
  const dots = carouselDiv.querySelectorAll(".carousel-dot");
  function update() {
    img.src = p.images[cidx];
    leftBtn.style.display = cidx === 0 ? "none" : "";
    rightBtn.style.display = cidx === p.images.length - 1 ? "none" : "";
    dots.forEach((dot, i) => dot.classList.toggle("active", i === cidx));
  }
  leftBtn.onclick = (ev) => { ev.stopPropagation(); if (cidx > 0) { cidx--; update(); } };
  rightBtn.onclick = (ev) => { ev.stopPropagation(); if (cidx < p.images.length - 1) { cidx++; update(); } };
  dots.forEach((dot, i) => dot.onclick = (ev) => { ev.stopPropagation(); cidx = i; update(); });
  update();
}

// "Hozir sotib olish" tugmasi uchun kichik oynacha
window.showBuySheet = function(pid) {
  const p = products.find(pr=>pr.id===pid);
  document.getElementById("buy-sheet-root").innerHTML = `
    <div class="buy-sheet-overlay" onclick="closeBuySheet()"></div>
    <div class="buy-sheet">
      <button class="buy-sheet-btn uzum" onclick="window.open('${p.uzum_url}','_blank')">
        <img src="https://seeklogo.com/images/U/uzum-logo-1E2B21E357-seeklogo.com.png" style="width:22px;vertical-align:middle;margin-right:7px;"> Uzum orqali xarid qilish
      </button>
      <button class="buy-sheet-btn yandex" onclick="window.open('${p.yandex_url}','_blank')">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Yandex_logo_icon.svg" style="width:22px;vertical-align:middle;margin-right:7px;"> Yandex orqali xarid qilish
      </button>
    </div>
  `;
};
window.closeBuySheet = function() {
  document.getElementById("buy-sheet-root").innerHTML = "";
}

// Kategoriya va qolgan sahifalar (oldingi kabi, o‘zgartirmasdan)
function renderCategory() {
  document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Kategoriyalar`;
  document.getElementById("main").innerHTML = `
    <div class="cat-grid">
      ${categories.map(cat=>`
        <div class="cat-card" onclick="showCategory(${cat.id})">
          <span class="cat-emoji">${cat.icon}</span>
          <div class="cat-name">${cat.name}</div>
        </div>
      `).join("")}
    </div>
    ${renderNavbar("category")}
  `;
  setNavbarEvents();
}
window.showCategory = function(cid) {
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderCategory()">&larr;</button> ${categories.find(c=>c.id===cid).name}`;
  document.getElementById("main").innerHTML = `
    <div class="product-grid">${products.filter(p=>p.category===cid).map(productCardHTML).join("")}</div>
    ${renderNavbar("category")}
  `;
  products.filter(p=>p.category===cid).forEach((p,i) => setupCardCarousel(p,i));
  setNavbarEvents();
}
function renderFavorites() {
  document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Sevimlilar`;
  document.getElementById("main").innerHTML = `
    <div class="product-grid">${products.filter(p=>favs.includes(p.id)).map(productCardHTML).join("")}</div>
    ${renderNavbar("favorites")}
  `;
  products.filter(p=>favs.includes(p.id)).forEach((p,i) => setupCardCarousel(p,i));
  setNavbarEvents();
}
function renderCart() {
  document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Savat`;
  const cartItems = products.filter(p=>cart.includes(p.id));
  document.getElementById("main").innerHTML = (cartItems.length 
    ? `<div class="product-grid">${cartItems.map(productCardHTML).join("")}</div>`
    : `<div style="padding:18px">Savat bo'sh.</div>`)
    + renderNavbar("cart");
  cartItems.forEach((p,i) => setupCardCarousel(p,i));
  setNavbarEvents();
}
renderHome();
