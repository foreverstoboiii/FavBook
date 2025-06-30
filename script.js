let books = JSON.parse(localStorage.getItem("books")) || []; // Массив для хранения книг

function capitalize(str) {
    if (!str) return ""; // если строка пустая
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


function showAlert(message) {
  // Вставляем текст
  document.getElementById('alert-text').textContent = message;

  // Показываем модальное окно
  document.getElementById('custom-alert').style.display = 'flex';
}

function closeAlert() {
  // Скрываем окно
  document.getElementById('custom-alert').style.display = 'none';
}


function addlist() {
    const input = document.getElementById("inputfav");            // Поле названия
    const aythor = document.getElementById("authorfav");          // Поле автора
    const value = capitalize(input.value.trim());
    const authoral = aythor.value.trim().toUpperCase();


 
    if (value === "" || authoral === "") {
        showAlert("Please fill in both fields!");                 // Проверка на пустоту
        return;
    };                                                            // Проверка на пустоту

    books.push({
        name: value,
        author: authoral
    });

    localStorage.setItem("books", JSON.stringify(books));         // Сохраняем в localStorage
    input.value = ""; 
    aythor.value = "";
    renderBooks();    
    updateCount()                                                 // Отображаем список заново
}

function renderBooks() {
    const list = document.getElementById("list");                 // <ul> или <div>
    list.innerHTML = "";                                          // Очищаем перед отрисовкой

    books.forEach((book, index) => {
        const li = document.createElement("li");                  // создаём <li>
        li.textContent = `${book.name} (${book.author})`;         // вставляем текст

        const deleteBtn = document.createElement("button");       // создаём кнопку
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            books.splice(index, 1);                               // удаляем из массива
            localStorage.setItem("books", JSON.stringify(books)); // обновляем хранилище
            updateCount()
            renderBooks();                                        // заново отображаем
        };

        li.appendChild(deleteBtn);                                // кнопка внутрь <li>
        list.appendChild(li);                                     // <li> внутрь <ul>
    });
}

function handleEnter(event) {
    if (event.key === "Enter") {
        addlist();
    }
}

document.getElementById("inputfav").addEventListener("keypress", handleEnter);
document.getElementById("authorfav").addEventListener("keypress", handleEnter);



function updateCount(){
    let colvo = document.getElementById('count')
    colvo.textContent = `Amount: ${books.length}`;

}











// ====== Тёмная / светлая тема ======
const togglebutton = document.getElementById('themetoggle');      // Кнопка смены темы
const savedTheme = localStorage.getItem('theme');                 // Проверяем, была ли сохранена тема

// При загрузке страницы — устанавливаем нужную тему
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode'); // Включаем тёмную тему
    togglebutton.innerHTML = '<i class="fas fa-moon"></i>'; // Иконка луны
} else {
    document.body.classList.remove('dark-mode'); // Светлая тема
    togglebutton.innerHTML = '<i class="fas fa-sun"></i>'; // Иконка солнца
}

// При нажатии на кнопку переключаем тему
togglebutton.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode'); // Включаем/выключаем класс

    if (document.body.classList.contains('dark-mode')) {
        togglebutton.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark'); // Сохраняем тему как "dark"
    } else {
        togglebutton.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light'); // Сохраняем тему как "light"
    }
});




renderBooks(); // Показываем книги при загрузке страницы
updateCount()




const apiKey = "46afcd23583e35a84347955fc1caeeb1"; // апи
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

