import { ref } from "vue";
import { useToast } from "vue-toastification";
import { deleteTicket, updateTicket } from "@/api/ticket";
import type { TicketPreview, TicketStatus } from "@/types";

export function useTicketActions(tickets: any) {
  const toast = useToast();

  const isDeleteDialogOpen = ref(false);
  const ticketToDelete = ref<number | null>(null);

  const handleDeleteTicket = (id: number) => {
    ticketToDelete.value = id;
    isDeleteDialogOpen.value = true;
  };

  const confirmDelete = async () => {
    if (!ticketToDelete.value) return;

    try {
      await deleteTicket(ticketToDelete.value);
      tickets.value = tickets.value.filter(
        (t: any) => t.id !== ticketToDelete.value
      );
      toast.success("Ticket deleted successfully!");
    } catch (error) {
      toast.error("Unable to delete ticket.");
    } finally {
      isDeleteDialogOpen.value = false;
      ticketToDelete.value = null;
    }
  };

  const updateStatus = async (
    ticket: TicketPreview,
    newStatus: TicketStatus
  ) => {
    try {
      await updateTicket(ticket.id, { status: newStatus });

      const index = tickets.value.findIndex((t: any) => t.id === ticket.id);
      if (index !== -1) tickets.value[index].status = newStatus;

      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return {
    isDeleteDialogOpen,
    ticketToDelete,
    handleDeleteTicket,
    confirmDelete,
    updateStatus,
  };
}
