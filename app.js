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
    category: 4
  }
];
// STATE
let favs = [];
let cart = [];
let page = "home";
let currentProductId = null;

// --- HELPERS ---
function calcDiscount(p) {
  if (!p.old_price || p.old_price <= p.price) return null;
  return Math.round(100 - (p.price * 100) / p.old_price);
}

// --- NAVBAR ---
document.getElementById("nav-home").onclick = function() { setActive(this); page="home"; renderHome(); };
document.getElementById("nav-category").onclick = function() { setActive(this); page="category"; renderCategory(); };
document.getElementById("nav-favorites").onclick = function() { setActive(this); page="favorites"; renderFavorites(); };
document.getElementById("nav-cart").onclick = function() { setActive(this); page="cart"; renderCart(); };
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
  `;
  products.forEach((p,i) => setupCardCarousel(p,i));
}
function productCardHTML(p, idx) {
  const disc = calcDiscount(p);
  return `
    <div class="product-card" data-pid="${p.id}">
      <div class="product-img-carousel" id="carousel-${p.id}">
        <img src="${p.images[0]}" alt="${p.name}" onclick="openProduct(${p.id})">
        <button class="badge-like" onclick="event.stopPropagation();toggleFav(${p.id});" title="Sevimli">${favs.includes(p.id) ? "❤️" : "🤍"}</button>
        ${disc ? `<div class="badge-discount">-${disc}%</div>` : ""}
        <button class="cart-add-btn" onclick="event.stopPropagation();addToCart(${p.id});" title="Savatga">&#128722;</button>
        <button class="carousel-arrow left" style="display:none">&lt;</button>
        <button class="carousel-arrow right"${p.images.length<=1?' style="display:none"':''}>&gt;</button>
        <div class="carousel-dots">
          ${p.images.map((_,i) => `<span class="carousel-dot${i===0?" active":""}"></span>`).join("")}
        </div>
      </div>
      <div class="product-info" onclick="openProduct(${p.id})" style="cursor:pointer">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString('uz-UZ')} so'm</div>
      </div>
    </div>
  `;
}
function setupCardCarousel(p, idx) {
  let cidx = 0;
  const card = document.querySelectorAll(".product-card")[idx];
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
window.toggleFav = function(pid) {
  if(favs.includes(pid)) favs = favs.filter(id=>id!==pid); else favs.push(pid);
  renderHome();
};
window.addToCart = function(pid) {
  if(!cart.includes(pid)) cart.push(pid);
  renderHome();
};
// -- MODAL/PRODUCT PAGE --
window.openProduct = function(pid) {
  const p = products.find(pr=>pr.id===pid);
  document.getElementById("header").style.display = "none";
  document.getElementById("main").innerHTML = `
    <div class="full-modal" id="fullProductModal">
      <div class="modal-header">
        <button class="back-btn" onclick="renderHome()">&larr;</button>
        <div style="flex:1"></div>
        <button class="badge-like" onclick="toggleFav(${p.id});event.stopPropagation();">${favs.includes(p.id) ? "❤️" : "🤍"}</button>
      </div>
      <div class="carousel-wrap" style="margin:16px 0 5px 0;">${productModalCarousel(p)}</div>
      <div class="modal-content">
        <div class="product-title">${p.name}</div>
        <div class="price-row">
          <span class="price-main">${p.price.toLocaleString('uz-UZ')} so'm</span>
          ${p.old_price ? `<span class="price-old">${p.old_price.toLocaleString('uz-UZ')} so'm</span>` : ""}
          ${calcDiscount(p)?`<span class="badge-discount" style="margin-left:10px">-${calcDiscount(p)}%</span>`:""}
        </div>
        <div class="product-desc">${p.desc}</div>
      </div>
      <div class="sticky-btns">
        <button class="cart-btn" onclick="addToCart(${p.id})">&#128722; Savatga</button>
        <button class="main-btn" onclick="toggleFav(${p.id})">${favs.includes(p.id) ? "❤️ Sevimlidan olish" : "🤍 Sevimlilarga"}</button>
      </div>
    </div>
  `;
  setupModalCarousel(p);
}

// Yangi carousel HTML generatsiya qiluvchi funksiya:
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
      <button class="badge-like" style="top:12px;right:12px;" onclick="toggleFav(${p.id});event.stopPropagation();">${favs.includes(p.id) ? "❤️" : "🤍"}</button>
    </div>
  `;
}

// Carousel uchun JS:
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
// --- KATEGORIYA SAHIFA ---
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
  `;
}
window.showCategory = function(cid) {
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderCategory()">&larr;</button> ${categories.find(c=>c.id===cid).name}`;
  document.getElementById("main").innerHTML = `
    <div class="product-grid">${products.filter(p=>p.category===cid).map(productCardHTML).join("")}</div>
  `;
  products.filter(p=>p.category===cid).forEach((p,i) => setupCardCarousel(p,i));
}
// --- SEVIMLILAR ---
function renderFavorites() {
  document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Sevimlilar`;
  document.getElementById("main").innerHTML = `<div class="product-grid">${products.filter(p=>favs.includes(p.id)).map(productCardHTML).join("")}</div>`;
  products.filter(p=>favs.includes(p.id)).forEach((p,i) => setupCardCarousel(p,i));
}
// --- SAVAT ---
function renderCart() {
  document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Savat`;
  const cartItems = products.filter(p=>cart.includes(p.id));
  document.getElementById("main").innerHTML = cartItems.length 
    ? `<div class="product-grid">${cartItems.map(productCardHTML).join("")}</div>`
    : `<div style="padding:18px">Savat bo'sh.</div>`;
  cartItems.forEach((p,i) => setupCardCarousel(p,i));
}

renderHome();
