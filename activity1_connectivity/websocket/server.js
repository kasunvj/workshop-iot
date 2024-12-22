const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Handle new connections
wss.on('connection', (ws) => {
  console.log('New client connected!');

  // Broadcast to all clients when a new client connects
  broadcast('A new client has joined!');

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Broadcast the message to all clients
    broadcast(`Client says: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('A client disconnected');
    broadcast('A client has left.');
  });
});

// Function to broadcast messages to all connected clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

console.log('WebSocket server is running on ws://localhost:8080');
