<template>
  <div class="ev-screen" :data-dark="isDark">
    <div class="ev-ambient">
      <div class="ev-blob ev-blob-1"></div>
      <div class="ev-blob ev-blob-2"></div>
      <div class="ev-blob ev-blob-3"></div>
    </div>

    <Transition name="ev-pop" appear>
      <div class="ev-card">
        <!-- In-card top bar -->
        <div class="ev-card-topbar">
          <button
            class="ev-fixed-back"
            @click="$emit('back')"
            :title="lang === 'id' ? 'Kembali' : 'Back'"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <img src="/logo.png" alt="Innerly" class="ev-fixed-logo" />
        </div>

        <!-- Header -->
        <div class="ev-header">
          <p class="ev-eyebrow">{{ t.eyebrow }}</p>
          <h1 class="ev-title">{{ t.question }}</h1>
          <p class="ev-sub">{{ t.sub }}</p>
        </div>

        <!-- Two columns -->
        <div class="ev-cols">
          <div class="ev-col ev-col-good" :class="{ expanded: expandedA }">
            <button class="ev-col-header" @click="expandedA = !expandedA">
              <span class="ev-col-icon">✅</span>
              <span class="ev-col-title">{{ t.colA }}</span>
              <span class="ev-col-chevron" :class="{ open: expandedA }">›</span>
            </button>
            <Transition name="ev-expand">
              <div class="ev-col-body" v-if="expandedA">
                <textarea
                  v-model="wentWell"
                  class="ev-textarea"
                  :placeholder="t.colAph"
                  rows="4"
                  autofocus
                ></textarea>
              </div>
            </Transition>
          </div>

          <div class="ev-col ev-col-improve" :class="{ expanded: expandedB }">
            <button class="ev-col-header" @click="expandedB = !expandedB">
              <span class="ev-col-icon">🔧</span>
              <span class="ev-col-title">{{ t.colB }}</span>
              <span class="ev-col-chevron" :class="{ open: expandedB }">›</span>
            </button>
            <Transition name="ev-expand">
              <div class="ev-col-body" v-if="expandedB">
                <textarea
                  v-model="needsWork"
                  class="ev-textarea"
                  :placeholder="t.colBph"
                  rows="4"
                ></textarea>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Hint -->
        <p class="ev-hint">{{ t.hint }}</p>

        <!-- CTA -->
        <button
          class="ev-cta-btn"
          @click="handleDone"
          :disabled="!wentWell.trim() && !needsWork.trim()"
        >
          <span>{{ t.continueBtn }}</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <button class="ev-skip-btn" @click="handleSkip">{{ t.skipBtn }}</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  isDark: Boolean,
  lang: { type: String, default: "en" },
});

const emit = defineEmits(["done", "back"]);

const i18n = {
  en: {
    eyebrow: "Step 3 · The Evaluation",
    question: "What went well, and what felt off?",
    sub: "Separate the facts from the feelings — write it as it is.",
    colA: "What went well",
    colAph: "e.g. I managed to stay focused for the first half of the day...",
    colB: "What needs improvement",
    colBph: "e.g. I got distracted easily and struggled to finish tasks...",
    hint: "No judgment here — just honest observation.",
    continueBtn: "Continue to Insight",
    skipBtn: "skip for now",
  },
  id: {
    eyebrow: "Langkah 3 · The Evaluation",
    question: "Apa yang berjalan lancar, dan apa yang terasa mengganjal?",
    sub: "Pisahkan fakta dari perasaan — tulis apa adanya.",
    colA: "Yang berjalan baik",
    colAph: "mis. Aku berhasil fokus di paruh pertama hari ini...",
    colB: "Yang perlu diperbaiki",
    colBph: "mis. Aku mudah terdistraksi dan kesulitan menyelesaikan tugas...",
    hint: "Tidak ada penghakiman di sini — hanya observasi jujur.",
    continueBtn: "Lanjut ke Insight",
    skipBtn: "lewati untuk sekarang",
  },
};

const t = computed(() => i18n[props.lang] ?? i18n.en);

const wentWell = ref("");
const needsWork = ref("");
const expandedA = ref(true);
const expandedB = ref(false);

function handleDone() {
  emit("done", {
    wentWell: wentWell.value.trim(),
    needsWork: needsWork.value.trim(),
    next: "insight",
  });
}

