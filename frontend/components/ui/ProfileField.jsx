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

export default ProfileField