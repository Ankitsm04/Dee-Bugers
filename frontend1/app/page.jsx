"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const Home = () => {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const servicesPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);


  const handlePayment = () => {
    const amount = 100;
    router.push(`/payment?amount=${amount}`);
  };
  

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
      {/* Loading Bar */}
      {loading && (
        <div className="fixed top-0 left-0 w-full z-50">
          <BarLoader color="#0FF0FC" width="100%" />
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-6xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 text-transparent bg-clip-text mb-12 animate-pulse">
          ⚡ Explore Our Services
        </h1>

        {/* Service Grid */}
        <motion.div
          className="grid justify-center gap-10"
          style={{ gridTemplateColumns: "repeat(4, minmax(250px, 1fr))" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {loading ? (
            <div className="col-span-full flex justify-center">
              <BarLoader color="#0FF0FC" />
            </div>
          ) : currentServices.length > 0 ? (
            currentServices.map((service) => (
              <motion.div
                key={service._id}
                className="bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-neon"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <img
                  src={service.image || "/placeholder.jpg"}
                  alt={service.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-neon-pink mb-3">
                    {service.title}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {service.description.slice(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-neon-cyan">
                      ₹{service.price || "N/A"}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <Link href={`/services/${service._id}`} className="w-full">
                      <button className="w-full px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium transition duration-300 hover:scale-105 hover:shadow-neon">
                        View Details
                      </button>
                    </Link>
                    <button className="w-full px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium transition duration-300 hover:scale-105 hover:shadow-neon" 
                    onClick={ () => handlePayment(service.price)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">
              No services available.
            </p>
          )}
        </motion.div>

        {/* Pagination */}
        {services.length > servicesPerPage && (
          <div className="mt-12 flex justify-center space-x-3">
            {Array.from(
              { length: Math.ceil(services.length / servicesPerPage) },
              (_, i) => (
                <motion.button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-5 py-2 rounded-lg text-white font-medium transition duration-300 ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-pink-500 to-cyan-500 hover:scale-105 shadow-neon"
                      : "bg-gray-800 hover:bg-gray-700 hover:scale-105"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {i + 1}
                </motion.button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
