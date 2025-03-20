"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserTie, FaUser } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "customer",
    services: [""],
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role, services: role === "provider" ? [""] : [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:8001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full mt-5 mb-6 max-w-md p-9 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
          Create an Account
        </h2>
        {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Re-enter Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter password"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="mt-6">
            <label className="block text-gray-300">Select Role</label>
            <div className="flex justify-between mt-2">
              <div
                className={`w-1/2 p-3 flex items-center justify-center border rounded-lg cursor-pointer transition ${
                  formData.role === "customer" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                }`}
                onClick={() => handleRoleSelect("customer")}
              >
                <FaUser className="mr-2" />
                Customer
              </div>
              <div
                className={`w-1/2 p-3 flex items-center justify-center border rounded-lg cursor-pointer transition ${
                  formData.role === "provider" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                }`}
                onClick={() => handleRoleSelect("provider")}
              >
                <FaUserTie className="mr-2" />
                Provider
              </div>
            </div>
          </div>
          {formData.role === "provider" && (
            <div className="mt-4">
              <label className="block text-gray-300">Service Offered</label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter service you offer"
                required
              />
            </div>
          )}
          <button className="w-full mt-6 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold hover:opacity-90 transition">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;