<template>
  <Transition name="page-slide">
    <div v-if="visible" class="contact-root" :class="{ 'dark-mode': isDark }">
      <!-- Ambient bg -->
      <div class="contact-bg">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-noise"></div>
      </div>

      <!-- Back button -->
      <button class="back-btn" @click="$emit('close')">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M13 4L7 10l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>back</span>
      </button>

      <div class="contact-scroll">
        <div class="contact-inner">

          <!-- Hero -->
          <div class="contact-hero">
            <div class="hero-icon">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="14" width="48" height="32" rx="6" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
                <path d="M6 20l24 16 24-16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
                <circle cx="47" cy="13" r="5" fill="currentColor" opacity="0.25" class="pulse-dot"/>
                <circle cx="47" cy="13" r="3" fill="currentColor" opacity="0.7"/>
              </svg>
            </div>
            <h1 class="hero-title">Get in <em>Touch</em></h1>
            <p class="hero-sub">We read every message, really.</p>
          </div>

          <!-- ✦ Meet the Team ✦ -->
          <div class="team-section">
            <div class="team-heading">
              <span class="team-eyebrow">the humans behind innerly</span>
              <h2 class="team-title">Meet the <em>Team</em></h2>
            </div>

            <div class="team-grid">
              <div
                v-for="member in team"
                :key="member.name"
                class="team-card"
                @mouseenter="hoveredMember = member.name"
                @mouseleave="hoveredMember = null"
              >
                <!-- Avatar -->
                <div class="avatar-wrap">
                  <!-- Chat bubble on hover (desktop only) -->
                  <Transition name="bubble">
                    <div v-if="hoveredMember === member.name" class="chat-bubble">
                      <p class="bubble-text">{{ member.intro }}</p>
                      <div class="bubble-tail"></div>
                    </div>
                  </Transition>

                  <img
                    :src="member.photo"
                    :alt="member.name"
                    class="avatar-img"
                    @error="handleImgError($event, member.name)"
                  />
                  <div class="avatar-ring"></div>
                  <div class="avatar-glow"></div>
                </div>

                <!-- Info -->
                <div class="member-info">
                  <h3 class="member-name">{{ member.name }}</h3>
                  <p class="member-role">{{ member.role }}</p>
                </div>

                <!-- Intro text (mobile only, static) -->
                <p class="member-intro-mobile">{{ member.intro }}</p>

                <!-- Links -->
                <div class="member-links">
                  <a
                    :href="member.github"
                    class="link-btn"
                    :class="{ 'is-dark': isDark }"
                    target="_blank"
                    rel="noopener"
                    title="GitHub"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                  <button
                    class="link-btn"
                    :class="{ 'is-dark': isDark, 'copied': copiedMember === member.name }"
                    @click="copyEmail(member)"
                    title="Copy email"
                  >
                    <svg v-if="copiedMember !== member.name" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M2 8l10 7 10-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ copiedMember === member.name ? 'Copied!' : 'Email' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Message form -->
          <div class="form-card">
            <div class="form-card-accent"></div>
            <span class="form-eyebrow">send a message</span>

            <div v-if="!sent" class="form-fields">
              <div class="field-group">
                <label class="field-label">your name</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="field-input"
                  :class="{ 'is-dark': isDark }"
                  placeholder="e.g. Luna"
                  autocomplete="name"
                />
              </div>

              <div class="field-group">
                <label class="field-label">email address</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="field-input"
                  :class="{ 'is-dark': isDark }"
                  placeholder="you@email.com"
                  autocomplete="email"
                />
              </div>

              <div class="field-group">
                <label class="field-label">topic</label>
                <div class="topic-chips">
                  <button
                    v-for="t in topics"
                    :key="t"
                    class="topic-chip"
                    :class="{ active: form.topic === t, 'is-dark': isDark }"
                    @click="form.topic = t"
                    type="button"
                  >{{ t }}</button>
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">your message</label>
                <textarea
                  v-model="form.message"
                  class="field-textarea"
                  :class="{ 'is-dark': isDark }"
                  placeholder="Tell us what's on your mind…"
                  rows="4"
                ></textarea>
              </div>

              <div v-if="error" class="form-error">{{ error }}</div>

              <button
                class="submit-btn"
                :class="{ 'is-dark': isDark, loading: sending }"
                @click="handleSubmit"
                :disabled="sending"
              >
                <span v-if="!sending">Send Message ✦</span>
                <span v-else class="sending-dots">sending<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></span>
              </button>
            </div>

            <!-- Success state -->
            <div v-else class="sent-state">
              <div class="sent-glyph">◎</div>
              <h3 class="sent-title">Message received</h3>
              <p class="sent-body">Thank you, {{ form.name || 'friend' }}. We'll be in touch within 1–2 days. You're heard. ✦</p>
              <button class="sent-reset" @click="resetForm">Send another →</button>
            </div>
          </div>

          <!-- Footer note -->
          <p class="contact-footer-note">
            Response time is usually within 1–2 business days.<br/>
            We're a small team — your patience means a lot.
          </p>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

