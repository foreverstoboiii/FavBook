// opensearch.js — улучшенный и разделённый UI с поддержкой языка
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchfav');
  if (!searchInput) {
    console.error('opensearch.js: элемент #searchfav не найден на странице.');
    return;
  }

  const statusBar = document.getElementById('search-status');
  const resultsContainer = document.getElementById('search-results');

  let timer = null;
  const MIN_LEN = 3;
  const DELAY = 500;

  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    const q = searchInput.value.trim();

    if (q.length < MIN_LEN) {
      // Используем перевод
      if (translations && translations[currentLang] && translations[currentLang].minChars) {
        statusBar.textContent = translations[currentLang].minChars.replace("{min}", MIN_LEN);
      } else {
        statusBar.textContent = `Введите не менее ${MIN_LEN} символов для поиска...`;
      }
      resultsContainer.innerHTML = '';
      return;
    }

    statusBar.textContent = '';
    timer = setTimeout(() => {
      doSearch(q);
    }, DELAY);
  });

  async function doSearch(query) {
    // Перевод текста "Поиск «...»..."
    if (translations && translations[currentLang] && translations[currentLang].searching) {
      statusBar.textContent = translations[currentLang].searching.replace("{query}", query);
    } else {
      statusBar.textContent = `Поиск «${query}»...`;
    }

    resultsContainer.innerHTML = '';

    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`OpenLibrary ответ ${resp.status}`);
      const data = await resp.json();
      renderResults(data.docs || [], query, data.numFound);
    } catch (err) {
      console.error('opensearch: ошибка запроса', err);
      statusBar.textContent = `Ошибка: ${String(err.message || err)}`;
    }
  }

  function renderResults(docs, query, numFound) {
  if (!docs || docs.length === 0) {
    statusBar.textContent = translations?.[currentLang]?.notFound?.replace("{query}", query) 
      || `По запросу «${query}» ничего не найдено`;
    resultsContainer.innerHTML = '';
    return;
  }

  statusBar.textContent = translations?.[currentLang]?.resultsFound?.replace("{num}", numFound)
    || `${numFound.toLocaleString()} результатов по поиску`;

  resultsContainer.innerHTML = docs.slice(0, 10).map(doc => {
    const title = doc.title || translations?.[currentLang]?.noTitle || 'Без названия';
    const author = (doc.author_name && doc.author_name.length) 
      ? doc.author_name[0] 
      : translations?.[currentLang]?.unknownAuthor || 'Неизвестный автор';
    const year = doc.first_publish_year || ''; // ← теперь всегда span, без "•"

    return `
      <div class="list-item">
        <div class="book-info" title="${title} - ${author}">
          <span class="book-title">${title}</span>
          <span class="book-author">${author}</span>
        </div>
        <div class="book-meta">
          <span class="book-year">${year}</span>
          <button class="add-btn px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-blue-700">Add</button>
        </div>
      </div>
    `;
  }).join('');
}


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;

  const item = btn.closest(".list-item");
  const title = item.querySelector(".book-title")?.textContent || '';
  const author = item.querySelector(".book-author")?.textContent || '';
  const year = item.querySelector(".book-year")?.textContent || '';

  const newBook = {
    name: title,
    author: author,
    year: year,
    date: new Date().toLocaleDateString(),
    favorite: false
  };

  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.push(newBook);
  localStorage.setItem("books", JSON.stringify(books));

  // Временно убери, если нет такой функции:
  // renderBookList();

  console.log("Книга добавлена из поиска:", newBook);
});



  console.log('opensearch.js загружен — слушаю #searchfav');
});


