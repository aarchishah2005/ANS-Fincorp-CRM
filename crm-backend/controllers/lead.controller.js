const Lead = require("../models/Lead"); // ✅ ADD THIS
const leadService = require("../services/lead.service");

// ════════════════════════════════════════════════════════════════════════════
// GET LEADS (WITH FILTERS)
// ════════════════════════════════════════════════════════════════════════════
const getLeads = async (req, res) => {
  try {
    const {
      search,
      projectType,
      sanction,
      bankName,
      assignedTo,
      state,
      district,
      city,
      areaEstate,
      groupName,
    } = req.query;

    const query = {};

    // ✅ Role-based filtering
    if (req.user.role === "sales") {
      query.assignedTo = req.user._id;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // ✅ Search filter
    if (search) {
      query.$or = [
        { firmName: { $regex: search, $options: "i" } },
        { personName: { $regex: search, $options: "i" } },
        { mobileNo: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Other filters
    if (projectType) query.projectType = projectType;
    if (bankName) query.bankName = bankName;

    if (sanction !== undefined && sanction !== "") {
      query.sanction = sanction === "true";
    }

    // ✅ Location filters
    if (state) query.state = { $regex: `^${state}$`, $options: "i" };
    if (district) query.district = { $regex: `^${district}$`, $options: "i" };
    if (city) query.city = { $regex: `^${city}$`, $options: "i" };
    if (areaEstate)
      query.areaEstate = { $regex: `^${areaEstate}$`, $options: "i" };

    // ✅ Group filter
    if (groupName)
      query.groupName = { $regex: `^${groupName}$`, $options: "i" };

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
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
    const groups = await Lead.distinct("groupName", {
      groupName: { $ne: "" },
    });

    res.json(groups.filter(Boolean).sort());
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// OTHER CRUD (USING SERVICE)
// ════════════════════════════════════════════════════════════════════════════

const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id, req.user);
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

const createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.body, req.user);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(
      req.params.id,
      req.body,
      req.user
    );
    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const result = await leadService.deleteLead(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ✅ SINGLE EXPORT (IMPORTANT)
module.exports = {
  getLeads,
  getGroups,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};