const express = require("express");
const {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
} = require("../controllers/analysisController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createAnalysis);
router.get("/", protect, getAnalyses);
router.get("/:id", protect, getAnalysisById);

module.exports = router;
