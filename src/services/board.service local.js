// import {httpService} from '@/services/http.service.js'
import { storageService } from '@/services/async-storage.service.js';
import { columnHelpers } from '@/services/column.helpers.js';
import { utilService } from './util.service.js';

const KEY = 'somedayBoard';
export const boardService = {
    query,
    getById,
    remove,
    save,
    getEmptyBoard,
    getEmptyTask,
    getEmptyFilter, // Everything under here should be in store.
    renameBoard,
    addToFavorites,
    duplicateBoard,
    // updateGroup,
    // updateGroups,
    // removeGroup,
    // duplicateGroup,
    getEmptyGroup,
    // addNewGroup,
    // updateTask,
    // addTask,
    // removeTask,
    // duplicateTask,
    // updateTasks,
};

// Board service
async function query() {
    // _createInitialData();
    // if(!filterBy) filterBy = getEmptyFilter()
    let boards = await storageService.query(KEY);
    if (!boards || boards.length === 0) boards = _createInitialData();

    boards = boards.map((board) => {
        return { _id: board._id, title: board.title };
    });
    return boards;
    // return await httpService.get('toy', {filterBy})
}

async function getById(id, filterBy = { txt: '' }) {
    const board = await storageService.get(KEY, id);
    const regex = new RegExp(filterBy.txt, 'i');

    var filteredGroups = [];
    board.groups.forEach((group) => {
        if (regex.test(group.title)) {
            filteredGroups.push(group);
        } else {
            let filteredTasks = group.tasks.filter(
                (task) =>
                    regex.test(task.title) ||
                    board.columns.some((column) =>
                        regex.test(columnHelpers[column].txt(task.columns[column]))
                    )
            );

            if (filteredTasks.length) {
                group.tasks = filteredTasks;
                filteredGroups.push(group);
            }
        }
    });
    board.groups = filteredGroups;
    return board;
    // return await storageService.get(KEY, id);
    // return await httpService.get('toy/' + id)
}

async function remove(id) {
    return await storageService.remove(KEY, id);
    // return await httpService.delete('toy/' + id)
}

async function renameBoard(newTitle, boardId) {
    const board = await getById(boardId);
    board.title = newTitle;
    return await save(board);
}

async function addToFavorites(boardId) {
    const board = await getById(boardId);
    board.isFavorite = !board.isFavorite;
    return await save(board);
}

async function save(board) {
    if (board._id) {
        return await storageService.put(KEY, board);
        // return await httpService.put('toy/' + toy._id, toy)
    } else {
        return await storageService.post(KEY, board);
        // return await httpService.post('toy/', toy)
    }
}

async function duplicateBoard(boardId) {
    const duplicatedBoard = await getById(boardId);
    duplicatedBoard.title = `Copy of ${duplicatedBoard.title}`;
    await storageService.post(KEY, duplicatedBoard);
    return await query();
}

function getEmptyBoard() {
    const newBoard = JSON.parse(JSON.stringify(gBoards[0]));
    newBoard._id = null;
    newBoard.isFavorite = false;

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
        inStock: 'all',
        toyType: 'all',
        sortBy: 'name',
    };
}