const props = defineProps({
  isDark: { type: Boolean, default: false }
});
defineEmits(['close']);

const visible = ref(true);
const sent = ref(false);
const sending = ref(false);
const error = ref('');
const hoveredMember = ref(null);
const copiedMember = ref(null);

function copyEmail(member) {
  navigator.clipboard.writeText(member.email).then(() => {
    copiedMember.value = member.name;
    setTimeout(() => { copiedMember.value = null; }, 2000);
  });
}

const topics = ['feedback', 'bug report', 'feature request', 'other'];

const team = computed(() => [
  {
    name: 'Caren',
    role: 'UI/UX · Frontend · AI Dev · Backend',
    photo: props.isDark ? '/caren1.png' : '/caren.png',
    github: 'https://github.com/carennetanya',
    email: 'netanya.caren@gmail.com',
    intro: "Hi! I'm Caren 👋 I shape how Innerly looks and feels — from UI/UX design to building the frontend, AI features, and backend too. If it's beautiful and it works, I probably touched it ✦",
  },
  {
    name: 'Rafa',
    role: 'Frontend · Backend',
    photo: props.isDark ? '/rafa1.png' : '/rafa.png',
    github: 'https://github.com/rafanih',
    email: 'rafael.julio0807@gmail.com',
    intro: "Hey, I'm Rafa 🙌 I work across the stack — crafting the frontend experience and making sure the backend runs smoothly. Caren and I keep the engine humming together.",
  },
  {
    name: 'Daniel',
    role: 'Concept · Content · Backend',
    photo: props.isDark ? '/daniel1.png' : '/daniel.png',
    github: 'https://github.com/rhezadaniel7',
    email: 'antoniusdaniel486@gmail.com',
    intro: "I'm Daniel 💡 Innerly started as my idea — I shape the concept, write and curate the content, and help fix the backend logic. The soul of this app is something I care a lot about.",
  },
]);

