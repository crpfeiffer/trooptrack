const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meetings");

// GET all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a meeting
router.post("/", async (req, res) => {
  try {
    const { title, date, location, badge, notes, weather } = req.body;

    const newMeeting = new Meeting({
      title,
      date,
      location,
      badge,
      notes,
      weather,
    });

    const savedMeeting = await newMeeting.save();
    res.status(201).json(savedMeeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a meeting
router.put("/:id", async (req, res) => {
  try {
    const { title, date, location, badge, notes, weather } = req.body;

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        location,
        badge,
        notes,
        weather,
      },
      { new: true, runValidators: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json(updatedMeeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a meeting
router.delete("/:id", async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!deletedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;