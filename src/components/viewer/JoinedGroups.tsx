"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface GroupItem {
  _id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  photos?: string[];
  createdBy?: { _id?: string; name?: string };
  members?: any[];
}

export default function JoinedGroups() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const phone = typeof window !== "undefined" ? localStorage.getItem("verifiedMobile") : null;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!phone) {
        const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        if (uid) {
          setUserId(uid);
          fetchJoined(uid);
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/profile?phone=${phone}`);
        const data = await res.json();
        if (res.ok && data.user) {
          setUserId(data.user._id);
          fetchJoined(data.user._id);
        } else {
          const uid = localStorage.getItem("userId");
          if (uid) {
            setUserId(uid);
            fetchJoined(uid);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("profile fetch error", err);
        setLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchJoined(uid: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/joined?userId=${uid}`);
      const data = await res.json();
      if (res.ok) {
        setGroups(data.groups || []);
      } else {
        console.warn("Failed to fetch joined groups", data);
        setGroups([]);
      }
    } catch (err) {
      console.error("fetchJoined error", err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }

  async function leaveGroup(gid: string) {
    if (!userId) return toast.error("Please login again");
    if (!confirm("Are you sure you want to leave this group?")) return;

    try {
      const res = await fetch("/api/groups/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: gid, userId }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Left group");
        fetchJoined(userId);
      } else {
        toast.error(data.message || "Could not leave");
      }
    } catch (err) {
      console.error("leaveGroup error", err);
      toast.error("Something went wrong");
    }
  }

  if (loading) return <div className="p-6 text-[#1f6563]">Loading joined groups...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">Joined Groups</h2>

      {groups.length === 0 ? (
        <p className="text-gray-500">You haven't joined any groups yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div key={g._id} className="bg-white rounded-xl shadow p-4">
              <div className="h-36 rounded overflow-hidden mb-3 bg-gray-100">
                <img src={g.coverPhoto || "/default-cover.png"} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold text-[#1f6563]">{g.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{g.description || "No description"}</p>

              <div className="flex items-center justify-between mt-3 gap-3">
                <Link href={`/dashboard/user/group/${g._id}`} className="text-sm bg-[#1f6563] text-white px-3 py-2 rounded hover:bg-[#15514f]">
                  Open
                </Link>

                <div className="text-xs text-gray-600">
                  {g.photos ? g.photos.length : 0} photos
                </div>

                <button
                  onClick={() => leaveGroup(g._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Leave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
