const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");

const authRoutes   = require("./routes/auth.routes");
const leadRoutes   = require("./routes/lead.routes");
const userRoutes   = require("./routes/user.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth",    authRoutes);
app.use("/api/leads",   leadRoutes);
app.use("/api/users",   userRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  const status  = err.status  || 500;
  const message = err.message || "Internal server error.";

  if (process.env.NODE_ENV === "development") {
    console.error(`[${status}] ${message}`, err.stack || "");
  }

  res.status(status).json({ message });
});

module.exports = app;
