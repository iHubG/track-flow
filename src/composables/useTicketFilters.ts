import { ref, computed, watch } from "vue";
import type { TicketPreview } from "@/types";

export function useTicketFilters(tickets: any) {
  const filterStatus = ref("all");
  const filterPriority = ref("all");
  const filterSearch = ref("");
  const debouncedSearch = ref("");
  const messageResult = ref("");

  let timeout: number;

  watch(filterSearch, (val) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedSearch.value = val;
    }, 300);
  });

  const filteredTickets = computed(() => {
    const results = tickets.value.filter((t: TicketPreview) => {
      const statusMatch =
        filterStatus.value === "all" || t.status === filterStatus.value;

      const priorityMatch =
        filterPriority.value === "all" || t.priority === filterPriority.value;

      const searchMatch =
        !debouncedSearch.value ||
        t.title.toLowerCase().includes(debouncedSearch.value.toLowerCase()) ||
        t.description
          .toLowerCase()
          .includes(debouncedSearch.value.toLowerCase());

      return statusMatch && priorityMatch && searchMatch;
    });

    messageResult.value =
      results.length === 0 ? "No tickets found matching your filters." : "";

    return results;
  });

  return {
    filterStatus,
    filterPriority,
    filterSearch,
    filteredTickets,
    messageResult,
  };
}
