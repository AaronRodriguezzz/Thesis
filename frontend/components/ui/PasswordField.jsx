const PasswordField = ({ label, value, onChange }) => (
  <div>
    <label className="font-semibold text-sm block mb-1">{label}</label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-black shadow shadow-white p-2 w-full text-base rounded-md focus:ring-2 focus:ring-gray-600 outline-none"
    />
  </div>
);

export default PasswordField