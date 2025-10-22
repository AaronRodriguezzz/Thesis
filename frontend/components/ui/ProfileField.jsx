const ProfileField = ({ label, value, editable, name, onChange }) => (
  <div>
    <label className="font-semibold text-sm block mb-1 text-white">{label}</label>
    {editable ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-black shadow shadow-white text-base rounded-md focus:ring-2 focus:ring-gray-600 outline-none p-2 "
      />
    ) : (
      <p className="text-base">{value}</p>
    )}
  </div>
);

export default ProfileField