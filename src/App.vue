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
        @show-login="onShowLoginFromLoading"
        @show-about="(dark) => { isDark = dark; showAboutScreen = true }"
        @show-contact="(dark) => { isDark = dark; showContactScreen = true }"
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
        @back="onMoodBack"
      />
      <EvaluationScreen
        v-else-if="stage === 'evaluation'"
        key="evaluation"
        :is-dark="isDark"
        :lang="lang"
        @done="onEvaluationDone"
        @back="stage = 'moodcheck'"
      />
      <ActionPlanScreen
        v-else-if="stage === 'actionplan'"
        key="actionplan"
        :is-dark="isDark"
        :lang="lang"
        @done="onActionPlanDone"
        @back="stage = 'evaluation'"
      />
      <SummaryScreen
        v-else-if="stage === 'summary'"
        key="summary"
        :is-dark="isDark"
        :lang="lang"
        :data="summaryData"
        @done="onSummaryDone"
        @new="onStartNew"
        @show-auth="onShowRegisterFromSummary"
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
        :db-reload-trigger="dbReloadTrigger"
        @toggle-theme="isDark = !isDark"
        @toggle-lang="lang = lang === 'id' ? 'en' : 'id'"
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
      :initial-mode="authModalMode"
      @close="showAuthModal = false"
      @success="onAuthSuccess"
    />

    <!-- About & Contact overlays -->
    <AboutScreen
      v-if="showAboutScreen"
      :is-dark="isDark"
      @close="showAboutScreen = false"
    />
    <ContactScreen
      v-if="showContactScreen"
      :is-dark="isDark"
      @close="showContactScreen = false"
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
import ActionPlanScreen from "./components/ActionPlanScreen.vue";
import SummaryScreen from "./components/SummaryScreen.vue";
import AuthModal from "./components/AuthModal.vue";
import AboutScreen from "./components/AboutScreen.vue";
import ContactScreen from "./components/ContactScreen.vue";
import { authService } from "./services/auth.js";
import { reflectionService } from "./services/reflection.js";

const stage = ref("loading");
const prevStage = ref("greeting"); // track dari mana masuk ke moodcheck
const globalAudio = ref(null);
const isDark = ref(false);
const userName = ref("");
const initialReflection = ref("");
const initialMood = ref(null);
const initialEvaluation = ref(null);
const initialAction = ref(null);
const summaryData = ref({});
const nameModalRef = ref(null);
const curtainVisible = ref(false);
const lang = ref("en"); // default english, will be set by GreetingScreen
const showAuthModal = ref(false);
const authModalMode = ref("register");
const showAboutScreen = ref(false);
const showContactScreen = ref(false);
const pendingReflection = ref(null); // refleksi onboarding yang belum tersimpan ke dashboard
const dbReloadTrigger = ref(0); // increment to force DashboardView reload from DB

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

function onShowLoginFromLoading() {
  // Called from LoadingScreen when user clicks "Sudah punya akun? Masuk"
  // We need to show auth modal with login mode even from loading screen
  // First set stage to something that shows AuthModal
  authModalMode.value = "login";
  showAuthModal.value = true;
}

function onShowRegisterFromSummary() {
  authModalMode.value = "register";
  showAuthModal.value = true;
}

function onAuthSuccess(user) {
  showAuthModal.value = false;
  // Update userName dari data user yang login
  if (user && (user.username || user.name)) {
    userName.value = user.username || user.name;
    saveUser(userName.value, lang.value);
  }

  const isLoginFlow = authModalMode.value === "login";

  // Simpan refleksi onboarding jika ada (user baru register setelah isi refleksi pertama)
  if (!isLoginFlow && (summaryData.value?.mood || summaryData.value?.trigger)) {
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
        action: summaryData.value?.action ?? '',
      }
      const existing = JSON.parse(localStorage.getItem('innerly_reflections') || '[]')
      const filtered = existing.filter(r => r.date !== dateKey)
      const updated = [...filtered, newRef]
      localStorage.setItem('innerly_reflections', JSON.stringify(updated))
      pendingReflection.value = newRef

      // Simpan ke database (with retry)
      if (user && user.id) {
        const saveWithRetry = async (uid, ref) => {
          try {
            await reflectionService.saveReflection(uid, ref);
          } catch (err) {
            console.error('Failed to save onboarding reflection, retrying...', err);
            setTimeout(async () => {
              try { await reflectionService.saveReflection(uid, ref); } catch {}
            }, 2000);
          }
        };
        saveWithRetry(user.id, newRef);
      }
    } catch {}
  }

  // After auth, go to dashboard
  stage.value = "dashboard";
  // Trigger DashboardView to reload reflections from DB with the now-authenticated user
  dbReloadTrigger.value++;
  // Reset auth mode back to register for next time
  authModalMode.value = "register";
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
  prevStage.value = "greeting";
  stage.value = "moodcheck";
}

function onMoodBack() {
  if (prevStage.value === 'dashboard') {
    stage.value = 'dashboard';
  } else {
    // Dari onboarding — kembali ke NameModal (skip greeting ulang)
    stage.value = 'greeting';
    setTimeout(() => nameModalRef.value?.reopen(), 50);
  }
}

function onMoodDone(moodData) {
  initialMood.value = moodData;
  stage.value = "evaluation";
}

function onEvaluationDone(evalData) {
  initialEvaluation.value = evalData;
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
  initialAction.value = null
  summaryData.value = {}
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

    // Simpan ke database jika user sudah login (with retry)
    const user = authService.getUser()
    const userId = user?.id || user?._id
    if (userId) {
      const saveWithRetry = async (uid, ref) => {
        try {
          await reflectionService.saveReflection(uid, ref);
        } catch (err) {
          console.error('Failed to save reflection to database, retrying...', err);
          setTimeout(async () => {
            try { await reflectionService.saveReflection(uid, ref); } catch {}
          }, 2000);
        }
      };
      saveWithRetry(userId, newRef);
      // User already logged in, go directly to dashboard
      stage.value = 'dashboard'
    } else {
      // User belum login → tampilkan register modal
      // summaryData sudah berisi semua data refleksi, akan disimpan saat register berhasil
      authModalMode.value = "register";
      showAuthModal.value = true;
      // Stage sementara ke summary agar modal terlihat
      // Modal akan handle navigation ke dashboard setelah register
    }
  } catch {
    stage.value = 'dashboard'
  }
}

function onStartNew() {
  // Reset semua data refleksi
  initialReflection.value = "";
  initialMood.value = null;
  initialEvaluation.value = null;
  initialAction.value = null;
  summaryData.value = {};
  prevStage.value = "dashboard";
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