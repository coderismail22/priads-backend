import { TErrorSources, TGenericErrorResponse } from "../interface/error";

type MongoDuplicateKeyError = {
  index: number;
  code: number; // Usually 11000 for duplicate key errors
  keyPattern: Record<string, number>; // Example: { email: 1 }
  keyValue: Record<string, string>; // Example: { email: "test@example.com" }
  message: string; // The raw error message from MongoDB
};

const handleDuplicateError = (
  err: MongoDuplicateKeyError,
): TGenericErrorResponse => {
  // Extract field name and value from the error
  const duplicateField = Object.keys(err.keyValue)[0]; // Get the field causing the error
  const duplicateValue = err.keyValue[duplicateField]; // Get the duplicate value

  // Format the error message
  const errorMessage = `${duplicateField} ${duplicateValue} already exists.`;

  const errorSources: TErrorSources = [
    {
      path: duplicateField, // Set the path to the specific field causing the error
      message: errorMessage,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate key error",
    errorSources,
  };
};

export default handleDuplicateError;
