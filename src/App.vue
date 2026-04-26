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
        :lang="lang"
        @done="onMoodDone"
        @back="stage = 'dashboard'"
      />
      <EvaluationScreen
        v-else-if="stage === 'evaluation'"
        key="evaluation"
        :is-dark="isDark"
        :lang="lang"
        @done="onEvaluationDone"
        @back="stage = 'moodcheck'"
      />
      <InsightScreen
        v-else-if="stage === 'insight'"
        key="insight"
        :is-dark="isDark"
        :lang="lang"
        :context="insightContext"
        @done="onInsightDone"
        @back="stage = 'evaluation'"
      />
      <ActionPlanScreen
        v-else-if="stage === 'actionplan'"
        key="actionplan"
        :is-dark="isDark"
        :lang="lang"
        @done="onActionPlanDone"
        @back="stage = 'insight'"
      />
      <SummaryScreen
        v-else-if="stage === 'summary'"
        key="summary"
        :is-dark="isDark"
        :lang="lang"
        :data="summaryData"
        @done="stage = 'dashboard'"
        @new="onStartNew"
      />
      <DashboardView
        v-else
        key="dashboard"
        :is-dark="isDark"
        :user-name="userName"
        :initial-reflection="initialReflection"
        :initial-mood="initialMood"
        :lang="lang"
        @toggle-theme="isDark = !isDark"
      />
    </Transition>

    <NameModal
      ref="nameModalRef"
      :is-dark="isDark"
      :lang="lang"
      @done="onNameDone"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import GreetingScreen from "./components/GreetingScreen.vue";
import MoodCheckScreen from "./components/MoodCheckScreen.vue";
import DashboardView from "./views/DashboardView.vue";
import NameModal from "./components/NameModal.vue";
import EvaluationScreen from "./components/EvaluationScreen.vue";
import InsightScreen from "./components/InsightScreen.vue";
import ActionPlanScreen from "./components/ActionPlanScreen.vue";
import SummaryScreen from "./components/SummaryScreen.vue";

const stage = ref("loading");
const globalAudio = ref(null);
const isDark = ref(false);
const userName = ref("");
const initialReflection = ref("");
const initialMood = ref(null);
const initialEvaluation = ref(null);
const initialInsight = ref(null);
const initialAction = ref(null);
const insightContext = ref({});
const summaryData = ref({});
const nameModalRef = ref(null);
const curtainVisible = ref(false);
const lang = ref("en"); // default english, will be set by GreetingScreen

async function onLoadingDone(darkState, skipIntro = false) {
  isDark.value = darkState;

  if (skipIntro) {
    // Skip intro - go directly to NameModal
    // Set stage to moodcheck to hide LoadingScreen, then open NameModal
    stage.value = "moodcheck";
    nameModalRef.value?.open();
  } else {
    // Normal flow - go through greeting
    // 1. Fade curtain IN
    curtainVisible.value = true;
    await new Promise((r) => setTimeout(r, 500));
    // 2. Ganti stage — GreetingScreen render di balik curtain hitam
    stage.value = "greeting";
    await new Promise((r) => setTimeout(r, 200));
    // 3. Curtain fade OUT — GreetingScreen sudah siap
    curtainVisible.value = false;
  }
}

function onGreetingDone(selectedLang) {
  lang.value = selectedLang;
  nameModalRef.value?.open();
}

function onNameDone(name, reflection) {
  userName.value = name;
  initialReflection.value = reflection;
  stage.value = "moodcheck";
}

function onMoodDone(moodData) {
  initialMood.value = moodData;
  stage.value = "evaluation";
}

function onEvaluationDone(evalData) {
  initialEvaluation.value = evalData;
  insightContext.value = {
    trigger: initialReflection.value,
    moods: initialMood.value?.mood ? [initialMood.value.mood] : [],
    wentWell: evalData.wentWell,
    needsWork: evalData.needsWork,
  };
  stage.value = "insight";
}

function onInsightDone(insightData) {
  initialInsight.value = insightData;
  stage.value = "actionplan";
}

function onActionPlanDone(actionData) {
  initialAction.value = actionData;
  summaryData.value = {
    trigger: initialReflection.value,
    mood: initialMood.value?.mood || "",
    moodEmoji: initialMood.value?.moodEmoji || "",
    wentWell: initialEvaluation.value?.wentWell || "",
    needsWork: initialEvaluation.value?.needsWork || "",
    insight: initialInsight.value?.insight || "",
    action: actionData.action || "",
    committed: actionData.committed || false,
  };
  stage.value = "summary";
}

function onStartNew() {
  // Reset semua data refleksi
  initialReflection.value = "";
  initialMood.value = null;
  initialEvaluation.value = null;
  initialInsight.value = null;
  initialAction.value = null;
  summaryData.value = {};
  insightContext.value = {};
  stage.value = "moodcheck";
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
