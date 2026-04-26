<template>
  <div class="gj-wrap">
    <!-- Progress bar -->
    <div class="gj-progress-bar">
      <div class="gj-progress-fill" :style="{ width: progressPct + '%' }"></div>
    </div>

    <!-- Step indicators -->
    <div class="gj-steps">
      <div
        v-for="(s, i) in steps"
        :key="i"
        class="gj-step-dot"
        :class="{
          active: currentStep === i,
          done: currentStep > i,
        }"
        @click="currentStep > i ? (currentStep = i) : null"
        :title="s.title"
      >
        <span v-if="currentStep > i" class="gj-dot-check">✓</span>
        <span v-else>{{ i + 1 }}</span>
      </div>
    </div>

    <!-- ═══════ LAYER 1: THE TRIGGER ═══════ -->
    <Transition name="gj-slide" mode="out-in">
      <div v-if="currentStep === 0" key="step0" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">{{ t.step1tag }}</span>
          <span class="gj-layer-emoji">🌱</span>
        </div>
        <h2 class="gj-question">{{ t.step1q }}</h2>
        <p class="gj-hint">{{ t.step1hint }}</p>
        <textarea
          v-model="answers.trigger"
          class="gj-textarea"
          :placeholder="t.step1ph"
          rows="5"
          autofocus
        ></textarea>
        <div class="gj-char-count">
          {{ t.step1chars(answers.trigger.length) }}
        </div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="$emit('back')">
            {{ t.step1back }}
          </button>
          <button
            class="gj-btn-next"
            :disabled="answers.trigger.trim().length < 5"
            @click="currentStep = 1"
          >
            {{ t.step2selected ? "" : "" }}Lanjut
            <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 2: THE MOOD ═══════ -->
      <div v-else-if="currentStep === 1" key="step1" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">{{ t.step2tag }}</span>
          <span class="gj-layer-emoji">💜</span>
        </div>
        <h2 class="gj-question">{{ t.step2q }}</h2>
        <p class="gj-hint">{{ t.step2hint }}</p>
        <div class="gj-mood-grid">
          <button
            v-for="m in moodOptions"
            :key="m.label"
            class="gj-mood-btn"
            :class="{ selected: answers.moods.includes(m.label) }"
            :style="{ '--mc': m.color }"
            @click="toggleMood(m.label)"
          >
            <span class="gj-mood-emoji">{{ m.emoji }}</span>
            <span class="gj-mood-label">{{ m.label }}</span>
          </button>
        </div>
        <div class="gj-mood-selected" v-if="answers.moods.length > 0">
          <span class="gj-mood-selected-label">{{ t.step2selected }}</span>
          <span v-for="m in answers.moods" :key="m" class="gj-mood-tag"
            >{{ moodOptions.find((x) => x.label === m)?.emoji }} {{ m }}</span
          >
        </div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 0">
            {{ t.step2back }}
          </button>
          <button
            class="gj-btn-next"
            :disabled="answers.moods.length === 0"
            @click="currentStep = 2"
          >
            {{ t.step2selected ? "" : "" }}Lanjut
            <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 3: THE EVALUATION ═══════ -->
      <div v-else-if="currentStep === 2" key="step2" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">{{ t.step3tag }}</span>
          <span class="gj-layer-emoji">⚖️</span>
        </div>
        <h2 class="gj-question">{{ t.step3q }}</h2>
        <p class="gj-hint">{{ t.step3hint }}</p>
        <div class="gj-two-cols">
          <div class="gj-col gj-col-good">
            <div class="gj-col-header">
              <span class="gj-col-icon">✅</span>
              <span class="gj-col-title">{{ t.step3good }}</span>
            </div>
            <textarea
              v-model="answers.wentWell"
              class="gj-textarea gj-textarea-sm"
              :placeholder="t.step3goodph"
              rows="4"
            ></textarea>
          </div>
          <div class="gj-col gj-col-improve">
            <div class="gj-col-header">
              <span class="gj-col-icon">🔧</span>
              <span class="gj-col-title">{{ t.step3improve }}</span>
            </div>
            <textarea
              v-model="answers.improve"
              class="gj-textarea gj-textarea-sm"
              :placeholder="t.step3improveph"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 1">
            {{ t.step3back }}
          </button>
          <button
            class="gj-btn-next"
            :disabled="
              answers.wentWell.trim().length < 3 &&
              answers.improve.trim().length < 3
            "
            @click="currentStep = 3"
          >
            {{ t.step2selected ? "" : "" }}Lanjut
            <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 4: THE INSIGHT ═══════ -->
      <div v-else-if="currentStep === 3" key="step3" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">{{ t.step4tag }}</span>
          <span class="gj-layer-emoji">💡</span>
        </div>
        <h2 class="gj-question">{{ t.step4q }}</h2>
        <p class="gj-hint">{{ t.step4hint }}</p>
        <textarea
          v-model="answers.insight"
          class="gj-textarea"
          :placeholder="t.step4ph"
          rows="5"
        ></textarea>
        <button
          class="gj-ai-btn"
          @click="fetchAiSuggestion"
          :disabled="aiLoading"
        >
          <span v-if="aiLoading" class="gj-ai-spinner">⟳</span>
          <span v-else>✨</span>
          {{ aiLoading ? t.aiLoading : t.aiBtn }}
        </button>
        <Transition name="gj-fade">
          <div v-if="aiSuggestion" class="gj-ai-suggestion">
            <div class="gj-ai-suggestion-header">
              <span>{{ t.aiHeader }}</span>
              <button class="gj-ai-close" @click="aiSuggestion = ''">
                &times;
              </button>
            </div>
            <p class="gj-ai-suggestion-text">{{ aiSuggestion }}</p>
            <button
              class="gj-ai-use-btn"
              @click="
                answers.insight = answers.insight
                  ? answers.insight + '\n\n' + aiSuggestion
                  : aiSuggestion;
                aiSuggestion = '';
              "
            >
              {{ t.aiUsebtn }}
            </button>
          </div>
        </Transition>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 2">
            {{ t.step4back }}
          </button>
          <button
            class="gj-btn-next"
            :disabled="answers.insight.trim().length < 5"
            @click="currentStep = 4"
          >
            {{ t.step2selected ? "" : "" }}Lanjut
            <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 5: THE ACTION PLAN ═══════ -->
      <div v-else-if="currentStep === 4" key="step4" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">{{ t.step5tag }}</span>
          <span class="gj-layer-emoji">🎯</span>
        </div>
        <h2 class="gj-question">{{ t.step5q }}</h2>
        <p class="gj-hint">{{ t.step5hint }}</p>
        <div class="gj-commitment-wrap">
          <span class="gj-commitment-prefix">{{ t.step5prefix }}</span>
          <textarea
            v-model="answers.action"
            class="gj-textarea gj-textarea-commitment"
            :placeholder="t.step5ph"
            rows="3"
          ></textarea>
        </div>
        <div class="gj-checklist" v-if="answers.action.trim().length > 0">
          <div class="gj-checklist-item">
            <input
              type="checkbox"
              v-model="actionCommitted"
              id="commit-check"
              class="gj-check-input"
            />
            <label for="commit-check" class="gj-check-label">
              {{ t.step5commit }}
            </label>
          </div>
        </div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 3">
            {{ t.step5back }}
          </button>
          <button
            class="gj-btn-next gj-btn-finish"
            :disabled="answers.action.trim().length < 5"
            @click="finishReflection"
          >
            {{ t.step5finish }}
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 6: THE SUMMARY ═══════ -->
      <div
        v-else-if="currentStep === 5"
        key="step5"
        class="gj-card gj-summary-card"
      >
        <div class="gj-confetti-wrap">
          <span
            v-for="i in 12"
            :key="i"
            class="gj-confetti-piece"
            :style="getConfettiStyle(i)"
          ></span>
        </div>
        <div class="gj-summary-hero">
          <div class="gj-summary-icon">🌟</div>
          <h2 class="gj-summary-title">{{ t.sumTitle }}</h2>
          <p class="gj-summary-sub">{{ t.sumSub }}</p>
        </div>

        <div class="gj-summary-body">
          <div class="gj-summary-section" v-if="answers.trigger">
            <div class="gj-summary-section-label">{{ t.sum1label }}</div>
            <div class="gj-summary-section-text">{{ answers.trigger }}</div>
          </div>
          <div class="gj-summary-section" v-if="answers.moods.length">
            <div class="gj-summary-section-label">{{ t.sum2label }}</div>
            <div class="gj-summary-moods-row">
              <span
                v-for="m in answers.moods"
                :key="m"
                class="gj-summary-mood-tag"
              >
                {{ moodOptions.find((x) => x.label === m)?.emoji }} {{ m }}
              </span>
            </div>
          </div>
          <div
            class="gj-summary-two-col"
            v-if="answers.wentWell || answers.improve"
          >
            <div class="gj-summary-mini" v-if="answers.wentWell">
              <div class="gj-summary-section-label">{{ t.sum3good }}</div>
              <div class="gj-summary-section-text">{{ answers.wentWell }}</div>
            </div>
            <div class="gj-summary-mini" v-if="answers.improve">
              <div class="gj-summary-section-label">{{ t.sum3improve }}</div>
              <div class="gj-summary-section-text">{{ answers.improve }}</div>
            </div>
          </div>
          <div class="gj-summary-section" v-if="answers.insight">
            <div class="gj-summary-section-label">{{ t.sum4label }}</div>
            <div class="gj-summary-section-text">{{ answers.insight }}</div>
          </div>
          <div class="gj-summary-action-box" v-if="answers.action">
            <div class="gj-summary-action-label">{{ t.sum5label }}</div>
            <div class="gj-summary-action-text">
              {{ t.sum5prefix }} {{ answers.action }}
            </div>
            <div class="gj-summary-committed" v-if="actionCommitted">
              <span>{{ t.sumCommitted }}</span>
            </div>
          </div>
        </div>

        <div class="gj-summary-actions">
          <button
            class="gj-btn-save"
            @click="saveReminder"
            v-if="answers.action && actionCommitted"
          >
            {{ t.sumSave }}
          </button>
          <button class="gj-btn-new" @click="startNew">
            {{ t.sumNew }}
          </button>
          <button class="gj-btn-back-dash" @click="$emit('back')">
            {{ t.sumBack }}
          </button>
        </div>

        <div class="gj-saved-toast" v-if="savedToast">{{ t.savedToast }}</div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  isDark: Boolean,
  initialTrigger: { type: String, default: "" },
  lang: { type: String, default: "en" },
});

