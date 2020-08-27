const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, minlength: 6, maxlength: 200, required: true },
  // each student belongs to on of the years
  studyYear: { type: Number, min: 9, max: 12, required: true },
  math: [{ type: Number, min: 1, max: 10 }],
  biology: [{ type: Number, min: 1, max: 10 }],
  sports: [{ type: Number, min: 1, max: 10 }],
  history: [{ type: Number, min: 1, max: 10 }],
});

module.exports = mongoose.model("Student", studentSchema);
