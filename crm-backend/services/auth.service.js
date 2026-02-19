const User          = require("../models/User");
const generateToken = require("../utils/generateToken");

const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw { status: 401, message: "Invalid email or password." };
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid email or password." };
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      _id:  user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw { status: 404, message: "User not found." };
  }
  return user;
};

module.exports = { login, getMe };
