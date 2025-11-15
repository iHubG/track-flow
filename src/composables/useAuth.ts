import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { loginUser, registerUser, logoutUser, getAuthUser } from "@/api/auth";
import { useToast } from "vue-toastification";

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
      const response = await registerUser(name, email, password);

      // ⚠️ FIX: Set user data immediately from response
      if (response?.user) {
        user.value = response.user;
      } else {
        // Fetch user to ensure we have the correct data
        await fetchUser();
      }

      toast.success("Account created successfully!");

      // ⚠️ FIX: Small delay to ensure session is fully established
      await new Promise((resolve) => setTimeout(resolve, 100));

      await router.push("/user/dashboard");
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
      await logoutUser(); // This should clear the session on backend
    } catch (error: any) {
      console.error("Logout API failed:", error);
      // Don't throw - we still want to clear local state
    } finally {
      // Always clear user data regardless of API success
      user.value = null;
      localStorage.removeItem("user");

      // ⚠️ ADD THIS: Clear Laravel session cookies
      document.cookie =
        "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "laravel_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      toast.success("Logged out successfully!");
      loading.value = false;

      router.push("/login");
    }
  };

  const fetchUser = async () => {
    try {
      const data = await getAuthUser();
      user.value = data;
      return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("User not authenticated yet — skipping");
        user.value = null;
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
