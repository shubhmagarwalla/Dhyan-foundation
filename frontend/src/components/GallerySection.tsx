"use client";

import { useState } from "react";

interface GalleryItem {
  caption: string;
  gradient: string;
  icon: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    caption: "Rescued Cows",
    gradient: "linear-gradient(135deg, #FF6B00 0%, #FF8C00 50%, #FFB347 100%)",
    icon: "🐄",
    description: "Cows rescued from illegal transport trucks",
  },
  {
    caption: "Nandi Care",
    gradient: "linear-gradient(135deg, #2D6A4F 0%, #3a8f6a 50%, #52b788 100%)",
    icon: "🐂",
    description: "Dedicated Nandi (bull) care program",
  },
  {
    caption: "Gaushala Facility",
    gradient: "linear-gradient(135deg, #FF8C00 0%, #2D6A4F 100%)",
    icon: "🏠",
    description: "Our Goalpara gaushala facility in Assam",
  },
  {
    caption: "Feeding Time",
    gradient: "linear-gradient(135deg, #1a5c3a 0%, #2D6A4F 50%, #52b788 100%)",
    icon: "🌾",
    description: "Daily nutritious feeding sessions",
  },
  {
    caption: "Medical Care",
    gradient: "linear-gradient(135deg, #FF6B00 0%, #e65c00 50%, #c94e00 100%)",
    icon: "💊",
    description: "Veterinary treatment and health monitoring",
  },
  {
    caption: "Happy Cows",
    gradient: "linear-gradient(135deg, #40916c 0%, #2D6A4F 50%, #1b4332 100%)",
    icon: "😊",
    description: "Healthy, happy cows in our care",
  },
];

export default function GallerySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="gallery"
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #f0faf5 0%, #fff8f0 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#e8f5ee", color: "#2D6A4F" }}
          >
            Photo Gallery
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-5">
            Our{" "}
            <span style={{ color: "#2D6A4F" }}>Gaushala</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            A glimpse into daily life at our gaushala — where every cow is
            family.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.caption}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-md"
              style={{
                transform:
                  hoveredIndex === index ? "scale(1.04)" : "scale(1)",
                transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                boxShadow:
                  hoveredIndex === index
                    ? "0 20px 60px rgba(0,0,0,0.2)"
                    : "0 4px 20px rgba(0,0,0,0.08)",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Gradient Placeholder Image */}
              <div
                className="w-full h-64 flex items-center justify-center relative"
                style={{ background: item.gradient }}
              >
                {/* Large icon */}
                <div
                  className="text-7xl transition-transform duration-300"
                  style={{
                    transform: hoveredIndex === index ? "scale(1.2)" : "scale(1)",
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
                  }}
                >
                  {item.icon}
                </div>

                {/* Shimmer overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)",
                    backgroundSize: "200% 200%",
                  }}
                />

                {/* Description overlay on hover */}
                <div
                  className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                >
                  <p className="text-white text-sm font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Caption bar */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ background: "white" }}
              >
                <span className="font-semibold text-gray-700 text-sm">
                  {item.caption}
                </span>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    background:
                      index % 2 === 0 ? "#fff3e0" : "#e8f5ee",
                    color: index % 2 === 0 ? "#FF6B00" : "#2D6A4F",
                  }}
                >
                  Dhyan Foundation
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-10 text-gray-400 text-sm">
          Visit our gaushala in Goalpara, Assam — open for visitors and
          volunteers.
        </div>
      </div>
    </section>
  );
}
