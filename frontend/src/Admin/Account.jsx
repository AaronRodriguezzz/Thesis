import React, { useState, useEffect } from "react";
import { update_data } from "../../services/PutMethod";
import { useAuth } from "../../contexts/UserContext";
import { CustomAlert } from "../../components/modal/CustomAlert";
import { LogOut, User, Lock, Edit3, Save } from "lucide-react";

const AdminProfilePage = () => {
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

    try {
      setLoading(true);
      const response = await update_data("/update_employee", formData);

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

    const payload = { ...passwordData, id: user?._id };

    try {
      setLoading(true);
      const response = await update_data("/update_password", payload);

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
      setFormData({ ...user, address: user.address || "" });
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-start text-white min-h-[calc(100vh-100px)] mt-10">
      <div className="w-full max-w-3xl p-10 bg-black/40 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
        <h1 className="font-bold text-3xl text-center text-gray-300 mb-10 tracking-tight flex items-center justify-center gap-2">
          Admin Profile
        </h1>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
          <button
            onClick={() => {
              setEditMode((prev) => !prev);
              setChangingPassMode(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-3 rounded-lg transition"
          >
            {editMode ? <Lock className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {editMode ? "Cancel Edit" : "Manage Profile"}
          </button>
          <button
            onClick={() => {
              setChangingPassMode((prev) => !prev);
              setEditMode(false);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-3 rounded-lg transition"
          >
            <Lock className="w-4 h-4" />
            {changingPassMode ? "Cancel Edit" : "Change Password"}
          </button>
        </div>

        {!changingPassMode ? (
          <form className="space-y-6" onSubmit={handleSave}>
            <ProfileField
              label="Full Name"
              value={formData?.fullName}
              editable={editMode}
              name="fullName"
              onChange={handleChange}
            />
            <ProfileField
              label="Email"
              value={formData?.email}
              editable={editMode}
              name="email"
              onChange={handleChange}
            />
            <ProfileField
              label="Role"
              value={formData?.role}
              editable={false}
              name="role"
              onChange={handleChange}
            />

            {editMode && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving.." : "Save Changes"}
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
                setPasswordData((prev) => ({ ...prev, confirmPassword: val }))
              }
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving.." : "Save Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, editable, name, onChange }) => (
  <div className="flex-1">
    <label className="font-semibold text-sm block mb-1 text-gray-400">
      {label}
    </label>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-black/50 border border-white/10 shadow-sm p-2 w-full text-base rounded-md focus:ring-2 focus:ring-orange-400 outline-none text-white"
      />
    ) : (
      <p className="text-gray-100 text-base tracking-tight bg-black/50 border border-white/10 p-2 rounded-md">
        {value}
      </p>
    )}
  </div>
);

const ProfilePasswordField = ({ label, value, onChange }) => (
  <div>
    <label className="font-semibold text-sm block mb-1 text-gray-400">
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-black/50 border border-white/10 shadow-sm p-2 w-full text-base rounded-md focus:ring-2 focus:ring-orange-400 outline-none text-white"
    />
  </div>
);

export default AdminProfilePage;
