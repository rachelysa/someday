<template>
    <section class="board-header">
        <div class="board-info">
            <div class="board-title">
                <div class="main-title">
                    <h2
                        @click="setToEdit('title')"
                        v-show="!isEditingState || currEditedTag !== 'title'"
                    >
                        {{ board.title }}
                    </h2>
                    <input
                        ref="title"
                        v-show="isEditingState && currEditedTag === 'title'"
                        @blur="updateTag"
                        @keydown.enter="updateTag"
                        type="text"
                        v-model="board.title"
                    />
                    <i class="fas fa-info-circle" @click="toggleDescription"></i>
                    <i v-show="board.isFavorite" @click="toggleFavorites" class="fas fa-star favorive"></i>
                    <i v-show="!board.isFavorite" @click="toggleFavorites" class="far fa-star favorive"></i>
                </div>
                <transition
                    enter-active-class="animate__animated animate__fadeInUp animate__faster"
                    leave-active-class="animate__animated animate__fadeOutDown animate__faster"
                >
                    <div class="sub-title" v-if="isDecriptionShown">
                        <p
                            @click="setToEdit('description')"
                            v-show="!isEditingState || currEditedTag !== 'description'"
                        >
                            {{ board.description }}
                        </p>

                        <textarea
                            ref="description"
                            type="textarea"
                            rows="4"
                            cols="50"
                            @blur="updateTag"
                            @keydown.enter="updateTag"
                            v-show="isEditingState && currEditedTag === 'description'"
                            v-model="board.description"
                        />
                    </div>
                </transition>
            </div>
            <div class="members">
                <div class="members-avatars">
                    <span class="avatar" v-for="member in board.members" :key="member._id">
                        <avatar
                            :size="30"
                            :src="member.imgUrl"
                            :username="member.fullname"
                        ></avatar>
                    </span>
                </div>

                <el-popover title="Board Members" placement="right" width="400" trigger="click">
                    <el-table :data="members">
                        <el-table-column width="45">
                            <template slot-scope="scope">
                                <avatar
                                    :size="30"
                                    :src="scope.row.imgUrl"
                                    :username="scope.row.fullname"
                                ></avatar>
                            </template>
                        </el-table-column>
                        <el-table-column property="fullname" label="Fullname"></el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <el-button size="mini" @click="updateTag(scope.$index, scope.row)"
                                    >Edit</el-button
                                >
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click="updateTag(scope.$index, scope.row)"
                                    >Delete</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button size="mini" slot="reference">Show Board Memebrs</el-button>
                </el-popover>
            </div>
        </div>

        <div class="board-actions">
            <!-- <div class="board-filter"> -->
            <el-button size="small" type="primary" @click.native="addGroup">
                New Group
            </el-button>
            <el-input
                size="small"
                @input="setFilter"
                v-model="filterBy.txt"
                placeholder="Search something"
                prefix-icon="el-icon-search"
            ></el-input>

            <!-- PERSON -->
            <el-dropdown trigger="click">
                <el-button class="btn-filter" size="medium" type="primary">
                    <i class="el-icon-s-custom"></i> Person
                </el-button>
                <el-dropdown-menu slot="dropdown" v-if="board.members">
                    <el-dropdown-item @click.native="setFilterPerson('')">
                        All
                    </el-dropdown-item>
                    <el-dropdown-item
                        @click.native="setFilterPerson(member.fullname)"
                        v-for="member in board.members"
                        :key="member._id"
                    >
                        {{ member.fullname }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <column-picker v-model="columns"></column-picker>
        </div>
    </section>
</template>

<script>
import columnPicker from '@/components/columns/column-picker.vue';
import Avatar from 'vue-avatar';

export default {
    props: {
        board: Object,
    },
    data() {
        return {
            isEditingState: false,
            currEditedTag: null,
            isDecriptionShown: true,
            filterBy: { txt: '' },
            isMembersShown: false,
            members: null,
        };
    },

    created() {
        this.members = this.board.members;
    },
    computed: {
        columns: {
            get() {
                return this.$store.getters.currBoard.columns;
            },
            set(columns) {
                this.$store.commit({ type: 'setColumns', columns });
            },
        },
    },
    methods: {
        showBoardMembers() {
            this.isMembersShown = !this.isMembersShown;
        },
        setToEdit(tag) {
            this.isEditingState = true;
            this.currEditedTag = tag;
            setTimeout(() => {
                this.$refs[tag].focus();
            }, 0);
        },
        updateTag() {
            this.$emit('updateTitles', this.board);
            this.isEditingState = false;
            this.currEditedTag = null;
        },
        saveBoard() {
            this.$emit('updateTitles', this.board);
        },
        toggleDescription() {
            this.isDecriptionShown = !this.isDecriptionShown;
        },
        addGroup() {
            this.$emit('addNewGroup');
        },
        setFilter() {
            this.$emit('setFilter', this.filterBy);
        },
        setFilterPerson(person) {

            this.filterBy.txt = person;
            this.$emit('setFilter', this.filterBy);
        },
        toggleFavorites(){
    
            this.$emit('favotites',this.board._id)
        }
    },
    components: {
        Avatar,
        columnPicker,
    },
};
</script>

<style></style>
