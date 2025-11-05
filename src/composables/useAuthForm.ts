// src/composables/useAuthForm.ts
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";

export function useAuthForm(mode: "login" | "register") {
  const { login, register, loading } = useAuth();

  const name = ref("");
  const email = ref("");
  const remember = ref(false);
  const password = ref("");
  const confirmPassword = ref("");
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const errors = ref<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "register") {
      if (!name.value) newErrors.name = "Name is required.";
      else if (name.value.length < 2)
        newErrors.name = "Name must be at least 2 characters long.";
    }

    if (!email.value) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email.value))
      newErrors.email = "Enter a valid email address.";

    if (!password.value) newErrors.password = "Password is required.";
    else if (password.value.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";

    if (mode === "register") {
      if (!confirmPassword.value)
        newErrors.confirmPassword = "Please confirm your password.";
      else if (confirmPassword.value !== password.value)
        newErrors.confirmPassword = "Passwords do not match.";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (mode === "register") {
        await register(name.value, email.value, password.value);
      } else {
        await login(email.value, password.value, remember.value);
      }

      // Reset
      name.value = "";
      email.value = "";
      remember.value = false;
      password.value = "";
      confirmPassword.value = "";
      errors.value = {};
    } catch (err) {
      // Optional: if `useAuth` provides global error messages
      console.error("❌ Auth failed:", err);
    }
  };

  return {
    name,
    email,
    remember,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    loading,
    errors,
    handleSubmit,
  };
}
