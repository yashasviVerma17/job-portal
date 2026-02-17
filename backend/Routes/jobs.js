import express from "express";
import Job from "../models/Job.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();


// ✅ GET ALL JOBS (public)
// ✅ GET ALL JOBS (public) with Search & Filter
router.get("/", async (req, res) => {
  try {
    const { search, location } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET MY JOBS (admin dashboard ke liye)
router.get("/my-jobs", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ POST JOB
router.post("/", authMiddleware, upload.single("logo"), async (req, res) => {
  try {

    const jobData = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      salary: req.body.salary,
      description: req.body.description,
      type: req.body.type,
      experience: req.body.experience,
      skills: req.body.skills
        ? req.body.skills.split(",").map(skill => skill.trim())
        : [],
      postedBy: req.user.id
    };

    if (req.file) {
      jobData.logo = req.file.filename;
    }

    const job = new Job(jobData);
    await job.save();

    res.status(201).json(job);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ UPDATE JOB
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure user owns the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to edit this job" });
    }

    // Update fields
    const { title, company, location, salary, description, type, experience, skills } = req.body;

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.description = description || job.description;
    job.type = type || job.type;
    job.experience = experience || job.experience;

    if (skills) {
      job.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    }

    const updatedJob = await job.save();
    res.json(updatedJob);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ DELETE JOB (only owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
