const mongoose = require("mongoose");

// ── Contact sub-schema ────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema(
  {
    personName:  { type: String, trim: true },
    designation: { type: String, trim: true },
    mobileNo:    { type: String, trim: true },
    email:       { type: String, trim: true },
  },
  { _id: true }
);

// ── Address sub-schema ────────────────────────────────────────────────────
const addressSchema = new mongoose.Schema(
  {
    label:      String,
    areaEstate: String,
    address:    String,
    city:       String,
    district:   String,
    state:      String,
    pincode:    String,
  },
  { _id: true }
);

// ── Note sub-schema (NEW) ─────────────────────────────────────────────────
// One note per reminder field. Saved when user ticks a reminder + submits message.
const noteSchema = new mongoose.Schema(
  {
    field: {
      type:     String,
      enum:     ["callingDate", "followUpDate", "visitDate"],
      required: true,
    },
    message: {
      type:     String,
      trim:     true,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
    },
    addedAt: {
      type:    Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    srNo: { type: Number, unique: true },

    assignedTo: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    visitDate:    Date,
    callingDate:  Date,
    followUpDate: Date,

    firmName:  { type: String, trim: true, required: true },
    groupName: { type: String, trim: true, default: "" },

    personName:  { type: String, trim: true, required: true },
    designation: { type: String, trim: true },
    mobileNo:    { type: String, trim: true, required: true },
    email:       { type: String, trim: true },

    additionalContacts: { type: [contactSchema], default: [] },

    areaEstate: String,
    address:    String,
    city:       String,
    district:   String,
    state:      String,
    pincode:    String,

    officeAddresses:  { type: [addressSchema], default: [] },
    factoryAddresses: { type: [addressSchema], default: [] },

    industry:     String,
    segment:      String,
    constitution: String,
    machine:      String,
    remark:       String,

    bankName:  String,
    visitType: { type: String, enum: ["office", "meeting"] },

    sanction:     { type: Boolean, default: false },
    sanctionDate: Date,
    amount:       { type: Number, default: 0 },

    meetingScheduled: Boolean,
    meetingDate:      Date,

    projectType:   { type: String, enum: ["loan", "subsidy"] },
    projectStatus: String,
    ansClientType: { type: String, enum: ["ans_client", "other"] },

    // ── Activity notes — one per reminder field ───────────────────────────
    notes: { type: [noteSchema], default: [] },
  },
  { timestamps: true }
);

leadSchema.index({ assignedTo: 1 });
leadSchema.index({ firmName: 1 });
leadSchema.index({ groupName: 1 });
leadSchema.index({ district: 1 });
leadSchema.index({ state: 1 });
leadSchema.index({ city: 1 });
leadSchema.index({ areaEstate: 1 });

module.exports = mongoose.model("Lead", leadSchema);