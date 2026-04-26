<template>
  <div class="ap-screen" :data-dark="isDark">
    <!-- Ambient blobs -->
    <div class="ap-ambient">
      <div class="ap-blob ap-blob-1"></div>
      <div class="ap-blob ap-blob-2"></div>
      <div class="ap-blob ap-blob-3"></div>
    </div>

    <Transition name="ap-pop" appear>
      <div class="ap-card">
        <!-- In-card top bar -->
        <div class="ap-card-topbar">
          <button
            class="ap-fixed-back"
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
          <img src="/logo.png" alt="Innerly" class="ap-fixed-logo" />
        </div>

        <!-- Header -->
        <div class="ap-header">
          <p class="ap-eyebrow">{{ t.eyebrow }}</p>
          <h1 class="ap-title">{{ t.question }}</h1>
          <p class="ap-sub">{{ t.sub }}</p>
        </div>

        <!-- Commitment input -->
        <div class="ap-commitment-wrap">
          <div class="ap-prefix-row">
            <span class="ap-target-icon">🎯</span>
            <span class="ap-prefix">{{ t.prefix }}</span>
          </div>
          <textarea
            v-model="action"
            class="ap-textarea"
            :placeholder="t.placeholder"
            rows="3"
            autofocus
          ></textarea>
          <div class="ap-char-count">{{ action.length }} {{ t.chars }}</div>
        </div>

        <Transition name="ap-fade">
          <div v-if="action.trim().length > 0" class="ap-checklist">
            <label class="ap-check-label" :class="{ checked: committed }">
              <input
                type="checkbox"
                v-model="committed"
                class="ap-check-input"
              />
              <span class="ap-check-box">
                <svg
                  v-if="committed"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span class="ap-check-text">{{ t.commitText }}</span>
            </label>
          </div>
        </Transition>

        <!-- Committed celebration badge -->
        <Transition name="ap-fade">
          <div v-if="committed" class="ap-committed-badge">
            <span class="ap-badge-icon">💪</span>
            <span class="ap-badge-text">{{ t.badgeText }}</span>
          </div>
        </Transition>

        <!-- Hint -->
        <p class="ap-hint">{{ t.hint }}</p>

        <!-- CTA -->
        <button
          class="ap-cta-btn"
          :class="{ 'ap-cta-committed': committed }"
          @click="handleDone"
          :disabled="action.trim().length < 5"
        >
          <span>{{ committed ? t.finishCommitted : t.finishBtn }}</span>
          <span class="ap-cta-icon">{{ committed ? "🎉" : "→" }}</span>
        </button>

        <button class="ap-skip-btn" @click="handleSkip">{{ t.skipBtn }}</button>
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
    eyebrow: "Step 5 · The Action Plan",
    question: "What's one small thing you'll do differently tomorrow?",
    sub: "Small consistent steps beat big plans that never happen.",
    prefix: "Tomorrow, I will…",
    placeholder:
      "...prepare my materials at least a day before and practice in front of the mirror.",
    chars: "characters",
    commitText: "I'm committed to doing this tomorrow!",
    badgeText: "You've made a commitment — that's the hardest part. 🌱",
    hint: "One small action is better than ten great intentions.",
    finishBtn: "Finish Reflection",
    finishCommitted: "Finish & Commit",
    skipBtn: "skip for now",
  },
  id: {
    eyebrow: "Langkah 5 · The Action Plan",
    question: "Apa satu hal kecil yang akan kamu lakukan berbeda besok?",
    sub: "Langkah kecil yang konsisten lebih kuat dari rencana besar yang tidak dijalankan.",
    prefix: "Besok, aku akan…",
    placeholder:
      "...menyiapkan materi minimal H-1 dan berlatih keras di depan cermin.",
    chars: "karakter",
    commitText: "Aku berkomitmen untuk melakukan ini besok!",
    badgeText: "Kamu sudah berkomitmen — itu bagian yang paling penting. 🌱",
    hint: "Satu tindakan kecil lebih baik dari sepuluh niat besar.",
    finishBtn: "Selesaikan Refleksi",
    finishCommitted: "Selesai & Komitmen",
    skipBtn: "lewati untuk sekarang",
  },
};

