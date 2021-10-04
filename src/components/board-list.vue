<template>
    <section>
        <i
            class="arrow el-icon-arrow-left"
            aria-hidden="true"
            :class="{ close: !isNavOpen }"
            @click="closeNav"
            v-show="isNavOpen"
        ></i>
        <i
            v-show="!isNavOpen"
            class="arrow el-icon-arrow-right"
            :class="{ close: !isNavOpen }"
            @click="closeNav"
        ></i>
        <transition name="fade">
            <section class="board-list" :class="{ close: !isNavOpen }">
                <p v-show="isNavOpen" class="title">Boards</p>

                <section v-show="isNavOpen" class="board-list-actions">
                    <article class="action act-add" @click="addBoard">
                        <i class="fas fa-plus fa-sm"></i>
                        <span>Add board</span>
                    </article>

                    <article class="action">
                        <el-input
                            size="medium"
                            class="act-search"
                            placeholder="Search"
                            v-model="filterBy.txt"
                            @input="setFilter"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </article>
                </section>

                <section v-show="isNavOpen" class="board-list-items">
                    <p v-show="isNavOpen" class="title"><i class="far fa-star"></i> Favorites</p>

                    <!-- FAVORITES -->
                    <board-preview
                        v-for="(board, idx) in boards"
                        :key="idx"
                        v-show="board.isFavorite"
                        :miniBoard="board"
                        @deleteBoard="deleteBoard"
                        @addToFavorites="addToFavorites"
                        @duplicateBoard="duplicateBoard"
                        @updateBoardName="updateBoardName"
                    />

                    <el-divider></el-divider>

                    <p v-show="isNavOpen" class="title">
                        <i class="fas fa-border-all"></i> All Boards
                    </p>

                    <!-- ALL BOARDS -->
                    <board-preview
                        v-for="board in boards"
                        :key="board._id"
                        v-show="!board.isFavorite"
                        :miniBoard="board"
                        @deleteBoard="deleteBoard"
                        @addToFavorites="addToFavorites"
                        @duplicateBoard="duplicateBoard"
                        @updateBoardName="updateBoardName"
                    />
                </section>
            </section>
        </transition>
    </section>
</template>

<script>
import boardPreview from './board-preview.vue';
import { boardService } from '@/services/board.service.js';

export default {
    props: {
        boards: {
            type: Array,
            required: true,
        },
        // favBoards:Array
    },
    data() {
        return {
            isNavOpen: false,
            filterBy: { txt: '' },
            favBoards: [],
            windowWidth: null,
        };
    },
    methods: {
        closeNav() {
            this.isNavOpen = !this.isNavOpen;
        },
        setFilter() {
            this.$store.dispatch({ type: 'setFilterList', filterBy: this.filterBy });
        },
        addBoard() {
            this.$prompt('Please Enter Board Name', 'Add Board', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                inputPattern: /\w*[a-zA-Z]\w*/,
                inputErrorMessage: 'Invalid Name',
            })
                .then(({ value }) => {
                    const newBoard = boardService.getEmptyBoard();
                    const boardTitle = value;
                    newBoard.title = boardTitle;
                    this.$store.dispatch({ type: 'saveBoard', board: newBoard });
                    this.$message({
                        type: 'success',
                        message: 'Your Board Name is: ' + value,
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Input canceled',
                    });
                });
        },
        updateBoardName(newTitle, boardId) {
            const miniBoards = this.$store.getters.boards;
            const boardToChange = miniBoards.find((board) => board._id === boardId);
            const miniBoard = JSON.parse(JSON.stringify(boardToChange));
            miniBoard.title = newTitle;
            this.$store.dispatch({ type: 'saveMiniBoard', miniBoard });
        },

        deleteBoard(boardId) {
            this.$store.dispatch({ type: 'removeBoard', boardId });
            this.$router.push('/board');
        },

        addToFavorites(boardId) {
         
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

        duplicateBoard(boardId) {
            this.$store.dispatch({ type: 'duplicateBoard', boardId });
        },
        reportWindowSize() {
            if (window.innerWidth <= 960) this.isNavOpen = false;
            else this.isNavOpen = true;
        },
    },
    async created() {
        await this.$store.dispatch({ type: 'loadBoards' });
        this.reportWindowSize();
        window.addEventListener('resize', this.reportWindowSize);
    },
    components: {
        boardPreview,
    },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active,
.board-list {
    transition: all 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
