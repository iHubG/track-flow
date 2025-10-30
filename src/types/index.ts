// src/types/ticket.ts
export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface TicketPreview {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: TicketPriority;
}
