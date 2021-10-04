<template>
    <article>
        <status-item
            @item-selected="onSelectStatus"
            :status="status"
            v-for="status in statuses"
            :key="status.id"
        />
    </article>
</template>

<script>
import statusItem from '@/components/columns/status-item';
export default {
    props: {
        value: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            newStatus: null,
            statuses: [
                { id: 's001', txt: 'Done', color: '#33d391' },
                { id: 's002', txt: 'In progress', color: '#fdbc64' },
                { id: 's003', txt: 'Stuck', color: '#e8697d' },
                { id: 's000', txt: '', color: '#c4c4c4' }, // unspecified - default
            ],
        };
    },
    methods: {
        onSelectStatus(newStatus) {
            this.$emit('input', newStatus);
        },
    },
    created() {
        this.newStatus = JSON.parse(JSON.stringify(this.value));
    },
    components: {
        statusItem,
    },
};
</script>

<style></style>
