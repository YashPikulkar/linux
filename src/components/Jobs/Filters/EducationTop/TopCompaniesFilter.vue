<template>
  <div class="companies-wrapper" :class="{ 'active-filter': isActive }">
    <div class="companies-container q-pa-md q-mb-md">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="companies-title">Companies</div>
        <div v-if="isActive" class="clear-text" @click="clearCompanies">
          Clear
        </div>
      </div>

      <!-- Subtitle -->
      <div class="companies-subtitle">
        Selected: {{ selectedCompanies.length || "None" }}
      </div>

      <!-- 🔽 Dropdown Select -->
      <q-select
        ref="qSelect"
        outlined
        dense
        v-model="selectedCompanies"
        :options="filteredDropdownOptions"
        label="Select Companies"
        emit-value
        map-options
        multiple
        use-input
        fill-input
        input-debounce="0"
        :popup-content-class="'custom-dropdown'"
        :dropdown-icon="null"
        @filter="onDropdownFilter"
        @new-value="handleNewCompany"
        @update:model-value="(val) => handleModelUpdate(val)"
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon
            v-if="selectedCompanies.length === 1"
            name="business"
            class="q-ml-xs"
          />
          <q-icon
            v-else-if="selectedCompanies.length > 1"
            name="domain"
            class="q-ml-xs"
          />
        </template>
      </q-select>

      <!-- 🔷 Selected Companies -->
      <div v-if="selectedCompanies.length" class="companies-subtitle q-mb-xs">
        Selected Companies
      </div>
      <div class="row q-gutter-sm q-mb-md">
        <div
          v-for="company in selectedCompanies"
          :key="'selected-' + company"
          class="custom-chip selected-chip row items-center no-wrap"
          @click="toggleCompany(company)"
        >
          <span class="chip-label">{{ company }}</span>
          <q-icon name="close" class="chip-close-icon" />
        </div>
      </div>

      <!-- 🔷 Popular Companies -->
      <div v-if="filteredCompanies.length" class="companies-subtitle">
        Popular
      </div>
      <div class="row q-gutter-sm">
        <div
          v-for="company in filteredCompanies"
          :key="'popular-' + company"
          class="custom-chip row items-center no-wrap"
          @click="toggleCompany(company)"
        >
          <span class="chip-label">{{ company }}</span>
          <q-icon name="add" class="chip-add-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "CompaniesFilter",

  data() {
    return {
      search: "",
      availableCompanies: [
        "Google",
        "Amazon",
        "Microsoft",
        "Meta",
        "Netflix",
        "Apple",
        "Adobe",
        "Oracle",
        "Tesla",
        "IBM",
        "Samsung",
        "Intel",
        "Infosys",
        "TCS",
        "Accenture",
        "Wipro",
      ],
      popularCompanies: [
        "Google",
        "Amazon",
        "Microsoft",
        "Meta",
        "Netflix",
        "Apple",
        "Adobe",
      ],
      filteredDropdownOptions: [],
      store: useFilterStore(),
    };
  },

  computed: {
    selectedCompanies: {
      get() {
        return this.store.companies;
      },
      set(val) {
        this.store.companies = val;
      },
    },

    filteredCompanies() {
      const searchLower = this.search.toLowerCase();
      return this.popularCompanies
        .filter((company) => !this.selectedCompanies.includes(company))
        .filter((company) => company.toLowerCase().includes(searchLower));
    },

    isActive() {
      return this.selectedCompanies.length > 0;
    },
  },

  methods: {
    toggleCompany(company) {
      const index = this.selectedCompanies.indexOf(company);
      if (index === -1) {
        this.selectedCompanies.push(company);
      } else {
        this.selectedCompanies.splice(index, 1);
      }
    },

    clearCompanies() {
      this.selectedCompanies = [];
    },

    onDropdownFilter(val, update) {
      if (!val || val.trim() === "") {
        this.filteredDropdownOptions = [];
        update();
        return;
      }

      const search = val.toLowerCase();
      this.filteredDropdownOptions = this.availableCompanies
        .filter((company) => !this.selectedCompanies.includes(company))
        .filter((company) => company.toLowerCase().includes(search))
        .map((company) => ({ label: company, value: company }));

      update();
    },

    handleNewCompany(inputValue) {
      const normalized = inputValue.trim();

      const match = this.availableCompanies.find(
        (company) => company.toLowerCase() === normalized.toLowerCase()
      );

      if (match && !this.selectedCompanies.includes(match)) {
        this.selectedCompanies = [...this.selectedCompanies, match];

        setTimeout(() => {
          if (this.$refs.qSelect) {
            this.$refs.qSelect.updateInputValue("");
            this.$refs.qSelect.inputValue = "";
          }
        }, 0);
      }
    },

    handleModelUpdate(val) {
      this.selectedCompanies = val;

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
.companies-wrapper {
  border: 1px solid #dcdcdc;
  background-color: white;
  transition: all 0.2s ease;
  padding: 16px;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.companies-container {
  background-color: #f9f9f9;
  border-radius: 6px;
  overflow: visible;
}

.companies-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.companies-subtitle {
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
