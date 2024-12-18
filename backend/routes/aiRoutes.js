const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    // Send data to the Flask API
    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      req.body,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error connecting to AI service:", error.message);
    res.status(500).json({ message: "Failed to get prediction" });
  }
});

module.exports = router;
