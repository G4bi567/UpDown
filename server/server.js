const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.IO Server\n');
});

const io = socketIO(server);
const lobbies = {};
const MAX_PLAYERS_PER_LOBBY = 2;  // Set maximum players per lobby to 2

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createLobby', ({ lobbyId, nickname }) => {
        if (!lobbies[lobbyId] && Object.keys(lobbies).length < MAX_PLAYERS_PER_LOBBY) {
            lobbies[lobbyId] = {
                [socket.id]: { nickname, role: 'player1' }
            };
            socket.join(lobbyId);
            socket.lobbyId = lobbyId;
            io.to(socket.id).emit('lobbyCreated', { lobbyId, role: 'player1', users: lobbies[lobbyId] });
            io.to(lobbyId).emit('lobbyUpdate', { users: lobbies[lobbyId] });
        } else {
            socket.emit('lobbyError', 'Lobby creation failed');
        }
    });

    socket.on('joinLobby', ({ lobbyId, nickname }) => {
        if (socket.lobbyId) {
            socket.leave(socket.lobbyId);
        }

        if (lobbies[lobbyId] && Object.keys(lobbies[lobbyId]).length < MAX_PLAYERS_PER_LOBBY) {
            socket.join(lobbyId);
            socket.lobbyId = lobbyId;
            const role = Object.keys(lobbies[lobbyId]).length === 1 ? 'player2' : 'spectator'; // Assign 'player2' if only one user in lobby
            lobbies[lobbyId][socket.id] = { nickname, role };
            io.to(socket.id).emit('joinedLobby', { lobbyId, role, users: lobbies[lobbyId] });
            io.to(lobbyId).emit('lobbyUpdate', { users: lobbies[lobbyId] });
        } else {
            socket.emit('lobbyError', 'Lobby joining failed');
        }
    });

        // Part of your server-side JavaScript
    socket.on('updatePlayerState', (playerState) => {
        const lobbyId = socket.lobbyId;
        if (lobbyId) {
            // Broadcast the player state to other players in the same lobby
            socket.to(lobbyId).emit('updateRemotePlayer', { playerId: socket.id, ...playerState });
            console.log(`state: ${playerState.velocity}`);
        }
    });


        // Server-side code in Node.js using socket.io
    socket.on('playerAttack', (attackData) => {
        const lobbyId = socket.lobbyId;
        if (lobbyId) {
            socket.to(lobbyId).emit('attackReceived', attackData);
            console.log(`state: attack`);
        }
        
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        if (socket.lobbyId) {
            delete lobbies[socket.lobbyId][socket.id];
            if (Object.keys(lobbies[socket.lobbyId]).length === 0) {
                delete lobbies[socket.lobbyId];
            } else {
                io.to(socket.lobbyId).emit('lobbyUpdate', { users: lobbies[socket.lobbyId] });
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
