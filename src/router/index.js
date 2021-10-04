import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../views/home.vue';
import about from '../views/about.vue';
import boardApp from '../views/board-app.vue';
import boardDetails from '../views/board-details.vue';
import taskDetails from '../views/task-details.vue';
import userProfile from '../views/user-profile.vue';
import calendar from '../views/calendar.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: home,
    },
    {
        path: '/about',
        name: 'about',
        component: about,
    },

    {
        path: '/profile',
        name: 'profile',
        component: userProfile,
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: calendar,
    },
    {
        path: '/board',
        name: 'board',
        component: boardApp,
        children: [
            {
                path: ':boardId',
                name: 'boardDetails',
                component: boardDetails,
                children: [
                    {
                        path: 'task/:id',
                        name: 'taskDetails',
                        component: taskDetails,
                    },
                ],
            },
        ],
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
