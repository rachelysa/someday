<template>
    <section class="board-details">
        <template v-if="board">
            <board-header
                v-if="board"
                :board="board"
                @addNewGroup="addNewGroup"
                @updateTitles="updateTitles"
                @setFilter="setFilter"
                @favotites="toggleFavorites"
            />
            <group-list
                v-if="board"
                :groups="board.groups"
                @updateGroupName="updateGroupName"
                @removeGroup="removeGroup"
                @duplicateGroup="duplicateGroup"
                @changeColor="changeColor"
                @updateDrag="updateDrag"
                @openTaskDetails="openTaskDetails"
                 @favotites="toggleFavorites"
            />
            <router-view />
        </template>

        <!-- <div class="loader" v-else> -->
        <div class="loader" v-else>
            <img src="@/assets/img/loader.gif" alt="" />
        </div>
    </section>
</template>

<script>
// import { boardService } from '../services/board.service';
import { socketService } from '@/services/socket.service.js';
import boardHeader from '../components/board-header.vue';
import groupList from '../components/group-list.vue';
// import boardViews from '../components/board-views.vue';

export default {
    data(){
        return{
              favBoards: [],
        }
    },
    computed: {
        board() {
            return JSON.parse(JSON.stringify(this.$store.getters.currBoardFiltered));
        },

    },
    async created() {
        await this.loadBoard();
        await socketService.setup();
        socketService.emit('in-board', this.board._id);
        console.log('registering board on socket:', this.board._id);
        socketService.on('board-updated', this.updateBoard);
    },
    destroyed() {
        socketService.emit('left-board', this.board._id);
        socketService.on('board-updated');
    },

    methods: {
        updateBoard(board) {
         
            this.$store.commit({ type: 'loadBoard', board });
        },
        async loadBoard() {
            try {
                const { boardId } = this.$route.params;
                return await this.$store.dispatch({ type: 'loadBoard', boardId });
            } catch (error) {
                console.log('Couldnt load board');
            }
        },
        async updateDrag(updatedGroups) {
            try {
                await this.$store.dispatch({ type: 'saveGroups', updatedGroups });
            } catch (err) {
                console.log('Couldnt updated the order of the groups', err);
            }
        },
          toggleFavorites(boardId) {
             
            const miniBoards = this.$store.getters.boards;
            const boardToChange = miniBoards.find((board) => board._id === boardId);
            const miniBoard = JSON.parse(JSON.stringify(boardToChange));
            miniBoard.isFavorite = !miniBoard.isFavorite;
            if (miniBoard.isFavorite) {
                this.favBoards.unshift(miniBoard);
            } else {
                const idx = this.favBoards.findIndex((board) => board._id === miniBoard._id);
                this.favBoards.splice(idx, 1);
            }
            this.$store.dispatch({ type: 'saveMiniBoard', miniBoard });
        },
        async updateTitles(board) {
            try {
                await this.$store.dispatch({ type: 'saveBoard', board });
            } catch (err) {
                console.log('Couldnt updated the titles', err);
            }
        },

        async addNewGroup() {
            try {
                await this.$store.dispatch({ type: 'addNewGroup' });
            } catch (err) {
                console.log('Couldnt Added the new Group', err);
            }
        },
        async updateGroupName(updatedGroup) {
            try {
                await this.$store.dispatch({ type: 'updateGroupName', updatedGroup });
            } catch (err) {
                console.log('Couldnt updated the name of the group', err);
            }
        },
        async removeGroup(group) {
            try {
                await this.$store.dispatch({ type: 'removeGroup', group });
            } catch (err) {
                console.log('Couldnt remove the group', err);
            }
        },
        async duplicateGroup(duplicatedGroup) {
            try {
                await this.$store.dispatch({
                    type: 'duplicateGroup',
                    duplicatedGroup,
                });
            } catch (err) {
                console.log('Couldnt duplicate the group', err);
            }
        },
        async changeColor(group) {
            try {
                await this.$store.dispatch({ type: 'updateGroup', group });
            } catch (err) {
                console.log('Couldnt change the color of the group', err);
            }
        },
        openTaskDetails(taskId) {
            const board = this.$store.getters.currBoard;
            this.$router.push(`/board/${board._id}/task/${taskId}`);
        },
        setFilter(filterBy) {
            this.$store.commit({ type: 'setFilter', filterBy });
            // this.$store.dispatch({ type: 'setFilter', filterBy });

            // this.groupsToShow = this.board.groups.filter((group) =>
            //     group.title.includes(filterBy.txt)
            // );
        },
    },
    watch: {
        '$route.params.boardId': {
            // immediate: true,
            async handler() {
                await socketService.emit('left-board', this.board._id);
                this.loadBoard();
                socketService.emit('in-board', this.$route.params.boardId);
            },
        },
    },

    components: {
        boardHeader,
        groupList,
    },
};
</script>
