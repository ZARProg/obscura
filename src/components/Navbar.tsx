"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, User, Home, Info, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, logout, login } = useAuth();

  // 🔹 Cek apakah user sudah login dari localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      login(); // restore state
    }
  }, [user, login]);

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

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token"); // hapus token saat logout
    router.push("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: showNavbar ? 0 : -80 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md fixed top-0 left-0 w-full z-50"
      >
        {/* MOBILE: hamburger kiri */}
        <div className="md:hidden flex items-center gap-2">
          <AnimatePresence>
            {!isOpen && (
              <motion.button
                key="hamburger"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(true)}
                className="p-2"
              >
                <Menu size={28} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-red-700 md:static md:ml-0 md:mr-auto"
        >
          OBSCURA
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-lg font-medium items-center">
          <Link href="/" className="hover:text-red-700 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-red-700 transition">
            About
          </Link>

          {user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-2 ml-4 hover:text-red-700 transition"
              >
                <User size={20} /> Account
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 ml-4 hover:text-red-700 transition"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 ml-4 hover:text-red-700 transition"
            >
              <User size={20} /> Login
            </Link>
          )}
        </div>

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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-red-700"
          >
            <Search size={18} />
          </button>
        </form>
      </motion.nav>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 
                       bg-black/80 backdrop-blur-md 
                       z-50 md:hidden flex flex-col"
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 px-4 mt-6"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/60 px-4 py-2 rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-700 w-full"
              />
            </form>

            <nav className="flex flex-col mt-8 space-y-4 px-4 text-lg font-medium">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-white hover:text-red-700 transition-colors"
              >
                <Home size={20} /> Home
              </Link>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-white hover:text-red-700 transition-colors"
              >
                <Info size={20} /> About
              </Link>

              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-white hover:text-red-700 transition-colors"
                  >
                    <User size={20} /> Account
                  </Link>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 text-white hover:text-red-700 transition-colors"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-white hover:text-red-700 transition-colors"
                >
                  <User size={20} /> Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
