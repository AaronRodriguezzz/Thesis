import React from "react";

const TermsPage = () => {
  return (
    <div id="terms" className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-6 bg-[url('/login.png')] bg-cover bg-center">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
        
        <p className="text-gray-700 mb-4">
          Welcome to our Barbershop Appointment System. By booking or using our services, 
          you agree to the following terms and conditions:
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">1. Booking Policy</h2>
        <p className="text-gray-700 mb-4">
          Appointments must be scheduled in advance. Walk-ins are subject to availability.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">2. Cancellations</h2>
        <p className="text-gray-700 mb-4">
          Cancellations should be made at least 2 hours before your appointment. 
          Repeated no-shows may result in account suspension.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">3. Payments</h2>
        <p className="text-gray-700 mb-4">
          Payments can be made via cash or supported digital wallets. 
          All services must be fully paid after completion.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">4. Liability</h2>
        <p className="text-gray-700 mb-4">
          Our barbers are trained professionals. However, we are not responsible 
          for allergic reactions or other unforeseen conditions.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6">5. Updates to Terms</h2>
        <p className="text-gray-700 mb-4">
          These terms may be updated at any time. Continued use of our services 
          means you accept the updated terms.
        </p>

        <p className="text-gray-700 mt-6">
          If you have any questions, please contact us directly.  
          Thank you for trusting our barbershop!
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
