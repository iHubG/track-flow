import { ref, watch, onMounted, onUnmounted } from "vue";
import type { TicketPreview } from "@/types";
import { getUserTickets, getAllTickets } from "@/api/ticket";
import { useAuth } from "@/composables/useAuth";

// Separate state for user tickets
const userTickets = ref<TicketPreview[]>([]);
const userLoading = ref(false);
const userLastFetchedUserId = ref<number | null>(null);
const userLastFetchTime = ref<number>(0);

// Separate state for all tickets
const allTickets = ref<TicketPreview[]>([]);
const allLoading = ref(false);
const allLastFetchedUserId = ref<number | null>(null);
const allLastFetchTime = ref<number>(0);

// Consider data stale after 30 seconds
const STALE_TIME = 30000;

// ============================================
// USER TICKETS COMPOSABLE
// ============================================
export function useUserTickets() {
  const { user } = useAuth();

  watch(user, (newUser, oldUser) => {
    if (newUser?.id !== oldUser?.id) {
      userTickets.value = [];
      userLastFetchedUserId.value = null;
    }
  });

  const fetchTickets = async () => {
    const currentUserId = user.value?.id;

    if (
      userLastFetchedUserId.value === currentUserId &&
      userTickets.value.length > 0
    ) {
      return userTickets.value;
    }

    if (!currentUserId) {
      userTickets.value = [];
      return;
    }

    userLoading.value = true;
    try {
      const response = await getUserTickets();

      userTickets.value = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];

      userLastFetchedUserId.value = currentUserId;
      userLastFetchTime.value = Date.now();
    } catch (error) {
      console.error("Failed to fetch user tickets:", error);
      userTickets.value = [];
    } finally {
      userLoading.value = false;
    }
  };

  const refreshTickets = async () => {
    // Prevent multiple simultaneous refreshes
    if (userLoading.value) {
      console.log("User tickets refresh skipped (already loading)");
      return;
    }

    // Check if data is still fresh
    const now = Date.now();
    const timeSinceLastFetch = now - userLastFetchTime.value;

    if (timeSinceLastFetch < STALE_TIME && userTickets.value.length > 0) {
      console.log(
        `User tickets are fresh (fetched ${Math.round(
          timeSinceLastFetch / 1000
        )}s ago)`
      );
      return;
    }

    console.log("Refreshing user tickets...");
    userLastFetchedUserId.value = null;
    await fetchTickets();
  };

  const clearTickets = () => {
    userTickets.value = [];
    userLastFetchedUserId.value = null;
    userLastFetchTime.value = 0;
  };

  // Listen for user-specific refresh events
  const handleRefreshEvent = () => {
    refreshTickets();
  };

  onMounted(() => {
    window.addEventListener("user-tickets-refresh", handleRefreshEvent);
  });

  onUnmounted(() => {
    window.removeEventListener("user-tickets-refresh", handleRefreshEvent);
  });

  return {
    tickets: userTickets,
    fetchTickets,
    refreshTickets,
    clearTickets,
    loading: userLoading,
  };
}

// ============================================
// ALL TICKETS COMPOSABLE (Admin/Support)
// ============================================
export function useAllTickets() {
  const { user } = useAuth();

  watch(user, (newUser, oldUser) => {
    if (newUser?.id !== oldUser?.id) {
      allTickets.value = [];
      allLastFetchedUserId.value = null;
    }
  });

  const fetchTickets = async () => {
    const currentUserId = user.value?.id;

    if (
      allLastFetchedUserId.value === currentUserId &&
      allTickets.value.length > 0
    ) {
      return allTickets.value;
    }

    if (!currentUserId) {
      allTickets.value = [];
      return;
    }

    allLoading.value = true;
    try {
      const response = await getAllTickets();

      allTickets.value = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
        ? (response as any).data
        : [];

      allLastFetchedUserId.value = currentUserId;
      allLastFetchTime.value = Date.now();
    } catch (error) {
      console.error("Failed to fetch all tickets:", error);
      allTickets.value = [];
    } finally {
      allLoading.value = false;
    }
  };

  const refreshTickets = async () => {
    // Prevent multiple simultaneous refreshes
    if (allLoading.value) {
      console.log("All tickets refresh skipped (already loading)");
      return;
    }

    // Check if data is still fresh
    const now = Date.now();
    const timeSinceLastFetch = now - allLastFetchTime.value;

    if (timeSinceLastFetch < STALE_TIME && allTickets.value.length > 0) {
      console.log(
        `All tickets are fresh (fetched ${Math.round(
          timeSinceLastFetch / 1000
        )}s ago)`
      );
      return;
    }

    console.log("Refreshing all tickets...");
    allLastFetchedUserId.value = null;
    await fetchTickets();
  };

  const clearTickets = () => {
    allTickets.value = [];
    allLastFetchedUserId.value = null;
    allLastFetchTime.value = 0;
  };

  // Listen for all-tickets refresh events
  const handleRefreshEvent = () => {
    refreshTickets();
  };

  onMounted(() => {
    window.addEventListener("all-tickets-refresh", handleRefreshEvent);
  });

  onUnmounted(() => {
    window.removeEventListener("all-tickets-refresh", handleRefreshEvent);
  });

  return {
    tickets: allTickets,
    fetchTickets,
    refreshTickets,
    clearTickets,
    loading: allLoading,
  };
}

// ============================================
// UTILITY FUNCTIONS WITH DEBOUNCING
// ============================================
let userRefreshTimeout: ReturnType<typeof setTimeout> | null = null;
let allRefreshTimeout: ReturnType<typeof setTimeout> | null = null;

export function triggerUserTicketsRefresh() {
  // Clear any pending refresh
  if (userRefreshTimeout) {
    clearTimeout(userRefreshTimeout);
  }

  // Debounce: only dispatch event after 300ms of no new calls
  userRefreshTimeout = setTimeout(() => {
    window.dispatchEvent(new Event("user-tickets-refresh"));
    userRefreshTimeout = null;
  }, 300);
}

export function triggerAllTicketsRefresh() {
  // Clear any pending refresh
  if (allRefreshTimeout) {
    clearTimeout(allRefreshTimeout);
  }

  // Debounce: only dispatch event after 300ms of no new calls
  allRefreshTimeout = setTimeout(() => {
    window.dispatchEvent(new Event("all-tickets-refresh"));
    allRefreshTimeout = null;
  }, 300);
}
