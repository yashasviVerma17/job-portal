
import Application from "../models/Application.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: req.file?.path,
    });

    res.status(201).json(application);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "-password")
      .populate("job");

    res.json(applications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
