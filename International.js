const translations = {
  en: {
    title: "Favourite Books",
    booksname: "Add your favourite book here...",
    author: "Add the author here...",
    searchbar: "Search for a book...",
    add: "Add",
    amount: "Total books:",
    delete: "Delete",
    modalTitle: "Attention!",
    fillFields: "Please fill in both fields!",
    cit: "Tashkent"
  },
  ru: {
    title: "Избранные книги",
    booksname: "Добавьте вашу любимую книгу...",
    author: "Добавьте автора здесь...",
    searchbar: "Поиск книги...",
    add: "Добавить",
    amount: "Всего книг: ",
    delete: "Удалить",
    modalTitle: "Внимание!",
    fillFields: "Пожалуйста, заполните оба поля!",
    cit: "Ташкент"
  }
};

let currentLang = "en"; // начальный язык

function updateTranslations() {
  const elements = document.querySelectorAll("[data-i18n], [data-i18n-placeholder]");

  elements.forEach((el) => {
    const key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-placeholder");
    const translation = translations[currentLang][key];
    if (!translation) return;

    // Обновляем placeholder для input
    if (el.tagName === "INPUT" && el.placeholder !== undefined) {
      el.placeholder = translation;
    } else {
      el.textContent = translation;
    }
  });

  // Обновляем список и количество книг (если зависит от языка)
  if (typeof renderBooks === 'function') renderBooks();
  if (typeof updateCount === 'function') updateCount();

  // Обновляем иконку флага
  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) {
    const flag = currentLang === "en" ? "gb" : "ru";
    toggleBtn.innerHTML = `<img src="images/${flag}.png" alt="${flag} flag" width="24" height="24">`;
  }
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "ru" : "en";
  localStorage.setItem("lang",currentLang);
  updateTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
     const savedLang = localStorage.getItem("lang");
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  }
  updateTranslations();

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", toggleLanguage);
  }
});
