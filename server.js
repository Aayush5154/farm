const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 

const MONGO_URI = "mongodb+srv://Aayush:Aayush5154@farm.cuon1xh.mongodb.net/?appName=farm";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.log("ERROR: Could not connect to MongoDB.");
    console.error(err);
  });

mongoose.connection.on('error', err => {
  console.log("MongoDB connection lost:", err);
});

const sensorSchema = new mongoose.Schema({
  temp: Number,
  humidity: Number,
  soil_moisture: Number,
  timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.model('Sensor', sensorSchema);

app.post('/api/data', async (req, res) => {
  try {
    const newData = new Sensor(req.body);
    await newData.save();
    console.log("New sensor reading saved to Atlas:", req.body);
    res.status(201).send("Data saved securely to MongoDB!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

app.get('/test', (req, res) => {
  res.send('Node.js Server is running properly! ');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});