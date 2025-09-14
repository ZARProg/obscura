"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function AccountPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-red-700">My Account</h1>

      {/* Avatar */}
      <div className="relative w-32 h-32 mb-6">
        <Image
          src={user?.image || "/default-avatar.png"} // ✅ fallback
          alt="User Avatar"
          width={128}
          height={128}
          className="rounded-full border-4 border-gray-800 object-cover"
          priority
        />
      </div>

      {/* User info */}
      <h2 className="text-2xl font-semibold">{user?.name || "Guest User"}</h2>
      <p className="text-gray-400">{user?.email || "No email available"}</p>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-6 px-6 py-3 bg-red-700 rounded-lg font-semibold hover:bg-red-800 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
