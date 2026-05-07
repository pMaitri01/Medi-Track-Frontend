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
    <div className="ReviewSec-timeline-container">
      <h2 className="ReviewSec-title">Patient Reviews Timeline</h2>

      <div className="ReviewSec-timeline">
        {reviews.map((r, index) => (
          <div className="ReviewSec-timeline-item" key={index}>
            
            {/* Dot */}
            <div className="ReviewSec-timeline-dot"></div>

            {/* Content */}
            <div className="ReviewSec-timeline-content">
              <div className="ReviewSec-top-row">
                <h3>Dr.{r.doctor?.fullName}</h3>
                <span className="ReviewSec-date">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="ReviewSec-specialty">
                {r.doctor?.specialization}
              </p>

              <div className="ReviewSec-stars">
                {"⭐".repeat(r.rating)} <span>{r.rating}/5</span>
              </div>

              <p className="ReviewSec-comment">"{r.comment}"</p>

              <small className="ReviewSec-patient">
                — {r.patient?.firstName} {r.patient?.lastName}
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