import Job from "../models/Job.js";

// Post Job
export const postJob = async (req, res) => {
  try {
    const jobData = { ...req.body, postedBy: req.user._id };
    if (req.file) jobData.logo = req.file.path; // multer file
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

