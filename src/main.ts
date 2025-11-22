import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { router } from "@/router";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  ViFileTypeVue,
  RiHome2Line,
  FaUser,
  FaUserCircle,
} from "oh-vue-icons/icons";

addIcons(ViFileTypeVue, RiHome2Line, FaUser, FaUserCircle);

const pinia = createPinia();
const app = createApp(App);

const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: false,
  transition: "Vue-Toastification__fade",
  maxToasts: 5,
};

app.component("v-icon", OhVueIcon);
app.use(router);
app.use(Toast, toastOptions);
app.use(pinia);
app.mount("#app");
