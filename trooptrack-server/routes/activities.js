const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// GET all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create activity
router.post("/", async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    const saved = await newActivity.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE activity
router.delete("/:id", async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;