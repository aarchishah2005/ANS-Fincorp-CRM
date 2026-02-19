const leadService = require("../services/lead.service");

const getLeads = async (req, res, next) => {
  try {
    const leads = await leadService.getLeads(req.user, req.query);
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

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
    const lead = await leadService.updateLead(req.params.id, req.body, req.user);
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

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead };
