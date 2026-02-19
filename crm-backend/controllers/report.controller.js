const reportService = require("../services/report.service");

const getReportSummary = async (req, res, next) => {
  try {
    const data = await reportService.getReportSummary();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getReportBySales = async (req, res, next) => {
  try {
    const data = await reportService.getReportBySales();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getReportByDate = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "from and to dates are required." });
    }

    const data = await reportService.getReportByDate(from, to);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getReportSummary, getReportBySales, getReportByDate };
