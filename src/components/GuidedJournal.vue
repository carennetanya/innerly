<template>
  <div class="gj-wrap" :class="{ 'is-dark': isDark }">
    <div class="gj-progress-bar">
      <div class="gj-progress-fill" :style="{ width: progressPct + '%' }"></div>
    </div>

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

    <div class="gj-book">
      <div class="gj-spine"></div>

      <div class="gj-page gj-page-left">
        <div class="gj-page-lines">
          <div v-for="i in 14" :key="i" class="gj-line"></div>
        </div>
        <div class="gj-page-content">
          <div v-if="currentStep === 0" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step1tag }}</span>
            <h2 class="gj-page-title">{{ t.step1q }}</h2>
            <p class="gj-page-hint">{{ t.step1hint }}</p>
            <p class="gj-page-note">{{ t.step1note }}</p>
          </div>

          <div v-else-if="currentStep === 1" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step2tag }}</span>
            <h2 class="gj-page-title">{{ t.step2q }}</h2>
            <p class="gj-page-hint">{{ t.step2hint }}</p>
            <div v-if="answers.mood" class="gj-page-summary">
              <span class="gj-mood-emoji-large">
                <img v-if="answers.moodImg" :src="answers.moodImg" :alt="answers.mood" width="48" height="48" />
              </span>
              <p>{{ t.step2selected }}</p>
              <p class="gj-page-selected">{{ answers.mood }}</p>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step3tag }}</span>
            <h2 class="gj-page-title">{{ t.step3q }}</h2>
            <p class="gj-page-hint">{{ t.step3hint }}</p>
          </div>

          <div v-else-if="currentStep === 3" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step4tag }}</span>
            <h2 class="gj-page-title">{{ t.step4q }}</h2>
            <p class="gj-page-hint">{{ t.step4hint }}</p>
          </div>

          <div v-else-if="currentStep === 4" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step5tag }}</span>
            <h2 class="gj-page-title">{{ t.step5q }}</h2>
            <p class="gj-page-hint">{{ t.step5hint }}</p>
          </div>

          <div v-else class="gj-side-panel gj-summary-side">
            <div class="gj-summary-hero">
              <div class="gj-summary-icon">🌟</div>
              <h2 class="gj-summary-title">{{ t.sumTitle }}</h2>
              <p class="gj-summary-sub">{{ t.sumSub }}</p>
            </div>
          </div>
        </div>
        <div class="gj-page-number">{{ leftPageNumber }}</div>
      </div>

      <div class="gj-page gj-page-right">
        <div class="gj-page-lines">
          <div v-for="i in 14" :key="i" class="gj-line"></div>
        </div>
        <div class="gj-page-content">
          <div v-if="currentStep === 0" class="gj-step-content">
            <textarea
              v-model="answers.trigger"
              class="gj-textarea"
              :placeholder="t.step1ph"
              rows="6"
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
                {{ t.nextBtn }}
              </button>
            </div>
          </div>

          <div v-else-if="currentStep === 1" class="gj-step-content">
            <div class="gj-mood-grid">
              <button
                v-for="m in moodOptions"
                :key="m.label"
                class="gj-mood-btn"
                :class="{ selected: answers.mood === m.label }"
                :style="{ '--mc': m.color }"
                @click="selectMood(m.label)"
              >
                <span class="gj-mood-emoji">
                  <img :src="m.img" :alt="m.label" width="38" height="38" />
                </span>
                <span class="gj-mood-label">{{ m.label }}</span>
              </button>
            </div>
            <div class="gj-note-card">
              <label class="gj-note-label">{{ t.moodNoteLabel }}</label>
              <textarea
                v-model="answers.moodNote"
                class="gj-textarea gj-textarea-sm"
                :placeholder="t.moodNotePh"
                rows="3"
              ></textarea>
            </div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="currentStep = 0">
                {{ t.step2back }}
              </button>
              <button
                class="gj-btn-next"
                :disabled="!answers.mood"
                @click="currentStep = 2"
              >
                {{ t.nextBtn }}
              </button>
            </div>
          </div>

          <div v-else-if="currentStep === 2" class="gj-step-content">
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
                {{ t.nextBtn }}
              </button>
            </div>
          </div>

          <div v-else-if="currentStep === 3" class="gj-step-content">
            <div class="gj-field-wrap" :class="{ 'caly-waiting': calyWaiting && !answers.insight }">
              <Transition name="gj-fade">
                <div v-if="calyWaiting && !answers.insight" class="gj-caly-badge">
                  💬 Caly is waiting for your answer...
                </div>
              </Transition>
              <textarea
                ref="insightTextareaRef"
                v-model="answers.insight"
                class="gj-textarea"
                :placeholder="calyWaiting ? t.calyWaitingPh : t.step4ph"
                rows="6"
              ></textarea>
            </div>
            <button
              class="gj-ai-btn"
              @click="fetchAiSuggestion"
              :disabled="aiLoading"
            >
              <span class="gj-ai-icon" :class="{ spinning: aiLoading }">
                {{ aiLoading ? '⟳' : '💬' }}
              </span>
              {{ aiLoading ? t.aiLoading : t.aiBtn }}
            </button>
            <Transition name="gj-fade">
              <div v-if="aiSuggestion" class="gj-ai-suggestion">
                <div class="gj-ai-suggestion-header">
                  <span>{{ t.aiHeader }}</span>
                  <button class="gj-ai-close" @click="dismissCaly">&times;</button>
                </div>
                <p class="gj-ai-suggestion-text">{{ aiSuggestion }}</p>
                <button class="gj-ai-use-btn" @click="respondToCaly">
                  {{ t.aiUsebtn }} ↩
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
                {{ t.nextBtn }}
              </button>
            </div>
          </div>

          <div v-else-if="currentStep === 4" class="gj-step-content">
            <div class="gj-commitment-wrap">
              <span class="gj-commitment-prefix">{{ t.step5prefix }}</span>
              <textarea
                v-model="answers.action"
                class="gj-textarea gj-textarea-commitment"
                :placeholder="t.step5ph"
                rows="4"
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

          <div v-else class="gj-summary-content">
            <div class="gj-summary-body">
              <div class="gj-summary-section" v-if="answers.trigger">
                <div class="gj-summary-section-label">{{ t.sum1label }}</div>
                <div class="gj-summary-section-text">{{ answers.trigger }}</div>
              </div>
              <div class="gj-summary-section" v-if="answers.mood">
                <div class="gj-summary-section-label">{{ t.sum2label }}</div>
                <div class="gj-summary-section-text">
                  <img v-if="answers.moodImg" :src="answers.moodImg" :alt="answers.mood" width="32" height="32" style="vertical-align:middle;margin-right:6px;" />
                  {{ answers.mood }}
                </div>
                <div v-if="answers.moodNote" class="gj-summary-note">
                  {{ answers.moodNote }}
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
                v-if="answers.action"
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
        </div>
        <div class="gj-page-number">{{ rightPageNumber }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { authService } from "../services/auth.js";
import { commitmentService } from "../services/commitment.js";

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
    step1note: "Write openly, just like a page in a journal.",
    step1ph:
      "Example: Today's class presentation didn't go as well as I hoped...",
    step1chars: (n) => `${n} characters`,
    step1back: "← Dashboard",
    step2tag: "Step 2 · Mood Check",
    step2q: "How were you feeling when it happened?",
    step2hint: "Pick the mood that fits best, then add a short note.",
    moodNoteLabel: "A little more about this mood",
    moodNotePh: "Optional: how did this feeling show up for you?",
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
    step4ph: "Write your thoughts here, or ask Caly for help...",
    calyWaitingPh: "Caly is waiting for your answer... write it here 💬",
    aiLoading: "Caly is thinking...",
    aiBtn: "Ask Caly",
    aiHeader: "💬 Caly has a question for you:",
    aiUsebtn: "Answer Caly",
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
    nextBtn: "Lanjut",
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
      { img: "/happy.png", label: "Happy", color: "#f5a623" },
      { img: "/sad.png", label: "Sad", color: "#7c6ca8" },
      { img: "/anxious.png", label: "Anxious", color: "#e67e22" },
      { img: "/frustrated.png", label: "Angry", color: "#e74c3c" },
      { img: "/confused.png", label: "Confused", color: "#3498db" },
      { img: "/excited.png", label: "Proud", color: "#f39c12" },
      { img: "/calm.png", label: "Calm", color: "#6ab04c" },
      { img: "/tired.png", label: "Tired", color: "#95a5a6" },
      { img: "/so-so.png", label: "So-so", color: "#b0b0b0" },
      { img: "/touched.png", label: "Touched", color: "#a78bfa" },
    ],
  },
  id: {
    step1tag: "Langkah 1 · The Trigger",
    step1q: "Apa satu hal yang ingin kamu refleksikan hari ini?",
    step1hint: "Tuangkan kejadian apa saja — tidak harus sempurna.",
    step1note: "Tulis bebas, seperti halaman jurnalmu sendiri.",
    step1ph: "Contoh: Hari ini presentasi di kelas terasa kurang maksimal...",
    step1chars: (n) => `${n} karakter`,
    step1back: "← Dashboard",
    step2tag: "Langkah 2 · Mood Check",
    step2q: "Gimana perasaanmu pas kejadian itu?",
    step2hint: "Pilih mood yang paling cocok, lalu tambahkan catatan singkat.",
    moodNoteLabel: "Tambahkan sedikit tentang perasaan ini",
    moodNotePh: "Opsional: bagaimana perasaan ini muncul untukmu?",
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
    step4ph: "Tulis pikiranmu di sini, atau tanya Caly untuk bantuan...",
    calyWaitingPh: "Caly sedang menunggu jawabanmu... tulis di sini 💬",
    aiLoading: "Caly sedang berpikir...",
    aiBtn: "Tanya Caly",
    aiHeader: "💬 Caly punya pertanyaan untukmu:",
    aiUsebtn: "Tanggapi Caly",
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
    nextBtn: "Lanjut",
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
      { img: "/happy.png", label: "Senang", color: "#f5a623" },
      { img: "/calm.png", label: "Tenang", color: "#6ab04c" },
      { img: "/excited.png", label: "Bersemangat", color: "#f39c12" },
      { img: "/sad.png", label: "Sedih", color: "#7c6ca8" },
      { img: "/anxious.png", label: "Cemas", color: "#e67e22" },
      { img: "/frustrated.png", label: "Frustrasi", color: "#e74c3c" },
      { img: "/confused.png", label: "Bingung", color: "#3498db" },
      { img: "/tired.png", label: "Lelah", color: "#95a5a6" },
      { img: "/so-so.png", label: "Biasa saja", color: "#b0b0b0" },
      { img: "/touched.png", label: "Tersentuh", color: "#a78bfa" },
    ],
  },
};

