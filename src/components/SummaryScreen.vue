<template>
  <div class="sm-screen" :data-dark="isDark">
    <!-- Confetti -->
    <div class="sm-confetti-wrap" v-if="showConfetti">
      <span
        v-for="i in 60"
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

    <!-- PLANT REVEAL OVERLAY -->
    <Transition name="sm-plant-overlay">
      <div v-if="showPlantReveal" class="sm-plant-overlay">
        <div class="sm-plant-overlay-bg"></div>
        <div class="sm-plant-content">
          <!-- Tagline above plant -->
          <Transition name="sm-tagline-in" appear>
            <p v-if="plantTaglineVisible" class="sm-plant-tagline">
              {{ t.plantTagline }}
            </p>
          </Transition>

          <!-- Plant illustration -->
          <div class="sm-plant-wrap">
            <div class="sm-plant-scene">
              <!-- Plant image: slides up from behind the soil -->
              <img
                :src="`/${plantImageFile}`"
                :alt="plantType"
                class="sm-plant-img"
              />
              <!-- Soil sits on top, masking the bottom of the image -->
              <!-- <div class="sm-soil"><div class="sm-soil-inner"></div></div> -->
            </div>

            <!-- Sparkles -->
            <div class="sm-sparkle sm-sparkle-1">✦</div>
            <div class="sm-sparkle sm-sparkle-2">✧</div>
            <div class="sm-sparkle sm-sparkle-3">✦</div>
            <div class="sm-sparkle sm-sparkle-4">✧</div>
          </div>

          <!-- Text + button below plant -->
          <Transition name="sm-desc-in">
            <div v-if="plantDescVisible" class="sm-plant-desc-wrap">
              <p class="sm-plant-desc">
                {{ t.plantDesc }}
              </p>
              <Transition name="sm-btn-in">
                <button
                  v-if="plantBtnVisible"
                  class="sm-kebun-btn"
                  @click="handleKebun"
                >
                  {{ t.plantBtn }}
                </button>
              </Transition>
              <button class="sm-plant-skip" @click="closePlantReveal">
                {{ t.plantSkip }}
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

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
          <div class="sm-recap-item" v-if="data.trigger">
            <div class="sm-recap-label">
              <span>🌱</span> {{ t.labelTrigger }}
            </div>
            <div class="sm-recap-text">{{ data.trigger }}</div>
          </div>
          <div class="sm-recap-item" v-if="data.mood">
            <div class="sm-recap-label"><span>💜</span> {{ t.labelMood }}</div>
            <div class="sm-recap-text">
              {{ data.moodEmoji }} {{ data.mood }}
            </div>
          </div>
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
          <div class="sm-recap-item" v-if="data.insight">
            <div class="sm-recap-label">
              <span>💡</span> {{ t.labelInsight }}
            </div>
            <div class="sm-recap-text">{{ data.insight }}</div>
          </div>
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
          <button class="sm-btn-new" @click="handleSelesai">
            🌱 {{ t.selesaiBtn }}
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
import { commitmentService } from "../services/commitment.js";
import { authService } from "../services/auth.js";

const GEMINI_API_KEY = "AIzaSyBLut0UkrsMQe-dKbkTVh8QIUoDWDJTqig";
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

