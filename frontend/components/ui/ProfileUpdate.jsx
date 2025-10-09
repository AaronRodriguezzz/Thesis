import React, { useState, useEffect } from 'react'
import ProfileField from './ProfileField';
import { isFormValid } from '../../utils/objectValidation';
import { useAuth } from '../../contexts/UserContext';
import { update_data } from '../../services/PutMethod';

const ProfileUpdate = ({ editMode, setEditMode }) => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(false);
    
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


    useEffect(() => {
        if (user) {
          setFormData({
            ...user,
            address: user.address || "",
          });
        }
    }, [user]);

    return (
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
                value={formData?.phone || ''}
                editable={editMode}
                name="phone"
                onChange={handleChange}
            />
            <ProfileField
                label="Address"
                value={formData?.address || ''}
                editable={editMode}
                name="address"
                onChange={handleChange}
            />
        
            {editMode && (
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition disabled:bg-green-800"
                        disabled={loading}
                    >
                        {loading ? "Saving Changes.." : "Save Changes"}
                    </button>
                </div>
            )}
        </form>
    )
}

export default ProfileUpdate