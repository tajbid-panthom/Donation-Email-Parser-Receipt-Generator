import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingButton = ({
  onClick,
  children,
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        bg-[#003366] hover:bg-[#004b8d] text-white font-bold py-3 px-8 rounded-lg 
        transition-colors duration-300 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-offset-[#0a192f] focus:ring-pink-500 
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <LoadingSpinner size="sm" color="white" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
