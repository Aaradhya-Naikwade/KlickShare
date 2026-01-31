// "use client";

// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// interface Group {
//   _id: string;
//   name: string;
//   description?: string;
//   coverPhoto?: string;
//   isPublic?: boolean;
//   members?: any[];
//   photos?: string[];
//   createdAt?: string;
// }

// export default function MyGroups() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [isPublic, setIsPublic] = useState(false);
//   const [coverFile, setCoverFile] = useState<File | null>(null);
//   const [coverPreview, setCoverPreview] = useState<string | null>(null);

//   const [groups, setGroups] = useState<Group[]>([]);
//   const [loadingGroups, setLoadingGroups] = useState<boolean>(true);
//   const [creating, setCreating] = useState<boolean>(false);

//   const phone =
//     typeof window !== "undefined"
//       ? localStorage.getItem("verifiedMobile")
//       : null;

//   useEffect(() => {
//     if (!phone) return;
//     fetchGroups();
//     return () => {
//       if (coverPreview) URL.revokeObjectURL(coverPreview);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [phone]);

//   useEffect(() => {
//     if (!coverFile) {
//       setCoverPreview(null);
//       return;
//     }
//     const url = URL.createObjectURL(coverFile);
//     setCoverPreview(url);
//     return () => URL.revokeObjectURL(url);
//   }, [coverFile]);

//   async function fetchGroups() {
//     if (!phone) return;
//     setLoadingGroups(true);
//     try {
//       const res = await fetch(`/api/photographer/groups?phone=${phone}`);
//       const data = await res.json();
//       if (res.ok) {
//         setGroups(data.groups || []);
//       } else {
//         toast.error(data.message || "Failed to fetch groups");
//       }
//     } catch (err) {
//       console.error("Fetch groups error:", err);
//       toast.error("Something went wrong while fetching groups");
//     } finally {
//       setLoadingGroups(false);
//     }
//   }

//   async function handleCreateGroup(e: React.FormEvent) {
//     e.preventDefault();
//     if (!name.trim()) {
//       toast.error("Please enter group name");
//       return;
//     }
//     if (!phone) {
//       toast.error("You must be logged in");
//       return;
//     }

//     setCreating(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("isPublic", isPublic ? "true" : "false");
//       formData.append("phone", phone);
//       if (coverFile) {
//         formData.append("coverPhoto", coverFile);
//       }

//       const res = await fetch("/api/photographer/groups", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success(data.message || "Group created");
//         setName("");
//         setDescription("");
//         setIsPublic(false);
//         setCoverFile(null);
//         setCoverPreview(null);
//         fetchGroups();
//       } else {
//         toast.error(data.message || "Failed to create group");
//       }
//     } catch (err) {
//       console.error("Create group error:", err);
//       toast.error("Something went wrong while creating group");
//     } finally {
//       setCreating(false);
//     }
//   }

//   async function handleDelete(groupId: string) {
//     const ok = confirm(
//       "Are you sure you want to delete this group? This cannot be undone."
//     );
//     if (!ok) return;

//     try {
//       const res = await fetch(`/api/photographer/groups?id=${groupId}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success(data.message || "Group deleted");
//         fetchGroups();
//       } else {
//         toast.error(data.message || "Failed to delete group");
//       }
//     } catch (err) {
//       console.error("Delete group error:", err);
//       toast.error("Something went wrong while deleting group");
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Create Group Form */}
//       <form
//         onSubmit={handleCreateGroup}
//         className="bg-white p-6 rounded-xl shadow"
//       >
//         <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">
//           Create New Group
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Group Name *
//             </label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563] outline-none"
//               placeholder="e.g. Wedding - Riya & Aman"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Public Group
//             </label>
//             <div className="flex items-center gap-3">
//               <input
//                 id="isPublic"
//                 type="checkbox"
//                 checked={isPublic}
//                 onChange={(e) => setIsPublic(e.target.checked)}
//                 className="w-4 h-4"
//               />
//               <label htmlFor="isPublic" className="text-sm text-gray-600">
//                 Make this group public (show in Explore)
//               </label>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={3}
//             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#1f6563] outline-none"
//             placeholder="Short description (optional)"
//           />
//         </div>

//         <div className="mt-4">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Cover Photo (optional)
//           </label>

//           <div className="flex items-center gap-4">
//             <label className="flex items-center gap-3 cursor-pointer bg-[#f3f7f6] px-4 py-2 rounded-lg border">
//               <input
//                 type="file"
//                 accept="image/png, image/jpeg"
//                 onChange={(e) => {
//                   const f = e.target.files?.[0] ?? null;
//                   setCoverFile(f);
//                 }}
//                 className="hidden"
//               />
//               <span className="text-sm text-gray-700">Choose image</span>
//             </label>

