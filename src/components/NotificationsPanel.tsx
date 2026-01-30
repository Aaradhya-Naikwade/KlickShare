"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const phone =
    typeof window !== "undefined"
      ? localStorage.getItem("verifiedMobile")
      : null;

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!phone) {
        const uid =
          typeof window !== "undefined"
            ? localStorage.getItem("userId")
            : null;
        if (uid) {
          setUserId(uid);
          fetchNotifications(uid);
        }
        return;
      }

      try {
        const res = await fetch(`/api/auth/profile?phone=${phone}`);
        const data = await res.json();

        if (res.ok && data.user) {
          setUserId(data.user._id);
          fetchNotifications(data.user._id);
        } else {
          const uid = localStorage.getItem("userId");
          if (uid) {
            setUserId(uid);
            fetchNotifications(uid);
          }
        }
      } catch (err) {
        console.error("profile fetch error", err);
      }
    }

    init();
  }, []);

  async function fetchNotifications(uid: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?userId=${uid}`);
      const data = await res.json();

      if (res.ok) {
        setNotifications(data.notifications || []);
      } else {
        console.warn("Failed to fetch notifications", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      if (userId) fetchNotifications(userId);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteNote(id: string) {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      if (userId) fetchNotifications(userId);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="p-4">Loading notifications...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-[#1f6563] mb-3">
        Notifications
      </h3>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-3 rounded border ${
                n.read ? "bg-gray-50" : "bg-[#e8f6f4]"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-sm text-gray-600">{n.body}</div>

                  {n.link && (
                    <div className="mt-2">
                      {/* FIXED LINK — No <a> tag inside */}
                      <Link
                        href={n.link}
                        className="text-sm text-[#1f6563] underline"
                      >
                        Open
                      </Link>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n._id)}
                        className="text-xs text-[#1f6563]"
                      >
                        Mark read
                      </button>
                    )}

                    <button
                      onClick={() => deleteNote(n._id)}
                      className="text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
