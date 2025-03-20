"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role",data.role);
      localStorage.setItem("username",data.username);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-green-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full mt-6 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold hover:opacity-90 transition">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
