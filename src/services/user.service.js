// import { storageService } from './async-storage.service'
import { httpService } from './http.service';
import axios from 'axios';

export const userService = {
    login,
    setLoggedinUser,
    logout,
    signup,
    getUsers,
    getById,
    // remove,
    // update,
    removeActivities,
    getLoggedinUser,
    uploadImg,
};

window.userService = userService;
// Note: due to async, must run one by one...
// userService.signup({fullname: 'Puki Norma', username: 'user1', password:'123',score: 100, isAdmin: false})
// userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 100, isAdmin: true})
// userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 100})

function getUsers() {
    // return storageService.query('user')
    // return httpService.get(`user`)
}

function getById(userId) {
    // return storageService.get('user', userId)
    return httpService.get(`user/${userId}`);
}
// function remove(userId) {
//     // return storageService.remove('user', userId)
//     // return httpService.delete(`user/${userId}`)
// }

// async function update(user) {
//     // return storageService.put('user', user)
//     user = await httpService.put(`user/${user._id}`, user)
//     // Handle case in which admin updates other user's details
//     // if (getLoggedinUser()._id === user._id) _saveLocalUser(user);

// }
async function removeActivities(activity){

    return await httpService.put('activity/remove', activity)
}

async function login(userCred) {
    try {
        return await httpService.post('auth/login', userCred)
    } catch (err) {
        console.log('Error loging in...', err)
        throw err       
    }
}
async function signup(userCred) {
    try {
        return await httpService.post('auth/signup', userCred)
    } catch (err) {
        console.log('Error loging in...', err)
        throw err       
    }
}
async function logout() {
    sessionStorage.clear();
    return await httpService.post('auth/logout');
}

function getLoggedinUser() {

    return JSON.parse(sessionStorage.getItem('loggedinUser') || 'null');
}

async function uploadImg(ev) {
    // Defining our variables
    const CLOUD_NAME = 'rachelmistertoy'; // Insert yours
    const UPLOAD_PRESET = 'oa9nnanl'; // Insert yours
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const FORM_DATA = new FormData();
    // Building the request body
    FORM_DATA.append('file', ev.target.files[0]);
    FORM_DATA.append('upload_preset', UPLOAD_PRESET);

    try {
        const res = await axios.post(UPLOAD_URL, FORM_DATA);
        return res.data;
    } catch (err) {
        console.error('ERROR!', err);
    }
}

function setLoggedinUser(user) {
    sessionStorage.setItem('loggedinUser', JSON.stringify(user));
    return user;
}
