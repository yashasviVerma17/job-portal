import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user.profile || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET USER PROFILE BY ID (for recruiters/public)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.profile || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const { name, email, ...profileData } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        profile: profileData
      },
      { new: true }
    ).select("-password");

    // Return combined data consistent with GET
    res.json({
      name: updatedUser.name,
      email: updatedUser.email,
      ...updatedUser.profile.toObject()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
