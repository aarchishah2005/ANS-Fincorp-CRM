require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// ✅ Handle unhandled promise rejections (safety)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection ❌:", err);
  process.exit(1);
});

// ✅ Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });