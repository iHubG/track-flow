import { createWebHistory, createRouter } from "vue-router";
import Layout from "@/layouts/Layout.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import SupportDashboard from "@/views/SupportDashboard.vue";
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
      },
      {
        path: "/register",
        name: "Register",
        component: Register,
      },
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
      {
        path: "/user",
        name: "UserDashboard",
        component: UserDashboard,
      },
      {
        path: "/support",
        name: "SupportDashboard",
        component: SupportDashboard,
      },
      {
        path: "/admin",
        name: "AdminDashboard",
        component: AdminDashboard,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
