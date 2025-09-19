import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isFormValid } from "../../utils/objectValidation";
import { update_data } from "../../services/PutMethod";
import {
  useCustomerPageProtection,
  useUserProtection,
} from "../../hooks/userProtectionHooks";
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
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    address: user?.address || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!isFormValid(formData, ["address"])) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await update_data("/auth/update_user", formData);

      if (response.updatedInfo) {
        setUser(response.updatedInfo);
        setEditMode(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePass = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      CustomAlert("error", "New Password does not match");
      return;
    }

    const payload = {
      ...passwordData,
      id: user?._id,
    };

    try {
      setLoading(true);
      const response = await update_data(
        "/auth/update_user_password",
        payload
      );

      if (response.updated) {
        setChangingPassMode(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        address: user.address || "",
      });
    }
  }, [user]);

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

        {/* Profile Form */}
        {!changingPassMode ? (
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              value={formData?.phone || 'N/A'}
              editable={editMode}
              name="phone"
              onChange={handleChange}
            />
            <ProfileField
              label="Address"
              value={formData?.address || "N/A"}
              editable={editMode}
              name="address"
              onChange={handleChange}
            />

            {editMode && (
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                  disabled={loading}
                >
                  {loading ? "Saving Changes.." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSavePass}>
            <PasswordField
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(val) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: val,
                }))
              }
            />
            <PasswordField
              label="New Password"
              value={passwordData.newPassword}
              onChange={(val) =>
                setPasswordData((prev) => ({ ...prev, newPassword: val }))
              }
            />
            <PasswordField
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(val) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: val,
                }))
              }
            />

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                disabled={loading}
              >
                {loading ? "Saving Changes.." : "Save Changes"}
              </button>
            </div>
          </form>
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

const ProfileField = ({ label, value, editable, name, onChange }) => (
  <div>
    <label className="font-semibold text-sm block mb-1">{label}</label>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-100 shadow-sm p-2 w-full text-base rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
      />
    ) : (
      <p className="text-gray-800 text-base">{value}</p>
    )}
  </div>
);

const PasswordField = ({ label, value, onChange }) => (
  <div>
    <label className="font-semibold text-sm block mb-1">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-100 shadow-sm p-2 w-full text-base rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>
);

export default ProfilePage;
