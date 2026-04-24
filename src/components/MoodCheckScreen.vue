<template>
  <div class="mc-screen" :data-dark="isDark">
    <!-- Ambient background blobs -->
    <div class="mc-ambient">
      <div class="mc-blob mc-blob-1"></div>
      <div class="mc-blob mc-blob-2"></div>
      <div class="mc-blob mc-blob-3"></div>
    </div>

    <!-- Floating particles -->
    <div class="mc-particles">
      <div
        v-for="i in 18"
        :key="i"
        class="mc-particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Main card -->
    <Transition name="mc-pop" appear>
      <div class="mc-card">
        <!-- Header -->
        <div class="mc-header">
          <img src="/logo.png" alt="Innerly" class="mc-logo" />
          <p class="mc-eyebrow">Check-in harian</p>
          <h1 class="mc-title">
            Gimana perasaanmu<br />
            <span class="mc-title-name">{{ greetingName }}</span> hari ini?
          </h1>
          <p class="mc-sub">Pilih yang paling cocok — tidak ada yang salah.</p>
        </div>

        <!-- Mood grid -->
        <div class="mc-mood-grid">
          <button
            v-for="m in moods"
            :key="m.label"
            class="mc-mood-btn"
            :class="{ selected: selectedMood === m.label }"
            :style="{ '--mc': m.color }"
            @click="selectMood(m.label)"
          >
            <span class="mc-mood-emoji">{{ m.emoji }}</span>
            <span class="mc-mood-label">{{ m.label }}</span>
            <div class="mc-mood-ring"></div>
          </button>
        </div>

        <!-- Note input (shows after mood selected) -->
        <Transition name="mc-slide">
          <div class="mc-note-wrap" v-if="selectedMood">
            <div class="mc-note-prompt">
              <span class="mc-note-emoji">{{ selectedMoodObj?.emoji }}</span>
              <span class="mc-note-text">
                Ada yang ingin kamu ceritakan tentang perasaan
                <strong>{{ selectedMood }}</strong>-mu?
              </span>
            </div>
            <textarea
              v-model="moodNote"
              class="mc-note-input"
              placeholder="Opsional — tulis bebas atau langsung lanjut..."
              rows="2"
            ></textarea>
          </div>
        </Transition>

        <!-- CTA button -->
        <Transition name="mc-slide">
          <button
            v-if="selectedMood"
            class="mc-cta-btn"
            @click="handleDone"
          >
            <span>Lanjut ke Dashboard</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </Transition>

        <!-- Skip link -->
        <button class="mc-skip-btn" @click="handleSkip">
          lewati untuk sekarang
        </button>

        <!-- Step indicator -->
        <div class="mc-step-bar">
          <div class="mc-step done"></div>
          <div class="mc-step done"></div>
          <div class="mc-step active"></div>
          <div class="mc-step"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isDark: Boolean,
  userName: { type: String, default: '' },
});
const emit = defineEmits(['done']);

const selectedMood = ref(null);
const moodNote = ref('');

const moods = [
  { emoji: '😊', label: 'Senang',   color: '#f5a623' },
  { emoji: '😌', label: 'Tenang',   color: '#6ab04c' },
  { emoji: '🤩', label: 'Bersemangat', color: '#f39c12' },
  { emoji: '😔', label: 'Sedih',    color: '#7c6ca8' },
  { emoji: '😰', label: 'Cemas',    color: '#e67e22' },
  { emoji: '😤', label: 'Frustrasi',color: '#e74c3c' },
  { emoji: '😕', label: 'Bingung',  color: '#3498db' },
  { emoji: '😴', label: 'Lelah',    color: '#95a5a6' },
  { emoji: '🥹', label: 'Terharu',  color: '#a78bfa' },
  { emoji: '😐', label: 'Biasa aja',color: '#7f8c8d' },
];

const greetingName = computed(() => {
  const h = new Date().getHours();
  const greet = h < 12 ? 'pagi' : h < 17 ? 'siang' : 'malam';
  return props.userName ? `${props.userName}` : `kamu`;
});

const selectedMoodObj = computed(() =>
  moods.find(m => m.label === selectedMood.value)
);

function selectMood(label) {
  selectedMood.value = label;
}

function handleDone() {
  emit('done', {
    mood: selectedMood.value,
    moodEmoji: selectedMoodObj.value?.emoji,
    moodColor: selectedMoodObj.value?.color,
    note: moodNote.value,
  });
}

function handleSkip() {
  emit('done', { mood: null, moodEmoji: null, moodColor: null, note: '' });
}

