"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  onDelete?: (url: string) => Promise<void> | void;
  onDownload?: (url: string) => void;
}

export default function PhotoViewer({ images, initialIndex = 0, onClose, onDelete, onDownload }: Props) {
  const [index, setIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!images || images.length === 0) return null;

  const url = images[index];

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  async function handleDelete() {
    if (!confirm("Delete this photo?")) return;
    if (onDelete) {
      try {
        await onDelete(url);

        // Image deleted → toast
        toast.success("Photo deleted");

        if (images.length <= 1) {
          onClose();
        } else {
          const nextIndex = index >= images.length - 1 ? 0 : index;
          setIndex(nextIndex);
        }
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  }

  function handleDownload() {
    if (onDownload) onDownload(url);

    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "photo.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
      aria-modal="true"
    >
      <div
        className="relative max-w-[95%] max-h-[95%] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE */}
        <img
          src={url}
          alt={`photo-${index}`}
          className="max-w-full max-h-[80vh] rounded-lg shadow-lg transform transition-all duration-200"
        />

        {/* LEFT ARROW */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white px-3 py-2 rounded-full shadow"
          title="Previous (←)"
        >
          ‹
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white px-3 py-2 rounded-full shadow"
          title="Next (→)"
        >
          ›
        </button>

        {/* TOP ACTIONS */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleDownload}
            className="bg-white/90 px-3 py-2 rounded shadow hover:bg-white text-sm"
            title="Download"
          >
            Download
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-100 text-red-700 px-3 py-2 rounded shadow hover:bg-red-200 text-sm"
            title="Delete"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="bg-white/90 px-3 py-2 rounded shadow hover:bg-white text-sm"
            title="Close (Esc)"
          >
            Close
          </button>
        </div>

        {/* BOTTOM COUNTER */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
