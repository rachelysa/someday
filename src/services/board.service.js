import { httpService } from '@/services/http.service.js';
// import { storageService } from '@/services/async-storage.service.js';
import { columnHelpers } from '@/services/column.helpers.js';
import { utilService } from './util.service.js';

// const KEY = 'somedayBoard';
const BOARD_URL = 'board/';
const ACTIVITY_URL = 'activity/';

export const boardService = {
    query,
    getById,
    remove,
    save,
    getEmptyBoard,
    getEmptyGroup,
    getEmptyTask,
    getEmptyFilter, // Everything under here should be in store.
    getActivitiesByItem,
    getUpdatesByItem,
    // getEmptyUpdate,
    getEmptyActivity,
    addActivity,
};

// Board service
async function query(filterBy = {}) {
    if (!filterBy) filterBy = getEmptyFilter();
    const regex = new RegExp(filterBy.txt, 'i');
    // let boards = await httpService.get('boards', {filterBy})
    let boards = await httpService.get(BOARD_URL);
    const filteredBoards = boards.filter((board) => regex.test(board.title));
    // boards.boards = boards.map((board) => {
    //     return { _id: board._id, title: board.title, isFavorite: board.isFavorite };
    // });
    return filteredBoards;
}

async function getById(id) {
    const board = await httpService.get(BOARD_URL + id);
    // const regex = new RegExp(filterBy.txt, 'i');

    // var filteredGroups = [];
    // board.groups.forEach((group) => {
    //     if (regex.test(group.title)) {
    //         filteredGroups.push(group);
    //     } else {
    //         let filteredTasks = group.tasks.filter(
    //             (task) =>
    //                 regex.test(task.title) ||
    //                 board.columns.some((column) =>
    //                     regex.test(columnHelpers[column].txt(task.columns[column]))
    //                 )
    //         );

    //         if (filteredTasks.length) {
    //             group.tasks = filteredTasks;
    //             filteredGroups.push(group);
    //         }
    //     }
    // });
    // board.groups = filteredGroups;
    return board;
}

async function remove(id) {
    return await httpService.delete(BOARD_URL + id);
}

async function save(board) {
    if (board._id) {
        return await httpService.put(BOARD_URL + board._id, board);
    } else {
        return await httpService.post(BOARD_URL, board);
    }
}
async function addActivity(activity){
    return await httpService.post(ACTIVITY_URL + 'add', activity)
}
function getEmptyBoard() {
    const newBoard = JSON.parse(JSON.stringify(gBoards[0]));
    console.log(newBoard);
    newBoard.groups.forEach((group) => {
        group.id = utilService.makeId();
        group.tasks.forEach((task) => {
            task.id = utilService.makeId();
            newBoard.columns.forEach(
                (column) => (task.columns[column] = columnHelpers[column].init())
            );
        });
    });
    return newBoard;
}

function getEmptyGroup() {
    const newGroup = {
        id: utilService.makeId(),
        title: 'New group',
        createdAt: 0,
        tasks: [],
        style: {
            color: _getRandomColor(),
        },
    };
    return newGroup;
}

function getEmptyTask(currBoard) {
    const newTask = {
        id: utilService.makeId(),
        title: '',
        createdAt: 0,
        columns: {},
    };
    currBoard.columns.forEach((column) => (newTask.columns[column] = columnHelpers[column].init()));
    return newTask;
}

function getEmptyFilter() {
    return {
        txt: '',
        sortBy: 'title',
    };
}
// function getEmptyUpdate(){
//     return {
//         id: utilService.makeId(),
//         itemId: '',
//         createdAt: null,
//         txt: '',
//         createdBy: {
//             _id: '',
//             fullname: '',
//             imgUrl: '',
//         },
//         likedBy: []
//     }
// }
function getEmptyActivity(){
  return  {
        id: utilService.makeId(),
        itemId: '',
        itemName: '',
        type: '',
        createdAt: null,
        createdBy: {
            _id: '',
            fullname: '',
            imgUrl: '',
        },
        msg: '',
    }
}
function getActivitiesByItem(itemId) {
    return gActivities.filter((activity) => {
        return activity.itemId === itemId;
    });
}
const gActivities = [
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        type: 'status',
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Muki Suflaki',
            imgUrl: 'http://some-img.jpg',
        },
        msg: 'status change from stuck to done',
    },
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        type: 'delegates',
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Muki Suflaki',
            imgUrl: 'http://some-img.jpg',
        },
        msg: 'Sharon Macaron was added from the task',
    },
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        type: 'delegates',
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Muki Suflaki',
            imgUrl: 'http://some-img.jpg',
        },
        msg: 'Sharon Macaron was deleted from the task',
    },
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        type: 'rename',
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Muki Suflaki',
            imgUrl: 'http://some-img.jpg',
        },
        msg: 'the title renamed from task to board list',
    },
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        type: 'timeline',
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Rachel Bekarov',
            imgUrl: 'http://some-img.jpg',
        },
        msg: 'change date from 11/07/2021 to 18/07/2021',
    },
];

