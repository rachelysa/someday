<template>
    <section class="user-profile" v-if="user">
        <navbar :user="user" />
        <section class="header">
            <label class="avatar">
                <input @change="onUploadImg" type="file" id="imgUpload" hidden />
                <i class="fas fa-camera"></i>
            </label>
            <avatar
                class="person-preview-avatar"
                :username="user.fullname"
                :inline="true"
                :size="130"
                :src="imgUrl"
            />

            <h1>{{ user.fullname }}</h1>
        </section>
    </section>
</template>

<script>
import Navbar from '../components/navbar.vue';
import Avatar from 'vue-avatar';
import { userService } from '../services/user.service';

export default {
    data() {
        return {
            user: null,
        };
    },
    created() {
        this.user = this.$store.getters.loggedinUser;
    },
    computed: {
        imgUrl() {
            console.log(this.user.imgUrl);
            return this.user.imgUrl || '';
        },
    },
    methods: {
        async onUploadImg(ev) {
            const res = await userService.uploadImg(ev);
            this.user['imgUrl'] = res.url;

            if (this.user._id === 'u101') {
                console.log('you are guest');
                return;
            }
            await this.$store.dispatch({
                type: 'saveUser',
                user: this.user,
            });
            this.user = this.$store.getters.loggedinUser;
           
        },
    },
    components: {
        Navbar,
        Avatar,
    },
};
</script>

<style></style>
