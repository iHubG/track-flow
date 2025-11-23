// @ts-nocheck
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

export function initializeEcho() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found, skipping Echo initialization");
    return;
  }

  // Fix: Reverb requires disabling HTTP fallbacks in PusherJS
  Pusher.Runtime.createXHR = () => new XMLHttpRequest();

  if (window.Echo) {
    window.Echo.disconnect();
    window.Echo = undefined;
  }

  window.Echo = new Echo({
    broadcaster: "reverb",
    key: "local-app-key",
    wsHost: "127.0.0.1",
    wsPort: 6001,
    wssPort: 6001,
    forceTLS: false,
    encrypted: false,
    transports: ["ws"],
    enabledTransports: ["ws"],

    authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  console.log("Echo + Reverb initialized");
}

initializeEcho();
