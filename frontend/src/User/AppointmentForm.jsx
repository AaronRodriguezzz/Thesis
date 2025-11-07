import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedDropDown } from "../../components/animations/DropDownAnimaton";
import { useCustomerPageProtection, useUser } from "../../hooks/userProtectionHooks";
import { useFetch } from "../../hooks/useFetch";
import { usePost } from "../../hooks/usePost";
import TermsModal from "../../components/modal/TermsAndConditionModal";
import { notificationsSocket } from "../../services/SocketMethods";
import { time } from "../../data/TimeData";

const AppointmentPage = () => {
  useCustomerPageProtection();

  const navigate = useNavigate();
  const { branchId } = useParams();
  const user = useUser();

  const today = new Date();
  const oneMonthAhead = new Date(today);
  oneMonthAhead.setMonth(today.getMonth() + 1);

  const [termsChecked, setTermsChecked] = useState(false);
  const [viewTerms, setViewTerms] = useState(false);

  const [formData, setFormData] = useState({
    customer: user?._id || "",
    branch: branchId || "",
    barber: "",
    scheduledDate: "",
    scheduledTime: "",
    service: "",
    additionalService: "",
    totalAmount: 0,
  });

  const { postData, postLoading, postError } = usePost();
  const { data, loading, error } = useFetch("/initialize_appointment_info");

  const branches = data?.branches || [];
  const services = data?.services || [];
  const barbers = data?.barbers || [];
  const appointments = data?.appointmentRecord || [];

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    await postData(e, "/new_appointment", formData, () => {
      navigate("/queueing");
    });
  };

  useEffect(() => {
    const main = services.find((s) => s._id === formData.service)?.price || 0;
    const extra = services.find((s) => s._id === formData.additionalService)?.price || 0;
    setFormData((prev) => ({ ...prev, totalAmount: main + extra }));
  }, [formData.service, formData.additionalService, services]);

  useEffect(() => {
    notificationsSocket.on("connect", () => {
      console.log("Connected to notifications namespace at Appointment Form Page");
    });

    return () => {
      notificationsSocket.off("connect");
      notificationsSocket.off("newAppointment");
    };
  }, [])

  if (loading) return <p className="text-center text-white mt-10">Loading appointment info...</p>;
  if (error || postError) return <p className="text-center text-red-500 mt-10">Failed to load data. Please try again.</p>;

  return (
    <div className="w-screen h-screen overflow-x-hidden pt-10">
      <main className="flex gap-x-3 justify-center items-center my-2 text-white">
        {/* Video Preview */}
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          src="/barbering.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block rounded-md w-[350px] h-auto"
        />

        {/* Form */}
        <form className="flex flex-col p-4 w-full md:w-1/3" onSubmit={handleSubmit}>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-3xl font-semibold tracking-tight my-6"
          >
            APPOINTMENT FORM
          </motion.h1>

          {/* Branch */}
          <AnimatedDropDown
            label="Select Branch"
            id="branch"
            delay={0.3}
            value={formData.branch}
            onChange={handleChange("branch")}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <optgroup key={b._id} label={b.address}>
                <option value={b._id}>{b.name}</option>
              </optgroup>
            ))}
          </AnimatedDropDown>

          {/* Date Input (custom calendar icon possible here) */}
          <motion.label
            htmlFor="scheduledDate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Date
          </motion.label>
          <motion.input
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            type="date"
            id="scheduledDate"
            min={today.toISOString().split("T")[0]}
            max={oneMonthAhead.toISOString().split("T")[0]}
            value={formData.scheduledDate}
            onChange={handleChange("scheduledDate")}
            className="border px-3 py-2 rounded mb-3 bg-black/90"
          />

          {/* Barber */}
          <AnimatedDropDown
            label="Barber Selection"
            id="barber"
            delay={0.7}
            value={formData.barber}
            onChange={handleChange("barber")}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
            disabled={!formData.branch}
          >
            <option value="">Select Barber (Optional)</option>
            {barbers
              .filter((b) => b.branchAssigned === formData.branch)
              .map((b) => (
                <option key={b._id} value={b._id} disabled={b.status === "On Leave"}>
                  {b.fullName} {b.status === "On Leave" ? "(On Leave)" : ""}
                </option>
              ))}
          </AnimatedDropDown>

          {/* Time */}
          <AnimatedDropDown
            label="Time"
            id="scheduledTime"
            delay={0.9}
            value={formData.scheduledTime}
            onChange={handleChange("scheduledTime")}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
            disabled={!formData.scheduledDate}
          >
            <option value="">Select Time</option>
            {time.map((slot) => {
              const slotHour = slot.value;
              const isToday =
                new Date(formData.scheduledDate).toDateString() === today.toDateString();
              const hasPassed = isToday && today.getHours() >= slotHour;

              const matchingAppointments = appointments.filter(
                (a) =>
                  a.branch === formData.branch &&
                  a.scheduledTime === slotHour &&
                  new Date(a.scheduledDate).toDateString() ===
                    new Date(formData.scheduledDate).toDateString()
              );

              const isAvailable =
                matchingAppointments.length < 3 &&
                !matchingAppointments.some((a) => a.barber === formData.barber);

              if (!hasPassed && isAvailable) {
                return (
                  <option key={slotHour} value={slotHour}>
                    {slot.timeTxt}
                  </option>
                );
              }
              return null;
            })}
          </AnimatedDropDown>

          {/* Service Type */}
          <AnimatedDropDown
            label="Service Type"
            id="service"
            delay={1.1}
            value={formData.service}
            onChange={handleChange("service")}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
          >
            <option value="">Select Service</option>
            {services
              .filter((s) => s.serviceType === "Package Service")
              .map((s) => (
                <optgroup key={s._id} label={s.description}>
                  <option value={s._id}>{s.name}</option>
                </optgroup>
              ))}
          </AnimatedDropDown>

          {/* Additional Service */}
          <AnimatedDropDown
            label="Additional Service"
            id="additionalService"
            delay={1.3}
            value={formData.additionalService}
            onChange={handleChange("additionalService")}
            className="bg-black/90 border px-3 py-2 rounded mb-3"
          >
            <option value="">Select Extra Service (Optional)</option>
            {services
              .filter((s) => s.serviceType === "Additional Service")
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </AnimatedDropDown>

          <div className="flex gap-x-2 items-center mt-3">
            <motion.input
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
              type="checkbox"
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              className="w-5 h-5 accent-green-500 rounded"
            />
            <span className="space-x-1">
              <motion.span
                onClick={() => setViewTerms(true)}
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
              >
                I agree to the
              </motion.span>
              <motion.a
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
                onClick={() => setViewTerms(true)}
                className="text-blue-500 hover:underline hover:cursor-pointer"
              >
                Terms And Conditions
              </motion.a>
            </span>
          </div>

          {/* ✅ Fixed Submit Button */}
          <motion.button
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
            type="submit"
            disabled={postLoading || !termsChecked}
            className={`py-2 my-4 rounded-md text-black text-lg text-center w-full 
              ${postLoading ? "bg-white/80 cursor-not-allowed" : "bg-white"} 
              disabled:cursor-not-allowed disabled:bg-white/80`}
          >
            {postLoading ? "Submitting..." : "SUBMIT"}
          </motion.button>

        </form>
      </main>

      <TermsModal
        isOpen={viewTerms}
        onClose={() => setViewTerms(false)}
        onAccept={() => {
          setTermsChecked(true);
          setViewTerms(false);
        }}
      />
    </div>
  );
};

export default AppointmentPage;
