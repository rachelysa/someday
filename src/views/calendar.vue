<template>
    <section class="board-app">
        <el-calendar class="calendar" v-model="value"> </el-calendar>
    </section>
</template>

<script>
export default {
    data() {
        return {
            value: new Date(),
        };
    },
    components: {},
};
</script>

<style>
.is-selected {
    color: #1989fa;
}
</style>
