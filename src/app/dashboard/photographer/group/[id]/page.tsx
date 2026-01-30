"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GroupUploader from "@/components/photographer/GroupUploader";
import PhotoViewer from "@/components/photographer/PhotoViewer";
import toast from "react-hot-toast";

interface Group {
  _id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  isPublic?: boolean;
  members?: any[];
  photos?: string[];
  createdBy?: string | any;
  createdAt?: string;
}

export default function ManageGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = (params as any)?.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    fetchGroup();
    fetchMembers();

    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [groupId]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  // ------------------ FETCH GROUP ------------------
  async function fetchGroup() {
    setLoading(true);
    try {
      const res = await fetch(`/api/groups?id=${groupId}`);
      const data = await res.json();

      if (res.ok) {
        setGroup(data.group);
        setName(data.group.name || "");
        setDescription(data.group.description || "");
        setIsPublic(!!data.group.isPublic);
      } else {
        toast.error("Failed to fetch group");
        router.push("/dashboard/photographer");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching group");
      router.push("/dashboard/photographer");
    } finally {
      setLoading(false);
    }
  }

  // ------------------ FETCH MEMBERS ------------------
  async function fetchMembers() {
    setMembersLoading(true);
    try {
      const res = await fetch(`/api/groups/members?groupId=${groupId}`);
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
      } else {
        toast.error("Failed to load members");
      }
    } catch (err) {
      console.error("fetchMembers error:", err);
      toast.error("Error loading members");
    } finally {
      setMembersLoading(false);
    }
  }

  // ------------------ SAVE GROUP DETAILS ------------------
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("id", groupId);
    fd.append("name", name);
    fd.append("description", description);
    fd.append("isPublic", isPublic ? "true" : "false");
    if (coverFile) fd.append("coverPhoto", coverFile);

    try {
      const res = await fetch("/api/groups", { method: "PUT", body: fd });
      const data = await res.json();
      if (res.ok) {
        toast.success("Group updated");
        fetchGroup();
        setCoverFile(null);
        setCoverPreview(null);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("update error", err);
      toast.error("Something went wrong");
    }
  }

  // ------------------ DELETE PHOTO ------------------
  async function deletePhoto(url: string) {
    if (!confirm("Delete this photo?")) return;

    try {
      const res = await fetch(
        `/api/groups/photos/delete?groupId=${groupId}&url=${encodeURIComponent(url)}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Photo deleted");
        setOpenMenuIndex(null);
        fetchGroup();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("delete photo", err);
      toast.error("Error deleting photo");
    }
  }

  // ------------------ REMOVE MEMBER ------------------
  async function removeMember(userId: string) {
    if (!confirm("Remove this member from the group?")) return;

    try {
      const res = await fetch(
        `/api/groups/members?groupId=${groupId}&userId=${userId}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success("Member removed");
        fetchMembers();
        fetchGroup();
      } else {
        toast.error(data.message || "Failed to remove member");
      }
    } catch (err) {
      console.error("removeMember error", err);
      toast.error("Error removing member");
    }
  }

  // ------------------ RENDER ------------------
  if (loading) return <div className="p-6 text-[#1f6563]">Loading...</div>;
  if (!group) return <div className="p-6 text-red-500">Group not found</div>;

  return (
    <div className="p-6 space-y-8">
      {/* GROUP DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">Manage Group</h2>

        <form onSubmit={handleSave} className="space-y-4">
          {/* cover */}
          <div>
            <label className="block mb-2 text-sm text-gray-700">Cover Photo</label>
            <div className="flex items-center gap-4">
              <div className="w-40 h-28 bg-gray-100 rounded overflow-hidden border">
                <img src={coverPreview || group.coverPhoto || "/default-cover.png"} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="bg-[#f3f7f6] px-4 py-2 rounded cursor-pointer border">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setCoverFile(f);
                      if (f) setCoverPreview(URL.createObjectURL(f));
                    }}
                  />
                  Change Cover
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview(null);
                  }}
                  className="text-sm text-gray-600 underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* name */}
          <div>
            <label className="block text-sm mb-1">Group Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* public */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="text-sm">Public Group</span>
          </div>

          <div className="flex gap-3">
            <button className="bg-[#1f6563] text-white px-4 py-2 rounded">
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => {
                setName(group.name || "");
                setDescription(group.description || "");
                setIsPublic(!!group.isPublic);
                setCoverFile(null);
                setCoverPreview(null);
              }}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* UPLOAD */}
      <div>
        <h3 className="text-xl font-semibold text-[#1f6563] mb-2">Upload Photos</h3>
        <GroupUploader groupId={groupId} onUploaded={() => fetchGroup()} />
      </div>

      {/* MEMBERS SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#1f6563]">
            Members ({members.length})
          </h3>
          <div className="text-sm text-gray-500">
            Creator:{" "}
            <span className="font-medium">
              {(group.createdBy && (group.createdBy.name || group.createdBy)) ||
                "Creator"}
            </span>
          </div>
        </div>

        {membersLoading ? (
          <p className="text-gray-500">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500">No members in this group yet.</p>
        ) : (
          <div className="space-y-3">
            {members.map((m: any) => {
              const user = m.user || m;
              return (
                <div
                  key={user?._id || user}
                  className="flex items-center justify-between border rounded p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-[#1f6563]">
                        {user?.name ? user.name[0] : "U"}
                      </span>
                    </div>

                    <div>
                      <div className="font-medium">{user?.name || "Unnamed User"}</div>
                      <div className="text-sm text-gray-500">{user?.phone}</div>
                      <div className="text-xs text-gray-400">
                        Joined:{" "}
                        {m.joinedAt
                          ? new Date(m.joinedAt).toLocaleDateString()
                          : "—"}
                      </div>

                      {String(group.createdBy) ===
                        String(user?._id || user) && (
                        <span className="inline-block text-xs bg-[#1f6563] text-white px-2 py-1 rounded mt-1">
                          Creator
                        </span>
                      )}
                    </div>
                  </div>

                  {String(group.createdBy) !== String(user?._id || user) ? (
                    <button
                      onClick={() => removeMember(user?._id || user)}
                      className="text-red-600 px-3 py-1 rounded hover:bg-red-100"
                    >
                      Remove
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400 italic">You</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* GALLERY */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-[#1f6563] mb-4">
          Gallery ({group.photos?.length ?? 0})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {group.photos?.map((p, i) => (
            <div key={i} className="relative h-40 border rounded overflow-hidden bg-gray-200">
              <img
                src={p}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setViewIndex(i)}
              />

              <button
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                onClick={() =>
                  setOpenMenuIndex(openMenuIndex === i ? null : i)
                }
              >
                ⋮
              </button>

              {openMenuIndex === i && (
                <div className="absolute top-10 right-2 bg-white shadow-lg rounded-lg w-32 z-50">
                  <button
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setViewIndex(i)}
                  >
                    View
                  </button>

                  <a
                    href={p}
                    download
                    className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                  >
                    Download
                  </a>

                  <button
                    className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-100 text-sm"
                    onClick={() => deletePhoto(p)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO VIEWER */}
      {viewIndex !== null && group?.photos && (
        <PhotoViewer
          images={group.photos}
          initialIndex={viewIndex}
          onClose={() => setViewIndex(null)}
          onDelete={async (url) => {
            await deletePhoto(url);
          }}
        />
      )}
    </div>
  );
}
