import BrowserSupport from './assets/browser-support.js';
BrowserSupport.isIE10();

import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueGtag from "vue-gtag";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'main',
    },
  ],
});

Vue.use(VueGtag, {
  config: { id: "UA-860026-1" },
}, router);


new Vue({ // eslint-disable-line no-new
  el: '#vue-app',
  router,
  render (h) {
    return h(App, {});
  },
});
