let baseURL;

const useMock = import.meta.env.VITE_USE_MOCK_API === "true";

if (import.meta.env.PROD || !useMock) {
  baseURL = import.meta.env.VITE_API_BASE_URL;
} else {
  baseURL = import.meta.env.VITE_MOCK_API_BASE_URL;
}

export const API_BASE_URL = baseURL;
