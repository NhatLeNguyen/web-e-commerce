import User from "../models/Users.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  console.log("Received data from client:", req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res
      .status(201)
      .json({
        id: result._id,
        fullName: result.fullName,
        email: result.email,
        role: result.role,
      });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    res
      .status(200)
      .json({
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
      });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
