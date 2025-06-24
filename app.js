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
function productCardHTML(p) {
  return `
    <div class="product-card">
      <div class="product-img-carousel">
        <img src="${p.images[0]}" alt="${p.name}">
      </div>
      <button class="badge-like" onclick="event.stopPropagation()">🤍</button>
      ${p.old_price?`<div class="badge-discount">-${Math.round(100-(p.price*100)/p.old_price)}%</div>`:""}
      <button class="cart-add-btn" onclick="event.stopPropagation()">&#128722;</button>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
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

// Boshlang'ich render
renderHome();
