const Analysis = require("../models/Analysis");

exports.createAnalysis = async (req, res) => {
  const { prediction, analysisData } = req.body;

  if (!prediction || !analysisData) {
    return res
      .status(400)
      .json({ message: "Missing prediction or analysis data" });
  }

  try {
    const analysis = await Analysis.create({
      user: req.user,
      prediction,
      analysisData,
    });
    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalysisById = async (req, res) => {
  const { id } = req.params;
  const analysis = await Analysis.findOne({ _id: id, user: req.user });
  if (!analysis) return res.status(404).json({ message: "Analysis not found" });
  res.status(200).json(analysis);
};
