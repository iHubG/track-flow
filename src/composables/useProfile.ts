// src/composables/useProfile.ts
import { ref, computed } from "vue";
import {
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
} from "@/api/profile";
import type { UpdateProfilePayload, ChangePasswordPayload } from "@/types";
import { useAuth } from "@/composables/useAuth";
import { useUserTickets } from "@/composables/useTicket";

interface ProfileErrors {
  name?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
  general?: string;
}

export function useProfile() {
  // Profile form fields
  const name = ref("");

  // Password form fields
  const currentPassword = ref("");
  const newPassword = ref("");
  const newPasswordConfirmation = ref("");

  // UI state
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);
  const showNewPasswordConfirmation = ref(false);
  const isLoadingProfile = ref(false);
  const isLoadingPassword = ref(false);
  const isLoadingDelete = ref(false);
  const errors = ref<ProfileErrors>({});
  const successMessage = ref("");

  // Computed
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  const isProfileValid = computed(() => {
    return name.value.trim().length >= 2;
  });

  const isPasswordValid = computed(() => {
    return (
      currentPassword.value.length >= 8 &&
      newPassword.value.length >= 8 &&
      newPasswordConfirmation.value.length >= 8
    );
  });

  // Validation for profile update
  const validateProfile = (): boolean => {
    const newErrors: ProfileErrors = {};

    if (!name.value.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.value.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  // Validation for password change
  const validatePassword = (): boolean => {
    const newErrors: ProfileErrors = {};

    if (!currentPassword.value) {
      newErrors.current_password = "Current password is required.";
    } else if (currentPassword.value.length < 8) {
      newErrors.current_password =
        "Password must be at least 8 characters long.";
    }

    if (!newPassword.value) {
      newErrors.new_password = "New password is required.";
    } else if (newPassword.value.length < 8) {
      newErrors.new_password =
        "New password must be at least 8 characters long.";
    } else if (newPassword.value === currentPassword.value) {
      newErrors.new_password =
        "New password must be different from current password.";
    }

    if (!newPasswordConfirmation.value) {
      newErrors.new_password_confirmation = "Please confirm your new password.";
    } else if (newPasswordConfirmation.value !== newPassword.value) {
      newErrors.new_password_confirmation = "Passwords do not match.";
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

  // Reset profile form
  const resetProfileForm = () => {
    name.value = "";
    errors.value = {};
    successMessage.value = "";
  };

  // Reset password form
  const resetPasswordForm = () => {
    currentPassword.value = "";
    newPassword.value = "";
    newPasswordConfirmation.value = "";
    errors.value = {};
    successMessage.value = "";
  };

  // Handle profile update
  const handleUpdateProfile = async (): Promise<boolean> => {
    if (!validateProfile()) return false;

    isLoadingProfile.value = true;
    errors.value = {};
    successMessage.value = "";

    try {
      const payload: UpdateProfilePayload = {
        name: name.value.trim(),
      };

      const response = await updateUserProfile(payload);

      successMessage.value =
        response.message || "Profile updated successfully!";
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      errors.value.general = errorMessage;
      console.error("❌ Profile update failed:", err);
      return false;
    } finally {
      isLoadingProfile.value = false;
    }
  };

  // Handle password change
  const handleChangePassword = async (): Promise<boolean> => {
    if (!validatePassword()) return false;

    isLoadingPassword.value = true;
    errors.value = {};
    successMessage.value = "";

    try {
      const payload: ChangePasswordPayload = {
        current_password: currentPassword.value,
        new_password: newPassword.value,
        new_password_confirmation: newPasswordConfirmation.value,
      };

      const response = await changeUserPassword(payload);

      successMessage.value =
        response.message || "Password changed successfully!";

      // Clear password fields after successful update
      resetPasswordForm();

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      errors.value.general = errorMessage;
      console.error("❌ Password change failed:", err);
      return false;
    } finally {
      isLoadingPassword.value = false;
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (): Promise<boolean> => {
    isLoadingDelete.value = true;
    errors.value = {};

    try {
      await deleteUserAccount();

      // ⚠️ FIX: Clear all user data and session
      const { user } = useAuth(); // Import useAuth
      const { clearTickets } = useUserTickets(); // Import useTickets

      // Clear user state
      user.value = null;
      localStorage.removeItem("user");

      // Clear tickets cache
      clearTickets();

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("dashboard_data");

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      errors.value.general = errorMessage;
      console.error("❌ Account deletion failed:", err);
      return false;
    } finally {
      isLoadingDelete.value = false;
    }
  };
  return {
    // Profile form fields
    name,

    // Password form fields
    currentPassword,
    newPassword,
    newPasswordConfirmation,

    // UI state
    showCurrentPassword,
    showNewPassword,
    showNewPasswordConfirmation,
    isLoadingProfile,
    isLoadingPassword,
    isLoadingDelete,
    errors,
    successMessage,

    // Computed
    hasErrors,
    isProfileValid,
    isPasswordValid,

    // Methods
    handleUpdateProfile,
    handleChangePassword,
    handleDeleteAccount,
    validateProfile,
    validatePassword,
    clearError,
    resetProfileForm,
    resetPasswordForm,
  };
}
