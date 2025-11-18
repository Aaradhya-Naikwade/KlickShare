"use client";

import { LogOut, User, Search, Users, Download, Bell } from "lucide-react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { name: "My Profile", icon: <User size={20} />, tab: "profile" },
        { name: "Smart Face Search", icon: <Search size={20} />, tab: "search" },
        { name: "Explore Groups", icon: <Search size={20} />, tab: "explore" },
        { name: "Joined Groups", icon: <Users size={20} />, tab: "groups" },
        { name: "Downloaded", icon: <Download size={20} />, tab: "downloads" },
        { name: "Notifications", icon: <Bell size={20} />, tab: "notifications" },
    ];

    return (
        <div className="w-64 bg-[#1f6563] text-white h-screen fixed left-0 top-0 flex flex-col justify-between z-50">
            {/* Logo Section */}
            <div>
                <h1 className="text-2xl font-bold text-center py-6 border-b border-teal-600">
                    Klickshare
                </h1>

                {/* Menu Items */}
                <ul className="mt-4">
                    {menuItems.map((item) => (
                        <li
                            key={item.tab}
                            onClick={() => setActiveTab(item.tab)}
                            className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#2a8a86] transition ${
                                activeTab === item.tab ? "bg-[#2a8a86]" : ""
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Logout */}
            <div
                onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                }}
                className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-[#2a8a86] transition border-t border-teal-600"
            >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </div>
        </div>
    );
}
