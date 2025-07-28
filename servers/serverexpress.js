// servers/serverexpress.js
const express = require('express');
const path = require('path');

const app = express();

// Обслуживаем все статические файлы из корня проекта
app.use(express.static(path.join(__dirname, '..')));

// Порт
const PORT = 3000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Express server is running at: http://localhost:${PORT}`);
});
