import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [role, setRole] = useState("employee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name, email, password, role
      });
      alert("Registered Successfully ✅");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center relative overflow-hidden py-10">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/50 w-full max-w-lg relative z-10">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Create Account</h2>
        <p className="text-center text-slate-500 mb-8">Join thousands of professionals today</p>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setRole("employee")}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === "employee"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-200 hover:border-indigo-300 text-slate-500"
              }`}
          >
            <span className="text-2xl">👨‍💼</span>
            <span className="font-semibold text-sm">Job Seeker</span>
          </button>

          <button
            onClick={() => setRole("recruiter")}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === "recruiter"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "border-slate-200 hover:border-indigo-300 text-slate-500"
              }`}
          >
            <span className="text-2xl">🏢</span>
            <span className="font-semibold text-sm">Recruiter</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50/50"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 mt-4 disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
