import User from "../models/Users.js";

export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64Image = file.buffer.toString("base64");

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: base64Image },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload avatar", error });
  }
};
