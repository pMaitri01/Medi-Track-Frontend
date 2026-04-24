import React, { useState, useEffect } from "react";
import "../css/Review.css";

const Review = ({ onClose }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    //   const [selectedDoctor, setSelectedDoctor] = useState("Dr. Sarah Williams");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment/mydoctors`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }, credentials: "include", // for cookie-based auth
                });

                const data = await res.json();

                setDoctors(data); // store in state
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, []);

    const submitReview = () => {
        if (!selectedDoctor || selectedRating === 0 || reviewText.trim() === "") {
            alert("Please fill all fields");
            return;
        }

        const reviewData = {
            doctor: selectedDoctor,
            rating: selectedRating,
            reviewText: reviewText,
        };

        console.log("Submitted Review:", reviewData);
        alert("Review Submitted!");
        onClose();
    };

    return (
        <div className="review-modal-overlay">
            <div className="review-modal-box">
                <div className="review-modal-header">
                    <h2>Write a Review</h2>
                    <span onClick={onClose} className="review-close-btn">
                        ×
                    </span>
                </div>

                <label className="review-label">Select Doctor</label>
                <select
                    id="doctorSelect"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                    <option value="">Select Doctor</option>

                    {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                            {doc.fullName} {`(${doc.specialization})`}
                        </option>
                    ))}
                </select>

                <label className="review-label">Your Rating</label>
                <div className="review-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <span
                            key={n}
                            className={`review-star ${n <= selectedRating ? "review-active" : ""}`}
                            onClick={() => setSelectedRating(n)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <label className="review-label">Your Review</label>
                <textarea
                    className="review-textarea"
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                />

                <button onClick={submitReview} className="review-submit-btn">
                    Submit Review
                </button>
            </div>
        </div>
    );
};

export default Review;