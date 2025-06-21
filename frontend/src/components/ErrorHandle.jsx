import React from "react";

const ErrorHandle = ({ error }) => {
  return (
    <div
      className={`transition-all duration-500 ease-in-out mt-5 my-4 text-center text-red-700 bg-red-100 py-3 px-20 rounded-md ${
        error
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {error && <>Error: {error}</>}
    </div>
  );
};

export default ErrorHandle;
