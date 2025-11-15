import { ref, watch } from "vue";
import type { TicketPreview } from "@/types";
import { getUserTickets } from "@/api/ticket";
import { useAuth } from "@/composables/useAuth";

const tickets = ref<TicketPreview[]>([]);
const loading = ref(false);
const lastFetchedUserId = ref<number | null>(null);

export function useTickets() {
  const { user } = useAuth();

  // ⚠️ ADD: Watch for user changes and clear tickets
  watch(user, (newUser, oldUser) => {
    if (newUser?.id !== oldUser?.id) {
      // User changed, clear cached data
      tickets.value = [];
      lastFetchedUserId.value = null;
    }
  });

  const fetchTickets = async () => {
    const currentUserId = user.value?.id;

    // Only skip fetch if same user and already have data
    if (lastFetchedUserId.value === currentUserId && tickets.value.length > 0) {
      return tickets.value;
    }

    // Don't fetch if no user is logged in
    if (!currentUserId) {
      tickets.value = [];
      return;
    }

    loading.value = true;
    try {
      const response = await getUserTickets();
      tickets.value = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];

      lastFetchedUserId.value = currentUserId;
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      tickets.value = [];
    } finally {
      loading.value = false;
    }
  };

  const refreshTickets = async () => {
    lastFetchedUserId.value = null;
    await fetchTickets();
  };

  const clearTickets = () => {
    tickets.value = [];
    lastFetchedUserId.value = null;
  };

  return { tickets, fetchTickets, refreshTickets, clearTickets, loading };
}
