<template>
    <!-- <section v-if="hasDate"> -->
    <el-date-picker
        class="date-column"
        v-model="newDate"
        @change="onDateChange"
        type="date"
        size="mini"
        placeholder="Pick a Date"
        format="dd/MM/yyyy"
        value-format="timestamp"
    >
    </el-date-picker>
    <!-- </section> -->
</template>

<script>
export default {
    props: {
        value: {
            // type: Number,
            // required: true,
        },
        board: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            newDate: null,
        };
    },
    computed: {
        hasDate() {
            return !!this.value;
        },
    },
    methods: {
        onDateChange() {
            const date = new Date(this.newDate);
            this.$emit('add-activity', {
                type: 'change date',
                msg:
                    'change date to ' +
                    date.getDay() +
                    '/' +
                    (date.getMonth() + 1) +
                    '/' +
                    date.getFullYear(),
            });

            this.$emit('input', this.newDate);
        },
    },
    created() {
        if (this.value) this.newDate = this.value;
    },
    watch: {
        value(newVal) {
            this.newDate = newVal;
        },
    },
};
</script>
