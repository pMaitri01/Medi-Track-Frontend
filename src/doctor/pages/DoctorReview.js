import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DoctorReview.css"; 
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";
import { toast } from "react-toastify";

const DoctorReview = () => {
  const params = useParams();
  const doctorId = params.doctorId || JSON.parse(localStorage.getItem("user"))?._id;

  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    avgRating: 0,
    totalReviews: 0,
  });

  const contentStyle = {
    marginLeft: open ? "250px" : "100px",
    transition: "margin-left 0.3s ease-in-out",
    width: `calc(100% - ${open ? "250px" : "100px"})`,
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/review/alldoctorreview`, {
          credentials: "include"
        });
        const data = await res.json();
        if (res.ok) {
          setReviewData({
            avgRating: data.avgRating || 0,
            totalReviews: data.totalReviews || 0,
          });
          setReviews(data.allReviews || []);
        }
         else {
  toast.error(data.message || "Failed to load reviews");
}
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load reviews. Please try again.");
      }
    };
    fetchReviews();
  }, [doctorId]);

  const filteredReviews = reviews.filter((r) =>
    `${r.patient?.firstName || ""} ${r.patient?.lastName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <DoctorNavbar open={open} setOpen={setOpen} />

      <div style={contentStyle}>
        <DoctorHeader open={open} />

        <div className="dplist-container">
          {/* Header Bar */}
          <div className="dplist-header">
            <div className="dplist-title-section">
              <h2>📅 Doctor Reviews</h2>
            </div>
          </div>

          {/* Search Bar */}
          <div className="dplist-filter-bar">
            <input
              type="text"
              placeholder="Search by patient name..."
              className="dplist-search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Summary Stat Card */}
          <div className="review-summary-card">
            <h2>{reviewData.avgRating} <span style={{ color: '#facc15' }}>★</span></h2>
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                Average Rating
              </p>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Based on {reviewData.totalReviews} total reviews
              </span>
            </div>
          </div>

          {/* Timeline Wrapper Container */}
          <div className="review-timeline-wrapper">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r) => {
                // Generate initials like "MA" or "VY"
                const initials = r.patient 
                  ? `${r.patient.firstName?.charAt(0)}${r.patient.lastName?.charAt(0)}`.toUpperCase() 
                  : "??";

                return (
                  <div className="timeline-item" key={r._id}>
                    <div className="timeline-dot"></div>
                    
                    {/* Circle Avatar matching Appointment View */}
                    <div className="patient-initials">{initials}</div>

                    <div className="review-bubble">
                      <div className="review-bubble-header">
                        <span className="review-patient-name">
                          {r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : "Anonymous Patient"}
                        </span>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: i < r.rating ? "#facc15" : "#e2e8f0" }}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="review-text">"{r.comment}"</p>

                      <span className="review-date-stamp">
                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", paddingTop: "40px" }}>
                <p style={{ color: "#94a3b8" }}>No reviews found for this search.</p>
              </div>
            )}
          </div>

          {/* Pagination Footer Styling */}
          <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
            Showing {filteredReviews.length} reviews
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorReview;