"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

// -------------------------------------------------------

interface Group {
  _id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  photos?: string[];
  createdBy?: { _id?: string; name?: string };
}

// -------------------------------------------------------

export default function UserGroupDetailsPage() {
  const params = useParams();
  const groupId = (params as any)?.id;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const [joinStatus, setJoinStatus] = useState<
    "none" | "pending" | "joined" | "rejected"
  >("none");
 
  const [userId, setUserId] = useState<string | null>(null);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // -------------------------------------------------------
  // LOAD USER
  // -------------------------------------------------------
  useEffect(() => {
    const phone = localStorage.getItem("verifiedMobile");
    if (!phone) return;

    async function loadUser() {
      try {
        const res = await fetch(`/api/auth/profile?phone=${phone}`);
        const data = await res.json();

        if (res.ok && data.user) {
          setUserId(data.user._id);
        }
      } catch (err) {
        console.error("profile error", err);
      }
    }
    
    loadUser();
  }, []);

  // -------------------------------------------------------
  // FETCH GROUP DETAILS
  // -------------------------------------------------------
  useEffect(() => {
    if (!groupId) return;
    fetchGroup();
  }, [groupId]);

  async function fetchGroup() {
    setLoading(true);

    try {
      const res = await fetch(`/api/groups?id=${groupId}`);
      const data = await res.json();

      if (res.ok) setGroup(data.group);
      else toast.error(data.message);
    } catch (err) {
      console.error("error fetching group", err);
      toast.error("Failed to load group");
    }

    setLoading(false);
  }

  // -------------------------------------------------------
  // CHECK JOIN STATUS (AFTER USER ID IS LOADED)
  // -------------------------------------------------------
  useEffect(() => {
    if (groupId && userId) {
      checkJoinStatus();
    }
  }, [groupId, userId]);

  async function checkJoinStatus() {
    try {
      const res = await fetch(
        `/api/groups/join-request/status?groupId=${groupId}&userId=${userId}`
      );
      const data = await res.json();

      if (res.ok && data.status) {
        setJoinStatus(data.status);
      }
    } catch (err) {
      console.error("check status error", err);
    }
  }

  // -------------------------------------------------------
  // SEND JOIN REQUEST
  // -------------------------------------------------------
  async function sendJoinRequest() {
    const phone = localStorage.getItem("verifiedMobile");
    if (!phone) {
      toast.error("Please login again");
      return;
    }

    try {
      const res = await fetch("/api/groups/join-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, phone }),
      });

      const data = await res.json();

      toast.success(data.message || "Request sent");

      // Force refresh status
      setTimeout(() => {
        checkJoinStatus();
      }, 300);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  // -------------------------------------------------------
  // JOIN BUTTON UI
  // -------------------------------------------------------
  function getJoinButton() {
    if (joinStatus === "joined") {
      return (
        <button className="bg-green-600 text-white py-2 px-4 rounded">
          Joined
        </button>
      );
    }

    if (joinStatus === "pending") {
      return (
        <button
          disabled
          className="bg-yellow-500 text-white py-2 px-4 rounded opacity-70"
        >
          Pending Approval
        </button>
      );
    }

    if (joinStatus === "rejected") {
      return (
        <button className="bg-red-600 text-white py-2 px-4 rounded">
          Request Rejected
        </button>
      );
    }

    return (
      <button
        onClick={sendJoinRequest}
        className="bg-[#1f6563] text-white py-3 px-6 rounded hover:bg-[#15514f]"
      >
        Join Group
      </button>
    );
  }

  // -------------------------------------------------------
  // LIGHTBOX
  // -------------------------------------------------------
  function Lightbox() {
    if (lightboxIndex === null || !group?.photos) return null;

    const photo = group.photos[lightboxIndex];

    const goNext = () =>
      setLightboxIndex((prev) =>
        prev !== null ? (prev + 1) % group.photos!.length : null
      );

    const goPrev = () =>
      setLightboxIndex((prev) =>
        prev !== null
          ? (prev - 1 + group.photos!.length) % group.photos!.length
          : null
      );

    const downloadImage = () => {
      const a = document.createElement("a");
      a.href = photo;
      a.download = `photo-${lightboxIndex + 1}.jpg`;
      a.click();

      toast.success("Photo downloaded");
    };

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
        <button
          onClick={() => setLightboxIndex(null)}
          className="absolute top-5 right-5 text-white text-3xl"
        >
          ✕
        </button>

        <img
          src={photo}
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-xl"
        />

        <button onClick={goPrev} className="absolute left-5 text-white text-4xl">
          ‹
        </button>
        <button
          onClick={goNext}
          className="absolute right-5 text-white text-4xl"
        >
          ›
        </button>

        <button
          onClick={downloadImage}
          className="absolute bottom-6 bg-white text-black px-5 py-2 rounded shadow"
        >
          Download
        </button>
      </div>
    );
  }

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  if (loading || !group) return <div className="p-6">Loading group...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="w-full h-56 rounded-xl overflow-hidden shadow">
        <img
          src={group.coverPhoto || "/default-cover.png"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="text-3xl font-semibold text-[#1f6563]">{group.name}</h2>
        <p className="text-gray-600">{group.description || "No description"}</p>

        <p className="text-sm text-gray-700">
          <strong>Photographer:</strong> {group.createdBy?.name}
        </p>

        <p className="text-sm text-gray-700">
          <strong>Total Photos:</strong> {group.photos?.length || 0}
        </p>
      </div>

      {/* Join Button */}
      <div>{getJoinButton()}</div>

      {/* Photos */}
      {joinStatus === "joined" ? (
        <>
          <h3 className="text-xl font-semibold mb-3 text-[#1f6563]">
            Group Photos
          </h3>

          {group.photos?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.photos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className="rounded overflow-hidden shadow cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <img
                    src={photo}
                    loading="lazy"
                    className="w-full h-40 object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No photos yet.</p>
          )}
        </>
      ) : (
        <p className="text-gray-500 italic">
          Join the group to view the photos.
        </p>
      )}

      <Lightbox />
    </div>
  );
}
