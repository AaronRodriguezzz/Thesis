import React, { useEffect, useState } from "react";
import { MdCalendarToday, MdDirectionsWalk } from "react-icons/md";
import { timeFormat } from "../../utils/formatDate";
import { update_data } from "../../services/PutMethod";
import { useAuth } from "../../contexts/UserContext";
import { useQueueData } from "../../hooks/useQueueData";

import AssignCustomer from "../../components/modal/AssigningCustomer";
import NewWalkInCustomer from "../../components/modal/AddWalkInCustomer";
import ServiceCompleteModal from "../../components/modal/ServiceCompleteModal";
import AssignmentLoading from "../../components/animations/AssignmentLoading";

import BarberCard from "../../components/ui/BarberCard";
import PageHeader from "../../components/ui/BarberAssignmentHeader";
import AssignmentsCard from "../../components/ui/BarberAssignmentCard";


// ---------------------- Main Component ----------------------

const Assignments = () => {
    const baseUrl =
        import.meta.env.MODE === "development"
        ? "http://localhost:4001"
        : "https://tototumbs.onrender.com";

    const [isAssigning, setIsAssigning] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
    const [barberToUpdate, setBarberToUpdate] = useState(null);

    const today = new Date();
    const time = timeFormat(today);

    const { user, loading } = useAuth();
    const { barberList, appointments, walkIns, error } = useQueueData(
        user?.branchAssigned,
        loading
    );


    const update_barberStatus = async (barber, newStatus) => {
        try {
            await update_data("/updateBarberStatus", { ...barber, status: newStatus });
        } catch (err) {
            console.error("Error updating barber:", err);
        }
    };

    // Show loading / error states
    if (loading) return <AssignmentLoading />;
    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-red-600">{error}</p>
        </div>
    );

    return (
        <div>
        <PageHeader today={today} time={time} />

        {/* Stats */}
        <div className="w-full flex gap-x-2 mb-4">
            <AssignmentsCard
                icon={MdCalendarToday}
                label="Appointment"
                value={appointments.filter((a) => a.status === "Booked").length}
            />
            <AssignmentsCard
                icon={MdDirectionsWalk}
                label="Walk-In"
                value={walkIns.length}
                onAdd={() => setIsAddingWalkIn(true)}
            />
        </div>

        {/* Barber Cards */}
        <div className="w-full flex justify-center gap-2">
            {barberList.map((barber) => (
                <BarberCard
                    key={barber._id}
                    barber={barber}
                    baseUrl={baseUrl}
                    onAssign={() => {
                    setIsAssigning(true);
                    setBarberToUpdate(barber);
                    }}
                    onComplete={() => {
                    setIsCompleting(true);
                    setBarberToUpdate(barber);
                    }}
                    onBreak={() => update_barberStatus(barber, "On-break")}
                    onToggle={() =>
                    update_barberStatus(
                        barber,
                        barber.status === "Unavailable" || barber.status === "On-break"
                        ? "Available"
                        : "Unavailable"
                    )
                    }
                />
            ))}
        </div>

        {/* Modals */}
        {isAssigning && (
            <AssignCustomer
            onCancel={setIsAssigning}
            appointments={appointments}
            walkIn={walkIns}
            barber={barberToUpdate}
            />
        )}

        {isAddingWalkIn && (
            <NewWalkInCustomer
            onCancel={setIsAddingWalkIn}
            barbers={barberList}
            />
        )}

        {isCompleting && (
            <ServiceCompleteModal
            onCancel={setIsCompleting}
            barber={barberToUpdate}
            />
        )}
        </div>
    );
};

export default Assignments;
