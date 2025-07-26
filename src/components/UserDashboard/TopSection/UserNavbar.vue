<template>
  <div class="user-navbar q-py-xs q-px-md row no-wrap items-center">
    <q-tabs
      :model-value="tab"
      @update:model-value="$emit('update:tab', $event)"
      dense
      align="left"
      class="user-tabs"
      indicator-color="primary"
      active-color="primary"
      shrink
    >
      <q-tab
        v-for="item in tabs"
        :key="item"
        :name="item"
        :label="item"
        :class="tabClass(item)"
        class="user-tab q-px-md"
        no-caps
      />
    </q-tabs>
  </div>
</template>

<script>
export default {
  name: "UserNavbar",
  props: {
    tab: {
      type: String,
      required: true,
    },
  },
  emits: ["update:tab"],
  data() {
    return {
      tabs: [
        "Details",
        "Application Status",
        "Resumes & Links",
        "Recommended Jobs",
        "Special Feature ",
      ],
    };
  },
  methods: {
    tabClass(item) {
      return this.tab === item ? "is-active" : "";
    },
  },
};
</script>
