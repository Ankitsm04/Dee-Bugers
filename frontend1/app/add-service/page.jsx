"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AddService = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const token = localStorage.getItem("token");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8001/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
         },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Service added successfully!");
        router.push("/");
      } else {
        alert("Failed to add service");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-start  min-h-screen bg-gray-900 text-white">
      <div className="max-w-lg w-full mt-5 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
          Add a Service
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          />

          <textarea
            name="description"
            placeholder="Service Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          ></textarea>

          <input
            type="number"
            name="price"
            placeholder="Service Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 text-white"
          />

          {imagePreview && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm">Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded-md border border-gray-600"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddService;
