export const HistoryCard = ({id, service, date, status}) => {
  return(
    <div
      key={id}
      className="bg-white shadow rounded-lg p-4 mb-4 border-l-4 
      transition-all
      border-green-500"
    >
      <div className="mb-2">
        <span className="font-semibold text-gray-800">Selected Service:</span>{" "}
        {service}
      </div>
      <div className="mb-2">
        <span className="font-semibold text-gray-800">Date:</span>{" "}
        {date}
      </div>
      <div>
        <span className="font-semibold text-gray-800">Status:</span>{" "}
        <span
          className={`font-medium px-2 py-1 rounded-full text-sm ${
            status === "Booked"
            ? "bg-yellow-100 text-yellow-600"
            : status === 'Assigned' ? "bg-orange-100 text-orange-600" 
            : status === 'Completed' ? "bg-green-100 text-green-600"
            : status === 'Cancelled' ? "bg-red-100 text-green-600"
            : status === 'No-Show' ? "bg-gray-100 text-gray-600"
            : 'bg-black text-white'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}