function handleImgError(event, name) {
  // Fallback: generate initials avatar via canvas data URL
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  const colors = { Caren: ['#e8d5f5', '#7c6ca8'], Rafa: ['#d5e8f5', '#6c8ca8'], Daniel: ['#f5e8d5', '#a88c6c'] };
  const [bg, fg] = colors[name] || ['#ede8f5', '#7c6ca8'];
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(60, 60, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.font = 'bold 44px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name[0], 60, 62);
  event.target.src = canvas.toDataURL();
}

const form = reactive({
  name: '',
  email: '',
  topic: 'feedback',
  message: '',
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handleSubmit() {
  error.value = '';
  if (!form.name.trim()) { error.value = 'Please tell us your name.'; return; }
  if (!form.email.trim() || !validateEmail(form.email)) { error.value = 'A valid email address is needed.'; return; }
  if (!form.message.trim()) { error.value = 'A message would help us help you.'; return; }

  sending.value = true;
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        message: form.message.trim(),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send message.');
    sent.value = true;
  } catch (err) {
    error.value = err.message || 'Something went wrong. Please try again.';
  } finally {
    sending.value = false;
  }
}

function resetForm() {
  form.name = '';
  form.email = '';
  form.topic = 'feedback';
  form.message = '';
  error.value = '';
  sent.value = false;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap");

/* ─── Root ────────────────────────────────────────────────── */
.contact-root {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: radial-gradient(ellipse at 50% 30%, #ede8f5 0%, #d9d1ea 45%, #c5bad8 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.contact-root.dark-mode {
  background: radial-gradient(ellipse at 50% 30%, #0d1a27 0%, #060c12 60%, #020609 100%);
}

/* ─── Bg ──────────────────────────────────────────────────── */
.contact-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.28;
}
.orb-1 {
  width: 380px; height: 380px;
  top: -80px; left: -60px;
  background: radial-gradient(circle, #b8a5e8 0%, #9b85d4 100%);
  animation: orbFloat 14s ease-in-out infinite;
}
.orb-2 {
  width: 300px; height: 300px;
  bottom: -60px; right: -40px;
  background: radial-gradient(circle, #e8d5f5 0%, #c8b0e8 100%);
  animation: orbFloat 18s ease-in-out infinite reverse;
}
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -30px) scale(1.06); }
}
.bg-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.4;
}

/* ─── Back btn ────────────────────────────────────────────── */
.back-btn {
  position: absolute;
  top: 18px; left: 18px;
  z-index: 10;
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(124,108,168,0.2);
  border-radius: 50px;
  padding: 8px 16px 8px 12px;
  font-family: "Outfit", sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(74,63,122,0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}
.back-btn:hover {
  background: rgba(255,255,255,0.55);
  transform: translateX(-2px);
}
.dark-mode .back-btn {
  background: rgba(20,14,40,0.5);
  border-color: rgba(167,139,250,0.2);
  color: rgba(200,190,255,0.75);
}

/* ─── Scroll ──────────────────────────────────────────────── */
.contact-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 60px;
  scrollbar-width: none;
}
.contact-scroll::-webkit-scrollbar { display: none; }
.contact-inner {
  max-width: 480px;
  margin: 0 auto;
  padding-top: 72px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ─── Hero ────────────────────────────────────────────────── */
.contact-hero { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.hero-icon {
  width: 52px; height: 52px;
  color: rgba(74,63,122,0.65);
}
.dark-mode .hero-icon { color: rgba(167,139,250,0.65); }
.hero-title {
  font-family: "Playfair Display", serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: rgba(40,28,70,0.9);
  margin: 0;
  letter-spacing: -0.02em;
}
.hero-title em { font-style: italic; color: rgba(108,88,185,0.9); }
.dark-mode .hero-title { color: rgba(230,220,255,0.95); }
.dark-mode .hero-title em { color: rgba(167,139,250,0.9); }
.hero-sub {
  font-family: "Outfit", sans-serif;
  font-size: 0.9rem;
  font-weight: 300;
  color: rgba(74,63,122,0.6);
  margin: 0;
}
.dark-mode .hero-sub { color: rgba(167,139,250,0.55); }

/* ─── Team Section ────────────────────────────────────────── */
.team-section { display: flex; flex-direction: column; gap: 20px; }

.team-heading { text-align: center; }
.team-eyebrow {
  display: block;
  font-family: "Outfit", sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(74,63,122,0.5);
  margin-bottom: 6px;
}
.dark-mode .team-eyebrow { color: rgba(167,139,250,0.5); }
.team-title {
  font-family: "Playfair Display", serif;
  font-size: 1.7rem;
  font-weight: 700;
  color: rgba(40,28,70,0.88);
  margin: 0;
}
.team-title em { font-style: italic; color: rgba(108,88,185,0.85); }
.dark-mode .team-title { color: rgba(220,210,255,0.9); }
.dark-mode .team-title em { color: rgba(167,139,250,0.85); }

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ─── Team Card ───────────────────────────────────────────── */
.team-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px 16px;
  background: rgba(255,255,255,0.38);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.55);
  border-radius: 22px;
  box-shadow: 0 4px 24px rgba(108,88,185,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  cursor: default;
}
.team-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 36px rgba(108,88,185,0.16), inset 0 1px 0 rgba(255,255,255,0.7);
}
.dark-mode .team-card {
  background: rgba(20,14,40,0.5);
  border-color: rgba(167,139,250,0.15);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(167,139,250,0.1);
}
.dark-mode .team-card:hover {
  box-shadow: 0 12px 36px rgba(108,88,185,0.25), inset 0 1px 0 rgba(167,139,250,0.15);
}

/* ─── Chat Bubble ─────────────────────────────────────────── */
.chat-bubble {
  position: absolute;
  bottom: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(124,108,168,0.2);
  border-radius: 18px;
  border-bottom-left-radius: 6px;
  padding: 12px 14px;
  box-shadow: 0 8px 32px rgba(108,88,185,0.18), 0 2px 8px rgba(108,88,185,0.1);
  z-index: 100;
  pointer-events: none;
}
.dark-mode .chat-bubble {
  background: rgba(20,14,40,0.92);
  border-color: rgba(167,139,250,0.25);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.bubble-text {
  font-family: "Outfit", sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(40,28,70,0.85);
  margin: 0;
}
.dark-mode .bubble-text { color: rgba(210,200,255,0.85); }

/* Tail */
.bubble-tail {
  position: absolute;
  bottom: -8px;
  left: 20px;
  width: 14px; height: 14px;
  background: rgba(255,255,255,0.92);
  border-right: 1px solid rgba(124,108,168,0.2);
  border-bottom: 1px solid rgba(124,108,168,0.2);
  transform: rotate(45deg);
  border-radius: 0 0 3px 0;
}
.dark-mode .bubble-tail {
  background: rgba(20,14,40,0.92);
  border-color: rgba(167,139,250,0.25);
}

/* Bubble transition */
.bubble-enter-active {
  animation: bubblePop 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.bubble-leave-active {
  animation: bubbleFade 0.18s ease forwards;
}
@keyframes bubblePop {
  from { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.92); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}
@keyframes bubbleFade {
  from { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  to   { opacity: 0; transform: translateX(-50%) translateY(4px) scale(0.95); }
}

/* ─── Avatar ──────────────────────────────────────────────── */
.avatar-wrap {
  position: relative;
  width: 72px; height: 72px;
  flex-shrink: 0;
  overflow: visible;
}
.avatar-img {
  width: 72px; height: 72px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  display: block;
  animation: avatarSway 3s ease-in-out infinite;
  transform-origin: bottom center;
}
.team-card:nth-child(2) .avatar-img { animation-delay: -1s; }
.team-card:nth-child(3) .avatar-img { animation-delay: -2s; }
.team-card:hover .avatar-img {
  animation: avatarWiggle 0.4s ease-in-out infinite alternate;
}
@keyframes avatarSway {
  0%   { transform: rotate(-2.5deg) translateX(-2px); }
  50%  { transform: rotate(2.5deg)  translateX(2px); }
  100% { transform: rotate(-2.5deg) translateX(-2px); }
}
@keyframes avatarWiggle {
  from { transform: rotate(-5deg) translateX(-3px); }
  to   { transform: rotate(5deg)  translateX(3px); }
}
.avatar-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(124,108,168,0.6), rgba(200,180,255,0.8), rgba(124,108,168,0.6));
  z-index: 1;
  animation: ringRotate 6s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.team-card:hover .avatar-ring { opacity: 1; }
.avatar-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%);
  z-index: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.team-card:hover .avatar-glow { opacity: 1; }
@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Pseudo-clip so ring is behind avatar */
.avatar-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: transparent;
  z-index: 3;
  pointer-events: none;
}

/* ─── Member info ─────────────────────────────────────────── */
.member-info { text-align: center; }
.member-name {
  font-family: "Playfair Display", serif;
  font-size: 1rem;
  font-weight: 700;
  color: rgba(40,28,70,0.9);
  margin: 0 0 3px;
}
.dark-mode .member-name { color: rgba(220,210,255,0.92); }
.member-role {
  font-family: "Outfit", sans-serif;
  font-size: 0.62rem;
  font-weight: 400;
  line-height: 1.45;
  color: rgba(74,63,122,0.6);
  margin: 0;
}
.dark-mode .member-role { color: rgba(167,139,250,0.55); }

/* ─── Member links ────────────────────────────────────────── */
.member-links {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  justify-content: center;
}
.link-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  border-radius: 20px;
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(124,108,168,0.22);
  font-family: "Outfit", sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  color: rgba(74,63,122,0.75);
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.link-btn:hover {
  background: rgba(255,255,255,0.75);
  border-color: rgba(124,108,168,0.45);
  color: rgba(40,28,70,0.95);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(108,88,185,0.12);
}
.link-btn.is-dark {
  background: rgba(255,255,255,0.05);
  border-color: rgba(167,139,250,0.2);
  color: rgba(167,139,250,0.65);
}
.link-btn.copied {
  background: rgba(108,88,185,0.12);
  border-color: rgba(108,88,185,0.45);
  color: rgba(74,63,122,0.95);
}
.link-btn.is-dark.copied {
  background: rgba(167,139,250,0.18);
  border-color: rgba(167,139,250,0.55);
  color: rgba(210,200,255,1);
}

/* ─── Form card ───────────────────────────────────────────── */
.form-card {
  position: relative;
  background: rgba(255,255,255,0.42);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 24px;
  padding: 26px 22px 22px;
  box-shadow: 0 4px 28px rgba(108,88,185,0.09), inset 0 1px 0 rgba(255,255,255,0.65);
  overflow: hidden;
}
.dark-mode .form-card {
  background: rgba(20,14,40,0.5);
  border-color: rgba(167,139,250,0.14);
}
.form-card-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(167,139,250,0.6), rgba(200,180,255,0.4), rgba(124,108,168,0.6));
  border-radius: 24px 24px 0 0;
}
.form-eyebrow {
  display: block;
  font-family: "Outfit", sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(74,63,122,0.55);
  margin-bottom: 18px;
}
.dark-mode .form-eyebrow { color: rgba(167,139,250,0.55); }

