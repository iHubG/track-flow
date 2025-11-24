import axios from "./axios";

export const fetchDashboardData = async () => {
  const response = await axios.get("/api/dashboard");
  console.log("Dashboard data fetched:", response.data);
  return response.data.data;
};
