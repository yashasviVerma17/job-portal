import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET PROFILE
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// UPDATE PROFILE
router.put("/me", authMiddleware, upload.single("profileImage"), async (req, res) => {
  const updates = { ...req.body };

  if (req.file) updates.profileImage = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
});

export default router;
