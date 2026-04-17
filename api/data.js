const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

const sensorSchema = new mongoose.Schema({
  temp: Number,
  humidity: Number,
  soil_moisture: Number,
  timestamp: { type: Date, default: Date.now }
});

const Sensor = mongoose.models.Sensor || mongoose.model('Sensor', sensorSchema);

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { temp, humidity, soil_moisture } = req.body;

      if (temp === undefined || humidity === undefined || soil_moisture === undefined) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const newData = new Sensor({ temp, humidity, soil_moisture });
      await newData.save();

      console.log("📥 Data saved:", req.body);
      return res.status(201).json({ message: "Data saved" });

    } catch (err) {
      console.error("❌ Save Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  if (req.method === "GET") {
    try {
      const data = await Sensor.find().sort({ timestamp: -1 }).limit(10);
      return res.status(200).json(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      return res.status(500).json({ error: "Fetch error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};