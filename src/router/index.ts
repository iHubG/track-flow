import { createWebHistory, createRouter } from "vue-router";
import Layout from "@/layouts/Layout.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

import UserDashboard from "@/views/user/UserDashboard.vue";
import SupportDashboard from "@/views/support/SupportDashboard.vue";
import Ticket from "@/views/support/Ticket.vue";
import User from "@/views/support/User.vue";
import ProfileSettings from "@/components/ProfileSettings.vue";

import AdminDashboard from "@/views/admin/AdminDashboard.vue";

import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";

import { useAuth } from "@/composables/useAuth";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
        meta: {
          title: "Home",
          breadcrumb: "Home",
        },
      },

      {
        path: "register",
        name: "Register",
        component: Register,
        meta: {
          title: "Register",
          breadcrumb: "Register",
          guestOnly: true,
        },
      },

      {
        path: "login",
        name: "Login",
        component: Login,
        meta: {
          title: "Login",
          breadcrumb: "Login",
          guestOnly: true,
        },
      },

      // USER
      {
        path: "user/dashboard",
        name: "UserDashboard",
        component: UserDashboard,
        meta: {
          title: "User Dashboard",
          breadcrumb: "User Dashboard",
          requiresAuth: true,
          roles: ["user"],
        },
      },

      // SUPPORT
      {
        path: "support/dashboard",
        name: "SupportDashboard",
        component: SupportDashboard,
        meta: {
          title: "Support Dashboard",
          breadcrumb: "Support Dashboard",
          requiresAuth: true,
          roles: ["support", "admin"],
        },
      },

      {
        path: "tickets",
        name: "Tickets",
        component: Ticket,
        meta: {
          title: "Tickets",
          breadcrumb: "Tickets",
          requiresAuth: true,
          roles: ["user", "support", "admin"],
        },
      },

      {
        path: "manage-users",
        name: "Manage Users",
        component: User,
        meta: {
          title: "Manage Users",
          breadcrumb: "Manage Users",
          requiresAuth: true,
          roles: ["support", "admin"],
        },
      },

      {
        path: ":role/profile-settings",
        name: "ProfileSettings",
        component: ProfileSettings,
        meta: {
          title: "Profile Settings",
          breadcrumb: "Profile Settings",
          requiresAuth: true,
          roles: ["user", "support", "admin"],
        },
      },

      // ADMIN
      {
        path: "admin/dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: {
          title: "Admin Dashboard",
          breadcrumb: "Admin Dashboard",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
    ],
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Page Not Found",
      breadcrumb: "Not Found",
    },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/* ======================================================
   SAFE & CORRECT NAVIGATION GUARD
====================================================== */
router.beforeEach(async (to, _from, next) => {
  const { user, fetchUser } = useAuth();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);
  const requiredRoles = to.meta.roles as string[] | undefined;

  const publicPaths = ["/", "/register", "/login"]; // ok since they are final URLs

  // Public routes → allow immediately
  if (publicPaths.includes(to.path)) {
    return next();
  }

  let currentUser = user.value;

  // Fetch user only when needed
  if (requiresAuth && !currentUser) {
    try {
      currentUser = await fetchUser();
      user.value = currentUser;
    } catch {
      user.value = null;
      return next({ name: "Login", query: { redirect: to.fullPath } });
    }
  }

  // Still no user → block protected routes
  if (requiresAuth && !currentUser) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  // Guest-only routes (login/register)
  if (guestOnly && currentUser) {
    const role = currentUser.role;
    if (role === "admin") return next({ name: "AdminDashboard" });
    if (role === "support") return next({ name: "SupportDashboard" });
    return next({ name: "UserDashboard" });
  }

  // Role-based access
  if (
    currentUser &&
    requiredRoles &&
    !requiredRoles.includes(currentUser.role)
  ) {
    const role = currentUser.role;
    if (role === "admin") return next({ name: "AdminDashboard" });
    if (role === "support") return next({ name: "SupportDashboard" });
    return next({ name: "UserDashboard" });
  }

  // All checks passed
  return next();
});

// Title updates
router.afterEach((to) => {
  const title = to.meta.title as string;
  if (title) document.title = `${title} - TrackFlow`;
});
