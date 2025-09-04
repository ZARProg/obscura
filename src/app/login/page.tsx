"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulasi login berhasil
    if (email && password) {
      document.cookie = `authToken=dummyToken; path=/; max-age=3600`;
      router.push("/");
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-black text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-black/80 p-8 backdrop-blur-md shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
          OBSCURA
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-red-700 hover:bg-red-700 transition rounded font-semibold"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          New to OBSCURA?{" "}
          <Link href="/register" className="text-red-700 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
