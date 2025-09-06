import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isFormValid } from "../../utils/objectValidation";
import { update_data } from "../../services/PutMethod";
import { useAuth } from "../../contexts/UserContext";
import { CustomAlert } from "../../components/modal/CustomAlert";

const Account = () => {

  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile"); // profile | password
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
        CustomAlert("success", "Profile updated!");
      }
    } catch (err) {
      console.log(err);
      CustomAlert("error", "Update failed");
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
      const response = await update_data("/auth/update_user_password", payload);
      if (response.updated) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setActiveTab("profile");
        CustomAlert("success", "Password updated!");
      }
    } catch (err) {
      console.log(err);
      CustomAlert("error", "Password update failed");
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
    <div className="h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-sm opacity-90">Manage your personal information and account security</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-center text-sm font-semibold ${
              activeTab === "profile" ? "border-b-4 border-orange-500 text-orange-600" : "text-gray-500"
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-3 text-center text-sm font-semibold ${
              activeTab === "password" ? "border-b-4 border-orange-500 text-orange-600" : "text-gray-500"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                <ProfileField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              <ProfileField label="Email" name="email" value={formData.email} onChange={handleChange} />
              <ProfileField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <ProfileField label="Address" name="address" value={formData.address} onChange={handleChange} />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form className="space-y-4" onSubmit={handleSavePass}>
              <PasswordField
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(v) => setPasswordData((p) => ({ ...p, currentPassword: v }))}
              />
              <PasswordField
                label="New Password"
                value={passwordData.newPassword}
                onChange={(v) => setPasswordData((p) => ({ ...p, newPassword: v }))}
              />
              <PasswordField
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(v) => setPasswordData((p) => ({ ...p, confirmPassword: v }))}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow"
                >
                  {loading ? "Saving..." : "Save Password"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <button
            onClick={() => navigate("/my-appointments")}
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            My Appointments
          </button>
          <button
            onClick={() => navigate("/appointment")}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Book Appointment
          </button>
          <button
            onClick={logout}
            className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, name, onChange }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      className="bg-gray-100 mt-1 p-2 w-full rounded-lg border focus:ring-2 focus:ring-orange-400 focus:outline-none"
    />
  </div>
);

const PasswordField = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-semibold text-gray-600">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-100 mt-1 p-2 w-full rounded-lg border focus:ring-2 focus:ring-orange-400 focus:outline-none"
    />
  </div>
);

export default Account;
