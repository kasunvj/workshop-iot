const mqtt = require('mqtt');
const si = require('systeminformation');

// EMQX Public Broker details
const brokerUrl = 'mqtt://broker.emqx.io';
const topic = 'laptop/cpu/temperature';
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log('Connected to the MQTT broker.');

    // Publish CPU temperature every 5 seconds
    setInterval(async () => {
        try {
            const tempData = await si.cpuTemperature();
            const cpuTemp = tempData.main || 0;
            const message = JSON.stringify({ temperature: cpuTemp, timestamp: Date.now() });

            client.publish(topic, message, () => {
                console.log(`Published: ${message}`);
            });
        } catch (err) {
            console.error('Error fetching CPU temperature:', err);
        }
    }, 5000);
});

client.on('error', (err) => {
    console.error('Connection error:', err);
    client.end();
});
