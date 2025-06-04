import React from "react";
import { Link } from "react-router-dom";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">RentZW</span>
            </div>
            <p className="text-gray-300 text-sm">
              Zimbabwe's premier property rental platform connecting tenants and
              landlords across all major cities and suburbs.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Browse Properties
              </Link>
              <Link
                to="/signup"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                List Your Property
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Popular Locations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popular Locations</h3>
            <nav className="flex flex-col space-y-2">
              <a
                href="/?location=Harare"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Harare Properties
              </a>
              <a
                href="/?location=Bulawayo"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Bulawayo Properties
              </a>
              <a
                href="/?location=Borrowdale"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Borrowdale Properties
              </a>
              <a
                href="/?location=Avondale"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Avondale Properties
              </a>
              <a
                href="/?location=Mount Pleasant"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Mount Pleasant Properties
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Nelson Mandela Ave, Harare, Zimbabwe
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+263 77 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@rentzw.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RentZW. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
