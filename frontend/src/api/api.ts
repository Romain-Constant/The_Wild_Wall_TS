// Defines a generic ApiResponse interface with a generic type 'T'
export interface ApiResponse<T> {
  data: T; // Property to hold the data of type 'T'
  status: number; // Property to hold the HTTP status code
}

// Asynchronous function to fetch data from a specified URL with optional request options
export async function fetchData<T>(
  url: string, // The URL to fetch data from
  options?: RequestInit, // Optional request options
): Promise<ApiResponse<T>> {
  // Returns a Promise with ApiResponse of type 'T'
  // Performs the actual fetch operation using the Fetch API
  const response = await fetch(url, {
    credentials: "include", // Includes credentials like cookies in the request
    headers: {
      "Content-Type": "application/json", // Sets the content type to JSON
      ...options?.headers, // Merges additional headers from options
    },
    ...options, // Merges other options with the request
  });

  // Checks if the response is not okay (HTTP status code outside the 2xx range)
  if (!response.ok) {
    // Retrieves the error message from the response
    const errorResponse = await response.text();

    // Parses the error message as JSON to extract the 'error' property
    const errorMessage = JSON.parse(errorResponse).error;

    // Throws an error with the extracted error message
    throw new Error(errorMessage);
  }

  // Parses the response body as JSON
  const responseData = await response.json();

  // Constructs and returns an ApiResponse object with the data and status
  return {
    data: responseData as T, // Casts the response data to the generic type 'T'
    status: response.status, // Retrieves the HTTP status code
  };
}
