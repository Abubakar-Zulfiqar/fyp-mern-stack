const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analysis", analysisRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
