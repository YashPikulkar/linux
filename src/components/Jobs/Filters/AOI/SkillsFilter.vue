<template>
  <div class="skills-wrapper" :class="{ 'active-filter': isActive }">
    <div class="skills-container q-pa-md q-mb-md">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="skills-title">Skills</div>
        <div v-if="isActive" class="clear-text" @click="clearSkills">Clear</div>
      </div>

      <!-- Subtitle -->
      <div class="skills-subtitle">
        Selected: {{ selectedSkills.length || "None" }}
      </div>

      <!-- 🔽 Dropdown Select -->
      <q-select
        ref="qSelect"
        outlined
        dense
        v-model="selectedSkills"
        :options="filteredDropdownOptions"
        label="Select Skills"
        emit-value
        map-options
        multiple
        use-input
        fill-input
        input-debounce="0"
        :popup-content-class="'custom-dropdown'"
        :dropdown-icon="null"
        @filter="onDropdownFilter"
        @new-value="handleNewSkill"
        @update:model-value="(val) => handleModelUpdate(val)"
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon
            v-if="selectedSkills.length === 1"
            name="psychology"
            class="q-ml-xs"
          />
          <q-icon
            v-else-if="selectedSkills.length > 1"
            name="engineering"
            class="q-ml-xs"
          />
        </template>
      </q-select>

      <!-- 🔷 Selected Skills -->
      <div v-if="selectedSkills.length" class="skills-subtitle q-mb-xs">
        Selected Skills
      </div>
      <div class="row q-gutter-sm q-mb-md">
        <div
          v-for="skill in selectedSkills"
          :key="'selected-' + skill"
          class="custom-chip selected-chip row items-center no-wrap"
          @click="toggleSkill(skill)"
        >
          <span class="chip-label">{{ skill }}</span>
          <q-icon name="close" class="chip-close-icon" />
        </div>
      </div>

      <!-- 🔷 Popular Skills -->
      <div v-if="filteredSkills.length" class="skills-subtitle">Popular</div>
      <div class="row q-gutter-sm">
        <div
          v-for="skill in filteredSkills"
          :key="'popular-' + skill"
          class="custom-chip row items-center no-wrap"
          @click="toggleSkill(skill)"
        >
          <span class="chip-label">{{ skill }}</span>
          <q-icon name="add" class="chip-add-icon" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "SkillsFilter",

  data() {
    return {
      search: "",
      availableSkills: [
        "Vue.js",
        "React",
        "JavaScript",
        "Python",
        "Node.js",
        "CSS",
        "TypeScript",
        "Angular",
        "Java",
        "SQL",
        "MongoDB",
        "Express.js",
        "C++",
        "C#",
        "Go",
        "PHP",
      ],
      popularSkills: [
        "Vue.js",
        "React",
        "JavaScript",
        "Python",
        "Node.js",
        "CSS",
        "TypeScript",
      ],
      filteredDropdownOptions: [],
      store: useFilterStore(),
    };
  },

  computed: {
    selectedSkills: {
      get() {
        return this.store.skills;
      },
      set(val) {
        this.store.skills = val;
      },
    },

    filteredSkills() {
      const searchLower = this.search.toLowerCase();
      return this.popularSkills
        .filter((skill) => !this.selectedSkills.includes(skill))
        .filter((skill) => skill.toLowerCase().includes(searchLower));
    },

    isActive() {
      return this.selectedSkills.length > 0;
    },
  },

  methods: {
    toggleSkill(skill) {
      const index = this.selectedSkills.indexOf(skill);
      if (index === -1) {
        this.selectedSkills.push(skill);
      } else {
        this.selectedSkills.splice(index, 1);
      }
    },

    clearSkills() {
      this.selectedSkills = [];
    },

    onDropdownFilter(val, update) {
      if (!val || val.trim() === "") {
        this.filteredDropdownOptions = [];
        update();
        return;
      }

      const search = val.toLowerCase();
      this.filteredDropdownOptions = this.availableSkills
        .filter((skill) => !this.selectedSkills.includes(skill))
        .filter((skill) => skill.toLowerCase().includes(search))
        .map((skill) => ({ label: skill, value: skill }));

      update();
    },

    handleNewSkill(inputValue) {
      const normalized = inputValue.trim();

      const match = this.availableSkills.find(
        (skill) => skill.toLowerCase() === normalized.toLowerCase()
      );

      if (match && !this.selectedSkills.includes(match)) {
        this.selectedSkills = [...this.selectedSkills, match];

        setTimeout(() => {
          if (this.$refs.qSelect) {
            this.$refs.qSelect.updateInputValue("");
            this.$refs.qSelect.inputValue = "";
          }
        }, 0);
      }
    },

    handleModelUpdate(val) {
      this.selectedSkills = val;

      setTimeout(() => {
        if (this.$refs.qSelect) {
          this.$refs.qSelect.updateInputValue("");
          this.$refs.qSelect.inputValue = "";
        }
      }, 0);
    },
  },
};
</script>

<style scoped>
.skills-wrapper {
  border: 1px solid #dcdcdc;
  background-color: white;
  transition: all 0.2s ease;
  padding: 16px;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.skills-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  overflow: visible;
}

.skills-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.skills-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.4;
}

.custom-chip {
  border: 1px solid #007aff;
  background-color: #f0f7ff;
  color: #1d1d1f;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.chip-label {
  padding: 0 6px;
}

.chip-add-icon {
  font-size: 16px;
  color: #007aff;
  margin-left: 6px;
}

.selected-chip {
  background-color: #e0f2fe;
  border-color: #0284c7;
}

.chip-close-icon {
  font-size: 16px;
  color: #0284c7;
  margin-left: 6px;
}

.clear-text {
  font-size: 13px;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}
</style>
