const Lead = require("../models/Lead");

// ── GET ALL LEADS ─────────────────────────────────────────────────
// Admin: ALL leads from ALL salespeople
// Sales: ONLY their own leads
const getLeads = async (user, filters = {}) => {
  const query = {};

  // CRITICAL: Role-based scoping
  if (user.role === "sales") {
    query.assignedTo = user._id; // Sales see ONLY their own
  }
  // Admin sees ALL (no filter)

  // Apply filters
  if (filters.search) {
    query.$or = [
      { firmName: { $regex: filters.search, $options: "i" } },
      { personName: { $regex: filters.search, $options: "i" } },
      { mobileNo: { $regex: filters.search, $options: "i" } },
    ];
  }
  if (filters.projectType) query.projectType = filters.projectType;
  if (filters.ansClientType) query.ansClientType = filters.ansClientType;
  if (filters.visitType) query.visitType = filters.visitType;
  if (filters.sanction !== undefined) query.sanction = filters.sanction === "true";

  const leads = await Lead.find(query)
    .populate("assignedTo", "name email")
    .sort({ srNo: -1 }); // Newest first

  return leads;
};

// ── GET SINGLE LEAD ───────────────────────────────────────────────
const getLeadById = async (leadId, user) => {
  const query = { _id: leadId };

  // Sales can only see their own
  if (user.role === "sales") {
    query.assignedTo = user._id;
  }

  const lead = await Lead.findOne(query).populate("assignedTo", "name email");
  if (!lead) {
    throw { status: 404, message: "Lead not found or access denied." };
  }
  return lead;
};

// ── CREATE LEAD ───────────────────────────────────────────────────
const createLead = async (data, user) => {
  // Auto-generate srNo
  const lastLead = await Lead.findOne().sort({ srNo: -1 });
  const srNo = lastLead ? (lastLead.srNo || 0) + 1 : 1;

  // IMPORTANT: If admin creates, they can assign to anyone
  // If sales creates, always assign to themselves
  const assignedTo = user.role === "admin" && data.assignedTo
    ? data.assignedTo
    : user._id;

  const lead = await Lead.create({
    ...data,
    srNo,
    assignedTo,
  });

  return lead.populate("assignedTo", "name email");
};

// ── UPDATE LEAD ───────────────────────────────────────────────────
const updateLead = async (leadId, data, user) => {
  const query = { _id: leadId };

  // Sales can only update their own
  if (user.role === "sales") {
    query.assignedTo = user._id;
    delete data.assignedTo; // Sales cannot reassign
  }

  // Admin can update ANY lead AND can reassign (change assignedTo)
  delete data.srNo; // Never allow changing srNo

  const lead = await Lead.findOneAndUpdate(query, data, {
    new: true,
    runValidators: true,
  }).populate("assignedTo", "name email");

  if (!lead) {
    throw { status: 404, message: "Lead not found or access denied." };
  }

  return lead;
};

// ── DELETE LEAD (Admin only) ──────────────────────────────────────
const deleteLead = async (leadId) => {
  const lead = await Lead.findByIdAndDelete(leadId);
  if (!lead) {
    throw { status: 404, message: "Lead not found." };
  }
  return { message: "Lead deleted successfully." };
};

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead };