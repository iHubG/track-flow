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
          guestOnly: true, // Only accessible when NOT logged in
        },
      },
      {
        path: "login",
        name: "Login",
        component: Login,
        meta: {
          title: "Login",
          breadcrumb: "Login",
          guestOnly: true, // Only accessible when NOT logged in
        },
      },
      {
        path: "/user/dashboard",
        name: "UserDashboard",
        component: UserDashboard,
        meta: {
          title: "User Dashboard",
          breadcrumb: "User Dashboard",
          requiresAuth: true,
          roles: ["user", "support", "admin"], // Multiple roles can access
        },
      },
      {
        path: "/support/dashboard",
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
        path: "/tickets",
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
        path: "/users",
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
        path: "/:role/profile-settings",
        name: "Profile Settings",
        component: ProfileSettings,
        meta: {
          title: "Profile Settings",
          breadcrumb: "Profile Settings",
          requiresAuth: true,
          roles: ["user", "support", "admin"],
        },
      },
      {
        path: "/admin/dashboard",
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

router.beforeEach(async (to, _from, next) => {
  const { user, fetchUser } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);
  const requiredRoles = to.meta.roles as string[] | undefined;

  let currentUser = user.value;

  try {
    // Only fetch if we don’t already have a user loaded
    if (!currentUser) {
      currentUser = await fetchUser();
    }

    if (currentUser) {
      // Redirect guest-only pages
      if (guestOnly) {
        const role = currentUser.role;
        if (role === "admin") return next({ name: "AdminDashboard" });
        if (role === "support") return next({ name: "SupportDashboard" });
        return next({ name: "UserDashboard" });
      }

      // Check role-based access
      if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
        const role = currentUser.role;
        if (role === "admin") return next({ name: "AdminDashboard" });
        if (role === "support") return next({ name: "SupportDashboard" });
        return next({ name: "UserDashboard" });
      }

      // ✅ User has access
      return next();
    }
  } catch (error) {
    // Not authenticated
    if (requiresAuth) {
      return next({ name: "Login", query: { redirect: to.fullPath } });
    }
  }

  next();
});

// Update document title based on route
router.afterEach((to) => {
  const title = to.meta.title as string;
  if (title) {
    document.title = `${title} - TrackFlow`;
  }
});
