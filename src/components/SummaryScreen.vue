<template>
  <div class="sm-screen" :data-dark="isDark">
    <!-- Confetti -->
    <div class="sm-confetti-wrap" v-if="showConfetti">
      <span
        v-for="i in 20"
        :key="i"
        class="sm-confetti"
        :style="getConfettiStyle(i)"
      ></span>
    </div>

    <!-- Ambient blobs -->
    <div class="sm-ambient">
      <div class="sm-blob sm-blob-1"></div>
      <div class="sm-blob sm-blob-2"></div>
      <div class="sm-blob sm-blob-3"></div>
    </div>

    <Transition name="sm-pop" appear>
      <div class="sm-card">
        <!-- In-card top bar -->
        <div class="sm-card-topbar">
          <button
            class="sm-fixed-back"
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
          <img src="/logo.png" alt="Innerly" class="sm-fixed-logo" />
        </div>

        <!-- Hero -->
        <div class="sm-hero">
          <h1 class="sm-title">{{ t.title }}</h1>
          <p class="sm-sub">{{ t.sub }}</p>
        </div>

        <!-- AI Summary Box -->
        <div class="sm-ai-box">
          <div class="sm-ai-box-header">
            <span class="sm-ai-box-label">✨ {{ t.aiLabel }}</span>
            <button
              v-if="!aiLoading && !aiSummary"
              class="sm-ai-gen-btn"
              @click="generateSummary"
            >
              {{ t.aiGenBtn }}
            </button>
          </div>

          <div v-if="aiLoading" class="sm-ai-loading">
            <span class="sm-ai-spinner"></span>
            <span class="sm-ai-loading-text">{{ t.aiLoading }}</span>
          </div>

          <Transition name="sm-fade">
            <p v-if="aiSummary && !aiLoading" class="sm-ai-text">
              {{ aiSummary }}
            </p>
          </Transition>

          <p v-if="!aiSummary && !aiLoading" class="sm-ai-placeholder">
            {{ t.aiPlaceholder }}
          </p>
        </div>

        <!-- Recap sections -->
        <div class="sm-recap">
          <!-- Trigger -->
          <div class="sm-recap-item" v-if="data.trigger">
            <div class="sm-recap-label">
              <span>🌱</span> {{ t.labelTrigger }}
            </div>
            <div class="sm-recap-text">{{ data.trigger }}</div>
          </div>

          <!-- Mood -->
          <div class="sm-recap-item" v-if="data.mood">
            <div class="sm-recap-label"><span>💜</span> {{ t.labelMood }}</div>
            <div class="sm-recap-text">
              {{ data.moodEmoji }} {{ data.mood }}
            </div>
          </div>

          <!-- Evaluation -->
          <div class="sm-recap-two-col" v-if="data.wentWell || data.needsWork">
            <div class="sm-recap-mini" v-if="data.wentWell">
              <div class="sm-recap-label">
                <span>✅</span> {{ t.labelWentWell }}
              </div>
              <div class="sm-recap-text">{{ data.wentWell }}</div>
            </div>
            <div class="sm-recap-mini" v-if="data.needsWork">
              <div class="sm-recap-label">
                <span>🔧</span> {{ t.labelNeedsWork }}
              </div>
              <div class="sm-recap-text">{{ data.needsWork }}</div>
            </div>
          </div>

          <!-- Insight -->
          <div class="sm-recap-item" v-if="data.insight">
            <div class="sm-recap-label">
              <span>💡</span> {{ t.labelInsight }}
            </div>
            <div class="sm-recap-text">{{ data.insight }}</div>
          </div>

          <!-- Action Plan -->
          <div class="sm-action-box" v-if="data.action">
            <div class="sm-action-label">
              <span>🎯</span> {{ t.labelAction }}
            </div>
            <div class="sm-action-text">
              {{ t.actionPrefix }} {{ data.action }}
            </div>
            <div class="sm-committed-tag" v-if="data.committed">
              ✅ {{ t.committedTag }}
            </div>
          </div>
        </div>

        <!-- Save Reminder -->
        <Transition name="sm-fade">
          <button
            v-if="data.action && data.committed && !savedToast"
            class="sm-save-btn"
            @click="handleSave"
          >
            🔔 {{ t.saveBtn }}
          </button>
        </Transition>
        <Transition name="sm-fade">
          <div v-if="savedToast" class="sm-toast">{{ t.savedToast }}</div>
        </Transition>

        <!-- Footer actions -->
        <div class="sm-footer">
          <button class="sm-btn-new" @click="$emit('new')">
            ✨ {{ t.newBtn }}
          </button>
          <button class="sm-btn-dash" @click="$emit('done')">
            {{ t.dashBtn }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const GEMINI_API_KEY = "AIzaSyA7cseaDc0-Q1u50PtYKMcaDwHfzyS5Z6g";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const props = defineProps({
  isDark: Boolean,
  lang: { type: String, default: "en" },
  data: {
    type: Object,
    default: () => ({
      trigger: "",
      mood: "",
      moodEmoji: "",
      wentWell: "",
      needsWork: "",
      insight: "",
      action: "",
      committed: false,
    }),
  },
});

const emit = defineEmits(["done", "new"]);

const i18n = {
  en: {
    title: "Reflection Complete!",
    sub: "You're one step further today. Be proud of yourself! 🙌",
    aiLabel: "Caly Summary",
    aiGenBtn: "Generate",
    aiLoading: "Caly is reading your reflection…",
    aiPlaceholder:
      "Click Generate to get a personalized summary of your reflection.",
    labelTrigger: "What was reflected",
    labelMood: "Feelings at the time",
    labelWentWell: "What went well",
    labelNeedsWork: "What needs improvement",
    labelInsight: "Insight",
    labelAction: "Tomorrow's commitment",
    actionPrefix: "Tomorrow, I will",
    committedTag: "You are committed!",
    saveBtn: "Save as tomorrow's reminder",
    savedToast: "🔔 Reminder saved! Check tomorrow.",
    newBtn: "Start a new reflection",
    dashBtn: "← Back to Dashboard",
    aiSystemPrompt: `You are a warm and wise journaling companion. The user has just completed a Gibbs' Reflective Cycle session. Write a SHORT, personal, encouraging summary (3-5 sentences max) of their reflection. Speak directly to them ("you"), highlight their self-awareness, and end with a gentle encouragement. Do NOT use bullet points or markdown. Use warm, human English.`,
    aiUserPrompt: (d) => `Here is what the user reflected on today:

${d.trigger ? `What happened: ${d.trigger}` : ""}
${d.mood ? `How they felt: ${d.moodEmoji} ${d.mood}` : ""}
${d.wentWell ? `What went well: ${d.wentWell}` : ""}
${d.needsWork ? `What could improve: ${d.needsWork}` : ""}
${d.insight ? `Their insight: ${d.insight}` : ""}
${d.action ? `Their commitment for tomorrow: ${d.action}` : ""}

Please write a warm, personal summary for them.`,
  },
  id: {
    title: "Refleksi Selesai!",
    sub: "Kamu sudah selangkah lebih maju hari ini. Bangga dengan dirimu! 🙌",
    aiLabel: "Ringkasan Caly",
    aiGenBtn: "Buat Ringkasan",
    aiLoading: "Caly sedang membaca refleksimu…",
    aiPlaceholder:
      "Klik 'Buat Ringkasan' untuk mendapat ringkasan personal dari refleksimu.",
    labelTrigger: "Apa yang direfleksikan",
    labelMood: "Perasaan saat itu",
    labelWentWell: "Yang berjalan baik",
    labelNeedsWork: "Yang perlu diperbaiki",
    labelInsight: "Insight",
    labelAction: "Komitmen besok",
    actionPrefix: "Besok, aku akan",
    committedTag: "Kamu sudah berkomitmen!",
    saveBtn: "Simpan sebagai pengingat besok",
    savedToast: "🔔 Pengingat disimpan! Cek besok ya.",
    newBtn: "Mulai refleksi baru",
    dashBtn: "← Kembali ke Dashboard",
    aiSystemPrompt: `Kamu adalah teman jurnal yang hangat dan bijaksana. Pengguna baru saja menyelesaikan sesi Siklus Reflektif Gibbs. Tulis RINGKASAN SINGKAT yang personal dan menyemangati (maksimal 3-5 kalimat) dari refleksi mereka. Bicara langsung kepada mereka ("kamu"), soroti kesadaran diri mereka, dan akhiri dengan dorongan semangat yang lembut. JANGAN gunakan bullet point atau markdown. Gunakan bahasa Indonesia yang hangat dan manusiawi.`,
    aiUserPrompt: (d) => `Ini adalah apa yang direfleksikan pengguna hari ini:

${d.trigger ? `Apa yang terjadi: ${d.trigger}` : ""}
${d.mood ? `Perasaan mereka: ${d.moodEmoji} ${d.mood}` : ""}
${d.wentWell ? `Yang berjalan baik: ${d.wentWell}` : ""}
${d.needsWork ? `Yang perlu diperbaiki: ${d.needsWork}` : ""}
${d.insight ? `Insight mereka: ${d.insight}` : ""}
${d.action ? `Komitmen mereka untuk besok: ${d.action}` : ""}

Tolong tulis ringkasan yang hangat dan personal untuk mereka.`,
  },
};

const t = computed(() => i18n[props.lang] ?? i18n.en);

const aiSummary = ref("");
const aiLoading = ref(false);
const savedToast = ref(false);
const showConfetti = ref(true);

onMounted(() => {
  generateSummary();
  setTimeout(() => (showConfetti.value = false), 10000);
});

async function generateSummary() {
  aiLoading.value = true;
  aiSummary.value = "";
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: t.value.aiSystemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: t.value.aiUserPrompt(props.data) }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.85,
        },
      }),
    });
    const json = await res.json();
    aiSummary.value =
      json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch {
    aiSummary.value = "";
  } finally {
    aiLoading.value = false;
  }
}

