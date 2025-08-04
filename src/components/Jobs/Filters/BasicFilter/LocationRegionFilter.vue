<template>
  <div>
    <q-select
      ref="qSelect"
      outlined
      dense
      v-model="preferredLocations"
      :options="filteredOptions"
      label="Select Preferred Locations"
      emit-value
      map-options
      multiple
      use-chips
      use-input
      fill-input
      input-debounce="0"
      :popup-content-class="'custom-dropdown'"
      :dropdown-icon="null"
      @filter="onFilter"
      @new-value="handleNewValue"
    >
      <template v-slot:append>
        <q-icon
          v-if="preferredLocations.length === 1"
          name="place"
          class="q-ml-xs"
        />
        <q-icon
          v-else-if="preferredLocations.length > 1"
          name="location_city"
          class="q-ml-xs"
        />
      </template>
    </q-select>
  </div>
</template>

<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "LocationRegionFilter",

  data() {
    return {
      store: useFilterStore(),

      locationOptions: [
        { label: "Goa", value: "goa" },
        { label: "Mumbai", value: "mumbai" },
        { label: "Remote Only", value: "remote" },
        { label: "Delhi", value: "delhi" },
        { label: "Bangalore", value: "bangalore" },
      ],

      filteredOptions: [],
    };
  },

  computed: {
    preferredLocations: {
      get() {
        return this.store.preferredLocations;
      },
      set(val) {
        this.store.preferredLocations = val;
      },
    },
  },

  methods: {
    onFilter(val, update) {
      if (!val || val.trim() === "") {
        this.filteredOptions = [];
        update();
        return;
      }

      const search = val.toLowerCase();
      this.filteredOptions = this.locationOptions.filter((opt) =>
        opt.label.toLowerCase().includes(search)
      );

      update();
    },

    handleNewValue(inputValue) {
      const match = this.locationOptions.find(
        (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
      );

      if (match && !this.preferredLocations.includes(match.value)) {
        this.preferredLocations = [...this.preferredLocations, match.value];

        // Clear input manually after selection
        this.$refs.qSelect.updateInputValue("");
      }
    },
  },
};
</script>

<style scoped>
.custom-dropdown {
  max-height: 200px;
  overflow-y: auto;
}
</style>
