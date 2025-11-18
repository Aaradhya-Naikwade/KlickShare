"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/viewer/Sidebar";
import Profile from "@/components/viewer/Profile";
import ExploreGroups from "@/components/viewer/ExploreGroups";
import Notifications from "@/components/viewer/Notifications";
import JoinedGroups from "@/components/viewer/JoinedGroups";
import DownloadedPhotos from "@/components/viewer/Downloaded";


export default function ViewerDashboard() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isClient, setIsClient] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const mobile =
            typeof window !== "undefined"
                ? localStorage.getItem("verifiedMobile")
                : null;

        if (mobile) {
            setIsAuthenticated(true);
        }
    }, []);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#e0f2f1] text-[#1f6563] font-medium">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    return (
        <div className="flex bg-[#e0f2f1] min-h-screen">
            {/* Sidebar FIXED */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content WITH LEFT PADDING */}
            <main className="flex-1 overflow-y-auto p-6 ml-64">
                {activeTab === "profile" && <Profile />}
                {activeTab === "search" && <p>Smart Face Search</p>}
                {activeTab === "explore" && <ExploreGroups />}
                {activeTab === "groups" && <JoinedGroups />}
                {activeTab === "downloads" && <DownloadedPhotos />}
                {activeTab === "notifications" && <Notifications />}
            </main>
        </div>
    );
}
