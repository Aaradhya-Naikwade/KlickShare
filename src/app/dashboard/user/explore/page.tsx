"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast"; // ✅ import toast

export default function ExploreGroups() {
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) {
      toast.error("Please enter a search query."); // ✅ toast for empty input
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/groups/search?query=${query}`);
      const data = await res.json();

      if (res.ok) {
        setGroups(data.groups || []);
        if (data.groups.length === 0) {
          toast("No groups found."); // ✅ toast for no results
        } else {
          toast.success(`${data.groups.length} groups found!`); // ✅ toast for success
        }
      } else {
        toast.error(data.message); // ✅ toast for API error
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Something went wrong while searching."); // ✅ toast for catch error
    }

    setLoading(false);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">
        Explore Groups
      </h2>

      {/* SEARCH BOX */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search groups by name, photographer, or ID..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          type="submit"
          className="bg-[#1f6563] text-white px-5 rounded-lg flex items-center gap-2"
        >
          <Search size={18} /> Search
        </button>
      </form>

      {/* RESULTS */}
      {loading ? (
        <p className="text-[#1f6563]">Searching...</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500">No groups found. Try searching something.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((g) => (
            <Link
              key={g._id}
              href={`/dashboard/user/group/${g._id}`}
              className="block p-4 bg-white rounded-xl shadow hover:shadow-lg transition border cursor-pointer"
            >
              <div className="h-40 rounded overflow-hidden mb-3 bg-gray-200 pointer-events-none">
                <img
                  src={g.coverPhoto || "/default-cover.png"}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold text-[#1f6563]">
                {g.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Photographer: {g.createdBy?.name || "Unknown"}
              </p>

              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                {g.description || "No description available."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
