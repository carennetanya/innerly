<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <img src="/logo.png" alt="Innerly" class="sidebar-logo" />
        <span class="sidebar-brand" v-if="!sidebarCollapsed">Innerly</span>
        <button
          class="collapse-btn"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path v-if="!sidebarCollapsed" d="M15 18l-6-6 6-6" />
            <path v-else d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeView === item.id }"
          @click="activeView = item.id"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label" v-if="!sidebarCollapsed">{{
            item.label
          }}</span>
          <span class="nav-badge" v-if="item.badge && !sidebarCollapsed">{{
            item.badge
          }}</span>
        </button>
      </nav>

      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <div class="streak-card">
          <span class="streak-fire">🔥</span>
          <div>
            <div class="streak-num">{{ streakDays }}</div>
            <div class="streak-label">day streak</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <main class="main">
      <!-- Topbar -->
      <header class="topbar">
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

      <!-- Dashboard content -->
      <div class="content" v-if="activeView === 'dashboard'">
        <!-- Welcome banner -->
        <div class="welcome-banner">
          <div class="welcome-text">
            <p class="welcome-greeting">{{ displayName }} 👋</p>
            <h2 class="welcome-name">How are you feeling today?</h2>
            <p class="welcome-sub">
              Take a moment to reflect. Your inner space is ready.
            </p>
          </div>
          <div class="welcome-art">
            <img src="/logo.png" alt="" class="welcome-logo-art" />
          </div>
        </div>

        <!-- Quick mood pick -->
        <div class="section-title">Quick Mood Check</div>
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
              <div class="card-title">Start Journaling</div>
              <div class="card-sub">Guided Gibbs' Reflection • 6 steps</div>
            </div>
            <div class="card-arrow">→</div>
          </div>

          <!-- Streak -->
          <div class="card">
            <div class="card-icon">🔥</div>
            <div class="card-body">
              <div class="card-title">{{ streakDays }} Day Streak</div>
              <div class="card-sub">Keep it going!</div>
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
              <div class="card-title">Today's Challenge</div>
              <div class="card-sub card-challenge">{{ todayChallenge }}</div>
            </div>
          </div>

          <!-- Weekly report -->
          <div class="card" @click="activeView = 'insights'">
            <div class="card-icon">📊</div>
            <div class="card-body">
              <div class="card-title">Weekly Report</div>
              <div class="card-sub">See your mood pattern</div>
            </div>
            <div class="card-arrow">→</div>
          </div>
        </div>

        <!-- Mood week mini chart -->
        <div class="section-title">This Week's Mood</div>
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
          @back="activeView = 'dashboard'"
          @done="onJournalDone"
        />
      </div>

      <!-- Mood tracker placeholder -->
      <div class="content coming-soon" v-else-if="activeView === 'mood'">
        <div class="cs-icon">🌈</div>
        <h2>Mood Tracker</h2>
        <p>Track your emotions daily & see patterns — coming next!</p>
        <button class="btn-primary" @click="activeView = 'dashboard'">
          ← Back
        </button>
      </div>

      <!-- Insights placeholder -->
      <div class="content coming-soon" v-else-if="activeView === 'insights'">
        <div class="cs-icon">💡</div>
        <h2>Insights & Summary</h2>
        <p>AI-powered emotional pattern recognition — coming next!</p>
        <button class="btn-primary" @click="activeView = 'dashboard'">
          ← Back
        </button>
      </div>

      <!-- Other placeholders -->
      <div class="content coming-soon" v-else>
        <div class="cs-icon">🚧</div>
        <h2>{{ currentNavItem?.label }}</h2>
        <p>This feature is being built — stay tuned!</p>
        <button class="btn-primary" @click="activeView = 'dashboard'">
          ← Back
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import GuidedJournal from "../components/GuidedJournal.vue";

const props = defineProps({
  isDark: Boolean,
  userName: { type: String, default: "" },
  initialReflection: { type: String, default: "" },
  initialMood: { type: Object, default: null },
});
const emit = defineEmits(["toggleTheme"]);

const sidebarCollapsed = ref(false);
const activeView = ref("dashboard");
const selectedMood = ref(props.initialMood?.mood ?? null);
const streakDays = ref(4);

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  },
  {
    id: "journal",
    label: "Guided Journal",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    badge: "New",
  },
  {
    id: "mood",
    label: "Mood Tracker",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  },
  {
    id: "insights",
    label: "Insights",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    id: "growth",
    label: "Growth Tracker",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  },
  {
    id: "timeline",
    label: "Life Timeline",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  },
  {
    id: "challenge",
    label: "Challenges",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    id: "reminder",
    label: "Reminders",
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  },
];

