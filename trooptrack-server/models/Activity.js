const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    supplies: {
      type: String,
      default: "",
      trim: true,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
    },
    indoorOutdoor: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);