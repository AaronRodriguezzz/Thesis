// Stat cards (Appointments / Walk-ins)
const AssignmentsCard = ({ icon: Icon, label, value, onAdd }) => (
    <div className="w-[50%] flex items-center justify-between bg-black/40 border border-white/10 text-white gap-4 px-4 py-4">
        <div className="flex items-center gap-4">
        <Icon className="text-[45px]" />
        <div>
            <h1 className="text-[20px] lg:text-[25px] tracking-tighter">{label}</h1>
            <p className="text-[20px] lg:text-[30px] font-extralight">{value}</p>
        </div>
        </div>
        {onAdd && (
        <button
            className="rounded-full py-2 px-4 text-white text-2xl font-semibold hover:bg-white hover:text-black transition"
            onClick={onAdd}
        >
            +
        </button>
        )}
    </div>
);

export default AssignmentsCard;