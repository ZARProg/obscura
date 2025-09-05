"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { User as UserIcon, Camera } from "lucide-react";

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setUsername(user.username || "");
      setDateOfBirth(user.dateOfBirth || "");
      setAvatar(user.avatar || null);
      setBio(user.bio || "");
      setLastLogin(user.lastLogin || null);
    }
    setLoading(false);
  }, [user, router]);

  if (loading)
    return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>;
  if (!user) return null;

  const handleSave = () => {
    updateUser({
      username,
      dateOfBirth,
      bio,
      ...(avatar && { avatar }),
      lastLogin: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start pt-20 px-4">
      <div className="w-full max-w-5xl p-8 bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">My Profile</h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-gray-500" />
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-red-700 p-2 rounded-full cursor-pointer hover:bg-red-500 transition">
                  <Camera size={18} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              )}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col">
              <label className="text-gray-400 mb-1">Username:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-3 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              ) : (
                <span className="text-white">{username || "Not set"}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-1">Email:</label>
              <span className="text-white">{user.email || "Not set"}</span>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-1">Date of Birth:</label>
              {isEditing ? (
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="px-3 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              ) : (
                <span className="text-white">{dateOfBirth || "Not set"}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-1">Joined:</label>
              <span className="text-white">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </span>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-400 mb-1">Last Login:</label>
              <span className="text-white">
                {lastLogin ? new Date(lastLogin).toLocaleString() : "Never"}
              </span>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-gray-400 mb-1">Bio:</label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-700 resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-white">{bio || "Not set"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-500 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-500 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
