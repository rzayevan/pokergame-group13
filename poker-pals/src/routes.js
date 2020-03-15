import loginComponent from './components/Login.vue';
import pokerComponent from './components/Poker.vue';
import profileComponent from './components/Profile.vue';
import reportsComponent from './components/Reports.vue';
import tablesComponent from './components/Tables.vue';
import exampleComponent from './components/HelloWorld.vue';

export default [
    {path: '/', component: loginComponent},
    {path: '/poker', component: pokerComponent},
    {path: '/profile', component: profileComponent},
    {path: '/reports', component: reportsComponent},
    {path: '/tables', component: tablesComponent},
    {path: '/example', component: exampleComponent}
]
