document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");

  document.getElementById("home").addEventListener("click", () => {
    content.innerHTML = "<h2>Bosh Sahifa</h2><p>Trend mahsulotlar va bannerlar.</p>";
  });

  document.getElementById("category").addEventListener("click", () => {
    content.innerHTML = "<h2>Kategoriya Sahifasi</h2><p>Bu yerda kategoriyalar ko'rinadi.</p>";
  });

  document.getElementById("favorites").addEventListener("click", () => {
    content.innerHTML = "<h2>Sevimlilar</h2><p>Foydalanuvchi like bosgan mahsulotlar.</p>";
  });
});
