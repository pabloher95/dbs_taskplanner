"use client";

import { useState, useEffect } from "react";

export default function Toast({ message, show, onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setExiting(false);
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(onClose, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !exiting) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`px-4 py-3 rounded-xl bg-neutral-900 text-white text-sm font-medium shadow-lg ${
          exiting ? "animate-slide-out" : "animate-slide-in"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
