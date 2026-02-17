import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!resume) {
      alert("Please upload your resume");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobId", id);

      await axios.post(
        "http://localhost:5000/api/applications",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Applied Successfully 🚀");
      navigate("/jobs");

    } catch (err) {
      const msg = err.response?.data?.message || "Apply Failed ";
      alert(msg);
      if (msg === "Save your profile first") {
        navigate("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100 text-center">

        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-blue-600">
          🚀
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-2">Apply for this Job</h2>
        <p className="text-slate-500 mb-8">Upload your resume to continue.</p>

        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 mb-6 hover:border-indigo-500 transition bg-slate-50 group cursor-pointer relative">
          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="pointer-events-none">
            <span className="text-4xl block mb-2">📄</span>
            {resume ? (
              <span className="text-indigo-600 font-medium break-all">{resume.name}</span>
            ) : (
              <span className="text-slate-400 group-hover:text-indigo-500 font-medium">Click to Upload Resume (PDF)</span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/jobs")}
            className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Submit Application"}
          </button>
        </div>

      </div>
    </div>
  );
}