//             {coverPreview ? (
//               <img
//                 src={coverPreview}
//                 alt="preview"
//                 className="w-28 h-20 object-cover rounded-lg border"
//               />
//             ) : (
//               <div className="w-28 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400 border">
//                 Preview
//               </div>
//             )}
//           </div>

//           <p className="text-xs text-gray-500 mt-2">
//             Formats: PNG/JPG — Max 20MB
//           </p>
//         </div>

//         <div className="mt-6 flex items-center gap-3">
//           <button
//             type="submit"
//             disabled={creating}
//             className="bg-[#1f6563] text-white px-5 py-2 rounded-lg hover:bg-[#15514f] transition"
//           >
//             {creating ? "Creating..." : "Create Group"}
//           </button>

//           <button
//             type="button"
//             onClick={() => {
//               setName("");
//               setDescription("");
//               setIsPublic(false);
//               setCoverFile(null);
//               setCoverPreview(null);
//             }}
//             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//           >
//             Reset
//           </button>
//         </div>
//       </form>

//       {/* Groups List */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-2xl font-semibold text-[#1f6563] mb-4">
//           My Groups
//         </h3>

//         {loadingGroups ? (
//           <p className="text-[#1f6563]">Loading groups...</p>
//         ) : groups.length === 0 ? (
//           <p className="text-gray-500">
//             You have not created any groups yet.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {groups.map((g) => (
//               <div
//                 key={g._id}
//                 className="rounded-lg overflow-hidden border"
//               >
//                 <div className="h-40 w-full bg-gray-200 relative">
//                   <img
//                     src={g.coverPhoto || "/default-cover.png"}
//                     alt={g.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div className="p-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h4 className="text-lg font-semibold text-[#1f6563]">
//                         {g.name}
//                       </h4>
//                       <p className="text-sm text-gray-500 mt-1 line-clamp-2">
//                         {g.description || "No description"}
//                       </p>
//                     </div>

//                     <div>
//                       <span
//                         className={`text-xs px-2 py-1 rounded ${
//                           g.isPublic
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         {g.isPublic ? "Public" : "Private"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
//                     <div>{(g.photos?.length ?? 0)} Photos</div>
//                     <div>{(g.members?.length ?? 0)} Members</div>
//                   </div>

//                   <div className="mt-4 flex gap-2">
//                     <button
//                       onClick={() => {
//                         window.location.href = `/dashboard/photographer/group/${g._id}`;
//                       }}
//                       className="bg-[#1f6563] text-white px-3 py-1 rounded-lg hover:bg-[#15514f] transition text-sm"
//                     >
//                       Manage
//                     </button>

//                     <button
//                       onClick={() => handleDelete(g._id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }












"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Event {
  _id: string;
  name: string;
  description?: string;
}

interface Group {
  _id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  isPublic?: boolean;
  members?: any[];
  photos?: string[];
  event?: {
    _id: string;
    name: string;
  };
}

