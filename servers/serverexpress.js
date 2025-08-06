// servers/serverexpress.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;
const dbpath = path.join(__dirname, '../db.json');


app.use(express.json());

// Обслуживаем все статические файлы из корня проекта
app.use(express.static(path.join(__dirname, '..')));

app.get('/api/books', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  res.json(db.books);
})

// API: добавить книгу
app.post('/api/books', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  const newBook = req.body;
  newBook.id = Date.now(); // уникальный ID
  db.books.push(newBook);
  fs.writeFileSync(dbpath, JSON.stringify(db, null, 2));
  res.json(newBook);
});

// API: удалить книгу по ID
app.delete('/api/books/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  const id = Number(req.params.id);
  db.books = db.books.filter(book => book.id !== id);
  fs.writeFileSync(dbpath, JSON.stringify(db, null, 2));
  res.json({ message: 'Книга удалена' });
});

// API: обновить книгу (например, обновить избранное)
app.patch('/api/books/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbpath, 'utf-8'));
  const id = Number(req.params.id);
  const updatedData = req.body;

  const bookIndex = db.books.findIndex(book => book.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Книга не найдена' });
  }

  // Обновляем только те поля, которые были переданы
  db.books[bookIndex] = { ...db.books[bookIndex], ...updatedData };

  fs.writeFileSync(dbpath, JSON.stringify(db, null, 2));
  res.json(db.books[bookIndex]);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Express server is running at: http://localhost:${PORT}`);
});
