import React from "react";
import { motion } from "framer-motion";

// Hotel guest testimonials
const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Business Traveler",
    image: "https://images.unsplash.com/photo-1603415526960-fb03f5a2f842?crop=faces&fit=crop&w=200&h=200",
    message:
      "The stay was excellent! The room was spacious, clean, and the staff was extremely helpful. Will visit again.",
    rating: 5,
  },
  {
    name: "Sita Koirala",
    role: "Vacation Guest",
    image: "https://images.unsplash.com/photo-1614289370081-43183f4bbd50?crop=faces&fit=crop&w=200&h=200",
    message:
      "A wonderful experience! Loved the ambience and the food. Perfect place for a family holiday.",
    rating: 5,
  },
  {
    name: "Anil Thapa",
    role: "Tourist",
    image: "https://images.unsplash.com/photo-1603415526960-fb03f5a2f842?crop=faces&fit=crop&w=200&h=200",
    message:
      "From check-in to check-out, everything was seamless. The service was top-notch. Highly recommended!",
    rating: 5,
  },
  {
    name: "Priya Gurung",
    role: "Couple Traveler",
    image: "https://images.unsplash.com/photo-1614289370081-43183f4bbd50?crop=faces&fit=crop&w=200&h=200",
    message:
      "The hotel exceeded our expectations! Beautiful rooms, excellent service, and the pool area is amazing.",
    rating: 5,
  },
];

// Star component
const Star = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 22 20"
    fill="#FF532E"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" />
  </svg>
);

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-semibold text-gray-900">
            What Our Guests Say
          </h2>
          <p className="text-gray-500 mt-3">
            Real experiences from guests who enjoyed comfort, luxury, and exceptional service at our hotel.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 pt-16 pb-8 px-6"
            >
              {/* Avatar */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.role}</p>

                <p className="text-gray-600 text-sm mt-4">“{item.message}”</p>

                {/* Stars */}
                <div className="flex justify-center gap-1 mt-5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
