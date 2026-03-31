import { useNavigate } from "react-router-dom";
import "../css/PatientLanding.css";

// ── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="pl-nav">
      <div className="pl-nav-inner">
        <div className="pl-logo">
          <span className="pl-logo-icon">⚕️</span>
          <span className="pl-logo-text">MediTrack</span>
        </div>
        <div className="pl-nav-links">
          <a href="#features" className="pl-nav-link">Features</a>
          <a href="#how-it-works" className="pl-nav-link">How It Works</a>
          <a href="#contact" className="pl-nav-link">Contact</a>
        </div>
        <div className="pl-nav-actions">
          <button className="pl-btn-outline" onClick={() => navigate("/patient/login")}>Login</button>
          <button className="pl-btn-primary" onClick={() => navigate("/patient/register")}>Sign Up</button>
          <div className="pl-nav-divider" />
          <button className="pl-btn-doctor-outline" onClick={() => navigate("/DoctorLogin")}>Doctor Login</button>
        </div>
      </div>
    </nav>
  );
};

// ── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="pl-hero">
      <div className="pl-hero-content">
        <span className="pl-hero-badge">🏥 Trusted Healthcare Platform</span>
        <h1 className="pl-hero-title">
          Your Health,<br />
          <span className="pl-hero-accent">Our Priority</span>
        </h1>
        <p className="pl-hero-desc">
          Connect with verified doctors, book appointments instantly, and manage
          your health records — all in one secure platform.
        </p>
        <div className="pl-hero-btns">
          <button className="pl-btn-primary pl-btn-lg" onClick={() => navigate("/patient/login")}>
            Login to Account
          </button>
          <button className="pl-btn-outline pl-btn-lg" onClick={() => navigate("/patient/register")}>
            Register as Patient
          </button>
        </div>

        {/* Doctor portal links */}
        <div className="pl-doctor-portal">
          <span className="pl-doctor-portal-label">Are you a doctor?</span>
          <button className="pl-btn-doctor-outline" onClick={() => navigate("/DoctorLogin")}>
            Doctor Login
          </button>
          <button className="pl-btn-doctor-ghost" onClick={() => navigate("/DoctorRegister")}>
            Join as Doctor →
          </button>
        </div>
        <div className="pl-hero-stats">
          <div className="pl-stat"><span className="pl-stat-num">500+</span><span className="pl-stat-label">Doctors</span></div>
          <div className="pl-stat-divider" />
          <div className="pl-stat"><span className="pl-stat-num">10K+</span><span className="pl-stat-label">Patients</span></div>
          <div className="pl-stat-divider" />
          <div className="pl-stat"><span className="pl-stat-num">98%</span><span className="pl-stat-label">Satisfaction</span></div>
        </div>
      </div>
      <div className="pl-hero-visual">
        <div className="pl-hero-card pl-hero-card-1">
          <span>📅</span>
          <div>
            <p className="pl-hc-title">Appointment Booked</p>
            <p className="pl-hc-sub">Dr. Amit Sharma · Today 10 AM</p>
          </div>
        </div>
        <div className="pl-hero-illustration">
          <div className="pl-illustration-circle">
            <span className="pl-illustration-icon">🩺</span>
          </div>
          <div className="pl-illustration-ring pl-ring-1" />
          <div className="pl-illustration-ring pl-ring-2" />
        </div>
        <div className="pl-hero-card pl-hero-card-2">
          <span>✅</span>
          <div>
            <p className="pl-hc-title">Verified Doctors</p>
            <p className="pl-hc-sub">All specialists certified</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  { icon: "📅", title: "Book Appointments Easily",    desc: "Schedule appointments with top doctors in just a few clicks, anytime and anywhere." },
  { icon: "🧑‍⚕️", title: "Find Verified Doctors",      desc: "Browse through a curated list of certified specialists across all medical fields." },
  { icon: "🔒", title: "Secure Medical Records",      desc: "Your health data is encrypted and stored securely, accessible only by you." },
  { icon: "🔔", title: "Real-time Notifications",     desc: "Get instant reminders for upcoming appointments and important health updates." },
];

