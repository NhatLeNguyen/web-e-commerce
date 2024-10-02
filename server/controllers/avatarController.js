import User from "../models/Users.js";

// Tải lên avatar
export const uploadAvatar = async (req, res) => {
  const { id } = req.params;
  const avatarPath = req.file.path;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { avatar: avatarPath },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
