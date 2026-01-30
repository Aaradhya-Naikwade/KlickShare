"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Group {
  _id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  isPublic?: boolean;
  members?: any[];
  photos?: string[];
  createdAt?: string;
}

export default function MyGroups() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  const phone =
    typeof window !== "undefined"
      ? localStorage.getItem("verifiedMobile")
      : null;

  useEffect(() => {
    if (!phone) return;
    fetchGroups();
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  async function fetchGroups() {
    if (!phone) return;
    setLoadingGroups(true);
    try {
      const res = await fetch(`/api/photographer/groups?phone=${phone}`);
      const data = await res.json();
      if (res.ok) {
        setGroups(data.groups || []);
      } else {
        toast.error(data.message || "Failed to fetch groups");
      }
    } catch (err) {
      console.error("Fetch groups error:", err);
      toast.error("Something went wrong while fetching groups");
    } finally {
      setLoadingGroups(false);
    }
  }

  async function handleCreateGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter group name");
      return;
    }
    if (!phone) {
      toast.error("You must be logged in");
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("isPublic", isPublic ? "true" : "false");
      formData.append("phone", phone);
      if (coverFile) {
        formData.append("coverPhoto", coverFile);
      }

      const res = await fetch("/api/photographer/groups", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Group created");
        setName("");
        setDescription("");
        setIsPublic(false);
        setCoverFile(null);
        setCoverPreview(null);
        fetchGroups();
      } else {
        toast.error(data.message || "Failed to create group");
      }
    } catch (err) {
      console.error("Create group error:", err);
      toast.error("Something went wrong while creating group");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(groupId: string) {
    const ok = confirm(
      "Are you sure you want to delete this group? This cannot be undone."
    );
    if (!ok) return;

    try {
      const res = await fetch(`/api/photographer/groups?id=${groupId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Group deleted");
        fetchGroups();
      } else {
        toast.error(data.message || "Failed to delete group");
      }
    } catch (err) {
      console.error("Delete group error:", err);
      toast.error("Something went wrong while deleting group");
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Group Form */}
      <form
        onSubmit={handleCreateGroup}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">
          Create New Group
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563] outline-none"
              placeholder="e.g. Wedding - Riya & Aman"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Public Group
            </label>
            <div className="flex items-center gap-3">
              <input
                id="isPublic"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-600">
                Make this group public (show in Explore)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563] outline-none"
            placeholder="Short description (optional)"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Photo (optional)
          </label>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer bg-[#f3f7f6] px-4 py-2 rounded-lg border">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setCoverFile(f);
                }}
                className="hidden"
              />
              <span className="text-sm text-gray-700">Choose image</span>
            </label>

            {coverPreview ? (
              <img
                src={coverPreview}
                alt="preview"
                className="w-28 h-20 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-28 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400 border">
                Preview
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Formats: PNG/JPG — Max 20MB
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={creating}
            className="bg-[#1f6563] text-white px-5 py-2 rounded-lg hover:bg-[#15514f] transition"
          >
            {creating ? "Creating..." : "Create Group"}
          </button>

          <button
            type="button"
            onClick={() => {
              setName("");
              setDescription("");
              setIsPublic(false);
              setCoverFile(null);
              setCoverPreview(null);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Groups List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-2xl font-semibold text-[#1f6563] mb-4">
          My Groups
        </h3>

        {loadingGroups ? (
          <p className="text-[#1f6563]">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="text-gray-500">
            You have not created any groups yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((g) => (
              <div
                key={g._id}
                className="rounded-lg overflow-hidden border"
              >
                <div className="h-40 w-full bg-gray-200 relative">
                  <img
                    src={g.coverPhoto || "/default-cover.png"}
                    alt={g.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-[#1f6563]">
                        {g.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {g.description || "No description"}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          g.isPublic
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {g.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div>{(g.photos?.length ?? 0)} Photos</div>
                    <div>{(g.members?.length ?? 0)} Members</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        window.location.href = `/dashboard/photographer/group/${g._id}`;
                      }}
                      className="bg-[#1f6563] text-white px-3 py-1 rounded-lg hover:bg-[#15514f] transition text-sm"
                    >
                      Manage
                    </button>

                    <button
                      onClick={() => handleDelete(g._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
