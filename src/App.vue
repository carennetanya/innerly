<template>
  <div :class="{ dark: isDark }">
    <!-- Global transition overlay — sits above all screens during stage changes -->
    <div
      class="stage-curtain"
      :class="{ 'curtain-show': curtainVisible }"
    ></div>

    <!-- Global persistent audio — stays alive across all stages -->
    <audio ref="globalAudio" src="/main.mp3" loop style="display: none"></audio>

    <Transition name="fade">
      <LoadingScreen
        v-if="stage === 'loading'"
        key="loading"
        :audio-el="globalAudio"
        @done="onLoadingDone"
      />
      <GreetingScreen
        v-else-if="stage === 'greeting'"
        key="greeting"
        :is-dark="isDark"
        @done="onGreetingDone"
      />
      <MoodCheckScreen
        v-else-if="stage === 'moodcheck'"
        key="moodcheck"
        :is-dark="isDark"
        :user-name="userName"
        @done="onMoodDone"
      />
      <DashboardView
        v-else
        key="dashboard"
        :is-dark="isDark"
        :user-name="userName"
        :initial-reflection="initialReflection"
        :initial-mood="initialMood"
        @toggle-theme="isDark = !isDark"
      />
    </Transition>

    <NameModal ref="nameModalRef" :is-dark="isDark" @done="onNameDone" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import GreetingScreen from "./components/GreetingScreen.vue";
import MoodCheckScreen from "./components/MoodCheckScreen.vue";
import DashboardView from "./views/DashboardView.vue";
import NameModal from "./components/NameModal.vue";

const stage = ref("loading");
const globalAudio = ref(null);
const isDark = ref(false);
const userName = ref("");
const initialReflection = ref("");
const initialMood = ref(null);
const nameModalRef = ref(null);
const curtainVisible = ref(false);

async function onLoadingDone(darkState) {
  isDark.value = darkState;
  // 1. Fade curtain IN
  curtainVisible.value = true;
  await new Promise((r) => setTimeout(r, 500));
  // 2. Ganti stage — GreetingScreen render di balik curtain hitam
  stage.value = "greeting";
  await new Promise((r) => setTimeout(r, 200));
  // 3. Curtain fade OUT — GreetingScreen sudah siap
  curtainVisible.value = false;
}

function onGreetingDone() {
  nameModalRef.value?.open();
}

function onNameDone(name, reflection) {
  userName.value = name;
  initialReflection.value = reflection;
  stage.value = "moodcheck";
}

function onMoodDone(moodData) {
  initialMood.value = moodData;
  stage.value = "dashboard";
}
</script>

<style>
/* Stage curtain — covers the flash between screen transitions */
.stage-curtain {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.45s ease;
}
.stage-curtain.curtain-show {
  opacity: 1;
  pointer-events: all;
}

.fade-leave-active {
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}
.fade-enter-active {
  transition:
    opacity 0.5s ease 0.08s,
    transform 0.5s ease 0.08s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
