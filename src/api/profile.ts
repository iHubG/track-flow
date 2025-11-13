// src/api/profile.ts
import api from "./axios";
import type {
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
  ApiResponse,
} from "@/types";

const getCsrfCookie = async () => {
  await api.get("/sanctum/csrf-cookie");
};

/**
 * ✅ Update user's profile (e.g., name)
 */
export const updateUserProfile = async (
  data: UpdateProfilePayload
): Promise<ApiResponse<User>> => {
  try {
    await getCsrfCookie();

    const response = await api.put<ApiResponse<User>>(
      "/api/user/profile",
      data
    );
    return response.data;
  } catch (error: any) {
    // You can add better error handling later
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

/**
 * 🔒 Change user's password
 */
export const changeUserPassword = async (
  data: ChangePasswordPayload
): Promise<ApiResponse<null>> => {
  try {
    await getCsrfCookie();

    const response = await api.put<ApiResponse<null>>(
      "/api/user/change-password",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }
};

/**
 * 🗑️ Delete user's account
 */
export const deleteUserAccount = async (): Promise<ApiResponse<null>> => {
  try {
    await getCsrfCookie();

    const response = await api.delete<ApiResponse<null>>("/api/user/delete");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account"
    );
  }
};
