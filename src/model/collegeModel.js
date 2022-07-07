const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: "college's name(shortened form) is required",
    },
    fullName: {
      type: String,
      required: "college's fullName is required",
      trim: true,
    },
    logoLink: {
      type: String,
      required: "logoLink is required",
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
