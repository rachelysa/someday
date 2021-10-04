<template>
    <!-- <section class="task-details" v-if="currTask">
      <button @click="closeDetails">X</button>
   <h3>{{currTask.title}}</h3>
   
  </section> -->
    <el-drawer :visible.sync="drawer" :title="currTask.title">
        <el-tabs v-model="activeName" @tab-click="tabSelect">
            <el-tab-pane label="Updates" name="Updates">
                <chat-box v-if="updates" :updates="updates" />
            </el-tab-pane>
            <el-tab-pane label="Activity log" name="Activity log">
                <activity-list v-if="activities" :activities="activities" />
            </el-tab-pane>
        </el-tabs>
    </el-drawer>
</template>

<script>
import activityList from '../components/activity-list.vue';
import ChatBox from '../components/chat-box.vue';

export default {
    data() {
        return {
            currTask: null,
            drawer: true,
            activeName: 'Updates',

        };
    },
    created() {
        const board = this.$store.getters.currBoard;
        const taskId = this.$route.params.id;
        board.groups.forEach((group) => {
            return group.tasks.forEach((task) => {
                if (task.id === taskId) this.currTask = task;
            });
        });

    },
    computed: {
        activities(){
            return this.$store.getters.getActivitiesByItem(this.taskId, 'activity').sort((act1, act2) => { act2.createdAt - act1.createdAt })
        },
        updates(){
            return this.$store.getters.getActivitiesByItem(this.taskId, 'new-msg').sort((act1, act2) => { act2.createdAt - act1.createdAt })
        },
        taskId(){
            return this.currTask.id
        },
    },
    methods: {
        closeDetails() {
            this.$router.push(`/board/${this.$route.params.boardId}`);
        },
        tabSelect(tab) {
            if(tab.name === 'Updates'){
               console.log('tab update');
            }
        },
    },
    watch: {
        drawer() {
            setTimeout(() => {
                this.closeDetails();
            }, 100);

            // this.currTask = JSON.parse(JSON.stringify(newVal));
        },
    },
    components: { activityList, ChatBox },
}
</script>

<style></style>
