const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");

// GET all volunteers
router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create volunteer
router.post("/", async (req, res) => {
  try {
    const newVolunteer = new Volunteer(req.body);
    const savedVolunteer = await newVolunteer.save();
    res.status(201).json(savedVolunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE volunteer
router.delete("/:id", async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!deletedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;