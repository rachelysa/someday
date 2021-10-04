<template>
    <transition name="person-picker">
        <section @keydown.esc="end" class="person-picker">
            <section class="delegate-list">
                <input type="text" placeholder="Enter name" />
                <transition-group name="person-list">
                    <person-preview
                        @item-selected="onRemoveDelegate"
                        :person="delegate"
                        v-for="delegate in newDelegates"
                        :key="delegate._id"
                    />
                </transition-group>
            </section>

            <section class="member-list">
                <el-divider v-if="newMembers.length" content-position="center">Add</el-divider>
                <transition-group name="person-list">
                    <person-preview
                        @item-selected="onAddDelegate"
                        :person="member"
                        v-for="member in newMembers"
                        :key="member._id"
                    />
                </transition-group>
                <div class="mail-invite">
                    <i class="far fa-envelope"></i>
                    Invite a member by email
                </div>
            </section>
        </section>
    </transition>
</template>

<script>
import personPreview from '@/components/columns/person-preview';
export default {
    props: {
        delegates: {
            // type: Array,
            // required: true,
        },
        members: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            newDelegates: [],
            newMembers: [],
            dele: [],
            isDirty: false,
        };
    },
    created() {
 
        if (this.delegates && this.delegates.length)
            this.newDelegates = JSON.parse(JSON.stringify(this.delegates));

        this.newMembers = this.members.filter((member) => {
            return !this.newDelegates.some((delegate) => delegate._id === member._id);
        });

    },
    methods: {
        onRemoveDelegate(delegateId) {
            const idx = this.newDelegates.findIndex((delegate) => delegate._id === delegateId);
            const person = this.newDelegates.splice(idx, 1)[0];
            this.newMembers.unshift(person);

            this.isDirty = true;
            this.$emit('change', this.newDelegates);
        },
        onAddDelegate(memberId) {
            const idx = this.newMembers.findIndex((member) => member._id === memberId);
            const person = this.newMembers.splice(idx, 1)[0];
            this.newDelegates.unshift(person);

            this.isDirty = true;
            this.$emit('change', this.newDelegates);
        },
        end() {

            this.$emit('person-picker-close');
        },
    },
    beforeDestroy() {
        if (this.isDirty) this.$emit('input', this.newDelegates);
    },
    components: {
        personPreview,
    },
};
</script>
