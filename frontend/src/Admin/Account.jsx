import React, { useState, useEffect } from "react";
import { update_data } from "../../services/PutMethod";
import { useAuth } from "../../contexts/UserContext";
import { isFormValid } from "../../utils/objectValidation";
import { CustomAlert } from "../../components/modal/CustomAlert";

const AdminProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  console.log(user);
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
      CustomAlert("error", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await update_data("/auth/update_user", formData);

      if (response.updatedInfo) {
        setUser(response.updatedInfo);
        setEditMode(false);
        CustomAlert("success", "Profile updated successfully.");
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
      const response = await update_data("/auth/update_user_password", payload);

      if (response.updated) {
        setChangingPassMode(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        CustomAlert("success", "Password updated successfully.");
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
    <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl p-10 bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <h1 className="font-bold text-4xl text-center text-orange-500 mb-10 tracking-tight">
          Admin Profile
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <button
            onClick={() => {
              setEditMode((prev) => !prev);
              setChangingPassMode(false);
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 rounded-lg transition"
          >
            {editMode ? "Cancel Edit" : "Manage Profile"}
          </button>
          <button
            onClick={() => {
              setChangingPassMode((prev) => !prev);
              setEditMode(false);
            }}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold py-3 rounded-lg transition"
          >
            {changingPassMode ? "Cancel Edit" : "Change Password"}
          </button>
        </div>

        {/* Profile Form */}
        {!changingPassMode ? (
          <form className="space-y-6" onSubmit={handleSave}>
            {/* Row 1 */}
            <ProfileField
              label="Full Name"
              value={formData?.fullName}
              editable={editMode}
              name="fullName"
              onChange={handleChange}
            />
              

            {/* Row 2 */}
            <ProfileField
              label="Email"
              value={formData?.email}
              editable={editMode}
              name="email"
              onChange={handleChange}
            />

            {/* Row 3 */}
            <ProfileField
              label="Role"
              value={formData?.role}
              editable={editMode}
              name="role"
              onChange={handleChange}
            />

            {editMode && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
                  disabled={loading}
                >
                  {loading ? "Saving Changes.." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSavePass}>
            <ProfilePasswordField
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(val) =>
                setPasswordData((prev) => ({ ...prev, currentPassword: val }))
              }
            />
            <ProfilePasswordField
              label="New Password"
              value={passwordData.newPassword}
              onChange={(val) =>
                setPasswordData((prev) => ({ ...prev, newPassword: val }))
              }
            />
            <ProfilePasswordField
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(val) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: val,
                }))
              }
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
                disabled={loading}
              >
                {loading ? "Saving Changes.." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Logout Button */}
        {!changingPassMode && !editMode && (
          <div className="flex justify-center mt-10">
            <button
              className="bg-red-500 text-lg tracking-tight text-white py-3 px-10 rounded-full hover:bg-red-600 transition"
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
  <div className="flex-1">
    <label className="font-semibold text-sm block mb-1 text-gray-600">
      {label}
    </label>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-gray-100 shadow-sm p-2 w-full text-base rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
      />
    ) : (
      <p className="text-gray-800 text-base tracking-tight">{value}</p>
    )}
  </div>
);

const ProfilePasswordField = ({ label, value, onChange }) => (
  <div>
    <label className="font-semibold text-sm block mb-1 text-gray-600">
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-100 shadow-sm p-2 w-full text-base rounded-md focus:ring-2 focus:ring-orange-400 outline-none"
    />
  </div>
);

export default AdminProfilePage;
