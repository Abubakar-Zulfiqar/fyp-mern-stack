const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prediction: { type: Number, required: true },
  analysisData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.model("Analysis", analysisSchema);
module.exports = Analysis;
