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
        @click="currentStep > i ? currentStep = i : null"
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
          <span class="gj-layer-tag">Langkah 1 · The Trigger</span>
          <span class="gj-layer-emoji">🌱</span>
        </div>
        <h2 class="gj-question">Apa satu hal yang ingin kamu refleksikan hari ini?</h2>
        <p class="gj-hint">Tuangkan kejadian apa saja — tidak harus sempurna.</p>
        <textarea
          v-model="answers.trigger"
          class="gj-textarea"
          placeholder="Contoh: Hari ini presentasi di kelas terasa kurang maksimal..."
          rows="5"
          autofocus
        ></textarea>
        <div class="gj-char-count">{{ answers.trigger.length }} karakter</div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="$emit('back')">← Dashboard</button>
          <button
            class="gj-btn-next"
            :disabled="answers.trigger.trim().length < 5"
            @click="currentStep = 1"
          >
            Lanjut <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 2: THE MOOD ═══════ -->
      <div v-else-if="currentStep === 1" key="step1" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">Langkah 2 · The Mood</span>
          <span class="gj-layer-emoji">💜</span>
        </div>
        <h2 class="gj-question">Gimana perasaanmu pas kejadian itu?</h2>
        <p class="gj-hint">Pilih satu atau lebih yang paling menggambarkan perasaanmu.</p>
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
          <span class="gj-mood-selected-label">Kamu memilih:</span>
          <span
            v-for="m in answers.moods"
            :key="m"
            class="gj-mood-tag"
          >{{ moodOptions.find(x => x.label === m)?.emoji }} {{ m }}</span>
        </div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 0">← Kembali</button>
          <button
            class="gj-btn-next"
            :disabled="answers.moods.length === 0"
            @click="currentStep = 2"
          >
            Lanjut <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 3: THE EVALUATION ═══════ -->
      <div v-else-if="currentStep === 2" key="step2" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">Langkah 3 · The Evaluation</span>
          <span class="gj-layer-emoji">⚖️</span>
        </div>
        <h2 class="gj-question">Apa yang berjalan lancar, dan apa yang terasa mengganjal?</h2>
        <p class="gj-hint">Pisahkan fakta dari perasaan — tulis apa adanya.</p>
        <div class="gj-two-cols">
          <div class="gj-col gj-col-good">
            <div class="gj-col-header">
              <span class="gj-col-icon">✅</span>
              <span class="gj-col-title">Yang berjalan baik</span>
            </div>
            <textarea
              v-model="answers.wentWell"
              class="gj-textarea gj-textarea-sm"
              placeholder="Contoh: Materi yang aku bawakan sudah runtut dan jelas..."
              rows="4"
            ></textarea>
          </div>
          <div class="gj-col gj-col-improve">
            <div class="gj-col-header">
              <span class="gj-col-icon">🔧</span>
              <span class="gj-col-title">Yang perlu diperbaiki</span>
            </div>
            <textarea
              v-model="answers.improve"
              class="gj-textarea gj-textarea-sm"
              placeholder="Contoh: Aku kurang latihan dan terlalu gugup saat sesi tanya jawab..."
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 1">← Kembali</button>
          <button
            class="gj-btn-next"
            :disabled="answers.wentWell.trim().length < 3 && answers.improve.trim().length < 3"
            @click="currentStep = 3"
          >
            Lanjut <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 4: THE INSIGHT ═══════ -->
      <div v-else-if="currentStep === 3" key="step3" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">Langkah 4 · The Insight</span>
          <span class="gj-layer-emoji">💡</span>
        </div>
        <h2 class="gj-question">Kalau dipikir lagi, kenapa hal itu bisa terjadi?</h2>
        <p class="gj-hint">Gali lebih dalam — cari akar penyebabnya, bukan cuma gejalanya.</p>
        <textarea
          v-model="answers.insight"
          class="gj-textarea"
          placeholder="Tulis pikiranmu di sini, atau klik 'Saran AI' untuk bantuan..."
          rows="5"
        ></textarea>
        <button
          class="gj-ai-btn"
          @click="fetchAiSuggestion"
          :disabled="aiLoading"
        >
          <span v-if="aiLoading" class="gj-ai-spinner">⟳</span>
          <span v-else>✨</span>
          {{ aiLoading ? 'Memuat saran...' : 'Saran AI' }}
        </button>
        <Transition name="gj-fade">
          <div v-if="aiSuggestion" class="gj-ai-suggestion">
            <div class="gj-ai-suggestion-header">
              <span>💬 Pertanyaan dari AI untuk membantumu berefleksi:</span>
              <button class="gj-ai-close" @click="aiSuggestion = ''">&times;</button>
            </div>
            <p class="gj-ai-suggestion-text">{{ aiSuggestion }}</p>
            <button class="gj-ai-use-btn" @click="answers.insight = answers.insight ? answers.insight + '\n\n' + aiSuggestion : aiSuggestion; aiSuggestion = ''">
              Gunakan sebagai panduan
            </button>
          </div>
        </Transition>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 2">← Kembali</button>
          <button
            class="gj-btn-next"
            :disabled="answers.insight.trim().length < 5"
            @click="currentStep = 4"
          >
            Lanjut <span class="gj-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 5: THE ACTION PLAN ═══════ -->
      <div v-else-if="currentStep === 4" key="step4" class="gj-card">
        <div class="gj-card-header">
          <span class="gj-layer-tag">Langkah 5 · The Action Plan</span>
          <span class="gj-layer-emoji">🎯</span>
        </div>
        <h2 class="gj-question">Jadi, apa satu hal kecil yang akan kamu lakukan berbeda besok?</h2>
        <p class="gj-hint">Komitmen kecil yang konsisten lebih kuat dari rencana besar yang tidak dijalankan.</p>
        <div class="gj-commitment-wrap">
          <span class="gj-commitment-prefix">Besok, aku akan</span>
          <textarea
            v-model="answers.action"
            class="gj-textarea gj-textarea-commitment"
            placeholder="...menyiapkan materi presentasi minimal H-1 dan berlatih keras di depan cermin."
            rows="3"
          ></textarea>
        </div>
        <div class="gj-checklist" v-if="answers.action.trim().length > 0">
          <div class="gj-checklist-item">
            <input type="checkbox" v-model="actionCommitted" id="commit-check" class="gj-check-input" />
            <label for="commit-check" class="gj-check-label">
              Aku berkomitmen untuk melakukan ini besok! 💪
            </label>
          </div>
        </div>
        <div class="gj-actions">
          <button class="gj-btn-back" @click="currentStep = 3">← Kembali</button>
          <button
            class="gj-btn-next gj-btn-finish"
            :disabled="answers.action.trim().length < 5"
            @click="finishReflection"
          >
            Selesaikan Refleksi 🎉
          </button>
        </div>
      </div>

      <!-- ═══════ LAYER 6: THE SUMMARY ═══════ -->
      <div v-else-if="currentStep === 5" key="step5" class="gj-card gj-summary-card">
        <div class="gj-confetti-wrap">
          <span v-for="i in 12" :key="i" class="gj-confetti-piece" :style="getConfettiStyle(i)"></span>
        </div>
        <div class="gj-summary-hero">
          <div class="gj-summary-icon">🌟</div>
          <h2 class="gj-summary-title">Refleksi Selesai!</h2>
          <p class="gj-summary-sub">Kamu sudah selangkah lebih maju hari ini. Bangga dengan dirimu sendiri! 🙌</p>
        </div>

        <div class="gj-summary-body">
          <div class="gj-summary-section" v-if="answers.trigger">
            <div class="gj-summary-section-label">🌱 Apa yang direfleksikan</div>
            <div class="gj-summary-section-text">{{ answers.trigger }}</div>
          </div>
          <div class="gj-summary-section" v-if="answers.moods.length">
            <div class="gj-summary-section-label">💜 Perasaan saat itu</div>
            <div class="gj-summary-moods-row">
              <span v-for="m in answers.moods" :key="m" class="gj-summary-mood-tag">
                {{ moodOptions.find(x => x.label === m)?.emoji }} {{ m }}
              </span>
            </div>
          </div>
          <div class="gj-summary-two-col" v-if="answers.wentWell || answers.improve">
            <div class="gj-summary-mini" v-if="answers.wentWell">
              <div class="gj-summary-section-label">✅ Yang berjalan baik</div>
              <div class="gj-summary-section-text">{{ answers.wentWell }}</div>
            </div>
            <div class="gj-summary-mini" v-if="answers.improve">
              <div class="gj-summary-section-label">🔧 Yang perlu diperbaiki</div>
              <div class="gj-summary-section-text">{{ answers.improve }}</div>
            </div>
          </div>
          <div class="gj-summary-section" v-if="answers.insight">
            <div class="gj-summary-section-label">💡 Insight</div>
            <div class="gj-summary-section-text">{{ answers.insight }}</div>
          </div>
          <div class="gj-summary-action-box" v-if="answers.action">
            <div class="gj-summary-action-label">🎯 Komitmen Aksi Besok</div>
            <div class="gj-summary-action-text">Besok, aku akan {{ answers.action }}</div>
            <div class="gj-summary-committed" v-if="actionCommitted">
              <span>✅ Kamu sudah berkomitmen!</span>
            </div>
          </div>
        </div>

        <div class="gj-summary-actions">
          <button class="gj-btn-save" @click="saveReminder" v-if="answers.action && actionCommitted">
            🔔 Simpan sebagai pengingat besok
          </button>
          <button class="gj-btn-new" @click="startNew">
            ✨ Mulai refleksi baru
          </button>
          <button class="gj-btn-back-dash" @click="$emit('back')">
            ← Kembali ke Dashboard
          </button>
        </div>

        <div class="gj-saved-toast" v-if="savedToast">
          🔔 Pengingat disimpan! Cek besok di Reminders.
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  isDark: Boolean,
  initialTrigger: { type: String, default: '' },
});
const emit = defineEmits(['back', 'done']);

