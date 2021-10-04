<template>
  <section class="activity-preview">
    <!-- {{ activity.createdBy.fullname }}
  -->

    <el-card shadow="hover" class="activity-card">
      <avatar
        class="person-preview-avatar"
        :username="name"
        :inline="true"
        :size="30"
        :src="imgUrl"
      />

      <span>{{ activity.content.txt }}</span>
    </el-card>
  </section>
</template>

<script>
import Avatar from "vue-avatar";
export default {
  props: {
    activity: Object,
  },

  methods: {},
  computed: {
    name() {

     
      if (this.activity.createdBy) return this.activity.createdBy.fullname;
      return 'Guest user';
    },
    imgUrl() {
      if (this.activity.createdBy) return this.activity.createdBy.imgUrl;
      return "";
    },
  },
  components: { Avatar },
};
</script>
