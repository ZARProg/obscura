"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Auto-hide navbar saat scroll
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

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // reset setelah search
      setIsOpen(false); // tutup menu mobile
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: showNavbar ? 0 : -80 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.5,
      }}
      className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-50"
    >
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-yellow-400">
        MovieApp
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-lg font-medium items-center">
        <Link href="/" className="hover:text-yellow-400 transition">
          Home
        </Link>
        <Link href="/movies" className="hover:text-yellow-400 transition">
          Movies
        </Link>
        <Link href="/about" className="hover:text-yellow-400 transition">
          About
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="relative ml-4">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Mobile Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 relative w-10 h-10 flex items-center justify-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute"
              >
                <Menu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Overlay + Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 w-full bg-gray-800 flex flex-col items-center gap-6 py-6 text-lg font-medium md:hidden shadow-md z-50"
            >
              {["Home", "Movies", "About"].map((item, idx) => (
                <motion.div key={idx} variants={linkVariants}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="hover:text-yellow-400"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}

              {/* Search Bar (Mobile) */}
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 w-4/5 mt-4"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-700 flex-1 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-yellow-400"
                >
                  <Search size={20} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
