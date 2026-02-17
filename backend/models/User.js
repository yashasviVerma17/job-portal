import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["employee", "recruiter"], required: true },
  profile: {
    phone: String,
    headline: String,
    location: String,
    github: String,
    linkedin: String,
    bio: String,
    skills: [String],
    languages: [String],
    experience: String,
    education: String,
    avatar: String,
    resume: String
  }
}, { timestamps: true });

// ===== PASSWORD HASH =====
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ===== MATCH PASSWORD =====
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ===== JWT TOKEN =====
userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export default mongoose.model("User", userSchema);
