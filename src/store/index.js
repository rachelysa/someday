import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { userStore } from './user.store.js';
import { boardStore } from './board.store.js';
import { groupStore } from './group.store.js';
import { taskStore } from './task.store.js';

export default new Vuex.Store({
    strict: true,
    modules: {
        userStore,
        boardStore,
        groupStore,
        taskStore,
    },
});
