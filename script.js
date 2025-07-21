// ===== ИНИЦИАЛИЗАЦИЯ =====
let books = JSON.parse(localStorage.getItem("books")) || []; // Массив для хранения книг

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Заглавная первая буква, остальные строчные
function capitalize(str) {
    if (!str) return ""; 
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ====== АЛЕРТЫ (модальные сообщения) ======

function showAlert(message) {
    document.getElementById('alert-text').textContent = message;
    document.getElementById('custom-alert').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

// ====== ДОБАВЛЕНИЕ КНИГИ ======

function addlist() {
    const input = document.getElementById("inputfav");
    const aythor = document.getElementById("authorfav");

    const value = capitalize(input.value.trim());
    const authoral = aythor.value.trim().toUpperCase();

    // Проверка на пустые поля
    if (value === "" || authoral === "") {
        showAlert(translations[currentLang]["fillFields"]);
        return;
    }

    // Добавление новой книги в массив
    books.push({
        name: value,
        author: authoral,
        date: new Date().toLocaleDateString(),
        favourite: false
    });

    // Обновление данных
    localStorage.setItem("books", JSON.stringify(books));
    input.value = "";
    aythor.value = "";
    renderBooks();
    updateCount();
}

// ====== РЕНДЕР СПИСКА КНИГ ======

function renderBooks(array = books) {
    const list = document.getElementById("list");
    list.innerHTML = ""; // Очищаем перед отрисовкой

  

    array.forEach((book, index) => {
        const li = document.createElement("li");
    
        li.innerHTML = `
          <div class="flex justify-between items-center w-full gap-4 px-2 py-[10px] rounded text-sm">
            <div class="flex flex-col" title="${book.name} - ${book.author}">
              <span class="text-white truncate max-w-[100px] block">${book.name}</span>
              <span class="text-gray-400 truncate max-w-[100px] block">${book.author}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xs text-gray-500">${book.date}</span>
              <button class="favorite-btn text-2xl ${book.favorite ? 'text-yellow-400' : 'text-gray-500'} hover:scale-80 transition duration-150 ease-in-out outline-none border-none">
                ${book.favorite ? "★" : "☆"}
              </button>
            </div>
          </div>
        `;

        // ⭐ Обработчик избранного (звёздочки)
        const favBtn = li.querySelector(".favorite-btn");
        favBtn.onclick = () => {
            book.favorite = !book.favorite;
            localStorage.setItem("books", JSON.stringify(books));
            renderBooks();
        };

        // Кнопка удаления книги
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = translations[currentLang]["delete"];
        deleteBtn.className = "bg-transparent text-[#cc4c4c]  border border-[#cc4c4c]  px-3 py-1.5 text-[13px] rounded cursor-pointer transition-all duration-200 hover:text-white hover:bg-[rgba(170,79,79,0.08)] hover:border-[#e06666]";

        deleteBtn.onclick = () => {
            books.splice(index, 1); // удаление из массива
            localStorage.setItem("books", JSON.stringify(books));
            updateCount();
            renderBooks();
        };

        li.appendChild(deleteBtn); // добавляем кнопку в элемент
        list.appendChild(li);      // добавляем элемент в список
    });
  
    
}



// ====== КОЛИЧЕСТВО КНИГ ======

function updateCount() {
    const colvo = document.getElementById('count');
    colvo.textContent = `${translations[currentLang]["amount"]} ${books.length}`;
}

// ====== ПОИСК КНИГ ======

const searchInput = document.getElementById("searchfav");

searchInput.addEventListener("keyup", function () {
    const query = this.value.toLowerCase();

    const filtered = books.filter(book =>
        book.name.toLowerCase().includes(query)
    );

    renderBooks(filtered);
});

// ====== ENTER ДЛЯ ДОБАВЛЕНИЯ ======

function handleEnter(event) {
    if (event.key === "Enter") {
        addlist();
    }
}

document.getElementById("inputfav").addEventListener("keypress", handleEnter);
document.getElementById("authorfav").addEventListener("keypress", handleEnter);

// ====== СМЕНА ТЕМЫ ======

const togglebutton = document.getElementById('themetoggle');
const savedTheme = localStorage.getItem('theme');

// Установка темы при загрузке
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    togglebutton.innerHTML = '<i class="fas fa-moon"></i>';
} else {
    document.body.classList.remove('dark-mode');
    togglebutton.innerHTML = '<i class="fas fa-sun"></i>';
}

// Переключение темы
togglebutton.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        togglebutton.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        togglebutton.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// ====== ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ======



// ====== ПОГОДА ======

const apiKey = "46afcd23583e35a84347955fc1caeeb1";
const city = "Tashkent";

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        const temp = Math.round(data.main.temp);
        const weather = `${data.name}: ${temp}°C`;

        document.getElementById("weather").innerHTML = `
          <img src="${icon}" alt="weather icon">
          <span>${weather}</span>
        `;
    })
    .catch(err => {
        document.getElementById("weather").textContent = "⚠️ Погода недоступна";
    });
