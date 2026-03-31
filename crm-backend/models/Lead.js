const mongoose = require("mongoose");

// Sub-schema for multiple contacts per company (Enhancement 3)
const contactSchema = new mongoose.Schema(
  {
    personName: { type: String, trim: true },
    designation: { type: String, trim: true },
    mobileNo: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: true }
);

// Sub-schema for address block (Enhancement 4 - reused for company + factory)
const addressSchema = new mongoose.Schema(
  {
    areaEstate: String,
    address: String,
    district: String,
    state: String,
    pincode: String,
    city: String,
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    // 1. SR.NO - Auto-incremented
    srNo: {
      type: Number,
      unique: true,
    },

    // 2. Sales Person - Reference to User
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 3. VISIT DATE
    visitDate: Date,

    // 4. CALLING DATE
    callingDate: Date,

    // 5. FOLLOW UP (date)
    followUpDate: Date,

    // 6. Firm Name
    firmName: {
      type: String,
      trim: true,
      required: true,
    },

    // ── ENHANCEMENT 5: Business Group ─────────────────────────────────────
    // Tag multiple companies under one group (e.g. "Sharma Group")
    groupName: {
      type: String,
      trim: true,
      default: "",
    },

    // ── ENHANCEMENT 3: Primary contact (kept for backward compat) ──────────
    // 7. PERSON NAME (primary contact — also reflected in contacts[0])
    personName: {
      type: String,
      trim: true,
      required: true,
    },

    // 8. designation
    designation: {
      type: String,
      trim: true,
    },

    // 9. Mobile No.
    mobileNo: {
      type: String,
      trim: true,
      required: true,
    },

    // 10. email
    email: {
      type: String,
      trim: true,
    },

    // ENHANCEMENT 3: Additional contacts array
    // contacts[0] mirrors personName/designation/mobileNo/email above
    // contacts[1..n] are extra contacts
    additionalContacts: {
      type: [contactSchema],
      default: [],
    },

    // ── ENHANCEMENT 4: Company (Office) Address ────────────────────────────
    // 11. Area estate
    areaEstate: String,

    // 12. ADDRESS
    address: String,

    // 13. district
    district: String,

    // 14. state
    state: String,

    // 15. pincode
    pincode: String,

    // 15b. city (Enhancement 1 - location filter)
    city: String,

    // ENHANCEMENT 4: Factory Address (separate block)
    factoryAddress: {
      type: addressSchema,
      default: () => ({}),
    },

    // 16. INDUSTRY
    industry: String,

    // 17. Segment
    segment: String,

    // 18. constitution
    constitution: String,

    // 19. MACHINE
    machine: String,

    // 20. REMARK
    remark: String,

    // ── ENHANCEMENT 2: Banking only visible when sanctioned ────────────────
    // 21. bank name (only shown/used when sanction = true)
    bankName: String,

    // 22. VISIT - OFFICE/MEETING
    visitType: {
      type: String,
      enum: ["office", "meeting"],
    },

    // 23. sanction (yes/no) — GATE for banking details
    sanction: {
      type: Boolean,
      default: false,
    },

    // 24. date (sanction date) — only relevant when sanction = true
    sanctionDate: Date,

    // 25. amount — only relevant when sanction = true
    amount: {
      type: Number,
      default: 0,
    },

    // 26. meeting (yes/no)
    meetingScheduled: Boolean,

    // 27. date (meeting date)
    meetingDate: Date,

    // 28. SUPPLIER "LOAN/SUBSIDY"
    projectType: {
      type: String,
      enum: ["loan", "subsidy"],
    },

    // 29. project status
    projectStatus: String,

    // 30. ans client or other
    ansClientType: {
      type: String,
      enum: ["ans_client", "other"],
    },
  },
  { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ firmName: 1 });
leadSchema.index({ groupName: 1 });           // Enhancement 5: fast group queries
leadSchema.index({ district: 1 });            // Enhancement 1: location filter
leadSchema.index({ state: 1 });               // Enhancement 1: location filter
leadSchema.index({ city: 1 });                // Enhancement 1: location filter
leadSchema.index({ areaEstate: 1 });          // Enhancement 1: location filter

module.exports = mongoose.model("Lead", leadSchema);