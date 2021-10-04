import { boardService } from '@/services/board.service.js';
import { userService } from '../services/user.service';
import { socketService } from '@/services/socket.service.js';
import { columnHelpers } from '@/services/column.helpers.js';

export const boardStore = {
    strict: true,
    state: {
        boards: [],
        currBoard: null,
        filteredBoard: null,
        filterBy: {
            txt: '',
        },
    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        loadBoard(state, { board }) {
            state.currBoard = board;
            if(state.filterBy.txt === '' ) state.filteredBoard = state.currBoard
        },
        removeBoard(state, { boardId }) {
            const idx = state.boards.findIndex((board) => board._id === boardId);
            state.boards.splice(idx, 1);
        },
        updateBoard(state, { updateBoard }) {
            const idx = state.boards.findIndex((board) => board._id === updateBoard._id);
            state.boards.splice(idx, 1, updateBoard);
            state.currBoard = updateBoard;

        },
        setFilter(state, { filterBy }) {

            state.filteredBoard = JSON.parse(JSON.stringify(state.currBoard)) // ? maybe dont need this?
            state.filterBy = JSON.parse(JSON.stringify(filterBy))

            const regex = new RegExp(state.filterBy.txt, 'i')
            const filteredGroups = []
            
            state.currBoard.groups.forEach((group) => {
                if (regex.test(group.title)) {
                    filteredGroups.push(group);
                } else {
                    let filteredTasks = group.tasks.filter(
                        task =>
                            regex.test(task.title) ||
                            state.currBoard.columns.some(column =>
                                {
                                   
                                    return regex.test(columnHelpers[column].txt(task.columns[column]))}
                            )
                        )
        
                    if (filteredTasks.length) {
                        const filteredGroup = JSON.parse(JSON.stringify(group))
                        filteredGroup.tasks = filteredTasks
                        filteredGroups.push(filteredGroup)
                    }
                }
            })
            state.filteredBoard.groups = filteredGroups
        },
        addActivity(state, { activity }) {
            state.currBoard.activities.unshift(activity);
 
        },
        registerActivity(state, { activity }){
          
            state.currBoard.activities.unshift(activity)
        },
        setFilterList(state, { filteredBoards }) {
            state.boards = filteredBoards;
        },
        toggleLike(state, { id,userToToggle }) {
           
            const updateIdx = state.currBoard.activities.findIndex((update) => update.id === id);
            
           
            const userIdx = state.currBoard.activities[updateIdx].content.likedBy.findIndex((user) => {
                return user._id === userToToggle._id;
            });

            if (userIdx === -1)  state.currBoard.activities[updateIdx].content.likedBy.push(userToToggle);
          
            else  state.currBoard.activities[updateIdx].content.likedBy.splice(userIdx, 1);
                   },
        setColumns(state, { columns }) {
            state.currBoard.columns = columns;
        },
        removeUpdate(state, { updateId }) {
            const idx = state.currBoard.activities.findIndex((update) => {
                return update.id === updateId;
            });
            state.currBoard.activities.splice(idx, 1);
        },
    },
    actions: {
        async loadBoards(context) {
            const boards = await boardService.query();
            context.commit({ type: 'setBoards', boards });
        },
        async loadBoard(context, { boardId }) {
            const board = await boardService.getById(boardId);
            // debugger
            context.commit({ type: 'loadBoard', board });
        },
        async saveBoard(context, { board }) {
            socketService.emit('board-updated', board);
            socketService.emit('board-list-updated');
            const newBoard = await boardService.save(board);
            context.commit({ type: 'loadBoard', board: newBoard });
            await context.dispatch({ type: 'loadBoards' }); // ?? do we need this here? consider updating the list locally
        },
        async saveMiniBoard(context, { miniBoard }) {
            try {
                let boardCopy;

                if (miniBoard._id === context.getters.currBoard._id) {
                    boardCopy = JSON.parse(JSON.stringify(context.getters.currBoard));
                } else {
                    boardCopy = await boardService.getById(miniBoard._id);
                }
                boardCopy.title = miniBoard.title;
                boardCopy.description = miniBoard.description;
                boardCopy.isFavorite = miniBoard.isFavorite;

                const newBoard = await boardService.save(boardCopy);
                await context.dispatch({ type: 'loadBoards' });
                context.commit({ type: 'loadBoard', board: newBoard });
                socketService.emit('board-list-updated');
            } catch (err) {
                console.log('err');
            }
        },
        async removeBoard(context, { boardId }) {
            await boardService.remove(boardId);
            context.commit({ type: 'removeBoard', boardId });
            socketService.emit('board-list-updated');
        },
        async duplicateBoard(context, { boardId }) {
            try {
                const boardCopy = await boardService.getById(boardId);
                delete boardCopy._id;
                boardCopy.activities = []
                boardCopy.title = 'Copy of ' + boardCopy.title;
                const newBoard = await boardService.save(boardCopy);
                await context.dispatch({ type: 'loadBoards' });
                // context.commit({ type: 'setBoards', boards });
                context.commit({ type: 'loadBoard', board: newBoard });
                socketService.emit('board-list-updated');
            } catch (err) {
                console.log('couldnt duplicate board', err);
            }
        },
       
        async saveUpdate(context, { taskId, txt }) {
            
            const currUser = JSON.parse(JSON.stringify(context.getters.loggedinUser))
         
            delete currUser.activities

            const activity = { 
                boardId: context.getters.currBoard._id,
                taskId: taskId,
                type: 'new-msg',
                createdBy: currUser,
                content: { txt ,likedBy:[]},
            }
        
            try {
                await context.dispatch({ type: 'addActivity', activity })
            } catch (err) {
                console.log('error registering new chat msg\n', err)
                throw err
            }
        },
        async setFilterList(context, { filterBy }) {
            try {
                const filteredBoards = await boardService.query(filterBy);
                context.commit({ type: 'setFilterList', filteredBoards });
            } catch (err) {
                console.log('couldnt filtered', err);
            }
        },
        async addActivity(context, { activity }) {
            socketService.emit('task-updated', activity);
            activity = await boardService.addActivity(activity);  
 
            context.commit({ type: 'addActivity', activity })
        },
        async toggleUpdateLike(context, { id }) {
            const userToToggle = context.getters.loggedinUser;
            context.commit({ type: 'toggleLike', id,userToToggle });
            context.dispatch({ type: 'saveBoard', board: context.getters.currBoard });
        },
     
        async saveUser(context, { user }) {
            await userService.update(user);
            console.log(context);
        },
        async removeUpdate(context, { updateId }) {
            context.commit({ type: 'removeUpdate', updateId });
            await context.dispatch({ type: 'saveBoard', board: context.getters.currBoard });
        },
    },
    getters: {

        boards(state) {
            return state.boards;
        },
        currBoard(state) {
            return state.currBoard;
        },
        currBoardFiltered(state){
               return state.filteredBoard
        },
        getEmptyTask(state) {
            return boardService.getEmptyTask(state.currBoard);
        },

        getActivitiesByItem: (state) => (taskId, ActivityType) => {
            if (state.currBoard.activities) {
                const filteredActivities =  state.currBoard.activities.filter(activity => {
                    return (activity.taskId === taskId && activity.type === ActivityType)
                });
                   if(filteredActivities.length)   return filteredActivities
            }
            return []
        },

    },
};
