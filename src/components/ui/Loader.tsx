import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse"
        >
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-20 bg-slate-100 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
