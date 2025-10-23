import React from "react";

export const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-black/40 border border-white/10 text-white shadow-md rounded-2xl p-5 flex items-center gap-4">
      <div
        className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};
