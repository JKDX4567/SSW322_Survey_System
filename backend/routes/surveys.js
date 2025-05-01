const express = require("express");
const jwt = require("jsonwebtoken");
const Survey = require("../models/Survey");

const router = express.Router();
const SECRET = "your-secret-key"; // same one used in auth.js

// Middleware to verify token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
}

// Create a survey
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, isPublic, questions } = req.body;

  const newSurvey = new Survey({
    title,
    description,
    isPublic,
    questions,
    createdBy: req.user.username,
    createdAt: new Date().toISOString(),
    responses: [],
  });

  await newSurvey.save();
  res.status(201).json({ message: "Survey created", survey: newSurvey });
});

//Get all Surveys
router.get("/", authMiddleware, async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list surveys" });
  }
});

// Get One survey
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }
    res.json(survey);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Failed to load survey" });
  }
});

// ────────────────── UPDATE (PUT /api/surveys/:id) ──────────────────
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: "Survey not found" });

    // owner check (case-insensitive)
    if (survey.createdBy.toLowerCase() !== req.user.username.toLowerCase()) {
      return res.status(403).json({ message: "Not your survey" });
    }

    Object.assign(survey, req.body);
    await survey.save();

    res.json({ message: "Survey updated", survey });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update survey" });
  }
});

// ────────────────── DELETE (DELETE /api/surveys/:id) ───────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ message: "Survey not found" });

    // owner check (case-insensitive)
    if (survey.createdBy.toLowerCase() !== req.user.username.toLowerCase()) {
      return res.status(403).json({ message: "Not your survey" });
    }

    await survey.deleteOne();
    res.json({ message: "Survey deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to delete survey" });
  }
});

/*
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;           // title, description, questions, etc.

  try {
    const updated = await Survey.findOneAndUpdate(
      { _id: id, createdBy: req.user.username }, // protect other users’ surveys
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Survey not found or you are not the owner" });
    }

    res.json({ message: "Survey updated", survey: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update survey" });
  }
});
*/


// Submit a response to a survey
router.post("/:id/response", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body;
  
    try {
      const survey = await Survey.findById(id);
      if (!survey) return res.status(404).json({ message: "Survey not found" });
  
      survey.responses.push({
        respondent: req.user.username,
        date: new Date().toISOString(),
        answers,
      });
  
      await survey.save();
      res.json({ message: "Response submitted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to submit response" });
    }
  });
  
  module.exports = router;