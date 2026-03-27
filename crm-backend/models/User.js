// models/User.js  ← REPLACE your existing file with this
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: 6,
      select:    false,
    },
    role: {
      type:    String,
      enum:    ["admin", "sales"],
      default: "sales",
    },

    // ── Reminder tick storage ──────────────────────────────────
    // Each entry = one ticked reminder (leadId + field uniquely identify it)
    doneReminders: [
      {
        leadId: {
          type: mongoose.Schema.Types.ObjectId,
          ref:  "Lead",
        },
        field: {
          type: String,
          enum: ["callingDate", "followUpDate", "visitDate"],
        },
        doneAt: {
          type:    Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);