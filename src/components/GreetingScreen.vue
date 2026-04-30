<template>
  <div class="greeting-screen" :data-dark="isDark">
    <div class="gs-ambient">
      <div class="gs-fog gs-fog-1"></div>
      <div class="gs-fog gs-fog-2"></div>
      <div class="gs-fog gs-fog-3"></div>
    </div>

    <Transition name="gs-word" mode="out-in">
      <!-- Language picker step — shown FIRST -->
      <div v-if="showLangPicker" key="lang" class="gs-lang-picker">
        <p class="gs-lang-title">Choose your language</p>
        <p class="gs-lang-sub">Pilih bahasa kamu</p>
        <div class="gs-lang-btns">
          <button class="gs-lang-btn" @click="chooseLang('en')">
            <span>English</span>
          </button>
          <button class="gs-lang-btn" @click="chooseLang('id')">
            <span>Indonesia</span>
          </button>
        </div>
      </div>

      <!-- Phrases shown AFTER language chosen -->
      <div
        v-else-if="showPhrases && current"
        class="gs-phrase"
        :key="currentIndex"
      >
        <p class="gs-line1">{{ current.line1 }}</p>
        <p class="gs-line2" v-if="current.line2">{{ current.line2 }}</p>
      </div>
    </Transition>

    <!-- Floating sparks -->
    <div class="gs-sparks">
      <div
        v-for="i in 22"
        :key="'sp' + i"
        class="gs-spark"
        :style="getSparkStyle(i)"
      ></div>
    </div>

    <div class="gs-dots" v-if="showPhrases && phrases.length">
      <span
        v-for="i in phrases.length"
        :key="i"
        class="gs-dot"
        :class="{ 'gs-dot-active': currentIndex === i - 1 }"
      ></span>
    </div>

    <Transition name="gs-skip-fade">
      <span
        v-if="showPhrases"
        class="gs-skip-text"
        :data-dark="isDark"
        @click="emitDoneOnce(selectedLang)"
      >
        Lewati Intro ↗
      </span>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({ isDark: Boolean });
const emit = defineEmits(["done"]);

