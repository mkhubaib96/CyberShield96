// Configure your PC server URL here or via VITE_API_URL environment variable
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface VerifyResponse {
  valid: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    console.error('[API Error]', errorMsg);
    throw new Error(errorMsg);
  }
  return data as T;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const url = `${API_BASE_URL}/auth/register`;
  console.log(`[API] Attempting POST to: ${url}`);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(response);
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const url = `${API_BASE_URL}/auth/login`;
  console.log(`[API] Attempting POST to: ${url}`);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(response);
}

export async function verifyToken(token: string): Promise<VerifyResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<VerifyResponse>(response);
}
