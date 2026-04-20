<template>
  <LoadingScreen v-if="isLoading" @done="isLoading = false" />
  <div v-else>
    <!-- konten website nanti di sini -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue";

const isLoading = ref(true);
</script>
