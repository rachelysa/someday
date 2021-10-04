<template>
    <section class="task-list">
        <draggable
            v-model="tasksCopy"
            ghost-class="ghost"
            group="tasks"
            @change="changeTasks"
            handle=".handle-task"
        >
            <transition-group type="transition" name="flip-list ">
                <task-preview
                    class="style-task sortable"
                    :style="{
                        borderInlineStart: '8px solid ' + color.color,
                        borderInlineEnd: '8px solid #e6e9ef',
                    }"
                    v-for="(task, idx) in tasksCopy"
                    :key="idx"
                    :task="task"
                    :groupId="groupId"
                    @openTaskDetails="openTaskDetails"
                />
            </transition-group>
        </draggable>
        <div class="form">
            <input
                class="style-task add-input"
                :style="{
                    borderInlineStart: '8px solid ' + color.color,
                    borderInlineEnd: '8px solid #e6e9ef',
                }"
                type="text"
                placeholder="+ Add"
                v-model="taskToAdd.title"
                @keydown.enter="addTask"
            />
        </div>

        <section class="summery-preview">
            <div class="summery-title"></div>
            <div class="summery-cmps">
                <component
                    class="summery-column"
                    :is="summeryColumnName(column)"
                    v-for="(column, idx) in columnOrder"
                    :key="idx"
                    :group="group"
                    :groupId="groupId"
                />
            </div>
        </section>

        <!-- <div class="summery">
            <component
                class="summery-column"
                :is="summeryColumnName(column)"
                v-for="(column, idx) in columnOrder"
                :key="idx"
                :group="group"
                :groupId="groupId"
            />
        </div> -->
    </section>
</template>

<script>
import taskPreview from './task-preview.vue';
import draggable from 'vuedraggable';
import tagsSummeryColumn from './columns/tags-summery-column.vue';
import personSummeryColumn from './columns/person-summery-column.vue';
import statusSummeryColumn from './columns/status-summery-column.vue';
import dateSummeryColumn from './columns/date-summery-column.vue';
import { columnHelpers } from '@/services/column.helpers.js';

export default {
    props: { tasks: Array, color: Object, groupId: String, group: Object, columnOrder: Array },
    components: {
        taskPreview,
        draggable,
        tagsSummeryColumn,
        personSummeryColumn,
        statusSummeryColumn,
        dateSummeryColumn,
    },

    data() {
        return {
            tasksCopy: null,
            taskToAdd: null,
            summeryComponents: this.$store.getters.currBoard.columns,
        };
    },
    created() {
        // this.taskToAdd = JSON.parse(JSON.stringify(this.$store.getters.getEmptyTask));
        this.taskToAdd = JSON.parse(JSON.stringify(this.$store.getters.getEmptyTask));
        this.tasksCopy = JSON.parse(JSON.stringify(this.tasks));
    },
    watch: {
        tasks(newVal) {
            this.tasksCopy = JSON.parse(JSON.stringify(newVal));
        },

    },
    methods: {
        openTaskDetails(taskId) {
            this.$emit('openTaskDetails', taskId);
        },
        async addTask() {
            if (this.taskToAdd.title === '') return;
            this.taskToAdd.createdAt = Date.now();
            await this.$store.dispatch({
                type: 'addTask',
                task: this.taskToAdd,
                groupId: this.groupId,
            });
            this.taskToAdd = this.$store.getters.getEmptyTask;
        },
        async changeTasks() {
            await this.$store.dispatch({
                type: 'saveTasks',
                tasks: this.tasksCopy,
                groupId: this.groupId,
            });
        },
        summeryColumnName(column) {
            return columnHelpers.componentSummeryType(column);
        },
    },
};
</script>
<style>
.flip-list-enter,
.flip-list-leave-to {
    transform: translateY(30px);
    opacity: 0;
}

.flip-list-enter-active,
.flip-list-leave-active {
    transition: 0.5s;
}

.flip-list-move {
    transition: 0.5s;
}
</style>
