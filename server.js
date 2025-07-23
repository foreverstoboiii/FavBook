const http = require('http')

const server = http.createServer((req, res ) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('HELLOSERVER!');
})

const PORT = 3000;
const HOST = 'localhost';

server.listen(PORT, HOST, ()=> {
    console.log(`Server is running at: http://${HOST}:${PORT}`);
    
})