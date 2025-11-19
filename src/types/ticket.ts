export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface TicketPreview {
  id: number;
  ticket_id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}