const t = computed(() => gjI18n[props.lang] ?? gjI18n.en);
const moodOptions = computed(() => t.value.moodOptions);
const emit = defineEmits(["back", "done"]);

const currentStep = ref(0);
const aiLoading = ref(false);
const aiSuggestion = ref("");
const calyWaiting = ref(false);
const insightTextareaRef = ref(null);
const actionCommitted = ref(false);
const savedToast = ref(false);

const steps = [
  { title: "The Trigger" },
  { title: "Mood Check" },
  { title: "The Evaluation" },
  { title: "The Insight" },
  { title: "The Action Plan" },
  { title: "Summary" },
];

const answers = ref({
  trigger: props.initialTrigger || "",
  mood: "",
  moods: [],
  moodImg: "",
  moodNote: "",
  wentWell: "",
  improve: "",
  insight: "",
  action: "",
});

const progressPct = computed(
  () => (currentStep.value / (steps.length - 1)) * 100,
);

const pageNumber = computed(() => currentStep.value + 1);
const leftPageNumber = computed(() =>
  currentStep.value === 0 ? "i" : pageNumber.value,
);
const rightPageNumber = computed(() =>
  currentStep.value === 0 ? "1" : pageNumber.value,
);

function selectMood(label) {
  const option = moodOptions.value.find((m) => m.label === label);
  if (answers.value.mood === label) {
    answers.value.mood = "";
    answers.value.moodImg = "";
    answers.value.moods = [];
  } else {
    answers.value.mood = label;
    answers.value.moodImg = option?.img || "";
    answers.value.moods = [label];
  }
}

async function fetchAiSuggestion() {
  aiLoading.value = true;
  aiSuggestion.value = "";
  try {
    const context = [
      answers.value.trigger && `Trigger: ${answers.value.trigger}`,
      answers.value.mood && `Mood: ${answers.value.mood}`,
      answers.value.wentWell && `Went well: ${answers.value.wentWell}`,
      answers.value.improve && `Needs improvement: ${answers.value.improve}`,
    ]
      .filter(Boolean)
      .join("\n");

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

function respondToCaly() {
  calyWaiting.value = true;
  aiSuggestion.value = "";
  nextTick(() => { insightTextareaRef.value?.focus(); });
}

function dismissCaly() {
  aiSuggestion.value = "";
  calyWaiting.value = false;
}

async function finishReflection() {
  currentStep.value = 5;
  // Save committed action as tomorrow's reminder in localStorage
  if (actionCommitted.value && answers.value.action.trim()) {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const reminderData = {
      date: todayKey,
      action: answers.value.action.trim(),
      moodImg: answers.value.moodImg || '',
      mood: answers.value.mood || '',
    };
    // Save to localStorage (fallback)
    localStorage.setItem('innerly_reminder', JSON.stringify(reminderData));
    // Save to DB
    try {
      const user = authService.getUser();
      if (user && user.id) {
        const saved = await commitmentService.saveCommitment(user.id, reminderData);
        // Store DB id for later mark-done
        localStorage.setItem('innerly_reminder', JSON.stringify({ ...reminderData, dbId: saved.id }));
      }
    } catch (e) {
      console.warn('Could not save commitment to DB:', e);
    }
  }
  emit("done", { ...answers.value, committed: actionCommitted.value });
}

async function saveReminder() {
  actionCommitted.value = true;
  if (answers.value.action) {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const reminderData = {
      date: todayKey,
      action: answers.value.action.trim(),
      moodImg: answers.value.moodImg || '',
      mood: answers.value.mood || '',
    };
    localStorage.setItem('innerly_reminder', JSON.stringify(reminderData));
    try {
      const user = authService.getUser();
      if (user && user.id) {
        const saved = await commitmentService.saveCommitment(user.id, reminderData);
        localStorage.setItem('innerly_reminder', JSON.stringify({ ...reminderData, dbId: saved.id }));
      }
    } catch (e) {
      console.warn('Could not save commitment to DB:', e);
    }
  }
  savedToast.value = true;
  setTimeout(() => (savedToast.value = false), 3500);
}

function startNew() {
  answers.value = {
    trigger: "",
    mood: "",
    moods: [],
    moodEmoji: "",
    moodNote: "",
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
/* ── Color tokens (match AuthModal palette) ── */
/* Light */
/* bg-card:      #faf8ff  */
/* bg-surface:   rgba(255,255,255,0.7) */
/* border:       rgba(160,120,250,0.15) */
/* accent:       #5b4a9a  (gradient end #9333ea) */
/* accent-soft:  rgba(124,108,168,0.08) */
/* accent-glow:  rgba(124,108,168,0.12) */
/* text-primary: #2d1f6e  */
/* text-muted:   rgba(80,60,140,0.6) */
/* shadow-md:    0 24px 72px rgba(80,40,180,0.22), 0 2px 10px rgba(80,40,180,0.08) */

/* Dark */
/* bg-card:      #0f0b1e  */
/* bg-surface:   rgba(30,20,50,0.7) */
/* border:       rgba(167,139,250,0.18) */
/* accent:       #a78bfa */
/* accent-soft:  rgba(167,139,250,0.1) */
/* accent-glow:  rgba(167,139,250,0.12) */
/* text-primary: #ede8ff  */
/* text-muted:   rgba(180,160,255,0.55) */

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
  background: rgba(160, 120, 250, 0.15);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 4px;
}
.gj-wrap.is-dark .gj-progress-bar {
  background: rgba(167, 139, 250, 0.18);
}
.gj-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5b4a9a 0%, #9333ea 100%);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.gj-wrap.is-dark .gj-progress-fill {
  background: linear-gradient(90deg, #a78bfa 0%, #c084fc 100%);
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
  border: 2px solid rgba(160, 120, 250, 0.2);
  background: #faf8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.5);
  transition: all 0.3s ease;
  cursor: default;
  user-select: none;
}
.gj-wrap.is-dark .gj-step-dot {
  background: #0f0b1e;
  border-color: rgba(167, 139, 250, 0.2);
  color: rgba(180, 160, 255, 0.4);
}
.gj-step-dot.done {
  background: rgba(124, 108, 168, 0.08);
  border-color: #5b4a9a;
  color: #5b4a9a;
  cursor: pointer;
}
.gj-wrap.is-dark .gj-step-dot.done {
  background: rgba(167, 139, 250, 0.1);
  border-color: #a78bfa;
  color: #a78bfa;
}
.gj-step-dot.done:hover {
  background: #5b4a9a;
  color: white;
}
.gj-wrap.is-dark .gj-step-dot.done:hover {
  background: #a78bfa;
  color: white;
}
.gj-step-dot.active {
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  border-color: #5b4a9a;
  color: white;
  box-shadow: 0 0 0 4px rgba(124, 108, 168, 0.18);
  transform: scale(1.15);
}
.gj-wrap.is-dark .gj-step-dot.active {
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
  border-color: #a78bfa;
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.18);
}
.gj-dot-check {
  font-size: 0.75rem;
}

/* ── Card ── */
.gj-card {
  background: #faf8ff;
  border: 1px solid rgba(160, 120, 250, 0.15);
  border-radius: 24px;
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow:
    0 24px 72px rgba(80, 40, 180, 0.22),
    0 2px 10px rgba(80, 40, 180, 0.08);
  position: relative;
  overflow: hidden;
}
.gj-wrap.is-dark .gj-card {
  background: #0f0b1e;
  border-color: rgba(167, 139, 250, 0.18);
  box-shadow:
    0 24px 72px rgba(40, 20, 100, 0.4),
    0 2px 10px rgba(40, 20, 100, 0.2);
}

/* ── Card header ── */
.gj-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.gj-layer-tag {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: "Outfit", sans-serif;
  color: #5b4a9a;
  background: rgba(124, 108, 168, 0.08);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(160, 120, 250, 0.2);
}
.gj-wrap.is-dark .gj-layer-tag {
  color: #c4b5fd;
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.2);
}
.gj-layer-emoji {
  font-size: 1.6rem;
}

/* ── Question & hint ── */
.gj-question {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.4rem;
  color: #2d1f6e;
  line-height: 1.35;
  margin: 0;
  font-weight: 700;
}
.gj-wrap.is-dark .gj-question {
  color: #e8d8ff;
}
.gj-hint {
  font-size: 0.82rem;
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.6);
  margin: 0;
  line-height: 1.5;
}
.gj-wrap.is-dark .gj-hint {
  color: rgba(180, 160, 255, 0.55);
}

