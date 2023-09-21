export async function fetchData<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorResponse = await response.text();
    const errorMessage = JSON.parse(errorResponse).error;
    throw new Error(errorMessage);
  }

  const responseData = await response.json();

  return responseData as T;
}
