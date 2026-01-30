"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface JoinRequest {
  _id: string;
  status: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  group: {
    _id: string;
    name: string;
    coverPhoto?: string;
  };
}

export default function JoinRequests() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [photographerId, setPhotographerId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const phone = localStorage.getItem("verifiedMobile");
      if (!phone) return;

      const res = await fetch(`/api/auth/profile?phone=${phone}`);
      const data = await res.json();

      if (res.ok && data.user) {
        setPhotographerId(data.user._id);
        fetchRequests(data.user._id);
      }
    }
    loadUser();
  }, []);

  async function fetchRequests(pid: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/groups/join-request?photographerId=${pid}&status=pending`
      );
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Fetch requests error:", err);
      toast.error("Failed to load requests");
    }
    setLoading(false);
  }

  async function handleAction(requestId: string, action: "approve" | "reject") {
    if (!photographerId) return;

    try {
      const res = await fetch("/api/groups/join-request", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action,
          photographerId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Request ${action}d`);
        fetchRequests(photographerId);
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return <div className="p-6 text-[#1f6563]">Loading join requests...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">
        Join Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending join requests.</p>
      ) : (
        <div className="space-y-5">
          {requests.map((r) => (
            <div
              key={r._id}
              className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={r.group?.coverPhoto || "/default-cover.png"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold text-[#1f6563]">
                    {r.user?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-600">{r.user?.phone}</p>

                  <p className="text-sm text-gray-700 mt-1">
                    Requested for:{" "}
                    <span className="font-medium">{r.group?.name}</span>
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(r._id, "approve")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(r._id, "reject")}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
