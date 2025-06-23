// Demo mahsulotlar
const products = [
  {
    id: 1,
    name: "Apple iPhone 14 Pro",
    price: 9000000,
    old_price: 11000000,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    favorite: false,
    category: 1,
    desc: "So‘nggi model, zamonaviy dizayn va yuqori tezlik. 120Hz ekran."
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    price: 8500000,
    old_price: 9500000,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    favorite: false,
    category: 1,
    desc: "Yangi Snapdragon, super kamera va uzoq batareya."
  },
  {
    id: 3,
    name: "Xiaomi Mi Band 8",
    price: 400000,
    old_price: 550000,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    favorite: false,
    category: 2,
    desc: "Aqlli soat, 2 haftagacha batareya, IP68."
  },
  {
    id: 4,
    name: "HP Laptop 15",
    price: 7200000,
    old_price: 8000000,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    favorite: false,
    category: 3,
    desc: "8GB RAM, SSD, 15.6 inch FullHD ekran."
  },
];

const categories = [
  { id: 1, name: "Smartfonlar" },
  { id: 2, name: "Aqlli soatlar" },
  { id: 3, name: "Noutbuklar" }
];

let favs = [];

function calcDiscount(p) {
  if (!p.old_price || p.old_price <= p.price) return null;
  return Math.round(100 - (p.price * 100) / p.old_price);
}

// Banner carousel (faqat oddiy)
let bannerIndex = 0;
const banners = Array.from(document.querySelectorAll('.banner'));
function showBanner(idx) {
  banners.forEach((b, i) => b.classList.toggle('active', i === idx));
}
setInterval(() => {
  bannerIndex = (bannerIndex + 1) % banners.length;
  showBanner(bannerIndex);
}, 3500);

function renderProductsGrid(list) {
  const grid = document.getElementById("product-grid");
  if (!list.length) {
    grid.innerHTML = "<p>Mahsulotlar topilmadi.</p>";
    return;
  }
  grid.innerHTML = "";
  list.forEach(product => {
    const discount = calcDiscount(product);
    grid.innerHTML += `
      <div class="product-card" onclick="showProductDetail(${product.id})">
        <div class="product-img-wrap">
          <img src="${product.image}" alt="${product.name}">
          <button class="badge-like" onclick="event.stopPropagation();toggleFav(${product.id})">
            ${favs.includes(product.id) ? "❤️" : "🤍"}
          </button>
          ${discount ? `<div class="badge-discount">-${discount}%</div>` : ""}
        </div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-price">${product.price.toLocaleString('uz-UZ')} so'm</div>
        </div>
      </div>
    `;
  });
}

function renderHome() {
  document.getElementById("banner-section").style.display = "";
  renderProductsGrid(products);
}
function renderCategories() {
  document.getElementById("banner-section").style.display = "none";
  const grid = document.getElementById("product-grid");
  grid.innerHTML = `<h2 style="margin:8px 0 14px 8px;">Kategoriyalar</h2><div id="cat-list"></div>`;
  const catList = document.getElementById("cat-list") || grid;
  catList.innerHTML = categories.map(
    c => `<div class="product-card" onclick="filterByCategory(${c.id})" style="flex-direction:row;align-items:center;padding:0 10px;">
            <div style="width:44px;height:44px;background:#eee;border-radius:10px;margin-right:13px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:1.5em;">📦</span>
            </div>
            <div class="product-name" style="font-size:1.1em;margin-bottom:0;">${c.name}</div>
          </div>`
  ).join('');
}
function renderFavorites() {
  document.getElementById("banner-section").style.display = "none";
  const favProducts = products.filter(p => favs.includes(p.id));
  renderProductsGrid(favProducts);
}

// Kategoriya bo'yicha filter
function filterByCategory(catId) {
  document.getElementById("banner-section").style.display = "none";
  const grid = document.getElementById("product-grid");
  const cat = categories.find(c => c.id === catId);
  grid.innerHTML = `<h2 style="margin:8px 0 14px 8px;">${cat.name}</h2>`;
  renderProductsGrid(products.filter(p => p.category === catId));
}

// Like funksiyasi
window.toggleFav = function(id) {
  if (favs.includes(id)) {
    favs = favs.filter(fid => fid !== id);
  } else {
    favs.push(id);
  }
  // Qaysi sahifa faol ekanligiga qarab qayta chizamiz
  if (document.querySelector("#nav-home").classList.contains("active")) renderHome();
  if (document.querySelector("#nav-favorites").classList.contains("active")) renderFavorites();
  if (document.querySelector("#nav-category").classList.contains("active")) renderCategories();
};

// Navigatsiya tugmalari
document.getElementById("nav-home").onclick = function() {
  setActive(this);
  renderHome();
};
document.getElementById("nav-category").onclick = function() {
  setActive(this);
  renderCategories();
};
document.getElementById("nav-favorites").onclick = function() {
  setActive(this);
  renderFavorites();
};

function setActive(btn) {
  document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// Mahsulot tafsilotlari modal (demo)
window.showProductDetail = function(pid) {
  const p = products.find(x => x.id === pid);
  if (!p) return;
  const discount = calcDiscount(p);
  const modal = document.createElement("div");
  modal.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999;background:rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;`;
  modal.innerHTML = `
    <div style="width:95vw;max-width:400px;background:#fff;border-radius:20px;overflow:auto;max-height:94vh;">
      <div style="position:relative;">
        <img src="${p.image}" style="width:100%;height:230px;object-fit:cover;border-top-left-radius:20px;border-top-right-radius:20px;">
        <button class="badge-like" style="top:11px;right:13px;" onclick="event.stopPropagation();window.toggleFav(${p.id});document.body.removeChild(this.closest('.prod-modal'));">
          ${favs.includes(p.id) ? "❤️" : "🤍"}
        </button>
        ${discount ? `<div class="badge-discount" style="bottom:13px;left:13px;">-${discount}%</div>` : ""}
      </div>
      <div style="padding:17px 16px 16px 16px;">
        <div style="font-size:1.14em;font-weight:500;margin-bottom:7px;">${p.name}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span style="color:#ff3256;font-size:1.13em;font-weight:bold;">${p.price.toLocaleString('uz-UZ')} so'm</span>
          ${p.old_price ? `<span style="color:#888;text-decoration:line-through;font-size:1em;">${p.old_price.toLocaleString('uz-UZ')} so'm</span>` : ""}
        </div>
        <div style="color:#444;font-size:1em;line-height:1.6;">${p.desc}</div>
      </div>
      <div style="width:100%;display:flex;justify-content:center;padding-bottom:14px;">
        <button onclick="document.body.removeChild(this.closest('.prod-modal'))" style="padding:7px 28px 7px 28px;font-size:1em;border-radius:12px;background:#2196f3;color:#fff;border:none;cursor:pointer;margin-top:8px;">Yopish</button>
      </div>
    </div>
  `;
  modal.className = "prod-modal";
  document.body.appendChild(modal);
}

renderHome();
