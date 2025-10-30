// src/composables/useTickets.ts
import { ref, onMounted } from "vue";
import type { TicketPreview, CreateTicketPayload } from "@/types";
import { useToast } from "vue-toastification";

export function useTickets() {
  const tickets = ref<TicketPreview[]>([]);
  const isLoading = ref(false);
  const toast = useToast();

  // ✅ Dummy data (for now, frontend only)
  const dummyTickets: TicketPreview[] = [
    {
      id: 101,
      title: "Cannot upload profile image",
      status: "in_progress",
      priority: "medium",
      created_at: "2025-10-20T08:45:00Z",
    },
    {
      id: 102,
      title: "Mobile login not working",
      status: "open",
      priority: "high",
      created_at: "2025-10-22T11:00:00Z",
    },
    {
      id: 103,
      title: "Feature request: Dark mode",
      status: "closed",
      priority: "low",
      created_at: "2025-10-25T09:30:00Z",
    },
  ];

  /**
   * ✅ Fetch all tickets (simulate API for now)
   */
  const fetchTickets = async () => {
    try {
      isLoading.value = true;
      // Simulate backend delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      tickets.value = dummyTickets;
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      toast.error("Failed to load tickets.");
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * ✅ Create a new ticket (frontend-only version)
   */
  const createTicket = (data: CreateTicketPayload) => {
    const newTicket: TicketPreview = {
      id: Date.now(),
      title: data.title,
      status: "open",
      priority: data.priority,
      created_at: new Date().toISOString(),
    };

    tickets.value.unshift(newTicket);
    toast.success("Ticket created successfully!");
  };

  onMounted(fetchTickets);

  return {
    tickets,
    isLoading,
    fetchTickets,
    createTicket,
  };
}
