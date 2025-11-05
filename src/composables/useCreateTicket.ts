// composables/useCreateTicket.ts
import { ref } from "vue";
import type { TicketPriority } from "@/types";
import { createTicket } from "@/api/ticket";

export function useCreateTicket() {
  const title = ref("");
  const description = ref("");
  const priority = ref<TicketPriority | "">("");
  const errors = ref<{
    title?: string;
    description?: string;
    priority?: string;
  }>({});
  const loading = ref(false);

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      priority?: string;
    } = {};

    if (!title.value.trim()) newErrors.title = "Title is required.";
    else if (title.value.length < 5)
      newErrors.title = "Title must be at least 5 characters.";

    if (!description.value.trim())
      newErrors.description = "Description is required.";

    if (!priority.value) newErrors.priority = "Priority is required.";
    else if (!["low", "medium", "high"].includes(priority.value)) {
      newErrors.priority = "Invalid priority selected.";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return null;
    loading.value = true;

    try {
      const response = await createTicket({
        title: title.value,
        description: description.value,
        priority: priority.value as TicketPriority,
      });

      const newTicket = response.data || response;

      // ✅ Ensure status exists (default to 'open' if missing)
      if (!newTicket.status) {
        newTicket.status = "open";
      }

      // Reset form
      title.value = "";
      description.value = "";
      priority.value = "";
      errors.value = {};

      return newTicket;
    } catch (error: any) {
      console.error(
        "Ticket creation failed:",
        error.response?.data || error.message
      );
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors;
      }
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    title,
    description,
    priority,
    errors,
    loading,
    handleSubmit,
  };
}
