
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h1 className="sizu-logo-text text-white">
                <span className="s">S</span>
                <span className="i">I</span>
                <span className="z">Z</span>
                <span className="u">U</span>
              </h1>
            </Link>
            <p className="text-gray-400 max-w-xs">
              Empowering communities and driving sustainable development across Uganda through innovation and impactful projects.
            </p>
            <div className="flex space-x-4">
              <SocialLink Icon={Facebook} href="#" label="Facebook" />
              <SocialLink Icon={Twitter} href="#" label="Twitter" />
              <SocialLink Icon={Instagram} href="#" label="Instagram" />
              <SocialLink Icon={Linkedin} href="#" label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/projects" label="Find Project" />
              <FooterLink to="/organizations" label="Organizations" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/contact" label="Contact" />
              <FooterLink to="/register" label="Register Organization" />
              <FooterLink to="/login" label="Login" />
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-sizu-yellow mr-3 mt-0.5" />
                <span className="text-gray-400">NAKISUNGA - MUKONO, P.O BOX 152050</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-sizu-yellow mr-3 mt-0.5" />
                <span className="text-gray-400">+256 767 937930 / +256 767 937931</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-sizu-yellow mr-3 mt-0.5" />
                <span className="text-gray-400">sizunetlimited@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-sizu-yellow mr-3 mt-0.5" />
                <span className="text-gray-400">Monday - Friday | 8:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates on projects and events.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sizu-yellow focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-sizu-yellow text-sizu-black font-medium rounded-md transition-all duration-300 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-sizu-yellow focus:ring-opacity-50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm flex items-center">
            &copy; {new Date().getFullYear()} SIZU. All rights reserved. 
            <span className="mx-1 text-gray-600">|</span>
            <span className="text-gray-400">Powered By: <span className="font-medium text-sizu-yellow">SIZUNET (U) LIMITED</span></span>
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <li>
    <Link
      to={to}
      className="text-gray-400 hover:text-sizu-yellow transition-colors duration-200"
    >
      {label}
    </Link>
  </li>
);

const SocialLink = ({ Icon, href, label }: { Icon: any; href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-gray-400 hover:text-sizu-yellow transition-colors duration-200"
  >
    <Icon className="h-5 w-5" />
  </a>
);

export default Footer;
