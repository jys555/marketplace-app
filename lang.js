const LANGS = {
  uz: {
    home: "Bosh sahifa",
    cart: "Savat",
    buy_now: "Hozir sotib olish",
    add_to_cart: "Savatga",
    categories: "Kategoriyalar",
    favorites: "Sevimlilar",
    back: "Orqaga",
    uzum_buy: "Uzum orqali sotib olish",
    yandex_buy: "Yandex orqali sotib olish",
    empty_cart: "Savat bo'sh",
    remove: "Chiqarish",
    cart_item: "ta tovar",
  },
  ru: {
    home: "Главная",
    cart: "Корзина",
    buy_now: "Купить сейчас",
    add_to_cart: "В корзину",
    categories: "Категории",
    favorites: "Избранное",
    back: "Назад",
    uzum_buy: "Купить через Uzum",
    yandex_buy: "Купить через Яндекс",
    empty_cart: "Корзина пуста",
    remove: "Удалить",
    cart_item: "товар(ов)",
  }
};
let currentLang = "uz";
function t(key) { return LANGS[currentLang][key] || key; }
