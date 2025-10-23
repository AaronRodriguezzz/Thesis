import React, { useEffect, useState } from "react";
import { get_data } from "../../services/GetMethod";
import { FaUserCircle } from "react-icons/fa";
import { MdCalendarToday, MdDirectionsWalk } from "react-icons/md";
import { timeFormat } from "../../utils/formatDate";
import { update_data } from "../../services/PutMethod";
import AssignCustomer from "../../components/modal/AssigningCustomer";
import NewWalkInCustomer from "../../components/modal/AddWalkInCustomer";
import ServiceCompleteModal from "../../components/modal/ServiceCompleteModal";
import AssignmentLoading from "../../components/animations/AssignmentLoading";
import { queueSocket } from "../../services/SocketMethods";
import { useAuth } from "../../contexts/UserContext";

const Assignments = () => {
    const baseUrl =
        import.meta.env.MODE === "development"
        ? "http://localhost:4001"
        : "https://tototumbs.onrender.com";
    const { user, loading } = useAuth();
    const today = new Date();
    const time = timeFormat(today);

    const [barberList, setBarberList] = useState([]);
    const [appointmentsByHour, setAppointmentsByHour] = useState([]);
    const [walkInList, setWalkInList] = useState([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [barberToUpdate, setBarberToUpdate] = useState(null);
    const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
    const [currentHour, setCurrentHour] = useState(new Date().getHours());
    const [error, setError] = useState(null);

    const update_barberStatus = async (barber, newStatus) => {
        try {
            const updatedData = { ...barber, status: newStatus };
            await update_data("/update_employee", updatedData);
        } catch (err) {
        console.error("Error updating barber:", err);
        }
    };

    // Update every 5 minutes if hour changes
    useEffect(() => {
        const interval = setInterval(() => {
        const hourNow = new Date().getHours();
        if (hourNow !== currentHour) {
            setCurrentHour(hourNow);
        }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [currentHour]);

  // Initial fetch + socket
    useEffect(() => {
        if(loading) return 
        const branchId = user?.branchAssigned;

        const fetchInitialData = async () => {

            if(!branchId) return

            try {
                const response = await get_data(`/initialBarberAssignment/${branchId}`);

                setBarberList(response?.barbers || []);
                setAppointmentsByHour(response?.appointments || []);
                setWalkInList(response?.walkIns || []);

                setError(null);
            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError("Failed to load data. Please try again.");
            }
        };

        fetchInitialData();

        // 🔌 Socket setup
        queueSocket.on("connect", () => {
            console.log("Connected to queueing namespace");
        });

        queueSocket.emit("joinBranch", branchId);

        queueSocket.on("queueUpdate", (data) => {
            setBarberList(data[branchId]?.barbers || []);
            setAppointmentsByHour(data[branchId]?.appointments || []);
            setWalkInList(data[branchId]?.walkIns || []);
        });

        return () => {
            queueSocket.off("connect");
            queueSocket.off("queueUpdate");
        };
    }, [loading]);


    // ✅ Loading & Error UI
    if (loading) return <AssignmentLoading />;
    if (error) 

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-600">{error}</p>
        </div>
    );

    return (
        <div>
            <main className="flex flex-col justify-center items-center p-4 w-full">
                {/* Header */}
                <div className="w-full flex justify-between items-center leading-3 bg-black/40 text-white border border-white/10 p-4 my-2 shadow rounded">
                    <div>
                        <h1 className="text-s md:text-[20px] lg:text-[30px] tracking-tighter text-left my-4">
                            TOTO TUMBS STUDIO
                        </h1>
                        <p className="text-[15px]">
                            119 Ballecer South Signal Taguig City
                        </p>
                    </div>
                    <h2 className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-center my-4">
                        {today.toISOString().split("T")[0]} {time}
                    </h2>
                </div>

                {/* Stats */}
                <div className="w-full flex gap-x-2 items-center justify-between leading-3 mb-4">
                    <div className="w-[50%] flex items-center bg-black/40 border border-white/10 text-white gap-8 p-4">
                        <MdCalendarToday className="text-[40px]" />
                        <div>
                            <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                                Appointment
                            </h1>
                            <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                                {appointmentsByHour.filter((a) => a.status === "Booked").length}
                            </p>
                        </div>
                    </div>

                    <div className="w-[50%] flex items-center justify-between bg-black/40 border border-white/10 text-white gap-4 px-4 py-4">
                        <div className="flex">
                            <MdDirectionsWalk className="text-[50px]" />
                            <div>
                                <h1 className="text-s md:text-[20px] lg:text-[25px] tracking-tighter text-left my-2">
                                Walk-In
                                </h1>
                                <p className="text-xs md:text-[20px] lg:text-[30px] font-extralight tracking-tighter text-left">
                                {walkInList.length}
                                </p>
                            </div>
                        </div>

                        <button
                            className="rounded-full py-2 px-4 text-white text-2xl font-semibold hover:bg-white hover:text-black transition"
                            onClick={() => setIsAddingWalkIn(true)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Barber List */}
                <div className="w-full flex flex-row justify-between gap-4">
                    {barberList.map((barber) => (
                        <div
                            key={barber._id}
                            className="relative w-[35%] md:h-[450px] lg:h-[480px] xl:h-[550px] flex flex-col items-center bg-black/40 border border-white/10 text-white shadow-lg rounded-lg p-2 xl:p-4"
                        >
                            {barber.imagePath ? (
                                <img
                                    src={`${baseUrl}/${barber.imagePath}`}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            ) : (
                                <FaUserCircle className="md:text-[90px] xl:text-[120px] mb-2" />
                            )}

                            <h1 className=" text-md xl:text-3xl font-semibold tracking-tight truncate max-w-[200px]">
                                {barber.fullName}
                            </h1>
                            <p className="flex space-x-2">
                                <span className="hidden xl:block">Current Status:</span> 
                                <span
                                    style={{
                                        marginLeft: "3px",
                                        color:
                                        barber.status === "Available" ||
                                        barber.status === "Barbering"
                                            ? "green"
                                            : barber.status === "On-break"
                                            ? "orange"
                                            : "red",
                                    }}
                                >
                                    {barber.status}
                                </span>
                            </p>

                            <div className="w-full flex flex-col space-y-3 mt-4 px-2 xl:px-8 text-black">
                                <button
                                    className="w-full text-sm lg:text-md xl:text-lg bg-white hover:bg-green-400 tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                    onClick={() => {
                                        setIsAssigning(true);
                                        setBarberToUpdate(barber);
                                    }}
                                    disabled={
                                        barber.status !== "Available" ||
                                        barber.status === "On-break" ||
                                        barber.status === "Barbering"
                                    }
                                >
                                    Assign Customer
                                </button>
                                <button
                                    className="w-full  text-sm lg:text-md xl:text-lg bg-white hover:bg-green-400 tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                    onClick={() => {
                                        setIsCompleting(true);
                                        setBarberToUpdate(barber);
                                    }}
                                    disabled={barber.status !== "Barbering"}
                                >
                                    Complete Barbering
                                </button>
                                <button
                                    className="w-full  text-sm lg:text-md xl:text-lg bg-white hover:bg-orange-400 tracking-tight py-2 rounded-lg transition-colors ease-in-out"
                                    disabled={
                                        barber.status === "Unavailable" ||
                                        barber.status === "On-break" ||
                                        barber.status === "Barbering"
                                    }
                                    onClick={() => update_barberStatus(barber, "On-break")}
                                >
                                    Break Time
                                </button>
                            </div>
                            <button
                                className="absolute bottom-0 left-0 w-full text-white py-2 tracking-tight"
                                style={{
                                backgroundColor:
                                    barber.status === "Unavailable" ||
                                    barber.status === "On-break"
                                    ? "green"
                                    : "red",
                                }}
                                disabled={barber.status === "Barbering"}
                                onClick={() =>
                                update_barberStatus(
                                    barber,
                                    barber.status === "Unavailable" ||
                                    barber.status === "On-break"
                                    ? "Available"
                                    : "Unavailable"
                                )
                                }
                            >
                                Set To{" "}
                                {barber.status === "Unavailable" ||
                                barber.status === "On-break"
                                ? "Available"
                                : "Unavailable"}
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Modals */}
            {isAssigning && (
                <AssignCustomer
                onCancel={setIsAssigning}
                appointments={appointmentsByHour}
                walkIn={walkInList}
                setUpdatedAppointments={setAppointmentsByHour}
                setUpdatedWalkIns={setWalkInList}
                setUpdatedBarber={setBarberList}
                barber={barberToUpdate}
                />
            )}

            {isAddingWalkIn && (
                <NewWalkInCustomer
                onCancel={setIsAddingWalkIn}
                setUpdatedData={setWalkInList}
                barbers={barberList}
                />
            )}

            {isCompleting && (
                <ServiceCompleteModal
                onCancel={setIsCompleting}
                barber={barberToUpdate}
                setUpdatedAppointments={setAppointmentsByHour}
                setUpdatedWalkIns={setWalkInList}
                setUpdatedBarber={setBarberList}
                />
            )}
        </div>
    );
};

export default Assignments;
