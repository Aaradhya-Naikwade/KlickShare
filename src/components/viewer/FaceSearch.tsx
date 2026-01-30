


// "use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// interface Match {
//   image_url: string;
//   similarity: number;
// }

// type GroupedResults = {
//   [groupId: string]: {
//     name: string;
//     matches: Match[];
//   };
// };

// export default function FaceSearch() {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState<GroupedResults>({});

//   const userId =
//     typeof window !== "undefined"
//       ? localStorage.getItem("userId")
//       : null;

//   useEffect(() => {
//     return () => {
//       if (preview) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0];
//     if (!f) return;

//     if (!f.type.startsWith("image/")) {
//       toast.error("Please upload an image");
//       return;
//     }

//     setFile(f);
//     setPreview(URL.createObjectURL(f));
//     setResults({});
//   }

//   async function searchFace() {
//     if (!file || !userId) {
//       toast.error("Missing image or user");
//       return;
//     }

//     if (loading) return;
//     setLoading(true);

//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       fd.append("userId", userId);

//       const res = await fetch("/api/face-search", {
//         method: "POST",
//         body: fd,
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error("Search failed");
//       }

//       setResults(data.groups || {});

//       if (!data.groups || Object.keys(data.groups).length === 0) {
//         toast("No matching photos found");
//       }
//     } catch (e: any) {
//       toast.error(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-[#1f6563]">
//         Smart Face Search
//       </h2>

//       {/* Upload */}
//       <div className="bg-white p-6 rounded-xl shadow space-y-4">
//         <input type="file" accept="image/*" onChange={handleFileChange} />

//         {preview && (
//           <img
//             src={preview}
//             alt="Preview"
//             className="w-40 h-40 object-cover rounded border"
//           />
//         )}

//         <button
//           onClick={searchFace}
//           disabled={loading}
//           className="bg-[#1f6563] text-white px-4 py-2 rounded disabled:opacity-60"
//         >
//           {loading ? "Searching..." : "Search Photos"}
//         </button>
//       </div>

//       {/* Group-wise Results */}
//       {Object.entries(results).map(([groupId, group]) => (
//         <div key={groupId} className="bg-white p-6 rounded-xl shadow">
//           <h3 className="text-lg font-semibold mb-4">
//             {group.name} ({group.matches.length})
//           </h3>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {group.matches.map((r, i) => (
//               <div key={r.image_url + i} className="border rounded">
//                 <img
//                   src={r.image_url}
//                   alt="Match"
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="text-xs p-2">
//                   {(r.similarity * 100).toFixed(1)}%
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }








"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Match {
  image_url: string;
  similarity: number;
}

type GroupedResults = {
  [groupId: string]: {
    name: string;
    matches: Match[];
  };
};

