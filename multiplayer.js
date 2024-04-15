function toggleMultiplayerLobby() {
    var lobbyDiv = document.getElementById('multiplayerLobby');
    lobbyDiv.style.display = lobbyDiv.style.display === "none" ? "block" : "none";
}

function showMultiplayerOptions() {
    document.getElementById('multiplayerOptions').style.display = 'block';
    document.getElementById('multiplayerLobby').style.display = 'none';
    document.getElementById('newLobbyCreated').style.display = 'none';
}

function showJoinLobby() {
    document.getElementById('multiplayerLobby').style.display = 'block';
    document.getElementById('multiplayerOptions').style.display = 'none';
    document.getElementById('newLobbyCreated').style.display = 'none';
}

var socket;  // Declare socket globally
let newLobbyId;
let playerRole; // Global variable to store the player's role
function createNewLobby() {
    socket = io('http://localhost:3000', { transports: ['websocket'], withCredentials: true });
    socket.on('connect', () => {
        let newLobbyId = Math.random().toString(36).substr(2, 7);
        socket.emit('createLobby', { lobbyId: newLobbyId, nickname: playerNickname });

        socket.on('lobbyCreated', (data) => {
            console.log('Lobby successfully created with ID:', data.lobbyId);
            playerRole = data.role; // Save the role assigned by the server
            
            // Hide the input and buttons for creating or joining a lobby
            document.getElementById('multiplayerLobby').style.display = 'none';

            // Display the new lobby ID and the Copy ID button
            document.getElementById('newLobbyId').textContent = newLobbyId;
            document.getElementById('newLobbyCreated').style.display = 'block';
            document.getElementById('newLobbyCreated').style.textAlign = 'left';
            document.getElementById('menu').style.display = 'none';
            lobbyReady = true
            initializeGame();
            setupSocketListeners();

            
        });
    });
    socket.on('connect_error', (error) => {
        // Alert the user that the connection failed
        alert('Failed to connect to the multiplayer server: ' + error.message);
        resetGame()
    });

    socket.on('connect_timeout', () => {
        // Alert the user that the connection has timed out
        alert('Connection to the multiplayer server timed out.');
        resetGame()
    });


}


function joinLobby() {
    const lobbyId = document.getElementById('lobbyId').value.trim();
    const nicknameInput = document.getElementById('nickname');
    const playerNickname = nicknameInput.value.trim();

    if (!lobbyId || !playerNickname) {
        alert('Please enter a nickname and lobby ID.');
        return;
    }

    socket = io('http://localhost:3000', { transports: ['websocket'], withCredentials: true });
    socket.on('connect', () => {
        socket.emit('joinLobby', { lobbyId, nickname: playerNickname });

        socket.on('joinedLobby', (data) => {
            console.log('Joined lobby with ID:', data.lobbyId);
            playerRole = data.role; // Save the role assigned by the server
            newLobbyId = data.lobbyId
            // Hide the input and buttons for creating or joining a lobby
            document.getElementById('multiplayerLobby').style.display = 'none';

            // Display the new lobby ID and the Copy ID button
            document.getElementById('newLobbyId').textContent = newLobbyId;
            document.getElementById('newLobbyCreated').style.display = 'block';
            document.getElementById('newLobbyCreated').style.textAlign = 'left';
            document.getElementById('menu').style.display = 'none';
            
            lobbyReady = true
            initializeGame();
            setupSocketListeners();
        });
    });
    socket.on('connect_error', (error) => {
        // Alert the user that the connection failed
        alert('Failed to connect to the multiplayer server: ' + error.message);
        resetGame()
    });

    socket.on('connect_timeout', () => {
        // Alert the user that the connection has timed out
        alert('Connection to the multiplayer server timed out.');
        resetGame()
    });
}


function copyLobbyId() {
    const lobbyId = document.getElementById('newLobbyId').textContent;
    navigator.clipboard.writeText(lobbyId).then(() => {
        alert('Lobby ID copied to clipboard!');
    }, () => {
        alert('Failed to copy Lobby ID');
    });
}


