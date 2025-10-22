
export const HistoryCard = ({
  id, 
  service, 
  date, 
  status, 
  onCancel, 
}) => {

  return(
    <div
      key={id}
      className={`relative bg-black/40 shadow shadow-white text-white rounded-lg p-4 mb-4 border-l-4 transition-all
      ${status === 'Booked' ? 'border-yellow-600' : 
        status === 'Assigned' ? 'border-orange-600' : 
        status === 'Completed' ? 'border-green-600' : 
        status === 'Cancelled' ? 'border-red-600' : 
        status === 'No-Show' ? 'border-gray-600' :
        'border-black'}`}
    >
      <div className="mb-2">
        <span className="font-semibold">Selected Service:</span>{" "}
        {service}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Date:</span>{" "}
        {date}
      </div>
      <div>
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`font-medium px-2 py-1 rounded-full text-sm ${
            status === "Booked"
            ? "bg-yellow-100 text-yellow-600"
            : status === 'Assigned' ? "bg-orange-100 text-orange-600" 
            : status === 'Completed' ? "bg-green-100 text-green-600"
            : status === 'Cancelled' ? "bg-red-100 text-red-600"
            : status === 'No-Show' ? "bg-gray-200 text-gray-600"
            : 'bg-black text-white'
          }`}
        >
          {status}
        </span>
      </div>
      
      {status === "Booked" && (
        <button
          className="absolute top-1/2 right-5 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm transition"
          onClick={onCancel}
        >
          <span className='font-bold mr-1'>X</span> Cancel
        </button>
      )}
    </div>
  )
}