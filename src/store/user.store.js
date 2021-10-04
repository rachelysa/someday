import { userService } from '../services/user.service';

export const userStore = {
    strict: true,
    state: {
        user: null,
    },
    getters: {
        loggedinUser(state) {
            return state.user || { _id: 'u101', fullname: 'Guest', imgUrl: '', activities: [] };
        },
        loggedinMiniUser(state, getters) {
            const miniUser = JSON.parse(JSON.stringify(getters.loggedinUser))
            delete miniUser.activities
            return miniUser
        },
        isGuestUser(state) { return !state.user },
        taskActivities: (state, getters) => (taskId) => {
            if(getters.loggedinUser.activities){
                return getters.loggedinUser.activities.filter((activity) => activity.taskId === taskId);
            } else {
                return [];
            }
        },
        boardActivities: (state) => (boardId) => {
            return state.user.activities.filter((activity) => activity.boardId === boardId);
        },

        taskMsgCount: (state, getters) => (taskId) => {
            const msgCount = getters.taskActivities(taskId).reduce((acc, activity) => {
                return (acc += activity.type === 'new-msg' ? 1 : 0);
            }, 0);
            return msgCount;
        },
        boardMsgCount: (state) => (boardId) => {
            const msgCount = state.boardActivities(boardId).reduce((acc, activity) => {
                return (acc += activity.type === 'new-msg' ? 1 : 0);
            }, 0);
            return msgCount;
        },
        userActivityCount(state) {
            return state.user.activities.length;
        },
    },
    actions: {
        async login(context, { userCreds }){
            try {
                const user = await userService.login(userCreds)
                context.commit({type: 'setLoggedinUser', user})
            } catch (err) {
                console.log('error logging in\n', userCreds, err);
            }
        },
        async signup(context, { userCreds }) {
            try {
                const user = await userService.signup(userCreds);
                context.commit({ type: 'setLoggedinUser', user });
            } catch (err) {
                console.log('error signing up\n', userCreds, err);
            }
        },
        async logout(context){
            try {
                const user = await userService.logout()
                context.commit({type: 'logout', user})
            } catch (err) {
                console.log('error signing up\n', err);
            }
        },
        async removeTaskActivities(context, { taskId }) {
           
            if (context.getters.isGuestUser) return;
            const activity = { taskId };
            try {
                await userService.removeActivities(activity);
                context.commit({ type: 'removeTaskActivities', taskId });
            } catch (err) {
                console.log('error removing activities', taskId);
                throw err;
            }
        },
    },
    mutations: {
        setLoggedinUser(state, { user }) {
            state.user = JSON.parse(JSON.stringify(user));
            // delete user.activities;
            userService.setLoggedinUser(user);
        },
        logout(state){
            state.user = null
        },
        removeTaskActivities(state, { taskId }) {
            state.user.activities = state.user.activities.filter(
                activity => activity.taskd !== taskId
            );
        },
    },
};