const emit = defineEmits(["done", "new", "show-auth"]);

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
    selesaiBtn: "Done & Save",
    dashBtn: "← Back to Dashboard",
    plantTagline: "One step toward a better you.",
    plantDesc:
      "Today's reflection has been planted. Don't let this progress fade. Create an Innerly account to watch your garden bloom over time.",
    plantBtn: "🌿 Save to My Garden",
    plantSkip: "Skip",
    aiSystemPrompt: `You are a warm and wise journaling companion. The user has just completed a Gibbs' Reflective Cycle session. Write a SHORT, personal, encouraging summary (3-5 sentences max) of their reflection. Speak directly to them ("you"), highlight their self-awareness, and end with a gentle encouragement. Do NOT use bullet points or markdown. Use warm, human English.`,
    aiUserPrompt: (d) =>
      `Here is what the user reflected on today:\n\n${d.trigger ? `What happened: ${d.trigger}` : ""}\n${d.mood ? `How they felt: ${d.moodEmoji} ${d.mood}` : ""}\n${d.wentWell ? `What went well: ${d.wentWell}` : ""}\n${d.needsWork ? `What could improve: ${d.needsWork}` : ""}\n${d.insight ? `Their insight: ${d.insight}` : ""}\n${d.action ? `Their commitment for tomorrow: ${d.action}` : ""}\n\nPlease write a warm, personal summary for them.`,
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
    selesaiBtn: "Selesai dan Simpan",
    dashBtn: "← Kembali ke Dashboard",
    plantTagline: "Satu langkah untuk kemajuan dirimu.",
    plantDesc:
      "Refleksimu hari ini sudah berhasil ditanam. Jangan biarkan progres ini hilang. Buat akun Innerly agar kamu bisa melihat kebunmu mekar dari waktu ke waktu.",
    plantBtn: "🌿 Simpan ke Kebunku",
    plantSkip: "Lewati",
    aiSystemPrompt: `Kamu adalah teman jurnal yang hangat dan bijaksana. Pengguna baru saja menyelesaikan sesi Siklus Reflektif Gibbs. Tulis RINGKASAN SINGKAT yang personal dan menyemangati (maksimal 3-5 kalimat) dari refleksi mereka. Bicara langsung kepada mereka ("kamu"), soroti kesadaran diri mereka, dan akhiri dengan dorongan semangat yang lembut. JANGAN gunakan bullet point atau markdown. Gunakan bahasa Indonesia yang hangat dan manusiawi.`,
    aiUserPrompt: (d) =>
      `Ini adalah apa yang direfleksikan pengguna hari ini:\n\n${d.trigger ? `Apa yang terjadi: ${d.trigger}` : ""}\n${d.mood ? `Perasaan mereka: ${d.moodEmoji} ${d.mood}` : ""}\n${d.wentWell ? `Yang berjalan baik: ${d.wentWell}` : ""}\n${d.needsWork ? `Yang perlu diperbaiki: ${d.needsWork}` : ""}\n${d.insight ? `Insight mereka: ${d.insight}` : ""}\n${d.action ? `Komitmen mereka untuk besok: ${d.action}` : ""}\n\nTolong tulis ringkasan yang hangat dan personal untuk mereka.`,
  },
};

const t = computed(() => i18n[props.lang] ?? i18n.en);

const aiSummary = ref("");
const aiLoading = ref(false);
const savedToast = ref(false);
const showConfetti = ref(true);

// Plant reveal state
const showPlantReveal = ref(false);
const plantTaglineVisible = ref(false);
const plantDescVisible = ref(false);
const plantBtnVisible = ref(false);

// Mood → plant type mapping
const moodImageMap = {
  Senang: "happy",
  Tenang: "calm",
  Bersemangat: "excited",
  Sedih: "sad",
  Cemas: "anxious",
  Frustrasi: "frustrated",
  Bingung: "confused",
  Lelah: "tired",
  Terharu: "touched",
  "Biasa aja": "so-so",
  Happy: "happy",
  Calm: "calm",
  Excited: "excited",
  Sad: "sad",
  Anxious: "anxious",
  Frustrated: "frustrated",
  Confused: "confused",
  Tired: "tired",
  Touched: "touched",
  "So-so": "so-so",
};

const plantType = computed(() => moodImageMap[props.data?.mood] || "happy");
const plantImageFile = computed(() => `${plantType.value}1.png`);

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
        system_instruction: { parts: [{ text: t.value.aiSystemPrompt }] },
        contents: [
          { role: "user", parts: [{ text: t.value.aiUserPrompt(props.data) }] },
        ],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.85 },
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

async function handleSave() {
  try {
    const user = authService.getUser && authService.getUser();
    if (user && user.id && props.data.action) {
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      await commitmentService.saveCommitment(user.id, {
        date: todayKey,
        action: props.data.action,
        moodImg: props.data.moodImg || "",
        mood: props.data.mood || "",
      });
    } else {
      // Fallback: simpan ke localStorage kalau belum login
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      localStorage.setItem("innerly_reminder", JSON.stringify({
        date: todayKey,
        action: props.data.action,
        moodImg: props.data.moodImg || "",
        mood: props.data.mood || "",
      }));
    }
  } catch (err) {
    console.error("Failed to save commitment:", err);
  }
  savedToast.value = true;
  setTimeout(() => (savedToast.value = false), 3500);
}

function handleSelesai() {
  showPlantReveal.value = true;
  setTimeout(() => {
    plantTaglineVisible.value = true;
  }, 400);
  setTimeout(() => {
    plantDescVisible.value = true;
  }, 1800);
  setTimeout(() => {
    plantBtnVisible.value = true;
  }, 2600);
}

function closePlantReveal() {
  showPlantReveal.value = false;
  plantTaglineVisible.value = false;
  plantDescVisible.value = false;
  plantBtnVisible.value = false;
}

