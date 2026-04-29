<template>
  <div class="app-shell">

    <!-- Main area -->
    <main class="main">
      <!-- Topbar -->
      <header class="topbar" v-show="activeView !== 'kebun'">
        <div class="topbar-left">
          <h1 class="page-title">{{ currentNavItem?.label }}</h1>
          <span class="date-chip">{{ todayStr }}</span>
        </div>
        <div class="topbar-right">
          <button
            class="icon-btn"
            @click="$emit('toggleTheme')"
            :title="isDark ? 'Light mode' : 'Dark mode'"
          >
            <svg
              v-if="isDark"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <div class="avatar">
            {{ props.userName ? props.userName[0].toUpperCase() : "A" }}
          </div>
        </div>
      </header>

      <!-- Kebun Innerly -->
      <div class="content kebun-view" v-if="activeView === 'kebun'">
        <GardenView
          :is-dark="isDark"
          :lang="props.lang"
          :reflections="reflections"
          :streak-days="streakDays"
          :user-name="props.userName"
          :pending-reflection="props.pendingReflection"
          :open-garden="openGardenTrigger"
          @start-journal="activeView = 'journal'"
          @logout="$emit('logout')"
        />
      </div>

      <!-- Dashboard content -->
      <div class="content" v-else-if="activeView === 'dashboard'">
        <!-- Welcome banner -->
        <div class="welcome-banner">
          <div class="welcome-text">
            <p class="welcome-greeting">{{ displayName }} 👋</p>
            <h2 class="welcome-name">{{ t.howFeeling }}</h2>
            <p class="welcome-sub">{{ t.takeAMoment }}</p>
          </div>
          <div class="welcome-art">
            <img src="/logo.png" alt="" class="welcome-logo-art" />
          </div>
        </div>

        <!-- Quick mood pick -->
        <div class="section-title">{{ t.quickMoodCheck }}</div>
        <div class="mood-row">
          <button
            v-for="m in moods"
            :key="m.label"
            class="mood-pill"
            :class="{ selected: selectedMood === m.label }"
            @click="selectedMood = m.label"
            :style="{ '--mood-color': m.color }"
          >
            <span class="mood-emoji">{{ m.emoji }}</span>
            <span class="mood-label">{{ m.label }}</span>
          </button>
        </div>

        <!-- Cards row -->
        <div class="cards-grid">
          <!-- Start journal -->
          <div class="card card-accent" @click="activeView = 'journal'">
            <div class="card-icon">📝</div>
            <div class="card-body">
              <div class="card-title">{{ t.startJournaling }}</div>
              <div class="card-sub">{{ t.journalSub }}</div>
            </div>
            <div class="card-arrow">→</div>
          </div>

          <!-- Streak -->
          <div class="card">
            <div class="card-icon">🔥</div>
            <div class="card-body">
              <div class="card-title">{{ streakDays }} {{ t.dayStreak }}</div>
              <div class="card-sub">{{ t.keepGoing }}</div>
            </div>
            <div class="mini-bar">
              <div
                v-for="d in 7"
                :key="d"
                class="mini-bar-seg"
                :class="{ filled: d <= streakDays % 7 || streakDays >= 7 }"
              ></div>
            </div>
          </div>

          <!-- Today challenge -->
          <div class="card">
            <div class="card-icon">✨</div>
            <div class="card-body">
              <div class="card-title">{{ t.todaysChallenge }}</div>
              <div class="card-sub card-challenge">{{ todayChallenge }}</div>
            </div>
          </div>

          <!-- Weekly report -->
          <div class="card" @click="activeView = 'insights'">
            <div class="card-icon">📊</div>
            <div class="card-body">
              <div class="card-title">{{ t.weeklyReport }}</div>
              <div class="card-sub">{{ t.seePattern }}</div>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>

        <!-- Mood week mini chart -->
        <div class="section-title">{{ t.thisWeeksMood }}</div>
        <div class="week-mood">
          <div v-for="(day, i) in weekMoods" :key="i" class="week-day">
            <span class="week-emoji">{{ day.emoji }}</span>
            <div class="week-bar-wrap">
              <div
                class="week-bar"
                :style="{ height: day.val + '%', background: day.color }"
              ></div>
            </div>
            <span class="week-label">{{ day.day }}</span>
          </div>
        </div>
      </div>

      <!-- Guided Journal -->
      <div class="content journal-view" v-else-if="activeView === 'journal'">
        <GuidedJournal
          :is-dark="isDark"
          :initial-trigger="props.initialReflection"
          :lang="props.lang"
          @back="activeView = 'dashboard'"
          @done="onJournalDone"
        />
      </div>

      <!-- Mood tracker placeholder -->
      <div class="content coming-soon" v-else-if="activeView === 'mood'">
        <div class="cs-icon">🌈</div>
        <h2>{{ t.moodTrackerTitle }}</h2>
        <p>{{ t.moodTrackerDesc }}</p>
        <button class="btn-primary" @click="activeView = 'dashboard'">
          ← Back
        </button>
      </div>

      <!-- Insights placeholder -->
      <div class="content coming-soon" v-else-if="activeView === 'insights'">
        <div class="cs-icon">💡</div>
        <h2>{{ t.insightsTitle }}</h2>
        <p>{{ t.insightsDesc }}</p>
        <button class="btn-primary" @click="activeView = 'dashboard'">
          ← Back
        </button>
      </div>

      <!-- Other placeholders -->
      <div class="content coming-soon" v-else>
        <div class="cs-icon">🚧</div>
        <h2>{{ currentNavItem?.label }}</h2>
        <p>{{ t.comingSoon }}</p>
        <button class="btn-primary" @click="activeView = 'dashboard'">
          ← Back
        </button>
      </div>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav">
      <button
        v-for="item in mainNavItems"
        :key="item.id"
        class="bottom-nav-item"
        :class="{ active: activeView === item.id }"
        @click="activeView = item.id"
      >
        <span class="bottom-nav-icon" v-html="item.icon"></span>
        <span class="bottom-nav-label">{{ item.label }}</span>
        <span class="bottom-nav-badge" v-if="item.badge">{{ item.badge }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import GuidedJournal from "../components/GuidedJournal.vue";
import GardenView from "../components/GardenView.vue";
import { reflectionService } from "../services/reflection.js";
import { authService } from "../services/auth.js";

const props = defineProps({
  isDark: Boolean,
  userName: { type: String, default: "" },
  initialReflection: { type: String, default: "" },
  initialMood: { type: Object, default: null },
  lang: { type: String, default: "en" },
  pendingReflection: { type: Object, default: null },
});

const i18n = {
  en: {
    streak: "day streak",
    howFeeling: "How are you feeling today?",
    takeAMoment: "Take a moment to reflect. Your inner space is ready.",
    quickMoodCheck: "Quick Mood Check",
    startJournaling: "Start Journaling",
    journalSub: "Guided Gibbs\' Reflection • 6 steps",
    dayStreak: "Day Streak",
    keepGoing: "Keep it going!",
    todaysChallenge: "Today\'s Challenge",
    weeklyReport: "Weekly Report",
    seePattern: "See your mood pattern",
    thisWeeksMood: "This Week\'s Mood",
    moodTrackerTitle: "Mood Tracker",
    moodTrackerDesc: "Track your emotions daily & see patterns — coming next!",
    insightsTitle: "Insights & Summary",
    insightsDesc: "AI-powered emotional pattern recognition — coming next!",
    comingSoon: "This feature is being built — stay tuned!",
    back: "← Back",
    nav: {
      dashboard: "Dashboard",
      journal: "Guided Journal",
      mood: "Mood Tracker",
      insights: "Insights",
      growth: "Growth Tracker",
      timeline: "Life Timeline",
      challenge: "Challenges",
      reminder: "Reminders",
    },
    moods: [
      { emoji: "😊", label: "Happy", color: "#f5a623" },
      { emoji: "😌", label: "Calm", color: "#6ab04c" },
      { emoji: "😔", label: "Sad", color: "#7c6ca8" },
      { emoji: "😤", label: "Angry", color: "#e74c3c" },
      { emoji: "😰", label: "Anxious", color: "#e67e22" },
      { emoji: "😴", label: "Tired", color: "#95a5a6" },
      { emoji: "🤩", label: "Excited", color: "#f39c12" },
      { emoji: "😐", label: "Neutral", color: "#a78bfa" },
    ],
    weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    challenges: [
      "Write 3 things you\'re grateful for today.",
      "Reflect on a moment that made you smile this week.",
      "What\'s one thing you\'d tell your past self?",
      "Describe a challenge you overcame recently.",
      "What does your ideal day look like?",
    ],
    greeting: (name) => {
      const h = new Date().getHours();
      const g =
        h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
      return name ? g + ", " + name : g;
    },
    displayName: (name) => (name ? "Hi, " + name : "Hi there"),
  },
  id: {
    streak: "hari berturut-turut",
    howFeeling: "Gimana perasaanmu hari ini?",
    takeAMoment:
      "Luangkan waktu sejenak untuk merenung. Ruang batinmu sudah siap.",
    quickMoodCheck: "Cek Mood Cepat",
    startJournaling: "Mulai Journaling",
    journalSub: "Refleksi Terpandu Gibbs • 6 langkah",
    dayStreak: "Hari Berturut-turut",
    keepGoing: "Pertahankan!",
    todaysChallenge: "Tantangan Hari Ini",
    weeklyReport: "Laporan Mingguan",
    seePattern: "Lihat pola moodmu",
    thisWeeksMood: "Mood Minggu Ini",
    moodTrackerTitle: "Pelacak Mood",
    moodTrackerDesc:
      "Catat emosimu setiap hari & lihat polanya — segera hadir!",
    insightsTitle: "Wawasan & Ringkasan",
    insightsDesc: "Pengenalan pola emosi berbasis AI — segera hadir!",
    comingSoon: "Fitur ini sedang dibangun — nantikan ya!",
    back: "← Kembali",
    nav: {
      dashboard: "Beranda",
      journal: "Jurnal Terpandu",
      mood: "Pelacak Mood",
      insights: "Wawasan",
      growth: "Pelacak Pertumbuhan",
      timeline: "Linimasa Hidup",
      challenge: "Tantangan",
      reminder: "Pengingat",
    },
    moods: [
      { emoji: "😊", label: "Senang", color: "#f5a623" },
      { emoji: "😌", label: "Tenang", color: "#6ab04c" },
      { emoji: "😔", label: "Sedih", color: "#7c6ca8" },
      { emoji: "😤", label: "Marah", color: "#e74c3c" },
      { emoji: "😰", label: "Cemas", color: "#e67e22" },
      { emoji: "😴", label: "Lelah", color: "#95a5a6" },
      { emoji: "🤩", label: "Bersemangat", color: "#f39c12" },
      { emoji: "😐", label: "Biasa aja", color: "#a78bfa" },
    ],
    weekDays: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    challenges: [
      "Tulis 3 hal yang kamu syukuri hari ini.",
      "Renungkan momen yang membuatmu tersenyum minggu ini.",
      "Apa satu hal yang ingin kamu katakan pada dirimu di masa lalu?",
      "Ceritakan tantangan yang berhasil kamu lewati belakangan ini.",
      "Seperti apa hari yang ideal bagimu?",
    ],
    greeting: (name) => {
      const h = new Date().getHours();
      const g =
        h < 12 ? "Selamat pagi" : h < 17 ? "Selamat siang" : "Selamat malam";
      return name ? g + ", " + name : g;
    },
    displayName: (name) => (name ? "Hai, " + name : "Hai"),
  },
};

const t = computed(() => i18n[props.lang] ?? i18n.en);
const emit = defineEmits(["toggleTheme", "logout"]);

const activeView = ref("kebun");
const selectedMood = ref(props.initialMood?.mood ?? null);

// ── Reflections storage ──
const reflections = ref(JSON.parse(localStorage.getItem('innerly_reflections') || '[]'));

// ── Streak logic ──
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function computeStreak(refs) {
  const uniqueDates = [...new Set(refs.map(r => r.date))].sort().reverse();
  if (uniqueDates.length === 0) return 0;
  const today = getTodayKey();
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const yesterday = `${yd.getFullYear()}-${String(yd.getMonth()+1).padStart(2,'0')}-${String(yd.getDate()).padStart(2,'0')}`;
  // Streak only alive if reflected today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;
  let streak = 0;
  let cursor = new Date(uniqueDates[0] + 'T00:00:00');
  for (const d of uniqueDates) {
    const diff = Math.round((cursor - new Date(d + 'T00:00:00')) / 86400000);
    if (diff <= 1) { streak++; cursor = new Date(d + 'T00:00:00'); }
    else break;
  }
  return streak;
}

const streakDays = ref(computeStreak(reflections.value));
const openGardenTrigger = ref(0);

// Watch pendingReflection prop — jalan tiap kali ada refleksi baru dari onboarding
// Ini penting karena DashboardView tidak di-remount (key="dashboard" static)
watch(() => props.pendingReflection, (newRef) => {
  if (!newRef) return;
  const dateKey = newRef.date;
  const existingIdx = reflections.value.findIndex(r => r.date === dateKey);
  if (existingIdx >= 0) {
    reflections.value[existingIdx] = newRef;
  } else {
    reflections.value.push(newRef);
  }
  streakDays.value = computeStreak(reflections.value);
  // Trigger garden popup otomatis setelah refleksi onboarding/baru masuk
  activeView.value = "kebun";
  openGardenTrigger.value++;
}, { immediate: false });

// Load reflections from database on mount
onMounted(async () => {
  const user = authService.getUser && authService.getUser();
  const userId = user && (user._id || user.id);
  let alreadyWateredToday = false;

  if (userId) {
    try {
      const dbReflections = await reflectionService.getReflections(userId);
      if (dbReflections && dbReflections.length > 0) {
        const localReflections = reflections.value;
        const merged = [...localReflections];
        for (const dbRef of dbReflections) {
          const existingIndex = merged.findIndex(r => r.date === dbRef.date);
          if (existingIndex >= 0) {
            merged[existingIndex] = dbRef;
          } else {
            merged.push(dbRef);
          }
        }
        reflections.value = merged;
        localStorage.setItem('innerly_reflections', JSON.stringify(merged));
        streakDays.value = computeStreak(merged);
      }
    } catch (err) {
      console.error("Failed to load reflections from database:", err);
    }

    // Cek apakah sudah siram hari ini
    try {
      const todayKey = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/streak/${userId}`);
      const data = await res.json();
      if (data.last_watered_date) {
        alreadyWateredToday = data.last_watered_date.split('T')[0] === todayKey;
      }
    } catch (e) {}
  }

  // Auto-open popup hanya jika belum siram hari ini
  setTimeout(() => {
    if (activeView.value === 'kebun' && !props.pendingReflection && !alreadyWateredToday) {
      openGardenTrigger.value++;
    }
  }, 800);
});

const navItems = [
  {
    id: "kebun",
    label: props.lang === 'id' ? 'Kebun Innerly' : 'Innerly Garden',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22V12M12 12C12 12 8 9 8 5a4 4 0 0 1 8 0c0 4-4 7-4 7z"/><path d="M5 22h14"/></svg>`,
  },
  {
    id: "dashboard",
    label: t.value.nav.dashboard,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  },
  {
    id: "journal",
    label: t.value.nav.journal,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    badge: "New",
  },
  {
    id: "mood",
    label: t.value.nav.mood,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  },
  {
    id: "insights",
    label: t.value.nav.insights,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    id: "growth",
    label: t.value.nav.growth,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  },
  {
    id: "timeline",
    label: t.value.nav.timeline,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  },
  {
    id: "challenge",
    label: t.value.nav.challenge,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    id: "reminder",
    label: t.value.nav.reminder,
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  },
];

const moods = computed(() => t.value.moods);

const weekMoods = computed(() => {
  const days = t.value.weekDays;
  const data = [
    { emoji: "😔", val: 40, color: "#7c6ca8" },
    { emoji: "😌", val: 65, color: "#6ab04c" },
    { emoji: "😊", val: 80, color: "#f5a623" },
    { emoji: "😤", val: 30, color: "#e74c3c" },
    { emoji: "😊", val: 75, color: "#f5a623" },
    { emoji: "🤩", val: 90, color: "#f39c12" },
    { emoji: "😌", val: 70, color: "#6ab04c" },
  ];
  return data.map((d, i) => ({ ...d, day: days[i] }));
});

const todayChallenge = computed(() => {
  const ch = t.value.challenges;
  return ch[new Date().getDay() % ch.length];
});

const currentNavItem = computed(() =>
  navItems.find((n) => n.id === activeView.value),
);

// Main nav items for bottom bar (only the key ones)
const mainNavItems = computed(() => [
  navItems.find(n => n.id === 'kebun'),
  navItems.find(n => n.id === 'dashboard'),
  navItems.find(n => n.id === 'journal'),
  navItems.find(n => n.id === 'mood'),
  navItems.find(n => n.id === 'insights'),
].filter(Boolean));

const todayStr = computed(() => {
  return new Date().toLocaleDateString(
    props.lang === "id" ? "id-ID" : "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  );
});

const greeting = computed(() => t.value.greeting(props.userName));
const displayName = computed(() => t.value.displayName(props.userName));

function onJournalDone(data) {
  const dateKey = getTodayKey();
  const newRef = {
    date: dateKey,
    mood: data?.moods?.[0] ?? data?.mood ?? '',
    moods: data?.moods ?? (data?.mood ? [data.mood] : []),
    trigger: data?.trigger ?? '',
    wentWell: data?.wentWell ?? '',
    improve: data?.improve ?? '',
    insight: data?.insight ?? '',
    action: data?.action ?? '',
  };
  
  // Check if reflection for this date already exists
  const existingIndex = reflections.value.findIndex(r => r.date === dateKey);
  if (existingIndex >= 0) {
    reflections.value[existingIndex] = newRef;
  } else {
    reflections.value.push(newRef);
  }
  
  const updated = reflections.value;
  localStorage.setItem('innerly_reflections', JSON.stringify(updated));
  
  // Save to database
  const user = authService.getUser && authService.getUser();
  const userId = user && (user._id || user.id);
  if (userId) {
    reflectionService.saveReflection(userId, newRef).catch(err => {
      console.error("Failed to save reflection to database:", err);
    });
  }
  
  // Recompute streak (only increments if first reflection today)
  streakDays.value = computeStreak(updated);
  activeView.value = "kebun";
  // Trigger garden popup to open so user can water their plant
  openGardenTrigger.value++;
}
</script>

<style scoped>
/* ── Layout ── */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  background: var(--bg-base);
  transition: background 0.4s ease;
}


/* ── Main ── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ── Topbar ── */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
  position: sticky;
  top: 0;
  z-index: 10;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.page-title {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}
.date-chip {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--accent-soft);
  padding: 4px 10px;
  border-radius: 20px;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s;
  background: var(--accent-soft);
}
.icon-btn:hover {
  color: var(--accent);
  background: var(--accent-glow);
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent) 0%, #c084fc 100%);
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Content ── */
.content {
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow-y: auto;
}
.kebun-view {
  padding: 0 !important;
  gap: 0 !important;
  overflow: visible !important;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ── Welcome banner ── */
.welcome-banner {
  background: linear-gradient(135deg, var(--accent-soft) 0%, var(--beige) 100%);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
}
.welcome-greeting {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.04em;
}
.welcome-name {
  font-family: var(--font-heading);
  font-size: 1.7rem;
  color: var(--text-primary);
  margin: 6px 0 8px;
}
.welcome-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.welcome-logo-art {
  width: 90px;
  height: 90px;
  object-fit: contain;
  opacity: 0.7;
  filter: drop-shadow(0 4px 12px var(--accent-glow));
}

/* ── Section title ── */
.section-title {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: -10px;
}

/* ── Mood row ── */
.mood-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.mood-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 50px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}
.mood-pill:hover {
  border-color: var(--mood-color);
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--mood-color) 20%, transparent);
}
.mood-pill.selected {
  background: color-mix(in srgb, var(--mood-color) 15%, transparent);
  border-color: var(--mood-color);
  color: var(--text-primary);
}
.mood-emoji {
  font-size: 1rem;
}

