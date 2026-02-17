import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, locationFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Build Query
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (locationFilter) params.append("location", locationFilter);

      const res = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`, {
        headers
      });
      setJobs(res.data);
      setFilteredJobs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (role !== "employee") {
      alert("Only employees can apply");
      return;
    }

    try {
      const profileRes = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Check if profile exists (backend returns {} if null, so check keys)
      if (!profileRes.data || Object.keys(profileRes.data).length === 0) {
        alert("Please complete your profile details before applying.");
        navigate("/profile");
        return;
      }

      navigate(`/apply/${jobId}`);
    } catch (err) {
      console.log(err);
      alert("Error checking profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER & SEARCH */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Find Your Next Role</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search by job title, company, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="w-full md:w-1/4 relative">
              <span className="absolute left-4 top-3.5 text-slate-400">📍</span>
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* JOBS GRID */}
        {loading ? (
          <div className="flex justify-center py-20 text-indigo-600">Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-300">
            <h3 className="text-xl font-medium text-slate-600">No jobs found</h3>
            <p className="text-slate-400 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* Placeholder Logo if none */}
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl overflow-hidden border border-indigo-100">
                      {job.logo ? (
                        <img src={`http://localhost:5000/uploads/${job.logo}`} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        job.company.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">{job.company}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-500 gap-2">
                    <span>📍</span> {job.location}
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {job.experience || "Fresher"}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      {job.salary || "Not Disclosed"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(job._id)}
                  className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/10 group-hover:shadow-indigo-500/30"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
