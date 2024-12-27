# IoT Workshop - December 2024
*prepared by: Kasun Jayalath for the IoT workshop 27.12.2024*

During the GitHub session, participants will have access to clone this repository. They are given an activity to mark their attendance by adding their name in a file inside the folder, **`student register`**. After that, some of the scripts in this repository will be run by the participants, allowing them to see the results firsthand. 🚀

## Activity 1: MQTT and WebSockets
This activity demonstrates the use of MQTT and WebSockets to send and receive data from a client (IoT edge) to a remote server. 🌐

### 1.1 MQTT
Participants will experience and learn:
- [x] Receiving sensor values via MQTT client 📡
- [x] Visualizing sensor data via an ExpressJS web application remotely 📊
- [x] Setting up and running Docker images 🐳
- [x] ExpressJS web framework fundamentals 🛠️

The first activity is setting up a publisher and client in the local environment, with a local MQTT broker. For this, the Docker image of EMQX open-source broker is downloaded ([EMQX Broker](https://www.emqx.com/en/downloads-and-install/broker)) and run as a local MQTT broker. Open a terminal in the image download location and run the below command:
```text
docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8084:8084 -p 8883:8883 -p 18083:18083 emqx/emqx:5.8.3
```
Check if the Docker container is running with:
```text
docker ps
```
Then, you can open up a browser and log in to the locally hosted broker to view the statistics of your setup. It visualizes connected nodes, load, and other useful information about your local MQTT setup. 📈
```text
http://localhost:18083
Username: admin
Password: public
password: @1234qwer
```
After that, you can run the below two scripts to start publishing and capturing messages:
```text
activity1_connectivity/mqtt/
publisher.js
subscriber.js
```

Secondly, the usage of a free public cloud MQTT broker is demonstrated. Necessary URLs and public credentials have been added to the scripts below:
```text
activity1_connectivity/mqtt/
publisher-cloud.js
subscriber-cloud.js
```
Participants can run **subscriber-cloud.js** from their computers and see the results. 🌥️

Thirdly, I publish the core temperature of my laptop via MQTT. Participants can see the values by subscribing to the channel and visualizing them in the browser as a bar graph remotely:
```text
activity1_connectivity/mqtt/
publisher-temp.js
subscriber-temp.js
public/
  index.html
```

### 1.2 WebSockets
Participants will experience and learn:
- [x] Server with multiple clients communicating through WebSockets 🔄

```text
activity1_connectivity/websockets/
server.js
client1.html
client2.html
```

---

## Activity 2: Sensor Readings and Controlling GPIO Remotely

### 2.1 `A Thing` That Collects Data and Displays It

- [x] Connect sound sensor and display analog readings 🎤
- [x] Connect LDR and display analog readings 💡
- [x] Interfacing a display via SPI 📺
- [ ] Sending values over UART to an internet-enabled/connected device 🔗
- [ ] Visualize sensor data from the cloud ☁️

Demonstrating an IoT edge device, two sensors are connected to Arduino Uno analog pins to capture sound and light readings. A 12864B display is used to show the sensor values (currently, it is not connected to the internet—so it is just a **thing**). 🌟

<span style="color:green">*TODO: Sending sensor values to a nearby network access device (e.g., Raspberry Pi) has not been implemented yet. The plan is to connect RPi with Arduino via UART and send both sensor readings via the UART channel.*</span>

**Sound Sensor**

| Sensor | Arduino |
|--------|---------|
| A0     | A2      |
| plus   | 5V      |
| g      | GND     |
| D0     | NC      |

**LDR**

The sensor is in series with a 1kΩ resistor, and the voltage in the middle is fed to Arduino analog pin A3:

| Sensor            | Arduino |
|-------------------|---------|
| Voltage divider   | A3      |

**Display**

The display is connected via SPI:

| Display | Arduino    |
|---------|------------|
| RS      | SS (GPIO10)|
| RW      | MOSI (GPIO11)|
| E       | SCLK (GPIO13)|

Once connected, upload the Arduino code to the Uno:
```text
activity2_sound/arduino/arduino/arduino.ino
```

---

### 2.2 `Internet of a Thing` Controlling Remotely

- [x] Communicate with a server via API 📬
- [x] Hosting a server in `Amazon EC2` ☁️
- [x] Visualize data coming through API 📊
- [x] Sending GPIO control commands as API requests via `Postman` 🔧
- [x] Publishing GPIO control commands to a topic 🔌
- [x] Listen to the topic from Pi and control GPIO 🖧
- [ ] RPi sends data to a remote server 📨

#### a. Raspberry Pi and GPIO

Four GPIO pins are connected to the Raspberry Pi, which is connected to the internet by subscribing to an MQTT channel and topic `/nodejs/mqtt`:

| LED   | Pi         |
|-------|------------|
| led1  | GPIO2      |
| led2  | GPIO3      |
| led3  | GPIO4      |
| led4  | GPIO27     |

Run the below script to:

#### b. Create and Host a Web Server on AWS EC2 🌍

1. **Web Server Setup:**
   - The server will handle incoming POST requests and update the chart with sensor data:
   ```text
   /server/server.js
   public/
     index.html
   ```

2. **Configuring EC2 to Receive Traffic:**
   - Go to the **EC2 Dashboard** on AWS.
   - Select your instance and click on the **Security Group** under "Security".
   - Edit **Inbound Rules**:
     - **Type:** Custom TCP Rule
     - **Port Range:** 3000
     - **Source:** `0.0.0.0/0` *(allows access from anywhere; restrict IP range if needed)*.
   - Save the changes.

3. **Find the Public IPv4 Address:**
   - Example: `3.25.103.113` (accessible from **Instance Details**).

4. **Test Using Postman:**
   - Open Postman and create a new POST request:
     - **URL:** `http://3.25.103.113:3000/sensor-data`
     - **Body (JSON) - graph:**
       ```json
       {
           "value": 75.3
       }
       ```
      - **URL:** `http://3.25.103.113:3000/pin-control`
      - **Body (JSON) - GPIO:**
        ```json
        {
            "value": 1,
            "state": "on"
        }
        ```

5. **Edit the Server Script:**
   - Update `server.js` to listen on all network interfaces:
     ```javascript
     app.listen(3000, '0.0.0.0', () => {
         console.log('Server running...');
     });
     ```

6. **Run the Server:**
   - Start the server by executing `node server.js`. 🏃‍♂️

7. **Access the Application:**
   - Open a browser and visit: `http://3.25.103.113:3000/`.

#### c. Script to Send Sensor Data to the Server
- A script to send POST requests from the Raspberry Pi is available at:
  `/activity2_sound/server-gpio.js`.

- **Run the Script:**
  - Tap the sensor and observe the live chart updating in the browser. 🎉

---

## Activity 3: GitHub

- [x] GitHub initial setup ✅
- [x] Pull requests and merging 🔗
- [x] GitHub Actions ⚡
- [x] GitHub Codespaces 🖥️
- [ ] GitHub CI/CD pipelines 🔄
