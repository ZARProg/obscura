"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Search,
  User,
  LogOut,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 🔹 Ambil session dari NextAuth
  const { data: session } = useSession();
  const user = session?.user;

  // 🔹 Auto hide navbar on scroll
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

  // 🔹 Realtime auto-search
  useEffect(() => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    const delayDebounce = setTimeout(() => {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);

      if (loadingTimeout) clearTimeout(loadingTimeout);
      const timeout = setTimeout(() => {
        setIsSearching(false);
      }, 800);
      setLoadingTimeout(timeout);
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, router]);

  useEffect(() => {
    if (loadingTimeout) clearTimeout(loadingTimeout);
    setIsSearching(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // helper untuk active link
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "TV Shows", path: "/tv" },
    { name: "Movies", path: "/movie" },
    { name: "My List", path: "/mylist" },
  ];

  // 🔹 Ambil inisial user
  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
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
        {/* MOBILE: hamburger */}
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
        <Link href="/" className="text-2xl font-bold text-red-700 md:mr-6">
          OBSCURA
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex gap-6 text-sm font-medium items-center relative">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`relative pb-1 transition ${
                isActive(item.path)
                  ? "text-red-700 font-semibold"
                  : "hover:text-red-700"
              }`}
            >
              {item.name}
              {/* Animated underline */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-red-700 rounded"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative ml-4 hidden md:block">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          />
          {isSearching ? (
            <Loader2
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-700 animate-spin"
            />
          ) : (
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
            />
          )}
        </div>

        {/* Profile Dropdown */}
        {user ? (
          <div className="relative ml-6">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full object-cover border border-gray-700"
                />
              ) : (
                <div className="w-8 h-8 bg-red-700 text-white flex items-center justify-center rounded-full font-bold">
                  {getInitials(user.name)}
                </div>
              )}
              <ChevronDown size={18} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  key="profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-black border border-gray-800 rounded-md shadow-lg py-2 text-sm z-50"
                >
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-white hover:bg-[#222]"
                  >
                    Account
                  </Link>
                  <Link
                    href="/help"
                    className="block px-4 py-2 text-white hover:bg-[#222]"
                  >
                    Help Center
                  </Link>

                  <div className="border-t border-red-700 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#222]"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 ml-4 hover:text-red-700 transition"
          >
            <User size={20} /> Login
          </Link>
        )}
      </motion.nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-md z-50 md:hidden flex flex-col"
          >
            <div className="flex items-center gap-2 px-4 mt-6 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/60 px-4 py-2 rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-700 w-full"
              />
              {isSearching && (
                <Loader2
                  size={18}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-red-700 animate-spin"
                />
              )}
            </div>

            <nav className="flex flex-col mt-8 space-y-4 px-4 text-lg font-medium">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 transition-colors ${
                    isActive(item.path)
                      ? "text-red-700 font-semibold"
                      : "text-white hover:text-red-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

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