/* Fields */
.form-fields { display: flex; flex-direction: column; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-family: "Outfit", sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(74,63,122,0.6);
}
.dark-mode .field-label { color: rgba(167,139,250,0.55); }
.field-input, .field-textarea {
  width: 100%;
  background: rgba(255,255,255,0.5);
  border: 1.5px solid rgba(124,108,168,0.2);
  border-radius: 12px;
  padding: 11px 14px;
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  color: rgba(40,28,70,0.9);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
  resize: none;
}
.field-input::placeholder, .field-textarea::placeholder { color: rgba(124,108,168,0.4); }
.field-input:focus, .field-textarea:focus {
  border-color: rgba(124,108,168,0.55);
  box-shadow: 0 0 0 3px rgba(124,108,168,0.1);
  background: rgba(255,255,255,0.7);
}
.field-input.is-dark, .field-textarea.is-dark {
  background: rgba(255,255,255,0.06);
  border-color: rgba(167,139,250,0.2);
  color: rgba(220,210,255,0.9);
}
.field-input.is-dark::placeholder, .field-textarea.is-dark::placeholder { color: rgba(167,139,250,0.3); }
.field-input.is-dark:focus, .field-textarea.is-dark:focus {
  border-color: rgba(167,139,250,0.5);
  box-shadow: 0 0 0 3px rgba(167,139,250,0.08);
  background: rgba(255,255,255,0.09);
}

