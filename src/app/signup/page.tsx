"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);

  // Step 1: Generate Demo OTP
  const handleGetOtp = (): void => {
    if (mobileNumber.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const demoOtp = "1234"; // Demo OTP
    setGeneratedOtp(demoOtp);
    setIsOtpSent(true);

    toast.success("OTP sent successfully!");
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (): void => {
    if (otp === generatedOtp) {
      toast.success("Mobile number verified!");

      // Store number for next step
      sessionStorage.setItem("verifiedMobile", mobileNumber);

      router.push("/signup/select-role");
    } else {
      toast.error("Incorrect OTP, please try again");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">
          📱 Sign Up with Mobile
        </h1>

        {/* Step 1: Mobile Number */}
        {!isOtpSent && (
          <>
            <input
              type="number"
              placeholder="Enter your mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-center outline-none focus:ring-2 focus:ring-[#1f6563]"
            />
            <button
              onClick={handleGetOtp}
              className="w-full bg-[#1f6563] text-white py-3 rounded-lg font-medium hover:bg-[#15514f] transition"
            >
              Get OTP
            </button>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {isOtpSent && (
          <div className="mt-6">
            <p className="text-gray-600 mb-2">
              Your OTP is{" "}
              <span className="font-semibold text-[#1f6563]">
                {generatedOtp}
              </span>{" "}
              (Demo)
            </p>

            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-center outline-none focus:ring-2 focus:ring-[#1f6563]"
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#1f6563] text-white py-3 rounded-lg font-medium hover:bg-[#15514f] transition"
            >
              Verify OTP
            </button>

            <p className="text-sm text-gray-500 mt-4">
              Didn’t receive OTP?{" "}
              <span
                className="text-[#1f6563] font-medium cursor-pointer"
                onClick={handleGetOtp}
              >
                Resend
              </span>
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6">
          Already registered?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-[#1f6563] font-semibold cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
