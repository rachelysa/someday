<template>
    <section @click="itemSelect" class="status-item" :style="itemColor">
        <div>{{status.txt}}</div>
    </section>
</template>

<script>
export default {
    props: {
        status: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {

        }
    },
    computed: {
        itemColor(){
            return { 'background-color': this.status.color }
        },
    },
    methods:{
        itemSelect(){
            this.$emit('item-selected', this.status)
        }
    }
}
</script>

<style>

</style>