function handleSave() {
  savedToast.value = true;
  setTimeout(() => (savedToast.value = false), 3500);
}

function getConfettiStyle(i) {
  const colors = [
    "#7c6ca8",
    "#c084fc",
    "#6ab04c",
    "#f5a623",
    "#e67e22",
    "#48bb78",
    "#f39c12",
  ];
  const x = 5 + ((i * 61) % 90);
  const delay = (i * 0.18) % 2.5;
  const dur = 2.5 + (i % 4) * 0.4;
  const size = 6 + (i % 5) * 2;
  return {
    left: `${x}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: colors[i % colors.length],
    animationDuration: `${dur}s`,
    animationDelay: `${delay}s`,
  };
}
</script>

<style scoped>
.sm-fixed-back {
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
.sm-fixed-back:hover {
  background: rgba(124, 108, 168, 0.1);
  color: rgba(100, 80, 140, 0.9);
}
.sm-screen[data-dark="true"] .sm-fixed-back {
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
.sm-screen[data-dark="true"] .sm-fixed-back:hover {
  background: rgba(167, 139, 250, 0.1);
  color: rgba(167, 139, 250, 0.9);
}
.sm-fixed-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(124, 108, 168, 0.25));
}
.sm-fixed-steps {
  display: flex;
  gap: 5px;
  align-items: center;
}
.sm-fixed-step {
  height: 4px;
  width: 36px;
  border-radius: 3px;
  background: rgba(124, 108, 168, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.sm-fixed-step.done {
  background: rgba(124, 108, 168, 0.45);
}
.sm-fixed-step.done.active {
  background: #7c6ca8;
  width: 52px;
  box-shadow: 0 0 8px rgba(124, 108, 168, 0.4);
}
.sm-screen[data-dark="true"] .sm-fixed-step {
  background: rgba(167, 139, 250, 0.12);
}
.sm-screen[data-dark="true"] .sm-fixed-step.done {
  background: rgba(167, 139, 250, 0.38);
}
.sm-screen[data-dark="true"] .sm-fixed-step.done.active {
  background: #a78bfa;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.45);
}

.sm-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 5000;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 30%,
    #f0ebff 0%,
    #ddd4f8 50%,
    #cbbff0 100%
  );
}
.sm-screen[data-dark="true"] {
  background: radial-gradient(
    ellipse at 50% 30%,
    #0e0b1f 0%,
    #070412 60%,
    #030210 100%
  );
}

/* Confetti */
.sm-confetti-wrap {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}
.sm-confetti {
  position: absolute;
  top: -12px;
  border-radius: 3px;
  animation: smConfettiFall linear forwards;
  opacity: 0.9;
}
@keyframes smConfettiFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}

/* Ambient blobs */
.sm-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.sm-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  animation: smBlobDrift ease-in-out infinite alternate;
}
.sm-blob-1 {
  width: 420px;
  height: 280px;
  top: -12%;
  left: -14%;
  background: radial-gradient(
    ellipse,
    rgba(192, 132, 252, 0.25) 0%,
    transparent 70%
  );
  animation-duration: 13s;
}
.sm-blob-2 {
  width: 320px;
  height: 240px;
  bottom: -8%;
  right: -10%;
  background: radial-gradient(
    ellipse,
    rgba(245, 166, 35, 0.18) 0%,
    transparent 70%
  );
  animation-duration: 16s;
  animation-delay: -7s;
}
.sm-blob-3 {
  width: 260px;
  height: 210px;
  top: 35%;
  left: 55%;
  background: radial-gradient(
    ellipse,
    rgba(106, 176, 76, 0.16) 0%,
    transparent 70%
  );
  animation-duration: 11s;
  animation-delay: -10s;
}
@keyframes smBlobDrift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(20px, -16px) scale(1.08);
  }
}

/* In-card topbar */
.sm-card-topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -8px;
}
.sm-steps-bottom {
  justify-content: center;
  padding-top: 8px;
  border-top: 1px solid rgba(124, 108, 168, 0.1);
  margin-top: -4px;
}
.sm-screen[data-dark="true"] .sm-steps-bottom {
  border-top-color: rgba(167, 139, 250, 0.1);
}

/* Card */
.sm-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 560px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(140, 110, 200, 0.2);
  border-radius: 30px;
  padding: 36px 36px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow:
    0 28px 72px rgba(80, 60, 140, 0.18),
    0 2px 10px rgba(80, 60, 140, 0.08);
  max-height: 92svh;
  overflow-y: auto;
  scrollbar-width: none;
}
.sm-card::-webkit-scrollbar {
  display: none;
}
.sm-screen[data-dark="true"] .sm-card {
  background: rgba(14, 10, 30, 0.92);
  border-color: rgba(167, 139, 250, 0.16);
  box-shadow:
    0 28px 72px rgba(0, 0, 0, 0.55),
    0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Hero */
.sm-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}
.sm-hero-icon {
  font-size: 2.2rem;
  animation: smStarPop 0.6s cubic-bezier(0.34, 1.5, 0.64, 1) forwards;
}
@keyframes smStarPop {
  from {
    transform: scale(0) rotate(-30deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
.sm-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: #2d1f6e;
  margin: 0;
  line-height: 1.2;
}
.sm-screen[data-dark="true"] .sm-title {
  color: #ede0ff;
}
.sm-sub {
  font-size: 0.85rem;
  color: rgba(74, 55, 130, 0.6);
  margin: 0;
  font-family: "Outfit", sans-serif;
}
.sm-screen[data-dark="true"] .sm-sub {
  color: rgba(190, 165, 255, 0.65);
}

/* AI Summary Box */
.sm-ai-box {
  background: linear-gradient(
    135deg,
    rgba(140, 110, 200, 0.08) 0%,
    rgba(192, 132, 252, 0.08) 100%
  );
  border: 1.5px solid rgba(140, 110, 200, 0.22);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 72px;
}
.sm-screen[data-dark="true"] .sm-ai-box {
  background: rgba(167, 139, 250, 0.07);
  border-color: rgba(167, 139, 250, 0.2);
}

.sm-ai-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sm-ai-box-label {
  font-family: "Outfit", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(120, 90, 180, 0.7);
}
.sm-screen[data-dark="true"] .sm-ai-box-label {
  color: rgba(190, 165, 255, 0.7);
}

.sm-ai-gen-btn {
  font-family: "Outfit", sans-serif;
  font-size: 0.76rem;
  font-weight: 600;
  color: #7c6ca8;
  background: rgba(124, 108, 168, 0.1);
  border: 1px solid rgba(124, 108, 168, 0.25);
  border-radius: 20px;
  padding: 5px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sm-ai-gen-btn:hover {
  background: rgba(124, 108, 168, 0.18);
  border-color: rgba(124, 108, 168, 0.4);
  transform: translateY(-1px);
}

.sm-ai-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sm-ai-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(124, 108, 168, 0.2);
  border-top-color: #7c6ca8;
  border-radius: 50%;
  animation: smSpin 0.8s linear infinite;
  flex-shrink: 0;
}
@keyframes smSpin {
  to {
    transform: rotate(360deg);
  }
}
.sm-ai-loading-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
  color: rgba(100, 80, 150, 0.6);
  font-style: italic;
}
.sm-screen[data-dark="true"] .sm-ai-loading-text {
  color: rgba(190, 165, 255, 0.6);
}

.sm-ai-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  line-height: 1.75;
  color: #2d1f6e;
  margin: 0;
}
.sm-screen[data-dark="true"] .sm-ai-text {
  color: rgba(220, 205, 255, 0.9);
}

.sm-ai-placeholder {
  font-family: "Outfit", sans-serif;
  font-size: 0.8rem;
  color: rgba(100, 80, 150, 0.38);
  font-style: italic;
  margin: 0;
}
.sm-screen[data-dark="true"] .sm-ai-placeholder {
  color: rgba(167, 139, 250, 0.35);
}

/* Recap */
.sm-recap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sm-recap-item {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(124, 108, 168, 0.12);
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sm-screen[data-dark="true"] .sm-recap-item {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(167, 139, 250, 0.1);
}
.sm-recap-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sm-recap-mini {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(124, 108, 168, 0.12);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sm-screen[data-dark="true"] .sm-recap-mini {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(167, 139, 250, 0.1);
}
.sm-recap-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: "Outfit", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(100, 80, 150, 0.55);
}
.sm-screen[data-dark="true"] .sm-recap-label {
  color: rgba(190, 165, 255, 0.5);
}
.sm-recap-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
  color: #2d1f6e;
  line-height: 1.5;
}
.sm-screen[data-dark="true"] .sm-recap-text {
  color: rgba(220, 205, 255, 0.85);
}

/* Action box */
.sm-action-box {
  background: linear-gradient(
    135deg,
    rgba(106, 176, 76, 0.1) 0%,
    rgba(72, 187, 120, 0.1) 100%
  );
  border: 1.5px solid rgba(106, 176, 76, 0.28);
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sm-action-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: "Outfit", sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(60, 120, 40, 0.6);
}
.sm-screen[data-dark="true"] .sm-action-label {
  color: rgba(140, 210, 100, 0.55);
}
.sm-action-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a3d1a;
  line-height: 1.5;
}
.sm-screen[data-dark="true"] .sm-action-text {
  color: rgba(180, 240, 150, 0.9);
}
.sm-committed-tag {
  font-family: "Outfit", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: #4a9e2a;
}
.sm-screen[data-dark="true"] .sm-committed-tag {
  color: #8cd464;
}

/* Save button */
.sm-save-btn {
  width: 100%;
  padding: 12px 24px;
  border-radius: 50px;
  background: rgba(124, 108, 168, 0.1);
  border: 1.5px dashed rgba(124, 108, 168, 0.35);
  color: #7c6ca8;
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.22s ease;
}
.sm-save-btn:hover {
  background: rgba(124, 108, 168, 0.16);
  border-color: rgba(124, 108, 168, 0.55);
  transform: translateY(-1px);
}
.sm-screen[data-dark="true"] .sm-save-btn {
  background: rgba(167, 139, 250, 0.08);
  border-color: rgba(167, 139, 250, 0.28);
  color: #a78bfa;
}

/* Toast */
.sm-toast {
  text-align: center;
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #4a9e2a;
  background: rgba(106, 176, 76, 0.12);
  border: 1px solid rgba(106, 176, 76, 0.25);
  border-radius: 12px;
  padding: 10px 16px;
}

/* Footer */
.sm-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
.sm-btn-new {
  width: 100%;
  padding: 13px 28px;
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
}
.sm-btn-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(124, 108, 168, 0.48);
  filter: brightness(1.06);
}
.sm-screen[data-dark="true"] .sm-btn-new {
  background: linear-gradient(135deg, #6c5ce7 0%, #a78bfa 100%);
}

.sm-btn-dash {
  width: 100%;
  padding: 11px 28px;
  border-radius: 50px;
  background: transparent;
  border: 1.5px solid rgba(124, 108, 168, 0.25);
  color: rgba(80, 60, 130, 0.65);
  font-family: "Outfit", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.22s ease;
}
.sm-btn-dash:hover {
  background: rgba(124, 108, 168, 0.07);
  border-color: rgba(124, 108, 168, 0.4);
  color: rgba(80, 60, 130, 0.9);
}
.sm-screen[data-dark="true"] .sm-btn-dash {
  border-color: rgba(167, 139, 250, 0.2);
  color: rgba(190, 165, 255, 0.55);
}

/* Transitions */
.sm-pop-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.sm-pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(24px);
}

.sm-fade-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.sm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.sm-fade-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.sm-fade-leave-to {
  opacity: 0;
}
</style>
