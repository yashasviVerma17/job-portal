import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Nav({ transparent, user }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine Nav Style
  // If home and not scrolled -> Transparent (if requested)
  // Else -> Glass sticky
  const isTransparent = isHome && !scrolled && transparent;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isTransparent
        ? "bg-transparent py-6"
        : "bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-white/20"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition">
            J
          </div>
          <h1
            className={`text-2xl font-bold tracking-tight ${isTransparent ? "text-white" : "text-slate-800"
              }`}
          >
            Job<span className="text-indigo-600">Pro</span>
          </h1>
        </Link>

        {/* LINKS */}
        <div className="flex items-center space-x-6">
          <NavLink to="/jobs" label="🔍 Find Jobs" transparent={isTransparent} />

          <div className="hidden md:flex items-center space-x-6">
            {user?.role === 'recruiter' && (
              <NavLink to="/admin" label="Dashboard" transparent={isTransparent} />
            )}

            {user?.role === 'employee' && (
              <NavLink to="/profile" label="My Profile" transparent={isTransparent} />
            )}
          </div>
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${isTransparent ? "text-white/90" : "text-slate-600"}`}>
                Hi, {user.name || "User"}
              </span>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="text-xs border border-red-200 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`font-medium transition ${isTransparent ? "text-white hover:text-white/80" : "text-slate-600 hover:text-indigo-600"
                  }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, transparent }) {
  return (
    <Link
      to={to}
      className={`font-medium transition relative group ${transparent ? "text-white/90 hover:text-white" : "text-slate-600 hover:text-indigo-600"
        }`}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${transparent ? "bg-white" : "bg-indigo-600"}`}></span>
    </Link>
  );
}
