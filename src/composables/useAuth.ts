import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { loginUser, registerUser, logoutUser, getAuthUser } from "@/api/auth";
import { useToast } from "vue-toastification";

// Shared state (persists across component instances)
const user = ref<any>(null);
const loading = ref(false);

export function useAuth() {
  const router = useRouter();
  const toast = useToast();

  const isAuthenticated = computed(() => !!user.value);

  // 🔹 Login
  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const data = await loginUser(email, password);
      user.value = data.user;

      toast.success("Logged in successfully!");

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "support") {
        router.push("/support/dashboard");
      } else {
        router.push("/user");
      }

      return data;
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
      const data = await registerUser(name, email, password);
      user.value = data.user;

      toast.success("Account created successfully!");

      // Always redirect to onboarding after registration
      router.push("/onboarding");

      return data;
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
      user.value = null;
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error("Logout failed. Please try again.");
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 🔹 Fetch authenticated user
  const fetchUser = async () => {
    loading.value = true;
    try {
      const data = await getAuthUser();
      user.value = data;
      return data;
    } catch (error: any) {
      user.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // 🔹 Check authentication status
  const checkAuth = async () => {
    if (user.value) return true;

    try {
      await fetchUser();
      return true;
    } catch (error) {
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
