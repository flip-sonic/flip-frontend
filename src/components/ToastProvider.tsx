"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      // position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "rgba(43, 23, 92, 0.71)",
          color: "#28ff2de6",
          border: "1px solid #0d9488",
          backdropFilter: "blur(10px)",
          fontFamily: "Courier New",
        },
        success: {
          iconTheme: {
            primary: "#4ade80",
            secondary: "black",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff3a3a",
            secondary: "black",
          },
          style: {
            color: "#ef4444",
            border: "1px solid #ef4444",
          },
        },
      }}
    />
  );
}
