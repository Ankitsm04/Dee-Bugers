"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [userId, setUserId] = useState(null);
  const [hover, setHover] = useState(null);

    // Move fetchService outside the useEffect so it's accessible in handleAddReview
    const fetchService = async () => {
        try {
          const res = await fetch(`http://localhost:8001/api/services`);
          if (!res.ok) throw new Error("Failed to fetch service details");
          const data = await res.json();
    
          const matchedService = data.find((item) => item._id === id);
          if (!matchedService) throw new Error("Service not found");
    
          setService(matchedService);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
            setUserId(decodedToken.userId);
          } catch (error) {
            console.error("Failed to parse token:", error);
          }
        }
    
        if (id) fetchService();
      }, [id]);

  const handleAddReview = async () => {
    if (!userId) {
      alert("You must be logged in to add a review.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8001/api/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating, comment: reviewText }),
      });

      if (!res.ok) throw new Error("Failed to add review");

      fetchService();
    //   const newReview = await res.json();
    //   setService((prev) => ({
    //     ...prev,
    //     reviews: [...prev.reviews, newReview],
    //   }));
      setReviewText("");
      setRating(5);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!userId) {
      alert("You must be logged in to delete a review.");
      return;
    }
    const token = localStorage.getItem("token");
    console.log(token);
    try {
      const res = await fetch(`http://localhost:8001/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setService((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((review) => review._id !== reviewId),
      }));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (loading) return <p className="text-center text-gray-200 mt-6">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!service) return <p className="text-center text-gray-200 mt-6">Service not found</p>;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-900">
      <div className="max-w-4xl min-w-[200px] my-6 p-8 bg-gray-800 shadow-md rounded-lg text-white">
        
        {/* Service Image */}
        <div className="w-full flex justify-center">
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full max-h-80 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Service Details */}
        <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
          {service.title}
        </h1>
        <p className="text-gray-400 mt-2">{service.description}</p>

        {/* Service Provider */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-200">Service Provider</h2>
          <p className="text-gray-400 font-medium">{service.provider?.username || "Unknown Provider"}</p>
        </div>

        {/* Price */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-200">Price</h2>
          <p className="text-xl font-bold text-green-400">₹{service.price}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Customer Reviews</h2>
          {service.reviews && service.reviews.length > 0 ? (
            <div className="space-y-4">
              {service.reviews.map((review) => {
                const storedUsername = localStorage.getItem("username");

                return (
                  <div
                    key={review._id}
                    className="bg-gray-700 p-4 rounded-lg shadow-md flex items-start space-x-4"
                  >
                    {/* Profile Icon */}
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
                      {review.user?.username 
                        ? review.user.username[0].toUpperCase() 
                        : "?"}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <p className="text-gray-300 font-semibold">
                        {review.user?._id === userId ? storedUsername : review.user?.username || "Unknown User"}
                      </p>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        {Array(review.rating)
                          .fill()
                          .map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                      </div>
                      <div className="text-white font-bold"> {review.rating} / 5</div>
                      <p className="text-gray-400 mt-1">{review.comment}</p>
                    </div>

                    {/* Delete Button (Only for Review Owner) */}
                    {review.user && userId === review.user._id && (
                    <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                    >
                        Delete
                    </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No reviews yet.</p>
          )}
        </div>

        {/* Add Review Form */}
        {userId && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">Add a Review</h2>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
              placeholder="Write your review here..."
            />
            <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            className={`w-8 h-8 cursor-pointer ${
              (hover || rating) >= star ? "text-yellow-400" : "text-gray-500"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.178 3.617a1 1 0 00.95.69h3.813c.969 0 1.372 1.24.588 1.81l-3.082 2.24a1 1 0 00-.364 1.118l1.179 3.617c.3.921-.755 1.688-1.54 1.118l-3.082-2.24a1 1 0 00-1.176 0l-3.082 2.24c-.785.57-1.84-.197-1.54-1.118l1.178-3.617a1 1 0 00-.364-1.118L2.42 9.044c-.784-.57-.38-1.81.588-1.81h3.813a1 1 0 00.95-.69l1.178-3.617z" />
          </svg>
        ))}
        </div>
            <button
              onClick={handleAddReview}
              className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
