<template>
  <div class="markets-wrapper" :class="{ 'active-filter': isActive }">
    <div class="markets-container q-pa-md q-mb-md">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-sm">
        <div class="markets-title">Markets</div>
        <div v-if="isActive" class="clear-text" @click="clearMarkets">
          Clear
        </div>
      </div>

      <!-- Subtitle -->
      <div class="markets-subtitle">
        Selected: {{ selectedMarkets.length || "None" }}
      </div>

      <!-- 🔽 Dropdown Select -->
      <q-select
        ref="qSelect"
        outlined
        dense
        v-model="selectedMarkets"
        :options="filteredDropdownOptions"
        label="Select Markets"
        emit-value
        map-options
        multiple
        use-input
        fill-input
        input-debounce="0"
        :popup-content-class="'custom-dropdown'"
        :dropdown-icon="null"
        @filter="onDropdownFilter"
        @new-value="handleNewMarket"
        @update:model-value="(val) => handleModelUpdate(val)"
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon
            v-if="selectedMarkets.length === 1"
            name="work"
            class="q-ml-xs"
          />
          <q-icon
            v-else-if="selectedMarkets.length > 1"
            name="business"
            class="q-ml-xs"
          />
        </template>
      </q-select>

      <!-- 🔷 Selected Markets -->
      <div v-if="selectedMarkets.length" class="markets-subtitle q-mb-xs">
        Selected Markets
      </div>
      <div class="row q-gutter-sm q-mb-md">
        <div
          v-for="market in selectedMarkets"
          :key="'selected-' + market"
          class="custom-chip selected-chip row items-center no-wrap"
          @click="toggleMarket(market)"
        >
          <span class="chip-label">{{ market }}</span>
          <q-icon name="close" class="chip-close-icon" />
        </div>
      </div>

      <!-- 🔷 Popular Markets -->
      <div v-if="filteredMarkets.length" class="markets-subtitle">Popular</div>
      <div class="row q-gutter-sm">
        <div
          v-for="market in filteredMarkets"
          :key="'popular-' + market"
          class="custom-chip row items-center no-wrap"
          @click="toggleMarket(market)"
        >
          <span class="chip-label">{{ market }}</span>
          <q-icon name="add" class="chip-add-icon" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useFilterStore } from "src/components/Jobs/Store/FilterStore";

export default {
  name: "MarketsFilter",
  data() {
    const store = useFilterStore();
    return {
      search: "",
      store,
      availableMarkets: [
        "Healthcare",
        "FinTech",
        "Education",
        "AI",
        "E-commerce",
        "Gaming",
        "TravelTech",
        "GreenTech",
        "Real Estate",
        "EdTech",
        "BioTech",
      ],
      popularMarkets: [
        "Healthcare",
        "FinTech",
        "Education",
        "AI",
        "E-commerce",
        "Gaming",
        "TravelTech",
        "GreenTech",
      ],
      filteredDropdownOptions: [],
    };
  },

  computed: {
    selectedMarkets: {
      get() {
        return this.store.markets;
      },
      set(val) {
        this.store.markets = val;
      },
    },

    filteredMarkets() {
      const searchLower = this.search.toLowerCase();
      return this.popularMarkets
        .filter((market) => !this.selectedMarkets.includes(market))
        .filter((market) => market.toLowerCase().includes(searchLower));
    },

    isActive() {
      return this.selectedMarkets.length > 0;
    },
  },

  methods: {
    toggleMarket(market) {
      const index = this.selectedMarkets.indexOf(market);
      if (index === -1) {
        this.selectedMarkets.push(market);
      } else {
        this.selectedMarkets.splice(index, 1);
      }
    },

    clearMarkets() {
      this.selectedMarkets = [];
    },

    onDropdownFilter(val, update) {
      this.search = val || "";
      if (!val || val.trim() === "") {
        this.filteredDropdownOptions = [];
        update();
        return;
      }

      const search = val.toLowerCase();
      this.filteredDropdownOptions = this.availableMarkets
        .filter((market) => !this.selectedMarkets.includes(market))
        .filter((market) => market.toLowerCase().includes(search))
        .map((market) => ({ label: market, value: market }));

      update();
    },

    handleNewMarket(inputValue) {
      const normalized = inputValue.trim();

      const match = this.availableMarkets.find(
        (market) => market.toLowerCase() === normalized.toLowerCase()
      );

      if (match && !this.selectedMarkets.includes(match)) {
        this.selectedMarkets = [...this.selectedMarkets, match];

        setTimeout(() => {
          if (this.$refs.qSelect) {
            this.$refs.qSelect.updateInputValue("");
            this.$refs.qSelect.inputValue = "";
          }
        }, 0);
      }
    },

    handleModelUpdate(val) {
      this.selectedMarkets = val;

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
.markets-wrapper {
  border: 1px solid #dcdcdc;
  background-color: white;
  transition: all 0.2s ease;
  padding: 16px;
}

.active-filter {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.markets-container {
  background-color: #f9f9f9;
  border-radius: 6px;
}

.markets-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.markets-subtitle {
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

.selected-chip {
  background-color: #e0f2fe;
  border-color: #0284c7;
}

.chip-label {
  padding: 0 6px;
}

.chip-add-icon {
  font-size: 16px;
  color: #007aff;
  margin-left: 6px;
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
