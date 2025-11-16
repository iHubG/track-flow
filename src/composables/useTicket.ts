import { ref, watch } from "vue";
import type { TicketPreview } from "@/types";
import { getUserTickets, getAllTickets } from "@/api/ticket";
import { useAuth } from "@/composables/useAuth";

const tickets = ref<TicketPreview[]>([]);
const loading = ref(false);
const lastFetchedUserId = ref<number | null>(null);
const lastFetchType = ref<"user" | "all" | null>(null);

export function useTickets(fetchAll = false) {
  const { user } = useAuth();

  // ⚠️ ADD: Watch for user changes and clear tickets
  watch(user, (newUser, oldUser) => {
    if (newUser?.id !== oldUser?.id) {
      // User changed, clear cached data
      tickets.value = [];
      lastFetchedUserId.value = null;
      lastFetchType.value = null;
    }
  });

  const fetchTickets = async () => {
    const currentUserId = user.value?.id;
    const currentFetchType = fetchAll ? "all" : "user";

    // Only skip fetch if same user, same fetch type, and already have data
    if (
      lastFetchedUserId.value === currentUserId &&
      lastFetchType.value === currentFetchType &&
      tickets.value.length > 0
    ) {
      return tickets.value;
    }

    // Don't fetch if no user is logged in
    if (!currentUserId) {
      tickets.value = [];
      return;
    }

    loading.value = true;
    try {
      // Fetch based on fetchAll parameter
      const response = fetchAll
        ? await getAllTickets()
        : await getUserTickets();

      tickets.value = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];

      lastFetchedUserId.value = currentUserId;
      lastFetchType.value = currentFetchType;
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      tickets.value = [];
    } finally {
      loading.value = false;
    }
  };

  const refreshTickets = async () => {
    lastFetchedUserId.value = null;
    lastFetchType.value = null;
    await fetchTickets();
  };

  const clearTickets = () => {
    tickets.value = [];
    lastFetchedUserId.value = null;
    lastFetchType.value = null;
  };

  return { tickets, fetchTickets, refreshTickets, clearTickets, loading };
}
