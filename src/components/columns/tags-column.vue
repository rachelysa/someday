<template>
    <el-select
        class="tags-column"
        v-model="newTagList"
        multiple
        filterable
        allow-create
        collapse-tags
        size="mini"
        @change="onTagListChange"
        @remove-tag="onRemoveTag"
        @visible-change="onPickerStateChange"
        placeholder="Choose tags..."
    >
        <el-option v-for="item in boardTags" :key="item" :value="item"> </el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        value: {
            // type: Array,
            // required: true,
        },
        board: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            newTagList: [],
            isDirty: false,
        };
    },
    computed: {
        boardTags() {
            return this.board.tags;
        },
    },
    methods: {
        onTagListChange() {
            this.isDirty = true;
        },
        onRemoveTag() {
            // this.$emit("add-activity", { type: "change tag count",msg:'change tag count to ' +  this.newTagList.length });
            this.$emit('input', this.newTagList);
        },
        onPickerStateChange(isPickerOpen) {
            if (isPickerOpen || !this.isDirty) return;

            this.newTagList.forEach((tag) => {
                if (!this.boardTags.includes(tag)) this.boardTags.unshift(tag);
            });
          this.$emit("add-activity", { type: "change tag count",msg:'change tags count to ' +  this.newTagList.length });
         
            this.$emit('input', this.newTagList);
        },
    },
    created() {
        if (this.value) this.newTagList = this.value;
    },
    watch: {
        value(newVal) {
            this.newTagList = newVal
        },
    },
};
</script>
