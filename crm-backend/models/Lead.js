const mongoose = require("mongoose");

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

    // 7. PERSON NAME
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

    // 21. bank name
    bankName: String,

    // 22. VISIT - OFFICE/MEETING
    visitType: {
      type: String,
      enum: ["office", "meeting"],
    },

    // 23. sanction (yes/no)
    sanction: {
      type: Boolean,
      default: false,
    },

    // 24. date (sanction date)
    sanctionDate: Date,

    // 25. amount
    amount: {
      type: Number,
      default: 0,
    },

    // 26. meeting (yes/no) - This seems duplicate with visitType, keeping as boolean
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

// Indexes for fast queries
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ firmName: 1 });
// leadSchema.index({ srNo: 1 });

module.exports = mongoose.model("Lead", leadSchema);
