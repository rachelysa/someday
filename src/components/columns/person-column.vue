<template>
    <section class="person-column">
        <section @click="togglePersonPicker">
            <section class="avatar-list" v-if="hasDelegates">
                <div v-for="delegate in newDelegates.slice(0, 2)" :key="delegate._id">
                    <avatar
                        :username="delegate.fullname"
                        :inline="true"
                        :size="27"
                        :src="delegate.imgUrl"
                    ></avatar>
                </div>
                <!-- <el-badge v-if="newDelegates.length > 1" :value="newDelegates.length" class="item"> -->
                <avatar
                    v-if="newDelegates.length > 2"
                    :username="'+ ' + (newDelegates.length - 2)"
                    :inline="true"
                    :size="27"
                    color="#333"
                    backgroundColor="#e4e4e4"
                ></avatar>
                <!-- </el-badge> -->
            </section>

            <section v-else>
                <span><i class="far fa-user-circle empty-delegate-list"></i></span>
            </section>
        </section>

        <person-picker
            :delegates="value"
            :members="board.members"
            v-if="this.isPickerOpen"
            @person-picker-close="togglePersonPicker"
            @change="onDelegateListChange"
            @input="onNewDelegateList"
        />
    </section>
</template>

<script>
import Avatar from 'vue-avatar';
import personPicker from '@/components/columns/person-picker';

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
            newDelegates: [],
            isPickerOpen: false,
            dele: [],
        };
    },
    created() {
        if (this.value) this.newDelegates = JSON.parse(JSON.stringify(this.value));
    },
    watch: {
        value(newValue) {
            this.newDelegates = JSON.parse(JSON.stringify(newValue));
        },
    },
    methods: {
        togglePersonPicker() {
            this.isPickerOpen = !this.isPickerOpen;
        },
        onNewDelegateList(newDelegates) {
            this.$emit('add-activity', {
                type: 'change person count',
                msg: 'change person count to ' + newDelegates.length,
            });
            this.$emit('input', newDelegates);
        },
        onDelegateListChange(newDelegates) {
            this.newDelegates = newDelegates;
        },
    },
    computed: {
        hasDelegates() {
            return !!this.newDelegates.length;
        },
    },
    components: {
        personPicker,
        Avatar,
    },
};
</script>
