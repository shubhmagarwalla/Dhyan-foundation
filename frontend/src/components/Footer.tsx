import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DF</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">Dhyan Foundation</p>
              <p className="text-xs text-green-400">Guwahati Chapter</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Rescuing cows and Nandis from brutality across Assam since 2002.
            Your support saves lives.
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs text-green-400">
            <Shield size={12} />
            <span>80G Registered NGO</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
            <li><Link href="/#about" className="hover:text-orange-400 transition-colors">About Us</Link></li>
            <li><Link href="/donate" className="hover:text-orange-400 transition-colors">Donate</Link></li>
            <li><Link href="/astrology" className="hover:text-orange-400 transition-colors">Astrology Corner</Link></li>
            <li><Link href="/#gallery" className="hover:text-orange-400 transition-colors">Gallery</Link></li>
            <li><Link href="/#contact" className="hover:text-orange-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>PAN: <span className="text-gray-300">AAATD5390E</span></li>
            <li>FCRA: <span className="text-gray-300">231661515</span></li>
            <li>12A Registration: ✓</li>
            <li>80G Registration: ✓</li>
            <li className="pt-2">
              <Link href="/privacy" className="hover:text-orange-400">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-orange-400">Terms of Use</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-orange-400 mt-0.5 shrink-0" />
              <span>Guwahati, Assam, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-orange-400 shrink-0" />
              <a href="tel:+919999567895" className="hover:text-orange-400">+91-9999567895</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-orange-400 shrink-0" />
              <a href="mailto:info@dhyanfoundation.com" className="hover:text-orange-400">info@dhyanfoundation.com</a>
            </li>
          </ul>
          <Link
            href="/donate"
            className="mt-4 inline-flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            <Heart size={14} /> Donate Now
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Dhyan Foundation Guwahati. All rights reserved.
        Donations are eligible for 80G tax deduction under the Income Tax Act, 1961.
      </div>
    </footer>
  );
}
