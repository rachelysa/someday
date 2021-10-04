<template>
    <section class="login-signup">
        <el-tabs v-model="activeTab">
            <el-tab-pane class="tab-label" label="Login" name="login">
                <el-form
                    label-width="100px"
                    :model="userCreds"
                    @keydown.enter="onLogin"
                    @submit="onLogin"
                >
                    <el-form-item label="username">
                        <el-input v-model="userCreds.username"></el-input>
                    </el-form-item>
                    <el-form-item label="password">
                        <el-input v-model="userCreds.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain @click="onLogin">Login</el-button>
                        <el-button type="danger" plain @click="hide">Cancel</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="Sign Up" name="signup">
                <el-form label-width="100px" :model="userCreds">
                    <el-form-item label="Full name">
                        <el-input v-model="userCreds.fullname"></el-input>
                    </el-form-item>
                    <el-form-item label="username">
                        <el-input v-model="userCreds.username"></el-input>
                    </el-form-item>
                    <el-form-item label="password">
                        <el-input v-model="userCreds.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain @click="onSignup">Signup</el-button>
                        <el-button type="danger" plain @click="hide">Cancel</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </section>
</template>
<script>

export default {
    data() {
        return {
            activeTab: 'login',
            userCreds: {
                fullname: '',
                username: '',
                password: '',
                activities: [],
            },
        };
    },
    computed: {
        isSignup() {
            return this.activeTab === 'signup';
        },
    },
    created() {},
    methods: {
        selectTab(tab) {
            this.activeTab = tab;
        },
        hide() {
            this.$emit('hide');
        },

        async onSignup() {
            try {
                await this.$store.dispatch({ type: 'signup', userCreds: this.userCreds})
                this.onLoginSuccess()
            } catch (err) {
                console.log('login error')
                throw err
            }
        },
        async onLogin() {
            try {
                await this.$store.dispatch({ type: 'login', userCreds: this.userCreds})
                this.onLoginSuccess()
            } catch (err) {
                console.log('login error')
                throw err
            }
        },
        onLoginSuccess(){
            this.userCreds = { fullname: '', username: '', password: '' }
            this.$emit('login-signup', true)
            this.$router.push(`/board/61029a2d061b574a00760032`)
        },
    },
};
</script>