const t = computed(() => i18n[props.lang] ?? i18n.en);

const action = ref("");
const committed = ref(false);

function handleDone() {
  emit("done", { action: action.value.trim(), committed: committed.value });
}

function handleSkip() {
  emit("done", { action: "", committed: false });
}
</script>

<style scoped>
.ap-fixed-back {
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
.ap-fixed-back:hover {
  background: rgba(106, 176, 76, 0.1);
  color: rgba(60, 130, 60, 0.9);
}
.ap-screen[data-dark="true"] .ap-fixed-back {
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
.ap-screen[data-dark="true"] .ap-fixed-back:hover {
  background: rgba(106, 176, 76, 0.1);
  color: rgba(106, 176, 76, 0.9);
}
.ap-fixed-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(106, 176, 76, 0.25));
}
.ap-fixed-steps {
  display: flex;
  gap: 5px;
  align-items: center;
}
.ap-fixed-step {
  height: 4px;
  width: 36px;
  border-radius: 3px;
  background: rgba(106, 176, 76, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.ap-fixed-step.done {
  background: rgba(106, 176, 76, 0.45);
}
.ap-fixed-step.active {
  background: #6ab04c;
  width: 52px;
  box-shadow: 0 0 8px rgba(106, 176, 76, 0.4);
}
.ap-screen[data-dark="true"] .ap-fixed-step {
  background: rgba(106, 176, 76, 0.12);
}
.ap-screen[data-dark="true"] .ap-fixed-step.done {
  background: rgba(106, 176, 76, 0.38);
}
.ap-screen[data-dark="true"] .ap-fixed-step.active {
  background: #7bc960;
  box-shadow: 0 0 8px rgba(106, 176, 76, 0.45);
}

.ap-screen {
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
    #edf5e8 0%,
    #d0e8c8 50%,
    #b8d9ae 100%
  );
}
.ap-screen[data-dark="true"] {
  background: radial-gradient(
    ellipse at 50% 35%,
    #0a1a0d 0%,
    #051008 60%,
    #020a04 100%
  );
}

/* Blobs */
.ap-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.ap-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: apBlobDrift ease-in-out infinite alternate;
}
.ap-blob-1 {
  width: 380px;
  height: 260px;
  top: -10%;
  left: -12%;
  background: radial-gradient(
    ellipse,
    rgba(106, 176, 76, 0.28) 0%,
    transparent 70%
  );
  animation-duration: 12s;
}
.ap-blob-2 {
  width: 300px;
  height: 220px;
  bottom: -6%;
  right: -8%;
  background: radial-gradient(
    ellipse,
    rgba(245, 166, 35, 0.2) 0%,
    transparent 70%
  );
  animation-duration: 15s;
  animation-delay: -6s;
}
.ap-blob-3 {
  width: 240px;
  height: 200px;
  top: 40%;
  left: 58%;
  background: radial-gradient(
    ellipse,
    rgba(72, 187, 120, 0.18) 0%,
    transparent 70%
  );
  animation-duration: 10s;
  animation-delay: -9s;
}
@keyframes apBlobDrift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(18px, -14px) scale(1.07);
  }
}

/* In-card topbar */
.ap-card-topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -8px;
}
.ap-steps-bottom {
  justify-content: center;
  padding-top: 8px;
  border-top: 1px solid rgba(124, 108, 168, 0.1);
  margin-top: -4px;
}
.ap-screen[data-dark="true"] .ap-steps-bottom {
  border-top-color: rgba(167, 139, 250, 0.1);
}

