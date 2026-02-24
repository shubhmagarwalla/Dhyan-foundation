"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  captionEn: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    src: "/gallery/gaushala_1.webp",
    alt: "Two calves resting peacefully at the gaushala",
    caption: "नन्हे बछड़े",
    captionEn: "Twin Calves",
    description: "नन्हे बछड़े आराम करते हुए — हमारी गौशाला में जीवन की मधुर झलक।",
  },
  {
    src: "/gallery/gaushala_2.webp",
    alt: "Majestic bull at the gaushala with large horns",
    caption: "नंदी — पवित्र साँड़",
    captionEn: "Nandi — Sacred Bull",
    description: "पूजनीय नंदी की शान — सींगों के साथ जो आकाश को छूते हैं।",
  },
  {
    src: "/gallery/gaushala_4.webp",
    alt: "Calf resting near cows at gaushala",
    caption: "विश्राम का पल",
    captionEn: "Shelter & Rest",
    description: "हमारी गौशाला में गायों और बछड़ों के लिए सुरक्षित आश्रय।",
  },
  {
    src: "/gallery/gaushala_5.webp",
    alt: "Mother cow with nursing calf at the gaushala",
    caption: "माँ और बच्चा",
    captionEn: "Mother and Calf",
    description: "माँ की ममता — गाय अपने बछड़े को प्यार से पालती है।",
  },
  {
    src: "/gallery/gaushala_6.webp",
    alt: "Young calf resting at the gaushala",
    caption: "नन्हा मेहमान",
    captionEn: "Young Calf",
    description: "हमारे बचाए गए नन्हे बछड़ों में से एक।",
  },
  {
    src: "/gallery/gaushala_7.webp",
    alt: "Herd of cows walking together at the gaushala",
    caption: "एक साथ झुंड",
    captionEn: "The Herd",
    description: "हमारी गौशाला का झुंड — सभी स्वस्थ और सुरक्षित।",
  },
  {
    src: "/gallery/gaushala_8.webp",
    alt: "Cows and bulls with long horns at the gaushala",
    caption: "बचाई गई गायें",
    captionEn: "Rescued Cows",
    description: "ये गायें हमारे बचाव अभियान में मिली थीं — अब पूरी तरह स्वस्थ।",
  },
  {
    src: "/gallery/gaushala_9.webp",
    alt: "Cows feeding on fresh green grass",
    caption: "हरे चारे का समय",
    captionEn: "Feeding Time",
    description: "प्रतिदिन ताज़ा हरा चारा और पोषक आहार हमारी प्राथमिकता है।",
  },
  {
    src: "/gallery/gaushala_10.webp",
    alt: "Volunteers interacting with a cow at the gaushala",
    caption: "सेवादार और गाय",
    captionEn: "Volunteers & Cow",
    description: "हमारे समर्पित स्वयंसेवक — जो हर दिन गौ सेवा में लगे रहते हैं।",
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
              key={item.captionEn}
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
              {/* Real Photo */}
              <div className="relative w-full h-64">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay always present (bottom fade) */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
                  }}
                />

                {/* Description overlay on hover */}
                <div
                  className="absolute inset-0 flex items-end p-4 transition-opacity duration-300"
                  style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                >
                  <p className="text-white text-sm font-medium leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Caption bar */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ background: "white" }}
              >
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">
                    {item.caption}
                  </p>
                  <p className="text-xs text-gray-400 leading-tight mt-0.5">
                    {item.captionEn}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
                  style={{
                    background: index % 2 === 0 ? "#fff3e0" : "#e8f5ee",
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