/* ── Cards grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}
.card-accent {
  background: linear-gradient(135deg, var(--accent-soft), var(--beige));
  border-color: var(--accent);
}
.card-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 1px;
}
.card-body {
  flex: 1;
}
.card-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  margin-bottom: 3px;
}
.card-sub {
  font-size: 0.78rem;
  color: var(--text-secondary);
}
.card-challenge {
  font-style: italic;
}
.card-arrow {
  color: var(--accent);
  font-size: 1.1rem;
  align-self: center;
  margin-top: 1px;
}

.mini-bar {
  display: flex;
  gap: 3px;
  margin-top: 8px;
  padding: 0 2px;
}
.mini-bar-seg {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  transition: background 0.3s;
}
.mini-bar-seg.filled {
  background: var(--accent);
}

/* ── Week mood chart ── */
.week-mood {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: var(--shadow-sm);
}
.week-day {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.week-emoji {
  font-size: 1.1rem;
}
.week-bar-wrap {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.week-bar {
  width: 100%;
  max-width: 32px;
  border-radius: 4px 4px 0 0;
  min-height: 6px;
  transition: height 0.5s cubic-bezier(0.34, 1.2, 0.64, 1);
  opacity: 0.85;
}
.week-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* ── Coming soon ── */
.coming-soon {
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  padding: 60px 28px;
}
.cs-icon {
  font-size: 3rem;
}
.coming-soon h2 {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  color: var(--text-primary);
}
.coming-soon p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  max-width: 360px;
}

/* ── Primary button ── */
.btn-primary {
  margin-top: 8px;
  padding: 11px 28px;
  border-radius: 50px;
  background: var(--accent-soft);
  border: 1.5px solid var(--accent);
  color: var(--accent);
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.2s;
}
.btn-primary:hover {
  background: var(--accent);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* ── Journal view ── */
.journal-view {
  align-items: stretch;
  padding: 28px 28px 40px;
}

/* ── Bottom Navigation Bar ── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 4px calc(8px + env(safe-area-inset-bottom));
  backdrop-filter: blur(12px);
  box-shadow: 0 -4px 24px rgba(0,0,0,0.06);
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 4px;
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 0.65rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  max-width: 80px;
}
.bottom-nav-item:hover {
  color: var(--accent);
  background: var(--accent-soft);
}
.bottom-nav-item.active {
  color: var(--accent);
  font-weight: 700;
}
.bottom-nav-item.active .bottom-nav-icon {
  background: var(--accent-soft);
  border-radius: 10px;
  padding: 5px 10px;
}
.bottom-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 5px 10px;
}
.bottom-nav-label {
  font-size: 0.6rem;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70px;
}
.bottom-nav-badge {
  position: absolute;
  top: 4px;
  right: 12px;
  font-size: 0.5rem;
  font-weight: 700;
  background: var(--accent);
  color: white;
  padding: 1px 4px;
  border-radius: 10px;
}

/* Adjust main content to not be hidden behind bottom nav */
.main {
  padding-bottom: 72px;
}

</style>