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
    return <div className="text-center text-gray-400 dark:text-gray-300 mt-10 text-lg">Loading...</div>;
  }

  const { user, services, reviewsGiven } = userData;
  const isProvider = user.role === "provider";

  // Convert Image to Base64
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

  // Open Edit Modal
  const handleEditClick = (service) => {
    setEditingService(service);
    setUpdatedService({
      title: service.title,
      description: service.description,
      price: service.price,
      image: service.image,
    });
  };

  // Update Service
  const handleUpdateService = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8001/api/services/${editingService._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedService),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      fetchProfile(); // Refresh data
      setEditingService(null);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  // Delete Service
  const handleDeleteService = async (serviceId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8001/api/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      fetchProfile(); // Refresh data
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gradient-to-r bg-gray-900">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white/10 backdrop-blur-md shadow-lg rounded-lg dark:bg-gray-900/80">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Profile</h2>

        {/* User Info */}
        <div className="mb-6 p-6 bg-white/20 dark:bg-gray-800/70 rounded-lg shadow">
          <p className="text-lg text-white"><strong>Username:</strong> {user.username}</p>
          <p className="text-lg text-white"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg text-white"><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Tab Buttons */}
        {isProvider && (
          <div className="flex justify-center space-x-4 border-b border-white/30 pb-4 mb-6">
            <button
              className={`px-4 py-2 rounded-full transition-all text-lg ${
                activeTab === "services" ? "bg-blue-500 text-white shadow-lg" : "bg-white/20 text-gray-200 hover:bg-white/30"
              }`}
              onClick={() => setActiveTab("services")}
            >
              Services
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all text-lg ${
                activeTab === "reviews" ? "bg-blue-500 text-white shadow-lg" : "bg-white/20 text-gray-200 hover:bg-white/30"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews Given
            </button>
          </div>
        )}

        {/* Services Section */}
        {activeTab === "services" && isProvider && (
          <div>
            <h3 className="text-2xl text-white font-semibold mb-4">Your Services</h3>
            {services.length > 0 ? (
              <div className="grid gap-6">
                {services.map((service) => (
                  <div key={service._id} className="p-6 bg-white/20 dark:bg-gray-800/70 rounded-lg shadow-md">
                    <h4 className="text-xl font-bold text-white">{service.title}</h4>
                    <p className="text-gray-200">{service.description}</p>
                    <p className="text-white mt-2"><strong>Price:</strong> ${service.price}</p>
                    <img src={service.image} alt={service.title} className="w-full h-48 object-cover mt-4 rounded-lg shadow-lg" />
                    <p className="text-sm text-gray-300 mt-2">{service.reviews.length} Reviews</p>
                    <div className="mt-4 flex space-x-4">
                      <button onClick={() => handleEditClick(service)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Edit</button>
                      <button onClick={() => handleDeleteService(service._id)} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200 text-lg text-center">No services added yet.</p>
            )}
          </div>
        )}

                {/* Reviews Given Section */}
        {activeTab === "reviews" && (
        <div>
            <h3 className="text-2xl text-white font-semibold mb-4">Reviews Given</h3>
            {reviewsGiven.length > 0 ? (
            <div className="grid gap-6">
                {reviewsGiven.map((review) => (
                <div key={review._id} className="p-6 bg-white/20 dark:bg-gray-800/70 rounded-lg shadow-md">
                    <h4 className="text-xl font-bold text-white">Service: {review.service.title}</h4>
                    <p className="text-gray-200 mt-2"><strong>Review:</strong> {review.comment}</p>
                    <p className="text-yellow-400 mt-1"><strong>Rating:</strong> ⭐ {review.rating}/5</p>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-gray-200 text-lg text-center">No reviews given yet.</p>
            )}
        </div>
        )}


        {/* Edit Modal */}
        {editingService && (
         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
         <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[600px] max-w-full">
           <h3 className="text-3xl text-white mb-6 text-center">Edit Service</h3>
       
           {/* Title Input */}
           <label className="block text-white mb-1">Title</label>
           <input
             type="text"
             className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-600"
             placeholder="Enter service title"
             value={updatedService.title}
             onChange={(e) => setUpdatedService({ ...updatedService, title: e.target.value })}
           />
       
           {/* Description Input */}
           <label className="block text-white mb-1">Description</label>
           <textarea
             className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-600"
             placeholder="Enter service description"
             rows="4"
             value={updatedService.description}
             onChange={(e) => setUpdatedService({ ...updatedService, description: e.target.value })}
           ></textarea>
       
           {/* Price Input */}
           <label className="block text-white mb-1">Price</label>
           <input
             type="text"
             className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-600"
             placeholder="Enter price"
             value={updatedService.price}
             onChange={(e) => setUpdatedService({ ...updatedService, price: e.target.value })}
           />
       
           {/* Image Upload */}
           <label className="block text-white mb-1">Upload Image</label>
           <input
             type="file"
             className="w-full p-3 mb-4 rounded bg-gray-800 text-white border border-gray-600"
             onChange={handleImageChange}
           />
       
           {/* Buttons */}
           <div className="flex justify-end space-x-4">
             <button onClick={handleUpdateService} className="px-5 py-3 bg-blue-500 text-white rounded-lg text-lg">
               Update
             </button>
             <button onClick={() => setEditingService(null)} className="px-5 py-3 bg-gray-500 text-white rounded-lg text-lg">
               Cancel
             </button>
           </div>
         </div>
       </div>       
        )}
      </div>
    </div>
  );
};

export default Profile;
