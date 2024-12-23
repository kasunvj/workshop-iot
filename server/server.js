const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const { WebSocketServer } = require('ws'); // Import WebSocketServer
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON data in requests

// WebSocket server setup
const wss = new WebSocketServer({ noServer: true });

// Function to broadcast data to all connected WebSocket clients
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

//settin up mqtt
const host = 'broker.emqx.io'
const portMqtt = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${portMqtt}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})
const topic = '/nodejs/mqtt'

// Handle sensor data received from a POST request
app.post('/sensor-data', (req, res) => {
    const { value } = req.body;
    if (value !== undefined) {
        console.log('Received sensor value:', value);
        broadcast({ value }); // Broadcast the new value to WebSocket clients
        res.json({ message: 'Sensor data received', value });
    } else {
        res.status(400).json({ error: 'Invalid sensor data' });
    }
});

app.post('/pin-control',(req, res) => {
    const { value } = req.body;
    console.log("PIN: ",value);
    client.publish(topic, `Pin Control Command received : ${value}`, { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
      })
    res.json({ message: 'Control data received', value });
});

// Handle WebSocket connections
const server = app.listen(port,'0.0.0.0', () => {
    console.log(`Server running at 0.0.0.0:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
