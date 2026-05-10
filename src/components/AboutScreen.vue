<template>
  <Transition name="page-slide">
    <div v-if="visible" class="about-root" :class="{ 'dark-mode': isDark }">
      <!-- Ambient bg -->
      <div class="about-bg">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-orb orb-3"></div>
        <div class="bg-noise"></div>
      </div>

      <!-- Back button -->
      <button class="back-btn" @click="$emit('close')">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M13 4L7 10l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>back</span>
      </button>

      <!-- Main content -->
      <div class="about-scroll">
        <div class="about-inner">

          <!-- Hero section -->
          <div class="about-hero">
            <div class="hero-glyph">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="glyph-svg">
                <circle cx="40" cy="40" r="36" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.35"/>
                <circle cx="40" cy="40" r="24" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                <circle cx="40" cy="40" r="10" fill="currentColor" opacity="0.15"/>
                <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.6"/>
                <line x1="40" y1="4" x2="40" y2="16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
                <line x1="40" y1="64" x2="40" y2="76" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
                <line x1="4" y1="40" x2="16" y2="40" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
                <line x1="64" y1="40" x2="76" y2="40" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
              </svg>
            </div>
            <h1 class="hero-title">About <em>Innerly</em></h1>
            <p class="hero-sub">A quiet space for the mind you carry everywhere.</p>
          </div>

          <!-- Mission card -->
          <div class="about-card card-mission">
            <div class="card-accent"></div>
            <span class="card-eyebrow">our mission</span>
            <p class="card-body">
              Innerly exists because everyone deserves a private corner of clarity. We built a place where reflection isn't performative — no likes, no followers, just you and the honest work of knowing yourself better.
            </p>
          </div>

          <!-- Values grid -->
          <div class="values-grid">
            <div class="value-item" v-for="v in values" :key="v.glyph">
              <div class="value-glyph">{{ v.glyph }}</div>
              <div class="value-label">{{ v.label }}</div>
              <div class="value-desc">{{ v.desc }}</div>
            </div>
          </div>

          <!-- Story section -->
          <div class="about-card card-story">
            <span class="card-eyebrow">how it began</span>
            <p class="card-body">
              Innerly started as a personal experiment — a single journal entry format that someone kept returning to every morning. Over time, it evolved into a gentle system: mood awareness, guided reflection, and tiny action plans that actually stick.
            </p>
            <p class="card-body" style="margin-top: 14px;">
              We believe the most meaningful growth happens in private, at your own pace, without pressure to share or compare.
            </p>
          </div>

          <!-- Team note -->
          <div class="team-note">
            <div class="team-note-line"></div>
            <p class="team-note-text">Built with care by a small team who journals every morning ✦</p>
            <div class="team-note-line"></div>
          </div>

          <!-- Version tag -->
          <div class="version-tag">Innerly · v2.0 · Made with 🌿</div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isDark: { type: Boolean, default: false }
});
defineEmits(['close']);

const visible = ref(true);

const values = [
  { glyph: '◎', label: 'Privacy', desc: 'Your reflections stay yours. Always.' },
  { glyph: '✦', label: 'Honesty', desc: 'We build tools that ask the real questions.' },
  { glyph: '〰', label: 'Gentleness', desc: 'No streaks to break. No pressure to perform.' },
  { glyph: '◈', label: 'Depth', desc: 'Surface check-ins lead to deeper knowing.' },
  { glyph: '○', label: 'Growth', desc: 'Small daily shifts compound beautifully.' },
  { glyph: '✿', label: 'Warmth', desc: 'Every feature is designed with empathy.' },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap");

.about-root {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: radial-gradient(ellipse at 50% 30%, #ede8f5 0%, #d9d1ea 45%, #c5bad8 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.about-root.dark-mode {
  background: radial-gradient(ellipse at 50% 30%, #0d1a27 0%, #060c12 60%, #020609 100%);
}

/* Bg effects */
.about-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.45;
}
.bg-orb.orb-1 {
  width: 350px; height: 280px;
  top: -80px; left: -60px;
  background: radial-gradient(ellipse, rgba(180,165,215,0.6) 0%, transparent 70%);
}
.bg-orb.orb-2 {
  width: 280px; height: 220px;
  bottom: -60px; right: -40px;
  background: radial-gradient(ellipse, rgba(200,185,235,0.5) 0%, transparent 70%);
}
.bg-orb.orb-3 {
  width: 200px; height: 200px;
  top: 40%; left: 55%;
  background: radial-gradient(ellipse, rgba(160,140,200,0.35) 0%, transparent 70%);
}
.dark-mode .bg-orb.orb-1 {
  background: radial-gradient(ellipse, rgba(108,92,231,0.28) 0%, transparent 70%);
}
.dark-mode .bg-orb.orb-2 {
  background: radial-gradient(ellipse, rgba(74,63,122,0.35) 0%, transparent 70%);
}
.dark-mode .bg-orb.orb-3 {
  background: radial-gradient(ellipse, rgba(245,166,35,0.12) 0%, transparent 70%);
}
.bg-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* Back button */
.back-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 20px;
  padding: 7px 14px;
  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: rgba(74,63,122,0.85);
  cursor: pointer;
  transition: all 0.2s ease;
}
.back-btn:hover {
  background: rgba(255,255,255,0.38);
  color: rgba(74,63,122,1);
  transform: translateX(-2px);
}
.dark-mode .back-btn {
  background: rgba(20,15,40,0.45);
  border-color: rgba(167,139,250,0.22);
  color: rgba(200,190,255,0.8);
}
.dark-mode .back-btn:hover {
  background: rgba(40,30,70,0.6);
  color: rgba(220,210,255,1);
}

/* Scroll container */
.about-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px 40px;
  position: relative;
  z-index: 2;
  scrollbar-width: thin;
  scrollbar-color: rgba(124,108,168,0.3) transparent;
}
.about-scroll::-webkit-scrollbar { width: 4px; }
.about-scroll::-webkit-scrollbar-track { background: transparent; }
.about-scroll::-webkit-scrollbar-thumb { background: rgba(124,108,168,0.3); border-radius: 4px; }

