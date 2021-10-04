<template>
    <section class="board-app">
        <navbar :user="user" @logout="logout" />
        <board-list :boards="boards" />
        <router-view />
    </section>
</template>
<script>
import navbar from '../components/navbar.vue';
import boardList from '../components/board-list.vue';
import { socketService } from '@/services/socket.service.js';
export default {
    created() {
        socketService.setup();
        socketService.on('task-updated', this.updateActivity);
        socketService.on('board-list-updated', this.updateBoards);
    },
    destroyed() {
        socketService.off('task-updated');
        socketService.off('board-list-updated');
    },
    methods:{

        async updateActivity(activity){
           
            if (this.currTaskId && this.currTaskId === activity.taskId) {
                return await this.registerActivity(activity)
            }
            if (this.currBoardId === activity.boardId) return this.renderBoardBadge(activity)
            return console.log('inside app');
        },
        async registerActivity(activity){
            this.$store.commit({ type: 'registerActivity', activity})
            try {
                await this.$store.dispatch({ type: 'removeTaskActivities', taskId: activity.taskId })
            } catch (err) {
                console.log('error removing task activities from user', err);
                throw err
            }
        },
        renderBoardBadge(activity){
            this.$store.commit({ type: 'registerActivity', activity})
        },
        // renderAppadge(activity){

        // },
        async updateBoards() {
            await this.$store.dispatch({ type: 'loadBoards' });
        },
        async logout() {
            await this.$store.dispatch({ type: 'logout' });
        },
    },
    computed: {
        boards() {
            return this.$store.getters.boards;
        },
        user(){
            return this.$store.getters.loggedinUser
        },
        currBoardId(){
            return this.$store.getters.currBoard._id
        },
        currTaskId(){
            return this.$route.params.id
        }
    },
    // destroyed() {
    //     socketService.emit('left-app', this.board._id)
    // },
    components: {
        navbar,
        boardList,
    },
};
</script>