function getUpdatesByItem(itemId) {
    return gUpdates.filter((update) => {
        return update.itemId === itemId;
    });
}

const gUpdates = [
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        createdAt: Date.now(),
        txt: 'bla bla bla',
        createdBy: {
            _id: 'u101',
            fullname: 'Rachel Bekarov',
            imgUrl: 'http://some-img.jpg',
        },
        likedBy: [],
    },
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        createdAt: Date.now(),
        txt: 'hi everyOne',
        createdBy: {
            _id: 'u101',
            fullname: 'Rachel Bekarov',
            imgUrl: 'http://some-img.jpg',
        },
        likedBy: [],
    },
    {
        id: utilService.makeId(),
        itemId: 't101',
        itemName: 'Board list',
        createdAt: Date.now(),
        txt: 'like it',
        createdBy: {
            _id: 'u101',
            fullname: 'Rachel Bekarov',
            imgUrl: 'http://some-img.jpg',
        },
        likedBy: [
            {
                _id: 'u103',
                fullname: 'Sharon Macaron',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: 'u104',
                fullname: 'Eden Maran',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
        ],
    },
];
// Private functions

function _getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const gBoards = [
    {
        title: 'New board',
        description: 'What is this board about...?',
        isFavorite: false,
        createdAt: Date.now(),
        createdBy: {
            _id: '60f562f7a22a0da5023ec2be',
            fullname: 'Avior Hagibor',
            imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
        },
        columns: ['status', 'date', 'delegates', 'tags'],
        groups: [
            {
                id: 'g101',
                title: 'Group 1',
                tasks: [
                    {
                        id: 't101',
                        title: 'Item 1',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [],
                            status: { id: 's000', txt: '', color: '#c4c4c4' },
                            date: Date.now(),
                            tags: ['UI', 'DB'],
                        },
                    },
                    {
                        id: 't102',
                        title: 'Item 2',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [],
                            status: { id: 's000', txt: '', color: '#c4c4c4' },
                            date: Date.now(),
                            tags: ['front-end'],
                        },
                    },
                    {
                        id: 't103',
                        title: 'Item 3',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [],
                            status: { id: 's000', txt: '', color: '#c4c4c4' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                ],
                style: {
                    color: 'rgba(196, 27, 182, 1)',
                },
            },
            {
                id: 'g201',
                title: 'Group II',
                tasks: [
                    {
                        id: 't201',
                        title: 'Item 4',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [],
                            status: { id: 's000', txt: '', color: '#c4c4c4' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                    {
                        id: 't202',
                        title: 'Item 5',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [],
                            status: { id: 's000', txt: '', color: '#c4c4c4' },
                            date: Date.now(),
                            tags: ['UI'],
                        },
                    },
                ],
                style: {
                    color: 'rgba(30, 144, 255, 1)',
                },
            },
        ],
        members: [
            {
                _id: '60f562f7a22a0da5023ec2be',
                fullname: 'Avior Hagibor',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id : '60f5642ea22a0da5023ec2bf',
                fullname: 'Rachel Bekarov',
                imgUrl: 'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
            {
                _id: '60f5644aa22a0da5023ec2c0',
                fullname: 'Sharon Macaron',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: '60f7b029c66d343ab4f0c562',
                fullname: 'Eden Maran',
                imgUrl: 'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
            {
                _id: '60f7b04ec66d343ab4f0c563',
                fullname: 'Muki Suflaki',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: '60f7b064c66d343ab4f0c564',
                fullname: 'Shimi Halimi',
                imgUrl: 'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            }        
        ],
        statuses: [
            { id: 's001', txt: 'Done', color: '#33d391' },
            { id: 's002', txt: 'In progress', color: '#fdbc64' },
            { id: 's003', txt: 'Stuck', color: '#e8697d' },
            { id: 's000', txt: '', color: '#c4c4c4' }, // unspecified - default
        ],
        tags: ['front-end', 'back-end', 'UI', 'DB'],
        styles: {},
        activities: [],
    },
];