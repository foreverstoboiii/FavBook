// =======================
// servers/serverexpress.js
// =======================

// Подключаем зависимости
const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");

const app = express();
const PORT = 3000;
const dbpath = path.join(__dirname, '../db.json');


// =======================
// Middleware
// =======================

// Для работы с JSON (fetch / axios / postman)
app.use(express.json());

// Для работы с формами (POST с form-urlencoded)
app.use(express.urlencoded({ extended: true }));


// =======================
// API маршруты
// =======================

// Получить все книги
app.get('/api/books', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  res.json(db.books);
});


// =======================
// Страница логина
// =======================

// GET: форма логина
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html_templates/login.html'));
});

// Статика: css, js, изображения и другие файлы
app.use(express.static(path.join(__dirname, '..')));

// POST: обработка логина
app.post('/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { email, password } = req.body;

  if (email && password) {
    // Логин успешный → редирект на index.html в корне
    res.redirect('/index.html');
  } else {
    // Логин неудачный → остаемся на странице логина
    res.redirect('/');
  }
});


// =======================
// API: книги
// =======================

// Добавить книгу
app.post('/api/books', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  const newBook = req.body;
  newBook.id = Date.now(); // создаем уникальный ID
  db.books.push(newBook);
  fs.writeFileSync(dbpath, JSON.stringify(db, null, 2));
  res.json(newBook);
});

// Удалить книгу по ID
app.delete('/api/books/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  const id = Number(req.params.id);
  db.books = db.books.filter(book => book.id !== id);
  fs.writeFileSync(dbpath, JSON.stringify(db, null, 2));
  res.json({ message: 'Книга удалена' });
});

// Обновить книгу по ID (например, обновить избранное)
app.patch('/api/books/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  const id = Number(req.params.id);
  const updatedData = req.body;

  console.log('ID from URL:', req.params.id);
  console.log('Parsed ID:', id);
  console.log('All IDs in DB:', db.books.map(b => b.id));

  const bookIndex = db.books.findIndex(book => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Книга не найдена' });
  }

  // Обновляем только переданные поля
  db.books[bookIndex] = { ...db.books[bookIndex], ...updatedData };
  fs.writeFileSync(dbpath, JSON.stringify(db, null, 2));
  res.json(db.books[bookIndex]);
});


// =======================
// Обработка 404
// =======================
// Должна идти в самом конце
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../html_templates/error.html'));
});


// =======================
// Запуск сервера
// =======================
app.listen(PORT, () => {
  console.log(`✅ Express server is running at: http://localhost:${PORT}`);
 exec(`start http://localhost:${PORT}`); // Windows
});
