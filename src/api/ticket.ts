import api from "./axios";
import type {
  TicketPreview,
  CreateTicketPayload,
  UpdateTicketPayload,
} from "@/types";

// 🔹 Get all tickets for the logged-in user
export const getUserTickets = async (): Promise<TicketPreview[]> => {
  const response = await api.get<TicketPreview[]>("/api/tickets");
  return response.data;
};

// 🔹 Get ALL tickets (for support dashboard/admin)
export const getAllTickets = async (): Promise<TicketPreview[]> => {
  const response = await api.get<TicketPreview[]>("/api/tickets/all");
  return response.data;
};

// 🔹 Get a single ticket by ID (optional - useful for detail pages)
export const getTicket = async (ticketId: number): Promise<TicketPreview> => {
  const response = await api.get<TicketPreview>(`/api/tickets/${ticketId}`);
  return response.data;
};

// 🔹 Create a new ticket
export const createTicket = async (
  payload: CreateTicketPayload
): Promise<TicketPreview> => {
  const response = await api.post<TicketPreview>("/api/tickets", payload);
  return response.data;
};

// 🔹 Update a ticket status
export const updateTicket = async (
  ticketId: number,
  payload: UpdateTicketPayload
): Promise<TicketPreview> => {
  const response = await api.put<TicketPreview>(
    `/api/tickets/${ticketId}/status`,
    payload
  );
  return response.data;
};
// 🔹 Delete a ticket by ID
export const deleteTicket = async (
  ticketId: number
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/api/tickets/${ticketId}`
  );
  return response.data;
};
