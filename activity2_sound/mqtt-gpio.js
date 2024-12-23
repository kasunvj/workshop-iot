const mqtt = require('mqtt')
const rpio = require('rpio');

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

const topic = '/nodejs/mqtt'

rpio.init({ mapping: 'gpio' });
const pin1 = 2;
const pin2 = 3;
const pin3 = 4;
const pin4 = 27;

rpio.open(pin1, rpio.OUTPUT, rpio.LOW);
rpio.open(pin2, rpio.OUTPUT, rpio.LOW);
rpio.open(pin3, rpio.OUTPUT, rpio.LOW);
rpio.open(pin4, rpio.OUTPUT, rpio.LOW);

client.on('connect', () => {
  console.log(`Connected ${clientId}`)

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  const parts = payload.toString().split(',');

  if(parts[0] == '1'){
    console.log(`pin ${parts[0]} ${parts[1]}`);
    if(parts[0] == 'on')
      rpio.write(pin1, rpio.HIGH);
    else
      rpio.write(pin1, rpio.LOW);
  }
  if(parts[0] == '2'){
    console.log(`pin ${parts[0]} ${parts[1]}`);
    if(parts[0] == 'on')
      rpio.write(pin2, rpio.HIGH);
    else
      rpio.write(pin2, rpio.LOW);
  }
  if(parts[0] == '3'){
    console.log(`pin ${parts[0]} ${parts[1]}`);
    if(parts[0] == 'on')
      rpio.write(pin2, rpio.HIGH);
    else
      rpio.write(pin2, rpio.LOW);
  }
  if(parts[0]== '4'){
    console.log(`pin ${parts[0]} ${parts[1]}`);
    if(parts[0] == 'on')
      rpio.write(pin2, rpio.HIGH);
    else
      rpio.write(pin2, rpio.LOW);
  }
})

/*
setInterval(() => {
  const value = rpio.read(4);
  //console.log(`${value}`);
  if (value == 1){
    client.publish(topic, 'Sound detected', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  }
}, 100);
*/

process.on('SIGINT', () => {
    console.log('\nCleaning up GPIO...');
    button.unexport(); // Release the GPIO resources
    process.exit();
});

