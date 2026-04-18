const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB Connection Failed:", err));

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
    console.log("Received and saved data:", req.body);
    res.status(201).json({ message: "Data saved to Atlas" });
  } catch (err) {
    res.status(500).json({
      error: "MongoDB Error",
      details: err.message
    });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.get('/api/health', (req, res) => {
  res.send("Backend is live");
});

module.exports = app;