function handleSkip() {
  emit("done", { wentWell: "", needsWork: "", next: "insight" });
}
</script>

<style scoped>
.ev-fixed-back {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  color: rgba(100, 80, 140, 0.65);
  transition: all 0.2s;
}
.ev-fixed-back:hover {
  background: rgba(124, 108, 168, 0.1);
  color: rgba(100, 80, 140, 0.9);
}
.ev-screen[data-dark="true"] .ev-fixed-back {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  color: rgba(100, 80, 140, 0.65);
  transition: all 0.2s;
}
.ev-screen[data-dark="true"] .ev-fixed-back:hover {
  background: rgba(167, 139, 250, 0.1);
  color: rgba(167, 139, 250, 0.9);
}
.ev-fixed-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(124, 108, 168, 0.25));
}
.ev-fixed-steps {
  display: flex;
  gap: 5px;
  align-items: center;
}
.ev-fixed-step {
  height: 4px;
  width: 36px;
  border-radius: 3px;
  background: rgba(124, 108, 168, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.ev-fixed-step.done {
  background: rgba(124, 108, 168, 0.45);
}
.ev-fixed-step.active {
  background: #7c6ca8;
  width: 52px;
  box-shadow: 0 0 8px rgba(124, 108, 168, 0.4);
}
.ev-screen[data-dark="true"] .ev-fixed-step {
  background: rgba(167, 139, 250, 0.12);
}
.ev-screen[data-dark="true"] .ev-fixed-step.done {
  background: rgba(167, 139, 250, 0.38);
}
.ev-screen[data-dark="true"] .ev-fixed-step.active {
  background: #a78bfa;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.45);
}

.ev-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 5000;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 35%,
    #ede8f5 0%,
    #d5ccec 50%,
    #c4b9e0 100%
  );
}
.ev-screen[data-dark="true"] {
  background: radial-gradient(
    ellipse at 50% 35%,
    #0d1520 0%,
    #060d17 60%,
    #020810 100%
  );
}

/* Blobs */
.ev-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.ev-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: evBlobDrift ease-in-out infinite alternate;
}
.ev-blob-1 {
  width: 380px;
  height: 260px;
  top: -8%;
  left: -10%;
  background: radial-gradient(
    ellipse,
    rgba(106, 176, 76, 0.22) 0%,
    transparent 70%
  );
  animation-duration: 11s;
}
.ev-blob-2 {
  width: 300px;
  height: 220px;
  bottom: -5%;
  right: -8%;
  background: radial-gradient(
    ellipse,
    rgba(230, 126, 34, 0.16) 0%,
    transparent 70%
  );
  animation-duration: 14s;
  animation-delay: -5s;
}
.ev-blob-3 {
  width: 240px;
  height: 200px;
  top: 45%;
  left: 55%;
  background: radial-gradient(
    ellipse,
    rgba(167, 139, 250, 0.18) 0%,
    transparent 70%
  );
  animation-duration: 9s;
  animation-delay: -8s;
}
@keyframes evBlobDrift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(18px, -14px) scale(1.07);
  }
}

/* In-card topbar */
.ev-card-topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -8px;
}
.ev-steps-bottom {
  justify-content: center;
  padding-top: 8px;
  border-top: 1px solid rgba(124, 108, 168, 0.1);
  margin-top: -4px;
}
.ev-screen[data-dark="true"] .ev-steps-bottom {
  border-top-color: rgba(167, 139, 250, 0.1);
}

/* Card */
.ev-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 540px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 108, 168, 0.18);
  border-radius: 28px;
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow:
    0 24px 64px rgba(74, 63, 122, 0.18),
    0 2px 8px rgba(74, 63, 122, 0.08);
  max-height: 92svh;
  overflow-y: auto;
  scrollbar-width: none;
}
.ev-card::-webkit-scrollbar {
  display: none;
}
.ev-screen[data-dark="true"] .ev-card {
  background: rgba(13, 26, 39, 0.88);
  border-color: rgba(167, 139, 250, 0.14);
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Header */
.ev-header {
  margin-top: -8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.ev-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(124, 108, 168, 0.65);
  margin: 0;
}
.ev-screen[data-dark="true"] .ev-eyebrow {
  color: rgba(167, 139, 250, 0.6);
}
.ev-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.3rem, 3.5vw, 1.75rem);
  font-weight: 700;
  color: #2d2460;
  margin: 0;
  line-height: 1.3;
}
.ev-screen[data-dark="true"] .ev-title {
  color: #e8e0f8;
}
.ev-sub {
  font-size: 0.82rem;
  color: rgba(74, 63, 122, 0.55);
  margin: 0;
}
.ev-screen[data-dark="true"] .ev-sub {
  color: rgba(167, 139, 250, 0.55);
}

