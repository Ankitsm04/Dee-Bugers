"use client";
import { useState, useEffect } from "react";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("services");
  const [editingService, setEditingService] = useState(null);
  const [updatedService, setUpdatedService] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, user might not be authenticated.");
        return;
      }

      const res = await fetch("http://localhost:8001/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!userData) {
    return (
      <div className="text-center text-gray-400 mt-10 text-lg">Loading...</div>
    );
  }

  const { user, services, reviewsGiven } = userData;
  const isProvider = user.role === "provider";

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUpdatedService((prev) => ({ ...prev, image: reader.result }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Open edit modal
  const handleEditClick = (service) => {
    setEditingService(service);
    setUpdatedService({
      title: service.title,
      description: service.description,
      price: service.price,
      image: service.image,
    });
  };

  // Update service
  const handleUpdateService = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8001/api/services/${editingService._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedService),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      fetchProfile();
      setEditingService(null);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  // Delete service
  const handleDeleteService = async (serviceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8001/api/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      fetchProfile();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="max-w-6xl w-full mx-auto p-10 rounded-xl bg-black/40 backdrop-blur-lg shadow-xl border border-gray-800/50">

        {/* Profile Header */}
        <h2 className="text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          🚀 Profile
        </h2>

        {/* User Info */}
        <div className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-md border border-gray-700/50">
          <p className="text-xl mb-3"><strong>👤 Username:</strong> {user.username}</p>
          <p className="text-xl mb-3"><strong>✉️ Email:</strong> {user.email}</p>
          <p className="text-xl"><strong>🔑 Role:</strong> {user.role}</p>
        </div>

        {/* Tabs */}
        {isProvider && (
          <div className="flex justify-center mt-12 space-x-8">
            <button
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-all ${
                activeTab === "services"
                  ? "bg-cyan-500 shadow-lg scale-110"
                  : "bg-gray-700 hover:bg-cyan-400/80"
              }`}
              onClick={() => setActiveTab("services")}
            >
              💼 Services
            </button>
            <button
              className={`px-8 py-3 rounded-full text-lg font-semibold transition-all ${
                activeTab === "reviews"
                  ? "bg-purple-500 shadow-lg scale-110"
                  : "bg-gray-700 hover:bg-purple-400/80"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              ⭐ Reviews
            </button>
          </div>
        )}

        {/* Services Section */}
        {activeTab === "services" && isProvider && (
          <div className="mt-12">
            <h3 className="text-4xl font-bold mb-8 text-cyan-400">Your Services</h3>
            {services.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-10">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="p-8 rounded-xl bg-black/40 shadow-lg border border-gray-700/50 transition-transform hover:scale-105"
                  >
                    <h4 className="text-3xl font-bold">{service.title}</h4>
                    <p className="text-lg mt-2">{service.description}</p>
                    <p className="text-xl mt-4"><strong>💰 Price:</strong> ₹{service.price}</p>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-56 object-cover rounded-md mt-6 shadow-lg"
                    />
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => handleEditClick(service)}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 transition rounded-lg"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 transition rounded-lg"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-8">No services added yet.</p>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {activeTab === "reviews" && (
          <div className="mt-12">
            <h3 className="text-4xl font-bold mb-8 text-purple-400">Reviews Given</h3>
            {reviewsGiven.length > 0 ? (
              <div className="grid gap-10">
                {reviewsGiven.map((review) => (
                  <div
                    key={review._id}
                    className="p-8 rounded-xl bg-black/40 shadow-lg border border-gray-700/50 hover:scale-105 transition-transform"
                  >
                    <h4 className="text-2xl font-bold">{review.service.title}</h4>
                    <p className="mt-3">{review.comment}</p>
                    <p>⭐ {review.rating}/5</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center mt-8">No reviews given yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
