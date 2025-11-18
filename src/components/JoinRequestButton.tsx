"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function JoinRequestButton({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    const phone =
      typeof window !== "undefined"
        ? localStorage.getItem("verifiedMobile")
        : null;

    if (!phone) {
      return toast.error("Please login to request");
    }

    const message = prompt("Message for photographer (optional):") || "";

    setLoading(true);
    toast.loading("Sending request...", { id: "joinRequest" });

    try {
      const res = await fetch("/api/groups/join-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, phone, message }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Request sent successfully!", { id: "joinRequest" });
      } else {
        toast.error(data.message || "Failed to send request", {
          id: "joinRequest",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending request", { id: "joinRequest" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={sendRequest}
      className="bg-[#1f6563] text-white px-4 py-2 rounded hover:bg-[#15514f]"
      disabled={loading}
    >
      {loading ? "Sending..." : "Request to Join"}
    </button>
  );
}
