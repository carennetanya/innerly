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
        :class="{ active: currentStep === i, done: currentStep > i }"
        @click="currentStep > i ? (currentStep = i) : null"
        :title="s.title"
      >
        <span v-if="currentStep > i" class="gj-dot-check">✓</span>
        <span v-else>{{ i + 1 }}</span>
      </div>
    </div>

    <div class="gj-book">
      <div class="gj-spine"></div>

      <!-- LEFT PAGE (description / context) -->
      <div class="gj-page gj-page-left">
        <div class="gj-page-lines"><div v-for="i in 14" :key="i" class="gj-line"></div></div>
        <div class="gj-page-content">

          <div v-if="currentStep === 0" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step0tag }}</span>
            <h2 class="gj-page-title">{{ t.step0q }}</h2>
            <p class="gj-page-hint">{{ t.step0hint }}</p>
          </div>

          <div v-else-if="currentStep === 1" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step1tag }}</span>
            <h2 class="gj-page-title">{{ t.step1q }}</h2>
            <p class="gj-page-hint">{{ t.step1hint }}</p>
          </div>

          <div v-else-if="currentStep === 2" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step2tag }}</span>
            <h2 class="gj-page-title">{{ t.step2q }}</h2>
            <p class="gj-page-hint">{{ t.step2hint }}</p>
            <div v-if="answers.mood" class="gj-page-summary">
              <img v-if="answers.moodImg" :src="answers.moodImg" :alt="answers.mood" width="48" height="48" />
              <p class="gj-page-selected">{{ answers.mood }}</p>
            </div>
          </div>

          <div v-else-if="currentStep === 3" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step3tag }}</span>
            <h2 class="gj-page-title">{{ t.step3q }}</h2>
            <p class="gj-page-hint">{{ t.step3hint }}</p>
          </div>

          <div v-else-if="currentStep === 4" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step4tag }}</span>
            <h2 class="gj-page-title">{{ t.step4q }}</h2>
            <p class="gj-page-hint">{{ t.step4hint }}</p>
          </div>

          <div v-else-if="currentStep === 5" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step5tag }}</span>
            <h2 class="gj-page-title">{{ t.step5q }}</h2>
            <p class="gj-page-hint">{{ t.step5hint }}</p>
          </div>

          <div v-else-if="currentStep === 6" class="gj-side-panel">
            <span class="gj-layer-tag">{{ t.step6tag }}</span>
            <h2 class="gj-page-title">{{ t.step6q }}</h2>
            <p class="gj-page-hint">{{ t.step6hint }}</p>
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

      <!-- RIGHT PAGE (input) -->
      <div class="gj-page gj-page-right">
        <div class="gj-page-lines"><div v-for="i in 14" :key="i" class="gj-line"></div></div>
        <div class="gj-page-content">

          <!-- Step 0: Title -->
          <div v-if="currentStep === 0" class="gj-step-content">
            <input
              v-model="answers.title"
              class="gj-title-input"
              :placeholder="t.step0ph"
              type="text"
              autofocus
            />
            <div class="gj-char-count">{{ t.step0chars(answers.title.length) }}</div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="$emit('back')">{{ t.step0back }}</button>
              <button class="gj-btn-next" :disabled="answers.title.trim().length < 3" @click="currentStep = 1">{{ t.nextBtn }}</button>
            </div>
          </div>

          <!-- Step 1: Description -->
          <div v-else-if="currentStep === 1" class="gj-step-content">
            <textarea v-model="answers.description" class="gj-textarea" :placeholder="t.step1ph" rows="6"></textarea>
            <div class="gj-char-count">{{ t.step1chars(answers.description.length) }}</div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="currentStep = 0">{{ t.step1back }}</button>
              <button class="gj-btn-next" :disabled="answers.description.trim().length < 5" @click="currentStep = 2">{{ t.nextBtn }}</button>
            </div>
          </div>

          <!-- Step 2: Feeling -->
          <div v-else-if="currentStep === 2" class="gj-step-content">
            <div class="gj-mood-grid">
              <button v-for="m in moodOptions" :key="m.label" class="gj-mood-btn"
                :class="{ selected: answers.mood === m.label }" :style="{ '--mc': m.color }"
                @click="selectMood(m.label)">
                <span class="gj-mood-emoji"><img :src="m.img" :alt="m.label" width="38" height="38" /></span>
                <span class="gj-mood-label">{{ m.label }}</span>
              </button>
            </div>
            <div class="gj-note-card">
              <label class="gj-note-label">{{ t.step2feelingLabel }}</label>
              <textarea v-model="answers.feeling" class="gj-textarea gj-textarea-sm" :placeholder="t.step2feelingPh" rows="3"></textarea>
            </div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="currentStep = 1">{{ t.step2back }}</button>
              <button class="gj-btn-next" :disabled="!answers.mood" @click="currentStep = 3">{{ t.nextBtn }}</button>
            </div>
          </div>

          <!-- Step 3: Evaluation -->
          <div v-else-if="currentStep === 3" class="gj-step-content">
            <div class="gj-two-cols">
              <div class="gj-col gj-col-good">
                <div class="gj-col-header">
                  <span class="gj-col-icon">✅</span>
                  <span class="gj-col-title">{{ t.step3pos }}</span>
                </div>
                <textarea v-model="answers.wentWell" class="gj-textarea gj-textarea-sm" :placeholder="t.step3posph" rows="4"></textarea>
              </div>
              <div class="gj-col gj-col-improve">
                <div class="gj-col-header">
                  <span class="gj-col-icon">🔧</span>
                  <span class="gj-col-title">{{ t.step3neg }}</span>
                </div>
                <textarea v-model="answers.improve" class="gj-textarea gj-textarea-sm" :placeholder="t.step3negph" rows="4"></textarea>
              </div>
            </div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="currentStep = 2">{{ t.step3back }}</button>
              <button class="gj-btn-next"
                :disabled="answers.wentWell.trim().length < 3 && answers.improve.trim().length < 3"
                @click="currentStep = 4">{{ t.nextBtn }}</button>
            </div>
          </div>

          <!-- Step 4: Analysis -->
          <div v-else-if="currentStep === 4" class="gj-step-content">
            <textarea v-model="answers.analysis" class="gj-textarea" :placeholder="t.step4ph" rows="7"></textarea>
            <div class="gj-char-count">{{ answers.analysis.length }} {{ t.chars }}</div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="currentStep = 3">{{ t.step4back }}</button>
              <button class="gj-btn-next" :disabled="answers.analysis.trim().length < 5" @click="currentStep = 5">{{ t.nextBtn }}</button>
            </div>
          </div>

          <!-- Step 5: Conclusion -->
          <div v-else-if="currentStep === 5" class="gj-step-content">
            <textarea v-model="answers.conclusion" class="gj-textarea" :placeholder="t.step5ph" rows="7"></textarea>
            <div class="gj-char-count">{{ answers.conclusion.length }} {{ t.chars }}</div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="currentStep = 4">{{ t.step5back }}</button>
              <button class="gj-btn-next" :disabled="answers.conclusion.trim().length < 5" @click="currentStep = 6">{{ t.nextBtn }}</button>
            </div>
          </div>

          <!-- Step 6: Action Plan -->
          <div v-else-if="currentStep === 6" class="gj-step-content">
            <div class="gj-commitment-wrap">
              <span class="gj-commitment-prefix">{{ t.step6prefix }}</span>
              <textarea v-model="answers.action" class="gj-textarea gj-textarea-commitment" :placeholder="t.step6ph" rows="4"></textarea>
            </div>
            <div class="gj-checklist" v-if="answers.action.trim().length > 0">
              <div class="gj-checklist-item">
                <input type="checkbox" v-model="actionCommitted" id="commit-check" class="gj-check-input" />
                <label for="commit-check" class="gj-check-label">{{ t.step6commit }}</label>
              </div>
            </div>
            <div class="gj-actions">
              <button class="gj-btn-back" @click="currentStep = 5">{{ t.step6back }}</button>
              <button class="gj-btn-next gj-btn-finish" :disabled="answers.action.trim().length < 5" @click="finishReflection">{{ t.step6finish }}</button>
            </div>
          </div>

          <!-- Summary -->
          <div v-else class="gj-summary-content">
            <div class="gj-summary-body">
              <div class="gj-summary-title-box" v-if="answers.title">
                <div class="gj-summary-section-label">{{ t.sum0label }}</div>
                <div class="gj-summary-title-text">{{ answers.title }}</div>
              </div>
              <div class="gj-summary-section" v-if="answers.description">
                <div class="gj-summary-section-label">{{ t.sum1label }}</div>
                <div class="gj-summary-section-text">{{ answers.description }}</div>
              </div>
              <div class="gj-summary-section" v-if="answers.mood">
                <div class="gj-summary-section-label">{{ t.sum2label }}</div>
                <div class="gj-summary-section-text">
                  <img v-if="answers.moodImg" :src="answers.moodImg" :alt="answers.mood" width="28" height="28" style="vertical-align:middle;margin-right:6px;" />
                  {{ answers.mood }}
                </div>
                <div v-if="answers.feeling" class="gj-summary-note">{{ answers.feeling }}</div>
              </div>
              <div class="gj-summary-two-col" v-if="answers.wentWell || answers.improve">
                <div class="gj-summary-mini" v-if="answers.wentWell">
                  <div class="gj-summary-section-label">{{ t.sum3pos }}</div>
                  <div class="gj-summary-section-text">{{ answers.wentWell }}</div>
                </div>
                <div class="gj-summary-mini" v-if="answers.improve">
                  <div class="gj-summary-section-label">{{ t.sum3neg }}</div>
                  <div class="gj-summary-section-text">{{ answers.improve }}</div>
                </div>
              </div>
              <div class="gj-summary-section" v-if="answers.analysis">
                <div class="gj-summary-section-label">{{ t.sum4label }}</div>
                <div class="gj-summary-section-text">{{ answers.analysis }}</div>
              </div>
              <div class="gj-summary-section" v-if="answers.conclusion">
                <div class="gj-summary-section-label">{{ t.sum5label }}</div>
                <div class="gj-summary-section-text">{{ answers.conclusion }}</div>
              </div>
              <div class="gj-summary-action-box" v-if="answers.action">
                <div class="gj-summary-action-label">{{ t.sum6label }}</div>
                <div class="gj-summary-action-text">{{ t.step6prefix }} {{ answers.action }}</div>
                <div class="gj-summary-committed" v-if="actionCommitted"><span>{{ t.sumCommitted }}</span></div>
              </div>
            </div>
            <div class="gj-summary-actions">
              <button class="gj-btn-save" @click="saveReminder" v-if="answers.action">{{ t.sumSave }}</button>
              <button class="gj-btn-new" @click="startNew">{{ t.sumNew }}</button>
              <button class="gj-btn-back-dash" @click="$emit('back')">{{ t.sumBack }}</button>
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
import { ref, computed } from "vue";
import { authService } from "../services/auth.js";
import { commitmentService } from "../services/commitment.js";