function getSparkStyle(i) {
  const x = 5 + ((i * 79) % 90);
  const y = 5 + ((i * 61) % 90);
  const dur = 3.5 + (i % 6) * 1.1;
  const delay = (i * 0.43) % 4;
  const size = 2 + (i % 3);
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${dur}s`,
    animationDelay: `${delay}s`,
  };
}

// Step 1: language picker
const showLangPicker = ref(true);
const selectedLang = ref(null);

// Step 2: phrases (set after lang chosen)
const phrasesMap = {
  en: [
    { line1: "Hey, I'm Caly", line2: "Welcome to your inner space." },
    { line1: "This is your space", line2: "to reflect, feel, and grow." },
    { line1: "No judgment here.", line2: "Just you and your thoughts." },
    { line1: "Ready?", line2: null },
  ],
  id: [
    { line1: "Hei, Aku Caly", line2: "Selamat datang di ruang batinmu." },
    {
      line1: "Ini ruangmu",
      line2: "untuk merenung, merasakan, dan bertumbuh.",
    },
    {
      line1: "Tidak ada penghakiman di sini.",
      line2: "Hanya kamu dan pikiranmu.",
    },
    { line1: "Siap?", line2: null },
  ],
};

const phrases = ref([]);
const currentIndex = ref(0);
const current = ref(null);
const showPhrases = ref(false);
const hasEmittedDone = ref(false);

function emitDoneOnce(lang) {
  if (hasEmittedDone.value) return;
  hasEmittedDone.value = true;
  emit("done", lang);
}

function chooseLang(lang) {
  selectedLang.value = lang;
  showLangPicker.value = false;

  setTimeout(() => {
    phrases.value = phrasesMap[lang];
    current.value = phrases.value[0];
    currentIndex.value = 0;
    showPhrases.value = true;

    let i = 0;
    const next = () => {
      i++;
      if (i < phrases.value.length) {
        currentIndex.value = i;
        current.value = phrases.value[i];
        setTimeout(next, i === phrases.value.length - 1 ? 2200 : 2800);
      } else {
        setTimeout(() => emitDoneOnce(lang), 800);
      }
    };
    setTimeout(next, 2800);
  }, 500);
}
</script>

<style>
/* ── GreetingScreen — all selectors namespaced with gs- prefix ── */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400&display=swap");

.greeting-screen {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 8888;
  overflow: hidden;
  /* light mode default */
  background: radial-gradient(
    ellipse at 50% 40%,
    #ede8f5 0%,
    #d9d1ea 45%,
    #c5bad8 100%
  );
  transition: background 0.4s ease;
}
.greeting-screen[data-dark="true"] {
  background: radial-gradient(
    ellipse at 50% 40%,
    #0d1a27 0%,
    #060c12 60%,
    #020609 100%
  );
}

/* fog */
.gs-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.gs-fog {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  animation: gsFogDrift ease-in-out infinite alternate;
}

/* light fog */
.gs-fog-1 {
  width: 320px;
  height: 200px;
  top: 5%;
  left: -6%;
  animation-duration: 10s;
  background: radial-gradient(
    ellipse,
    rgba(180, 165, 215, 0.4) 0%,
    transparent 70%
  );
}
.gs-fog-2 {
  width: 260px;
  height: 180px;
  bottom: 8%;
  right: -4%;
  animation-duration: 13s;
  animation-delay: -4s;
  background: radial-gradient(
    ellipse,
    rgba(200, 185, 235, 0.35) 0%,
    transparent 70%
  );
}
.gs-fog-3 {
  width: 200px;
  height: 160px;
  top: 50%;
  left: 60%;
  animation-duration: 9s;
  animation-delay: -7s;
  background: radial-gradient(
    ellipse,
    rgba(210, 195, 240, 0.3) 0%,
    transparent 70%
  );
}

/* dark fog — override when data-dark=true */
.greeting-screen[data-dark="true"] .gs-fog-1 {
  background: radial-gradient(
    ellipse,
    rgba(108, 92, 231, 0.22) 0%,
    transparent 70%
  );
}
.greeting-screen[data-dark="true"] .gs-fog-2 {
  background: radial-gradient(
    ellipse,
    rgba(74, 63, 122, 0.28) 0%,
    transparent 70%
  );
}
.greeting-screen[data-dark="true"] .gs-fog-3 {
  background: radial-gradient(
    ellipse,
    rgba(245, 166, 35, 0.1) 0%,
    transparent 70%
  );
}

@keyframes gsFogDrift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(20px, -14px) scale(1.06);
  }
}

/* phrase */
.gs-phrase {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 32px;
}
.gs-line1 {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: #2d2460;
}
.greeting-screen[data-dark="true"] .gs-line1 {
  background: linear-gradient(135deg, #a78bfa 0%, #f5a623 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gs-line2 {
  font-family: "Outfit", sans-serif;
  font-size: clamp(0.95rem, 2.5vw, 1.15rem);
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.02em;
  color: rgba(74, 63, 122, 0.7);
}
.greeting-screen[data-dark="true"] .gs-line2 {
  color: rgba(167, 139, 250, 0.65);
}

/* Language picker */
.gs-lang-picker {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 32px;
}
.gs-lang-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
  margin: 0;
  color: #2d2460;
}
.greeting-screen[data-dark="true"] .gs-lang-title {
  background: linear-gradient(135deg, #a78bfa 0%, #f5a623 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gs-lang-sub {
  font-family: "Outfit", sans-serif;
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  font-weight: 300;
  margin: 0;
  color: rgba(74, 63, 122, 0.6);
  letter-spacing: 0.02em;
}
.greeting-screen[data-dark="true"] .gs-lang-sub {
  color: rgba(167, 139, 250, 0.6);
}
.gs-lang-btns {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}
.gs-lang-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  border-radius: 50px;
  font-family: "Outfit", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  border: 2px solid rgba(100, 80, 140, 0.25);
  background: rgba(255, 255, 255, 0.55);
  color: #2d2460;
  cursor: pointer;
  transition: all 0.22s ease;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 16px rgba(74, 63, 122, 0.12);
}
.gs-lang-btn:hover {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(100, 80, 140, 0.55);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(74, 63, 122, 0.22);
}
.gs-lang-btn:active {
  transform: translateY(0);
}
.greeting-screen[data-dark="true"] .gs-lang-btn {
  background: rgba(30, 20, 55, 0.65);
  border-color: rgba(167, 139, 250, 0.3);
  color: #e8e0f8;
}
.greeting-screen[data-dark="true"] .gs-lang-btn:hover {
  background: rgba(50, 35, 85, 0.85);
  border-color: rgba(167, 139, 250, 0.65);
}

/* sparks */
.gs-sparks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.gs-spark {
  position: absolute;
  border-radius: 50%;
  background: rgba(120, 100, 170, 0.6);
  box-shadow: 0 0 5px 2px rgba(120, 100, 170, 0.4);
  animation: gsSparkFloat ease-in-out infinite;
}
.gs-spark:nth-child(3n) {
  background: rgba(160, 140, 200, 0.55);
  box-shadow: 0 0 6px 2px rgba(160, 140, 200, 0.4);
}
.gs-spark:nth-child(3n + 1) {
  background: rgba(190, 170, 225, 0.5);
  box-shadow: 0 0 4px 1px rgba(190, 170, 225, 0.35);
}
.greeting-screen[data-dark="true"] .gs-spark {
  background: rgba(167, 139, 250, 0.65);
  box-shadow: 0 0 6px 2px rgba(167, 139, 250, 0.45);
}
.greeting-screen[data-dark="true"] .gs-spark:nth-child(3n) {
  background: rgba(245, 166, 35, 0.55);
  box-shadow: 0 0 6px 2px rgba(245, 166, 35, 0.4);
}
.greeting-screen[data-dark="true"] .gs-spark:nth-child(3n + 1) {
  background: rgba(106, 176, 76, 0.5);
  box-shadow: 0 0 5px 2px rgba(106, 176, 76, 0.35);
}
@keyframes gsSparkFloat {
  0% {
    transform: translateY(0px) scale(1);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1.25);
    opacity: 0.85;
  }
  85% {
    opacity: 0.35;
  }
  100% {
    transform: translateY(-42px) scale(0.6);
    opacity: 0;
  }
}

/* dots */
.gs-dots {
  position: absolute;
  bottom: 40px;
  display: flex;
  gap: 8px;
}
.gs-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(124, 108, 168, 0.25);
  transition:
    background 0.4s ease,
    transform 0.4s ease;
}
.gs-dot-active {
  background: #7c6ca8 !important;
  transform: scale(1.3);
}
.greeting-screen[data-dark="true"] .gs-dot {
  background: rgba(167, 139, 250, 0.2);
}
.greeting-screen[data-dark="true"] .gs-dot-active {
  background: #a78bfa !important;
}

/* Skip intro text */
.gs-skip-text {
  position: absolute;
  bottom: 40px;
  right: 28px;
  font-family: "Outfit", sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(74, 63, 122, 0.5);
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: color 0.2s ease;
  user-select: none;
}
.gs-skip-text:hover {
  color: rgba(74, 63, 122, 0.85);
}
.gs-skip-text[data-dark="true"] {
  color: rgba(167, 139, 250, 0.45);
}
.gs-skip-text[data-dark="true"]:hover {
  color: rgba(167, 139, 250, 0.85);
}

.gs-skip-fade-enter-active {
  transition: opacity 0.5s ease;
}
.gs-skip-fade-leave-active {
  transition: opacity 0.3s ease;
}
.gs-skip-fade-enter-from,
.gs-skip-fade-leave-to {
  opacity: 0;
}

/* transition */
.gs-word-enter-active {
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}
.gs-word-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.gs-word-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.gs-word-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>