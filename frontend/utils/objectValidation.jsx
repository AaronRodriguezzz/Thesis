export const isFormValid = (formObject, excludedFields = []) => {
  return Object.entries(formObject).every(([key, value]) => {
    if (excludedFields.includes(key)) return true; // skip optional fields
    return value !== '' && value !== null && value !== undefined;
  });
};