const User = require("../models/User");

const getSalespersons = async () => {
  const users = await User.find({ role: "sales" })
    .select("-password")
    .sort({ createdAt: -1 });
  return users;
};

const addSalesperson = async (data) => {
  const { name, email, password } = data;

  const existing = await User.findOne({ email });
  if (existing) {
    throw { status: 400, message: "Email already registered." };
  }

  const user = await User.create({ name, email, password, role: "sales" });

  return {
    _id:   user._id,
    name:  user.name,
    email: user.email,
    role:  user.role,
    createdAt: user.createdAt,
  };
};

const updateSalesperson = async (userId, data) => {
  const { name, email } = data;

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw { status: 404, message: "User not found." };
  }

  return user;
};

const deleteSalesperson = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw { status: 404, message: "User not found." };
  }

  return { message: "Salesperson removed successfully." };
};

module.exports = {
  getSalespersons,
  addSalesperson,
  updateSalesperson,
  deleteSalesperson,
};
