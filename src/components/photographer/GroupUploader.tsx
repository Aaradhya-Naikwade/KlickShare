// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";

// interface UploadFile {
//   file: File;
//   id: string;
//   preview: string;
//   progress: number;
//   status: "queued" | "uploading" | "done" | "error" | "canceled";
//   xhr?: XMLHttpRequest | null;
//   errorMsg?: string;
// }

// interface Props {
//   groupId: string;
//   onUploaded?: (files: string[]) => void; // returns public paths
// }

// export default function GroupUploader({ groupId, onUploaded }: Props) {
//   const [queue, setQueue] = useState<UploadFile[]>([]);
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const maxSize = 20 * 1024 * 1024; // 20MB

//   useEffect(() => {
//     return () => {
//       queue.forEach((q) => URL.revokeObjectURL(q.preview));
//     };
//     // eslint-disable-next-line
//   }, []);

//   function handleFiles(files: FileList | null) {
//     if (!files) return;
//     const arr: UploadFile[] = [];
//     for (let i = 0; i < files.length; i++) {
//       const f = files[i];
//       const id = `${Date.now()}-${i}-${Math.round(Math.random() * 1e9)}`;

//       if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)) {
//         toast.error(`Skipping ${f.name} — unsupported format`);
//         continue;
//       }
//       if (f.size > maxSize) {
//         toast.error(`Skipping ${f.name} — file > 20MB`);
//         continue;
//       }

//       arr.push({
//         file: f,
//         id,
//         preview: URL.createObjectURL(f),
//         progress: 0,
//         status: "queued",
//         xhr: null,
//       });
//     }
//     setQueue((q) => [...q, ...arr]);
//   }

//   function onDrop(e: React.DragEvent) {
//     e.preventDefault();
//     handleFiles(e.dataTransfer.files);
//   }

//   function onDragOver(e: React.DragEvent) {
//     e.preventDefault();
//   }

//   function removeFromQueue(id: string) {
//     setQueue((q) => {
//       const target = q.find((x) => x.id === id);
//       if (target && target.xhr) {
//         target.xhr.abort();
//       }
//       URL.revokeObjectURL(target?.preview || "");
//       return q.filter((x) => x.id !== id);
//     });
//   }

//   function uploadAll() {
//     // concurrent upload limit = 4
//     const concurrency = 4;
//     let active = 0;

//     const startNext = () => {
//       setQueue((prev) => {
//         const next = [...prev];

//         for (let i = 0; i < next.length && active < concurrency; i++) {
//           const item = next[i];
//           if (item.status === "queued") {
//             uploadFile(item);
//             active++;
//           }
//         }
//         return next;
//       });
//     };

//     startNext();
//   }

//   function uploadFile(item: UploadFile) {
//     const xhr = new XMLHttpRequest();
//     const fd = new FormData();
//     fd.append("groupId", groupId);
//     fd.append("photos", item.file);

//     xhr.open("POST", `/api/groups/photos`);

//     xhr.upload.onprogress = (e) => {
//       if (e.lengthComputable) {
//         const percent = Math.round((e.loaded / e.total) * 100);
//         setQueue((q) => q.map((x) => (x.id === item.id ? { ...x, progress: percent } : x)));
//       }
//     };

//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         const res = JSON.parse(xhr.responseText);

//         setQueue((q) => q.map((x) => (x.id === item.id ? { ...x, status: "done", progress: 100 } : x)));

//         toast.success(`${item.file.name} uploaded`);

//         if (onUploaded) {
//           const files = res.files || [];
//           onUploaded(files);
//         }
//       } else {
//         const resp = (() => {
//           try { return JSON.parse(xhr.responseText); } catch { return { message: xhr.statusText }; }
//         })();

//         setQueue((q) =>
//           q.map((x) =>
//             x.id === item.id
//               ? { ...x, status: "error", errorMsg: resp.message || "Upload failed" }
//               : x
//           )
//         );

//         toast.error(resp.message || "Upload failed");
//       }

//       // start next file
//       setTimeout(() => {
//         setQueue((q) => {
//           const nextQueued = q.find((x) => x.status === "queued");
//           if (nextQueued) uploadFile(nextQueued);
//           return q;
//         });
//       }, 200);
//     };

//     xhr.onerror = () => {
//       setQueue((q) =>
//         q.map((x) => (x.id === item.id ? { ...x, status: "error", errorMsg: "Network error" } : x))
//       );
//       toast.error("Network error");
//     };

//     xhr.onabort = () => {
//       setQueue((q) => q.map((x) => (x.id === item.id ? { ...x, status: "canceled" } : x)));
//       toast("Upload canceled");
//     };

//     setQueue((q) => q.map((x) => (x.id === item.id ? { ...x, status: "uploading", xhr } : x)));
//     xhr.send(fd);
//   }

//   return (
//     <div>
//       <div
//         onDrop={onDrop}
//         onDragOver={onDragOver}
//         className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white"
//       >
//         <p className="text-sm text-gray-600">Drag & drop photos here, or</p>
//         <div className="mt-3 flex justify-center gap-3">
//           <label className="bg-[#f3f7f6] px-4 py-2 rounded cursor-pointer border">
//             <input
//               ref={inputRef}
//               type="file"
//               multiple
//               accept="image/png, image/jpeg, image/jpg, image/webp"
//               onChange={(e) => handleFiles(e.target.files)}
//               className="hidden"
//             />
//             <span className="text-sm text-gray-700">Select Files</span>
//           </label>

//           <button
//             onClick={() => uploadAll()}
//             className="bg-[#1f6563] text-white px-4 py-2 rounded hover:bg-[#15514f]"
//           >
//             Upload All
//           </button>
//         </div>