/* Topic chips */
.topic-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.topic-chip {
  font-family: "Outfit", sans-serif;
  font-size: 0.76rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid rgba(124,108,168,0.22);
  background: rgba(255,255,255,0.35);
  color: rgba(74,63,122,0.7);
  cursor: pointer;
  transition: all 0.18s ease;
}
.topic-chip:hover { border-color: rgba(124,108,168,0.5); background: rgba(255,255,255,0.55); color: rgba(74,63,122,1); }
.topic-chip.active { background: rgba(74,63,122,0.15); border-color: rgba(74,63,122,0.5); color: rgba(40,28,70,0.95); font-weight: 600; }
.topic-chip.is-dark { background: rgba(255,255,255,0.05); border-color: rgba(167,139,250,0.2); color: rgba(167,139,250,0.65); }
.topic-chip.is-dark:hover { background: rgba(167,139,250,0.1); border-color: rgba(167,139,250,0.45); color: rgba(200,190,255,0.95); }
.topic-chip.is-dark.active { background: rgba(167,139,250,0.18); border-color: rgba(167,139,250,0.6); color: rgba(220,210,255,1); }

/* Error */
.form-error {
  font-family: "Outfit", sans-serif;
  font-size: 0.76rem;
  color: rgba(180,60,60,0.9);
  background: rgba(255,100,100,0.1);
  border: 1px solid rgba(200,80,80,0.2);
  border-radius: 10px;
  padding: 8px 12px;
}

