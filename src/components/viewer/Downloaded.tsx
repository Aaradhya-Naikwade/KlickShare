"use client";

import { useEffect, useState } from "react";

export default function DownloadedPhotos() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const phone = localStorage.getItem("verifiedMobile");
      if (!phone) return;

      const res = await fetch(`/api/auth/profile?phone=${phone}`);
      const data = await res.json();

      if (res.ok && data.user) {
        setUserId(data.user._id);
        fetchDownloads(data.user._id);
      }
    }
    loadUser();
  }, []);

  async function fetchDownloads(uid: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/downloads?userId=${uid}`);
      const data = await res.json();
      if (res.ok) {
        setDownloads(data.downloads);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold text-[#1f6563]">
        Downloaded Photos
      </h2>

      {downloads.length === 0 ? (
        <p className="text-gray-500">No photos downloaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {downloads.map((d) => (
            <div key={d._id} className="rounded overflow-hidden shadow">
              <img
                src={d.photo}
                className="w-full h-40 object-cover"
                alt="Downloaded"
              />
              <p className="text-sm text-center py-2 text-gray-600 bg-gray-100">
                {d.group?.name || "Unknown Group"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
