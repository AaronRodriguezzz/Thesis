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

export default PasswordField