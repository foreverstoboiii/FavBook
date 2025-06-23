let books = JSON.parse(localStorage.getItem("books")) || []; // Массив для хранения книг

function capitalize(str) {
    if (!str) return ""; // если строка пустая
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addlist() {
    const input = document.getElementById("inputfav");       // Поле названия
    const aythor = document.getElementById("authorfav");     // Поле автора
    const value = capitalize(input.value.trim());
    const authoral = capitalize(aythor.value.trim());


    if (value === "" || authoral === "") {
        alert("Please fill in both fields!"); // Проверка на пустоту
        return;
    };             // Проверка на пустоту

    books.push({
        name: value,
        author: authoral
    });

    localStorage.setItem("books", JSON.stringify(books));    // Сохраняем в localStorage
    input.value = "";
    aythor.value = "";
    renderBooks();                                            // Отображаем список заново
}

function renderBooks() {
    const list = document.getElementById("list");             // <ul> или <div>
    list.innerHTML = "";                                      // Очищаем перед отрисовкой

    books.forEach((book, index) => {
        const li = document.createElement("li");              // создаём <li>
        li.textContent = `${book.name} (${book.author})`;     // вставляем текст

        const deleteBtn = document.createElement("button");   // создаём кнопку
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            books.splice(index, 1);                            // удаляем из массива
            localStorage.setItem("books", JSON.stringify(books)); // обновляем хранилище
            renderBooks();                                    // заново отображаем
        };

        li.appendChild(deleteBtn);                            // кнопка внутрь <li>
        list.appendChild(li);                                 // <li> внутрь <ul>
    });
}

function handleEnter(event) {
    if (event.key === "Enter") {
        addlist();
    }
}

document.getElementById("inputfav").addEventListener("keypress", handleEnter);
document.getElementById("authorfav").addEventListener("keypress", handleEnter);


renderBooks(); // Показываем книги при загрузке страницы
