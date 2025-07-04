export const dateTimeFormat = (date) => {
    const hours = date.getHours();
    const rawHours = hours % 12 || 12;
    const formattedHours = rawHours.toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const minutes = date.getMinutes().toString().padStart(2, "0");
    
    return `${formattedHours}:${minutes} ${ampm}`;
};