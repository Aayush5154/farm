
const API_URL = 'http://localhost:3000/api/data';

async function sendFakeSensorData() {

  const fakeData = {
    temp: (Math.random() * 15 + 20).toFixed(1),      
    humidity: (Math.random() * 40 + 40).toFixed(1),  
    soil_moisture: Math.floor(Math.random() * 1024)  
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fakeData)
    });

    if (response.ok) {
      console.log(`✅ Sent: Temp: ${fakeData.temp}°C | Soil: ${fakeData.soil_moisture} => Success!`);
    } else {
      console.log(`❌ Failed to send data. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`⚠️ Connection refused. Is the server running?`);
  }
}

console.log(" Starting ESP8266 Simulator...");
console.log(` Sending data to ${API_URL} every 3 seconds.\n`);

setInterval(sendFakeSensorData, 3000);