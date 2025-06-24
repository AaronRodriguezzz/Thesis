
export const StatCard = ({ title, value, icon, iconBg }) => {
  return(
    <div className="flex-1 w-[170px] lg:w-[220px] bg-white p-4 rounded-md shadow-md flex items-center gap-4">
      <div className={`p-3 rounded-full bg-gray-800`}>
        {icon}
      </div>
      <div>
        <h2 className="text-sm lg:text-md font-semibold text-gray-500 tracking-tight">{title}</h2>
        <p className="text-md lg:text-xl font-bold text-gray-800 tracking-tighter">{value}</p>
      </div>
    </div>
  )
} 