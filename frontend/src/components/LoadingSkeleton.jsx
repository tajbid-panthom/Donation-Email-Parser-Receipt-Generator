import React from "react";

const LoadingSkeleton = ({ type = "default", className = "" }) => {
  const skeletonTypes = {
    text: (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    ),
    card: (
      <div className={`animate-pulse bg-gray-200 rounded-lg p-4 ${className}`}>
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
      </div>
    ),
    button: (
      <div
        className={`animate-pulse bg-gray-300 rounded-lg h-12 w-32 ${className}`}
      ></div>
    ),
    textarea: (
      <div className={`animate-pulse bg-gray-200 rounded-lg p-4 ${className}`}>
        <div className="h-3 bg-gray-300 rounded w-1/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    ),
    default: (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
    ),
  };

  return skeletonTypes[type] || skeletonTypes.default;
};

export default LoadingSkeleton;
