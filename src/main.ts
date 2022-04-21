import { createSSRApp } from "vue";
import App from "./App.vue";
import http from "./http/index.js";

export function createApp() {
  const app = createSSRApp(App);
  app.provide("$http", http);
  return {
    app,
  };
}
