import { ref } from "vue";
import type { TicketPreview } from "@/types";
import { getUserTickets } from "@/api/ticket";

const tickets = ref<TicketPreview[]>([]);
const hasFetched = ref(false);
const loading = ref(false);

export function useTickets() {
  const fetchTickets = async () => {
    if (hasFetched.value) return tickets.value;

    loading.value = true;
    try {
      const response = await getUserTickets();
      tickets.value = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];

      hasFetched.value = true;
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      loading.value = false;
    }
  };

  const refreshTickets = async () => {
    hasFetched.value = false;
    await fetchTickets();
  };

  return { tickets, fetchTickets, refreshTickets, loading };
}