const gjI18n = {
  en: {
    step1tag: "Step 1 · The Trigger",
    step1q: "What's one thing you'd like to reflect on today?",
    step1hint: "Share any experience — it doesn't have to be perfect.",
    step1ph:
      "Example: Today's class presentation didn't go as well as I hoped...",
    step1chars: (n) => `${n} characters`,
    step1back: "← Dashboard",
    step2tag: "Step 2 · The Mood",
    step2q: "How were you feeling when it happened?",
    step2hint: "Pick one or more that best describe your feelings.",
    step2selected: "You chose:",
    step2back: "← Back",
    step3tag: "Step 3 · The Evaluation",
    step3q: "What went well, and what felt off?",
    step3hint: "Separate facts from feelings — write it as it is.",
    step3good: "What went well",
    step3goodph:
      "Example: The content I covered was clear and well-structured...",
    step3improve: "What needs improvement",
    step3improveph:
      "Example: I didn't practice enough and got too nervous during Q&A...",
    step3back: "← Back",
    step4tag: "Step 4 · The Insight",
    step4q: "Looking back, why do you think it happened?",
    step4hint: "Dig deeper — look for root causes, not just symptoms.",
    step4ph: "Write your thoughts here, or click 'AI Suggestion' for help...",
    aiLoading: "Loading suggestion...",
    aiBtn: "AI Suggestion",
    aiHeader: "💬 AI questions to help you reflect:",
    aiUsebtn: "Use as a guide",
    step4back: "← Back",
    step5tag: "Step 5 · The Action Plan",
    step5q: "So, what's one small thing you'll do differently tomorrow?",
    step5hint: "Small consistent commitments beat big plans that never happen.",
    step5prefix: "Tomorrow, I will",
    step5ph:
      "...prepare presentation materials at least a day before and practice hard in front of a mirror.",
    step5commit: "I'm committed to doing this tomorrow! 💪",
    step5back: "← Back",
    step5finish: "Finish Reflection 🎉",
    sumTitle: "Reflection Complete!",
    sumSub: "You're one step further today. Be proud of yourself! 🙌",
    sum1label: "🌱 What was reflected",
    sum2label: "💜 Feelings at the time",
    sum3good: "✅ What went well",
    sum3improve: "🔧 What needs improvement",
    sum4label: "💡 Insight",
    sum5label: "🎯 Tomorrow's Action Commitment",
    sum5prefix: "Tomorrow, I will",
    sumCommitted: "✅ You are committed!",
    sumSave: "🔔 Save as tomorrow's reminder",
    sumNew: "✨ Start a new reflection",
    sumBack: "← Back to Dashboard",
    savedToast: "🔔 Reminder saved! Check tomorrow in Reminders.",
    aiSystemPrompt: `You are an empathetic and wise self-reflection assistant. Help the user gain deeper insights about their experience using Gibbs' Reflective Cycle. Provide 2-3 guiding questions that help them find the root cause of the event. Use warm and supportive English. Keep it brief (3-4 sentences), as reflective questions — NOT direct answers. Don't use markdown or bullet points.`,
    aiUserPrompt: (ctx) => `Please help me reflect based on this context:

${ctx}

Provide some guiding questions to help me explore why this happened.`,
    aiError:
      "Did you feel underprepared, or were there external factors beyond your control? What would you do differently if you faced this situation again?",
    moodOptions: [
      { emoji: "😊", label: "Happy", color: "#f5a623" },
      { emoji: "😔", label: "Sad", color: "#7c6ca8" },
      { emoji: "😰", label: "Anxious", color: "#e67e22" },
      { emoji: "😤", label: "Angry", color: "#e74c3c" },
      { emoji: "😕", label: "Confused", color: "#3498db" },
      { emoji: "🤩", label: "Proud", color: "#f39c12" },
      { emoji: "😌", label: "Calm", color: "#6ab04c" },
      { emoji: "😴", label: "Tired", color: "#95a5a6" },
    ],
  },
  id: {
    step1tag: "Langkah 1 · The Trigger",
    step1q: "Apa satu hal yang ingin kamu refleksikan hari ini?",
    step1hint: "Tuangkan kejadian apa saja — tidak harus sempurna.",
    step1ph: "Contoh: Hari ini presentasi di kelas terasa kurang maksimal...",
    step1chars: (n) => `${n} karakter`,
    step1back: "← Dashboard",
    step2tag: "Langkah 2 · The Mood",
    step2q: "Gimana perasaanmu pas kejadian itu?",
    step2hint: "Pilih satu atau lebih yang paling menggambarkan perasaanmu.",
    step2selected: "Kamu memilih:",
    step2back: "← Kembali",
    step3tag: "Langkah 3 · The Evaluation",
    step3q: "Apa yang berjalan lancar, dan apa yang terasa mengganjal?",
    step3hint: "Pisahkan fakta dari perasaan — tulis apa adanya.",
    step3good: "Yang berjalan baik",
    step3goodph: "Contoh: Materi yang aku bawakan sudah runtut dan jelas...",
    step3improve: "Yang perlu diperbaiki",
    step3improveph:
      "Contoh: Aku kurang latihan dan terlalu gugup saat sesi tanya jawab...",
    step3back: "← Kembali",
    step4tag: "Langkah 4 · The Insight",
    step4q: "Kalau dipikir lagi, kenapa hal itu bisa terjadi?",
    step4hint:
      "Gali lebih dalam — cari akar penyebabnya, bukan cuma gejalanya.",
    step4ph: "Tulis pikiranmu di sini, atau klik 'Saran AI' untuk bantuan...",
    aiLoading: "Memuat saran...",
    aiBtn: "Saran AI",
    aiHeader: "💬 Pertanyaan dari AI untuk membantumu berefleksi:",
    aiUsebtn: "Gunakan sebagai panduan",
    step4back: "← Kembali",
    step5tag: "Langkah 5 · The Action Plan",
    step5q: "Jadi, apa satu hal kecil yang akan kamu lakukan berbeda besok?",
    step5hint:
      "Komitmen kecil yang konsisten lebih kuat dari rencana besar yang tidak dijalankan.",
    step5prefix: "Besok, aku akan",
    step5ph:
      "...menyiapkan materi presentasi minimal H-1 dan berlatih keras di depan cermin.",
    step5commit: "Aku berkomitmen untuk melakukan ini besok! 💪",
    step5back: "← Kembali",
    step5finish: "Selesaikan Refleksi 🎉",
    sumTitle: "Refleksi Selesai!",
    sumSub:
      "Kamu sudah selangkah lebih maju hari ini. Bangga dengan dirimu sendiri! 🙌",
    sum1label: "🌱 Apa yang direfleksikan",
    sum2label: "💜 Perasaan saat itu",
    sum3good: "✅ Yang berjalan baik",
    sum3improve: "🔧 Yang perlu diperbaiki",
    sum4label: "💡 Insight",
    sum5label: "🎯 Komitmen Aksi Besok",
    sum5prefix: "Besok, aku akan",
    sumCommitted: "✅ Kamu sudah berkomitmen!",
    sumSave: "🔔 Simpan sebagai pengingat besok",
    sumNew: "✨ Mulai refleksi baru",
    sumBack: "← Kembali ke Dashboard",
    savedToast: "🔔 Pengingat disimpan! Cek besok di Reminders.",
    aiSystemPrompt: `Kamu adalah asisten refleksi diri yang empatik dan bijaksana. Bantu pengguna menggali insight lebih dalam tentang pengalaman mereka menggunakan Gibbs' Reflective Cycle. Berikan 2-3 pertanyaan pemandu yang membantu mereka menemukan akar penyebab dari kejadian tersebut. Gunakan bahasa Indonesia yang hangat dan supportif. Jawaban harus singkat (3-4 kalimat), berupa pertanyaan-pertanyaan reflektif, BUKAN jawaban langsung. Jangan gunakan markdown atau bullet points.`,
    aiUserPrompt: (ctx) => `Tolong bantu aku berefleksi berdasarkan konteks ini:

${ctx}

Berikan beberapa pertanyaan pemandu untuk membantu aku menggali kenapa hal ini bisa terjadi.`,
    aiError:
      "Apakah kamu merasa kurang persiapan, atau ada faktor eksternal di luar kendalimu? Apa yang akan kamu lakukan berbeda jika menghadapi situasi ini lagi?",
    moodOptions: [
      { emoji: "😊", label: "Senang", color: "#f5a623" },
      { emoji: "😔", label: "Sedih", color: "#7c6ca8" },
      { emoji: "😰", label: "Cemas", color: "#e67e22" },
      { emoji: "😤", label: "Marah", color: "#e74c3c" },
      { emoji: "😕", label: "Bingung", color: "#3498db" },
      { emoji: "🤩", label: "Bangga", color: "#f39c12" },
      { emoji: "😌", label: "Tenang", color: "#6ab04c" },
      { emoji: "😴", label: "Lelah", color: "#95a5a6" },
    ],
  },
};

