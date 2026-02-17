import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home({ setNavTransparent }) {
  const navigate = useNavigate();

  // Handle Navbar Transparency
  useEffect(() => {
    if (!setNavTransparent) return;
    const handleScroll = () => setNavTransparent(window.scrollY <= 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setNavTransparent]);

  return (
    <div className="font-sans">

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Office Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-up">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm">
            #1 Job Platform for Professionals
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Next Chapter</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
            Access thousands of high-paying jobs from top companies.
            Your dream career is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/jobs")}
              className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg transition shadow-lg shadow-indigo-500/30 hover:scale-105"
            >
              Browse Jobs
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-lg transition backdrop-blur-md hover:scale-105"
            >
              Create Profile
            </button>
          </div>

          {/* Stats Ticker */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-white/50">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white">10k+</h3>
              <p className="text-xs uppercase tracking-wider">Jobs Posted</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white">500+</h3>
              <p className="text-xs uppercase tracking-wider">Companies</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white">1M+</h3>
              <p className="text-xs uppercase tracking-wider">Candidates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Explore Opportunities</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Browse jobs by category and find the perfect role that matches your skills.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/jobs")}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-50 text-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{cat.name}</h3>
                <p className="text-sm text-slate-400 group-hover:text-indigo-500 transition-colors">100+ Jobs Available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50/50 skew-x-12 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-2 block">How It Works</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Simple Steps to Your New Job</h2>
              <p className="text-slate-500 mb-8 text-lg">We've streamlined the hiring process so you can focus on what matters - landing that dream job.</p>

              <div className="space-y-8">
                <Step
                  num="01"
                  title="Create Account"
                  desc="Sign up in seconds and complete your professional profile."
                />
                <Step
                  num="02"
                  title="Upload Resume"
                  desc="Showcase your experience with a detailed resume and portfolio."
                />
                <Step
                  num="03"
                  title="Apply with One Click"
                  desc="Find jobs you love and apply instantly. No improved complex forms."
                />
              </div>
            </div>

            <div className="bg-slate-100 rounded-3xl p-8 relative">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Working"
                className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Career?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of professionals who have found their dream jobs through JobPro.</p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

    </div>
  );
}

const categories = [
  { name: "Development", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Marketing", icon: "📈" },
  { name: "Finance", icon: "💰" },
  { name: "Customer Service", icon: "🎧" },
  { name: "Health", icon: "🏥" },
  { name: "Education", icon: "🎓" },
  { name: "Engineering", icon: "⚙️" },
];

function Step({ num, title, desc }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
        {num}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500">{desc}</p>
      </div>
    </div>
  );
}
