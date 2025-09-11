export const timeFormat = (time) => {
    const hours = time.getHours();
    const rawHours = hours % 12 || 12;
    const formattedHours = rawHours.toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const minutes = time.getMinutes().toString().padStart(2, "0");
    
    return `${formattedHours}:${minutes} ${ampm}`;
};

export const appointmentTimeFormat = (hours) => {
    let ampm = hours >= 12 ? "PM" : "AM";

    if( hours >= 12) {
        hours = hours - 12;
    }
    return `${hours}:00 ${ampm}`;
}