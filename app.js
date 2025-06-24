// Demo ma'lumotlar
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
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
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
  },
];

// Bosh sahifa - banner va mahsulotlar
function renderHome() {
  document.getElementById("header").style.display = "none";
  document.getElementById("main").innerHTML = `
    <div style="padding:13px 10px 0 10px;">
      <div class="amazing-banner">
        <img src="${banners[0]}" alt="Amazing Store">
        <div class="amazing-title">AMAZING STORE</div>
      </div>
      <div class="banner-carousel">
        ${banners.map((src,i)=>`<div class="banner${i===0?" active":""}"><img src="${src}"></div>`).join("")}
      </div>
    </div>
    <div class="product-grid">${products.map(productCardHTML).join("")}</div>
  `;
  // Carousel
  let idx = 0;
  setInterval(()=>{
    idx = (idx+1)%banners.length;
    document.querySelectorAll('.banner').forEach((el,i)=>el.classList.toggle('active',i===idx));
  },3500);
}
function productCardHTML(p, idx) {
  const disc = calcDiscount(p);
  return `
    <div class="product-card" data-pid="${p.id}">
      <div class="product-img-carousel" id="carousel-${p.id}">
        <button class="carousel-arrow left" style="display:none">&lt;</button>
        <img src="${p.images[0]}" alt="${p.name}">
        <button class="carousel-arrow right"${p.images.length<=1?' style="display:none"':''}>&gt;</button>
        <div class="carousel-dots">
          ${p.images.map((_,i) => `<span class="carousel-dot${i===0?" active":""}"></span>`).join("")}
        </div>
      </div>
      <button class="badge-like" onclick="event.stopPropagation();toggleFav(${p.id});">${favs.includes(p.id) ? "❤️" : "🤍"}</button>
      ${disc?`<div class="badge-discount">-${disc}%</div>`:""}
      <button class="cart-add-btn" onclick="event.stopPropagation();addToCart(${p.id});">&#128722;</button>
      <div class="product-info" onclick="openProduct(${p.id})" style="cursor:pointer">
        <div class="product-name">${getProductName(p)}</div>
        <div class="product-price">${p.price.toLocaleString('uz-UZ')} so'm</div>
      </div>
    </div>
  `;
}

// Kategoriya sahifasi
function renderCategory() {
  document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Kategoriyalar`;
  document.getElementById("main").innerHTML = `
    <div class="cat-grid">
      ${categories.map(cat=>`
        <div class="cat-card">
          <span class="cat-emoji">${cat.icon}</span>
          <div class="cat-name">${cat.name}</div>
        </div>
      `).join("")}
    </div>
  `;
}

// Navbar funksiyasi
document.getElementById("nav-home").onclick = function() {
  setActive(this); renderHome();
};
document.getElementById("nav-category").onclick = function() {
  setActive(this); renderCategory();
};
document.getElementById("nav-favorites").onclick = function() {
  setActive(this); document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Sevimlilar`;
  document.getElementById("main").innerHTML = `<div style="padding:18px">Sevimlilar bo'sh.</div>`;
};
document.getElementById("nav-cart").onclick = function() {
  setActive(this); document.getElementById("header").style.display = "flex";
  document.getElementById("header").innerHTML = `<button class="back-btn" onclick="renderHome()">&larr;</button> Savat`;
  document.getElementById("main").innerHTML = `<div style="padding:18px">Savat bo'sh.</div>`;
};
function setActive(btn) {
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
}
// Carousel funksiyasi (kartochka har birida)
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
  // Kartochka bosilganda batafsil ochilsin
  carouselDiv.onclick = (ev) => { if(ev.target===img) openProduct(p.id); };
}
// Boshlang'ich render
renderHome();