function getParticleStyle(i) {
  const x = 4 + ((i * 73) % 93);
  const y = 4 + ((i * 57) % 92);
  const dur = 4 + (i % 5) * 1.2;
  const delay = (i * 0.37) % 4.5;
  const size = 2 + (i % 4);
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${dur}s`,
    animationDelay: `${delay}s`,
  };
}
</script>

<style scoped>
/* ── Screen wrapper ── */
.mc-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 5000;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 35%, #ede8f5 0%, #d5ccec 50%, #c4b9e0 100%);
}
.mc-screen[data-dark="true"] {
  background: radial-gradient(ellipse at 50% 35%, #0d1520 0%, #060d17 60%, #020810 100%);
}

/* ── Ambient blobs ── */
.mc-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.mc-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: mcBlobDrift ease-in-out infinite alternate;
}
.mc-blob-1 {
  width: 380px; height: 260px;
  top: -8%; left: -10%;
  background: radial-gradient(ellipse, rgba(167,139,250,0.28) 0%, transparent 70%);
  animation-duration: 11s;
}
.mc-blob-2 {
  width: 300px; height: 220px;
  bottom: -5%; right: -8%;
  background: radial-gradient(ellipse, rgba(245,166,35,0.18) 0%, transparent 70%);
  animation-duration: 14s;
  animation-delay: -5s;
}
.mc-blob-3 {
  width: 240px; height: 200px;
  top: 45%; left: 55%;
  background: radial-gradient(ellipse, rgba(106,176,76,0.16) 0%, transparent 70%);
  animation-duration: 9s;
  animation-delay: -8s;
}
.mc-screen[data-dark="true"] .mc-blob-1 {
  background: radial-gradient(ellipse, rgba(108,92,231,0.22) 0%, transparent 70%);
}
.mc-screen[data-dark="true"] .mc-blob-2 {
  background: radial-gradient(ellipse, rgba(245,166,35,0.14) 0%, transparent 70%);
}
.mc-screen[data-dark="true"] .mc-blob-3 {
  background: radial-gradient(ellipse, rgba(106,176,76,0.12) 0%, transparent 70%);
}
@keyframes mcBlobDrift {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(18px,-14px) scale(1.07); }
}

/* ── Particles ── */
.mc-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.mc-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(124,108,168,0.55);
  box-shadow: 0 0 5px 2px rgba(124,108,168,0.3);
  animation: mcParticleFloat ease-in-out infinite;
}
.mc-screen[data-dark="true"] .mc-particle {
  background: rgba(167,139,250,0.6);
  box-shadow: 0 0 5px 2px rgba(167,139,250,0.4);
}
@keyframes mcParticleFloat {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  15%  { opacity: 0.9; }
  50%  { transform: translateY(-22px) scale(1.3); opacity: 0.7; }
  85%  { opacity: 0.3; }
  100% { transform: translateY(-48px) scale(0.5); opacity: 0; }
}

/* ── Card ── */
.mc-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 540px;
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(124,108,168,0.18);
  border-radius: 28px;
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  box-shadow: 0 24px 64px rgba(74,63,122,0.18), 0 2px 8px rgba(74,63,122,0.08);
  max-height: 92svh;
  overflow-y: auto;
  scrollbar-width: none;
}
.mc-card::-webkit-scrollbar { display: none; }
.mc-screen[data-dark="true"] .mc-card {
  background: rgba(13,26,39,0.88);
  border-color: rgba(167,139,250,0.14);
  box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
}

/* ── Header ── */
.mc-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.mc-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(124,108,168,0.3));
}
.mc-eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(124,108,168,0.65);
  margin: 0;
}
.mc-screen[data-dark="true"] .mc-eyebrow {
  color: rgba(167,139,250,0.6);
}
.mc-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.4rem, 3.5vw, 1.85rem);
  font-weight: 700;
  color: #2d2460;
  margin: 0;
  line-height: 1.3;
}
.mc-screen[data-dark="true"] .mc-title {
  color: #e8e0f8;
}
.mc-title-name {
  background: linear-gradient(135deg, #7c6ca8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.mc-sub {
  font-size: 0.82rem;
  color: rgba(74,63,122,0.55);
  margin: 0;
}
.mc-screen[data-dark="true"] .mc-sub {
  color: rgba(167,139,250,0.55);
}

/* ── Mood grid ── */
.mc-mood-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.mc-mood-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 14px 6px 12px;
  border-radius: 16px;
  border: 2px solid rgba(124,108,168,0.15);
  background: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.34,1.2,0.64,1);
  overflow: hidden;
}
.mc-screen[data-dark="true"] .mc-mood-btn {
  background: rgba(255,255,255,0.04);
  border-color: rgba(167,139,250,0.14);
}
.mc-mood-btn:hover {
  border-color: var(--mc);
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--mc) 22%, transparent);
}
.mc-mood-btn.selected {
  border-color: var(--mc);
  background: color-mix(in srgb, var(--mc) 14%, transparent);
  transform: translateY(-3px) scale(1.06);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--mc) 28%, transparent);
}
.mc-mood-ring {
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  border: 2.5px solid transparent;
  transition: border-color 0.2s;
  pointer-events: none;
}
.mc-mood-btn.selected .mc-mood-ring {
  border-color: var(--mc);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mc) 30%, transparent);
}
.mc-mood-emoji {
  font-size: 1.65rem;
  line-height: 1;
  transition: transform 0.2s cubic-bezier(0.34,1.5,0.64,1);
}
.mc-mood-btn.selected .mc-mood-emoji,
.mc-mood-btn:hover .mc-mood-emoji {
  transform: scale(1.2);
}
.mc-mood-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.64rem;
  font-weight: 600;
  color: rgba(74,63,122,0.65);
  white-space: nowrap;
  transition: color 0.2s;
}
.mc-screen[data-dark="true"] .mc-mood-label {
  color: rgba(167,139,250,0.7);
}
.mc-mood-btn.selected .mc-mood-label {
  color: var(--mc);
}

/* ── Note input ── */
.mc-note-wrap {
  background: rgba(124,108,168,0.07);
  border: 1px solid rgba(124,108,168,0.14);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mc-screen[data-dark="true"] .mc-note-wrap {
  background: rgba(167,139,250,0.06);
  border-color: rgba(167,139,250,0.12);
}
.mc-note-prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: rgba(74,63,122,0.7);
}
.mc-screen[data-dark="true"] .mc-note-prompt {
  color: rgba(167,139,250,0.75);
}
.mc-note-emoji {
  font-size: 1.1rem;
  flex-shrink: 0;
}
.mc-note-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  color: #2d2460;
  resize: none;
  line-height: 1.65;
  caret-color: #7c6ca8;
}
.mc-screen[data-dark="true"] .mc-note-input {
  color: #e8e0f8;
  caret-color: #a78bfa;
}
.mc-note-input::placeholder {
  color: rgba(100,80,140,0.32);
  font-style: italic;
}
.mc-screen[data-dark="true"] .mc-note-input::placeholder {
  color: rgba(167,139,250,0.38);
}

/* ── CTA Button ── */
.mc-cta-btn {
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
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 6px 22px rgba(124,108,168,0.38);
  letter-spacing: 0.02em;
}
.mc-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(124,108,168,0.48);
  filter: brightness(1.06);
}
.mc-cta-btn:active {
  transform: translateY(0);
}
.mc-screen[data-dark="true"] .mc-cta-btn {
  background: linear-gradient(135deg, #6c5ce7 0%, #a78bfa 100%);
  box-shadow: 0 6px 22px rgba(108,92,231,0.42);
}

/* ── Skip button ── */
.mc-skip-btn {
  text-align: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem;
  color: rgba(100,80,140,0.38);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
  padding: 4px;
  margin-top: -10px;
}
.mc-skip-btn:hover {
  color: rgba(100,80,140,0.65);
}
.mc-screen[data-dark="true"] .mc-skip-btn {
  color: rgba(167,139,250,0.38);
}
.mc-screen[data-dark="true"] .mc-skip-btn:hover {
  color: rgba(167,139,250,0.65);
}

/* ── Step bar ── */
.mc-step-bar {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: -8px;
}
.mc-step {
  width: 22px;
  height: 4px;
  border-radius: 2px;
  background: rgba(124,108,168,0.15);
  transition: all 0.3s ease;
}
.mc-step.done {
  background: rgba(124,108,168,0.4);
}
.mc-step.active {
  background: #7c6ca8;
  width: 36px;
}
.mc-screen[data-dark="true"] .mc-step { background: rgba(167,139,250,0.12); }
.mc-screen[data-dark="true"] .mc-step.done { background: rgba(167,139,250,0.35); }
.mc-screen[data-dark="true"] .mc-step.active { background: #a78bfa; }

/* ── Transitions ── */
.mc-pop-enter-active {
  transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.2,0.64,1);
}
.mc-pop-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
}

.mc-slide-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mc-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mc-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.mc-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
