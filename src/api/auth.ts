import api from "./axios";

// Helper to ensure CSRF cookie is set before any POST request
const getCsrfCookie = async () => {
  await api.get("/sanctum/csrf-cookie");
};

// 🔹 Register User
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    await getCsrfCookie();

    const response = await api.post("/api/register", {
      name,
      email,
      password,
      password_confirmation: password,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🔹 Login User
export const loginUser = async (
  email: string,
  password: string,
  remember = false
) => {
  try {
    await getCsrfCookie();

    const response = await api.post("/api/login", {
      email,
      password,
      remember,
    });

    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Get Authenticated User
export const getAuthUser = async () => {
  try {
    // Always ensure CSRF is ready before fetching user
    await getCsrfCookie();

    const response = await api.get("/api/user");
    return response.data;
  } catch (error: any) {
    // If unauthorized, just return null instead of throwing
    if (error.response?.status === 401) {
      console.warn("User not authenticated yet");
      return null;
    }

    console.error("Get user failed:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Logout User
export const logoutUser = async () => {
  try {
    const response = await api.post("/api/logout");
    return response.data;
  } catch (error: any) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error;
  }
};