export default function MyGroups() {
  const phone =
    typeof window !== "undefined"
      ? localStorage.getItem("verifiedMobile")
      : null;

  /* ---------------- EVENTS ---------------- */
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [creatingEvent, setCreatingEvent] = useState(false);

  /* ---------------- GROUPS ---------------- */
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!phone) return;
    fetchEvents();
  }, [phone]);

  useEffect(() => {
    if (!selectedEvent) return;
    fetchGroups();
  }, [selectedEvent]);

  /* ---------------- EVENTS API ---------------- */
  async function fetchEvents() {
    try {
      const res = await fetch(`/api/photographer/events?phone=${phone}`);
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
        if (data.events?.length > 0) {
          setSelectedEvent(data.events[0]._id);
        }
      }
    } catch {
      toast.error("Failed to load events");
    }
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!eventName.trim()) return toast.error("Event name required");

    setCreatingEvent(true);
    try {
      const res = await fetch("/api/photographer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: eventName,
          description: eventDesc,
          phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Event created");
        setEventName("");
        setEventDesc("");
        fetchEvents();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Event creation failed");
    } finally {
      setCreatingEvent(false);
    }
  }

  /* ---------------- GROUPS API ---------------- */
  async function fetchGroups() {
    try {
      const res = await fetch(
        `/api/photographer/groups?phone=${phone}&eventId=${selectedEvent}`
      );
      const data = await res.json();
      if (res.ok) setGroups(data.groups || []);
    } catch {
      toast.error("Failed to load groups");
    }
  }

  async function createGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!groupName.trim()) return toast.error("Group name required");

    setCreatingGroup(true);
    try {
      const fd = new FormData();
      fd.append("name", groupName);
      fd.append("description", groupDesc);
      fd.append("isPublic", isPublic ? "true" : "false");
      fd.append("phone", phone as string);
      fd.append("eventId", selectedEvent);

      const res = await fetch("/api/photographer/groups", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Group created");
        setGroupName("");
        setGroupDesc("");
        setIsPublic(false);
        fetchGroups();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Group creation failed");
    } finally {
      setCreatingGroup(false);
    }
  }

  async function deleteGroup(groupId: string) {
    const ok = confirm(
      "Are you sure you want to delete this group? This cannot be undone."
    );
    if (!ok) return;

    try {
      const res = await fetch(
        `/api/photographer/groups?id=${groupId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Group deleted");
        fetchGroups();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete group");
    }
  }

  const currentEvent = events.find((e) => e._id === selectedEvent);

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8">
      {/* CREATE EVENT */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">
          Create Event
        </h2>

        <form onSubmit={createEvent} className="space-y-3">
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event name (Wedding, Farewell...)"
            className="w-full p-3 border rounded"
          />

          <textarea
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-3 border rounded"
          />

          <button
            disabled={creatingEvent}
            className="bg-[#1f6563] text-white px-4 py-2 rounded"
          >
            {creatingEvent ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>

      {/* EVENT SELECTOR */}
     {/* EVENT SELECTOR + DELETE */}
<div className="bg-white p-6 rounded-xl shadow space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold text-[#1f6563]">
        Selected Event
      </h3>
      <p className="text-sm text-gray-500">
        {currentEvent?.description || "No description"}
      </p>
    </div>

    <select
      value={selectedEvent}
      onChange={(e) => setSelectedEvent(e.target.value)}
      className="p-3 border rounded min-w-[220px]"
    >
      {events.map((e) => (
        <option key={e._id} value={e._id}>
          {e.name}
        </option>
      ))}
    </select>
  </div>

  {/* ⚠️ WARNING + DELETE EVENT */}
  <div className="flex items-center justify-between bg-red-50 border border-red-200 p-4 rounded-lg">
    <p className="text-sm text-red-700">
      ⚠️ Deleting this event will permanently delete{" "}
      <strong>all groups and photos</strong> inside it.
    </p>

    <button
      onClick={async () => {
        const ok = confirm(
          `Are you sure you want to delete "${currentEvent?.name}"?\n\nAll groups inside this event will be permanently deleted.`
        );
        if (!ok) return;

        try {
          const res = await fetch(
            `/api/photographer/events?id=${selectedEvent}`,
            { method: "DELETE" }
          );
          const data = await res.json();

          if (res.ok) {
            toast.success("Event deleted");
            setSelectedEvent("");
            fetchEvents(); // refresh events & groups
          } else {
            toast.error(data.message || "Failed to delete event");
          }
        } catch {
          toast.error("Event deletion failed");
        }
      }}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
    >
      Delete Event
    </button>
  </div>
</div>


      {/* CREATE GROUP */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold text-[#1f6563] mb-4">
          Create Group in{" "}
          <span className="text-[#15514f]">{currentEvent?.name}</span>
        </h3>

        <form onSubmit={createGroup} className="space-y-3">
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name (Haldi, Reception...)"
            className="w-full p-3 border rounded"
          />

          <textarea
            value={groupDesc}
            onChange={(e) => setGroupDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-3 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public Group
          </label>

          <button
            disabled={creatingGroup}
            className="bg-[#1f6563] text-white px-4 py-2 rounded"
          >
            {creatingGroup ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>

      {/* GROUP LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold text-[#1f6563] mb-6">
          Groups in {currentEvent?.name}
        </h3>

        {groups.length === 0 ? (
          <p className="text-gray-500">No groups in this event.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((g) => (
              <div key={g._id} className="border rounded-lg overflow-hidden">
                <img
                  src={g.coverPhoto || "/default-cover.png"}
                  className="h-40 w-full object-cover"
                />

                <div className="p-4 space-y-2">
                  {/* EVENT BADGE */}
                  <span className="inline-block text-xs bg-[#e0f2f1] text-[#1f6563] px-2 py-1 rounded">
                     {currentEvent?.name}
                  </span>

                  <h4 className="font-semibold text-[#1f6563]">
                    {g.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {g.description || "No description"}
                  </p>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{g.photos?.length || 0} Photos</span>
                    <span>{g.members?.length || 0} Members</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        (window.location.href =
                          `/dashboard/photographer/group/${g._id}`)
                      }
                      className="flex-1 bg-[#1f6563] text-white px-3 py-1 rounded text-sm"
                    >
                      Manage
                    </button>

                    <button
                      onClick={() => deleteGroup(g._id)}
                      className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