function handleKebun() {
  emit("show-auth");
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

.sm-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  z-index: 5000;
  overflow-y: auto;
  overflow-x: hidden;
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

.sm-card-topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -8px;
}

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
  box-sizing: border-box;
  margin: auto;
}
.sm-screen[data-dark="true"] .sm-card {
  background: rgba(14, 10, 30, 0.92);
  border-color: rgba(167, 139, 250, 0.16);
  box-shadow:
    0 28px 72px rgba(0, 0, 0, 0.55),
    0 2px 10px rgba(0, 0, 0, 0.3);
}

.sm-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
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
  white-space: pre-wrap;
  word-break: break-word;
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

/* ── PLANT REVEAL OVERLAY ── */
.sm-plant-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.sm-plant-overlay-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 60%,
    #f5f0ff 0%,
    #e8dcff 40%,
    #d4c4f8 100%
  );
  backdrop-filter: blur(12px);
}
.sm-screen[data-dark="true"] .sm-plant-overlay-bg {
  background: radial-gradient(
    ellipse at 50% 60%,
    #0e0820 0%,
    #07041a 60%,
    #030210 100%
  );
}
.sm-plant-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
  text-align: center;
}
.sm-plant-tagline {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.1rem, 3.5vw, 1.4rem);
  font-weight: 700;
  color: #2d1f6e;
  margin: 0 0 16px 0;
  line-height: 1.4;
}
.sm-screen[data-dark="true"] .sm-plant-tagline {
  color: #e8d8ff;
}

.sm-plant-wrap {
  position: relative;
  width: 240px;
  height: 260px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden; /* clip the image as it rises */
}
.sm-plant-scene {
  position: relative;
  width: 200px;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
}

/* Plant image: grows up from behind the soil */
.sm-plant-img {
  position: absolute;
  bottom: 22px; /* overlaps soil so stem connects */
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  width: 180px;
  height: auto;
  object-fit: contain;
  z-index: 2;
  animation: smPlantRise 0.9s 0.2s cubic-bezier(0.34, 1.28, 0.64, 1) forwards;
}
@keyframes smPlantRise {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0%);
    opacity: 1;
  }
}

/* Sparkles */
.sm-sparkle {
  position: absolute;
  font-size: 18px;
  color: #c4b5fd;
  animation: smSparkle 1.8s ease-in-out infinite alternate;
  pointer-events: none;
}
.sm-sparkle-1 {
  top: 8px;
  left: 8px;
  animation-delay: 0s;
}
.sm-sparkle-2 {
  top: 20px;
  right: 4px;
  animation-delay: 0.4s;
  font-size: 13px;
}
.sm-sparkle-3 {
  bottom: 30px;
  left: 4px;
  animation-delay: 0.8s;
  font-size: 14px;
}
.sm-sparkle-4 {
  bottom: 50px;
  right: 8px;
  animation-delay: 1.2s;
  font-size: 10px;
}
@keyframes smSparkle {
  from {
    opacity: 0.3;
    transform: scale(0.8) rotate(-15deg);
  }
  to {
    opacity: 1;
    transform: scale(1.2) rotate(15deg);
  }
}

.sm-plant-desc-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding: 0 8px;
}
.sm-plant-desc {
  font-family: "Outfit", sans-serif;
  font-size: 0.9rem;
  line-height: 1.7;
  color: #3d2a7a;
  margin: 0;
  text-align: center;
  max-width: 340px;
}
.sm-screen[data-dark="true"] .sm-plant-desc {
  color: rgba(210, 190, 255, 0.85);
}

.sm-kebun-btn {
  padding: 14px 36px;
  border-radius: 50px;
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  color: white;
  border: none;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 8px 28px rgba(147, 51, 234, 0.38);
}
.sm-kebun-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 36px rgba(147, 51, 234, 0.5);
  filter: brightness(1.08);
}
.sm-kebun-btn:active {
  transform: translateY(-1px);
}

.sm-plant-skip {
  background: none;
  border: none;
  font-family: "Outfit", sans-serif;
  font-size: 0.78rem;
  color: rgba(100, 80, 160, 0.45);
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.sm-plant-skip:hover {
  color: rgba(100, 80, 160, 0.7);
}
.sm-screen[data-dark="true"] .sm-plant-skip {
  color: rgba(180, 160, 255, 0.35);
}

.sm-plant-overlay-enter-active {
  transition: opacity 0.5s ease;
}
.sm-plant-overlay-leave-active {
  transition: opacity 0.35s ease;
}
.sm-plant-overlay-enter-from,
.sm-plant-overlay-leave-to {
  opacity: 0;
}

.sm-tagline-in-enter-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.sm-tagline-in-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.sm-desc-in-enter-active {
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}
.sm-desc-in-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.sm-btn-in-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s cubic-bezier(0.34, 1.5, 0.64, 1);
}
.sm-btn-in-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
</style>