import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/NavBar";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    phone: "09171234567",
    address: "Taguig City, Philippines",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(formData);
    setEditMode(false);
    // Optionally: send formData to backend here
  };

  return (
    <div className="h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <div className="p-6 bg-white rounded-xl shadow-md my-5">
        <h1 className="font-extralight text-[50px] text-center my-3">PROFILE</h1>

        {/* Quick Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <button
                onClick={() => navigate("/my-appointments")}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm tracking-tighter font-semibold p-2 rounded"
            >
              My Appointments
            </button>
            <button
                onClick={() => setEditMode((prev) => !prev)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm tracking-tighter font-semibold  p-2 rounded"
            >
                {editMode ? "Cancel Edit" : "Manage Profile"}
            </button>
            <button
                onClick={() => navigate("/appointment")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm tracking-tighter font-semibold p-2 rounded"
            >
                Book an Appointment
            </button>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
            <ProfileField
              label="Name"
              value={formData.name}
              editable={editMode}
              name="name"
              onChange={handleChange}
            />
            <ProfileField
              label="Email"
              value={formData.email}
              editable={editMode}
              name="email"
              onChange={handleChange}
            />
            <ProfileField
              label="Phone"
              value={formData.phone}
              editable={editMode}
              name="phone"
              onChange={handleChange}
            />
            <ProfileField
              label="Address"
              value={formData.address}
              editable={editMode}
              name="address"
              onChange={handleChange}
            />

            {editMode && (
              <div className="flex justify-end mt-4">
                  <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                  Save Changes
                  </button>
              </div>
            )}
        </div>
      </div>
    </div>
    
  );
};

const ProfileField = ({ label, value, editable, name, onChange }) => (
  <div>
    <label className="font-semibold text-lg block">{label}</label>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-100 shadow rounded p-2 w-full text-lg rounded-md"
      />
    ) : (
      <p className="text-gray-800 text-lg tracking-tighter">{value}</p>
    )}
  </div>
);

export default ProfilePage;
