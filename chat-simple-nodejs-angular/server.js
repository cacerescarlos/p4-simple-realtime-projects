const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos
app.use(express.static('public'));

// Almacenar usuarios conectados
const users = {};

io.on('connection', (socket) => {
    console.log('Un usuario se conectó:', socket.id);

    /**
     * Evento: Usuario conectado
     */
    socket.on('user connected', (username) => {
        users[socket.id] = username; // Asociar usuario con su conexión
        console.log(`${username} se unió al chat.`);
        io.emit('system message', `${username} se unió al chat.`); // Notificar a todos
    });

    /**
     * Evento: Mensaje de chat
     */
    socket.on('chat message', (data) => {
        console.log(`[${data.user}]: ${data.message}`);
        socket.broadcast.emit('chat message', data); // Enviar mensaje a otros usuarios
    });

    /**
     * Evento: Usuario desconectado
     */
    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            console.log(`${username} se desconectó.`);
            io.emit('system message', `${username} se desconectó del chat.`); // Notificar a todos
            delete users[socket.id]; // Eliminar usuario
        }
    });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
