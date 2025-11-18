"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function SelectRolePage() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);

  useEffect(() => {
    const verifiedMobile = sessionStorage.getItem("verifiedMobile");
    if (!verifiedMobile) {
      toast.error("Please verify your mobile number first");
      router.push("/signup");
    } else {
      setMobileNumber(verifiedMobile);
    }
  }, [router]);

  const handleRoleSelect = (role: string): void => {
    if (role === "viewer") {
      router.push("/signup/user");
    } else if (role === "photographer") {
      router.push("/signup/photographer");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e0f2f1]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-lg text-center">
        <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">
          Choose Your Account Type
        </h1>
        <p className="text-gray-600 mb-8">
          Verified mobile:{" "}
          <span className="font-medium text-[#1f6563]">{mobileNumber}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Viewer Card */}
          <div
            onClick={() => handleRoleSelect("viewer")}
            className="cursor-pointer bg-white border-2 border-transparent rounded-xl p-6 shadow-md hover:border-[#1f6563] hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <div className="text-5xl mb-3">👤</div>
            <h2 className="text-xl font-semibold text-[#1f6563]">Viewer</h2>
            <p className="text-gray-600 text-sm mt-2">
              Explore and download amazing photos.
            </p>
          </div>

          {/* Photographer Card */}
          <div
            onClick={() => handleRoleSelect("photographer")}
            className="cursor-pointer bg-white border-2 border-transparent rounded-xl p-6 shadow-md hover:border-[#1f6563] hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <div className="text-5xl mb-3">📸</div>
            <h2 className="text-xl font-semibold text-[#1f6563]">
              Photographer
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Upload, manage, and share your creative work.
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Not you?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-[#1f6563] font-semibold cursor-pointer"
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
}
