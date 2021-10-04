<template>
    <section v-if="groups" class="group-list">
        <draggable
            v-model="groupsCopy"
            ghost-class="ghost"
            @start="onStart"
            @end="onEnd"
            handle=".handle-group"
        >
            <transition-group type="transition" name="flip-list">
                <ul class="group-container sortable" v-for="group in groupsCopy" :key="group.id">
                    <div class="group-details">
                        <div class="preview-group">
                            <div class="group-title">
                                <el-dropdown trigger="click">
                                    <el-button class="btn-more-groups" size="mini">
                                        <i
                                            :style="{ color: group.style.color }"
                                            class=" group-dropdown-menu fas fa-chevron-circle-down"
                                        ></i>
                                    </el-button>
                                    <el-dropdown-menu trigger="click" size="medium" slot="dropdown">
                                        <el-dropdown-item
                                            @click.native="collapseAllButThis(group.id)"
                                        >
                                            <i class="fas fa-compress-arrows-alt"></i> Collapse all
                                            but this group
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            divided
                                            @click.native="collapseSingleGroup(group.id)"
                                        >
                                            <i class="fas fa-compress-alt"></i> Collapse this group
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="collapseGroups">
                                            <i class="fas fa-compress-alt"></i> Collapse All Groups
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            divided
                                            @click.native="openSingleGroup(group.id)"
                                        >
                                            <i class="fas fa-expand-alt"></i> Open this group
                                        </el-dropdown-item>

                                        <el-dropdown-item @click.native="openGroups">
                                            <i class="fas fa-expand-alt"></i> Open All Groups
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            divided
                                            @click.native="setToEdit(group, group.id)"
                                        >
                                            <i class="fas fa-pen"></i> Rename Group
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="removeGroup(group)">
                                            <i class="far fa-trash-alt"></i> Delete Group
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="duplicateGroup(group)">
                                            <i class="far fa-copy"></i> Duplicate Group
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            @mouseover.native="openColorPallete"
                                            divided
                                            class="color-change"
                                            :style="{ color: group.style.color }"
                                        >
                                            <i class="fas fa-palette"></i>
                                            change color
                                            <el-color-picker
                                                @change="changeColor(group)"
                                                v-model="group.style.color"
                                                :predefine="predefineColors"
                                            >
                                            </el-color-picker>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>

                                <li
                                    class="group-title handle-group"
                                    :style="{ color: group.style.color }"
                                    @click="setToEdit(group, group.id)"
                                    v-show="!isEditingState || currEditedGroup != group.id"
                                >
                                    {{ group.title }}
                                </li>
                                <input
                                    class="input group-title"
                                    :ref="group.id"
                                    v-show="isEditingState && currEditedGroup == group.id"
                                    @blur="updateGroupName(group)"
                                    @keydown.enter="updateGroupName(group)"
                                    type="text"
                                    v-model="group.title"
                                />
                            </div>

                            <draggable
                                class="columns"
                                ghost-class="ghost-columns"
                                v-model="columns"
                            >
                                <div
                                    class="column-title"
                                    v-for="(column, idx) in columns"
                                    :key="idx"
                                    @click="sortBy(column, group.tasks)"
                                >
                                    <!-- <i v-show="isHover" class="fas fa-grip-vertical"></i> -->
                                    {{ captilize(column) }}
                                    <!-- <i :class="columnSortIcon(column)"></i> -->
                                </div>
                            </draggable>
                        </div>
                    </div>

                    <task-list
                        v-show="!isAllCollapse && !collapsedGroups.includes(group.id)"
                        :tasks="group.tasks"
                        :color="group.style"
                        :group="group"
                        :groupId="group.id"
                        :columnOrder="columnOrder"
                        @openTaskDetails="openTaskDetails"
                    />
                </ul>
            </transition-group>
        </draggable>
    </section>
</template>

<script>
import taskList from './task-list.vue';
import draggable from 'vuedraggable';
import { columnHelpers } from '@/services/column.helpers.js';

export default {
    props: {
        groups: Array,
    },

    data() {
        return {
            isHover: false,
            isAllCollapse: false,
            groupsCopy: null,
            isPickColor: false,
            collapsedGroups: [],
            isGroupCollapse: null,
            isEditingState: false,
            currEditedGroup: null,
            predefineColors: [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577',
            ],
            sortColumn: '',
            sortDir: 1,

            columnOrder: null,
        };
    },

    created() {
        this.groupsCopy = JSON.parse(JSON.stringify(this.groups));
        this.columnOrder = this.$store.getters.currBoard.columns;
    },

    watch: {
        groups(newVal) {
            this.groupsCopy = JSON.parse(JSON.stringify(newVal));
        },
        columns() {
            this.columnOrder = this.$store.getters.currBoard.columns;
        },
    },
    components: {
        taskList,
        draggable,
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
        // toggleHover(bool) {
        //     this.isHover = bool;
        // },
        captilize(title) {
            const captilizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
            return captilizedTitle;
        },
        openColorPallete() {
            this.isPickColor = true;
        },
        closeColorPallete() {
            this.isPickColor = false;
        },
        onStart() {
            this.isAllCollapse = true;
        },
        onEnd() {
            this.$emit('updateDrag', this.groupsCopy);
            this.isAllCollapse = false;
        },
        collapseSingleGroup(groupId) {
            this.collapsedGroups.push(groupId);
        },
        openSingleGroup(groupId) {
            this.isAllCollapse = false;
            const idx = this.collapsedGroups.findIndex((id) => id === groupId);
            this.collapsedGroups.splice(idx, 1);
        },
        collapseAllButThis(groupId) {
            this.groups.forEach((group) => {
                if (group.id != groupId) this.collapsedGroups.push(group.id);
            });
        },
        collapseGroups() {
            this.collapsedGroups = this.groups.map((gp) => gp.id);
            this.isAllCollapse = true;
        },
        openGroups() {
            this.isAllCollapse = false;
            this.collapsedGroups = [];
        },
        setToEdit(group, groupId) {
            setTimeout(() => {
                this.$refs[groupId][0].focus();
            }, 0);
            this.currEditedGroup = group.id;
            this.isEditingState = true;
        },
        updateGroupName(group) {
            this.$emit('updateGroupName', group);
            this.isEditingState = false;
            this.currEditedGroup = null;
        },
        removeGroup(group) {
            this.$emit('removeGroup', group);
        },
        duplicateGroup(group) {
            const duplicatedGroup = JSON.parse(JSON.stringify(group));
            this.$emit('duplicateGroup', duplicatedGroup);
        },
        changeColor(group) {
            this.$emit('changeColor', group);
            this.isPickColor = false;
        },
        openTaskDetails(taskId) {
            this.$emit('openTaskDetails', taskId);
        },
        sortBy(column, tasks) {
            
            if (this.sortColumn === column) {
                this.sortDir *= -1;
            } else {
                this.sortColumn = column;
                this.sortDir = 1;
            }

            tasks.sort(columnHelpers[column].compare);
            if (this.sortDir === -1) tasks.reverse();
        },
        columnSortIcon(column) {
            if (this.sortColumn !== column) {
                return '';
            }
            if (this.sortDir === 1) return 'fas fa-arrow-up';
            else return 'fas fa-arrow-down';
        },
    },
};
</script>
