const mqtt = require('mqtt');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// EMQX Public Broker details
const brokerUrl = 'mqtt://broker.emqx.io';
const topic = 'laptop/cpu/temperature';

// Web server for histogram visualization
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Start server
server.listen(3000, () => {
    console.log('Subscriber is running at http://localhost:3000');
});

// MQTT Client
const client = mqtt.connect(brokerUrl);

// Listens to MQTT messages
client.on('connect', () => {
    console.log('Connected to the MQTT broker.');
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
        } else {
            console.error('Subscription error:', err);
        }
    });
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log(`Received data: ${message.toString()}`);

    // Emit the data to the front-end for visualization
    io.emit('temperatureUpdate', data);
});

client.on('error', (err) => {
    console.error('Connection error:', err);
    client.end();
});
