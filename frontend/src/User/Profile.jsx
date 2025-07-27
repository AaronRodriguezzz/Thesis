import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/NavBar";
import { isFormValid } from "../../utils/objectValidation";
import { update_data } from "../../services/PutMethod";

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    ...user,
    address: user?.address || '',  // Ensure address field is always present
  });

  console.log("User Data:", user);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {

    if (!isFormValid(formData, ['address'])) {
      alert("Please fill in all required fields.");
      return;
    }

    try{
      const response = await update_data('/auth/update_user', formData );

      if(response.updatedInfo){
        localStorage.setItem('user', JSON.stringify(response?.updatedInfo));
        setEditMode(false);
      }

    }catch(err){
      console.log(err);
    }
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
            <div className="flex gap-6">
              <ProfileField
                label="Last Name"
                value={`${formData?.lastName},`}
                editable={editMode}
                name="lastName"
                onChange={handleChange}
              />

              <ProfileField
                label="First Name"
                value={`${formData?.firstName}`}
                editable={editMode}
                name="firstName"
                onChange={handleChange}
              />
            </div>
            
            <ProfileField
              label="Email"
              value={formData?.email}
              editable={editMode}
              name="email"
              onChange={handleChange}
            />
            <ProfileField
              label="Phone"
              value={formData?.phone}
              editable={editMode}
              name="phone"
              onChange={handleChange}
            />
            <ProfileField
              label="Address"
              value={formData?.address || 'N/A'}
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

        <button 
          className="bg-green underline text-lg tracking-tighter text-blue-500 my-5"
          style={{display: editMode ? "none": "block" }}
        >
          Change Password
        </button>
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
