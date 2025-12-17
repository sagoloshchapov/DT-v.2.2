// Исправленный сервер для диалогового тренажера
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.url}`);
  
  // Health check для Render.com
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }
  
  // Определяем тип файла по расширению
  let filePath = '';
  let contentType = 'text/html';
  
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'index.html');
  } else if (req.url === '/style.css') {
    filePath = path.join(__dirname, 'style.css');
    contentType = 'text/css';
  } else if (req.url === '/app.js') {
    filePath = path.join(__dirname, 'app.js');
    contentType = 'application/javascript';
  } else {
    // Если файл не найден - отдаем index.html
    filePath = path.join(__dirname, 'index.html');
  }
  
  // Читаем и отдаем файл
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      if (filePath.includes('index.html')) {
        res.writeHead(500);
        res.end('Error loading page');
        return;
      } else {
        // Если не index.html - пробуем отдать index.html
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err2, content2) => {
          if (err2) {
            res.writeHead(404);
            res.end('File not found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content2);
          }
        });
        return;
      }
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('✅ Сервер запущен на порту', PORT);
  console.log('🌐 Откройте: http://localhost:' + PORT);
  console.log('❤️  Health: http://localhost:' + PORT + '/health');
  console.log('📁 Поддерживаемые файлы: index.html, style.css, app.js');
});