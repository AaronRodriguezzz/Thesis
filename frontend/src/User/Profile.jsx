import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isFormValid } from "../../utils/objectValidation";
import { update_data } from "../../services/PutMethod";
import { useCustomerPageProtection, useUserProtection, useLoginDisabling, useUser } from '../../hooks/userProtectionHooks';
import { useAuth } from "../../contexts/UserContext";
import { CustomAlert } from "../../components/modal/CustomAlert";

const ProfilePage = () => {
  useCustomerPageProtection();
  useUserProtection();

  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [changingPassMode, setChangingPassMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [formData, setFormData] = useState({
    address: user?.address || '',  // Ensure address field is always present
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!isFormValid(formData, ['address'])) {
      alert("Please fill in all required fields.");
      return;
    }

    try{
      setLoading(true);
      const response = await update_data('/auth/update_user', formData );

      if(response.updatedInfo){
        setUser(response.updatedInfo)
        setEditMode(false);
      }

    }catch(err){
      console.log(err);
    }finally{
      setLoading(true);
    }
  };  

  const handleSavePass = async (e) => {
    e.preventDefault();

    if(passwordData.newPassword !== passwordData.confirmPassword){
      CustomAlert('error', 'New Password does not match')
      return
    }

    const payload = {
      ...passwordData, 
      id: user?._id
    }

    try{
      setLoading(true);
      const response = await update_data('/auth/update_user_password', payload );

      if(response.updated){
        setChangingPassMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }

    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }
  };  

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        address: user.address || ''
      });
    }
  }, [user]);

  return (
    <div className="h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <div className="p-6 bg-white rounded-xl shadow-md my-5">
        <h1 className="font-extralight text-[50px] text-center my-3 tracking-tighter">PROFILE</h1>

        {/* Quick Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <button
                onClick={() => navigate("/my-appointments")}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm tracking-tighter font-semibold p-2 rounded"
            >
              My Appointments
            </button>
            <button
                onClick={() => {
                  setEditMode((prev) => !prev)
                  setChangingPassMode(false);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm tracking-tighter font-semibold  p-2 rounded"
            >
                {editMode ? "Cancel Edit" : "Manage Profile"}
            </button>
            <button
                onClick={() => {
                  setChangingPassMode((prev) => !prev);
                  setEditMode(false);
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm tracking-tighter font-semibold  p-2 rounded"
            >
                {changingPassMode ? "Cancel Edit" : "Change Password"}
            </button>
            <button
                onClick={() => navigate("/appointment")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm tracking-tighter font-semibold p-2 rounded"
            >
                Book an Appointment
            </button>
        </div>

        {/* Profile Form */}
        {!changingPassMode ? (
          <form className="space-y-4" onSubmit={handleSave}>

            <div className="flex gap-x-4">
              <ProfileField
                label="First Name"
                value={formData?.firstName}
                editable={editMode}
                name="firstName"
                onChange={handleChange}
              />

              <ProfileField
                label="Last Name"
                value={formData?.lastName}
                editable={editMode}
                name="lastName"
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
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? 'Saving Changes..' : 'Save Changes'}
                  </button>
              </div>
            )}
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSavePass}>

            <div>
              <label htmlFor="currentPassword">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                className="bg-gray-100 shadow p-2 w-full text-lg rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="currentPassword">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                className="bg-gray-100 shadow p-2 w-full text-lg rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="currentPassword">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                className="bg-gray-100 shadow p-2 w-full text-lg rounded-md"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Saving Changes..' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

          

         {!changingPassMode && <div className="w-full">
          <button 
            className="bg-red-500 text-lg tracking-tighter text-white py-2 px-8 rounded-full my-5 mx-auto hover:bg-red-700 hover:cursor-pointer transition ease-in"
            style={{display: editMode ? "none": "block" }}
            onClick={logout}
          >
            LOG OUT
          </button>
        </div>}

        
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
        className="bg-gray-100 shadow p-2 w-full text-lg rounded-md"
      />
    ) : (
      <p className="text-gray-800 text-lg tracking-tighter">{value}</p>
    )}
  </div>
);

export default ProfilePage;
