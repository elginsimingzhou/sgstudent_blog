const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    hours: { type: String, required: true },
    body: { type: String, required: true },
    location: { type: String, required: true },
    rates: { type: String, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
