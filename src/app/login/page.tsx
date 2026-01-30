
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (mobile.trim().length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setIsOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      toast.error("Enter 4-digit OTP");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, otp }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("userId", data.user.userId);
        localStorage.setItem("verifiedMobile", data.user.phone);

        toast.success("Login successful!");

        if (data.user.role === "viewer") router.push("/dashboard/user");
        else if (data.user.role === "photographer") router.push("/dashboard/photographer");
        else router.push("/admin/dashboard");
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">
          🔐 Login
        </h1>

        {!isOtpSent && (
          <>
            <input
              type="number"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 text-center"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-[#1f6563] text-white py-3 rounded-lg hover:bg-[#15514f] transition"
            >
              Send OTP
            </button>
          </>
        )}

        {isOtpSent && (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 text-center"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#1f6563] text-white py-3 rounded-lg hover:bg-[#15514f] transition"
            >
              Verify OTP
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Didn’t receive OTP?{" "}
              <span
                className="text-[#1f6563] font-semibold cursor-pointer"
                onClick={handleSendOtp}
              >
                Resend
              </span>
            </p>
          </>
        )}

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