/* Submit */
.submit-btn {
  margin-top: 4px;
  padding: 13px 32px;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  border-radius: 50px;
  cursor: pointer;
  border: 1.5px solid rgba(140,100,60,0.35);
  background: linear-gradient(160deg, #f5f0e8 0%, #ede4d8 100%);
  color: #4a3520;
  box-shadow: 0 4px 0 rgba(140,100,60,0.2), 0 6px 18px rgba(100,70,40,0.12), inset 0 1px 0 rgba(255,255,255,0.7);
  transition: all 0.22s ease;
  width: 100%;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(160deg, #fff8f0 0%, #f5ece0 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 0 rgba(140,100,60,0.22), 0 10px 28px rgba(100,70,40,0.18), inset 0 1px 0 rgba(255,255,255,0.8);
}
.submit-btn:active:not(:disabled) { transform: translateY(2px); }
.submit-btn:disabled { opacity: 0.7; cursor: default; }
.submit-btn.is-dark {
  background: linear-gradient(160deg, #2a1f40 0%, #1e1530 100%);
  color: #c8b8f0;
  border-color: rgba(167,139,250,0.35);
  box-shadow: 0 4px 0 rgba(108,92,231,0.3), 0 6px 20px rgba(108,92,231,0.15), inset 0 1px 0 rgba(167,139,250,0.15);
}
.submit-btn.is-dark:hover:not(:disabled) {
  background: linear-gradient(160deg, #341e54 0%, #26183e 100%);
  transform: translateY(-2px);
}

/* Sending dots */
.dot-1, .dot-2, .dot-3 { animation: dotBounce 1.2s ease-in-out infinite; display: inline-block; }
.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.2s; }
.dot-3 { animation-delay: 0.4s; }
@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
  40% { transform: translateY(-3px); opacity: 1; }
}

/* Success */
.sent-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 12px 0; gap: 10px; }
.sent-glyph { font-size: 2.2rem; color: rgba(74,63,122,0.65); animation: glyph-rotate 8s linear infinite; }
.dark-mode .sent-glyph { color: rgba(167,139,250,0.65); }
@keyframes glyph-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.sent-title { font-family: "Playfair Display", serif; font-size: 1.4rem; font-weight: 700; color: rgba(40,28,70,0.9); margin: 0; }
.dark-mode .sent-title { color: rgba(220,210,255,0.9); }
.sent-body { font-family: "Outfit", sans-serif; font-size: 0.86rem; line-height: 1.65; color: rgba(74,63,122,0.75); margin: 0; max-width: 280px; }
.dark-mode .sent-body { color: rgba(200,190,255,0.7); }
.sent-reset { margin-top: 6px; background: transparent; border: none; font-family: "Outfit", sans-serif; font-size: 0.8rem; font-weight: 600; color: rgba(74,63,122,0.6); cursor: pointer; transition: color 0.2s; text-decoration: underline; text-underline-offset: 3px; }
.dark-mode .sent-reset { color: rgba(167,139,250,0.6); }
.sent-reset:hover { color: rgba(74,63,122,1); }

/* Footer note */
.contact-footer-note {
  font-family: "Outfit", sans-serif;
  font-size: 0.72rem;
  font-weight: 300;
  line-height: 1.7;
  text-align: center;
  color: rgba(74,63,122,0.45);
  margin: 0;
  padding-bottom: 12px;
}
.dark-mode .contact-footer-note { color: rgba(167,139,250,0.38); }

/* ─── Mobile intro (static, replaces hover bubble) ─── */
.member-intro-mobile {
  display: none;
}

@media (hover: none), (max-width: 600px) {
  .chat-bubble { display: none !important; }
  .member-intro-mobile {
    display: block;
    font-family: "Outfit", sans-serif;
    font-size: 0.74rem;
    font-weight: 400;
    line-height: 1.6;
    color: rgba(74,63,122,0.75);
    text-align: center;
    margin: 0;
    padding: 0 4px;
  }
  .dark-mode .member-intro-mobile { color: rgba(200,190,255,0.7); }
}

/* ─── Transition ─── */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-slide-enter-from { opacity: 0; transform: translateY(20px); }
.page-slide-leave-to { opacity: 0; transform: translateY(-12px); }

@media (max-width: 380px) {
  .team-grid { grid-template-columns: 1fr; }
}
</style>