// src/composables/useAssignedTickets.ts
import { ref } from "vue";
import { getTicketsBySupportUser } from "@/api/ticket";
import type { TicketPreview } from "@/types/ticket";

const assignedTicketsCache: Record<number, any[]> = {};
const assignedTicketsFetched: Record<number, boolean> = {};

export function useAssignedTickets(supportUserId: number, autoFetch = false) {
  const tickets = ref<TicketPreview[]>(
    assignedTicketsCache[supportUserId] || []
  );
  const loading = ref(false);

  async function fetchAssignedTickets() {
    if (assignedTicketsFetched[supportUserId]) {
      return tickets.value;
    }

    loading.value = true;
    try {
      const response = await getTicketsBySupportUser(supportUserId);

      tickets.value = response;
      assignedTicketsCache[supportUserId] = response;
      assignedTicketsFetched[supportUserId] = true;

      console.log("Fetched assigned tickets:", tickets.value);
    } catch (err) {
      console.error("Failed to fetch assigned tickets:", err);
      tickets.value = [];
    } finally {
      loading.value = false;
    }
  }

  // Use autoFetch
  if (autoFetch && !assignedTicketsFetched[supportUserId]) {
    fetchAssignedTickets();
  }

  const refreshAssignedTickets = async () => {
    assignedTicketsFetched[supportUserId] = false;
    await fetchAssignedTickets();
  };

  return { tickets, loading, fetchAssignedTickets, refreshAssignedTickets };
}
