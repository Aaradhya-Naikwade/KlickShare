// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function PhotographerSignup() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [mobile, setMobile] = useState("");

//   useEffect(() => {
//     const verifiedMobile = sessionStorage.getItem("verifiedMobile");
//     if (!verifiedMobile) {
//       toast.error("Verify mobile first");
//       router.replace("/auth"); // history-safe redirect
//     } else setMobile(verifiedMobile);
//   }, [router]);

//   const handleSignup = async () => {
//     if (!name || !email || !companyName) {
//       toast.error("Fill all fields");
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           companyName,
//           phone: mobile,
//           role: "photographer",
//         }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         localStorage.setItem("userId", data.user._id);
//         localStorage.setItem("verifiedMobile", data.user.phone);
//         toast.success("Signup successful!");
//         router.replace("/dashboard/photographer"); // history-safe redirect
//       } else toast.error(data.message || "Signup failed");
//     } catch (err) {
//       console.error(err);
//       toast.error("Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">
//         <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">📸 Photographer Signup</h1>
//         <input
//           type="text"
//           placeholder="Full name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full border p-3 rounded-lg mb-4 text-center"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border p-3 rounded-lg mb-4 text-center"
//         />
//         <input
//           type="text"
//           placeholder="Company name"
//           value={companyName}
//           onChange={(e) => setCompanyName(e.target.value)}
//           className="w-full border p-3 rounded-lg mb-4 text-center"
//         />
//         <input
//           type="text"
//           value={mobile}
//           disabled
//           className="w-full border p-3 rounded-lg mb-4 text-center bg-gray-100"
//         />
//         <button
//           onClick={handleSignup}
//           className="w-full bg-[#1f6563] text-white py-3 rounded-lg hover:bg-[#15514f] transition"
//         >
//           Sign Up
//         </button>
//       </div>
//     </div>
//   );
// }







"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PhotographerSignup() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");



  // ============================
  // Load verified mobile
  // ============================
  useEffect(() => {

    const verifiedMobile = sessionStorage.getItem("verifiedMobile");

    if (!verifiedMobile) {

      toast.error("Verify mobile first");

      router.replace("/auth");

      return;
    }

    setMobile(verifiedMobile);

  }, [router]);



  // ============================
  // Signup
  // ============================
  const handleSignup = async () => {

    if (!name || !email || !companyName) {
      toast.error("Fill all fields");
      return;
    }

    try {

      const res = await fetch("/api/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: mobile,
          name: name,
          email: email,
          companyName: companyName,
          role: "photographer"
        })
      });


      const data = await res.json();


      // IMPORTANT FIX
      if (!data.success) {
        toast.error(data.message);
        return;
      }


      // SAVE USER
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("verifiedMobile", data.user.phone);


      toast.success("Signup successful");


      // REDIRECT
      router.replace("/dashboard/photographer");


    } catch (error) {

      console.error(error);

      toast.error("Server error");

    }
  };



  // ============================
  // UI
  // ============================
  return (

    <div className="min-h-screen flex items-center justify-center bg-[#e0f2f1]">

      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center">

        <h1 className="text-2xl font-semibold text-[#1f6563] mb-6">
          Photographer Signup
        </h1>


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
          placeholder="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
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
          className="w-full bg-[#1f6563] text-white py-3 rounded-lg"
        >
          Sign Up
        </button>

      </div>

    </div>
  );
}
