import Vue from 'vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
<<<<<<< HEAD
// Install BootstrapVue
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
=======
import VueRouter from 'vue-router'
import Routes from './routes'
>>>>>>> master

Vue.use(VueRouter);
Vue.config.productionTip = false

const router = new VueRouter({
  routes: Routes
});

new Vue({
<<<<<<< HEAD
    render: h => h(App),
}).$mount('#app')
=======
  render: h => h(App),
  router: router
}).$mount('#app')
>>>>>>> master
