// opensearch.js — улучшенный и разделённый UI
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchfav');
  if (!searchInput) {
    console.error('opensearch.js: элемент #searchfav не найден на странице.');
    return;
  }

  /// создаём статусбар
const statusBar = document.createElement('div');
statusBar.id = 'search-status';
statusBar.className = 'mt-2 text-sm text-gray-400';

// создаём контейнер для результатов
const resultsContainer = document.createElement('div');
resultsContainer.id = 'search-results';
resultsContainer.className = 'mt-4 space-y-3';

// вставляем: сначала статус, потом результаты
const wrapper = searchInput.closest('.relative') || searchInput.parentNode;
wrapper.insertAdjacentElement('afterend', statusBar);
statusBar.insertAdjacentElement('afterend', resultsContainer);


  let timer = null;
  const MIN_LEN = 3;
  const DELAY = 500;

  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    const q = searchInput.value.trim();

    if (q.length < MIN_LEN) {
      statusBar.textContent = `Введите не менее ${MIN_LEN} символов для поиска...`;
      resultsContainer.innerHTML = '';
      return;
    }

    statusBar.textContent = '';
    timer = setTimeout(() => {
      doSearch(q);
    }, DELAY);
  });

  async function doSearch(query) {
    statusBar.textContent = `Поиск «${escapeHtml(query)}»...`;
    resultsContainer.innerHTML = '';

    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`OpenLibrary ответ ${resp.status}`);
      const data = await resp.json();
      renderResults(data.docs || [], query, data.numFound);
    } catch (err) {
      console.error('opensearch: ошибка запроса', err);
      statusBar.textContent = `Ошибка: ${escapeHtml(String(err.message || err))}`;
    }
  }

  function renderResults(docs, query, numFound) {
    if (!docs || docs.length === 0) {
      statusBar.textContent = `По запросу «${escapeHtml(query)}» ничего не найдено`;
      resultsContainer.innerHTML = '';
      return;
    }

    statusBar.textContent = `${numFound ? numFound.toLocaleString() + ' результатов' : ''}`;
    resultsContainer.innerHTML = docs.slice(0, 10).map(doc => {
      const title = doc.title ? escapeHtml(doc.title) : 'Без названия';
      const author = (doc.author_name && doc.author_name.length) ? escapeHtml(doc.author_name[0]) : 'Неизвестный автор';
      const year = doc.first_publish_year ? ` • ${escapeHtml(String(doc.first_publish_year))}` : '';
      const cover = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : 'https://via.placeholder.com/80x120?text=No+Cover';

      const safeTitle = encodeURIComponent(doc.title || '');
      const safeAuthor = encodeURIComponent(doc.author_name ? doc.author_name[0] : '');
      const safeCover = encodeURIComponent(cover);

      return `
        <div class="flex gap-4 items-center border border-[#2a2d2f] bg-[#202324] rounded-lg p-3 hover:bg-[#26292b] transition">
          <img src="${cover}" loading="lazy" alt="${title}" class="w-[55px] h-[80px] object-cover rounded-md"/>
          <div class="flex-1">
            <div class="text-sm font-semibold text-white">${title}</div>
            <div class="text-xs text-gray-400">${author}${year}</div>
          </div>
          <div>
            <button 
              class="add-from-search px-3 py-1.5 text-xs rounded-lg bg-[#2e3133] border border-[#444] text-gray-200 hover:bg-[#3a3d3f] active:scale-95 transition"
              data-title="${safeTitle}" 
              data-author="${safeAuthor}" 
              data-cover="${safeCover}">
              Add
            </button>
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
    console.log('opensearch: добавить книгу', { title, author, cover });
    await addBookFromSearch({ title, author, cover });
  });

  async function addBookFromSearch({ title, author, cover }) {
    try {
      if (typeof window.addlist === 'function') {
        window.addlist(title, author);
        alert('Добавлено через addlist()');
        return;
      }

      const payload = {
        id: Date.now(),
        name: title || 'Untitled',
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
      alert('Книга сохранена на сервере (db.json). Обновите список, если нужно.');
    } catch (err) {
      console.error('opensearch: не удалось добавить книгу', err);
      alert('Ошибка добавления книги: ' + (err.message || err));
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  console.log('opensearch.js загружен — слушаю #searchfav');
});