const t = computed(() => gjI18n[props.lang] ?? gjI18n.en);
const moodOptions = computed(() => t.value.moodOptions);
const emit = defineEmits(["back", "done"]);

const currentStep = ref(0);
const aiLoading = ref(false);
const aiSuggestion = ref("");
const actionCommitted = ref(false);
const savedToast = ref(false);

const steps = [
  { title: "The Trigger" },
  { title: "The Mood" },
  { title: "The Evaluation" },
  { title: "The Insight" },
  { title: "The Action Plan" },
  { title: "Summary" },
];

const answers = ref({
  trigger: props.initialTrigger || "",
  moods: [],
  wentWell: "",
  improve: "",
  insight: "",
  action: "",
});

// moodOptions now in computed t above

const progressPct = computed(
  () => (currentStep.value / (steps.length - 1)) * 100,
);

function toggleMood(label) {
  const idx = answers.value.moods.indexOf(label);
  if (idx === -1) {
    answers.value.moods.push(label);
  } else {
    answers.value.moods.splice(idx, 1);
  }
}

async function fetchAiSuggestion() {
  aiLoading.value = true;
  aiSuggestion.value = "";
  try {
    const context = `
Trigger: ${answers.value.trigger}
Mood: ${answers.value.moods.join(", ")}
Went well: ${answers.value.wentWell}
Needs improvement: ${answers.value.improve}
    `.trim();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: t.value.aiSystemPrompt,
        messages: [
          {
            role: "user",
            content: t.value.aiUserPrompt(context),
          },
        ],
      }),
    });
    const data = await response.json();
    const text = data.content?.find((b) => b.type === "text")?.text || "";
    aiSuggestion.value = text.trim();
  } catch (e) {
    aiSuggestion.value = t.value.aiError;
  } finally {
    aiLoading.value = false;
  }
}

