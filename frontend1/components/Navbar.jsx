"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "react-feather";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Function to fetch user details from storage
  const fetchUser = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    setUser(token && storedUser ? storedUser : null);
  };

  // Fetch user on mount and listen for changes
  useEffect(() => {
    fetchUser();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    router.push("/login");

    // Force re-render by updating a dummy state
    sessionStorage.setItem("updateTrigger", Date.now().toString());
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
          ServiceHub
        </Link>

        <div className="hidden md:flex space-x-8 text-gray-200 font-medium">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/services" className="hover:text-white transition">Services</Link>
          {user ? (
            <>
              <span className="text-white">Hello, {user}!</span>
              <Link href="/profile" className="hover:text-white transition">Profile</Link>
              <button onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
            </>
          ) : (
            <Link href="/login" className="hover:text-white transition">Login</Link>
          )}
        </div>

        <button className="md:hidden text-gray-200" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/10 text-gray-200">
          <Link href="/" className="block px-6 py-3 hover:bg-white/20 transition">Home</Link>
          <Link href="/services" className="block px-6 py-3 hover:bg-white/20 transition">Services</Link>
          {user ? (
            <>
              <span className="block px-6 py-3 text-white">Hello, {user}!</span>
              <button onClick={handleLogout} className="block px-6 py-3 text-left w-full hover:bg-red-600 transition">Logout</button>
            </>
          ) : (
            <Link href="/login" className="block px-6 py-3 hover:bg-white/20 transition">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
