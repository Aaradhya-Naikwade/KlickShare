
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PhotographerData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  role: string;
}

export default function MyProfile() {
  const [profile, setProfile] = useState<PhotographerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // ---------- FETCH PROFILE ----------
  const fetchProfile = async () => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    const phone =
      typeof window !== "undefined" ? localStorage.getItem("verifiedMobile") : null;

    if (!userId && !phone) {
      toast.error("User not logged in");
      return;
    }

    try {
      const url = userId
        ? `/api/user?userId=${userId}`        // 🔥 Correct param
        : `/api/user?phone=${phone}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.user) {
        setProfile(data.user);
      } else {
        toast.error(data.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Something went wrong while loading profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ---------- SAVE CHANGES ----------
  const handleSave = async () => {
  if (!profile) return;

  try {
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: profile._id,
        name: profile.name,
        email: profile.email,
        companyName: profile.companyName,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } else {
      toast.error(data.message || "Update failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  }
};


  if (loading)
    return <div className="p-6 text-[#1f6563]">Loading profile...</div>;

  if (!profile)
    return <div className="p-6 text-red-500">Profile not found!</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-[#1f6563] mb-6">
        My Profile
      </h2>

      {/* NAME */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Full Name</label>
        <input
          type="text"
          disabled={!isEditing}
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563]"
        />
      </div>

      {/* EMAIL */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Email</label>
        <input
          type="email"
          disabled={!isEditing}
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563]"
        />
      </div>

      {/* COMPANY NAME */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Company Name</label>
        <input
          type="text"
          disabled={!isEditing}
          value={profile.companyName}
          onChange={(e) =>
            setProfile({ ...profile, companyName: e.target.value })
          }
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563]"
        />
      </div>

      {/* MOBILE NUMBER */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Mobile Number</label>
        <input
          type="text"
          value={profile.phone}
          disabled
          className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* ROLE */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Role</label>
        <input
          type="text"
          value={profile.role}
          disabled
          className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* BUTTONS */}
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 bg-[#1f6563] text-white px-5 py-2 rounded-lg hover:bg-[#15514f]"
        >
          Edit Profile
        </button>
      ) : (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="bg-[#1f6563] text-white px-5 py-2 rounded-lg hover:bg-[#15514f]"
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              fetchProfile();
            }}
            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
