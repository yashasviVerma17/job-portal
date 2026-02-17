import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCamera, FaSave } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
  const { id } = useParams(); // Get ID from URL if present
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(true);

  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [gender, setGender] = useState("Female");
  const [about, setAbout] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);

  const token = localStorage.getItem("token");

  // LOAD PROFILE FROM DB
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let url = "http://localhost:5000/api/profile";

        // If viewing another user's profile
        if (id) {
          url = `http://localhost:5000/api/profile/${id}`;
          setIsOwnProfile(false);
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && Object.keys(res.data).length > 0) {
          setName(res.data.name || "");
          setHeadline(res.data.headline || "");
          setLocation(res.data.location || "");
          setEmail(res.data.email || "");
          setPhone(res.data.phone || "");
          setGithub(res.data.github || "");
          setLinkedin(res.data.linkedin || "");
          setGender(res.data.gender || "");
          setAbout(res.data.bio || "");
          setExperience(res.data.experience || "");
          setEducation(res.data.education || "");
          setLanguages(res.data.languages || []);
          setSkills(res.data.skills || []);
          setProfileImage(res.data.profileImage || null);
          setIsNewProfile(false);
        } else {
          setIsNewProfile(true);
          setIsEditing(true); // Auto-enable editing for new profiles
        }

      } catch (err) {
        console.log("No profile found");
      }
    };

    fetchProfile();
  }, [id, token]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // SAVE PROFILE TO DB
  const toggleEdit = async () => {

    if (isEditing) {
      try {
        await axios.put(
          "http://localhost:5000/api/profile",
          {
            name,
            headline,
            location,
            email,
            phone,
            github,
            linkedin,
            gender,
            bio: about,
            experience,
            education,
            languages,
            skills
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // alert("Profile Saved ✅");
        if (window.confirm("Profile Saved ✅\nDo you want to browse jobs now?")) {
          navigate("/jobs");
        }
      } catch (err) {
        alert("Profile not saved ❌");
      }
    }

    setIsEditing(!isEditing);
  };

  const handleCheckbox = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {isOwnProfile ? (isNewProfile ? "Create Your Profile" : "My Profile") : "Applicant Profile"}
            </h2>
            {isOwnProfile && !isNewProfile && (
              <p className="text-slate-500 text-sm mt-1">Keep your profile updated to get better jobs.</p>
            )}
          </div>

          <div className="flex gap-3">
            {isOwnProfile && (
              <button
                onClick={() => navigate("/jobs")}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-500/20"
              >
                🔍 Search Jobs
              </button>
            )}

            {isOwnProfile && (
              isEditing ? (
                <button
                  onClick={toggleEdit}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-lg shadow-green-500/30"
                >
                  <FaSave /> {isNewProfile ? "Create Profile" : "Save Changes"}
                </button>
              ) : (
                <button onClick={toggleEdit} className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition">
                  <FaEdit className="text-slate-600 text-xl" />
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src={
                profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded w-full md:w-80 font-semibold text-lg"
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="border p-2 rounded w-full md:w-80 text-sm"
                  placeholder="Headline (e.g. Full Stack Developer)"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border p-2 rounded w-full md:w-80 text-sm"
                  placeholder="Location (e.g. New Delhi, India)"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold">{name}</h3>
                <p className="text-slate-600 font-medium">{headline}</p>
                <p className="text-slate-500 text-sm mt-1">📍 {location}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Personal Info</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              ) : (
                <p className="font-medium">{email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="+91 9876543210"
                />
              ) : (
                <p className="font-medium">{phone || "Not added"}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Gender</label>
              {isEditing ? (
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="border p-2 w-full rounded"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              ) : (
                <p className="font-medium">{gender}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">LinkedIn</label>
              {isEditing ? (
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="Linkedin Profile URL"
                />
              ) : (
                <p className="font-medium text-blue-600 truncate">{linkedin ? <a href={linkedin} target="_blank">View Profile</a> : "Not added"}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">GitHub</label>
              {isEditing ? (
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="border p-2 w-full rounded"
                  placeholder="GitHub Profile URL"
                />
              ) : (
                <p className="font-medium text-slate-800 truncate">{github ? <a href={github} target="_blank">View GitHub</a> : "Not added"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="text-xl font-semibold mb-4">Experience</h3>
          {isEditing ? (
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="border p-3 w-full rounded h-32"
              placeholder="Describe your work experience..."
            />
          ) : (
            <p className="whitespace-pre-line text-slate-700">{experience || "No experience added yet."}</p>
          )}
        </div>

        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <h3 className="text-xl font-semibold mb-4">Education</h3>
          {isEditing ? (
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="border p-3 w-full rounded h-24"
              placeholder="Describe your education..."
            />
          ) : (
            <p className="whitespace-pre-line text-slate-700">{education || "No education added yet."}</p>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">About Me</h3>
          {isEditing ? (
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="border p-3 w-full rounded"
              rows="4"
            />
          ) : (
            <p>{about}</p>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Languages</h3>
          {isEditing ? (
            <div className="flex gap-4 flex-wrap">
              {["Hindi", "English", "French"].map((lang) => (
                <label key={lang} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={languages.includes(lang)}
                    onChange={() =>
                      handleCheckbox(lang, languages, setLanguages)
                    }
                  />
                  {lang}
                </label>
              ))}
            </div>
          ) : (
            <p>{languages.join(", ")}</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Skills</h3>
          {isEditing ? (
            <div className="flex flex-wrap gap-4">
              {["HTML", "CSS", "JavaScript", "React", "Node"].map((skill) => (
                <label key={skill} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() =>
                      handleCheckbox(skill, skills, setSkills)
                    }
                  />
                  {skill}
                </label>
              ))}
            </div>
          ) : (
            <p>{skills.join(", ")}</p>
          )}
        </div>

        {isOwnProfile && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate("/jobs")}
              className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition flex items-center justify-center gap-2 mx-auto"
            >
              🚀 Find & Apply for Jobs
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
