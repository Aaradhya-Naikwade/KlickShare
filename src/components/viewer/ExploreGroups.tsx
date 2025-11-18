"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Group {
  _id: string;
  name: string;
  description: string;
  coverPhoto?: string;
  createdBy?: { name?: string };
}

export default function ExploreGroups() {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return toast.error("Enter group name or ID to search");

    setLoading(true);
    try {
      const res = await fetch(`/api/groups/search?query=${query}`);
      const data = await res.json();

      if (res.ok) {
        setGroups(data.groups || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#1f6563] mb-6">
        🔍 Explore Groups
      </h2>

      {/* Search Box */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by group name or ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563] outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-[#1f6563] text-white px-5 rounded-lg hover:bg-[#15514f] transition"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-[#1f6563]">Searching...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500">No groups found. Try searching something!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() =>
                (window.location.href = `/dashboard/user/group/${group._id}`)
              }
              className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition cursor-pointer border"
            >
              <div className="h-40 rounded overflow-hidden bg-gray-200 mb-3">
                <img
                  src={group.coverPhoto || "/default-cover.png"}
                  className="w-full h-full object-cover"
                  alt="Cover"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#1f6563]">
                {group.name}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                by {group.createdBy?.name || "Unknown Photographer"}
              </p>

              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {group.description || "No description available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
