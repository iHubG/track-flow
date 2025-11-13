// src/types/ticket.ts
export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface TicketPreview {
  data: TicketPreview;
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

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Update profile request payload
export interface UpdateProfilePayload {
  name: string;
}

// Change password payload
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Generic API response with user data
export interface ApiResponse<T> {
  message: string;
  user?: T;
}
