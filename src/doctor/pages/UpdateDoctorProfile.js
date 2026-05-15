import { useState, useEffect } from "react";
import "../css/UpdateDoctorProfile.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaBell,
  FaEdit,
  FaUser,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaFileAlt
} from "react-icons/fa";

function SectionTitle({ icon, children }) {
  return (
    <div className="section-title">
      {icon}
      {children}
    </div>
  );
}

export default function UpdateDoctorProfile() {
  const navigate = useNavigate();

  const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    gender: "",
    dob: "",
    mobile: "",
    emergencyContact: "",
    specialization: "",
    qualification: "",
    experience: "",
    licenseNumber: "",
    clinicName: "",
    clinicAddress: "",
    city: "",
    state: "",
    mapLink: "",
    about: "",
    serviceType: "",
    workingDays: [],
    workingHours: [
      { start: "", end: "" }
    ]
  });

  const getInitials = (name) => {
    if (!name) return "DR";

    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  // FETCH PROFILE DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/profile-full`, {
          credentials: "include"
        });

        const data = await res.json();

        if (res.ok) {
          const d = data.user;

          const profileData = {
            fullName: d.fullName || "",
            gender: d.gender || "",
            dob: d.dob ? d.dob.split("T")[0] : "",
            mobile: d.mobile || "",
            emergencyContact: d.emergencyContact || "",
            specialization: d.specialization || "",
            qualification: d.qualification || "",
            experience: d.experience || "",
            licenseNumber: d.licenseNumber || "",
            clinicName: d.clinicName || "",
            clinicAddress: d.clinicAddress || "",
            city: d.city || "",
            state: d.state || "",
            mapLink: d.mapLink || "",
            about: d.about || "",
            serviceType: d.serviceType || "",
            workingDays: d.workingDays || [],
            workingHours: d.workingHours?.length
              ? d.workingHours
              : [{ start: "", end: "" }]
          };

          setProfile(profileData);
          setOriginalProfile(profileData);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (index, e) => {
    const updated = [...profile.workingHours];
    updated[index][e.target.name] = e.target.value;

    setProfile({
      ...profile,
      workingHours: updated
    });
  };

  const addSlot = () => {
    setProfile({
      ...profile,
      workingHours: [...profile.workingHours, { start: "", end: "" }]
    });
  };

  const removeSlot = (index) => {
    const updated = profile.workingHours.filter((_, i) => i !== index);

    setProfile({
      ...profile,
      workingHours: updated.length ? updated : [{ start: "", end: "" }]
    });
  };

  const toggleDay = (day) => {
    if (!isEditing) return;

    let days = [...profile.workingDays];

    if (days.includes(day)) {
      days = days.filter(d => d !== day);
    } else {
      days.push(day);
    }

    setProfile({ ...profile, workingDays: days });
  };

  // SAVE API
  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          ...profile,
          fullName: profile.fullName,
          workingHours: profile.workingHours
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Profile Updated ✅");
        setOriginalProfile(JSON.parse(JSON.stringify(profile)));
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error, please try again");
    }
  };

  return (
    <div className="page">

      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={() => navigate("/DoctorDashboard")}>
            <FaArrowLeft /> Dashboard
          </button>
          <span className="topbar-sep">|</span>
          <span className="topbar-title">My <strong>Profile</strong></span>
        </div>

        <div className="topbar-right">
          <div className="avatar-header">{getInitials(profile.fullName)}</div>
        </div>
      </div>

      <div className="content">

        {/* HERO */}
        <div className="profile-hero">
          <div className="dr-avatar">{getInitials(profile.fullName)}</div>

          <div className="hero-info">
            <div className="hero-name">Dr. {profile.fullName || "Your Name"}</div>
            <div className="hero-spec">
              {profile.specialization} · {profile.experience} years experience
            </div>
          </div>

          <div className="action-btns">
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <>
                <button className="edit-btn save" onClick={handleSave}>
                  Save
                </button>
                {/* <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button> */}
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setProfile(originalProfile);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* PERSONAL */}
        <div className="grid-2">
          <div className="section-card">
            <SectionTitle icon={<FaUser />}>Personal Info</SectionTitle>

            <div className="field-row">
              <div className="field">
                <label>Gender</label>
                <input name="gender" value={profile.gender || ""} disabled={!isEditing} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Date of Birth</label>
                <input name="dob" type="date" value={profile.dob || ""} disabled={!isEditing} onChange={handleChange} />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Mobile Number</label>
                <input name="mobile" value={profile.mobile || ""} disabled={!isEditing} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Emergency Contact</label>
                <input name="emergencyContact" value={profile.emergencyContact || ""} disabled={!isEditing} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* PROFESSIONAL */}
          <div className="section-card">
            <SectionTitle icon={<FaGraduationCap />}>Professional Info</SectionTitle>

            <div className="field-row">
              <div className="field">
                <label>Specialization</label>
                <input name="specialization" value={profile.specialization || ""} disabled={!isEditing} onChange={handleChange} />
              </div>

              <div className="field">
                <label>Qualification</label>
                <input name="qualification" value={profile.qualification || ""} disabled={!isEditing} onChange={handleChange} />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label>Experience</label>
                <input name="experience" value={profile.experience || ""} disabled={!isEditing} onChange={handleChange} />
              </div>

              <div className="field">
                <label>License Number</label>
                <input name="licenseNumber" value={profile.licenseNumber || ""} disabled={!isEditing} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* CLINIC */}
        <div className="full-card">
          <SectionTitle icon={<FaMapMarkerAlt />}>Clinic Info</SectionTitle>

          <div className="field-row">
            <div className="field">
              <label>Clinic Name</label>
              <input name="clinicName" value={profile.clinicName || ""} disabled={!isEditing} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Clinic Address</label>
              <input name="clinicAddress" value={profile.clinicAddress || ""} disabled={!isEditing} onChange={handleChange} />
            </div>
          </div>

          <div className="field-row triple">
            <div className="field">
              <label>City</label>
              <input name="city" value={profile.city || ""} disabled={!isEditing} onChange={handleChange} />
            </div>

            <div className="field">
              <label>State</label>
              <input name="state" value={profile.state || ""} disabled={!isEditing} onChange={handleChange} />
            </div>

            <div className="field">
              <label>Map Link</label>
              <input name="mapLink" value={profile.mapLink || ""} disabled={!isEditing} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="grid-2">
          <div className="section-card">
            <SectionTitle icon={<FaCalendarAlt />}>Working Days</SectionTitle>

            <div className="days-wrap">
              {ALL_DAYS.map(day => (
                <div
                  key={day}
                  className={`day-chip ${profile.workingDays.includes(day) ? "" : "off"} ${isEditing ? "clickable" : ""}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <SectionTitle icon={<FaClock />}>Working Hours</SectionTitle>

            {profile.workingHours.map((slot, index) => (
              <div key={index} className="field-row time-row">

                <input
                  type="time"
                  name="start"
                  value={slot.start || ""}
                  disabled={!isEditing}
                  onChange={(e) => handleTimeChange(index, e)}
                />

                <input
                  type="time"
                  name="end"
                  value={slot.end || ""}
                  disabled={!isEditing}
                  onChange={(e) => handleTimeChange(index, e)}
                />

                {isEditing && profile.workingHours.length > 1 && (
                  <button onClick={() => removeSlot(index)}>❌</button>
                )}
              </div>
            ))}

            {isEditing && (
              <button onClick={addSlot} className="add-slot-btn">
                + Add Slot
              </button>
            )}
          </div>
        </div>

        {/* ABOUT */}
        <div className="full-card">
          <SectionTitle icon={<FaFileAlt />}>About</SectionTitle>

          <textarea name="about" value={profile.about || ""} disabled={!isEditing} onChange={handleChange}></textarea>
        </div>

      </div>

      <div className="footer">© 2026 MediTrack</div>
    </div>
  );
}