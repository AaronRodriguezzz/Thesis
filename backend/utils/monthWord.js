 const monthNumberToWord = (monthNum) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (monthNum < 1 || monthNum > 12) {
    throw new Error("Month number must be between 1 and 12");
  }

  return months[monthNum - 1];
}

module.exports = monthNumberToWord