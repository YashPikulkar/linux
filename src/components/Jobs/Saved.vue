<template>
  <div class="saved-search-section row items-center q-gutter-sm q-mb-md">
    <!-- Saved Search Text -->
    <span class="text-body2 text-grey-7">Saved Search</span>

    <!-- Edit Icon -->
    <q-icon name="edit" size="16px" class="text-grey-6 cursor-pointer" />

    <!-- Vertical Divider -->
    <div class="vertical-divider" />

    <!-- New Search Text -->
    <span class="text-body2 text-grey-7 cursor-pointer">New Search</span>
  </div>
</template>

<style scoped>
.saved-search-section {
  font-weight: 500;
}

/* Custom vertical divider */
.vertical-divider {
  width: 1px;
  height: 16px;
  background-color: #c2c2c2;
}
</style>
