
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ViewerSignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const verifiedMobile = sessionStorage.getItem("verifiedMobile");
    if (!verifiedMobile) {
      toast.error("Verify mobile first");
      router.push("/signup");
    } else setMobile(verifiedMobile);
  }, [router]);

  const handleSignup = async () => {
    if (!name || !email) {
      toast.error("Fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: mobile, role: "viewer" }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("verifiedMobile", data.user.phone);
        toast.success("Signup successful!");
        router.push("/dashboard/user");
      } else toast.error(data.message || "Signup failed");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">👤 Viewer Signup</h1>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 text-center"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 text-center"
        />
        <input
          type="text"
          value={mobile}
          disabled
          className="w-full border p-3 rounded-lg mb-4 text-center bg-gray-100"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-[#1f6563] text-white py-3 rounded-lg hover:bg-[#15514f] transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
