const Lead        = require("../models/Lead");
const leadService = require("../services/lead.service");

// ── Utility: normalise mobile for comparison ──────────────────────────────
// Strips spaces, dashes, dots and leading +91/0 so "+91 98765 43210" === "9876543210"
const normaliseMobile = (mobile) => {
  if (!mobile) return "";
  let m = String(mobile).replace(/[\s\-\.]/g, "");   // remove spaces, dashes, dots
  if (m.startsWith("+91")) m = m.slice(3);
  if (m.startsWith("91") && m.length === 12) m = m.slice(2);
  if (m.startsWith("0"))  m = m.slice(1);
  return m;
};

// ════════════════════════════════════════════════════════════════════════════
// CHECK DUPLICATE MOBILE
// GET /api/leads/check-duplicate?mobile=XXXXXXXX&excludeLeadId=xxx
//
// ROOT CAUSE FIX: We cannot use a regex on the DB because DB values may have
// spaces/formatting different from what the user typed.
// e.g. DB has "84909 49229", user types "8490949229" — regex won't match.
//
// SOLUTION: Fetch all leads (scoped by role), then normalise BOTH sides in JS
// and compare. Safe for CRM scale (thousands of leads, not millions).
// ════════════════════════════════════════════════════════════════════════════
const checkDuplicate = async (req, res) => {
  try {
    const { mobile, excludeLeadId } = req.query;

    if (!mobile || String(mobile).trim().length < 7) {
      return res.json({ found: false, leads: [] });
    }

    const norm = normaliseMobile(mobile);
    if (!norm || norm.length < 7) return res.json({ found: false, leads: [] });

    // ── Scope query (role-based) ──────────────────────────────────────────
    const scopeQuery = {};
    if (req.user.role === "sales") {
      scopeQuery.$or = [
        { assignedTo:  req.user._id },
        { coAssignees: req.user._id },
      ];
    }
    if (excludeLeadId) {
      scopeQuery._id = { $ne: excludeLeadId };
    }

    // ── Fetch all leads in scope (only fields we need) ────────────────────
    const allLeads = await Lead.find(scopeQuery)
      .populate("assignedTo", "name")
      .select("srNo firmName groupName personName mobileNo additionalContacts assignedTo")
      .lean();

    // ── Filter in JS: normalise both sides before comparing ───────────────
    const matches = [];

    for (const lead of allLeads) {
      // Check primary mobile
      if (normaliseMobile(lead.mobileNo) === norm) {
        matches.push({
          _id:        lead._id,
          srNo:       lead.srNo,
          firmName:   lead.firmName,
          groupName:  lead.groupName || "",
          personName: lead.personName,
          mobileNo:   lead.mobileNo,
          assignedTo: lead.assignedTo,
          matchedIn:  "primary",
        });
        continue; // already matched this lead, skip contact check
      }

      // Check additionalContacts
      const contactMatch = (lead.additionalContacts || []).find(
        (c) => normaliseMobile(c.mobileNo) === norm
      );
      if (contactMatch) {
        matches.push({
          _id:        lead._id,
          srNo:       lead.srNo,
          firmName:   lead.firmName,
          groupName:  lead.groupName || "",
          personName: contactMatch.personName || lead.personName,
          mobileNo:   contactMatch.mobileNo,
          assignedTo: lead.assignedTo,
          matchedIn:  "contact",
        });
      }

      if (matches.length >= 5) break; // cap at 5 results
    }

    if (!matches.length) {
      return res.json({ found: false, leads: [] });
    }

    res.json({ found: true, leads: matches });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ADD CO-ASSIGNEE  (NEW)
// PATCH /api/leads/:id/co-assignee
// Called when current user clicks "Edit Existing Lead" on duplicate warning.
// Adds current user as a co-assignee if not already present.
// ════════════════════════════════════════════════════════════════════════════
const addCoAssignee = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    const userId = req.user._id.toString();

    // Don't add if already the primary assignee
    if (lead.assignedTo.toString() === userId) {
      return res.json({ message: "Already the primary assignee.", lead });
    }

    // Don't add if already a co-assignee
    const alreadyCoAssigned = lead.coAssignees.some(
      (id) => id.toString() === userId
    );
    if (!alreadyCoAssigned) {
      lead.coAssignees.push(req.user._id);
      await lead.save();
    }

    const updated = await Lead.findById(lead._id)
      .populate("assignedTo",  "name email")
      .populate("coAssignees", "name email")
      .populate("notes.addedBy", "name");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// GET LEADS (WITH FILTERS) — updated to include coAssignees scope
// ════════════════════════════════════════════════════════════════════════════
const getLeads = async (req, res) => {
  try {
    const {
      search, projectType, sanction, bankName,
      assignedTo, state, district, city, areaEstate, groupName,
    } = req.query;

    const query = {};

    if (req.user.role === "sales") {
      // Sales sees leads they own OR are co-assigned to
      query.$or = [
        { assignedTo: req.user._id },
        { coAssignees: req.user._id },
      ];
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      const searchConditions = [
        { firmName:   { $regex: search, $options: "i" } },
        { personName: { $regex: search, $options: "i" } },
        { mobileNo:   { $regex: search, $options: "i" } },
      ];
      // Merge with existing $or if present (sales scope)
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
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
      .populate("assignedTo",  "name email")
      .populate("coAssignees", "name")
      .populate("notes.addedBy", "name")
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
    const query = { _id: req.params.id };
    if (req.user.role === "sales") {
      query.$or = [
        { assignedTo: req.user._id },
        { coAssignees: req.user._id },
      ];
    }
    const lead = await Lead.findOne(query)
      .populate("assignedTo",  "name email")
      .populate("coAssignees", "name")
      .populate("notes.addedBy", "name");

    if (!lead) return res.status(404).json({ message: "Lead not found or access denied." });
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
// ADD NOTE
// ════════════════════════════════════════════════════════════════════════════
const addNote = async (req, res) => {
  try {
    const { field, message } = req.body;
    const validFields = ["callingDate", "followUpDate", "visitDate"];
    if (!field || !validFields.includes(field)) {
      return res.status(400).json({ message: `field must be one of: ${validFields.join(", ")}` });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "message is required" });
    }

    const query = { _id: req.params.id };
    if (req.user.role === "sales") {
      query.$or = [{ assignedTo: req.user._id }, { coAssignees: req.user._id }];
    }

    const lead = await Lead.findOne(query);
    if (!lead) return res.status(404).json({ message: "Lead not found or access denied." });

    const alreadyExists = lead.notes.some((n) => n.field === field);
    if (alreadyExists) {
      return res.status(409).json({ message: `A note for ${field} already exists on this lead.` });
    }

    lead.notes.push({ field, message: message.trim(), addedBy: req.user._id, addedAt: new Date() });
    await lead.save();

    const updated = await Lead.findById(lead._id)
      .populate("assignedTo",  "name email")
      .populate("coAssignees", "name")
      .populate("notes.addedBy", "name");

    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getLeads,
  getGroups,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  checkDuplicate,   // NEW
  addCoAssignee,    // NEW
};