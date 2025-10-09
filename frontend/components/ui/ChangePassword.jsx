import React, { useState } from 'react'
import PasswordField from './PasswordField'
import { useUser } from '../../hooks/userProtectionHooks';

const ChangePassword = ({ setChangingPassMode }) => {
    const user = useUser();
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

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
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
    };

    return (
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
    )
}

export default ChangePassword