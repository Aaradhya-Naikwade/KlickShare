"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/sidebar.module.css";
import { useEffect, useState } from "react";

interface SidebarProps {
  title: string;
  links: { name: string; path: string; icon?: React.ReactNode }[];
}

export default function Sidebar({ title, links }: SidebarProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications
  useEffect(() => {
    async function loadUnread() {
      try {
        const phone = localStorage.getItem("verifiedMobile");

        if (!phone) return;

        // Get user _id
        const userRes = await fetch(`/api/auth/profile?phone=${phone}`);
        const userData = await userRes.json();

        const userId =
          userData?.user?._id || localStorage.getItem("userId");

        if (!userId) return;

        // Get notifications
        const res = 
        await fetch(`/api/notifications?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.notifications) {
          const unread = data.notifications.filter(
            (n: any) => !n.read
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Unread load error:", err);
      }
    }

    loadUnread();
  }, []);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>{title}</h2>

      <nav className={styles.nav}>
        {links.map((link) => {
          const active = pathname === link.path;

          const isNotificationTab =
            link.name.toLowerCase() === "notifications" ||
            link.name.toLowerCase() === "notification";

          return (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.link} ${active ? styles.active : ""}`}
            >
              <div className={styles.row}>
                {link.icon ? (
                  <span className={styles.icon}>{link.icon}</span>
                ) : (
                  <span className={styles.circle} />
                )}

                <span className={styles.linkText}>{link.name}</span>

                {/* NOTIFICATION BADGE */}
                {isNotificationTab && unreadCount > 0 && (
                  <span
                    className={styles.badge}
                    style={{
                      marginLeft: "auto",
                      background: "#e63946",
                      color: "white",
                      fontSize: "12px",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
