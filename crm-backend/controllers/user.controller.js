const userService = require("../services/user.service");

const getSalespersons = async (req, res, next) => {
  try {
    const users = await userService.getSalespersons();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const addSalesperson = async (req, res, next) => {
  try {
    const user = await userService.addSalesperson(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const updateSalesperson = async (req, res, next) => {
  try {
    const user = await userService.updateSalesperson(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteSalesperson = async (req, res, next) => {
  try {
    const result = await userService.deleteSalesperson(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalespersons,
  addSalesperson,
  updateSalesperson,
  deleteSalesperson,
};
