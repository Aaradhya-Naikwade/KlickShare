// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// export default function AuthPage() {
//   const router = useRouter();
//   const [mobile, setMobile] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);

//   const handleSendOtp = async () => {
//     if (mobile.trim().length !== 10) {
//       toast.error("Enter a valid 10-digit mobile number");
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone: mobile }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         toast.success(data.message);
//         setIsOtpSent(true);
//       } else {
//         toast.error(data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Server error");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp || otp.length !== 4) {
//       toast.error("Enter 4-digit OTP");
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone: mobile, otp }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         // Check if user is already registered
//         const userRes = await fetch(`/api/auth/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone: mobile }),
//         });

//         const userData = await userRes.json();
//         if (userRes.ok && userData.role) {
//           // Already registered → go to dashboard
//           localStorage.setItem("userId", userData.userId);
//           localStorage.setItem("verifiedMobile", userData.phone);

//           toast.success("Login successful!");

//           if (userData.role === "viewer") router.push("/dashboard/user");
//           else if (userData.role === "photographer") router.push("/dashboard/photographer");
//           else router.push("/admin/dashboard");
//         } else {
//           // New user → go to select role
//           sessionStorage.setItem("verifiedMobile", mobile);
//           router.push("/signup/select-role");
//         }
//       } else {
//         toast.error(data.message || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">
//         <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">🔐 Login / Signup</h1>

//         {!isOtpSent && (
//           <>
//             <input
//               type="number"
//               placeholder="Enter mobile number"
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               className="w-full border p-3 rounded-lg mb-4 text-center"
//             />
//             <button
//               onClick={handleSendOtp}
//               className="w-full bg-[#1f6563] text-white py-3 rounded-lg hover:bg-[#15514f] transition"
//             >
//               Send OTP
//             </button>
//           </>
//         )}

//         {isOtpSent && (
//           <>
//             <input
//               type="number"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border p-3 rounded-lg mb-4 text-center"
//             />
//             <button
//               onClick={handleVerifyOtp}
//               className="w-full bg-[#1f6563] text-white py-3 rounded-lg hover:bg-[#15514f] transition"
//             >
//               Verify OTP
//             </button>
//             <p className="text-sm text-gray-500 mt-4">
//               Didn’t receive OTP?{" "}
//               <span
//                 className="text-[#1f6563] font-semibold cursor-pointer"
//                 onClick={handleSendOtp}
//               >
//                 Resend
//               </span>
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }











"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // ----------------------------
  // 1️⃣ Redirect already logged-in users
  // ----------------------------
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const verifiedMobile = localStorage.getItem("verifiedMobile");

    if (userId && verifiedMobile) {
      // Fetch role from backend
      fetch(`/api/auth/profile?phone=${verifiedMobile}`)
        .then(res => res.json())
        .then(data => {
          if (data.user?.role === "viewer") router.replace("/dashboard/user");
          else if (data.user?.role === "photographer") router.replace("/dashboard/photographer");
          else router.replace("/admin/dashboard");
        })
        .catch(err => console.error(err));
    }

    // Optional: prevent back button cache issues
    window.history.replaceState({}, document.title);
  }, [router]);

  // ----------------------------
  // 2️⃣ Send OTP
  // ----------------------------
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

  // ----------------------------
  // 3️⃣ Verify OTP
  // ----------------------------
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
      if (res.ok) {
        // Check if user already exists
        const userRes = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: mobile }),
        });

        const userData = await userRes.json();
        if (userRes.ok && userData.role) {
          // Already registered → go to dashboard
          localStorage.setItem("userId", userData.userId);
          localStorage.setItem("verifiedMobile", userData.phone);

          toast.success("Login successful!");

          if (userData.role === "viewer") router.replace("/dashboard/user");
          else if (userData.role === "photographer") router.replace("/dashboard/photographer");
          else router.replace("/admin/dashboard");
        } else {
          // New user → go to select role
          sessionStorage.setItem("verifiedMobile", mobile);
          router.replace("/signup/select-role");
        }
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // ----------------------------
  // 4️⃣ Render
  // ----------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">🔐 Login / Signup</h1>

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
      </div>
    </div>
  );
}