const Features = () => (
  <section className="pl-section" id="features">
    <div className="pl-section-inner">
      <div className="pl-section-header">
        <span className="pl-section-badge">Why Choose Us</span>
        <h2 className="pl-section-title">Everything You Need for Better Health</h2>
        <p className="pl-section-sub">A complete healthcare platform designed with patients in mind.</p>
      </div>
      <div className="pl-features-grid">
        {features.map((f, i) => (
          <div className="pl-feature-card" key={i}>
            <div className="pl-feature-icon">{f.icon}</div>
            <h3 className="pl-feature-title">{f.title}</h3>
            <p className="pl-feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── How It Works ──────────────────────────────────────────────────────────────
const steps = [
  { num: "01", icon: "👤", title: "Sign Up / Login",      desc: "Create your free account or log in to access the platform." },
  { num: "02", icon: "📋", title: "Complete Your Profile", desc: "Add your medical history and personal details for better care." },
  { num: "03", icon: "🔍", title: "Search a Doctor",       desc: "Filter by specialization, location, and availability." },
  { num: "04", icon: "📅", title: "Book Appointment",      desc: "Pick a time slot and confirm your appointment instantly." },
];

const HowItWorks = () => (
  <section className="pl-section pl-section-alt" id="how-it-works">
    <div className="pl-section-inner">
      <div className="pl-section-header">
        <span className="pl-section-badge">Simple Process</span>
        <h2 className="pl-section-title">How It Works</h2>
        <p className="pl-section-sub">Get started in 4 easy steps.</p>
      </div>
      <div className="pl-steps">
        {steps.map((s, i) => (
          <div className="pl-step" key={i}>
            <div className="pl-step-num">{s.num}</div>
            <div className="pl-step-icon">{s.icon}</div>
            <h3 className="pl-step-title">{s.title}</h3>
            <p className="pl-step-desc">{s.desc}</p>
            {i < steps.length - 1 && <div className="pl-step-arrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────────────────────────────
const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="pl-cta">
      <div className="pl-cta-inner">
        <h2 className="pl-cta-title">Start Your Health Journey Today</h2>
        <p className="pl-cta-desc">
          Join thousands of patients who trust MediTrack for their healthcare needs.
        </p>
        <button className="pl-btn-white pl-btn-lg" onClick={() => navigate("/patient/register")}>
          Create Free Account →
        </button>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="pl-footer" id="contact">
    <div className="pl-footer-inner">
      <div className="pl-footer-brand">
        <div className="pl-logo">
          <span className="pl-logo-icon">⚕️</span>
          <span className="pl-logo-text" style={{ color: "#fff" }}>MediTrack</span>
        </div>
        <p className="pl-footer-tagline">Your trusted healthcare companion.</p>
        <div className="pl-social-icons">
          <span className="pl-social">📘</span>
          <span className="pl-social">🐦</span>
          <span className="pl-social">📸</span>
          <span className="pl-social">💼</span>
        </div>
      </div>
      <div className="pl-footer-links">
        <h4>Platform</h4>
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="pl-footer-links">
        <h4>Legal</h4>
        <a href="#!">Privacy Policy</a>
        <a href="#!">Terms of Service</a>
        <a href="#!">Cookie Policy</a>
      </div>
      <div className="pl-footer-links">
        <h4>Contact</h4>
        <a href="mailto:support@meditrack.com">support@meditrack.com</a>
        <a href="tel:+911234567890">+91 12345 67890</a>
      </div>
    </div>
    <div className="pl-footer-bottom">
      <p>© 2026 MediTrack. All rights reserved.</p>
    </div>
  </footer>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const PatientLanding = () => (
  <div className="pl-page">
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <CTA />
    <Footer />
  </div>
);

export default PatientLanding;
