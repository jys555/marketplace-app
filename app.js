let favs = [];
let cart = [];
let page = "home";
let currentProductId = null;

function calcDiscount(p) {
  if (!p.old_price || p.old_price <= p.price) return null;
  return Math.round(100 - (p.price * 100) / p.old_price);
}
function getProductName(p) { return currentLang === "ru" ? p.name_ru : p.name_uz; }
function getProductDesc(p) { return currentLang === "ru" ? p.desc_ru : p.desc_uz; }
function getCategoryName(cat) { return currentLang === "ru" ? cat.name_ru : cat.name_uz; }

function renderHeader({title, showBack = false} = {}) {
  const hdr = document.getElementById("header");
  if(page==="home") { hdr.innerHTML = ""; hdr.style.display = "none"; return; }
  hdr.style.display = "flex";
  hdr.innerHTML = `
    ${showBack?`<button class="back-btn" onclick="goBack()">&larr;</button>`:""}
    ${title||""}`;
}
window.goBack = function() {
  if(["category","favorites","cart"].includes(page)) { page="home"; reRender(); return; }
  if(page === "product") { page="home"; reRender(); return; }
};

function productCardHTML(p, idx) {
  const disc = calcDiscount(p);
  return `
    <div class="product-card" data-pid="${p.id}">
      <div class="product-img-carousel" id="carousel-${p.id}">
        <button class="carousel-arrow left" style="display:none">&lt;</button>
        <img src="${p.images[0]}" alt="${getProductName(p)}">
        <button class="carousel-arrow right"${p.images.length<=1?' style="display:none"':''}>&gt;</button>
        <div class="carousel-dots">
          ${p.images.map((_,i) => `<span class="carousel-dot${i===0?" active":""}"></span>`).join("")}
        </div>
      </div>
      <button class="badge-like" onclick="event.stopPropagation();toggleFav(${p.id});">${favs.includes(p.id)?"❤️":"🤍"}</button>
      ${disc?`<div class="badge-discount">-${disc}%</div>`:""}
      <button class="cart-add-btn" onclick="event.stopPropagation();addToCart(${p.id});">&#128722;</button>
      <div class="product-info" onclick="openProduct(${p.id})" style="cursor:pointer">
        <div class="product-name">${getProductName(p)}</div>
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
  // Kartochka bosilganda batafsil ochilsin
  img.onclick = (ev) => { ev.stopPropagation(); openProduct(p.id); };
}

function renderHome() {
  renderHeader();
  document.getElementById("main").innerHTML = `
    <div class="amazing-banner">
      <img src="https://i.imgur.com/E3pTjYc.jpg" alt="Amazing Store">
      <div class="amazing-title">AMAZING STORE</div>
    </div>
    <div class="banner-carousel">
      <div class="banner active"><img src="https://i.imgur.com/3OaQ4yB.jpg"></div>
      <div class="banner"><img src="https://i.imgur.com/6z6OMa0.jpg"></div>
    </div>
    <div class="product-grid">${products.map(productCardHTML).join("")}</div>
  `;
  products.forEach((p,i) => setupCardCarousel(p,i));
}
function renderCategory() {
  renderHeader({title:t('categories'), showBack:true});
  document.getElementById("main").innerHTML = `
    <div class="cat-grid">
      ${categories.map(cat => `
        <div class="cat-card" onclick="openCategory(${cat.id})">
          <span class="cat-emoji">${CATEGORY_ICONS[cat.id]}</span>
          <div class="cat-name">${getCategoryName(cat)}</div>
        </div>
      `).join("")}
    </div>
  `;
}
window.openCategory = function(cid) {
  renderHeader({title:getCategoryName(categories.find(c=>c.id===cid)), showBack:true});
  document.getElementById("main").innerHTML = `
    <div class="product-grid">
      ${products.filter(p=>p.category===cid).map((p,i) => productCardHTML(p,i)).join("")}
    </div>
  `;
  products.filter(p=>p.category===cid).forEach((p,i) => setupCardCarousel(p,i));
}
function renderFavorites() {
  renderHeader({title:t('favorites'), showBack:true});
  document.getElementById("main").innerHTML = `
    <div class="product-grid">
      ${products.filter(p=>favs.includes(p.id)).map((p,i) => productCardHTML(p,i)).join("")}
    </div>
  `;
  products.filter(p=>favs.includes(p.id)).forEach((p,i)=>setupCardCarousel(p,i));
}
function renderCart() {
  renderHeader({title:t('cart'), showBack:true});
  const cartItems = products.filter(p=>cart.includes(p.id));
  document.getElementById("main").innerHTML = `
    <div class="cart-page-header">${t('cart')} <span style="font-weight:400;font-size:0.97em;margin-left:5px;">${cartItems.length} ${t('cart_item')}</span></div>
    <div class="cart-list">
      ${cartItems.length?cartItems.map(cartCardHTML).join(""):`<div style="padding:18px 0 0 18px;color:#888;">${t('empty_cart')}</div>`}
    </div>
    ${cartItems.length?cartBottomBtns(cartItems):""}
  `;
}
function cartCardHTML(p) {
  const disc = calcDiscount(p);
  return `
    <div class="cart-card">
      <img src="${p.images[0]}" alt="">
      <div class="cart-card-content">
        <div class="cart-card-title">${getProductName(p)}</div>
        <div class="cart-card-price">${p.price.toLocaleString('uz-UZ')} so'm</div>
        <div style="font-size:0.98em;color:#555;">${getProductDesc(p)}</div>
      </div>
      <button class="badge-like" onclick="toggleFav(${p.id});event.stopPropagation();">${favs.includes(p.id)?"❤️":"🤍"}</button>
      <button class="cart-remove-btn" onclick="removeFromCart(${p.id});event.stopPropagation();">&times;</button>
      ${disc?`<div class="badge-discount" style="left:10px;top:10px;right:auto;bottom:auto;">-${disc}%</div>`:""}
    </div>
  `;
}
function cartBottomBtns(cartItems) {
  const first = cartItems[0];
  return `
    <div class="cart-bottom-btns">
      <button class="cart-bottom-btn" onclick="window.open('${first.uzum_url}','_blank')">
        <img src="https://seeklogo.com/images/U/uzum-logo-1E2B21E357-seeklogo.com.png" style="width:22px;vertical-align:middle;margin-right:7px;">${t('uzum_buy')}
      </button>
      <button class="cart-bottom-btn" onclick="window.open('${first.yandex_url}','_blank')">
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Yandex_logo_icon.svg" style="width:22px;vertical-align:middle;margin-right:7px;">${t('yandex_buy')}
      </button>
    </div>
  `;
}
window.openProduct = function(pid) {
  page = "product";
  currentProductId = pid;
  reRender();
}
function renderProductFull(pid) {
  const p = products.find(pr=>pr.id===pid);
  if(!p) return;
  renderHeader();
  document.getElementById("main").innerHTML = `
    <div class="full-modal" id="fullProductModal">
      <div class="modal-header">
        <button class="back-btn" onclick="goBack()">&larr;</button>
        <div style="flex:1"></div>
        <button class="badge-like" onclick="toggleFav(${p.id});event.stopPropagation();">${favs.includes(p.id)?"❤️":"🤍"}</button>
      </div>
      <div class="carousel-wrap" id="prodCarousel"></div>
      <div class="modal-content">
        <div class="product-title">${getProductName(p)}</div>
        <div class="price-row">
          <span class="price-main">${p.price.toLocaleString('uz-UZ')} so'm</span>
          ${p.old_price ? `<span class="price-old">${p.old_price.toLocaleString('uz-UZ')} so'm</span>` : ""}
          ${calcDiscount(p)?`<span class="badge-discount">-${calcDiscount(p)}%</span>`:""}
        </div>
        <div class="product-desc">${getProductDesc(p)}</div>
      </div>
      <div class="sticky-btns">
        <button class="main-btn" onclick="showBuySheet(${p.id})">${t('buy_now')}</button>
        <button class="cart-btn" onclick="addToCart(${p.id})">${t('add_to_cart')}</button>
      </div>
    </div>
  `;
  setupProductCarousel(p);
}
function setupProductCarousel(p) {
  let idx = 0;
  const carouselDiv = document.getElementById("prodCarousel");
  function update() {
    carouselDiv.innerHTML = `
      <div class="product-img-carousel">
        <button class="carousel-arrow left"${idx===0?' style="display:none"':''}>&lt;</button>
        <img src="${p.images[idx]}" alt="">
        <button class="carousel-arrow right"${idx===p.images.length-1?' style="display:none"':''}>&gt;</button>
        <div class="carousel-dots">
          ${p.images.map((_,i) => `<span class="carousel-dot${i===idx?" active":""}"></span>`).join("")}
        </div>
      </div>
    `;
    const img = carouselDiv.querySelector("img");
    const leftBtn = carouselDiv.querySelector(".carousel-arrow.left");
    const rightBtn = carouselDiv.querySelector(".carousel-arrow.right");
    const dots = carouselDiv.querySelectorAll(".carousel-dot");
    leftBtn.onclick = ()=>{ if(idx>0){idx--;update();}};
    rightBtn.onclick = ()=>{ if(idx<p.images.length-1){idx++;update();}};
    dots.forEach((dot,i)=>dot.onclick=()=>{idx=i;update();});
  }
  update();
}
window.toggleFav = function(pid) {
  if(favs.includes(pid)) favs = favs.filter(id=>id!==pid);
  else favs.push(pid);
  reRender();
}
window.addToCart = function(pid) {
  if(!cart.includes(pid)) cart.push(pid);
  updateCartBadge();
  reRender();
}
window.removeFromCart = function(pid) {
  cart = cart.filter(id=>id!==pid);
  updateCartBadge();
  reRender();
}
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if(cart.length > 0) {
    badge.style.display = "flex";
    badge.innerText = cart.length;
  } else {
    badge.style.display = "none";
  }
}
document.getElementById("nav-home").onclick = ()=>{page="home";reRender();};
document.getElementById("nav-category").onclick = ()=>{page="category";reRender();};
document.getElementById("nav-favorites").onclick = ()=>{page="favorites";reRender();};
document.getElementById("nav-cart").onclick = ()=>{page="cart";reRender();};
reRender();
