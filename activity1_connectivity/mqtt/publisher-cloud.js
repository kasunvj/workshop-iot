const mqtt = require('mqtt');

// MQTT free public broker configuration
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

// Connect to the MQTT broker

client.on('connect', () => {
  console.log('Publisher connected to the broker.');
  
  // Publish messages every 2 seconds
  let count = 0;
  setInterval(() => {
    const message = `Hello MQTT! Message number: ${count++}`;
    client.publish(topic, message, () => {
      console.log(`Message sent: ${message}`);
    });
  }, 2000);
});

client.on('error', (error) => {
  console.error(`Publisher error: ${error.message}`);
});
