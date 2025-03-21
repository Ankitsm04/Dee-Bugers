"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  // Fetch user details from local storage
  const fetchUser = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");

    setUser(token && storedUser ? storedUser : null);
    setRole(userRole || null);
  };

  useEffect(() => {
    fetchUser();

    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    router.push("/login");
    sessionStorage.setItem("updateTrigger", Date.now().toString());
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-950 via-gray-900 to-black shadow-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-cyan-400 text-transparent bg-clip-text hover:scale-105 transition-transform duration-300">
          ⚡ ServiceHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {/* Styled Buttons */}
          <Link
            href="/"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-pink text-white font-medium shadow-neon transition duration-300 hover:scale-110"
          >
            Home
          </Link>

          <Link
            href="/profile"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-neon transition duration-300 hover:scale-110"
          >
            Profile
          </Link>

          {role === "provider" && (
            <Link
              href="/add-service"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-neon transition duration-300 hover:scale-110"
            >
              + Add Service
            </Link>
          )}

          {user ? (
            <div className="flex items-center space-x-6">
              <span className="text-neon-cyan text-sm bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-lg shadow-md">
                👋 Hello, <span className="font-bold">{user}</span>!
              </span>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium shadow-neon transition duration-300 hover:scale-110"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium shadow-neon transition duration-300 hover:scale-110"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-neon-cyan hover:scale-110 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900 text-gray-200 shadow-lg"
          >
            <Link
              href="/"
              className="block px-6 py-4 rounded-md bg-gradient-to-r from-neon-cyan to-neon-pink text-white font-medium transition duration-300 hover:scale-105"
            >
              Home
            </Link>

            <Link
              href="/profile"
              className="block px-6 py-4 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium transition duration-300 hover:scale-105"
            >
              Profile
            </Link>

            {role === "provider" && (
              <Link
                href="/add-service"
                className="block px-6 py-4 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium transition duration-300 hover:scale-105"
              >
                + Add Service
              </Link>
            )}

            {user ? (
              <>
                <span className="block px-6 py-4 text-sm bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-md">
                  👋 Hello, <span className="font-bold">{user}</span>!
                </span>

                <button
                  onClick={handleLogout}
                  className="block w-full px-6 py-4 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium transition duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-6 py-4 rounded-md bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium transition duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
