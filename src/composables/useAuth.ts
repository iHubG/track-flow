import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { loginUser, registerUser, logoutUser, getAuthUser } from "@/api/auth";
import { useToast } from "vue-toastification";

let hasFetchedUser = false;

const user = ref<any>(JSON.parse(localStorage.getItem("user") || "null"));
const loading = ref(false);

watch(user, (newVal) => {
  if (newVal) localStorage.setItem("user", JSON.stringify(newVal));
  else localStorage.removeItem("user");
});

export function useAuth() {
  const router = useRouter();
  const toast = useToast();

  const isAuthenticated = computed(() => !!user.value);

  // 🔹 Login
  const login = async (email: string, password: string, remember: boolean) => {
    loading.value = true;
    try {
      await loginUser(email, password, remember);
      await fetchUser();

      toast.success("Logged in successfully!");

      const role = user.value?.role;
      switch (role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "support":
          router.push("/support/dashboard");
          break;
        default:
          router.push("/user/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 🔹 Register
  const register = async (name: string, email: string, password: string) => {
    loading.value = true;
    try {
      await registerUser(name, email, password);
      await fetchUser();

      toast.success("Account created successfully!");
      router.push("/user/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    loading.value = true;
    try {
      await logoutUser();
    } catch (error: any) {
      console.error("Logout API failed:", error);
      // Don't throw - we still want to clear local state
    } finally {
      // Always clear user data regardless of API success
      user.value = null;
      localStorage.removeItem("user");
      router.push("/login");
      toast.success("Logged out successfully!");
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    // ✅ Only skip if we already fetched successfully
    if (hasFetchedUser && user.value) return user.value;

    hasFetchedUser = true;

    try {
      const data = await getAuthUser();
      user.value = data;
      return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("User not authenticated yet — skipping");
        user.value = null;
        hasFetchedUser = false;
        return null;
      }
      console.error("Fetch user failed:", error);
      throw error;
    }
  };

  // 🔹 Check authentication status
  const checkAuth = async () => {
    if (user.value) return true;
    try {
      await fetchUser();
      return true;
    } catch {
      return false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    checkAuth,
  };
}
