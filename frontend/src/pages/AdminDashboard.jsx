import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editJob, setEditJob] = useState(null); // Job being edited
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "recruiter") {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsRes = await axios.get("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const appRes = await axios.get("http://localhost:5000/api/applications", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const myJobs = jobsRes.data.filter(
        job => job.postedBy === userId || job.postedBy?._id === userId
      );

      const myApplications = appRes.data.filter(app =>
        myJobs.some(job => job._id === app.job?._id)
      );

      setJobs(myJobs);
      setApplications(myApplications);

    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${editJob._id}`,
        editJob,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditJob(null);
      fetchData(); // Refresh list
      alert("Job updated successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Failed to update job ❌");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.log("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-6 shadow-2xl hidden md:block">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">R</div>
          <h2 className="text-2xl font-bold">Recruiter</h2>
        </div>

        <nav className="space-y-2">
          <SideLink active icon="📊" label="Dashboard" />
          <Link to="/admin/post-job" className="block px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/20 mb-6">
            + Post New Job
          </Link>

          <div className="border-t border-slate-800 my-4"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* TOP BAR (Mobile toggle could go here) */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back, here's what's happening.</p>
          </div>
          <div className="md:hidden">
            {/* Mobile Menu Button - simplified */}
            <button onClick={handleLogout} className="text-slate-600">Logout</button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <StatCard title="Active Jobs" value={jobs.length} icon="💼" color="indigo" />
          <StatCard title="Total Applications" value={applications.length} icon="📝" color="green" />
        </div>

        {/* JOB LISTINGS */}
        <h2 className="text-xl font-bold text-slate-800 mb-6">Your Posted Jobs</h2>

        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-dashed border-slate-300">
              <p className="text-slate-500">You haven't posted any jobs yet.</p>
            </div>
          ) : (
            jobs.map(job => {
              const jobApplicants = applications.filter(
                app => app.job?._id === job._id
              );

              return (
                <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                      <p className="text-slate-500 mt-1 flex items-center gap-2">
                        <span>🏢 {job.company}</span> • <span>📍 {job.location}</span>
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                      <button
                        onClick={() => setEditJob(job)}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* APPLICANTS SECTION */}
                  <div className="p-6 bg-slate-50/50">
                    <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                      Candidates <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{jobApplicants.length}</span>
                    </h4>

                    {jobApplicants.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No candidates yet.</p>
                    ) : (
                      <div className="grid gap-3">
                        {jobApplicants.map(app => (
                          <div key={app._id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition">
                            <div>
                              <p className="font-bold text-slate-800">{app.applicant?.name}</p>
                              <p className="text-xs text-slate-500">{app.applicant?.email}</p>
                            </div>
                            <div className="flex gap-2">
                              {app.resume && (
                                <a
                                  href={`http://localhost:5000/uploads/${app.resume}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                                >
                                  Resume
                                </a>
                              )}
                              <Link
                                to={`/profile/${app.applicant?._id}`}
                                className="text-slate-600 hover:text-slate-800 text-sm font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                              >
                                Profile
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* EDIT MODAL */}
      {editJob && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Job</h2>
            <form onSubmit={handleUpdateJob} className="space-y-4">

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                  <input
                    value={editJob.title}
                    onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input
                    value={editJob.company}
                    onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    value={editJob.location}
                    onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input
                    value={editJob.salary}
                    onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={editJob.type}
                    onChange={(e) => setEditJob({ ...editJob, type: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Remote</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                  <input
                    value={editJob.experience}
                    onChange={(e) => setEditJob({ ...editJob, experience: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                    placeholder="e.g. 1-3 years"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={editJob.description}
                  onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                  className="w-full border p-2 rounded-lg h-32"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
                <input
                  value={Array.isArray(editJob.skills) ? editJob.skills.join(", ") : editJob.skills}
                  onChange={(e) => setEditJob({ ...editJob, skills: e.target.value })}
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditJob(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-emerald-50 text-emerald-600"
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function SideLink({ active, icon, label }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
