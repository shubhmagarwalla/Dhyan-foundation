"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const contactInfo = [
  {
    icon: "📍",
    label: "Address",
    value: "Dhyan Foundation, Guwahati, Assam — 781001, India",
    href: "https://maps.google.com/?q=Guwahati,Assam,India",
    linkLabel: "View on Map",
    accentColor: "#FF6B00",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+91-9999567895",
    href: "tel:+919999567895",
    linkLabel: "Call Now",
    accentColor: "#2D6A4F",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "info@dhyanfoundation.com",
    href: "mailto:info@dhyanfoundation.com",
    linkLabel: "Send Email",
    accentColor: "#FF8C00",
  },
];

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success("Message sent! We'll get back to you soon.", {
      style: { background: "#2D6A4F", color: "white" },
      iconTheme: { primary: "#FF6B00", secondary: "white" },
    });
    reset();
  };

  return (
    <section
      id="contact"
      className="py-24 px-6"
      style={{ background: "linear-gradient(180deg, #fff8f0 0%, #f0faf5 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#e8f5ee", color: "#2D6A4F" }}
          >
            Contact Us
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-5">
            Get In{" "}
            <span style={{ color: "#2D6A4F" }}>Touch</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have questions about donations, volunteering, or our gaushala?
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Cards + Info */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-5"
                style={{ borderLeft: `4px solid ${info.accentColor}` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${info.accentColor}15` }}
                >
                  {info.icon}
                </div>
                <div className="flex-1">
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: info.accentColor }}
                  >
                    {info.label}
                  </div>
                  <div className="text-gray-700 font-medium mb-2">
                    {info.value}
                  </div>
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold hover:underline transition-colors"
                    style={{ color: info.accentColor }}
                  >
                    {info.linkLabel} →
                  </a>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div
              className="bg-white rounded-2xl p-6 shadow-md"
              style={{ borderLeft: "4px solid #2D6A4F" }}
            >
              <div
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#2D6A4F" }}
              >
                Follow Our Work
              </div>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Facebook", color: "#1877F2", emoji: "📘" },
                  { label: "Instagram", color: "#E1306C", emoji: "📸" },
                  { label: "YouTube", color: "#FF0000", emoji: "▶️" },
                  { label: "WhatsApp", color: "#25D366", emoji: "💬" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
                    style={{ background: social.color }}
                  >
                    <span>{social.emoji}</span>
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
              Send Us a Message
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              We typically respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Name <span style={{ color: "#FF6B00" }}>*</span>
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-700 placeholder-gray-300 transition-all duration-200 outline-none"
                  style={{
                    borderColor: errors.name ? "#ef4444" : "#e5e7eb",
                  }}
                  onFocus={(e) => {
                    if (!errors.name)
                      e.currentTarget.style.borderColor = "#FF6B00";
                  }}
                  onBlur={(e) => {
                    if (!errors.name)
                      e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address <span style={{ color: "#FF6B00" }}>*</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-700 placeholder-gray-300 transition-all duration-200 outline-none"
                  style={{
                    borderColor: errors.email ? "#ef4444" : "#e5e7eb",
                  }}
                  onFocus={(e) => {
                    if (!errors.email)
                      e.currentTarget.style.borderColor = "#FF6B00";
                  }}
                  onBlur={(e) => {
                    if (!errors.email)
                      e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message <span style={{ color: "#FF6B00" }}>*</span>
                </label>
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Message too short" },
                  })}
                  rows={5}
                  placeholder="Tell us about your query, volunteering interest, or donation plans..."
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-700 placeholder-gray-300 transition-all duration-200 outline-none resize-none"
                  style={{
                    borderColor: errors.message ? "#ef4444" : "#e5e7eb",
                  }}
                  onFocus={(e) => {
                    if (!errors.message)
                      e.currentTarget.style.borderColor = "#FF6B00";
                  }}
                  onBlur={(e) => {
                    if (!errors.message)
                      e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
