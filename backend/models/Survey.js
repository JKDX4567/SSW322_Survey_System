const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  respondent: String,
  date: String,
  answers: [mongoose.Schema.Types.Mixed], // text, radio, checkbox (array or string)
});

const surveySchema = new mongoose.Schema({
  title: String,
  description: String,
  isPublic: Boolean,
  questions: [Object],
  createdBy: String,
  createdAt: String,
  responses: [responseSchema],
});

module.exports = mongoose.model("Survey", surveySchema);
