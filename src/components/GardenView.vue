<template>
  <div class="kb-wrap">
    <!-- Header -->
    <div class="kb-header">
      <!-- Left: Profile + Hi Name -->
      <div class="kb-header-left">
        <div class="kb-profile-btn" @click="toggleProfile" ref="profileBtnRef">
          <div class="kb-avatar">
            {{ props.userName ? props.userName[0].toUpperCase() : 'A' }}
          </div>
        </div>
        <span class="kb-hi-name">Hi, {{ props.userName || 'there' }} 👋</span>
      </div>

      <!-- Center: Brand -->
      <div class="kb-brand">
        <img src="/logo.png" alt="Innerly" class="kb-logo" />
        <span class="kb-brand-name">Innerly</span>
      </div>

      <!-- Right: Streak -->
      <div class="kb-streak-container">
  <div class="kb-streak-main">
    <span class="kb-streak-fire">🔥</span>
    <span class="kb-streak-num">{{ streakDays }}</span>
  </div>
  <div class="kb-progress-box">
    <div class="kb-progress-track">
      <div class="kb-progress-fill" :style="{ width: streakProgress + '%' }"></div>
    </div>
  </div>
</div>
    </div>

    <!-- Profile Dropdown -->
    <Transition name="profile-drop">
      <div class="kb-profile-dropdown" v-if="profileOpen" ref="profileDropRef">
        <div class="kb-profile-header">
          <div class="kb-profile-avatar-lg">
            {{ props.userName ? props.userName[0].toUpperCase() : 'A' }}
          </div>
          <div class="kb-profile-info">
            <div class="kb-profile-username">{{ userUsername || props.userName || 'User' }}</div>
            <div class="kb-profile-email">{{ userEmail }}</div>
          </div>
        </div>
        <div class="kb-profile-divider"></div>
        <div class="kb-profile-section">
          <div class="kb-profile-field-label">Email</div>
          <div class="kb-profile-field-value">{{ userEmail }}</div>
          <button class="kb-profile-change-btn" @click="showChangeEmail = !showChangeEmail">
            {{ showChangeEmail ? 'Cancel' : 'Change Email' }}
          </button>
          <div class="kb-profile-edit-row" v-if="showChangeEmail">
            <input class="kb-profile-input" v-model="newEmail" type="email" placeholder="New email address" />
            <button class="kb-profile-save-btn" @click="saveEmail">Save</button>
          </div>
        </div>
        <div class="kb-profile-divider"></div>
        <div class="kb-profile-section">
          <div class="kb-profile-field-label">Password</div>
          <div class="kb-profile-field-value">••••••••</div>
          <button class="kb-profile-change-btn" @click="showChangePassword = !showChangePassword">
            {{ showChangePassword ? 'Cancel' : 'Change Password' }}
          </button>
          <div class="kb-profile-edit-row" v-if="showChangePassword" style="flex-direction:column;gap:0;align-items:stretch;">
            <input class="kb-profile-input" v-model="newPassword" type="password" placeholder="New password" />
            <input class="kb-profile-input" v-model="confirmPassword" type="password" placeholder="Confirm password" style="margin-top: 6px;" />
            <button class="kb-profile-save-btn" @click="savePassword" style="margin-top:10px;">Save</button>
            <div v-if="passwordError" class="kb-profile-error">{{ passwordError }}</div>
          </div>
        </div>
        <div class="kb-profile-divider"></div>
        <button class="kb-profile-logout-btn" @click="profileOpen = false">Close</button>
      </div>
    </Transition>

    <!-- Month navigation bar -->
    <div class="kb-month-bar">
      <button class="kb-nav-btn" @click="prevMonth">&#8249;</button>
      <span class="kb-month-title">{{ monthLabel }}</span>
      <button class="kb-nav-btn" @click="nextMonth">&#8250;</button>
    </div>

    <!-- Calendar grid -->
    <div class="kb-calendar">
      <!-- Day labels -->
      <div class="kb-day-label" v-for="d in dayLabels" :key="d">{{ d }}</div>

      <!-- Blank cells before first day -->
      <div v-for="i in firstDayOfWeek" :key="'blank-' + i" class="kb-cell kb-cell-blank"></div>

      <!-- Day cells -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="kb-cell"
        :class="{
          'kb-cell-today': isToday(day),
          'kb-cell-future': isFuture(day),
          'kb-cell-has-reflection': getDayReflections(day).length > 0,
        }"
        @click="onCellClick(day)"
      >
        <span class="kb-day-num">{{ day }}</span>

        <!-- Flowers for this day -->
        <div class="kb-flowers" v-if="getDayReflections(day).length > 0">
          <div
            v-for="(ref, ri) in getDayReflections(day)"
            :key="ri"
            class="kb-flower-wrap"
            @click.stop="openPopup(day, ri)"
          >
            <img
              v-if="getMoodImage(ref.mood)"
              :src="getMoodImage(ref.mood)"
              :alt="ref.mood"
              class="kb-mood-img"
            />
            <span v-else class="kb-flower-emoji">🌱</span>
          </div>
        </div>

        <!-- Empty plot (today, no reflection yet) -->
          <div class="kb-plot" v-else-if="!isFuture(day)">
            <img src="/dirt.png" alt="dirt" class="kb-dirt-img kb-dirt-img-large" />
          </div>
      </div>
    </div>

    <!-- FAB add button -->
    <div class="kb-fab-wrap">
      <button class="kb-fab" @click="$emit('start-journal')" :title="lang === 'id' ? 'Tambah Refleksi' : 'Add Reflection'">
        <span class="kb-fab-plus">+</span>
      </button>
      <span class="kb-fab-label">{{ lang === 'id' ? 'Tambah Refleksi' : 'Add Reflection' }}</span>
    </div>

    <!-- Popup -->
    <Transition name="kb-popup">
      <div class="kb-popup-overlay" v-if="popup.show" @click.self="closePopup">
        <div class="kb-popup">
          <div class="kb-popup-header">
            <span class="kb-popup-title">
              {{ lang === 'id' ? 'Refleksi' : 'Reflection' }} {{ popup.day }} {{ shortMonthLabel }}:
              {{ popup.reflection?.trigger?.slice(0, 28) }}{{ (popup.reflection?.trigger?.length ?? 0) > 28 ? '…' : '' }}
            </span>
            <button class="kb-popup-close" @click="closePopup">✕</button>
          </div>
          <div class="kb-popup-body" v-if="popup.reflection">
            <div class="kb-popup-row" v-if="popup.reflection.mood">
              <span class="kb-popup-label">{{ lang === 'id' ? 'Mood' : 'Mood' }}:</span>
              <span class="kb-popup-mood">
                <img v-if="getMoodImage(popup.reflection.mood)" :src="getMoodImage(popup.reflection.mood)" :alt="popup.reflection.mood" class="kb-popup-mood-img" />
                {{ popup.reflection.mood }}
              </span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.trigger">
              <span class="kb-popup-label">{{ lang === 'id' ? 'Kejadian' : 'What happened' }}:</span>
              <span>{{ popup.reflection.trigger }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.wentWell">
              <span class="kb-popup-label">{{ lang === 'id' ? 'Yang baik' : 'Went well' }}:</span>
              <span>{{ popup.reflection.wentWell }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.improve">
              <span class="kb-popup-label">{{ lang === 'id' ? 'Perlu diperbaiki' : 'Improve' }}:</span>
              <span>{{ popup.reflection.improve }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.insight">
              <span class="kb-popup-label">{{ lang === 'id' ? 'Insight' : 'Insight' }}:</span>
              <span>{{ popup.reflection.insight }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.action">
              <span class="kb-popup-label">{{ lang === 'id' ? 'Action Plan' : 'Action Plan' }}:</span>
              <span>{{ popup.reflection.action }}</span>
            </div>
          </div>
          <button class="kb-popup-edit-btn" @click="$emit('start-journal'); closePopup()">
            {{ lang === 'id' ? 'Edit / Tambah Lagi' : 'Edit / Add More' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { authService } from '../services/auth.js'
onMounted(() => {
  const user = authService.getUser && authService.getUser()
  if (user) {
    userEmail.value = user.email || 'user@innerly.app'
    userUsername.value = user.username || ''
  }
})
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isDark: Boolean,
  lang: { type: String, default: 'id' },
  reflections: { type: Array, default: () => [] },
  streakDays: { type: Number, default: 0 },
  userName: { type: String, default: '' },
})

const emit = defineEmits(['start-journal'])

// Profile dropdown
const profileOpen = ref(false)
const profileBtnRef = ref(null)
const profileDropRef = ref(null)
const showChangeEmail = ref(false)
const showChangePassword = ref(false)
const newEmail = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const userEmail = ref('user@innerly.app')
const userUsername = ref('')

// Tambahkan ini di dalam script setup
const streakProgress = computed(() => {
  // Anggap milestone berikutnya adalah 3 hari
  const target = 3;
  const current = props.streakDays % target; 
  // Jika streak sudah 3, 6, 9... maka progres penuh (100%)
  return (current === 0 && props.streakDays > 0) ? 100 : (current / target) * 100;
});

function toggleProfile() {
  profileOpen.value = !profileOpen.value
  showChangeEmail.value = false
  showChangePassword.value = false
}

function saveEmail() {
  if (newEmail.value) {
    userEmail.value = newEmail.value
    // TODO: update email ke backend jika ada endpoint
    newEmail.value = ''
    showChangeEmail.value = false
  }
}

function savePassword() {
  if (!newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Password tidak boleh kosong.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Konfirmasi password tidak cocok.'
    return
  }
  // Simulasi update password
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
  showChangePassword.value = false
}

function handleOutsideClick(e) {
  if (profileOpen.value &&
      profileDropRef.value && !profileDropRef.value.contains(e.target) &&
      profileBtnRef.value && !profileBtnRef.value.contains(e.target)) {
    profileOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed

const dayLabels = computed(() =>
  props.lang === 'id'
    ? ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
)

const monthNames = {
  id: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
}
const shortMonthNames = {
  id: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'],
  en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
}

const monthLabel = computed(() => {
  const names = monthNames[props.lang] || monthNames.en
  return `${names[viewMonth.value]} ${viewYear.value}`
})
const shortMonthLabel = computed(() => {
  const names = shortMonthNames[props.lang] || shortMonthNames.en
  return names[viewMonth.value]
})

const daysInMonth = computed(() => {
  return new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(viewYear.value, viewMonth.value, 1).getDay()
})

function isToday(day) {
  return (
    today.getDate() === day &&
    today.getMonth() === viewMonth.value &&
    today.getFullYear() === viewYear.value
  )
}

function isFuture(day) {
  const d = new Date(viewYear.value, viewMonth.value, day)
  const t2 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return d > t2
}

function dateKey(day) {
  const m = String(viewMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${viewYear.value}-${m}-${d}`
}

function getDayReflections(day) {
  const key = dateKey(day)
  return props.reflections.filter(r => r.date === key)
}

// Mood label → image file key (same as /public/*.png)
const moodImageMap = {
  // ID labels
  'Senang': 'happy', 'Tenang': 'calm', 'Bersemangat': 'excited',
  'Sedih': 'sad', 'Cemas': 'anxious', 'Frustrasi': 'frustrated',
  'Bingung': 'confused', 'Lelah': 'tired', 'Terharu': 'touched',
  'Biasa aja': 'so-so',
  // EN labels
  'Happy': 'happy', 'Calm': 'calm', 'Excited': 'excited',
  'Sad': 'sad', 'Anxious': 'anxious', 'Frustrated': 'frustrated',
  'Confused': 'confused', 'Tired': 'tired', 'Touched': 'touched',
  'So-so': 'so-so',
}

function getMoodImage(mood) {
  const key = moodImageMap[mood]
  return key ? `/${key}.png` : null
}

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}

// Popup
const popup = ref({ show: false, day: null, idx: null, reflection: null })

function onCellClick(day) {
  const refs = getDayReflections(day)
  if (refs.length === 1) openPopup(day, 0)
  else if (refs.length > 1) openPopup(day, 0)
}

function openPopup(day, idx) {
  const refs = getDayReflections(day)
  popup.value = { show: true, day, idx, reflection: refs[idx] ?? null }
}

function closePopup() {
  popup.value = { show: false, day: null, idx: null, reflection: null }
}
</script>

<style scoped>
.kb-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
}

/* ── Header ── */
.kb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 32px 10px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  flex-shrink: 0;
  position: relative;
  z-index: 150;
}

/* Left: profile + hi name */
.kb-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}
.kb-profile-btn {
  cursor: pointer;
  border-radius: 50%;
  transition: transform 0.15s;
}
.kb-profile-btn:hover {
  transform: scale(1.08);
}
.kb-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c6ca8, #c084fc);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--accent);
  box-shadow: 0 2px 8px rgba(124, 108, 168, 0.3);
}
.kb-hi-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.kb-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.kb-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
.kb-brand-name {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Right: streak */
/* Update atau Tambahkan CSS ini */
.kb-streak-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 60px;
  margin-right: 8px;
}

.kb-streak-main {
  display: flex;
  align-items: center;
  gap: 4px;
}

.kb-streak-fire { font-size: 1rem; }
.kb-streak-num {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.kb-progress-box {
  width: 100%;
  padding: 0 4px;
}

.kb-progress-track {
  width: 100%;
  height: 4px;
  background: var(--bg-base);
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.kb-progress-fill {
  height: 100%;
  background: var(--accent); /* Menggunakan warna aksen yang sudah ada */
  transition: width 0.5s ease-out;
  border-radius: 2px;
}
/* ── Profile Dropdown ── */
.kb-profile-dropdown {
  position: absolute;
  top: 62px;
  left: 16px;
  width: 290px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  z-index: 300;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.kb-profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.kb-profile-avatar-lg {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c6ca8, #c084fc);
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--accent);
}
.kb-profile-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.kb-profile-username {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}
.kb-profile-email {
  font-size: 0.78rem;
  color: var(--text-muted);
}
.kb-profile-divider {
  height: 1px;
  background: var(--border);
}
.kb-profile-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kb-profile-field-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.kb-profile-field-value {
  font-size: 0.85rem;
  color: var(--text-primary);
}
.kb-profile-change-btn {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
  margin-top: 2px;
  width: fit-content;
}
.kb-profile-change-btn:hover { text-decoration: underline; }
.kb-profile-edit-row {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
.kb-profile-input {
  flex: 1;
  background: var(--bg-base);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.8rem;
  color: var(--text-primary);
  outline: none;
  font-family: 'Outfit', sans-serif;
}
.kb-profile-input:focus {
  border-color: var(--accent);
}
.kb-profile-save-btn {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  font-family: 'Outfit', sans-serif;
}
.kb-profile-save-btn:hover { opacity: 0.85; }
.kb-profile-logout-btn {
  background: rgba(124, 108, 168, 0.1);
  border: 1.5px solid rgba(124, 108, 168, 0.25);
  border-radius: 8px;
  padding: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'Outfit', sans-serif;
}
.kb-profile-logout-btn:hover { background: rgba(124, 108, 168, 0.18); }

/* Profile dropdown transition */
.profile-drop-enter-active, .profile-drop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.profile-drop-enter-from, .profile-drop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* Month navigation bar below header */
.kb-month-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 8px 24px 10px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  flex-shrink: 0;
}
.kb-nav-btn {
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 1.3rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.kb-nav-btn:hover {
  background: var(--bg-base);
  color: var(--text-primary);
}
.kb-month-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 160px;
  text-align: center;
}

/* Dirt image for empty plot */
.kb-dirt-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  opacity: 0.55;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
  transition: opacity 0.15s;
}
.kb-cell:hover .kb-dirt-img {
  opacity: 0.75;
}

/* ── Calendar ── */
.kb-calendar {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(90px, 1fr);
  gap: 0;
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
  overflow-y: auto;
}

.kb-day-label {
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 8px 4px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.kb-cell {
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  min-height: 90px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.kb-cell:hover {
  background: var(--bg-base);
}
.kb-cell-blank {
  background: var(--bg-base);
  cursor: default;
}
.kb-cell-blank:hover {
  background: var(--bg-base);
}
.kb-cell-today {
  background: rgba(168, 139, 250, 0.08) !important;
  border: 1.5px solid var(--accent) !important;
}
.kb-cell-future {
  background: var(--bg-base);
  opacity: 0.6;
  cursor: default;
}
.kb-cell-future:hover {
  background: var(--bg-base);
}

.kb-day-num {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  align-self: flex-start;
}
.kb-cell-today .kb-day-num {
  color: var(--accent);
  background: rgba(168, 139, 250, 0.15);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Flowers */
.kb-flowers {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.kb-flower-emoji {
  font-size: 1.6rem;
  line-height: 1;
}
.kb-flower-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.kb-flower-wrap:hover .kb-mood-img {
  transform: scale(1.18) translateY(-2px);
}

/* Mood images */
.kb-mood-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));
  transition: transform 0.15s;
}
.kb-popup-mood {
  display: flex;
  align-items: center;
  gap: 6px;
}
.kb-popup-mood-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* Empty plot */
.kb-plot {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* ── FAB ── */
.kb-fab-wrap {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  z-index: 50;
}
.kb-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c6ca8 0%, #c084fc 100%);
  border: none;
  color: white;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(124, 108, 168, 0.45);
  transition: transform 0.18s, box-shadow 0.18s;
}
.kb-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(124, 108, 168, 0.55);
}
.kb-fab-plus {
  line-height: 1;
  margin-top: -2px;
}
.kb-fab-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ── Popup ── */
.kb-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.kb-popup {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.kb-popup-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.kb-popup-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.4;
}
.kb-popup-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 2px 4px;
  flex-shrink: 0;
}
.kb-popup-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kb-popup-row {
  display: flex;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.5;
}
.kb-popup-label {
  font-weight: 700;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}
.kb-popup-edit-btn {
  width: 100%;
  padding: 10px;
  border-radius: 50px;
  background: rgba(124, 108, 168, 0.12);
  border: 1.5px solid rgba(124, 108, 168, 0.3);
  color: var(--accent);
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.kb-popup-edit-btn:hover {
  background: rgba(124, 108, 168, 0.22);
}

/* Transitions */
.kb-popup-enter-active, .kb-popup-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.kb-popup-enter-from, .kb-popup-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>