function _getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Data initailization
const gBoards = [
    {
        _id: 'b101',
        title: 'Frontend',
        description: 'This is very awesome!',
        isFavorite: false,
        createdAt: Date.now(),
        createdBy: {
            _id: 'u101',
            fullname: 'Muki Suflaki',
            imgUrl: 'http://some-img.jpg',
        },
        columns: ['status', 'date', 'delegates', 'tags'],
        groups: [
            {
                id: 'g101',
                title: 'Views',
                tasks: [
                    {
                        id: 't101',
                        title: 'Board list',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                            tags: ['UI', 'DB'],
                        },
                    },
                    {
                        id: 't102',
                        title: 'Board details',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u103',
                                    fullname: 'Sharon Macaron',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Done', color: '#33d391' },
                            date: Date.now(),
                            tags: ['front-end'],
                        },
                    },
                    {
                        id: 't103',
                        title: 'Chat / Activities',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'Stuck', color: '#e8697d' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                ],
                style: {
                    color: '#232323',
                },
            },
            {
                id: 'g201',
                title: 'Components',
                tasks: [
                    {
                        id: 't201',
                        title: 'Board preview',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u104',
                                    fullname: 'Eden Maran',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Done', color: '#33d391' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                    {
                        id: 't202',
                        title: 'group list',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u105',
                                    fullname: 'Muki Bartiki',
                                    imgUrl:
                                        'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
                                },
                                {
                                    _id: 'u106',
                                    fullname: 'Shimi halimi',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Done', color: '#33d391' },
                            date: Date.now(),
                            tags: ['UI'],
                        },
                    },
                    {
                        id: 't203',
                        title: 'group preview',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u105',
                                    fullname: 'Muki Bartiki',
                                    imgUrl:
                                        'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
                                },
                                {
                                    _id: 'u106',
                                    fullname: 'Shimi halimi',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                    {
                        id: 't204',
                        title: 'task preview',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
                                {
                                    _id: 'u105',
                                    fullname: 'Muki Bartiki',
                                    imgUrl:
                                        'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
                                },
                                {
                                    _id: 'u106',
                                    fullname: 'Shimi halimi',
                                    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
                                },
                            ],
                            status: { txt: 'Stuck', color: '#e8697d' },
                            date: Date.now(),
                            tags: [],
                        },
                    },
                ],
                style: {
                    color: '#232323',
                },
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Avior Hagibor',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: 'u102',
                fullname: 'Rachel Bekarov',
                imgUrl:
                    'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
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
            {
                _id: 'u105',
                fullname: 'Muki Bartiki',
                imgUrl:
                    'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
            {
                _id: 'u106',
                fullname: 'Shimi halimi',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
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
    {
        _id: 'b102',
        title: 'Backend',
        description: 'This is very awesome!',
        isFavorite: false,
        createdAt: Date.now(),
        createdBy: {
            _id: 'u102',
            fullname: 'Bobby Balobby',
            imgUrl: 'http://some-img.jpg',
        },
        columns: ['delegates', 'status', 'date'],
        groups: [
            {
                id: 'g102',
                title: 'Services',
                tasks: [
                    {
                        id: 't1011',
                        title: 'Board service',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                        },
                    },
                    {
                        id: 't1021',
                        title: 'Socket details',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                        },
                    },
                    {
                        id: 't1031',
                        title: 'User Service',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                        },
                    },
                ],
                style: {
                    color: '#323232',
                },
            },
            {
                id: 'g202',
                title: 'DB',
                tasks: [
                    {
                        id: 't2011',
                        title: 'Create Mongo DB',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                        },
                    },
                    {
                        id: 't2021',
                        title: 'write aggrigations',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                        },
                    },
                    {
                        id: 't2031',
                        title: 'filter and sort',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                        },
                    },
                    {
                        id: 't2041',
                        title: 'Port to Atlas',
                        createdAt: Date.now(),
                        columns: {
                            delegates: [
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
                            status: { txt: 'In progress', color: '#fdbc64' },
                            date: Date.now(),
                        },
                    },
                ],
                style: {
                    color: '#323232',
                },
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Avior Hagibor',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
            {
                _id: 'u102',
                fullname: 'Rachel Bekarov',
                imgUrl:
                    'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
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
            {
                _id: 'u105',
                fullname: 'Muki Bartiki',
                imgUrl:
                    'https://www.iconninja.com/files/980/282/508/female-blond-avatar-person-girl-user-woman-icon.png',
            },
            {
                _id: 'u106',
                fullname: 'Shimi halimi',
                imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
            },
        ],
        statuses: [
            { id: 's001', txt: 'Done', color: '#33d391' },
            { id: 's002', txt: 'In progress', color: '#fdbc64' },
            { id: 's003', txt: 'Stuck', color: '#e8697d' },
            { id: 's000', txt: '', color: '#c4c4c4' }, // unspecified - default
        ],
        tags: [],
        styles: {},
    },
];

function _createInitialData() {
    localStorage.setItem(KEY, JSON.stringify(gBoards));
    return gBoards;
}
