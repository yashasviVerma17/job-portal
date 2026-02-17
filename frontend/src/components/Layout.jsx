import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "./Nav";
import Home from "../pages/Home";
import Jobs from "../pages/Jobs";
import Login from "../pages/Login";
import ApplyJob from "../pages/ApplyJob";
import AdminDashboard from "../pages/AdminDashboard";
import Footer from "./Footer";
import Register from "../pages/Register";
import PostJob from "../pages/PostJob";
import Profile from "../pages/Profile";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate hook
  const isHome = location.pathname === "/";

  const [navTransparent, setNavTransparent] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Redirect to Home on Refresh/Mount
  useEffect(() => {
    navigate("/");
  }, []);

  // ✅ Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (token) {
      setUser({ token, role, userId });
    } else {
      setUser(null);
    }
  }, []);

  // ✅ Navbar scroll logic
  useEffect(() => {
    if (!isHome) {
      setNavTransparent(false);
      return;
    }

    const handleScroll = () => {
      setNavTransparent(window.scrollY < 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <>
      <Nav transparent={isHome && navTransparent} user={user} />

      <div className={isHome ? "" : "pt-24"}>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home setNavTransparent={setNavTransparent} />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          {/* Employee Protected */}
          <Route
            path="/profile"
            element={
              user && user.role === "employee"
                ? <Profile />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/apply/:id"
            element={
              user && user.role === "employee"
                ? <ApplyJob />
                : <Navigate to="/login" />
            }
          />

          {/* View Profile (Public/Recruiter View) */}
          <Route path="/profile/:id" element={<Profile />} />

          {/* Recruiter Protected */}
          <Route
            path="/admin"
            element={
              user && user.role === "recruiter"
                ? <AdminDashboard />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/admin/post-job"
            element={
              user && user.role === "recruiter"
                ? <PostJob />
                : <Navigate to="/login" />
            }
          />

        </Routes>

        <Footer />
      </div>
    </>
  );
}

export default Layout;

