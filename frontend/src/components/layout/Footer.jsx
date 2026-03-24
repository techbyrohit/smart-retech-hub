import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// Mobile accordion section component
const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 md:border-none">
      {/* Mobile toggle header */}
      <button
        className="w-full flex justify-between items-center py-3 md:py-0 md:cursor-default"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-white text-base md:text-lg font-bold md:mb-4">
          {title}
        </h3>
        <span className="md:hidden text-gray-400">
          {open ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </span>
      </button>

      {/* Content - always visible on desktop, toggle on mobile */}
      <div className={`${open ? "block" : "hidden"} md:block pb-3 md:pb-0`}>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom px-4 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8">
          {/* About Section */}
          <FooterSection title="About Smart-Retech">
            <p className="text-sm leading-relaxed mb-4">
              Your trusted online shopping destination for Laptops, Computers,
              and more. We deliver quality products at competitive prices.
            </p>
            <div className="flex gap-3 pb-2 md:pb-0">
              {[
                {
                  href: "https://facebook.com",
                  icon: <FaFacebookF size={15} />,
                },
                { href: "https://twitter.com", icon: <FaTwitter size={15} /> },
                {
                  href: "https://instagram.com",
                  icon: <FaInstagram size={15} />,
                },
                {
                  href: "https://linkedin.com",
                  icon: <FaLinkedinIn size={15} />,
                },
              ].map(({ href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection title="Quick Links">
            <ul className="space-y-2 text-sm pb-2 md:pb-0">
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary-400 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="hover:text-primary-400 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-primary-400 transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-primary-400 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Customer Service */}
          <FooterSection title="Customer Service">
            <ul className="space-y-2 text-sm pb-2 md:pb-0">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shippingpolicy"
                  className="hover:text-primary-400 transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-primary-400 transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection title="Contact Us">
            <ul className="space-y-3 text-sm pb-2 md:pb-0">
              <li className="flex items-start gap-3">
                <MdLocationOn
                  size={18}
                  className="text-primary-400 mt-0.5 shrink-0"
                />
                <span>123 E-Commerce Street, Agra, Uttar Pradesh 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone size={18} className="text-primary-400 shrink-0" />
                <a
                  href="tel:+917895973409"
                  className="hover:text-primary-400 transition-colors"
                >
                  +91 7895973409
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail size={18} className="text-primary-400 shrink-0" />
                <a
                  href="mailto:support@smartretech.com"
                  className="hover:text-primary-400 transition-colors break-all"
                >
                  support@smartretech.com
                </a>
              </li>
            </ul>
          </FooterSection>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom px-4 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm">
            <p className="text-center sm:text-left">
              &copy; 2026 Smart-Retech. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <Link
                to="/privacy"
                className="hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-primary-400 transition-colors"
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
