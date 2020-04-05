import loginComponent from './components/Login.vue';
import pokerComponent from './components/Poker.vue';
import profileComponent from './components/Profile.vue';
import reportsComponent from './components/Reports.vue';
import tablesComponent from './components/Tables.vue';
import exampleComponent from './components/HelloWorld.vue';

export default [
    {path: '/', redirect: { name: 'Login'}},
    {path: '/login', name: 'Login', component: loginComponent},
    {path: '/poker', name: 'Poker', component: pokerComponent, props: true},
    {path: '/profile', name: 'Profile', component: profileComponent, props: true},
    {path: '/reports', name: 'Reports', component: reportsComponent, props: true},
    {path: '/tables', name: 'Tables', component: tablesComponent, props: true},
    {path: '/example', name: 'Example', component: exampleComponent}
]
