export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(
  path,
  { method = "GET", body, auth = true } = {},
) {
  const headers = {};
  if (!(body instanceof FormData) && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const token = auth ? localStorage.getItem("mmr_token") : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(path, {
      method,
      headers,
      body:
        body instanceof FormData
          ? body
          : body === undefined
            ? undefined
            : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(
      "Cannot reach the API server. Please check your connection or restart the backend.",
      0,
      null,
    );
  }

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed (${response.status}).`,
      response.status,
      data,
    );
  }

  return data;
}
