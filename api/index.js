const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("SUCCESS: Connected to MongoDB Atlas!"))
  .catch(err => console.error(" ERROR: MongoDB Connection Failed:", err));

const sensorSchema = new mongoose.Schema({
  temp: Number,
  humidity: Number,
  soil_moisture: Number,
  timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.model('Sensor', sensorSchema);

// CHANGED: Removed '/api' prefix. Vercel routes this to /api/data automatically.
app.post('/data', async (req, res) => {
  try {
    const newData = new Sensor(req.body);
    await newData.save();
    console.log("Received and saved data:", req.body);
    res.status(201).json({ message: "Data saved to Atlas!" });
  } catch (err) {
    console.error("Error saving to DB:", err);
    res.status(500).json({ error: "Error saving data" });
  }
});

// CHANGED: Removed '/api' prefix. 
app.get('/data', async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching from DB:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// CHANGED: Removed '/api' prefix.
app.get('/health', (req, res) => {
  res.send("Standard Node Backend is Live!");
});

// CHANGED: Removed app.listen() and replaced with the Vercel serverless export
module.exports = app;