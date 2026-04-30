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
        @done="onSummaryDone"
        @new="onStartNew"
        @show-auth="showAuthModal = true"
      />
      <DashboardView
        v-else
        key="dashboard"
        :is-dark="isDark"
        :user-name="userName"
        :initial-reflection="initialReflection"
        :initial-mood="initialMood"
        :lang="lang"
        :pending-reflection="pendingReflection"
        @toggle-theme="isDark = !isDark"
        @logout="onLogout"
      />
    </Transition>

    <NameModal
      ref="nameModalRef"
      :is-dark="isDark"
      :lang="lang"
      @done="onNameDone"
    />

    <AuthModal
      :visible="showAuthModal"
      :is-dark="isDark"
      initial-mode="register"
      @close="showAuthModal = false"
      @success="onAuthSuccess"
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
import AuthModal from "./components/AuthModal.vue";
import { authService } from "./services/auth.js";
import { reflectionService } from "./services/reflection.js";

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
const showAuthModal = ref(false);
const pendingReflection = ref(null); // refleksi onboarding yang belum tersimpan ke dashboard

// --- Returning user helpers ---
function getSavedUser() {
  try {
    const raw = localStorage.getItem("innerly_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveUser(name, language) {
  try {
    localStorage.setItem("innerly_user", JSON.stringify({ name, lang: language }));
  } catch {}
}

function onAuthSuccess(user) {
  showAuthModal.value = false;
  // Update userName dari data user yang login
  if (user && (user.username || user.name)) {
    userName.value = user.username || user.name;
    saveUser(userName.value, lang.value);
  }
  // Simpan refleksi onboarding jika ada (user baru register setelah isi refleksi pertama)
  if (summaryData.value?.mood || summaryData.value?.trigger) {
    try {
      const today = new Date()
      const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
      const mood = summaryData.value?.mood ?? ''
      const newRef = {
        date: dateKey,
        mood: mood,
        moods: mood ? [mood] : [],
        trigger: summaryData.value?.trigger ?? '',
        wentWell: summaryData.value?.wentWell ?? '',
        improve: summaryData.value?.needsWork ?? '',
        insight: summaryData.value?.insight ?? '',
        action: summaryData.value?.action ?? '',
      }
      const existing = JSON.parse(localStorage.getItem('innerly_reflections') || '[]')
      const filtered = existing.filter(r => r.date !== dateKey)
      const updated = [...filtered, newRef]
      localStorage.setItem('innerly_reflections', JSON.stringify(updated))
      pendingReflection.value = newRef

      // Simpan ke database
      if (user && user.id) {
        reflectionService.saveReflection(user.id, newRef).catch(err => {
          console.error("Failed to save onboarding reflection to database:", err)
        })
      }
    } catch {}
  }
  // After auth (register or login), go directly to dashboard (GardenView)
  stage.value = "dashboard";
}

async function onLoadingDone(darkState, skipIntro = false) {
  isDark.value = darkState;

  // Check if user already has saved profile (returning user)
  const savedUser = getSavedUser();
  if (savedUser?.name) {
    userName.value = savedUser.name;
    lang.value = savedUser.lang || "en";
    // Skip all onboarding — go straight to dashboard
    curtainVisible.value = true;
    await new Promise((r) => setTimeout(r, 400));
    stage.value = "dashboard";
    await new Promise((r) => setTimeout(r, 150));
    curtainVisible.value = false;
    return;
  }

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
  // Save user profile so next visit skips onboarding
  saveUser(name, lang.value);
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

function onLogout() {
  // Reset semua state
  userName.value = ""
  initialReflection.value = ""
  initialMood.value = null
  initialEvaluation.value = null
  initialInsight.value = null
  initialAction.value = null
  summaryData.value = {}
  insightContext.value = {}
  pendingReflection.value = null
  // Clear semua localStorage supaya reminder, watered, refleksi tidak bocor ke session berikutnya
  try {
    localStorage.removeItem('innerly_user')
    localStorage.removeItem('innerly_reflections')
    localStorage.removeItem('innerly_watered_date')
    localStorage.removeItem('innerly_reminder')
    localStorage.removeItem('innerly_chosen_flower')
  } catch {}
  // Kembali ke loading screen
  stage.value = "loading"
}

function onSummaryDone() {
  // Simpan refleksi onboarding ke localStorage supaya bunga muncul di kalender
  try {
    const today = new Date()
    const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    const mood = summaryData.value?.mood ?? ''
    const newRef = {
      date: dateKey,
      mood: mood,
      moods: mood ? [mood] : [],
      trigger: summaryData.value?.trigger ?? '',
      wentWell: summaryData.value?.wentWell ?? '',
      improve: summaryData.value?.needsWork ?? '',
      insight: summaryData.value?.insight ?? '',
      action: summaryData.value?.action ?? '',
    }
    const existing = JSON.parse(localStorage.getItem('innerly_reflections') || '[]')
    // Hindari duplikat di hari yang sama
    const filtered = existing.filter(r => r.date !== dateKey)
    const updated = [...filtered, newRef]
    localStorage.setItem('innerly_reflections', JSON.stringify(updated))
    // Set pendingReflection agar DashboardView langsung tampilkan bunga tanpa reload
    pendingReflection.value = newRef

    // Simpan ke database jika user sudah login
    const user = authService.getUser && authService.getUser()
    const userId = user?.id || user?._id
    if (userId) {
      reflectionService.saveReflection(userId, newRef).catch(err => {
        console.error("Failed to save reflection to database:", err)
      })
    }
  } catch {}
  stage.value = 'dashboard'
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