// "use client";

// import { LogOut, User, Layers, Inbox, Upload, Users, Bell } from "lucide-react";

// interface SidebarProps {
//   activeTab: string;
//   setActiveTab: (tab: string) => void;
// }

// export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
//   const menuItems = [
//     { name: "My Profile", icon: <User size={18} />, tab: "profile" },
//     { name: "My Groups", icon: <Layers size={18} />, tab: "groups" },
//     { name: "Join Requests", icon: <Inbox size={18} />, tab: "requests" },
//     // { name: "Upload Photos", icon: <Upload size={18} />, tab: "upload" },
//     { name: "Members", icon: <Users size={18} />, tab: "members" },
//     { name: "Notifications", icon: <Bell size={18} />, tab: "notifications" },
//   ];

//   return (
//     <aside className="w-64 bg-[#1f6563] text-white min-h-screen flex flex-col justify-between fixed left-0 top-0 z-50">
//       <div>
//         <div className="py-6 px-4 border-b border-teal-600">
//           <h1 className="text-xl font-bold text-center">Klickshare</h1>
//         </div>

//         <nav className="mt-4">
//           <ul>
//             {menuItems.map((item) => (
//               <li
//                 key={item.tab}
//                 onClick={() => setActiveTab(item.tab)}
//                 className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-[#2a8a86] transition ${
//                   activeTab === item.tab ? "bg-[#2a8a86]" : ""
//                 }`}
//               >
//                 {item.icon}
//                 <span className="font-medium">{item.name}</span>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>

//       <div
//         onClick={() => {
//           // clear only auth key(s) — safer
//           localStorage.removeItem("verifiedMobile");
//           // if you used any other keys, remove them too or use localStorage.clear()
//           window.location.href = "/login";
//         }}
//         className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-[#2a8a86] transition border-t border-teal-600"
//       >
//         <LogOut size={18} />
//         <span className="font-medium">Logout</span>
//       </div>
//     </aside>
//   );
// }











"use client";

import { LogOut, User, Layers, Inbox, Users, Bell } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { name: "My Profile", icon: <User size={18} />, tab: "profile" },
    { name: "My Groups", icon: <Layers size={18} />, tab: "groups" },
    { name: "Join Requests", icon: <Inbox size={18} />, tab: "requests" },
    // { name: "Upload Photos", icon: <Upload size={18} />, tab: "upload" },
    { name: "Members", icon: <Users size={18} />, tab: "members" },
    { name: "Notifications", icon: <Bell size={18} />, tab: "notifications" },
  ];

  const handleLogout = () => {
    // Clear all auth info
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("verifiedMobile");

    // Redirect to unified auth page
    window.location.replace("/auth"); // replace prevents back button loops
  };

  return (
    <aside className="w-64 bg-[#1f6563] text-white min-h-screen flex flex-col justify-between fixed left-0 top-0 z-50">
      <div>
        <div className="py-6 px-4 border-b border-teal-600">
          <h1 className="text-xl font-bold text-center">Klickshare</h1>
        </div>

        <nav className="mt-4">
          <ul>
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
        </nav>
      </div>

      <div
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-[#2a8a86] transition border-t border-teal-600"
      >
        <LogOut size={18} />
        <span className="font-medium">Logout</span>
      </div>
    </aside>
  );
}
