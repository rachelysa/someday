// import { boardService } from '@/services/board.service.js';

export const taskStore = {
    strict: true,
    actions: {
        async updateTask(context, { task, groupId }) {
            // Make a copy of the current board with the updated task in place of the older one.
            
            let boardCopy = JSON.parse(JSON.stringify(context.getters.currBoard));
            const groupIdx = boardCopy.groups.findIndex((group) => group.id === groupId);
            const taskIdx = boardCopy.groups[groupIdx].tasks.findIndex((tsk) => tsk.id === task.id);
            boardCopy.groups[groupIdx].tasks.splice(taskIdx, 1, task);

            // Write updated board to store
            try {
                context.dispatch({ type: 'saveBoard', board: boardCopy });
            } catch (err) {
                console.log('Error in taskStore => updateTask failed\n', err);
            }
        },
        async addTask(context, { task, groupId }) {
            // Make a copy of the current board and add the new task to it.

            let boardCopy = JSON.parse(JSON.stringify(context.getters.currBoard));
            const groupIdx = boardCopy.groups.findIndex((group) => group.id === groupId);
            boardCopy.groups[groupIdx].tasks.push(task);

            // Write updated board to store

            try {
                context.dispatch({ type: 'saveBoard', board: boardCopy });
            } catch (err) {
                console.log('Error in taskStore => addTask failed\n', err);
            }
        },
        async duplicateTask(context, { task, taskCopy, groupId }) {
            // Make a copy of the current board and add the duplicated task to it,
            // right after the original task.

            let boardCopy = JSON.parse(JSON.stringify(context.getters.currBoard));
            const groupIdx = boardCopy.groups.findIndex((group) => group.id === groupId);
            const taskIdx = boardCopy.groups[groupIdx].tasks.findIndex((tsk) => tsk.id === task.id);
            boardCopy.groups[groupIdx].tasks.splice(taskIdx + 1, 0, taskCopy);

            // Write updated board to store

            try {
                context.dispatch({ type: 'saveBoard', board: boardCopy });
            } catch (err) {
                console.log('Error in taskStore => addTask failed\n', err);
            }
        },
        async removeTask(context, { task, groupId }) {
            // Make a copy of the current board and remove the task from it.

            let boardCopy = JSON.parse(JSON.stringify(context.getters.currBoard));
            const groupIdx = boardCopy.groups.findIndex((group) => group.id === groupId);
            const taskIdx = boardCopy.groups[groupIdx].tasks.findIndex((tsk) => tsk.id === task.id);
            boardCopy.groups[groupIdx].tasks.splice(taskIdx, 1);

            // Write updated board to store

            try {
                context.dispatch({ type: 'saveBoard', board: boardCopy });
            } catch (err) {
                console.log('Error in taskStore => addTask failed\n', err);
            }
        },
        async saveTasks(context, { tasks, groupId }) {
            // This action is used in drag n' drop to update the order of tasks in the board.
            // Make a copy of the current board and with the updated tasklist.

            let boardCopy = context.getters.currBoard;
            // const groupIdx = boardCopy.groups.findIndex((group) => group.id === groupId);
            // boardCopy.groups[groupIdx].tasks = tasks;
            // Write updated board to store

            try {
                
                context.commit({ type: 'changeTasks', tasks, groupId, board: boardCopy });
                context.dispatch({ type: 'saveBoard', board: context.getters.currBoard });
            } catch (err) {
                console.log('Error in taskStore => addTask failed\n', err);
            }
        },
    },
    mutations: {
        changeTasks(state, { tasks, groupId, board }) {
           

            const groupIdx = board.groups.findIndex((group) => {
                return group.id === groupId;
            });

            board.groups[groupIdx].tasks = tasks;
        },
    },
    getters: {
       
    },
};
