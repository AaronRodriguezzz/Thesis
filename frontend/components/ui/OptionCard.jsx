const OptionCard = ({ field, value, label, description }) => {

    const selected = formData[field] === value;

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`p-4 border rounded-xl shadow-md cursor-pointer transition ${
          selected ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        onClick={() => handleSelect(field, value)}
      >
        <h3 className="text-lg font-semibold">{label}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        {selected && <p className="mt-2 text-blue-600 font-medium">✔ Selected</p>}
      </motion.div>
    );
};

export default OptionCard