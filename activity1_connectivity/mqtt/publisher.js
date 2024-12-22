const mqtt = require('mqtt');

// MQTT broker configuration
const broker = 'mqtt://localhost'; // Change to your broker's address
const topic = 'iot/demo'; // Example topic

// Connect to the MQTT broker
const client = mqtt.connect(broker);

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