.about-inner {
  max-width: 480px;
  margin: 0 auto;
  padding-top: 72px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Hero */
.about-hero {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-bottom: 8px;
}
.hero-glyph {
  width: 72px;
  height: 72px;
  color: rgba(74,63,122,0.65);
  animation: glyph-rotate 18s linear infinite;
}
.dark-mode .hero-glyph {
  color: rgba(167,139,250,0.6);
}
.glyph-svg {
  width: 100%;
  height: 100%;
}
@keyframes glyph-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.hero-title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
  background: linear-gradient(135deg, #2d2460 0%, #5a4d8a 50%, #8b7cc0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-title em {
  font-style: italic;
}
.dark-mode .hero-title {
  background: linear-gradient(135deg, #6c5ce7 0%, #a78bfa 40%, #f5a623 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(72,130,45,0.85);
  margin: 0;
}
.dark-mode .hero-sub {
  color: rgba(106,176,76,0.7);
}

/* Cards */
.about-card {
  background: rgba(255,255,255,0.28);
  backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255,255,255,0.45);
  border-radius: 22px;
  padding: 24px 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(74,63,122,0.08);
}
.dark-mode .about-card {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.card-accent {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: linear-gradient(90deg, #6c5ce7, #a78bfa, #f5a623);
  border-radius: 22px 22px 0 0;
}
.card-mission .card-accent {
  background: linear-gradient(90deg, #4a3f7a, #7c6ca8, #b8a8d0);
}
.card-story .card-accent {
  background: linear-gradient(90deg, #6ab04c, #a8d88a, #78c850);
}
.card-eyebrow {
  display: block;
  font-family: "Outfit", sans-serif;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(74,63,122,0.55);
  margin-bottom: 12px;
}
.dark-mode .card-eyebrow {
  color: rgba(167,139,250,0.55);
}
.card-body {
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  font-weight: 400;
  line-height: 1.72;
  color: rgba(40,28,70,0.82);
  margin: 0;
}
.dark-mode .card-body {
  color: rgba(220,210,255,0.78);
}

/* Values grid */
.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.value-item {
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.38);
  border-radius: 16px;
  padding: 16px 12px 14px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.value-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(74,63,122,0.12);
}
.dark-mode .value-item {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.09);
}
.dark-mode .value-item:hover {
  box-shadow: 0 10px 28px rgba(0,0,0,0.3);
}
.value-glyph {
  font-size: 1.4rem;
  color: rgba(74,63,122,0.7);
  margin-bottom: 7px;
  line-height: 1;
}
.dark-mode .value-glyph {
  color: rgba(167,139,250,0.65);
}
.value-label {
  font-family: "Playfair Display", serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(40,28,70,0.88);
  margin-bottom: 5px;
}
.dark-mode .value-label {
  color: rgba(220,210,255,0.88);
}
.value-desc {
  font-family: "Outfit", sans-serif;
  font-size: 0.66rem;
  font-weight: 400;
  color: rgba(74,63,122,0.55);
  line-height: 1.5;
}
.dark-mode .value-desc {
  color: rgba(167,139,250,0.5);
}

/* Team note */
.team-note {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 0;
}
.team-note-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(124,108,168,0.25), transparent);
}
.dark-mode .team-note-line {
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.2), transparent);
}
.team-note-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  color: rgba(74,63,122,0.55);
  white-space: nowrap;
  margin: 0;
}
.dark-mode .team-note-text {
  color: rgba(167,139,250,0.45);
}

/* Version tag */
.version-tag {
  text-align: center;
  font-family: "Outfit", sans-serif;
  font-size: 0.65rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(74,63,122,0.35);
  padding-bottom: 12px;
}
.dark-mode .version-tag {
  color: rgba(167,139,250,0.3);
}

/* Page transitions */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 400px) {
  .values-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-title { font-size: 2rem; }
}
</style>