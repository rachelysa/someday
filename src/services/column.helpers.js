import { utilService } from './util.service.js';
export const columnHelpers = {
    columnList: ['delegates', 'date', 'status', 'tags'], // Add new column types to this array...

    delegates: {
        // ...and a add objects with function pointers for the new columns..
        init: _initDelegates,
        txt: _delegateTxt,
        icon: _delegatesIcon,
        matches: _delegateMatches,
        compare: _delegateCompare,
    },
    date: {
        init: _initDate,
        txt: _dateTxt,
        icon: _dateIcon,
        matches: _dateMatches,
        compare: _dateCompare,
    },
    status: {
        init: _initStatus,
        txt: _statusTxt,
        icon: _statusIcon,
        matches: _statusMatches,
        compare: _statusCompare,
    },
    tags: {
        init: _initTags,
        txt: _tagsTxt,
        icon: _tagsIcon,
        matches: _tagsMatches,
        compare: _tagsCompare,
    },

    // This function returns the component name for the column type.
    // Used in task-preview.vue to load the correct dynamic components.

    componentType(column) {
        switch (column) {
            case 'delegates':
                return 'person-column';
            case 'status':
                return 'status-column';
            case 'date':
                return 'date-column';
            case 'tags':
                return 'tags-column';
            default:

        }
    },

    // This function returns the component name for the summery column type.
    // Used in task-preview.vue to load the correct dynamic components.

    componentSummeryType(column) {
        switch (column) {
            case 'delegates':
                return 'person-summery-column';
            case 'status':
                return 'status-summery-column';
            case 'date':
                return 'date-summery-column';
            case 'tags':
                return 'tags-summery-column';
            default:

        }
    },
};

// Delegates

function _initDelegates() {
    return [];
}
function _delegateTxt(columnData) {
    const names = columnData.map((person) => person.fullname);
    return names.join(' ');
}
function _delegatesIcon() {
    return 'fas fa-user-friends';
}

function _delegateMatches(columnData, dataToMatch) {
    return columnData.some((person) => person._id === dataToMatch._id);
}
function _delegateCompare(task1, task2) {
    const delegates1 = task1.columns['delegates'];
    const delegates2 = task2.columns['delegates'];

    if (delegates1.length !== delegates2.length) return delegates1.length - delegates2.length;
    if (delegates1.length === 0) return 0;

    const d1 = JSON.parse(JSON.stringify(delegates1)).sort();
    const d2 = JSON.parse(JSON.stringify(delegates2)).sort();
    return d1[0].fullname - d2[0].fullname;
}

// Date

function _initDate() {
    return null;
}
function _dateTxt(columnData) {
    return utilService.msToShortDate(columnData);
}
function _dateIcon() {
    return 'fas fa-calendar-day';
}
function _dateMatches(columnData, dataToMatch) {
    return columnData === dataToMatch;
}
function _dateCompare(task1, task2) {
    return task1.columns['date'] - task2.columns['date'];
}

//Status

function _initStatus() {
    return { id: 's000', txt: '', color: '#c4c4c4' };
}
function _statusTxt(columnData) {
    return columnData.txt;
}
function _statusIcon() {
    return 'fas fa-battery-half';
}
function _statusMatches(columnData, dataToMatch) {
    return columnData.txt === dataToMatch.txt;
}
function _statusCompare(task1, task2) {
    const status1 = task1.columns['status'].txt;
    const status2 = task2.columns['status'].txt;
    return status1.localeCompare(status2);
}

//Tags

function _initTags() {
    return [];
}
function _tagsTxt(columnData) {
    const tags = columnData.map((tag) => tag);
    return tags.join(' ');
}
function _tagsIcon() {
    return 'fas fa-tags';
}
function _tagsMatches(columnData, dataToMatch) {
    return columnData.some((tag) => tag === dataToMatch);
}
function _tagsCompare(task1, task2) {
    const tags1 = task1.columns['tags'];
    const tags2 = task2.columns['tags'];

    if (tags1.length !== tags2.length) return tags1.length - tags2.length;
    if (tags1.length === 0) return 0;

    const t1 = JSON.parse(JSON.stringify(tags1)).sort();
    const t2 = JSON.parse(JSON.stringify(tags2)).sort();
    return t1[0].localeCompare(t2[0]);
}
