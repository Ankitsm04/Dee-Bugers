"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Home = () => {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 8;

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
      }
    };

    fetchServices();
  }, []);

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-10">Explore Our Services</h1>

        {/* Service Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {currentServices.length > 0 ? (
            currentServices.map((service) => (
              <div key={service._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
                <img
                  src={service.image || "/placeholder.jpg"}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
                  <p className="text-gray-400 text-sm mb-3">{service.description.slice(0, 80)}...</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-400 font-semibold">₹{service.price || "N/A"}</span>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/services/${service._id}`} className="w-full">
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                        View Details
                      </button>
                    </Link>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">No services available.</p>
          )}
        </div>

        {/* Pagination */}
        {services.length > servicesPerPage && (
          <div className="mt-10 flex justify-center space-x-3">
            {Array.from({ length: Math.ceil(services.length / servicesPerPage) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