/* Card */
.ap-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 540px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(106, 176, 76, 0.22);
  border-radius: 28px;
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow:
    0 24px 64px rgba(60, 140, 60, 0.14),
    0 2px 8px rgba(60, 140, 60, 0.06);
  max-height: 92svh;
  overflow-y: auto;
  scrollbar-width: none;
}
.ap-card::-webkit-scrollbar {
  display: none;
}
.ap-screen[data-dark="true"] .ap-card {
  background: rgba(8, 22, 10, 0.9);
  border-color: rgba(106, 176, 76, 0.16);
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Header */
.ap-header {
  margin-top: -8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.ap-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(80, 150, 60, 0.65);
  margin: 0;
}
.ap-screen[data-dark="true"] .ap-eyebrow {
  color: rgba(140, 210, 100, 0.6);
}
.ap-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.3rem, 3.5vw, 1.75rem);
  font-weight: 700;
  color: #1a3d1a;
  margin: 0;
  line-height: 1.3;
}
.ap-screen[data-dark="true"] .ap-title {
  color: #d4f0d0;
}
.ap-sub {
  font-size: 0.82rem;
  color: rgba(40, 100, 40, 0.55);
  margin: 0;
}
.ap-screen[data-dark="true"] .ap-sub {
  color: rgba(140, 210, 100, 0.55);
}

/* Commitment input */
.ap-commitment-wrap {
  background: rgba(106, 176, 76, 0.07);
  border: 1.5px solid rgba(106, 176, 76, 0.22);
  border-radius: 18px;
  padding: 16px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.ap-commitment-wrap:focus-within {
  border-color: #6ab04c;
  box-shadow: 0 4px 18px rgba(106, 176, 76, 0.18);
}
.ap-screen[data-dark="true"] .ap-commitment-wrap {
  background: rgba(106, 176, 76, 0.06);
  border-color: rgba(106, 176, 76, 0.18);
}

.ap-prefix-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ap-target-icon {
  font-size: 1.1rem;
}
.ap-prefix {
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(60, 120, 40, 0.75);
  letter-spacing: 0.02em;
}
.ap-screen[data-dark="true"] .ap-prefix {
  color: rgba(140, 210, 100, 0.75);
}

.ap-textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: "Outfit", sans-serif;
  font-size: 0.9rem;
  color: #1a3d1a;
  resize: none;
  line-height: 1.75;
  caret-color: #6ab04c;
  border-bottom: 1.5px solid rgba(106, 176, 76, 0.2);
  padding-bottom: 6px;
  transition: border-color 0.2s;
}
.ap-textarea:focus {
  border-color: #6ab04c;
}
.ap-textarea::placeholder {
  color: rgba(40, 100, 40, 0.28);
  font-style: italic;
}
.ap-screen[data-dark="true"] .ap-textarea {
  color: #d4f0d0;
  caret-color: #8cd464;
  border-color: rgba(106, 176, 76, 0.2);
}
.ap-screen[data-dark="true"] .ap-textarea:focus {
  border-color: #8cd464;
}
.ap-screen[data-dark="true"] .ap-textarea::placeholder {
  color: rgba(140, 210, 100, 0.3);
}

.ap-char-count {
  font-size: 0.68rem;
  color: rgba(60, 120, 40, 0.38);
  text-align: right;
  font-family: "Outfit", sans-serif;
}

/* Checklist */
.ap-checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ap-check-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1.5px solid rgba(106, 176, 76, 0.2);
  background: rgba(106, 176, 76, 0.05);
  transition: all 0.22s ease;
}
.ap-check-label:hover {
  border-color: rgba(106, 176, 76, 0.4);
  background: rgba(106, 176, 76, 0.1);
}
.ap-check-label.checked {
  border-color: #6ab04c;
  background: rgba(106, 176, 76, 0.12);
  box-shadow: 0 4px 14px rgba(106, 176, 76, 0.2);
}
.ap-screen[data-dark="true"] .ap-check-label {
  border-color: rgba(106, 176, 76, 0.16);
  background: rgba(106, 176, 76, 0.05);
}
.ap-screen[data-dark="true"] .ap-check-label.checked {
  border-color: #8cd464;
  background: rgba(106, 176, 76, 0.1);
}

