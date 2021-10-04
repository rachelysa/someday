<template>
    <section class="chat-box">
        <!-- <tiptap v-model="txt" /> -->
        <div class="chat-header">
            <div class="inputs">
                <input
                    ref="description"
                    @click="toggleEdit"
                    v-if="!isEditingState"
                    placeholder="Write an update..."
                />

                <el-input
                    ref="description"
                    v-if="isEditingState"
                    type="textarea"
                    :rows="3"
                    placeholder="Write an update..."
                    v-model="txt"
                >
                </el-input>
            </div>

            <div class="btn">
                <el-button type="primary" size="mini" @click.native="saveAction">Update</el-button>
            </div>
        </div>

        <msg-list :updates="updates" />
    </section>
</template>

<script>
import msgList from './msg-list.vue';

export default {
    props: {
        updates: Array,
    },
    data() {
        return {
            isEditingState: false,
            txt: '',
        };
    },
    created() {},
    methods: {
        toggleEdit() {
            this.isEditingState = !this.isEditingState;
            if (this.$refs.description) {
                setTimeout(() => {
                    this.$refs.description.focus();
                }, 10);
            }
        },
        async saveAction() {
          
            await this.$store.dispatch({
                type: 'saveUpdate',
                taskId: this.$route.params.id,
                txt: this.txt,
            });
            this.isEditingState = false;
            this.txt = '';
        },
    },
    components: { msgList },
};
</script>

<style></style>
