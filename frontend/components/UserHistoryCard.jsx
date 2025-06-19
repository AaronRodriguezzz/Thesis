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
          status === "Completed"
          ? "bg-green-100 text-green-600"
          : status === "Pending"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-red-100 text-red-600"
        }`}
        >
          {status}
        </span>
      </div>
    </div>
  )
}