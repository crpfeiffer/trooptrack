const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      default: "",
      trim: true,
    },
    meeting: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      default: "Pending",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);