import { createWebHistory, createRouter } from "vue-router";
import Layout from "@/layouts/Layout.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import SupportDashboard from "@/views/support/SupportDashboard.vue";
import Ticket from "@/views/support/Ticket.vue";
import User from "@/views/support/User.vue";
import SupportSettings from "@/views/support/SupportSettings.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";

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
        },
      },
      {
        path: "login",
        name: "Login",
        component: Login,
        meta: {
          title: "Login",
          breadcrumb: "Login",
        },
      },
      {
        path: "user",
        name: "UserDashboard",
        component: UserDashboard,
        meta: {
          title: "User Dashboard",
          breadcrumb: "User Dashboard",
        },
      },
      {
        path: "/support/dashboard",
        name: "SupportDashboard",
        component: SupportDashboard,
        meta: {
          title: "Support Dashboard",
          breadcrumb: "Support Dashboard",
        },
      },
      {
        path: "/tickets",
        name: "Tickets",
        component: Ticket,
        meta: {
          title: "Tickets",
          breadcrumb: "Tickets",
        },
      },
      {
        path: "/users",
        name: "Manage Users",
        component: User,
        meta: {
          title: "Manage Users",
          breadcrumb: "Manage Users",
        },
      },
      {
        path: "/profile-settings",
        name: "Profile Settings",
        component: SupportSettings,
        meta: {
          title: "Profile Settings",
          breadcrumb: "Profile Settings",
        },
      },
      {
        path: "admin",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: {
          title: "Admin Dashboard",
          breadcrumb: "Admin Dashboard",
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
