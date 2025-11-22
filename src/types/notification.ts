export interface Notification {
  id: number;
  time: string;
  message: string;
  role: "user" | "support" | "admin";
  read: boolean;
  created_at: string;
}
