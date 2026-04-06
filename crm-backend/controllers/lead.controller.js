const Lead        = require("../models/Lead");
const leadService = require("../services/lead.service");

// ════════════════════════════════════════════════════════════════════════════
// GET LEADS (WITH FILTERS)
// ════════════════════════════════════════════════════════════════════════════
const getLeads = async (req, res) => {
  try {
    const {
      search, projectType, sanction, bankName,
      assignedTo, state, district, city, areaEstate, groupName,
    } = req.query;

    const query = {};

    if (req.user.role === "sales") {
      query.assignedTo = req.user._id;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.$or = [
        { firmName:   { $regex: search, $options: "i" } },
        { personName: { $regex: search, $options: "i" } },
        { mobileNo:   { $regex: search, $options: "i" } },
      ];
    }

    if (projectType) query.projectType = projectType;
    if (bankName)    query.bankName    = bankName;

    if (sanction !== undefined && sanction !== "") {
      query.sanction = sanction === "true";
    }

    if (state)      query.state      = { $regex: `^${state}$`,      $options: "i" };
    if (district)   query.district   = { $regex: `^${district}$`,   $options: "i" };
    if (city)       query.city       = { $regex: `^${city}$`,       $options: "i" };
    if (areaEstate) query.areaEstate = { $regex: `^${areaEstate}$`, $options: "i" };
    if (groupName)  query.groupName  = { $regex: `^${groupName}$`,  $options: "i" };

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name")   // ← populate note authors
      .sort({ srNo: -1 });

    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET UNIQUE GROUP NAMES
// ════════════════════════════════════════════════════════════════════════════
const getGroups = async (req, res) => {
  try {
    const groups = await Lead.distinct("groupName", { groupName: { $ne: "" } });
    res.json(groups.filter(Boolean).sort());
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET SINGLE LEAD
// ════════════════════════════════════════════════════════════════════════════
const getLeadById = async (req, res, next) => {
  try {
    // Use direct query so we can populate notes.addedBy too
    const query = { _id: req.params.id };
    if (req.user.role === "sales") query.assignedTo = req.user._id;

    const lead = await Lead.findOne(query)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found or access denied." });
    }
    res.status(200).json(lead);
  } catch (err) {
    next(err);
  }
};

// ════════════════════════════════════════════════════════════════════════════
// CREATE LEAD
// ════════════════════════════════════════════════════════════════════════════
const createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.body, req.user);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════════════════════════════════════════
// UPDATE LEAD
// ════════════════════════════════════════════════════════════════════════════
const updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body, req.user);
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════════════════════════════════════════
// DELETE LEAD
// ════════════════════════════════════════════════════════════════════════════
const deleteLead = async (req, res, next) => {
  try {
    const result = await leadService.deleteLead(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ADD NOTE  (NEW)
// POST /api/leads/:id/notes
// Body: { field: "callingDate"|"followUpDate"|"visitDate", message: string }
// Rules:
//   - field + message both required
//   - max one note per field per lead (returns 409 if already exists)
//   - sales can only add note to their own lead
//   - admin can add to any lead
// ════════════════════════════════════════════════════════════════════════════
const addNote = async (req, res) => {
  try {
    const { field, message } = req.body;

    // ── Validate input ────────────────────────────────────────────────────
    const validFields = ["callingDate", "followUpDate", "visitDate"];
    if (!field || !validFields.includes(field)) {
      return res.status(400).json({
        message: `field must be one of: ${validFields.join(", ")}`,
      });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "message is required" });
    }

    // ── Find the lead (role-scoped) ───────────────────────────────────────
    const query = { _id: req.params.id };
    if (req.user.role === "sales") query.assignedTo = req.user._id;

    const lead = await Lead.findOne(query);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found or access denied." });
    }

    // ── One note per field rule ───────────────────────────────────────────
    const alreadyExists = lead.notes.some((n) => n.field === field);
    if (alreadyExists) {
      return res.status(409).json({
        message: `A note for ${field} already exists on this lead.`,
      });
    }

    // ── Push the new note ─────────────────────────────────────────────────
    lead.notes.push({
      field,
      message: message.trim(),
      addedBy: req.user._id,
      addedAt: new Date(),
    });

    await lead.save();

    // Re-fetch with populated fields to return full data
    const updated = await Lead.findById(lead._id)
      .populate("assignedTo", "name email")
      .populate("notes.addedBy", "name");

    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════
module.exports = {
  getLeads,
  getGroups,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,      // ← NEW
};