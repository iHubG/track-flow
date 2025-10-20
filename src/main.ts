import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { router } from "@/router";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  ViFileTypeVue,
  RiHome2Line,
  FaUser,
  FaUserCircle,
} from "oh-vue-icons/icons";

addIcons(ViFileTypeVue, RiHome2Line, FaUser, FaUserCircle);

const app = createApp(App);

app.component("v-icon", OhVueIcon);

app.use(router).mount("#app");