/* ── Textarea ── */
.gj-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px solid rgba(124, 108, 168, 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  font-family: "Outfit", sans-serif;
  font-size: 0.9rem;
  color: #2d1f6e;
  resize: vertical;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  line-height: 1.7;
  min-height: 100px;
  box-sizing: border-box;
}
.gj-wrap.is-dark .gj-textarea {
  background: rgba(30, 20, 50, 0.7);
  border-color: rgba(167, 139, 250, 0.2);
  color: #e8d8ff;
}
.gj-textarea:focus {
  border-color: #7c6ca8;
  box-shadow: 0 0 0 3px rgba(124, 108, 168, 0.12);
}
.gj-wrap.is-dark .gj-textarea:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12);
}
.gj-textarea::placeholder {
  color: rgba(100, 80, 160, 0.35);
  font-style: italic;
}
.gj-wrap.is-dark .gj-textarea::placeholder {
  color: rgba(167, 139, 250, 0.35);
}
.gj-textarea-sm {
  min-height: 80px;
  font-size: 0.85rem;
}
.gj-textarea-commitment {
  border-left: 3px solid #7c6ca8;
  border-radius: 0 12px 12px 0;
  min-height: 70px;
  font-style: italic;
}
.gj-wrap.is-dark .gj-textarea-commitment {
  border-left-color: #a78bfa;
}