const props = defineProps({
  isDark: Boolean,
  initialTrigger: { type: String, default: "" },
  lang: { type: String, default: "en" },
});

const gjI18n = {
  en: {
    step0tag: "Title",
    step0q: "What title best describes your experience?",
    step0hint: "Give your reflection a name — it helps you own the experience.",
    step0ph: "e.g. My first presentation at work...",
    step0chars: (n) => `${n} characters`,
    step0back: "← Back",
    step1tag: "Question 1 · Description",
    step1q: "What exactly happened to me?",
    step1hint: "Where and when did it happen, who was involved, and what did you do?",
    step1ph: "Describe the situation as objectively and completely as possible...",
    step1chars: (n) => `${n} characters`,
    step1back: "← Back",
    step2tag: "Question 2 · Feeling",
    step2q: "What was I feeling during that situation?",
    step2hint: "Select the mood that best fits, then describe your feelings in words.",
    step2feelingLabel: "Describe your feelings in words",
    step2feelingPh: "What emotions were present? How did your body feel?",
    step2back: "← Back",
    step3tag: "Question 3 · Evaluation",
    step3q: "What did I contribute to the situation, both positively and negatively?",
    step3hint: "Reflect on your own role — be honest about both sides.",
    step3pos: "✅ Positive contribution",
    step3posph: "What did you contribute positively to this situation?",
    step3neg: "🔧 Negative contribution",
    step3negph: "What did you contribute negatively or could have done better?",
    step3back: "← Back",
    step4tag: "Question 4 · Analysis",
    step4q: "What do I know that can help me understand this better?",
    step4hint: "Draw on theory, academic literature, or insights from others.",
    step4ph: "What knowledge or frameworks help explain what happened here?",
    step4back: "← Back",
    chars: "characters",
    step5tag: "Question 5 · Conclusion",
    step5q: "What did I learn about myself and this situation?",
    step5hint: "Summarise the key lessons from this experience.",
    step5ph: "The most important thing I learned from this experience is...",
    step5back: "← Back",
    step6tag: "Question 6 · Action Plan",
    step6q: "If I faced a similar situation again, what would I do differently?",
    step6hint: "Make a concrete commitment for next time.",
    step6prefix: "Next time, I will",
    step6ph: "...prepare more thoroughly, ask for help earlier, or communicate more clearly.",
    step6commit: "I commit to this! 💪",
    step6back: "← Back",
    step6finish: "Finish Reflection 🎉",
    nextBtn: "Next",
    sumTitle: "Reflection Complete!",
    sumSub: "You've completed the Gibbs Reflective Cycle. Be proud of yourself! 🙌",
    sum0label: "📌 Title",
    sum1label: "📖 Description",
    sum2label: "💜 Feeling",
    sum3pos: "✅ Positive contribution",
    sum3neg: "🔧 Negative contribution",
    sum4label: "🔍 Analysis",
    sum5label: "💡 Conclusion",
    sum6label: "🎯 Action Plan",
    sumCommitted: "✅ You are committed!",
    sumSave: "🔔 Save as reminder",
    sumNew: "✨ Start a new reflection",
    sumBack: "← Back to Garden",
    savedToast: "🔔 Reminder saved!",
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
    step0tag: "Judul",
    step0q: "Judul apa yang paling menggambarkan pengalamanmu?",
    step0hint: "Beri nama refleksimu — ini membantu kamu memiliki pengalaman itu.",
    step0ph: "cth. Presentasi pertamaku di tempat kerja...",
    step0chars: (n) => `${n} karakter`,
    step0back: "← Kembali",
    step1tag: "Pertanyaan 1 · Deskripsi",
    step1q: "Apa yang sebenarnya terjadi padaku?",
    step1hint: "Di mana dan kapan itu terjadi, siapa yang terlibat, dan apa yang kamu lakukan?",
    step1ph: "Deskripsikan situasinya seobjektif dan selengkap mungkin...",
    step1chars: (n) => `${n} karakter`,
    step1back: "← Kembali",
    step2tag: "Pertanyaan 2 · Perasaan",
    step2q: "Apa yang aku rasakan selama situasi itu?",
    step2hint: "Pilih mood yang paling cocok, lalu gambarkan perasaanmu dengan kata-kata.",
    step2feelingLabel: "Gambarkan perasaanmu dengan kata-kata",
    step2feelingPh: "Emosi apa yang muncul? Bagaimana tubuhmu merasakannya?",
    step2back: "← Kembali",
    step3tag: "Pertanyaan 3 · Evaluasi",
    step3q: "Apa kontribusiku pada situasi ini, baik positif maupun negatif?",
    step3hint: "Renungkan peranmu sendiri — jujur terhadap kedua sisi.",
    step3pos: "✅ Kontribusi positif",
    step3posph: "Apa yang kamu kontribusikan secara positif dalam situasi ini?",
    step3neg: "🔧 Kontribusi negatif",
    step3negph: "Apa yang kamu kontribusikan secara negatif atau bisa dilakukan lebih baik?",
    step3back: "← Kembali",
    step4tag: "Pertanyaan 4 · Analisis",
    step4q: "Apa yang aku ketahui yang bisa membantuku memahami ini lebih baik?",
    step4hint: "Manfaatkan teori, literatur akademik, atau wawasan dari orang lain.",
    step4ph: "Pengetahuan atau kerangka apa yang membantu menjelaskan apa yang terjadi?",
    step4back: "← Kembali",
    chars: "karakter",
    step5tag: "Pertanyaan 5 · Kesimpulan",
    step5q: "Apa yang aku pelajari tentang diriku dan situasi ini?",
    step5hint: "Rangkum pelajaran utama dari pengalaman ini.",
    step5ph: "Hal terpenting yang aku pelajari dari pengalaman ini adalah...",
    step5back: "← Kembali",
    step6tag: "Pertanyaan 6 · Rencana Tindakan",
    step6q: "Jika aku menghadapi situasi serupa lagi, apa yang akan aku lakukan berbeda?",
    step6hint: "Buat komitmen konkret untuk lain kali.",
    step6prefix: "Lain kali, aku akan",
    step6ph: "...mempersiapkan lebih matang, meminta bantuan lebih awal, atau berkomunikasi lebih jelas.",
    step6commit: "Aku berkomitmen untuk ini! 💪",
    step6back: "← Kembali",
    step6finish: "Selesaikan Refleksi 🎉",
    nextBtn: "Lanjut",
    sumTitle: "Refleksi Selesai!",
    sumSub: "Kamu telah menyelesaikan Gibbs Reflective Cycle. Bangga dengan dirimu! 🙌",
    sum0label: "📌 Judul",
    sum1label: "📖 Deskripsi",
    sum2label: "💜 Perasaan",
    sum3pos: "✅ Kontribusi positif",
    sum3neg: "🔧 Kontribusi negatif",
    sum4label: "🔍 Analisis",
    sum5label: "💡 Kesimpulan",
    sum6label: "🎯 Rencana Tindakan",
    sumCommitted: "✅ Kamu sudah berkomitmen!",
    sumSave: "🔔 Simpan sebagai pengingat",
    sumNew: "✨ Mulai refleksi baru",
    sumBack: "← Kembali ke Kebun",
    savedToast: "🔔 Pengingat disimpan!",
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
const actionCommitted = ref(false);
const savedToast = ref(false);

const steps = [
  { title: "Title" },
  { title: "Description" },
  { title: "Feeling" },
  { title: "Evaluation" },
  { title: "Analysis" },
  { title: "Conclusion" },
  { title: "Action Plan" },
  { title: "Summary" },
];

const answers = ref({
  title: "",
  description: props.initialTrigger || "",
  mood: "",
  moods: [],
  moodImg: "",
  feeling: "",
  wentWell: "",
  improve: "",
  analysis: "",
  conclusion: "",
  action: "",
});

const progressPct = computed(() => (currentStep.value / (steps.length - 1)) * 100);
const pageNumber = computed(() => currentStep.value + 1);
const leftPageNumber = computed(() => currentStep.value === 0 ? "i" : pageNumber.value);
const rightPageNumber = computed(() => currentStep.value === 0 ? "1" : pageNumber.value);

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

async function finishReflection() {
  currentStep.value = 7;
  if (actionCommitted.value && answers.value.action.trim()) {
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
  // Emit with backward-compat aliases so DashboardView/App.vue keep working
  emit("done", {
    ...answers.value,
    trigger: answers.value.description,
    insight: answers.value.analysis,
    committed: actionCommitted.value,
  });
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
    title: "",
    description: "",
    mood: "",
    moods: [],
    moodImg: "",
    feeling: "",
    wentWell: "",
    improve: "",
    analysis: "",
    conclusion: "",
    action: "",
  };
  actionCommitted.value = false;
  currentStep.value = 0;
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
  background: #2a2245;
  border-color: rgba(167, 139, 250, 0.6);
  color: rgba(230, 220, 255, 1);
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

/* ── Title input ── */
.gj-title-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px solid rgba(124, 108, 168, 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  font-family: "Outfit", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2d1f6e;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.gj-title-input:focus {
  border-color: #7c6ca8;
  box-shadow: 0 0 0 3px rgba(124, 108, 168, 0.12);
}
.gj-wrap.is-dark .gj-title-input {
  background: rgba(30, 20, 50, 0.6);
  color: #ede8ff;
  border-color: rgba(167, 139, 250, 0.2);
}
/* ── Summary title box ── */
.gj-summary-title-box {
  background: var(--accent-soft, rgba(124,108,168,0.08));
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 4px;
}
.gj-summary-title-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--accent, #5b4a9a);
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