const Lead = require("../models/Lead");

// ── SUMMARY STATS ─────────────────────────────────────────────────
const getReportSummary = async () => {
  const [stats] = await Lead.aggregate([
    {
      $group: {
        _id:        null,
        totalLeads: { $sum: 1 },
        sanctioned: { $sum: { $cond: ["$sanction", 1, 0] } },
        totalAmount:{ $sum: "$amount" },
        sanctionedAmount: { $sum: { $cond: ["$sanction", "$amount", 0] } },
      },
    },
  ]);

  // Count by project type
  const byProjectType = await Lead.aggregate([
    { $group: { _id: "$projectType", count: { $sum: 1 } } },
  ]);

  // Count by ans client type
  const byAnsClientType = await Lead.aggregate([
    { $group: { _id: "$ansClientType", count: { $sum: 1 } } },
  ]);

  const projectTypeCounts = {};
  byProjectType.forEach((item) => {
    if (item._id) projectTypeCounts[item._id] = item.count;
  });

  const ansClientTypeCounts = {};
  byAnsClientType.forEach((item) => {
    if (item._id) ansClientTypeCounts[item._id] = item.count;
  });

  return {
    stats: {
      totalLeads:       stats?.totalLeads       || 0,
      sanctioned:       stats?.sanctioned       || 0,
      totalAmount:      stats?.totalAmount      || 0,
      sanctionedAmount: stats?.sanctionedAmount || 0,
    },
    byProjectType: projectTypeCounts,
    byAnsClientType: ansClientTypeCounts,
  };
};

// ── PERFORMANCE BY SALESPERSON ────────────────────────────────────
const getReportBySales = async () => {
  const data = await Lead.aggregate([
    {
      $group: {
        _id:        "$assignedTo",
        leads:      { $sum: 1 },
        sanctioned: { $sum: { $cond: ["$sanction", 1, 0] } },
        amount:     { $sum: { $cond: ["$sanction", "$amount", 0] } },
      },
    },
    {
      $lookup: {
        from:         "users",
        localField:   "_id",
        foreignField: "_id",
        as:           "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id:        0,
        name:       "$user.name",
        leads:      1,
        sanctioned: 1,
        amount:     1,
      },
    },
    { $sort: { leads: -1 } },
  ]);

  return { data };
};

// ── LEADS OVER TIME ─────────────────────────────────────────────
const getReportByDate = async (from, to) => {
  const start = new Date(from);
  const end   = new Date(to);
  end.setHours(23, 59, 59, 999);

  const data = await Lead.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          year:  { $year:  "$createdAt" },
          month: { $month: "$createdAt" },
        },
        leads:      { $sum: 1 },
        sanctioned: { $sum: { $cond: ["$sanction", 1, 0] } },
        amount:     { $sum: { $cond: ["$sanction", "$amount", 0] } },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id:   0,
        month: {
          $concat: [
            { $arrayElemAt: [
              ["", "Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"],
              "$_id.month",
            ]},
            " ",
            { $toString: "$_id.year" },
          ],
        },
        leads:      1,
        sanctioned: 1,
        amount:     1,
      },
    },
  ]);

  return { data };
};

module.exports = { getReportSummary, getReportBySales, getReportByDate };
