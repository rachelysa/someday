import Vue from 'vue';
import app from './app.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';
import Avatar from 'vue-avatar';
import draggable from 'vuedraggable';
import 'animate.css';

import './styles/styles.scss';

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });
Vue.use(Avatar);
Vue.use(draggable);

new Vue({
    router,
    store,
    render: (h) => h(app),
}).$mount('#app');
