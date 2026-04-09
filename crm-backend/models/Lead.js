const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    personName:  { type: String, trim: true },
    designation: { type: String, trim: true },
    mobileNo:    { type: String, trim: true },
    email:       { type: String, trim: true },
  },
  { _id: true }
);

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

const noteSchema = new mongoose.Schema(
  {
    field:   { type: String, enum: ["callingDate", "followUpDate", "visitDate"], required: true },
    message: { type: String, trim: true, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    srNo: { type: Number, unique: true },

    // Primary assignee (who created / owns the lead)
    assignedTo: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    // ── NEW: Co-assignees ─────────────────────────────────────────────────
    // Added when another user clicks "Edit Existing Lead" on a duplicate warning.
    // Both assignedTo + coAssignees can view/edit this lead.
    coAssignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User",
      },
    ],

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

    notes: { type: [noteSchema], default: [] },
  },
  { timestamps: true }
);

leadSchema.index({ assignedTo: 1 });
leadSchema.index({ coAssignees: 1 });   // fast lookup by co-assignee
leadSchema.index({ firmName: 1 });
leadSchema.index({ groupName: 1 });
leadSchema.index({ district: 1 });
leadSchema.index({ state: 1 });
leadSchema.index({ city: 1 });
leadSchema.index({ areaEstate: 1 });
leadSchema.index({ mobileNo: 1 });      // fast duplicate check on primary mobile

module.exports = mongoose.model("Lead", leadSchema);