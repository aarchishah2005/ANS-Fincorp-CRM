const authService = require("../services/auth.service");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, getMe };
