<template>
    <el-select
        v-model="boardColumnsCopy"
        @change="onChange"
        collapse-tags
        multiple
        size="medium"
        placeholder="Select"
    >
        <el-option v-for="column in columnList" :key="column" :value="column">
            <span :class="columnIcon(column)" style="float: left"></span>
            <span style="color: #8492a6; font-size: 16px">{{ column }}</span>
        </el-option>
    </el-select>
</template>

<script>
import { columnHelpers } from '@/services/column.helpers.js';

export default {
    props: {
        value: {
            // The list of column names in the board
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            boardColumnsCopy: [],
        };
    },
    created() {
        this.boardColumnsCopy = this.value.slice();
    },
    methods: {
        columnIcon(column) {
            return columnHelpers[column].icon();
        },
        onChange() {
            this.$emit('input', this.boardColumnsCopy);
        },
    },
    computed: {
        columnList() {
            return columnHelpers.columnList;
        },
    },
};
</script>

<style></style>
