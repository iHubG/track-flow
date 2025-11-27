// src/composables/useDashboard.ts
import { ref } from "vue";
import { fetchDashboardData } from "@/api/dashboard"; // your API call
import type { DashboardData } from "@/types";

const dashboardData = ref<DashboardData | null>(null);
const loading = ref(false);
const lastFetched = ref(false);

export function useDashboard(autoFetch = false) {
  if (autoFetch && !lastFetched.value) {
    fetchDashboard();
  }

  async function fetchDashboard() {
    if (lastFetched.value && dashboardData.value) {
      return dashboardData.value; // return cached
    }

    loading.value = true;
    try {
      const response = await fetchDashboardData();
      dashboardData.value = response;
      lastFetched.value = true;
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
      dashboardData.value = null;
    } finally {
      loading.value = false;
    }
  }

  const refreshDashboard = async () => {
    lastFetched.value = false;
    await fetchDashboard();
  };

  const clearDashboard = () => {
    dashboardData.value = null;
    lastFetched.value = false;
  };

  return {
    dashboardData,
    loading,
    fetchDashboard,
    refreshDashboard,
    clearDashboard,
  };
}
