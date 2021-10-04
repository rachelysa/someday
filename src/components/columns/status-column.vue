<template>
  <section class="status-column" v-if="hasStatus">
    <div class="status-text" @click="toggleStatusPicker" :style="statusColor">
      {{ newStatus.txt }}
    </div>
    <transition name="status-picker">
      <status-picker
        @input="onSelectStatus"
        v-if="this.isPickerOpen"
        v-model="newStatus"
        class="status-picker"
      />
    </transition>
  </section>
</template>

<script>
import statusPicker from "@/components/columns/status-picker";
export default {
  props: {
    value: {
      // type: Object,
      // required: true,
    },
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newStatus: { txt: "", color: "#c4c4c4" },
      isPickerOpen: false,
    };
  },
  computed: {
    hasStatus() {
      return !!this.value;
    },
    statusColor() {
      return { "background-color": this.newStatus.color };
    },
  },
  methods: {
    onStatusChange() {
      this.$emit("input", this.newStatus);
    },
    toggleStatusPicker() {
      this.isPickerOpen = !this.isPickerOpen;
    },
    onSelectStatus() {
      this.toggleStatusPicker();
      this.$emit("add-activity", { type: "change status",msg:'change status to ' + this.newStatus.txt });
      // this.$emit('input',{type:'status',new:this.newStatus} );
      this.$emit("input", this.newStatus);
    },
  },
  created() {
    if (this.value) this.newStatus = JSON.parse(JSON.stringify(this.value));
    else this.newStatus = { id: "s000", txt: "", color: "#c4c4c4" }; // unspecified - default
  },

  watch: {
    value(newVal) {
      this.newStatus = JSON.parse(JSON.stringify(newVal));
    },
  },

  components: {
    statusPicker,
  },
};
</script>
