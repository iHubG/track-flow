export interface TicketPreview {
  id: number;
  title: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
}
