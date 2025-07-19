const CATEGORY_ICONS = {
  1: "🎧",
  2: "📱",
  3: "💻",
  4: "⌚"
};
const categories = [
  { id: 1, name_uz: "Quloqchinlar", name_ru: "Наушники" },
  { id: 2, name_uz: "Smartfonlar", name_ru: "Смартфоны" },
  { id: 3, name_uz: "Noutbuklar", name_ru: "Ноутбуки" },
  { id: 4, name_uz: "Soatlar", name_ru: "Часы" }
];
const products = [
  {
    id: 1,
    name_uz: "Simsiz Bluetooth quloqchinlar P9, mikrofonli",
    name_ru: "Беспроводные наушники P9 с микрофоном",
    desc_uz: "Yuqori sifatli ovoz va mikrofon. 84% chegirma!",
    desc_ru: "Высокое качество звука и микрофон. Скидка 84%!",
    price: 47990,
    old_price: 299000,
    images: [
      "https://i.imgur.com/eIYpA2x.jpg",
      "https://i.imgur.com/h7p8e9F.jpg",
      "https://i.imgur.com/4c3Ff6m.jpg"
    ],
    uzum_url: "https://uzum.uz/product/1",
    yandex_url: "https://market.yandex.uz/product/1",
    favorite: false,
    category: 1
  },
  {
    id: 2,
    name_uz: "Kalonka JBL Black Qulay",
    name_ru: "Колонка JBL Black Qulay",
    desc_uz: "61% chegirma! Kuchli ovoz, zamonaviy dizayn.",
    desc_ru: "Скидка 61%! Мощный звук, современный дизайн.",
    price: 65550,
    old_price: 168000,
    images: [
      "https://i.imgur.com/7p8uH2B.jpg",
      "https://i.imgur.com/V8p5x4e.jpg"
    ],
    uzum_url: "https://uzum.uz/product/2",
    yandex_url: "https://market.yandex.uz/product/2",
    favorite: false,
    category: 1
  },
  {
    id: 3,
    name_uz: "Simsiz quloqchinlar Pods 3 air",
    name_ru: "Беспроводные наушники Pods 3 air",
    desc_uz: "57% chegirma. Uzoq batareya, kuchli Bluetooth.",
    desc_ru: "Скидка 57%. Долгая батарея, мощный Bluetooth.",
    price: 85500,
    old_price: 199000,
    images: [
      "https://i.imgur.com/YR1kXw5.jpg",
      "https://i.imgur.com/gXyo4Gl.jpg"
    ],
    uzum_url: "https://uzum.uz/product/3",
    yandex_url: "https://market.yandex.uz/product/3",
    favorite: false,
    category: 1
  }
];
