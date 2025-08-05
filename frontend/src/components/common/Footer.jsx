import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
  const year = new Date().getFullYear();

 

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
        {/* Main Footer Content */}
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info Section */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">StyleNest</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your premier destination for fashion, beauty, and lifestyle products. 
                  Discover curated collections from trusted vendors worldwide.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <FiPhoneCall className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">+234 805 469 6701</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMail className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">support@stylenest.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiMapPin className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Lagos, Nigeria</span>
                </div>
              </div>

             
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/collections/all" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/stores" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    Our Stores
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/category" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    Categories
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/vendor-application" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    Become a Vendor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/profile" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    My Account
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/my-orders" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    Order Tracking
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/forget-password" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    Password Reset
                  </Link>
                </li>
                <li>
                  <Link 
                    to="" 
                    className="text-sm text-gray-600 hover:text-black transition-colors duration-200 flex items-center"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-3"></span>
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media & Legal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 mb-6">
                <Link 
                  to="" 
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <TbBrandMeta className="w-5 h-5" />
                </Link>
                <Link 
                  to="" 
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <IoLogoInstagram className="w-5 h-5" />
                </Link>
                <Link 
                  to="" 
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <RiTwitterXLine className="w-5 h-5" />
                </Link>
                <Link 
                  to="" 
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </Link>
                <Link 
                  to="" 
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
                >
                  <FaYoutube className="w-5 h-5" />
                </Link>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Methods</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="w-full h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-semibold">Bank Transfer</div>
                  <div className="w-full h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-semibold">OPay</div>
                  <div className="w-full h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-semibold">Palmpay</div>
                  <div className="w-full h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-semibold">Union Bank</div>
                  <div className="w-full h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-semibold">UBA</div>
                  <div className="w-full h-6 bg-gray-200 rounded text-xs flex items-center justify-center font-semibold">USSD</div>
                </div>
                <p className="text-xs text-gray-500 mb-1">+ Many more banks & payment options</p>
                <p className="text-xs text-gray-500">Powered by Paystack</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 bg-white">
          <div className="container max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-600">
                © {year} StyleNest. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm text-gray-600">
                <Link to="" className="hover:text-black transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link to="" className="hover:text-black transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link to="" className="hover:text-black transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
