"use client";

import { useState } from "react";

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
  donorType: string;
  initials: string;
  avatarGradient: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Ramesh Kumar",
    location: "Delhi",
    quote:
      "Donating to Dhyan Foundation is the best decision I made. I received my 80G certificate instantly! The process was seamless and the team is incredibly responsive.",
    rating: 5,
    donorType: "One-time Donor",
    initials: "RK",
    avatarGradient: "linear-gradient(135deg, #FF6B00, #FF8C00)",
  },
  {
    name: "Priya Sharma",
    location: "Guwahati",
    quote:
      "Incredible work they do for cows in Assam. The team is dedicated and transparent. I visited their gaushala in Goalpara — truly touching to see each cow cared for with love.",
    rating: 5,
    donorType: "Monthly Donor",
    initials: "PS",
    avatarGradient: "linear-gradient(135deg, #2D6A4F, #52b788)",
  },
  {
    name: "Anand Verma",
    location: "Mumbai",
    quote:
      "Monthly donor for 2 years. The astrology corner is a lovely bonus feature on the site. But what keeps me coming back is knowing my donations directly protect Gau Mata.",
    rating: 5,
    donorType: "2-Year Monthly Donor",
    initials: "AV",
    avatarGradient: "linear-gradient(135deg, #FF8C00, #2D6A4F)",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5"
          fill={i < rating ? "#FF6B00" : "#e5e7eb"}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="py-24 px-6"
      style={{ background: "#fffdf8" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#fff3e0", color: "#FF6B00" }}
          >
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-5">
            Voices of Our{" "}
            <span style={{ color: "#FF6B00" }}>Donors</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Real stories from the community that supports Gau Seva with Dhyan
            Foundation.
          </p>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <TestimonialCard key={t.name} testimonial={t} index={index} />
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden">
          <TestimonialCard testimonial={testimonials[activeIndex]} index={activeIndex} />
          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIndex ? "#FF6B00" : "#e5e7eb",
                  transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Summary bar */}
        <div
          className="mt-14 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-center gap-8"
          style={{ background: "linear-gradient(135deg, #fff3e0 0%, #e8f5ee 100%)" }}
        >
          <div className="text-center">
            <div className="text-3xl font-extrabold" style={{ color: "#FF6B00" }}>
              5.0 / 5.0
            </div>
            <div className="text-gray-500 text-sm mt-1">Average Rating</div>
            <div className="flex justify-center mt-1">
              <StarRating rating={5} />
            </div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="text-3xl font-extrabold" style={{ color: "#2D6A4F" }}>
              5,000+
            </div>
            <div className="text-gray-500 text-sm mt-1">Happy Donors</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="text-3xl font-extrabold" style={{ color: "#FF6B00" }}>
              100%
            </div>
            <div className="text-gray-500 text-sm mt-1">Transparent</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <div
      className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ border: "1px solid #f0f0f0" }}
    >
      {/* Quote icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 flex-shrink-0"
        style={{ background: index % 2 === 0 ? "#FF6B00" : "#2D6A4F" }}
      >
        &quot;
      </div>

      {/* Stars */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <p className="text-gray-600 leading-relaxed mb-6 flex-1 italic">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: testimonial.avatarGradient }}
        >
          {testimonial.initials}
        </div>
        <div>
          <div className="font-bold text-gray-800">{testimonial.name}</div>
          <div className="text-sm text-gray-400">{testimonial.location}</div>
          <div
            className="text-xs font-semibold mt-0.5"
            style={{ color: index % 2 === 0 ? "#FF6B00" : "#2D6A4F" }}
          >
            {testimonial.donorType}
          </div>
        </div>
      </div>
    </div>
  );
}
