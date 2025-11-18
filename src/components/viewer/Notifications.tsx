"use client";

import { useEffect, useState } from "react";

interface NotificationType {
  _id: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user and then fetch notifications
  useEffect(() => {
    async function loadUser() {
      const phone = localStorage.getItem("verifiedMobile");
      if (!phone) return;

      const res = await fetch(`/api/auth/profile?phone=${phone}`);
      const data = await res.json();

      if (res.ok && data.user) {
        setUserId(data.user._id);
        fetchNotifications(data.user._id);
      }
    }

    loadUser();
  }, []);

  // Fetch notifications
  async function fetchNotifications(uid: string) {
    try {
      const res = await fetch(`/api/notifications?userId=${uid}`);
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
    setLoading(false);
  }

  // Mark notification as read
  async function markAsRead(notificationId: string) {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  }

  // Delete notification
  async function deleteNotification(id: string) {
    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  if (loading) {
    return <p className="p-6 text-[#1f6563]">Loading notifications...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-semibold text-[#1f6563] mb-4 flex items-center justify-between">
        Notifications
        <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">
          {notifications.filter((n) => !n.read).length} Unread
        </span>
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications right now.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={async () => {
                await markAsRead(n._id);

                if (n.link) window.location.href = n.link;
              }}
              className={`p-4 border rounded-xl transition cursor-pointer relative hover:bg-gray-50 ${
                !n.read ? "border-blue-500" : "border-gray-300"
              }`}
            >
              {/* Unread dot */}
              {!n.read && (
                <span className="absolute right-3 top-3 w-3 h-3 bg-blue-500 rounded-full"></span>
              )}

              <p className="font-semibold text-[#1f6563]">{n.title}</p>
              <p className="text-sm text-gray-600">{n.body}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n._id);
                }}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
