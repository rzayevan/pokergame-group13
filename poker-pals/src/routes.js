import Login from './components/Login.vue';
import Poker from './components/Poker.vue';
import Reports from './components/Reports/Reports.vue';
import Tables from './components/Tables.vue';
import PageNotFound from './components/PageNotFound.vue';
import Banned from './components/Banned.vue';

export default [
    { path: '/', redirect: { name: 'Login' } },
    { path: '*', redirect: '/404' },
    { path: '/404', component: PageNotFound },
    { path: '/login', name: 'Login', component: Login },
    { path: '/poker', name: 'Poker', component: Poker, props: true },
    { path: '/reports', name: 'Reports', component: Reports, props: true} ,
    { path: '/tables', name: 'Tables', component: Tables, props: true },
    { path: '/banned', name: 'Banned', component: Banned, props: true },
]
