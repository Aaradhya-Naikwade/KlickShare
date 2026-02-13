// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// interface UserData {
//   _id?: string;
//   name: string;
//   email: string;
//   phone: string;
//   role: string;
// }

// export default function Profile() {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [form, setForm] = useState({ name: "", email: "" });
//   const [loading, setLoading] = useState(true);

//   // ---------------------------------------------
//   // Fetch User (Corrected)
//   // ---------------------------------------------
//   useEffect(() => {
//     const userId =
//       typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//     const phone =
//       typeof window !== "undefined" ? localStorage.getItem("verifiedMobile") : null;

//     if (!userId && !phone) {
//       toast.error("User not logged in!");
//       return;
//     }

//     async function fetchUser() {
//       try {
//         const url = userId
//           ? `/api/user?userId=${userId}`
//           : `/api/user?phone=${phone}`;

//         const res = await fetch(url);
//         const data = await res.json();

//         if (res.ok && data.user) {
//           setUser(data.user);
//           setForm({
//             name: data.user.name || "",
//             email: data.user.email || "",
//           });
//         } else {
//           toast.error(data.message || "Failed to load profile");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//   }, []);

//   // ---------------------------------------------
//   // Save Updated Profile
//   // ---------------------------------------------
//   const handleSave = async () => {
//     if (!user) return;

//     try {
//       const res = await fetch("/api/user/update", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: user._id,
//           name: form.name,
//           email: form.email,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success(data.message || "Profile updated successfully!");
//         setUser(data.user);
//         setIsEditing(false);
//       } else {
//         toast.error(data.message || "Update failed");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     }
//   };


//   if (loading)
//     return <p className="p-6 text-[#1f6563]">Loading profile...</p>;

//   if (!user)
//     return <p className="p-6 text-red-500">User not found</p>;

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-semibold text-[#1f6563] mb-6">
//         My Profile 👤
//       </h2>

//       {/* Name */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Full Name
//         </label>
//         <input
//           type="text"
//           value={isEditing ? form.name : user.name}
//           disabled={!isEditing}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className={`w-full p-3 border rounded-lg ${isEditing ? "bg-white" : "bg-gray-100"
//             }`}
//         />
//       </div>

//       {/* Email */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Email Address
//         </label>
//         <input
//           type="email"
//           value={isEditing ? form.email : user.email}
//           disabled={!isEditing}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className={`w-full p-3 border rounded-lg ${isEditing ? "bg-white" : "bg-gray-100"
//             }`}
//         />
//       </div>

//       {/* Mobile */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Mobile Number
//         </label>
//         <input
//           type="text"
//           value={user.phone}
//           disabled
//           className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
//         />
//       </div>

//       {/* Role */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Role
//         </label>
//         <input
//           type="text"
//           value={user.role}
//           disabled
//           className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
//         />
//       </div>

//       {/* Buttons */}
//       {isEditing ? (
//         <div className="flex gap-3">
//           <button
//             onClick={handleSave}
//             className="bg-[#1f6563] text-white px-4 py-2 rounded-lg hover:bg-[#15514f] transition"
//           >
//             Save Changes
//           </button>

//           <button
//             onClick={() => {
//               setIsEditing(false);
//               setForm({ name: user.name, email: user.email });
//             }}
//             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <button
//           onClick={() => setIsEditing(true)}
//           className="bg-[#1f6563] text-white px-6 py-2 rounded-lg hover:bg-[#15514f] transition"
//         >
//           Edit Profile
//         </button>
//       )}
//     </div>
//   );
// }









// D:\KlickShare-main\src/components/viewer/Profile.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";

interface UserData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profilePhoto?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (!userId) {
      toast.error("User not logged in!");
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/user?userId=${userId}`);
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          if (!data.user.profilePhoto) setShowCamera(true);
        } else {
          toast.error("Failed to fetch profile");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error(err);
      toast.error("Cannot access camera");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhotoPreview(dataUrl);
    setShowCamera(false);
    sendPhotoToServer(dataUrl);
  };

  const sendPhotoToServer = async (dataUrl: string) => {
    if (!user) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const fd = new FormData();
      fd.append("file", new File([blob], "profile.jpg"));
      fd.append("userId", user._id || "");

      const res = await fetch("/api/face-search/profile", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile photo uploaded & face searched!");
        setUser({ ...user, profilePhoto: data.photoUrl });
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">User not found</p>
      </div>
    );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-12 bg-gradient-to-b from-[#e0f7f6] to-white">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 space-y-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-[#1f6563] text-center">
          My Profile
        </h2>

        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          {photoPreview || user.profilePhoto ? (
            <div className="relative group">
              <img
                src={photoPreview || user.profilePhoto}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-[#1f6563] shadow-lg"
              />
              {!photoPreview && !user.profilePhoto && (
                <span className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-semibold transition">
                  Click to Capture
                </span>
              )}
            </div>
          ) : (
            <div
              onClick={() => setShowCamera(true)}
              className="w-36 h-36 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-[#1f6563] hover:text-[#1f6563] transition"
            >
              📸
            </div>
          )}
        </div>

        {/* Camera Popup */}
        {showCamera && (
          <div className="relative mt-4 border rounded-xl shadow-lg p-4 bg-gray-50 flex flex-col items-center space-y-4">
            <video
              ref={videoRef}
              className="w-72 h-48 rounded-lg border border-gray-300"
              autoPlay
            />
            <div className="flex gap-3">
              <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-[#1f6563] text-white rounded-lg hover:bg-[#15514f] transition shadow"
              >
                Capture
              </button>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow"
              >
                Start Camera
              </button>
              <button
                onClick={() => setShowCamera(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow"
              >
                Cancel
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* User Info */}
        <div className="grid grid-cols-1 gap-3 text-gray-700">
          <div className="flex justify-between p-3 bg-[#f3fbfa] rounded-xl shadow-sm">
            <span className="font-semibold">Name:</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between p-3 bg-[#f9f9f9] rounded-xl shadow-sm">
            <span className="font-semibold">Email:</span>
            <span>{user.email || "-"}</span>
          </div>
          <div className="flex justify-between p-3 bg-[#f3fbfa] rounded-xl shadow-sm">
            <span className="font-semibold">Phone:</span>
            <span>{user.phone || "-"}</span>
          </div>
          <div className="flex justify-between p-3 bg-[#f9f9f9] rounded-xl shadow-sm">
            <span className="font-semibold">Role:</span>
            <span>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
