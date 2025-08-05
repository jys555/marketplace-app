if (
    window.Telegram &&
    window.Telegram.WebApp &&
    window.Telegram.WebApp.initDataUnsafe &&
    window.Telegram.WebApp.initDataUnsafe.user
) {

    // ...Sizning butun app.js kodingiz shu yerdan boshlanadi...
    // (bu joyga hozirga kodlaringizni joylashtiring)
  
// Kod boshida
const userId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
// ma'lumotlarni o'qish
let favs = [];
let cart = [];

async function loadUserData() {
  const doc = await db.collection('users').doc(userId).get();
  if (doc.exists) {
    favs = doc.data().favorites || [];
    cart = doc.data().cart || [];
  } else {
    favs = [];
    cart = [];
  }
  renderPageByHash(); // eski renderHome emas!
}
// firestorega ma'lumotlarni saqlash
async function saveUserData() {
  await db.collection('users').doc(userId).set({
    favorites: favs,
    cart: cart
  }, { merge: true });
}

// FIREBASE konfiguratsiyasi va boshlanishi
const firebaseConfig = {
    apiKey: "AIzaSyBkximOtVpArX88209OIKT3oAlmz1rQfLU",
    authDomain: "marketplace-app-74766.firebaseapp.com",
    projectId: "marketplace-app-74766",
    storageBucket: "marketplace-app-74766.appspot.com",
    messagingSenderId: "102546946061",
    appId: "1:102546946061:web:8a05fef821eb15d847bd44",
    measurementId: "G-E7STM0QHMQ"
  };
firebase.initializeApp(firebaseConfig);
if (typeof firebase.analytics === "function") {
  firebase.analytics();
}
const db = firebase.firestore();

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
let page = "home";
let currentProductId = null;

// --- NAVBAR ICONS (SVG) ---
// YANGI kod (Yandex Market uslubidagi SVG’lar)

const homeSVG = `<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M3 10.8L12 4L21 10.8V20A1 1 0 0 1 20 21H16A1 1 0 0 1 15 20V16A1 1 0 0 0 14 15H10A1 1 0 0 0 9 16V20A1 1 0 0 1 8 21H4A1 1 0 0 1 3 20V10.8Z" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const catSVG = `<svg class="nav-ico" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
  <rect x="3" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>
</svg>`;
const heartSVG = `<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M12 21C12 21 5 13.36 5 8.86C5 6.17 7.24 4 9.99 4C11.37 4 12.61 4.71 13.34 5.77C14.08 4.71 15.32 4 16.7 4C19.45 4 21.69 6.17 21.69 8.86C21.69 13.36 12 21 12 21Z"
  />
</svg>`;

const cartSVG = `<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="9" cy="21" r="1"/>
  <circle cx="20" cy="21" r="1"/>
  <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.62 17h7.76a2 2 0 0 0 1.94-1.61L23 6H6"/>
</svg>`;

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
      <button id="nav-cart" class="nav-btn${active==="cart"?" active":""}" title="Savat">
        ${cartSVG}
        ${cart.length ? `<span id="cart-badge">${cart.length}</span>` : ""}
      </button>
    </nav>
  `;
}
function setNavbarEvents() {
  document.getElementById("nav-home")?.addEventListener("click", function() { setActive(this); window.location.hash="home"; });
  document.getElementById("nav-category")?.addEventListener("click", function() { setActive(this); window.location.hash="category"; });
  document.getElementById("nav-favorites")?.addEventListener("click", function() { setActive(this); window.location.hash="favorites"; });
  document.getElementById("nav-cart")?.addEventListener("click", function() { setActive(this); window.location.hash="cart"; });
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
window.toggleFavCard = async function(pid) {
  if (favs.includes(pid)) favs = favs.filter(id => id !== pid);
  else favs.push(pid);
  await saveUserData();
  refreshPage();
};
window.addToCartCard = async function(pid) {
  if (!cart.includes(pid)) cart.push(pid);
 await saveUserData(); // <-- Qo‘shildi
  refreshPage();
};
function refreshPage() {
  if (page === "home") renderHome();
  else if (page === "favorites") renderFavorites();
  else if (page === "category") renderCategory();
  else if (page === "cart") renderCart();
}

// MODAL/PRODUCT sahifa uchun - yangi funksiya: modalni qayta ochish
window.toggleFav = async function(pid) {
  if (favs.includes(pid)) favs = favs.filter(id => id !== pid);
  else favs.push(pid);
  await saveUserData(); // <-- Qo‘shildi
  openProduct(pid);
};
window.addToCart = async function(pid) {
  if (!cart.includes(pid)) cart.push(pid);
  await saveUserData(); // <-- Qo‘shildi
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
function renderPageByHash() {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (hash === "home") renderHome();
  else if (hash === "favorites") renderFavorites();
  else if (hash === "category") renderCategory();
  else if (hash === "cart") renderCart();
}
//renderHome();  // eski kod, olib tashlanadi
// yangi kod:
window.addEventListener("DOMContentLoaded", loadUserData);
window.addEventListener("hashchange", renderPageByHash);

} else {
    document.body.innerHTML = "<h2 style='color:red; text-align:center;'>❗ Telegram WebApp konteksti mavjud emas yoki user.id aniqlanmadi.<br><br>Mini-app faqat Telegram ilovasida tugma orqali ochiladi.</h2>";
}

