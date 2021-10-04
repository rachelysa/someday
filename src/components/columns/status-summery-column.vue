<template>
    <section class="status-summery" v-if="statuses">
        <div class="battery">
            <el-tooltip
                class="item"
                effect="dark"
                :content="'Stuck: ' + percentOfTotal(statuses['Stuck']).toFixed(0) + '%'"
                placement="top"
            >
                <div
                    v-if="percentOfTotal(statuses['Stuck'])"
                    class="stuck"
                    :style="{
                        width: percentOfTotal(statuses['Stuck']) + '%',
                        backgroundColor: 'rgb(232, 105, 125)',
                    }"
                ></div>
            </el-tooltip>

            <el-tooltip
                class="item"
                effect="dark"
                :content="'Done: ' + percentOfTotal(statuses['Done']).toFixed(0) + '%'"
                placement="top"
            >
                <div
                    v-if="percentOfTotal(statuses['Done'])"
                    class="done"
                    :style="{
                        width: percentOfTotal(statuses['Done']) + '%',
                        backgroundColor: 'rgb(51, 211, 145)',
                    }"
                ></div>
            </el-tooltip>
            <el-tooltip
                class="item"
                effect="dark"
                :content="
                    'In progress: ' + percentOfTotal(statuses['In progress']).toFixed(0) + '%'
                "
                placement="top"
            >
                <div
                    v-if="percentOfTotal(statuses['In progress'])"
                    class="in-progress"
                    :style="{
                        width: percentOfTotal(statuses['In progress']) + '%',
                        backgroundColor: 'rgb(253, 188, 100)',
                    }"
                ></div>
            </el-tooltip>
            <el-tooltip
                class="item"
                effect="dark"
                :content="'Empty: ' + percentOfTotal(statuses['']).toFixed(0) + '%'"
                placement="top"
            >
                <div
                    v-if="percentOfTotal(statuses[''])"
                    class="empty"
                    :style="{
                        width: percentOfTotal(statuses['']) + '%',
                        backgroundColor: 'rgb(196, 196, 196)',
                    }"
                ></div>
            </el-tooltip>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        groupId: {
            type: String,
            required: true,
        },
        group: Object,
    },
    data() {
        return {
            taskCount: 0,
            statuses: {},
        };
    },
    created() {
        this.loadBattery();
    },
    computed: {
        currGroup() {
            const boardGroups = this.$store.getters.currBoard.groups;
            return boardGroups.find((group) => group.id === this.groupId);
        },
    },
    methods: {
        loadBattery() {
            this.group.tasks.forEach((task) => {
                const currStatus = task.columns.status.txt;
                if (this.statuses[currStatus]) {
                    this.statuses[currStatus] += 1;
                } else {
                    this.statuses[currStatus] = 1;
                }

                this.taskCount++;
            });
        },
        percentOfTotal(status) {
            return (status / this.taskCount) * 100;
        },
    },

    watch: {
        group() {
            this.statuses = {};
            this.taskCount = 0;
            this.loadBattery();
        },
    },
};
</script>
