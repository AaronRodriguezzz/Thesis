import React, { useState } from "react";

const CancellationModal = ({ onClose, cancelling, onProceed }) => {
  const [reason, setReason] = useState("");

  const cancellationReasons = [
    "Change of plans",
    "Booked by mistake",
    "Found another provider",
    "Not feeling well",
    "Other"
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black/40 fixed top-0 left-0 z-50">
      <form
        onSubmit={(e) => onProceed(e, reason)}
        className="w-[90%] max-w-[400px] bg-white rounded-lg shadow-lg p-5 shadow-gray-400"
      >
        <h1 className="text-2xl font-semibold mb-4 tracking-tight">
          Cancel Appointment
        </h1>

        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">
            Select a reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border border-gray-200 px-3 py-2 rounded-md focus:border-gray-300"
          >
            <option value="" disabled>
              Choose a reason
            </option>
            {cancellationReasons.map((r, index) => (
              <option key={index} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!reason || cancelling}
            className={`px-4 py-1 rounded text-white transition ${
              reason
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            {cancelling ? 'Proceeding...' : 'Proceed'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CancellationModal;