export default function FaceSearch() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GroupedResults>({});

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResults({});
  }

  async function searchFace() {
    if (!file || !userId) {
      toast.error("Missing image or user");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("userId", userId);

      const res = await fetch("/api/face-search", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Search failed");
      }

      setResults(data.groups || {});

      if (!data.groups || Object.keys(data.groups).length === 0) {
        toast("No matching photos found");
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-br from-[#e8f7f6] via-white to-[#f2fbfa] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-[#124b49] tracking-tight">
            Smart Face Search
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            Upload an image and we’ll instantly find matching photos from your
            groups with similarity scores.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm">
          <div className="p-5 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Upload Photo
                    </h3>
                    <p className="text-sm text-gray-500">
                      Supported: JPG, PNG, WEBP
                    </p>
                  </div>

                  {file && (
                    <span className="inline-flex items-center rounded-full bg-[#e7f6f5] px-3 py-1 text-xs font-medium text-[#1f6563] border border-[#c9efec]">
                      Selected
                    </span>
                  )}
                </div>

                {/* File Input */}
                <label className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <span className="text-lg">📸</span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-gray-900">
                        Click to choose an image
                      </p>
                      <p className="text-xs text-gray-500">
                        Your photo stays private & secure
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 group-hover:text-gray-700">
                    Browse →
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>

                {/* Action Button */}
                <button
                  onClick={searchFace}
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f6563] px-5 py-3 text-white font-semibold shadow-sm hover:bg-[#175553] active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Search Photos
                    </>
                  )}
                </button>

                {!userId && (
                  <p className="text-xs text-red-500">
                    ⚠️ userId not found in localStorage. Please login again.
                  </p>
                )}
              </div>

              {/* Right Preview */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Preview
                    </h4>
                    {preview && (
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (preview) URL.revokeObjectURL(preview);
                          setPreview(null);
                          setResults({});
                        }}
                        className="text-xs font-medium text-gray-500 hover:text-gray-800 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mt-3">
                    {preview ? (
                      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-[260px] object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                          <p className="text-xs text-white/90">
                            Ready to search 🔥
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                        <div className="text-center space-y-1">
                          <div className="text-3xl">🖼️</div>
                          <p className="text-sm font-medium text-gray-700">
                            No image selected
                          </p>
                          <p className="text-xs text-gray-500">
                            Upload a photo to preview here
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <p className="text-[11px] text-gray-500">Groups</p>
                      <p className="text-sm font-bold text-gray-900">
                        {Object.keys(results).length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <p className="text-[11px] text-gray-500">Status</p>
                      <p className="text-sm font-bold text-gray-900">
                        {loading ? "Searching" : "Idle"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <p className="text-[11px] text-gray-500">File</p>
                      <p className="text-sm font-bold text-gray-900">
                        {file ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Results
            </h3>

            {hasResults && (
              <span className="text-xs md:text-sm text-gray-600">
                Showing matches group-wise
              </span>
            )}
          </div>

          {!hasResults && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto max-w-md space-y-2">
                <div className="text-3xl">✨</div>
                <p className="text-sm md:text-base font-semibold text-gray-900">
                  No results yet
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Upload a photo and click <b>Search Photos</b> to see matches.
                </p>
              </div>
            </div>
          )}

          {Object.entries(results).map(([groupId, group]) => (
            <div
              key={groupId}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              {/* Group Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-5 py-4 bg-gradient-to-r from-[#f3fbfa] to-white border-b border-gray-200">
                <div className="space-y-0.5">
                  <h4 className="text-base md:text-lg font-bold text-gray-900">
                    {group.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Group ID: <span className="font-medium">{groupId}</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="rounded-full bg-[#e7f6f5] border border-[#c9efec] px-3 py-1 text-xs font-semibold text-[#1f6563]">
                    {group.matches.length} matches
                  </span>
                </div>
              </div>

              {/* Matches Grid */}
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {group.matches.map((r, i) => {
                    const percent = (r.similarity * 100).toFixed(1);
                    const score = Number(percent);

                    return (
                      <div
                        key={r.image_url + i}
                        className="group rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                      >
                        <div className="relative">
                          <img
                            src={r.image_url}
                            alt="Match"
                            className="w-full h-40 object-cover"
                            loading="lazy"
                          />

                          {/* Similarity Badge */}
                          <div className="absolute top-2 left-2 rounded-full bg-black/60 text-white text-[11px] px-2.5 py-1">
                            {percent}%
                          </div>

                          {/* Bottom Gradient */}
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
                        </div>

                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-900">
                              Similarity
                            </p>

                            <span
                              className={`text-[11px] font-bold ${
                                score >= 80
                                  ? "text-green-600"
                                  : score >= 60
                                  ? "text-yellow-600"
                                  : "text-red-500"
                              }`}
                            >
                              {score >= 80
                                ? "High"
                                : score >= 60
                                ? "Medium"
                                : "Low"}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#1f6563]"
                              style={{ width: `${score}%` }}
                            />
                          </div>

                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            Match #{i + 1}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 pt-2">
          Powered by smart matching • Designed for fast searching ⚡
        </div>
      </div>
    </div>
  );
}