/* Columns */
.ev-cols {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ev-col {
  border-radius: 16px;
  border: 2px solid rgba(124, 108, 168, 0.15);
  background: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  transition:
    border-color 0.25s,
    box-shadow 0.25s;
}
.ev-screen[data-dark="true"] .ev-col {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(167, 139, 250, 0.14);
}
.ev-col-good.expanded {
  border-color: #6ab04c;
  box-shadow: 0 4px 18px rgba(106, 176, 76, 0.18);
}
.ev-col-improve.expanded {
  border-color: #e67e22;
  box-shadow: 0 4px 18px rgba(230, 126, 34, 0.18);
}

.ev-col-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.ev-col-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}
.ev-col-title {
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(74, 63, 122, 0.8);
  flex: 1;
}
.ev-screen[data-dark="true"] .ev-col-title {
  color: rgba(200, 185, 255, 0.85);
}
.ev-col-chevron {
  font-size: 1.3rem;
  color: rgba(124, 108, 168, 0.45);
  transition: transform 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
  line-height: 1;
  display: flex;
  align-items: center;
}
.ev-col-chevron.open {
  transform: rotate(90deg);
}

.ev-col-body {
  padding: 0 18px 16px;
}

.ev-textarea {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(124, 108, 168, 0.2);
  outline: none;
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  color: #2d2460;
  resize: none;
  line-height: 1.7;
  padding: 6px 0 8px;
  caret-color: #7c6ca8;
  transition: border-color 0.2s;
}
.ev-textarea:focus {
  border-color: #7c6ca8;
}
.ev-textarea::placeholder {
  color: rgba(100, 80, 140, 0.3);
  font-style: italic;
}
.ev-screen[data-dark="true"] .ev-textarea {
  color: #e8e0f8;
  caret-color: #a78bfa;
  border-color: rgba(167, 139, 250, 0.2);
}
.ev-screen[data-dark="true"] .ev-textarea:focus {
  border-color: #a78bfa;
}
.ev-screen[data-dark="true"] .ev-textarea::placeholder {
  color: rgba(167, 139, 250, 0.35);
}

/* Hint */
.ev-hint {
  font-size: 0.75rem;
  font-style: italic;
  color: rgba(100, 80, 140, 0.4);
  text-align: center;
  margin: 0;
}
.ev-screen[data-dark="true"] .ev-hint {
  color: rgba(167, 139, 250, 0.4);
}

/* CTA */
.ev-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 28px;
  border-radius: 50px;
  background: linear-gradient(135deg, #7c6ca8 0%, #c084fc 100%);
  color: white;
  border: none;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 6px 22px rgba(124, 108, 168, 0.38);
  letter-spacing: 0.02em;
}
.ev-cta-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(124, 108, 168, 0.48);
  filter: brightness(1.06);
}
.ev-cta-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ev-screen[data-dark="true"] .ev-cta-btn {
  background: linear-gradient(135deg, #6c5ce7 0%, #a78bfa 100%);
  box-shadow: 0 6px 22px rgba(108, 92, 231, 0.42);
}

/* Skip */
.ev-skip-btn {
  text-align: center;
  font-family: "Outfit", sans-serif;
  font-size: 0.72rem;
  color: rgba(100, 80, 140, 0.38);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
  padding: 4px;
  margin-top: -8px;
}
.ev-skip-btn:hover {
  color: rgba(100, 80, 140, 0.65);
}
.ev-screen[data-dark="true"] .ev-skip-btn {
  color: rgba(167, 139, 250, 0.38);
}

/* Step bar */
/* Transitions */
.ev-pop-enter-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.ev-pop-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
}

.ev-expand-enter-active {
  transition:
    opacity 0.25s ease,
    max-height 0.3s ease;
  max-height: 300px;
}
.ev-expand-leave-active {
  transition:
    opacity 0.2s ease,
    max-height 0.25s ease;
}
.ev-expand-enter-from {
  opacity: 0;
  max-height: 0;
}
.ev-expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
