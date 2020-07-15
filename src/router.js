import Vue from 'vue';
import VueRouter from 'vue-router';

// Views
import Restaurants from "@/views/Restaurants";
import Favorites from "@/views/Favorites";
import Shared from "@/views/Shared";

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        { path: '/restaurants', component: Restaurants },
        { path: '/favorites', component: Favorites },
        { path: '/shared', component: Shared },
        { path: '*', redirect: '/restaurants' }
    ]
});
