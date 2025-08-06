<template>
  <q-card class="sidebar-card q-pa-md bg-white text-black" flat bordered>
    <q-card-section class="q-pa-none text-center">
      <q-avatar
        size="120px"
        class="q-mt-md q-mb-sm cursor-pointer"
        @click="triggerUpload"
      >
        <img
          :src="
            avatarPreview || avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'
          "
          alt="User Avatar"
        />
      </q-avatar>
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        @change="handleFileChange"
      />
    </q-card-section>

    <q-separator spaced />

    <q-card-section>
      <div class="text-h6 text-weight-bold text-center">
        {{ userStore.name || "No name" }}
      </div>

      <div class="q-mt-md q-gutter-sm">
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="phone" color="primary" />
          </q-item-section>
          <q-item-section>{{ userStore.phone || "No phone" }}</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section avatar>
            <q-icon name="email" color="primary" />
          </q-item-section>
          <q-item-section>{{ userStore.email || "No email" }}</q-item-section>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "src/stores/user-store";

const userStore = useUserStore();

const avatar =
  "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg";

const avatarPreview = ref(null);
const fileInput = ref(null);

function triggerUpload() {
  fileInput.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      avatarPreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<style scoped>
.sidebar-card {
  width: 100%;
  max-width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}
.hidden {
  display: none;
}
</style>