const currentStep = ref(0);
const aiLoading = ref(false);
const aiSuggestion = ref('');
const actionCommitted = ref(false);
const savedToast = ref(false);

const steps = [
  { title: 'The Trigger' },
  { title: 'The Mood' },
  { title: 'The Evaluation' },
  { title: 'The Insight' },
  { title: 'The Action Plan' },
  { title: 'Summary' },
];

const answers = ref({
  trigger: props.initialTrigger || '',
  moods: [],
  wentWell: '',
  improve: '',
  insight: '',
  action: '',
});

const moodOptions = [
  { emoji: '😊', label: 'Senang', color: '#f5a623' },
  { emoji: '😔', label: 'Sedih', color: '#7c6ca8' },
  { emoji: '😰', label: 'Cemas', color: '#e67e22' },
  { emoji: '😤', label: 'Marah', color: '#e74c3c' },
  { emoji: '😕', label: 'Bingung', color: '#3498db' },
  { emoji: '🤩', label: 'Bangga', color: '#f39c12' },
  { emoji: '😌', label: 'Tenang', color: '#6ab04c' },
  { emoji: '😴', label: 'Lelah', color: '#95a5a6' },
];

const progressPct = computed(() => (currentStep.value / (steps.length - 1)) * 100);

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
  aiSuggestion.value = '';
  try {
    const context = `
Trigger: ${answers.value.trigger}
Mood: ${answers.value.moods.join(', ')}
Went well: ${answers.value.wentWell}
Needs improvement: ${answers.value.improve}
    `.trim();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Kamu adalah asisten refleksi diri yang empatik dan bijaksana. 
Bantu pengguna menggali insight lebih dalam tentang pengalaman mereka menggunakan Gibbs' Reflective Cycle.
Berikan 2-3 pertanyaan pemandu yang membantu mereka menemukan akar penyebab dari kejadian tersebut.
Gunakan bahasa Indonesia yang hangat dan supportif.
Jawaban harus singkat (3-4 kalimat), berupa pertanyaan-pertanyaan reflektif, BUKAN jawaban langsung.
Jangan gunakan markdown atau bullet points.`,
        messages: [
          {
            role: 'user',
            content: `Tolong bantu aku berefleksi berdasarkan konteks ini:\n\n${context}\n\nBerikan beberapa pertanyaan pemandu untuk membantu aku menggali kenapa hal ini bisa terjadi.`
          }
        ]
      })
    });
    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';
    aiSuggestion.value = text.trim();
  } catch (e) {
    aiSuggestion.value = 'Apakah kamu merasa kurang persiapan, atau ada faktor eksternal di luar kendalimu? Apa yang akan kamu lakukan berbeda jika menghadapi situasi ini lagi?';
  } finally {
    aiLoading.value = false;
  }
}

function finishReflection() {
  currentStep.value = 5;
  emit('done', { ...answers.value });
}

function saveReminder() {
  savedToast.value = true;
  setTimeout(() => (savedToast.value = false), 3500);
}

function startNew() {
  answers.value = { trigger: '', moods: [], wentWell: '', improve: '', insight: '', action: '' };
  actionCommitted.value = false;
  aiSuggestion.value = '';
  currentStep.value = 0;
}

function getConfettiStyle(i) {
  const colors = ['#a78bfa', '#f5a623', '#6ab04c', '#e74c3c', '#3498db', '#f39c12'];
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
  transition: border-color 0.2s, box-shadow 0.2s;
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
  box-shadow: 0 4px 14px color-mix(in srgb, var(--mc, var(--accent)) 25%, transparent);
}
.gj-mood-btn.selected {
  background: color-mix(in srgb, var(--mc, var(--accent)) 12%, var(--bg-card));
  border-color: var(--mc, var(--accent));
  box-shadow: 0 2px 10px color-mix(in srgb, var(--mc, var(--accent)) 20%, transparent);
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  0% { top: -5%; opacity: 1; transform: rotate(0deg) scale(1); }
  100% { top: 110%; opacity: 0; transform: rotate(540deg) scale(0.5); }
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
  from { transform: scale(0); }
  to { transform: scale(1); }
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
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Transitions ── */
.gj-slide-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.gj-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
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
  transition: opacity 0.3s ease, transform 0.3s ease;
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
