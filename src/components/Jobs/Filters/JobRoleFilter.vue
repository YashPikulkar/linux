<template>
  <div>
    <q-select
      ref="qSelect"
      outlined
      dense
      v-model="selectedJobRoles"
      :options="filteredDropdownOptions"
      label="Select Job Roles"
      multiple
      use-input
      fill-input
      input-debounce="0"
      behavior="menu"
      emit-value
      map-options
      hide-selected
      :popup-content-class="'custom-dropdown'"
      :dropdown-icon="null"
      @filter="onDropdownFilter"
      @new-value="handleNewRole"
      @update:model-value="clearInput"
    >
      <!-- 🚫 Override selected slot so nothing is shown -->
      <template v-slot:selected>
        <!-- empty -->
      </template>

      <template #append>
        <q-icon v-if="selectedJobRoles.length === 1" name="work" class="q-ml-xs" />
        <q-icon v-else-if="selectedJobRoles.length > 1" name="groups" class="q-ml-xs" />
      </template>
    </q-select>
  </div>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'

export default {
  name: 'JobRolesFilter',

  data() {
    return {
      filteredDropdownOptions: [],
      store: useFilterStore(),
    }
  },

  computed: {
    selectedJobRoles: {
      get() {
        return this.store.selectedJobRoles || [] // IDs only
      },
      set(val) {
        this.store.selectedJobRoles = Array.isArray(val) ? val : val ? [val] : []
      },
    },

    jobRoles() {
      return this.store.jobRoles || []
    },
  },

  methods: {
    onDropdownFilter(val, update) {
      if (!val || val.trim() === '') {
        this.filteredDropdownOptions = []
        update()
        return
      }

      const search = val.toLowerCase()

      this.filteredDropdownOptions = this.jobRoles
        .filter((role) => role && !this.selectedJobRoles.includes(role.value))
        .filter((role) => role.label && role.label.toLowerCase().includes(search))
        .map((role) => ({ label: role.label, value: role.value }))

      update()
    },

    handleNewRole(inputValue) {
      const normalized = inputValue.trim().toLowerCase()
      const match = this.jobRoles.find(
        (role) => role?.label && role.label.toLowerCase() === normalized,
      )

      if (match && !this.selectedJobRoles.includes(match.value)) {
        this.selectedJobRoles = [...this.selectedJobRoles, match.value]
        this.clearInput()
      }
    },

    clearInput() {
      if (this.$refs.qSelect) {
        this.$refs.qSelect.updateInputValue('')
      }
    },
  },

  mounted() {
    if (!this.store.jobRoles || this.store.jobRoles.length === 0) {
      this.store.fetchFilters?.()
    }
  },
}
</script>

<style scoped>
.custom-dropdown {
  max-height: 200px;
  overflow-y: auto;
}
</style>
