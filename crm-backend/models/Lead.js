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

// ── Address sub-schema (reused for office + factory) ─────────────────────
const addressSchema = new mongoose.Schema(
  {
    label:      String,   // e.g. "Head Office", "Unit 2", "Plant A"
    areaEstate: String,
    address:    String,
    city:       String,
    district:   String,
    state:      String,
    pincode:    String,
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

    // Primary contact (required, kept flat for backward compat)
    personName:  { type: String, trim: true, required: true },
    designation: { type: String, trim: true },
    mobileNo:    { type: String, trim: true, required: true },
    email:       { type: String, trim: true },

    // Additional contacts array
    additionalContacts: { type: [contactSchema], default: [] },

    // ── OLD flat address fields (kept for backward compat) ────────────────
    areaEstate: String,
    address:    String,
    city:       String,
    district:   String,
    state:      String,
    pincode:    String,

    // ── NEW: Multiple office addresses ────────────────────────────────────
    officeAddresses:  { type: [addressSchema], default: [] },

    // ── NEW: Multiple factory/plant addresses ─────────────────────────────
    factoryAddresses: { type: [addressSchema], default: [] },

    // Business
    industry:     String,
    segment:      String,
    constitution: String,
    machine:      String,
    remark:       String,

    // Banking (gated by sanction)
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