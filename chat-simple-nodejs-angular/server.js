const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Configurar el servidor Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos
app.use(express.static('public'));

// Manejar conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Un usuario se conectó:', socket.id);

    // Escuchar mensajes del cliente
    socket.on('chat message', (msg) => {
        console.log(`Mensaje recibido de ${socket.id}: ${msg}`);

        // Reenviar el mensaje a todos los clientes conectados
        io.emit('chat message', msg);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Un usuario se desconectó:', socket.id);
    });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
