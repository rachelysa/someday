<template>
    <section>
        <activity-preview v-for="(activity, idx) in activities" :activity="activity" :key="idx" />
    </section>
</template>

<script>
import activityPreview from './activity-preview.vue';
export default {
    components: { activityPreview },
    props: {
        activities: Array,
    },
    created() {},
};
</script>

<style></style>
