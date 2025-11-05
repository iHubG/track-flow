import api from "./axios";

// 🔹 Get all tickets for the logged-in user
export const getUserTickets = async () => {
  const response = await api.get("/api/tickets");
  return response.data;
};

// 🔹 Create a new ticket
export const createTicket = async (payload) => {
  const response = await api.post("/api/tickets", payload);
  return response.data;
};