.gj-char-count {
  font-size: 0.7rem;
  color: rgba(80, 60, 140, 0.6);
  font-family: "Outfit", sans-serif;
  text-align: right;
  margin-top: -8px;
}
.gj-wrap.is-dark .gj-char-count {
  color: rgba(180, 160, 255, 0.55);
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
  border: 2px solid rgba(124, 108, 168, 0.2);
  background: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}
.gj-wrap.is-dark .gj-mood-btn {
  border-color: rgba(167, 139, 250, 0.2);
  background: rgba(30, 20, 50, 0.7);
}
.gj-mood-btn:hover {
  border-color: var(--mc, #7c6ca8);
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(124, 108, 168, 0.18);
}
.gj-mood-btn.selected {
  background: rgba(124, 108, 168, 0.1);
  border-color: var(--mc, #7c6ca8);
  box-shadow: 0 2px 10px rgba(124, 108, 168, 0.15);
}
.gj-wrap.is-dark .gj-mood-btn.selected {
  background: rgba(167, 139, 250, 0.1);
}
.gj-mood-emoji {
  font-size: 1.6rem;
  line-height: 1;
}
.gj-mood-label {
  font-size: 0.72rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.65);
}
.gj-wrap.is-dark .gj-mood-label {
  color: rgba(180, 160, 255, 0.6);
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
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.6);
}
.gj-wrap.is-dark .gj-mood-selected-label {
  color: rgba(180, 160, 255, 0.55);
}
.gj-mood-tag {
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  background: rgba(124, 108, 168, 0.08);
  color: #5b4a9a;
  border: 1px solid rgba(160, 120, 250, 0.2);
  padding: 3px 10px;
  border-radius: 20px;
}
.gj-wrap.is-dark .gj-mood-tag {
  background: rgba(167, 139, 250, 0.1);
  color: #c4b5fd;
  border-color: rgba(167, 139, 250, 0.2);
}

