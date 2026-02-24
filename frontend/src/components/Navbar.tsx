"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Heart, User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DF</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-orange-600 leading-tight text-sm">Dhyan Foundation</p>
              <p className="text-xs text-green-700 leading-tight">Guwahati</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
            <Link href="/#about" className="text-gray-700 hover:text-orange-600 transition-colors">About</Link>
            <Link href="/#gallery" className="text-gray-700 hover:text-orange-600 transition-colors">Gallery</Link>
            <Link href="/astrology" className="text-gray-700 hover:text-orange-600 transition-colors">🔮 Astrology</Link>
            <Link href="/panchang" className="text-gray-700 hover:text-orange-600 transition-colors">📅 पंचांग</Link>
            <Link href="/prayers" className="text-gray-700 hover:text-orange-600 transition-colors">🙏 आरती/चालीसा</Link>
            <Link href="/culture" className="text-gray-700 hover:text-orange-600 transition-colors">🎨 संस्कृति</Link>
            <Link href="/#contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</Link>
          </div>

          {/* CTA + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/donate"
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <Heart size={14} /> Donate Now
            </Link>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-orange-600 text-sm"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} className="w-7 h-7 rounded-full" alt="avatar" />
                  ) : (
                    <User size={18} />
                  )}
                  <span className="max-w-24 truncate">{session.user?.name?.split(" ")[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-orange-50" onClick={() => setDropOpen(false)}>
                      My Profile
                    </Link>
                    <Link href="/profile#history" className="block px-4 py-2 text-sm hover:bg-orange-50" onClick={() => setDropOpen(false)}>
                      Donation History
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => { signOut(); setDropOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-700 hover:text-orange-600 border border-gray-300 px-3 py-1.5 rounded-full"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 space-y-3">
          <Link href="/" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/#about" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/#gallery" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link href="/astrology" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>🔮 Astrology</Link>
          <Link href="/panchang" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>📅 पंचांग</Link>
          <Link href="/prayers" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>🙏 आरती/चालीसा</Link>
          <Link href="/culture" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>🎨 संस्कृति</Link>
          <Link href="/#contact" className="block text-sm font-medium py-1" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link
            href="/donate"
            className="block text-center bg-orange-500 text-white py-2 rounded-full text-sm font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            ❤️ Donate Now
          </Link>
          {session ? (
            <>
              <Link href="/profile" className="block text-sm py-1" onClick={() => setMenuOpen(false)}>My Profile</Link>
              <button onClick={() => signOut()} className="text-sm text-red-600">Sign Out</button>
            </>
          ) : (
            <Link href="/auth/signin" className="block text-sm py-1 font-medium" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
