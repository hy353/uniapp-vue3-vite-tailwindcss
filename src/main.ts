import { createSSRApp } from "vue";
import App from "./App.vue";
import http from "./http/index.js";
import * as Pinia from "pinia";

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.provide("$http", http);
  return {
    app,
    Pinia,
  };
}
