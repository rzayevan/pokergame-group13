import Vue from 'vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//Add bootstrap vue 
Vue.use(BootstrapVue)
//Add icons plugin (optional) 
Vue.use(IconsPlugin)

import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './routes'

Vue.use(VueRouter);
Vue.config.productionTip = false

const router = new VueRouter({
    mode: 'history',
    routes: Routes
});

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app')
