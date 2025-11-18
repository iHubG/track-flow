import api from "./axios";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UserStatus,
} from "@/types";

// ======================================
// 🔹 Fetch ALL users (Admin dashboard)
// ======================================
export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/api/users");
  return response.data;
};

// ======================================
// 🔹 Fetch a SINGLE user by ID
// ======================================
export const getUserById = async (userId: number): Promise<User> => {
  const response = await api.get<User>(`/api/users/${userId}`);
  return response.data;
};

// ======================================
// 🔹 Create a NEW user
// ======================================
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const response = await api.post<User>("/api/users", payload);
  return response.data;
};

// ======================================
// 🔹 Update existing user
// ======================================
export const updateUser = async (
  userId: number,
  payload: UpdateUserPayload
): Promise<User> => {
  const response = await api.put<User>(`/api/users/${userId}`, payload);
  return response.data;
};

// ======================================
// 🔹 Update ONLY user status
//     e.g. active / inactive toggle
// ======================================
export const updateUserStatus = async (
  userId: number,
  status: UserStatus
): Promise<User> => {
  const response = await api.put<User>(`/api/users/${userId}/status`, {
    status,
  });
  return response.data;
};

// ======================================
// 🔹 Delete a user
// ======================================
export const deleteUser = async (
  userId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/users/${userId}`
  );
  return response.data;
};