function finishReflection() {
  currentStep.value = 5;
  emit("done", { ...answers.value });
}

function saveReminder() {
  savedToast.value = true;
  setTimeout(() => (savedToast.value = false), 3500);
}

function startNew() {
  answers.value = {
    trigger: "",
    moods: [],
    wentWell: "",
    improve: "",
    insight: "",
    action: "",
  };
  actionCommitted.value = false;
  aiSuggestion.value = "";
  currentStep.value = 0;
}

function getConfettiStyle(i) {
  const colors = [
    "#a78bfa",
    "#f5a623",
    "#6ab04c",
    "#e74c3c",
    "#3498db",
    "#f39c12",
  ];
  const x = 5 + ((i * 83) % 90);
  const delay = (i * 0.18) % 1.8;
  return {
    left: `${x}%`,
    background: colors[i % colors.length],
    animationDelay: `${delay}s`,
  };
}
</script>

<style scoped>
/* ── Wrapper ── */
.gj-wrap {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 0 8px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Progress ── */
.gj-progress-bar {
  height: 4px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
}
.gj-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent) 0%, #c084fc 100%);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.34, 1.2, 0.64, 1);
}

/* ── Step dots ── */
.gj-steps {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
.gj-step-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.3s ease;
  cursor: default;
  user-select: none;
}
.gj-step-dot.done {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
  cursor: pointer;
}
.gj-step-dot.done:hover {
  background: var(--accent);
  color: white;
}
.gj-step-dot.active {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
  box-shadow: 0 0 0 4px var(--accent-glow);
  transform: scale(1.15);
}
.gj-dot-check {
  font-size: 0.75rem;
}

