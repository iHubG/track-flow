// src/composables/useProfile.ts
import { ref, computed } from "vue";

interface ProfileErrors {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  general?: string;
}

interface UpdateProfilePayload {
  name: string;
  currentPassword: string;
  newPassword: string;
}

export function useProfile() {
  // Form fields
  const name = ref("");
  const currentPassword = ref("");
  const newPassword = ref("");

  // UI state
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const isLoading = ref(false);
  const errors = ref<ProfileErrors>({});
  const successMessage = ref("");

  // Computed
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  const isFormValid = computed(() => {
    return (
      name.value.length >= 2 &&
      currentPassword.value.length >= 8 &&
      newPassword.value.length >= 8
    );
  });

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ProfileErrors = {};

    // Name validation
    if (!name.value.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.value.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    // Current password validation
    if (!currentPassword.value) {
      newErrors.currentPassword = "Current password is required.";
    } else if (currentPassword.value.length < 8) {
      newErrors.currentPassword =
        "Password must be at least 8 characters long.";
    }

    // New password validation
    if (!newPassword.value) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.value.length < 8) {
      newErrors.newPassword =
        "New password must be at least 8 characters long.";
    } else if (newPassword.value === currentPassword.value) {
      newErrors.newPassword =
        "New password must be different from current password.";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  // Clear specific field error
  const clearError = (field: keyof ProfileErrors) => {
    if (errors.value[field]) {
      delete errors.value[field];
    }
  };

  // Reset form
  const resetForm = () => {
    name.value = "";
    currentPassword.value = "";
    newPassword.value = "";
    errors.value = {};
    successMessage.value = "";
  };

  // API call - replace with your actual backend endpoint
  const updateProfile = async (payload: UpdateProfilePayload) => {
    // TODO: Replace with your actual API call
    const response = await fetch("/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add auth token if needed
        // "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return response.json();
  };

  // Handle profile update
  const handleUpdate = async () => {
    if (!validateForm()) return false;

    isLoading.value = true;
    errors.value = {};
    successMessage.value = "";

    try {
      const payload: UpdateProfilePayload = {
        name: name.value.trim(),
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      };

      await updateProfile(payload);

      successMessage.value = "Profile updated successfully!";

      // Clear sensitive data but keep name
      currentPassword.value = "";
      newPassword.value = "";

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      errors.value.general = errorMessage;
      console.error("❌ Profile update failed:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // Form fields
    name,
    currentPassword,
    newPassword,

    // UI state
    showCurrentPassword,
    showNewPassword,
    isLoading,
    errors,
    successMessage,

    // Computed
    hasErrors,
    isFormValid,

    // Methods
    handleUpdate,
    validateForm,
    clearError,
    resetForm,
  };
}