/* ── Two columns (evaluation) ── */
.gj-two-cols {
  display: grid;
  grid-template-columns: 1fr;  
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
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.65);
}
.gj-wrap.is-dark .gj-col-title {
  color: rgba(180, 160, 255, 0.6);
}
.gj-col-good .gj-textarea-sm {
  border-left: 3px solid #6ab04c;
}
.gj-col-improve .gj-textarea-sm {
  border-left: 3px solid #e67e22;
}

/* ── Caly field wrap ── */
.gj-field-wrap {
  position: relative;
  border: 1.5px solid rgba(91, 142, 230, 0.25);
  border-radius: 12px;
  padding: 4px 8px 4px;
  background: rgba(255,255,255,0.6);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.gj-field-wrap:focus-within {
  border-color: rgba(91, 142, 230, 0.5);
  box-shadow: 0 4px 18px rgba(91, 142, 230, 0.14);
}
.gj-field-wrap.caly-waiting {
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: 0 4px 20px rgba(167, 139, 250, 0.18);
  animation: gjCalyPulse 2s ease-in-out infinite;
}
@keyframes gjCalyPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(167, 139, 250, 0.18); }
  50% { box-shadow: 0 4px 26px rgba(167, 139, 250, 0.32); }
}
.gj-field-wrap .gj-textarea {
  border: none !important;
  box-shadow: none !important;
  padding: 6px 4px;
}
.gj-caly-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: #7c3aed;
  padding: 4px 2px 0;
  opacity: 0.85;
}
.gj-wrap.is-dark .gj-field-wrap {
  background: rgba(255,255,255,0.04);
  border-color: rgba(120,160,240,0.14);
}

/* ── AI button & suggestion ── */
.gj-ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 50px;
  background: rgba(124, 108, 168, 0.08);
  border: 1.5px solid #7c6ca8;
  color: #5b4a9a;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
}
.gj-wrap.is-dark .gj-ai-btn {
  background: rgba(167, 139, 250, 0.1);
  border-color: #a78bfa;
  color: #c4b5fd;
}
.gj-ai-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  border-color: #5b4a9a;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(147, 51, 234, 0.3);
}
.gj-wrap.is-dark .gj-ai-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
  border-color: #a78bfa;
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
  background: linear-gradient(135deg, rgba(124, 108, 168, 0.08), rgba(255, 255, 255, 0.7));
  border: 1px solid rgba(124, 108, 168, 0.3);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gj-wrap.is-dark .gj-ai-suggestion {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(30, 20, 50, 0.7));
  border-color: rgba(167, 139, 250, 0.25);
}
.gj-ai-suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  color: #5b4a9a;
}
.gj-wrap.is-dark .gj-ai-suggestion-header {
  color: #c4b5fd;
}
.gj-ai-close {
  background: rgba(124, 108, 168, 0.1);
  border: none;
  color: rgba(80, 60, 140, 0.6);
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 50%;
  transition: background 0.2s;
}
.gj-ai-close:hover {
  background: rgba(124, 108, 168, 0.2);
}
.gj-wrap.is-dark .gj-ai-close {
  color: #a78bfa;
  background: rgba(167, 139, 250, 0.1);
}
.gj-ai-suggestion-text {
  font-size: 0.87rem;
  font-family: "Outfit", sans-serif;
  color: #2d1f6e;
  line-height: 1.65;
  font-style: italic;
}
.gj-wrap.is-dark .gj-ai-suggestion-text {
  color: #ede8ff;
}
.gj-ai-use-btn {
  font-size: 0.74rem;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  color: #5b4a9a;
  background: none;
  border: 1px solid #7c6ca8;
  border-radius: 20px;
  padding: 5px 14px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s;
}
.gj-ai-use-btn:hover {
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  border-color: #5b4a9a;
  color: white;
}
.gj-wrap.is-dark .gj-ai-use-btn {
  color: #c4b5fd;
  border-color: #a78bfa;
}
.gj-wrap.is-dark .gj-ai-use-btn:hover {
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
  border-color: #a78bfa;
}

