<template>
    <section class="tag-summery" v-if="tags">
        <div v-for="(tag, idx) in tags" :key="idx">#{{ tag }}</div>
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
            tags: [],
        };
    },
    created() {
        this.loadTags();
    },
    computed: {
        currGroup() {
            const boardGroups = this.$store.getters.currBoard.groups;
            // const group = boardGroups.find((group) => group.id === this.groupId);

            return boardGroups.find((group) => group.id === this.groupId);
        },
    },
    methods: {
        loadTags() {
            const allTags = [];
            this.group.tasks.forEach((task) => {
                task.columns['tags'].forEach((tag) => allTags.push(tag));
            });
            this.tags = [...new Set(allTags)];
        },
    },
    watch: {
        group() {
            this.loadTags();
        },
    },
};
</script>
