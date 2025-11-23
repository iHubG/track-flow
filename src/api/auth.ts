import api from "./axios";
import { initializeEcho } from "@/bootstrap";

// 🔹 Register User
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
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
    const response = await api.post("/api/login", {
      email,
      password,
      remember,
    });

    // Store token and user
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    console.log("Token stored:", response.data.token);

    initializeEcho();

    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// 🔹 Get Authenticated User
export const getAuthUser = async () => {
  try {
    const response = await api.get("/api/user");
    return response.data;
  } catch (error: any) {
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

    // Clear stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Disconnect Echo
    if (window.Echo) {
      window.Echo.disconnect();
      window.Echo = undefined;
    }

    return response.data;
  } catch (error: any) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error;
  }
};
