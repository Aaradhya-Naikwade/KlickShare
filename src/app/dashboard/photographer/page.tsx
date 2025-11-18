"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/photographer/Sidebar";

// Placeholder components (we'll implement each in detail later)
import MyProfile from "@/components/photographer/MyProfile";
import MyGroups from "@/components/photographer/MyGroups";
import NotificationsPanel from "@/components/NotificationsPanel";
import JoinRequests from "@/components/photographer/JoinRequests";





function MyGroupsTab() {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">My Groups</h2>
            <p className="text-gray-600">Create and manage your groups (create / edit / delete).</p>
        </div>
    );
}

function JoinRequestsTab() {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">Join Requests</h2>
            <p className="text-gray-600">Approve or reject viewer requests to join your groups.</p>
        </div>
    );
}

function UploadPhotosTab() {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">Upload Photos</h2>
            <p className="text-gray-600">Upload photos to a selected group.</p>
        </div>
    );
}

function MembersTab() {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">Members</h2>
            <p className="text-gray-600">See members of each group and remove if needed.</p>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-[#1f6563] mb-4">Notifications</h2>
            <p className="text-gray-600">All join requests and activity messages will appear here.</p>
        </div>
    );
}

export default function PhotographerDashboard() {
    const [activeTab, setActiveTab] = useState<string>("profile");
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
        const mobile =
            typeof window !== "undefined" ? localStorage.getItem("verifiedMobile") : null;
        if (mobile) setIsAuthenticated(true);
    }, []);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#e0f2f1] text-[#1f6563]">
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
        <div className="flex min-h-screen bg-[#e0f2f1]">
            {/* Sidebar fixed left */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* spacer for fixed sidebar */}
            <div className="w-64" />

            {/* Main content */}
            <main className="flex-1 p-6">
                {activeTab === "profile" && <MyProfile />}
                {activeTab === "groups" && <MyGroups />}
                {activeTab === "requests" && <JoinRequests />}
                {activeTab === "upload" && <UploadPhotosTab />}
                {activeTab === "members" && <MembersTab />}
                {activeTab === "notifications" && <NotificationsPanel />}
            </main>
        </div>
    );
}
