import Vue from 'vue';
import router from './router';
import App from './App.vue';
import $ from 'jquery';
import VueClipboards from "vue-clipboards";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { googleServiceInstance } from "@/backend/GoogleServiceInstance";

Vue.prototype.$googleService = googleServiceInstance;
Vue.prototype.$removeFavoritesModalID = 'remove-favorites-modal';  // TODO: is there a better way to share data between components?
Vue.config.productionTip = false;

Vue.use(VueClipboards);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

/* JQuery */
window.$ = $;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
