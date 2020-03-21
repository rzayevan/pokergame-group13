import loginComponent from './components/Login.vue';
import pokerComponent from './components/Poker.vue';
import profileComponent from './components/Profile.vue';
import reportsComponent from './components/Reports.vue';
import tablesComponent from './components/Tables.vue';
import exampleComponent from './components/HelloWorld.vue';

export default [
    {path: '/', component: loginComponent},//redirect: { name: 'Login'}},
    {path: '/login', name: 'Login', component: loginComponent},
    {path: '/poker', name: 'Poker', component: pokerComponent},
    {path: '/profile', name: 'Profile', component: profileComponent},
    {path: '/reports', name: 'Reports', component: reportsComponent},
    {path: '/tables', name: 'Tables', component: tablesComponent},
    {path: '/example', name: 'Example', component: exampleComponent}
]
