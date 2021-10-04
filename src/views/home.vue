<template>
  <div class="home">
    <section class="header">
      <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link :to="`/board/61029a2d061b574a00760032`"
          >Boards</router-link
        >
      </div>
      <button class="login-btn" @click="dialogVisible = true">login</button>
      <el-dialog :visible.sync="dialogVisible" :before-close="handleClose">
        <login-signup @hide="handleClose" @login-signup="handleClose" />
        <!-- <el-button @click="dialogVisible = false">Cancel</el-button> -->
      </el-dialog>
      <section class="back"></section>
      <section class="title">
           <div class="img">
          <img class="home-img" src="../assets/img/home1.png" alt="" />
        </div>
        <div
          class="home-desc animate__animated animate__slideInLeft animate__fast"
        >
          <h2>Work the way that works for you</h2>
          <p>Highly effective teams choose Someday -</p>
          <p>
            Work OS for better collaboration, organization, and efficiency in
            all their work.
          </p>
          <button class="btn-go" @click="start">start as guest</button>
        </div>
       
      </section>
    </section>
    <section class="info">
      <div class="item">
        <div class="icon"><i class="fas fa-tasks"></i></div>
        <h3 class="title">Project Manegment</h3>
        <p class="desc">
          Project management Plan, track, and manage any project from start to
          finish
        </p>
      </div>
      <div class="item">
        <div class="icon"><i class="fas fa-code"></i></div>
        <h3 class="title">Software developmentt</h3>
        <p class="desc">Sprint through every development process, your way</p>
      </div>
      <div class="item">
        <div class="icon"><i class="fas fa-building"></i></div>
        <h3 class="title">Construction</h3>
        <p class="desc">Organize any construction project from the ground up</p>
      </div>
    </section>
     <img class="desc-img" src="../assets/img/home2.png" alt="" />
      <img class="desc-img" src="../assets/img/home3.png" alt="" />
    <section class="details">
      <div class="manage">
        <div>
          <img
            src="../assets/img/manage.jpg"
            class="animate__animated animate__slideInLeft animate__fast"
            alt=""
            srcset=""
          />
        </div>
        <div class="manage-desc">
          <h2>Manage everything in one workspace</h2>
          <p>
            Planning, tracking and delivering your team’s best work has never
            been easier
          </p>
          <p>
            Collaborate with team members across platforms, track progress and
            engage in real time, task oriented communication.
          </p>
        </div>
      </div>

      <div class="set-up">
        <div class="manage-desc">
          <h2>Set up in minutes</h2>
          <p>
            Get started fast with hundreds of visual and customizable templates
            - or create your own.
          </p>
          <p>
            You dont need an account to try out Someday. It is free to use for
            as long as you like.
          </p>
        </div>
        <div>
          <img
            src="../assets/img/setup.jpg"
            class="animate__animated animate__slideInRight animate__fast"
            alt=""
            srcset=""
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import loginSignup from "./login-signup.vue";
export default {
  components: { loginSignup },
  name: "home",
  data() {
    return {
      dialogVisible: false,
      userCreds: {
        fullname: "Guest User",
        username: "guest",
        password: "guest",
        activities: [],
      },
    };
  },
  computed: {
    initBoard() {
      return this.$store.getters.boards[0]._id;
    },
  },
  methods: {
    async start() {
      await this.$store.dispatch({ type: "login", userCreds: this.userCreds });
      this.$router.push(`/board/61029a2d061b574a00760032`);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    login() {
      this.$router.push(`login`);
    },
  },
};
</script>
