"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import GoogleButton from "@/components/GoogleButton";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (email && password) {
      localStorage.setItem("token", "dummy-token");
      router.push("/");
    }
  };

  const handleGoogleRegister = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black/95 z-0" />

      <div
        className={`relative z-10 w-full max-w-md p-10 bg-black/70 rounded-3xl shadow-2xl backdrop-blur-md transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-red-700">
          OBSCURA
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-[#1c1c1c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-300 hover:ring-red-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-[#1c1c1c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-300 hover:ring-red-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-[#1c1c1c] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-300 hover:ring-red-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-700 to-red-900 rounded-lg font-semibold text-lg shadow-lg hover:opacity-90 transition duration-300 transform hover:-translate-y-1"
          >
            Sign Up
          </button>
        </form>

        {/* Google Register Button (reusable) */}
        <GoogleButton onClick={handleGoogleRegister} text="Sign up with Google" />

        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-red-700 hover:underline">
            Sign in now
          </Link>
        </p>
      </div>
    </div>
  );
}
