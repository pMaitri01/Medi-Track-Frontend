import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/PatientList.css"; // reuse same styling
import DoctorHeader from "../components/DoctorHeader";
import DoctorNavbar from "../components/DoctorNavbar";

const DoctorReview = () => {
  // const { doctorId } = useParams();
  const params = useParams();
  const doctorId =
    params.doctorId ||
    JSON.parse(localStorage.getItem("user"))?._id;

  const [open, setOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingCount: {},
  });

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

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
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/review/alldoctorreview`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (!res.ok) return;

        setReviewData({
          avgRating: data.avgRating || 0,
          totalReviews: data.totalReviews || 0,
          ratingCount: data.ratingCount || {},
        });

        setReviews(data.allReviews || []); // ✅ SAFE
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchReviews();
  }, [doctorId]);

  // ✅ FILTER REVIEWS
  const filteredReviews = reviews.filter((r) =>
    `${r.patient?.firstName || ""} ${r.patient?.lastName || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ✅ PAGINATION
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <DoctorNavbar open={open} setOpen={setOpen} />

      <div style={contentStyle}>
        <DoctorHeader open={open} />

        <div className="dplist-container">

          {/* Header */}
          <div className="dplist-header">
            <div className="dplist-title-section">
              <span>⭐</span>
              <h2>Doctor Reviews</h2>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="dplist-filter-bar-container">
            <div className="dplist-filter-bar">
              <input
                type="text"
                placeholder="Search by patient name"
                className="dplist-search-input"
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button
                className={`dplist-filter-toggle-btn ${isFilterOpen ? "active" : ""}`}
                onClick={toggleFilter}
              >
                Filter {isFilterOpen ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {/* ⭐ Summary */}
          <div className="review-summary">
            <h2>{reviewData.avgRating} ⭐</h2>
            <p>{reviewData.totalReviews} Reviews</p>
          </div>

          {/* Reviews */}
          <div className="review-list">
            {currentReviews.length > 0 ? (
              currentReviews.map((r) => (
                <div className="review-card" key={r._id}>

                  <div className="review-top">
                    <div className="review-user">
                      {/* {r.patient?.firstName} {r.patient?.lastName} */}
                      {r.patient
                        ? `${r.patient.firstName} ${r.patient.lastName}`
                        : "Unknown Patient"}
                    </div>

                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < r.rating ? "⭐" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="review-comment">{r.comment}</p>

                  <span className="review-date">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>

                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                No Reviews Found
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="dplist-footer-pagination">
            <span>
              Showing {currentReviews.length} of {filteredReviews.length}
            </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default DoctorReview;