<template>
  <q-card class="skills-card">
    <!-- Header -->
    <div class="form-header">
      <div>Add Your Skills</div>
      <div>
        <q-btn
          v-if="!isEditable"
          dense
          flat
          round
          icon="edit"
          size="sm"
          color="black"
          @click="toggleEdit"
        />
        <template v-else>
          <q-btn
            dense
            flat
            round
            icon="check"
            color="green"
            size="sm"
            class="q-mr-xs"
            @click="saveSkills"
          />
          <q-btn
            dense
            flat
            round
            icon="close"
            color="red"
            size="sm"
            @click="cancelEdit"
          />
        </template>
      </div>
    </div>

    <!-- Skills List -->
    <div class="skills-list">
      <q-chip
        v-for="(skill, index) in localSkills"
        :key="index"
        :style="chipStyle"
        class="skill-chip q-mr-sm q-mb-sm"
        :removable="isEditable"
        @remove="removeSkill(index)"
      >
        {{ skill }}
      </q-chip>
    </div>

    <!-- Add Skill Input -->
    <div v-if="isEditable" class="add-skill-row">
      <q-input
  v-model="newSkill"
  dense
  flat
  placeholder="Add a skill"
  class="add-skill-input"
  color="white"
  @keyup.enter="addSkill"
>

        <template v-slot:append>
          <q-btn
            icon="add"
            round
            dense
            flat
            @click="addSkill"
            :disable="!newSkill.trim()"
            color="white"
          />
        </template>
      </q-input>
    </div>
  </q-card>
</template>

<script>
import { useUserStore } from "src/stores/UserStore";

export default {
  name: "SkillsSection",
  data() {
    return {
      isEditable: false,
      newSkill: "",
      localSkills: [],
    };
  },
  created() {
    this.userStore = useUserStore();
    this.localSkills = [...this.userStore.skills];
  },
  computed: {
    chipStyle() {
      return {
        backgroundColor: '#1f2937',
        color: '#ffffff',
        transition: 'all 0.2s ease',
      };
    },
  },
  methods: {
    toggleEdit() {
      this.isEditable = true;
    },
    saveSkills() {
      this.userStore.updateSkills(this.localSkills);
      this.isEditable = false;
    },
    cancelEdit() {
      this.localSkills = [...this.userStore.skills];
      this.isEditable = false;
    },
    addSkill() {
      const trimmed = this.newSkill.trim();
      if (trimmed && !this.localSkills.includes(trimmed)) {
        this.localSkills.push(trimmed);
        this.newSkill = "";
      }
    },
    removeSkill(index) {
      this.localSkills.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.skills-card {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: #000000;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color:white;
}

.form-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 18px;
  color: black;
  margin-bottom: 16px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
}

.skill-chip:hover {
  background-color: #374151;
  cursor: pointer;
}

.add-skill-row {
  margin-top: 12px;
  max-width: 300px;
}
</style>