/* ── Card ── */
.gj-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

/* ── Card header ── */
.gj-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gj-layer-tag {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid var(--border);
}
.gj-layer-emoji {
  font-size: 1.6rem;
}

/* ── Question & hint ── */
.gj-question {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  color: var(--text-primary);
  line-height: 1.35;
  margin: 0;
}
.gj-hint {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin: 0;
}

/* ── Textarea ── */
.gj-textarea {
  width: 100%;
  background: var(--bg-surface);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-primary);
  resize: vertical;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  line-height: 1.7;
  min-height: 100px;
}
.gj-textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.gj-textarea::placeholder {
  color: var(--text-muted);
  font-style: italic;
}
.gj-textarea-sm {
  min-height: 80px;
  font-size: 0.85rem;
}
.gj-textarea-commitment {
  border-left: 3px solid var(--accent);
  border-radius: 0 12px 12px 0;
  min-height: 70px;
  font-style: italic;
}

.gj-char-count {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: right;
  margin-top: -8px;
}

/* ── Mood grid ── */
.gj-mood-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.gj-mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: 14px;
  border: 2px solid var(--border);
  background: var(--bg-surface);
  cursor: pointer;
  transition: all 0.2s ease;
}
.gj-mood-btn:hover {
  border-color: var(--mc, var(--accent));
  transform: translateY(-2px);
  box-shadow: 0 4px 14px
    color-mix(in srgb, var(--mc, var(--accent)) 25%, transparent);
}
.gj-mood-btn.selected {
  background: color-mix(in srgb, var(--mc, var(--accent)) 12%, var(--bg-card));
  border-color: var(--mc, var(--accent));
  box-shadow: 0 2px 10px
    color-mix(in srgb, var(--mc, var(--accent)) 20%, transparent);
}
.gj-mood-emoji {
  font-size: 1.6rem;
  line-height: 1;
}
.gj-mood-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.gj-mood-selected {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-top: -4px;
}
.gj-mood-selected-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.gj-mood-tag {
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--border);
  padding: 3px 10px;
  border-radius: 20px;
}

