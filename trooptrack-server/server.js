const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const meetingRoutes = require("./routes/Meetings");
const activityRoutes = require("./routes/activities");
const volunteerRoutes = require("./routes/volunteers");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("TroopTrack API is running");
});

app.use("/api/meetings", meetingRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/volunteers", volunteerRoutes);

app.get("/api/weather", async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        location
      )}&count=10&countryCode=US`
    );

    const geoData = await geoRes.json();
    console.log("Geocoding response:", geoData);

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    let place = geoData.results[0];

    const michiganMatch = geoData.results.find(
      (p) => p.admin1 && p.admin1.toLowerCase().includes("michigan")
    );

    if (michiganMatch) {
      place = michiganMatch;
    }

    const { latitude, longitude, name, admin1, country } = place;

    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
    );

    const forecastData = await forecastRes.json();

    res.json({
      location: `${name}, ${admin1 || country}`,
      weather: {
        temperatureMax: forecastData.daily.temperature_2m_max?.[0],
        temperatureMin: forecastData.daily.temperature_2m_min?.[0],
        precipitationProbabilityMax:
          forecastData.daily.precipitation_probability_max?.[0],
        weatherCode: forecastData.daily.weather_code?.[0],
      },
    });
  } catch (error) {
    console.error("Weather route error:", error);
    res.status(500).json({ message: "Failed to fetch weather" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});