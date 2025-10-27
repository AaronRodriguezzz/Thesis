import { useEffect, useState } from "react";
import { get_data } from "../services/GetMethod";
import { queueSocket } from "../services/SocketMethods";

export const useQueueData = (branchId, loading = false) => {
  const [barberList, setBarberList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [walkIns, setWalkIns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading || !branchId) return;

    const fetchInitialData = async () => {
      try {
        const response = await get_data(`/initialBarberAssignment/${branchId}`);
        setBarberList(response?.barbers || []);
        setAppointments(response?.appointments || []);
        setWalkIns(response?.walkIns || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load data.");
      }
    };

    fetchInitialData();

    queueSocket.emit("joinBranch", branchId);

    queueSocket.on("queueUpdate", (data) => {
      if (data.branchId !== branchId) {
        console.log("Received queue update:", data)
        return
      }
      setBarberList(data?.barbers || []);
      setAppointments(data?.appointments || []);
      setWalkIns(data?.walkIns || []);
    });

    return () => {
      queueSocket.off("queueUpdate");
    };
  }, [branchId, loading]);

  return { barberList, appointments, walkIns, error };
};