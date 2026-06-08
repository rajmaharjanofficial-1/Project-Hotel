import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 px-6 md:px-16 lg:px-24 pt-16 pb-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12">

        {/* Brand */}
        <div>
          <img
            src={assets.logo}
            alt="QuickStay Logo"
            className="h-12 mb-4"
          />
          <p className="text-sm leading-relaxed max-w-xs text-gray-300">
            Experience comfort, culture, and heartfelt Nepali hospitality in every stay.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="hover:text-white transition-colors duration-300">
                Rooms
              </Link>
            </li>
            <li>
              <Link to="/hotels" className="hover:text-white transition-colors duration-300">
                Hotels
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors duration-300">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition-colors duration-300 cursor-pointer">Contact</li>
            <li className="hover:text-white transition-colors duration-300 cursor-pointer">FAQs</li>
            <li className="hover:text-white transition-colors duration-300 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition-colors duration-300 cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Kathmandu, Nepal</li>
            <li>+977 98XXXXXXXX</li>
            <li>info@quickstay.com</li>
          </ul>

          {/* Social Icons */}
           <div className="flex gap-4 mt-5">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                alt="Facebook"
                className="w-6 h-6 hover:opacity-70 transition duration-300"
              />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                alt="Instagram"
                className="w-6 h-6 hover:opacity-70 transition duration-300"
              />
            </a>
           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
  <img
    src="https://cdn-icons-png.flaticon.com/512/733/733579.png" // visible blue Twitter icon
    alt="Twitter"
    className="w-6 h-6 hover:opacity-70 transition duration-300"
  />
</a>

          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} QuickStay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
