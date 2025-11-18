"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");

  const handleLogin = async () => {
    if (mobile.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // ⭐ ALWAYS STORE BOTH VALUES
        localStorage.setItem("verifiedMobile", data.phone);
        localStorage.setItem("userId", data.userId);

        toast.success(`Welcome ${data.name}!`);

        setTimeout(() => {
          if (data.role === "viewer") {
            router.push("/dashboard/user");
          } else if (data.role === "photographer") {
            router.push("/dashboard/photographer");
          } else if (data.role === "superadmin") {
            router.push("/admin/dashboard");
          }
        }, 600);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">
          🔐 Login
        </h1>

        <input
          type="number"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-center outline-none focus:ring-2 focus:ring-[#1f6563]"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#1f6563] text-white py-3 rounded-lg font-medium hover:bg-[#15514f] transition"
        >
          Login
        </button>

        <p className="text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-[#1f6563] font-semibold cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
