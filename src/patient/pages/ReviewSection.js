import React, { useEffect, useState } from "react";
import "../css/ReviewSection.css";
import Navbar from "../components/Navbar";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/review/publicreview`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (!res.ok) {
          setReviews([]);
          return;
        }

        // sort newest first (timeline feel)
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setReviews(sorted);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
     <Navbar />
    <div className="timeline-container">
      <h2 className="title">Patient Reviews Timeline</h2>

      <div className="timeline">
        {reviews.map((r, index) => (
          <div className="timeline-item" key={index}>
            
            {/* Dot */}
            <div className="timeline-dot"></div>

            {/* Content */}
            <div className="timeline-content">
              <div className="top-row">
                <h3>{r.doctor?.fullName}</h3>
                <span className="date">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="specialty">
                {r.doctor?.specialization}
              </p>

              <div className="stars">
                {"⭐".repeat(r.rating)} <span>{r.rating}/5</span>
              </div>

              <p className="comment">"{r.comment}"</p>

              <small className="patient">
                — {r.patient?.name}
              </small>
            </div>

          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ReviewSection;