"use client";
import { useState } from "react";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <nav className="bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 text-white p-5 fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide uppercase">
          <Link href="/">ScholarNova</Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-8 font-medium text-lg">
          <Link href="#about" className="hover:text-gray-100 transition-all">About</Link>
          <Link href="#services" className="hover:text-gray-100 transition-all">Services</Link>

          {/* Dropdown Links */}
          <button
            className="relative hover:text-gray-100 transition-all"
            onClick={() => toggleDropdown("menu1")}
          >
            Solutions
          </button>
          <button
            className="relative hover:text-gray-100 transition-all"
            onClick={() => toggleDropdown("menu2")}
          >
            Pricing
          </button>
        </div>

        {/* Contact Icons */}
        <div className="flex items-center space-x-5">
          <a href="mailto:info@example.com" className="hover:text-gray-100 transition-all">
            <FaEnvelope className="text-xl" />
          </a>
          <a href="tel:+1234567890" className="hover:text-gray-100 transition-all">
            <FaPhoneAlt className="text-xl" />
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => toggleDropdown("mobile")}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <span className="text-3xl">☰</span>
          </button>
        </div>
      </div>

      {/* Dropdown for "Solutions" */}
      <AnimatePresence>
        {activeDropdown === "menu1" && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-16 left-0 right-0 bg-white text-gray-800 z-50 shadow-lg rounded-lg p-6"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="#menu1-1" className="hover:text-rose-600 transition-all">Solution 1</Link>
              <Link href="#menu1-2" className="hover:text-rose-600 transition-all">Solution 2</Link>
              <Link href="#menu1-3" className="hover:text-rose-600 transition-all">Solution 3</Link>
              <Link href="#menu1-4" className="hover:text-rose-600 transition-all">Solution 4</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown for "Pricing" */}
      <AnimatePresence>
        {activeDropdown === "menu2" && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-16 left-0 right-0 bg-white text-gray-800 z-50 shadow-lg rounded-lg p-6"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="#pricing1" className="hover:text-rose-600 transition-all">Basic Plan</Link>
              <Link href="#pricing2" className="hover:text-rose-600 transition-all">Standard Plan</Link>
              <Link href="#pricing3" className="hover:text-rose-600 transition-all">Premium Plan</Link>
              <Link href="#pricing4" className="hover:text-rose-600 transition-all">Custom Plan</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {activeDropdown === "mobile" && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-16 left-0 right-0 bg-white text-gray-800 z-50 shadow-lg rounded-lg p-6 flex flex-col"
          >
            <Link href="#about" className="py-2 text-lg hover:text-rose-600 transition-all">About</Link>
            <Link href="#services" className="py-2 text-lg hover:text-rose-600 transition-all">Services</Link>
            <Link href="#solutions" className="py-2 text-lg hover:text-rose-600 transition-all">Solutions</Link>
            <Link href="#pricing" className="py-2 text-lg hover:text-rose-600 transition-all">Pricing</Link>
            <button
              onClick={() => toggleDropdown("mobile")}
              className="bg-gray-700 text-white px-4 py-2 mt-4 rounded-lg hover:bg-gray-600 transition-all"
            >
              Close Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
