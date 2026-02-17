import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 font-light track-wide">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Job<span className="text-indigo-500">Pro</span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Connecting world-class talent with global opportunities.
            Your dream career starts here.
          </p>
          <div className="flex gap-4 pt-2">
            <SocialIcon icon="🐦" />
            <SocialIcon icon="📘" />
            <SocialIcon icon="📸" />
            <SocialIcon icon="💼" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">Explore</h3>
          <ul className="space-y-3 text-sm">
            <FooterLink to="/" label="Home" />
            <FooterLink to="/jobs" label="Browse Jobs" />
            <FooterLink to="/login" label="Sign In" />
            <FooterLink to="/register" label="Join Now" />
          </ul>
        </div>

        {/* For Employers */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">Employers</h3>
          <ul className="space-y-3 text-sm">
            <FooterLink to="/admin/post-job" label="Post a Job" />
            <FooterLink to="/admin" label="Dashboard" />
            <FooterLink to="/pricing" label="Pricing" />
            <FooterLink to="/contact" label="Contact Sales" />
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">Stay Updated</h3>
          <p className="text-sm text-slate-400 mb-4">
            Get the latest job trends and news.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-slate-800 text-white px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
              →
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobPro Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link to={to} className="hover:text-indigo-400 transition-colors duration-200">
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({ icon }) {
  return (
    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition cursor-pointer">
      {icon}
    </div>
  );
}