/* ── Two columns (evaluation) ── */
.gj-two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.gj-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gj-col-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.gj-col-icon {
  font-size: 1rem;
}
.gj-col-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.gj-col-good .gj-textarea-sm {
  border-left: 3px solid #6ab04c;
}
.gj-col-improve .gj-textarea-sm {
  border-left: 3px solid #e67e22;
}

/* ── AI button & suggestion ── */
.gj-ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 50px;
  background: var(--accent-soft);
  border: 1.5px solid var(--accent);
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
}
.gj-ai-btn:hover:not(:disabled) {
  background: var(--accent);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.gj-ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.gj-ai-spinner {
  display: inline-block;
  animation: gjSpin 1s linear infinite;
}
@keyframes gjSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.gj-ai-suggestion {
  background: linear-gradient(135deg, var(--accent-soft), var(--bg-surface));
  border: 1px solid var(--accent);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gj-ai-suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent);
}
.gj-ai-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
}
.gj-ai-suggestion-text {
  font-size: 0.87rem;
  color: var(--text-primary);
  line-height: 1.65;
  font-style: italic;
}
.gj-ai-use-btn {
  font-size: 0.74rem;
  color: var(--accent);
  background: none;
  border: 1px solid var(--accent);
  border-radius: 20px;
  padding: 5px 14px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s;
}
.gj-ai-use-btn:hover {
  background: var(--accent);
  color: white;
}

