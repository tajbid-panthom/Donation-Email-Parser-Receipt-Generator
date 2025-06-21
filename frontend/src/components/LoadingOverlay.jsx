import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingOverlay = ({
  isVisible = false,
  text = "Loading...",
  backdrop = true,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`
      fixed inset-0 z-50 flex items-center justify-center
      ${backdrop ? "bg-black bg-opacity-50 backdrop-blur-sm" : "bg-transparent"}
    `}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center">
        <LoadingSpinner size="xl" color="blue" />
        <p className="mt-4 text-lg font-medium text-gray-700">{text}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
