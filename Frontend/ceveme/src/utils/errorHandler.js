export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.errorCode) {
    return `Error: ${error.response.data.errorCode}`;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};

export const handleApiError = (error, customMessage = null) => {
  const message = customMessage || getErrorMessage(error);
  console.error("API Error:", error);
  return message;
};
