// Define a generic ApiResponse interface
export interface ApiResponse<T> {
  data: T;
  status: number;
}

// Define a generic async function for fetching data from a specified URL
export async function fetchData<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  // Use the Fetch API to make an HTTP request
  const response = await fetch(url, {
    credentials: "include", // Include credentials like cookies in the request
    headers: {
      "Content-Type": "application/json", // Set content type to JSON
      ...options?.headers, // Include any additional headers passed as options
    },
    ...options, // Include other options such as method, body, etc.
  });

  // Check if the response status is not OK (HTTP status code not in the range 200-299)
  if (!response.ok) {
    // Parse the error response as text
    const errorResponse = await response.text();

    // Parse the error message from the JSON response
    const errorMessage = JSON.parse(errorResponse).error;

    // Throw an error with the parsed error message
    throw new Error(errorMessage);
  }

  // If the response is OK, parse the JSON data from the response
  const responseData = await response.json();

  // Return an object containing the parsed data and the response status
  return {
    data: responseData as T,
    status: response.status,
  };
}