.ap-check-input {
  display: none;
}
.ap-check-box {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  border: 2px solid rgba(106, 176, 76, 0.35);
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.34, 1.3, 0.64, 1);
  color: white;
}
.ap-check-label.checked .ap-check-box {
  background: #6ab04c;
  border-color: #6ab04c;
  transform: scale(1.1);
}
.ap-screen[data-dark="true"] .ap-check-box {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(106, 176, 76, 0.3);
}
.ap-screen[data-dark="true"] .ap-check-label.checked .ap-check-box {
  background: #8cd464;
  border-color: #8cd464;
}

.ap-check-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(40, 100, 40, 0.8);
  line-height: 1.4;
}
.ap-screen[data-dark="true"] .ap-check-text {
  color: rgba(140, 210, 100, 0.85);
}
.ap-check-label.checked .ap-check-text {
  color: #3d7a28;
}
.ap-screen[data-dark="true"] .ap-check-label.checked .ap-check-text {
  color: #a4e07a;
}

/* Committed badge */
.ap-committed-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    rgba(106, 176, 76, 0.12) 0%,
    rgba(72, 187, 120, 0.12) 100%
  );
  border: 1px solid rgba(106, 176, 76, 0.25);
}
.ap-badge-icon {
  font-size: 1.3rem;
}
.ap-badge-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(40, 100, 40, 0.8);
  line-height: 1.4;
}
.ap-screen[data-dark="true"] .ap-badge-text {
  color: rgba(140, 210, 100, 0.85);
}

/* Hint */
.ap-hint {
  font-size: 0.75rem;
  font-style: italic;
  color: rgba(40, 100, 40, 0.4);
  text-align: center;
  margin: 0;
}
.ap-screen[data-dark="true"] .ap-hint {
  color: rgba(140, 210, 100, 0.4);
}

/* CTA */
.ap-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 28px;
  border-radius: 50px;
  background: linear-gradient(135deg, #4a9e2a 0%, #6ab04c 100%);
  color: white;
  border: none;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
  box-shadow: 0 6px 22px rgba(74, 158, 42, 0.38);
  letter-spacing: 0.02em;
}
.ap-cta-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(74, 158, 42, 0.48);
  filter: brightness(1.06);
}
.ap-cta-btn.ap-cta-committed {
  background: linear-gradient(135deg, #2d8a1a 0%, #5fa83e 50%, #48bb78 100%);
  box-shadow: 0 6px 28px rgba(74, 158, 42, 0.5);
  transform: scale(1.01);
}
.ap-cta-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ap-cta-icon {
  font-size: 1.1rem;
}
.ap-screen[data-dark="true"] .ap-cta-btn {
  background: linear-gradient(135deg, #3a8a1e 0%, #5fa03a 100%);
  box-shadow: 0 6px 22px rgba(58, 138, 30, 0.42);
}

/* Skip */
.ap-skip-btn {
  text-align: center;
  font-family: "Outfit", sans-serif;
  font-size: 0.72rem;
  color: rgba(40, 100, 40, 0.38);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
  padding: 4px;
  margin-top: -8px;
}
.ap-skip-btn:hover {
  color: rgba(40, 100, 40, 0.65);
}
.ap-screen[data-dark="true"] .ap-skip-btn {
  color: rgba(140, 210, 100, 0.38);
}

/* Transitions */
.ap-pop-enter-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.ap-pop-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
}

.ap-fade-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.ap-fade-leave-active {
  transition: opacity 0.2s ease;
}
.ap-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.ap-fade-leave-to {
  opacity: 0;
}
</style>
