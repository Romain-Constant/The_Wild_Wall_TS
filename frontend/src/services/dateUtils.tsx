// dateUtils.js
const formatDate = (dateString: string): string => {
  // Convert the date string to a Date object
  const date = new Date(dateString);

  // Extract day, month, and year components from the Date object
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  // Create and return the formatted date string in dd/mm/yy format
  return `${day}/${month}/${year}`;
};

// Export the formatDate function for use in other parts of the application
export default formatDate;
