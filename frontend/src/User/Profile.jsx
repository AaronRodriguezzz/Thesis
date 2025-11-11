import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/UserContext";
import { useCustomerPageProtection } from "../../hooks/userProtectionHooks";
import ChangePassword from "../../components/ui/ChangePassword";
import ProfileUpdate from "../../components/ui/ProfileUpdate";

const ProfilePage = () => {
  useCustomerPageProtection();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [changingPassMode, setChangingPassMode] = useState(false);  

  return (
    <div id="Profile" className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="w-full max-w-3xl p-8 bg-black/40 rounded-xl shadow shadow-white text-white mx-auto">
        {/* Title */}
        <h1 className="font-extralight text-4xl text-center mb-6 tracking-tight">
          PROFILE
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
          <div className="flex justify-end mt-8">
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-md py-1 px-4 rounded-full transition"
              onClick={() => logout('user')}
            >
              LOG OUT
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;
