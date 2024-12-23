const mqtt = require('mqtt');

// MQTT broker configuration
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})


const topic = 'iot/demo'; // Example topic




client.on('connect', () => {
  console.log('Subscriber connected to the broker.');

  // Subscribe to the topic
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error(`Failed to subscribe: ${err.message}`);
    }
  });
});

// Listen for messages on the subscribed topic
client.on('message', (topic, message) => {
  console.log(`Message received on topic "${topic}": ${message.toString()}`);
});

client.on('error', (error) => {
  console.error(`Subscriber error: ${error.message}`);
});