const moods = [
  { emoji: "😊", label: "Happy", color: "#f5a623" },
  { emoji: "😌", label: "Calm", color: "#6ab04c" },
  { emoji: "😔", label: "Sad", color: "#7c6ca8" },
  { emoji: "😤", label: "Angry", color: "#e74c3c" },
  { emoji: "😰", label: "Anxious", color: "#e67e22" },
  { emoji: "😴", label: "Tired", color: "#95a5a6" },
  { emoji: "🤩", label: "Excited", color: "#f39c12" },
  { emoji: "😐", label: "Neutral", color: "#a78bfa" },
];

const weekMoods = [
  { day: "Mon", emoji: "😔", val: 40, color: "#7c6ca8" },
  { day: "Tue", emoji: "😌", val: 65, color: "#6ab04c" },
  { day: "Wed", emoji: "😊", val: 80, color: "#f5a623" },
  { day: "Thu", emoji: "😤", val: 30, color: "#e74c3c" },
  { day: "Fri", emoji: "😊", val: 75, color: "#f5a623" },
  { day: "Sat", emoji: "🤩", val: 90, color: "#f39c12" },
  { day: "Sun", emoji: "😌", val: 70, color: "#6ab04c" },
];

const challenges = [
  "Write 3 things you're grateful for today.",
  "Reflect on a moment that made you smile this week.",
  "What's one thing you'd tell your past self?",
  "Describe a challenge you overcame recently.",
  "What does your ideal day look like?",
];
const todayChallenge = challenges[new Date().getDay() % challenges.length];

const currentNavItem = computed(() =>
  navItems.find((n) => n.id === activeView.value),
);

const todayStr = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
});

const greeting = computed(() => {
  const h = new Date().getHours();
  const timeGreet =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return props.userName ? timeGreet + ", " + props.userName : timeGreet;
});

const displayName = computed(() => {
  return props.userName ? "Hi, " + props.userName : "Hi there";
});

function onJournalDone() {
  streakDays.value = streakDays.value + 1;
  activeView.value = "dashboard";
}
</script>

<style scoped>
/* ── Layout ── */
.app-shell {
  display: flex;
  min-height: 100svh;
  background: var(--bg-base);
  transition: background 0.4s ease;
}

/* ── Sidebar ── */
.sidebar {
  width: 240px;
  min-height: 100svh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: visible;
}
.sidebar.collapsed {
  width: 68px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 0px;
  border-bottom: none;
  position: relative;
}
.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 4px 8px 0px;
}
.sidebar-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex-shrink: 0;
  transition:
    width 0.3s ease,
    height 0.3s ease;
  transform: scale(2.2) translateY(4px);
  transform-origin: center center;
}
.sidebar.collapsed .sidebar-logo {
  width: 44px;
  height: 44px;
  transform: scale(2.2) translateY(4px);
}
.sidebar-brand {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}
.collapse-btn {
  margin-left: auto;
  color: var(--text-secondary);
  padding: 5px;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
  flex-shrink: 0;
  position: absolute;
  right: -13px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.sidebar.collapsed .collapse-btn {
  right: -13px;
  top: 50%;
  transform: translateY(-50%);
}
.collapse-btn:hover {
  color: var(--accent);
  background: var(--accent-soft);
  border-color: var(--accent);
  box-shadow: 0 2px 12px var(--accent-glow);
}

.sidebar-nav {
  flex: 1;
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}
.nav-item:hover {
  background: var(--accent-soft);
  color: var(--accent);
}
.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}
.nav-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 20%;
  bottom: 20%;
  width: 3px;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
}
.nav-icon {
  flex-shrink: 0;
  display: flex;
}
.nav-label {
  flex: 1;
}
.nav-badge {
  font-size: 0.65rem;
  font-weight: 700;
  background: var(--accent);
  color: white;
  padding: 1px 6px;
  border-radius: 20px;
}

.sidebar-footer {
  padding: 12px 10px 20px;
}
.streak-card {
  background: var(--accent-soft);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.streak-fire {
  font-size: 1.4rem;
}
.streak-num {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--accent);
  line-height: 1;
}
.streak-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 1px;
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
</style>
