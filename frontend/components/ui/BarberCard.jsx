import { FaUserCircle } from "react-icons/fa";

const BarberCard = ({ barber, baseUrl, onAssign, onComplete, onBreak, onToggle }) => {
    const statusColor =
        barber.status === "Available" 
        ? "green" 
        :  barber.status === "Barbering" 
        ? "yellow"
        : barber.status === "On-break"
        ? "orange"
        : "red";

    const isAssignDisabled =
        barber.status !== "Available" ||
        barber.status === "On-break" ||
        barber.status === "Barbering";

    const isCompleteDisabled = barber.status !== "Barbering";
    const isBreakDisabled =
        barber.status === "Unavailable" ||
        barber.status === "On-break" ||
        barber.status === "Barbering";

    return (
        <div className="relative w-[35%] h-[510px] flex flex-col items-center bg-black/40 border border-white/10 text-white shadow-lg rounded-lg p-4">
        {barber.imagePath ? (
            <img
            src={`${baseUrl}/${barber.imagePath}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
            />
        ) : (
            <FaUserCircle className="text-[100px] mb-2" />
        )}

        <h1 className="text-lg xl:text-2xl font-semibold tracking-tight truncate max-w-[200px]">
            {barber.fullName}
        </h1>

        <p className="flex space-x-2 text-sm mt-1">
            <span>Current Status:</span>
            <span style={{ color: statusColor }}>{barber.status}</span>
        </p>

        <div className="w-full flex flex-col space-y-3 mt-4 px-6 text-black">
            <button
            className="w-full bg-white hover:bg-green-400 py-2 rounded-lg transition"
            onClick={onAssign}
            disabled={isAssignDisabled}
            >
            Assign Customer
            </button>

            <button
            className="w-full bg-white hover:bg-green-400 py-2 rounded-lg transition"
            onClick={onComplete}
            disabled={isCompleteDisabled}
            >
            Complete Barbering
            </button>

            <button
            className="w-full bg-white hover:bg-orange-400 py-2 rounded-lg transition"
            onClick={onBreak}
            disabled={isBreakDisabled}
            >
            Break Time
            </button>
        </div>

        <button
            className="absolute bottom-0 left-0 w-full text-white py-2"
            style={{
            backgroundColor:
                barber.status === "Unavailable" || barber.status === "On-break"
                ? "green"
                : "red",
            }}
            disabled={barber.status === "Barbering"}
            onClick={onToggle}
        >
            Set To{" "}
            {barber.status === "Unavailable" || barber.status === "On-break"
            ? "Available"
            : "Unavailable"}
        </button>
        </div>
    );
};

export default BarberCard;