import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerPageProtection, useUserProtection } from "../../hooks/userProtectionHooks";
import { useAuth } from "../../contexts/UserContext";
import ChangePassword from "../../components/ui/ChangePassword";
import ProfileUpdate from "../../components/ui/ProfileUpdate";

const ProfilePage = () => {
  useCustomerPageProtection();
  useUserProtection();

  const navigate = useNavigate();
  const { logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [changingPassMode, setChangingPassMode] = useState(false);  

  return (
    <div className="min-h-screen w-full bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="w-full max-w-3xl p-8 bg-white rounded-xl shadow-lg">
        {/* Title */}
        <h1 className="font-bold text-4xl text-center mb-6 tracking-tight">
          Profile
        </h1>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => navigate("/my-appointments")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold p-2 rounded transition"
          >
            My Appointments
          </button>
          <button
            onClick={() => {
              setEditMode((prev) => !prev);
              setChangingPassMode(false);
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold p-2 rounded transition"
          >
            {editMode ? "Cancel Edit" : "Manage Profile"}
          </button>
          <button
            onClick={() => {
              setChangingPassMode((prev) => !prev);
              setEditMode(false);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold p-2 rounded transition"
          >
            {changingPassMode ? "Cancel Edit" : "Change Password"}
          </button>
          <button
            onClick={() => navigate("/appointment")}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold p-2 rounded transition"
          >
            Book Appointment
          </button>
        </div>

        {!changingPassMode ? (
          <ProfileUpdate 
            editMode={editMode} 
            setEditMode={setEditMode}
          />
        ) : (
          <ChangePassword 
            setChangingPassMode={setChangingPassMode} 
          />
        )}

        {/* Logout */}
        {!changingPassMode && !editMode && (
          <div className="flex justify-center mt-8">
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-lg font-semibold py-2 px-8 rounded-full transition"
              onClick={logout}
            >
              LOG OUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export default ProfilePage;
