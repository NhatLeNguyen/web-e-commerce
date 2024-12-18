import User from "../models/Users.js";

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Cập nhật thông tin người dùng (admin)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, avatar, role } = req.body;

  // Kiểm tra quyền truy cập
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { fullName, email, avatar, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Cập nhật thông tin người dùng (all user)
export const updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { fullName, email } = req.body;

  // Kiểm tra quyền truy cập
  if (!req.user) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { fullName, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Xóa người dùng theo ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra quyền truy cập
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
