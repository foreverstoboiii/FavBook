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
      if (translations && translations[currentLang] && translations[currentLang].notFound) {
        statusBar.textContent = translations[currentLang].notFound.replace("{query}", query);
      } else {
        statusBar.textContent = `По запросу «${query}» ничего не найдено`;
      }
      resultsContainer.innerHTML = '';
      return;
    }

    // Перевод "X результатов по поиску"
    if (translations && translations[currentLang] && translations[currentLang].resultsFound) {
      statusBar.textContent = translations[currentLang].resultsFound.replace("{num}", numFound);
    } else {
      statusBar.textContent = `${numFound ? numFound.toLocaleString() + ' результатов по поиску' : ''}`;
    }

    resultsContainer.innerHTML = docs.slice(0, 10).map(doc => {
      const title = doc.title ? doc.title : translations[currentLang]?.noTitle || 'Без названия';
      const author = (doc.author_name && doc.author_name.length) ? doc.author_name[0] : translations[currentLang]?.unknownAuthor || 'Неизвестный автор';
      const year = doc.first_publish_year ? ` • ${doc.first_publish_year}` : '';

      return `
        <div class="list-item">
          <div class="book-info" title="${title} - ${author}">
            <span class="book-title">${title}</span>
            <span class="book-author">${author}</span>
          </div>
          <div class="book-meta">
            <span class="book-year">${year}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  resultsContainer.addEventListener('click', async (e) => {
    const btn = e.target.closest('.add-from-search');
    if (!btn) return;
    const title = decodeURIComponent(btn.dataset.title || '');
    const author = decodeURIComponent(btn.dataset.author || '');
    const cover = decodeURIComponent(btn.dataset.cover || '');
    await addBookFromSearch({ title, author, cover });
  });

  async function addBookFromSearch({ title, author, cover }) {
    try {
      if (typeof window.addlist === 'function') {
        window.addlist(title, author);
        alert(translations[currentLang]?.addedViaAddlist || 'Добавлено через addlist()');
        return;
      }

      const payload = {
        id: Date.now(),
        name: title || translations[currentLang]?.untitled || 'Untitled',
        author: author || '',
        cover: cover || '',
        favourite: false
      };

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Сервер вернул ' + res.status);
      alert(translations[currentLang]?.savedOnServer || 'Книга сохранена на сервере (db.json). Обновите список, если нужно.');
    } catch (err) {
      console.error('opensearch: не удалось добавить книгу', err);
      alert((translations[currentLang]?.addError || 'Ошибка добавления книги: ') + (err.message || err));
    }
  }

  console.log('opensearch.js загружен — слушаю #searchfav');
});


