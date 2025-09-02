<template>
  <div>
    <q-select
      ref="qSelect"
      outlined
      dense
      v-model="preferredLocations"
      :options="filteredOptions"
      label="Select Preferred Locations"
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
      @filter="onFilter"
      @new-value="handleNewValue"
      @update:model-value="clearInput"
    >
      <!-- 🚫 Hide chips and text inside input -->
      <template v-slot:selected>
        <!-- empty -->
      </template>

      <template #append>
        <q-icon v-if="preferredLocations.length === 1" name="place" class="q-ml-xs" />
        <q-icon v-else-if="preferredLocations.length > 1" name="location_city" class="q-ml-xs" />
      </template>
    </q-select>
  </div>
</template>

<script>
import { useFilterStore } from 'src/stores/filter-store'

export default {
  name: 'LocationRegionFilter',

  data() {
    return {
      filteredOptions: [], // starts empty until user types
      store: useFilterStore(),
    }
  },

  computed: {
    preferredLocations: {
      get() {
        return this.store.preferredLocations || [] // IDs only
      },
      set(val) {
        this.store.preferredLocations = Array.isArray(val) ? val : val ? [val] : []
      },
    },

    locations() {
      // Expecting [{ label, value }, ...] from store
      return this.store.locations || []
    },
  },

  methods: {
    onFilter(val, update) {
      if (!val || val.trim() === '') {
        this.filteredOptions = []
        update()
        return
      }

      const search = val.toLowerCase()

      this.filteredOptions = this.locations
        .filter((opt) => !this.preferredLocations.includes(opt.value))
        .filter((opt) => opt.label.toLowerCase().includes(search))
        .map((opt) => ({ label: opt.label, value: opt.value }))

      update()
    },

    handleNewValue(inputValue) {
      const normalized = inputValue.trim().toLowerCase()

      const match = this.locations.find((loc) => loc.label.toLowerCase() === normalized)

      if (match && !this.preferredLocations.includes(match.value)) {
        this.preferredLocations = [...this.preferredLocations, match.value]
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
    if (this.locations.length === 0) {
      this.store.fetchFilters?.() // same as JobRoles
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
