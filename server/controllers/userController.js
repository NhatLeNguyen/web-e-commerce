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

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, avatar } = req.body;

  console.log("Updating user:", { id, fullName, email, avatar });

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { fullName, email, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
