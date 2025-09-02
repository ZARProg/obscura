"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: showNavbar ? 0 : -80 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-50"
    >
      <Link href="/" className="text-2xl font-bold text-red-700">
        OBSCURA
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-lg font-medium items-center">
        <Link href="/" className="hover:text-red-700 transition">Home</Link>
        <Link href="/about" className="hover:text-red-700 transition">About</Link>

        <form onSubmit={handleSearch} className="relative ml-4">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-700"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Profile */}
        <Link href="/account" className="flex items-center gap-2 ml-4 hover:text-red-700 transition">
          <User size={20} /> Account
        </Link>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-gray-800 flex flex-col items-center gap-6 py-6 text-lg font-medium md:hidden shadow-md z-50"
          >
            <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/account" onClick={() => setIsOpen(false)}>Account</Link>

            <form onSubmit={handleSearch} className="flex items-center gap-2 w-4/5 mt-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 flex-1 px-4 py-2 rounded-full text-sm"
              />
              <button type="submit"><Search size={20} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
