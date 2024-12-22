const mqtt = require('mqtt');

// MQTT broker configuration
const broker = 'mqtt://localhost'; // Change to your broker's address
const topic = 'iot/demo'; // Example topic

// Connect to the MQTT broker
const client = mqtt.connect(broker);

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
