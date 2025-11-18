// src/composables/useUsers.ts
import { ref } from "vue";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/user";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/api/users";

const users = ref<User[]>([]);
const loading = ref(false);
const lastFetched = ref(false); // cache control

export function useUsers(autoFetch = false) {
  if (autoFetch && !lastFetched.value) {
    fetchUsers();
  }
  /** ───────────────────────────────
   *  Fetch all users (Admin view)
   *  Prevents duplicate fetches unless refreshed manually
   * ─────────────────────────────── */
  async function fetchUsers() {
    if (lastFetched.value && users.value.length > 0) {
      return users.value; // return cached
    }

    loading.value = true;
    try {
      const response = await getAllUsers();
      users.value = response;
      lastFetched.value = true;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      users.value = [];
    } finally {
      loading.value = false;
    }
  }

  /** ───────────────────────────────
   *  Force a fresh API call
   * ─────────────────────────────── */
  const refreshUsers = async () => {
    lastFetched.value = false;
    await fetchUsers();
  };

  /** ───────────────────────────────
   *  CRUD OPERATIONS
   * ─────────────────────────────── */

  const addUser = async (payload: CreateUserPayload) => {
    try {
      const newUser = await createUser(payload);
      users.value.push(newUser);
      return newUser;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  const editUser = async (id: number, payload: UpdateUserPayload) => {
    try {
      const updated = await updateUser(id, payload);
      const index = users.value.findIndex((u) => u.id === id);

      if (index !== -1) {
        users.value[index] = updated;
      }

      return updated;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const removeUser = async (id: number) => {
    try {
      await deleteUser(id);
      users.value = users.value.filter((u) => u.id !== id);
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  /** ───────────────────────────────
   *  Clear cached data (logout, etc.)
   * ─────────────────────────────── */
  const clearUsers = () => {
    users.value = [];
    lastFetched.value = false;
  };

  return {
    users,
    fetchUsers,
    refreshUsers,
    addUser,
    editUser,
    removeUser,
    clearUsers,
    loading,
  };
}
