import React from "react";
import { MdClose } from "react-icons/md";

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
          <button onClick={onClose}>
            <MdClose size={26} className="text-gray-500 hover:text-gray-800 transition" />
          </button>
        </div>

        {/* Content (scrollable) */}
        <div className="px-6 py-6 overflow-y-auto text-gray-700 space-y-6 leading-relaxed">
          <p>
            Welcome to our Barbershop Appointment System. By booking or using our services, 
            you agree to the following terms and conditions:
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Booking Policy</h3>
            <p>
              Appointments must be scheduled in advance. Walk-ins are subject to availability.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Cancellations</h3>
            <p>
              Cancellations should be made at least 2 hours before your appointment. 
              Repeated no-shows may result in account suspension.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Payments</h3>
            <p>
              Payments can be made via cash or supported digital wallets. 
              All services must be fully paid after completion.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Liability</h3>
            <p>
              Our barbers are trained professionals. However, we are not responsible 
              for allergic reactions or other unforeseen conditions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Updates to Terms</h3>
            <p>
              These terms may be updated at any time. Continued use of our services 
              means you accept the updated terms.
            </p>
          </div>

          <p>
            If you have any questions, please contact us directly.  
            Thank you for trusting our barbershop!
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
