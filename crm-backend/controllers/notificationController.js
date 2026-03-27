// controllers/notificationController.js  ← REPLACE existing file
const Lead = require("../models/Lead");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
// Helper: build flat notification list from leads array
// ─────────────────────────────────────────────────────────────
const DATE_FIELDS = ["callingDate", "followUpDate", "visitDate"];
const DATE_LABEL  = {
  callingDate:  "Calling",
  followUpDate: "Follow-Up",
  visitDate:    "Visit",
};

function buildNotifications(leads, doneSet) {
  const list = [];
  leads.forEach((lead) => {
    DATE_FIELDS.forEach((field) => {
      if (!lead[field]) return;
      const key = `${lead._id}_${field}`;
      list.push({
        leadId:      lead._id,
        srNo:        lead.srNo,
        firmName:    lead.firmName,
        personName:  lead.personName,
        mobileNo:    lead.mobileNo,
        salesPerson: lead.assignedTo?.name || "—",
        type:        DATE_LABEL[field],
        field,
        date:        lead[field],
        isDone:      doneSet.has(key),
      });
    });
  });
  return list;
}

// ─────────────────────────────────────────────────────────────
// GET /api/notifications
// Returns today, tomorrow, and overdue notifications
// ─────────────────────────────────────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    const now   = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Role-based owner filter
    const ownerFilter =
      req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    // ── Fetch user's doneReminders to build a quick lookup Set ──
    const userDoc = await User.findById(req.user._id)
      .select("doneReminders")
      .lean();

    const doneSet = new Set(
      (userDoc?.doneReminders || []).map(
        (d) => `${d.leadId}_${d.field}`
      )
    );

    // ── TODAY & TOMORROW leads ───────────────────────────────
    const upcomingLeads = await Lead.find({
      ...ownerFilter,
      $or: DATE_FIELDS.map((f) => ({
        [f]: {
          $gte: today,
          $lt:  dayAfterTomorrow,
        },
      })),
    })
      .populate("assignedTo", "name")
      .select("srNo firmName personName mobileNo callingDate followUpDate visitDate assignedTo")
      .lean();

    // ── OVERDUE leads (any of 3 dates strictly before today) ──
    const overdueLeads = await Lead.find({
      ...ownerFilter,
      $or: DATE_FIELDS.map((f) => ({
        [f]: { $lt: today },
      })),
    })
      .populate("assignedTo", "name")
      .select("srNo firmName personName mobileNo callingDate followUpDate visitDate assignedTo")
      .lean();

    // ── Build notification lists ─────────────────────────────
    const upcomingNotifs = buildNotifications(upcomingLeads, doneSet);
    const overdueNotifs  = buildNotifications(overdueLeads,  doneSet);

    // Tag today / tomorrow
    upcomingNotifs.forEach((n) => {
      const d = new Date(n.date); d.setHours(0, 0, 0, 0);
      n.when = d.getTime() === today.getTime() ? "today" : "tomorrow";
    });

    overdueNotifs.forEach((n) => {
      n.when = "overdue";
    });

    // Sort upcoming: today first, then by type
    upcomingNotifs.sort((a, b) => {
      if (a.when !== b.when) return a.when === "today" ? -1 : 1;
      return a.type.localeCompare(b.type);
    });

    // Sort overdue: most recent overdue first
    overdueNotifs.sort((a, b) => new Date(b.date) - new Date(a.date));

    const todayList    = upcomingNotifs.filter((n) => n.when === "today");
    const tomorrowList = upcomingNotifs.filter((n) => n.when === "tomorrow");

    res.json({
      success:       true,
      todayCount:    todayList.length,
      tomorrowCount: tomorrowList.length,
      overdueCount:  overdueNotifs.length,
      notifications: [...upcomingNotifs, ...overdueNotifs],
    });
  } catch (err) {
    console.error("Notifications error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/notifications/done
// Toggle done/undone for a single reminder
// Body: { leadId, field }
// ─────────────────────────────────────────────────────────────
exports.toggleDone = async (req, res) => {
  try {
    const { leadId, field } = req.body;

    if (!leadId || !field || !DATE_FIELDS.includes(field)) {
      return res.status(400).json({ success: false, message: "Invalid leadId or field" });
    }

    const user = await User.findById(req.user._id).select("doneReminders");

    const existingIndex = user.doneReminders.findIndex(
      (d) =>
        d.leadId.toString() === leadId.toString() &&
        d.field === field
    );

    let isDone;
    if (existingIndex > -1) {
      // Already done → untick
      user.doneReminders.splice(existingIndex, 1);
      isDone = false;
    } else {
      // Not done → tick
      user.doneReminders.push({ leadId, field, doneAt: new Date() });
      isDone = true;
    }

    await user.save();

    res.json({ success: true, isDone });
  } catch (err) {
    console.error("Toggle done error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};