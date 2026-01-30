"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // Fetch User (Corrected)
  // ---------------------------------------------
  useEffect(() => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    const phone =
      typeof window !== "undefined" ? localStorage.getItem("verifiedMobile") : null;

    if (!userId && !phone) {
      toast.error("User not logged in!");
      return;
    }

    async function fetchUser() {
      try {
        const url = userId
          ? `/api/user?userId=${userId}`
          : `/api/user?phone=${phone}`;

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
          setForm({
            name: data.user.name || "",
            email: data.user.email || "",
          });
        } else {
          toast.error(data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // ---------------------------------------------
  // Save Updated Profile
  // ---------------------------------------------
  const handleSave = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user._id,
          name: form.name,
          email: form.email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Profile updated successfully!");
        setUser(data.user);
        setIsEditing(false);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };


  if (loading)
    return <p className="p-6 text-[#1f6563]">Loading profile...</p>;

  if (!user)
    return <p className="p-6 text-red-500">User not found</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-[#1f6563] mb-6">
        My Profile 👤
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={isEditing ? form.name : user.name}
          disabled={!isEditing}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`w-full p-3 border rounded-lg ${isEditing ? "bg-white" : "bg-gray-100"
            }`}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={isEditing ? form.email : user.email}
          disabled={!isEditing}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`w-full p-3 border rounded-lg ${isEditing ? "bg-white" : "bg-gray-100"
            }`}
        />
      </div>

      {/* Mobile */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Number
        </label>
        <input
          type="text"
          value={user.phone}
          disabled
          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
        />
      </div>

      {/* Role */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <input
          type="text"
          value={user.role}
          disabled
          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
        />
      </div>

      {/* Buttons */}
      {isEditing ? (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-[#1f6563] text-white px-4 py-2 rounded-lg hover:bg-[#15514f] transition"
          >
            Save Changes
          </button>

          <button
            onClick={() => {
              setIsEditing(false);
              setForm({ name: user.name, email: user.email });
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-[#1f6563] text-white px-6 py-2 rounded-lg hover:bg-[#15514f] transition"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