/* ── Commitment (action plan) ── */
.gj-commitment-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gj-commitment-prefix {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #5b4a9a;
  font-style: italic;
}
.gj-wrap.is-dark .gj-commitment-prefix {
  color: #c4b5fd;
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
  accent-color: #5b4a9a;
  cursor: pointer;
}
.gj-wrap.is-dark .gj-check-input {
  accent-color: #a78bfa;
}
.gj-check-label {
  font-size: 0.88rem;
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.65);
  cursor: pointer;
  font-weight: 500;
}
.gj-wrap.is-dark .gj-check-label {
  color: rgba(180, 160, 255, 0.6);
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
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  transition: color 0.2s;
}
.gj-wrap.is-dark .gj-btn-back {
  color: rgba(180, 160, 255, 0.4);
}
.gj-btn-back:hover {
  color: rgba(80, 60, 140, 0.8);
}
.gj-wrap.is-dark .gj-btn-back:hover {
  color: rgba(180, 160, 255, 0.7);
}
.gj-btn-next {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  border-radius: 50px;
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  color: white;
  border: none;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 6px 22px rgba(147, 51, 234, 0.3);
}
.gj-wrap.is-dark .gj-btn-next {
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
  box-shadow: 0 6px 22px rgba(167, 139, 250, 0.3);
}
.gj-btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(147, 51, 234, 0.42);
  filter: brightness(1.06);
}
.gj-btn-next:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gj-btn-finish {
  background: linear-gradient(135deg, #5b4a9a 0%, #c084fc 100%);
  font-size: 0.9rem;
}
.gj-wrap.is-dark .gj-btn-finish {
  background: linear-gradient(135deg, #a78bfa 0%, #e879f9 100%);
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
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #2d1f6e;
}
.gj-wrap.is-dark .gj-summary-title {
  color: #e8d8ff;
}
.gj-summary-sub {
  font-size: 0.9rem;
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.6);
  max-width: 380px;
}
.gj-wrap.is-dark .gj-summary-sub {
  color: rgba(180, 160, 255, 0.55);
}
.gj-summary-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gj-summary-section {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(160, 120, 250, 0.15);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gj-wrap.is-dark .gj-summary-section {
  background: rgba(30, 20, 50, 0.7);
  border-color: rgba(167, 139, 250, 0.18);
}
.gj-summary-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #5b4a9a;
}
.gj-wrap.is-dark .gj-summary-section-label {
  color: #a78bfa;
}
.gj-summary-section-text {
  font-size: 0.88rem;
  font-family: "Outfit", sans-serif;
  color: #2d1f6e;
  line-height: 1.6;
}
.gj-wrap.is-dark .gj-summary-section-text {
  color: #ede8ff;
}
.gj-summary-moods-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.gj-summary-mood-tag {
  font-size: 0.8rem;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  background: rgba(124, 108, 168, 0.08);
  color: #5b4a9a;
  border: 1px solid rgba(160, 120, 250, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
}
.gj-wrap.is-dark .gj-summary-mood-tag {
  background: rgba(167, 139, 250, 0.1);
  color: #c4b5fd;
  border-color: rgba(167, 139, 250, 0.2);
}
.gj-summary-two-col {
  display: grid;
  grid-template-columns: 1fr; 
  gap: 12px;
}
.gj-summary-mini {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(160, 120, 250, 0.15);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gj-wrap.is-dark .gj-summary-mini {
  background: rgba(30, 20, 50, 0.7);
  border-color: rgba(167, 139, 250, 0.18);
}
.gj-summary-action-box {
  background: linear-gradient(135deg, rgba(124, 108, 168, 0.08), rgba(255, 255, 255, 0.7));
  border: 2px solid #7c6ca8;
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gj-wrap.is-dark .gj-summary-action-box {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(30, 20, 50, 0.7));
  border-color: #a78bfa;
}
.gj-summary-action-label {
  font-size: 0.72rem;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #5b4a9a;
}
.gj-wrap.is-dark .gj-summary-action-label {
  color: #a78bfa;
}
.gj-summary-action-text {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1rem;
  font-style: italic;
  color: #2d1f6e;
  line-height: 1.5;
}
.gj-wrap.is-dark .gj-summary-action-text {
  color: #e8d8ff;
}
.gj-summary-committed {
  font-size: 0.8rem;
  font-family: "Outfit", sans-serif;
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
  padding: 14px 24px;
  border-radius: 50px;
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  color: white;
  border: none;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 6px 22px rgba(147, 51, 234, 0.3);
}
.gj-btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(147, 51, 234, 0.42);
  filter: brightness(1.06);
}
.gj-btn-new {
  width: 100%;
  max-width: 320px;
  padding: 12px 24px;
  border-radius: 50px;
  background: rgba(124, 108, 168, 0.08);
  border: 1.5px solid #7c6ca8;
  color: #5b4a9a;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
}
.gj-wrap.is-dark .gj-btn-new {
  background: rgba(167, 139, 250, 0.1);
  border-color: #a78bfa;
  color: #c4b5fd;
}
.gj-btn-new:hover {
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  border-color: #5b4a9a;
  color: white;
}
.gj-wrap.is-dark .gj-btn-new:hover {
  background: linear-gradient(135deg, #a78bfa 0%, #c084fc 100%);
  border-color: #a78bfa;
}
.gj-btn-back-dash {
  font-size: 0.8rem;
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.5);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  transition: color 0.2s;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.gj-wrap.is-dark .gj-btn-back-dash {
  color: rgba(180, 160, 255, 0.4);
}
.gj-btn-back-dash:hover {
  color: rgba(80, 60, 140, 0.8);
}
.gj-wrap.is-dark .gj-btn-back-dash:hover {
  color: rgba(180, 160, 255, 0.7);
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

/* ── Book layout ── */
.gj-book {
  display: flex;
  width: 100%;
  max-width: 980px;
  min-height: 560px;
  gap: 14px;
  margin: 0 auto;
  padding: 14px;
}
.gj-spine {
  width: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(124, 108, 168, 0.4), rgba(94, 78, 152, 0.95));
  box-shadow: inset 1px 0 3px rgba(255, 255, 255, 0.18), inset -1px 0 3px rgba(0, 0, 0, 0.08);
}
.gj-page {
  position: relative;
  flex: 1;
  min-height: 560px;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(160, 120, 250, 0.18);
  background: linear-gradient(160deg, #fbf8ff 0%, #f7f1fb 56%, #f1ecf7 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
}
.gj-page-right {
  background: linear-gradient(160deg, #fff 0%, #f9f5fe 56%, #f2edfb 100%);
}
.gj-wrap.is-dark .gj-page {
  border-color: rgba(167, 139, 250, 0.18);
  background: linear-gradient(160deg, #1b132a 0%, #1a132f 56%, #180f2a 100%);
}
.gj-wrap.is-dark .gj-page-right {
  background: linear-gradient(160deg, #201738 0%, #1e1133 56%, #1b0e2b 100%);
}
.gj-page-lines {
  position: absolute;
  inset: 0;
  padding: 32px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  pointer-events: none;
  z-index: 0;
}
.gj-line {
  height: 1px;
  background: rgba(160, 120, 250, 0.12);
}
.gj-wrap.is-dark .gj-line {
  background: rgba(167, 139, 250, 0.16);
}
.gj-page-content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 36px 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.gj-side-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.gj-page-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
  color: #2d1f6e;
}
.gj-wrap.is-dark .gj-page-title {
  color: #efe5ff;
}
.gj-page-hint,
.gj-page-note,
.gj-page-selected {
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.65);
  line-height: 1.6;
  margin: 0;
}
.gj-wrap.is-dark .gj-page-hint,
.gj-wrap.is-dark .gj-page-note,
.gj-wrap.is-dark .gj-page-selected {
  color: rgba(200, 180, 255, 0.75);
}
.gj-page-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.gj-mood-emoji-large {
  font-size: 2.4rem;
}
.gj-step-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.gj-note-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gj-note-label {
  font-size: 0.78rem;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  color: rgba(80, 60, 140, 0.7);
}
.gj-wrap.is-dark .gj-note-label {
  color: rgba(200, 180, 255, 0.74);
}
.gj-summary-content {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.gj-summary-note {
  margin-top: 8px;
  font-size: 0.88rem;
  color: rgba(80, 60, 140, 0.75);
  font-style: italic;
}
.gj-wrap.is-dark .gj-summary-note {
  color: rgba(200, 180, 255, 0.75);
}
.gj-page-number {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Outfit", sans-serif;
  font-size: 0.76rem;
  color: rgba(80, 60, 140, 0.5);
}
.gj-wrap.is-dark .gj-page-number {
  color: rgba(180, 160, 255, 0.5);
}

@media (max-width: 900px) {
  .gj-book {
    flex-direction: column;
    min-height: auto;
  }
  .gj-page {
    min-height: 420px;
  }
}

.gj-fade-leave-to {
  opacity: 0;
}
</style>