//         <p className="text-xs text-gray-500 mt-2">Supported: PNG/JPG/WEBP — Max 20MB each</p>
//       </div>

//       {/* Preview Grid */}
//       <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
//         {queue.map((q) => (
//           <div key={q.id} className="bg-white p-2 rounded shadow relative">
//             <img src={q.preview} alt="preview" className="w-full h-28 object-cover rounded" />
//             <div className="mt-2 text-xs text-gray-700">{q.file.name}</div>

//             <div className="mt-2">
//               <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
//                 <div style={{ width: `${q.progress}%` }} className={`h-full bg-[#1f6563]`}></div>
//               </div>

//               <div className="flex justify-between items-center text-xs mt-1">
//                 <span>{q.progress}%</span>
//                 <div className="flex gap-2">
//                   {q.status === "uploading" && (
//                     <button
//                       onClick={() => q.xhr?.abort()}
//                       className="text-red-500 underline text-xs"
//                     >
//                       Cancel
//                     </button>
//                   )}

//                   {q.status === "queued" && (
//                     <button
//                       onClick={() => removeFromQueue(q.id)}
//                       className="text-red-500 underline text-xs"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {q.status === "error" && (
//                 <div className="text-red-500 text-xs mt-1">{q.errorMsg}</div>
//               )}

//               {q.status === "done" && (
//                 <div className="text-green-600 text-xs mt-1">Uploaded</div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }










"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface UploadFile {
  file: File;
  id: string;
  preview: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error" | "canceled";
  xhr?: XMLHttpRequest | null;
  errorMsg?: string;
}

interface Props {
  groupId: string;
  onUploaded?: (files: string[]) => void;
}

export default function GroupUploader({ groupId, onUploaded }: Props) {
  const [queue, setQueue] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maxSize = 20 * 1024 * 1024;

  const photographerId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  useEffect(() => {
    return () => {
      queue.forEach((q) => URL.revokeObjectURL(q.preview));
    };
    // eslint-disable-next-line
  }, []);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const arr: UploadFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];

      if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(f.type)) {
        toast.error(`Skipping ${f.name} — unsupported format`);
        continue;
      }

      if (f.size > maxSize) {
        toast.error(`Skipping ${f.name} — file > 20MB`);
        continue;
      }

      arr.push({
        file: f,
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(f),
        progress: 0,
        status: "queued",
      });
    }

    setQueue((q) => [...q, ...arr]);
  }

  function uploadAll() {
    if (!photographerId) {
      toast.error("Photographer not logged in");
      return;
    }

    if (isUploading) return; // 🔒 HARD LOCK

    setIsUploading(true);

    const queuedItems = queue.filter((q) => q.status === "queued");

    if (queuedItems.length === 0) {
      setIsUploading(false);
      return;
    }

    queuedItems.forEach((item) => {
      // ✅ Mark as uploading FIRST (prevents double-pick)
      setQueue((q) =>
        q.map((x) =>
          x.id === item.id ? { ...x, status: "uploading" } : x
        )
      );

      uploadFile(item);
    });
  }

  function uploadFile(item: UploadFile) {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    fd.append("groupId", groupId);
    fd.append("photographerId", photographerId as string);
    fd.append("photos", item.file);

    xhr.open("POST", "/api/groups/photos");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setQueue((q) =>
          q.map((x) =>
            x.id === item.id ? { ...x, progress: percent } : x
          )
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);

        setQueue((q) =>
          q.map((x) =>
            x.id === item.id ? { ...x, status: "done", progress: 100 } : x
          )
        );

        onUploaded?.(res.files || []);
        toast.success(`${item.file.name} uploaded`);
      } else {
        let msg = "Upload failed";
        try {
          msg = JSON.parse(xhr.responseText)?.message || msg;
        } catch {}

        setQueue((q) =>
          q.map((x) =>
            x.id === item.id
              ? { ...x, status: "error", errorMsg: msg }
              : x
          )
        );
        toast.error(msg);
      }

      setIsUploading(false);
    };

    xhr.onerror = () => {
      setQueue((q) =>
        q.map((x) =>
          x.id === item.id
            ? { ...x, status: "error", errorMsg: "Network error" }
            : x
        )
      );
      setIsUploading(false);
      toast.error("Network error");
    };

    xhr.onabort = () => {
      setQueue((q) =>
        q.map((x) =>
          x.id === item.id ? { ...x, status: "canceled" } : x
        )
      );
      setIsUploading(false);
      toast("Upload canceled");
    };

    xhr.send(fd);
  }

  return (
    <div>
      <div
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white"
      >
        <p className="text-sm text-gray-600">Drag & drop photos here, or</p>

        <div className="mt-3 flex justify-center gap-3">
          <label className="bg-[#f3f7f6] px-4 py-2 rounded cursor-pointer border">
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <span className="text-sm text-gray-700">Select Files</span>
          </label>

          <button
            onClick={uploadAll}
            disabled={isUploading}
            className="bg-[#1f6563] text-white px-4 py-2 rounded hover:bg-[#15514f] disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload All"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {queue.map((q) => (
          <div key={q.id} className="bg-white p-2 rounded shadow">
            <img src={q.preview} className="w-full h-28 object-cover rounded" />
            <div className="mt-2 text-xs">{q.file.name}</div>
            <div className="mt-1 h-2 bg-gray-200 rounded">
              <div
                style={{ width: `${q.progress}%` }}
                className="h-full bg-[#1f6563]"
              />
            </div>
            <div className="text-xs mt-1">{q.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
