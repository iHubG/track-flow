import { ref } from "vue";
import { createUser } from "@/api/users"; // <-- import your API
import type { UserRole, CreateUserPayload } from "@/types";

export function useCreateUser() {
  const name = ref("");
  const email = ref("");
  const role = ref<UserRole | "">("");
  const password = ref("");
  const confirmPassword = ref("");
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const errors = ref<Record<string, string>>({});
  const loading = ref(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.value) newErrors.name = "Name is required.";
    else if (name.value.length < 2)
      newErrors.name = "Name must be at least 2 characters.";

    if (!email.value) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email.value))
      newErrors.email = "Enter a valid email address.";

    if (!role.value) newErrors.role = "Role is required.";

    if (!password.value) newErrors.password = "Password is required.";
    else if (password.value.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    if (!confirmPassword.value)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (confirmPassword.value !== password.value)
      newErrors.confirmPassword = "Passwords do not match.";

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    loading.value = true;

    try {
      const payload: CreateUserPayload = {
        name: name.value,
        email: email.value,
        role: role.value as UserRole,
        password: password.value,
      };

      const user = await createUser(payload);

      // Reset form
      name.value = "";
      email.value = "";
      role.value = "";
      password.value = "";
      confirmPassword.value = "";
      errors.value = {};

      return user; // <-- Return user so parent receives it
    } catch (error) {
      console.error("❌ Failed to create user:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    name,
    email,
    role,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    errors,
    loading,
    handleSubmit,
  };
}
