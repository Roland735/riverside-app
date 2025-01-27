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
    <main className="bg-white flex items-center justify-center min-h-screen">
      <Link href="/auth/login" className="px-3 py-2 bg-red-600 text-xl text-white">
        Login
      </Link>
    </main>
  );
}