/* ── Commitment (action plan) ── */
.gj-commitment-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gj-commitment-prefix {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  font-style: italic;
}
.gj-checklist {
  margin-top: 4px;
}
.gj-checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.gj-check-input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
  cursor: pointer;
}
.gj-check-label {
  font-size: 0.88rem;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
}

/* ── Actions row ── */
.gj-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 12px;
}
.gj-btn-back {
  font-size: 0.82rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  transition: color 0.2s;
}
.gj-btn-back:hover {
  color: var(--text-secondary);
}
.gj-btn-next {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 26px;
  border-radius: 50px;
  background: var(--accent);
  color: white;
  border: none;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px var(--accent-glow);
}
.gj-btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--accent-glow);
  filter: brightness(1.08);
}
.gj-btn-next:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gj-btn-finish {
  background: linear-gradient(135deg, var(--accent) 0%, #c084fc 100%);
  font-size: 0.9rem;
}
.gj-arrow {
  font-size: 1.1rem;
}

/* ── Summary card ── */
.gj-summary-card {
  gap: 24px;
}
.gj-confetti-wrap {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.gj-confetti-piece {
  position: absolute;
  top: -10px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: gjConfettiFall 2.5s ease-in forwards;
  opacity: 0;
}
@keyframes gjConfettiFall {
  0% {
    top: -5%;
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  100% {
    top: 110%;
    opacity: 0;
    transform: rotate(540deg) scale(0.5);
  }
}
.gj-summary-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 8px 0;
}
.gj-summary-icon {
  font-size: 3rem;
  animation: gjPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes gjPop {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.gj-summary-title {
  font-family: var(--font-heading);
  font-size: 1.9rem;
  color: var(--text-primary);
}
.gj-summary-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
  max-width: 380px;
}
.gj-summary-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gj-summary-section {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gj-summary-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
}
.gj-summary-section-text {
  font-size: 0.88rem;
  color: var(--text-primary);
  line-height: 1.6;
}
.gj-summary-moods-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.gj-summary-mood-tag {
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--border);
  padding: 4px 12px;
  border-radius: 20px;
}
.gj-summary-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.gj-summary-mini {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gj-summary-action-box {
  background: linear-gradient(135deg, var(--accent-soft), var(--bg-surface));
  border: 2px solid var(--accent);
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gj-summary-action-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
}
.gj-summary-action-text {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-style: italic;
  color: var(--text-primary);
  line-height: 1.5;
}
.gj-summary-committed {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6ab04c;
}

/* ── Summary action buttons ── */
.gj-summary-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.gj-btn-save {
  width: 100%;
  max-width: 320px;
  padding: 12px 24px;
  border-radius: 50px;
  background: linear-gradient(135deg, var(--accent) 0%, #c084fc 100%);
  color: white;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px var(--accent-glow);
}
.gj-btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--accent-glow);
}
.gj-btn-new {
  width: 100%;
  max-width: 320px;
  padding: 11px 24px;
  border-radius: 50px;
  background: var(--accent-soft);
  border: 1.5px solid var(--accent);
  color: var(--accent);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}
.gj-btn-new:hover {
  background: var(--accent);
  color: white;
}
.gj-btn-back-dash {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  transition: color 0.2s;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.gj-btn-back-dash:hover {
  color: var(--text-secondary);
}

/* ── Toast ── */
.gj-saved-toast {
  text-align: center;
  background: #6ab04c;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  animation: gjFadeIn 0.3s ease;
}
@keyframes gjFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Transitions ── */
.gj-slide-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.gj-slide-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.gj-slide-enter-from {
  opacity: 0;
  transform: translateX(28px);
}
.gj-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.gj-fade-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.gj-fade-leave-active {
  transition: opacity 0.2s ease;
}
.gj-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.gj-fade-leave-to {
  opacity: 0;
}
</style>
