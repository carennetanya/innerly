<template>
  <div v-if="visible" class="loading-screen" :class="{ 'dark-mode': isDark }">
    <!-- Theme toggle switch -->
    <div
      class="theme-toggle"
      @click="toggleTheme"
      :class="{ 'is-dark': isDark }"
    >
      <div class="toggle-light-scene">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
      </div>
      <div class="toggle-dark-scene">
        <div class="tstar tstar-1"></div>
        <div class="tstar tstar-2"></div>
        <div class="tstar tstar-3"></div>
        <div class="tstar tstar-4"></div>
      </div>
      <div class="toggle-knob">
        <div class="crater crater-1"></div>
        <div class="crater crater-2"></div>
        <div class="crater crater-3"></div>
        <div class="sun-glow"></div>
      </div>
    </div>

    <div class="bg-overlay"></div>

    <!-- Ambient floating particles (always on after phase 4) -->
    <div class="ambient" :class="{ active: phase >= 5 }">
      <div
        class="amb-spark"
        v-for="i in 18"
        :key="'a' + i"
        :style="getAmbientStyle(i)"
      ></div>
    </div>

    <!-- Floating clouds/fog blobs -->
    <div class="fog-scene" :class="{ active: phase >= 5 }">
      <div class="fog-blob fog-blob-1"></div>
      <div class="fog-blob fog-blob-2"></div>
      <div class="fog-blob fog-blob-3"></div>
      <div class="fog-blob fog-blob-4"></div>
    </div>

    <div class="stage">
      <div class="ripple ripple-1" :class="{ active: phase >= 2 }"></div>
      <div class="ripple ripple-2" :class="{ active: phase >= 2 }"></div>

      <template v-if="showSparks1">
        <div
          v-for="i in 20"
          :key="'s' + i"
          class="spark"
          :style="getSparkStyle(i, 20)"
        ></div>
      </template>
      <template v-if="showSparks2">
        <div
          v-for="i in 18"
          :key="'b' + i"
          class="spark spark-burst"
          :style="getSparkStyle(i, 18)"
        ></div>
      </template>

      <div class="portal" :class="portalClass"></div>

      <div class="logo-wrapper" :class="{ revealed: phase >= 3 }">
        <img src="/logo.png" alt="Innerly Logo" class="logo-img" />
      </div>
    </div>

    <div class="brand" :class="{ visible: phase >= 4 }">
      <div class="brand-text-wrap" :class="{ sweep: phase >= 4 }">
        <span class="brand-text">Innerly</span>
      </div>
      <span class="brand-tagline">Reflect deeper, grow stronger.</span>

      <button
        class="start-btn"
        :class="{ show: phase >= 6 }"
        @click="handleStart"
      >
        Start Your Inner Space
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const emit = defineEmits(["done"]);
const phase = ref(0);
const visible = ref(true);
const showSparks1 = ref(false);
const showSparks2 = ref(false);
const isDark = ref(false);

function toggleTheme() {
  isDark.value = !isDark.value;
}
function handleStart() {
  emit("done");
}

const portalClass = computed(() => {
  if (phase.value >= 3) return "phase-hold";
  if (phase.value >= 2) return "phase-expand";
  if (phase.value >= 1) return "phase-appear";
  return "";
});

function getSparkStyle(i, total) {
  const angle = (i / total) * 360;
  const delay = (i / total) * 0.45;
  const dist = 110 + (i % 4) * 18;
  return {
    "--angle": `${angle}deg`,
    "--dist": `${dist}px`,
    animationDelay: `${delay}s`,
  };
}

function getAmbientStyle(i) {
  const angle = Math.random() * 360;
  const x = 10 + ((i * 83) % 80); // spread across screen %
  const y = 10 + ((i * 67) % 80);
  const dur = 4 + (i % 5) * 1.2;
  const delay = (i * 0.37) % 3;
  const size = 2 + (i % 3);
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${dur}s`,
    animationDelay: `${delay}s`,
  };
}

onMounted(() => {
  // Phase 1: portal appear
  setTimeout(() => {
    phase.value = 1;
  }, 300);

  // Phase 2: portal expand + sparks 1
  setTimeout(() => {
    phase.value = 2;
    showSparks1.value = true;
    setTimeout(() => {
      showSparks1.value = false;
    }, 1200);
  }, 900);

  // Phase 3: logo reveal + sparks 2
  setTimeout(() => {
    phase.value = 3;
    showSparks2.value = true;
    setTimeout(() => {
      showSparks2.value = false;
    }, 1200);
  }, 2700);

  // Phase 4: brand text muncul
  setTimeout(() => {
    phase.value = 4;
  }, 3400);

  // Phase 5: ambient fog + sparks aktif (2.5 detik setelah brand)
  setTimeout(() => {
    phase.value = 5;
  }, 5900);

  // Phase 6: tombol muncul (1.8 detik setelah fog)
  setTimeout(() => {
    phase.value = 6;
  }, 7700);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Outfit:wght@300;400;600&display=swap");

.loading-screen {
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 40%,
    #ede8f5 0%,
    #d9d1ea 45%,
    #c5bad8 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}
.loading-screen.dark-mode {
  background: radial-gradient(
    ellipse at 50% 40%,
    #0d1a27 0%,
    #060c12 60%,
    #020609 100%
  );
}

/* ── Toggle ── */
.theme-toggle {
  position: absolute;
  top: 22px;
  right: 24px;
  z-index: 100;
  width: 80px;
  height: 40px;
  border-radius: 40px;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(135deg, #c5bad8 0%, #9e93c0 100%);
  box-shadow:
    0 3px 16px rgba(74, 63, 122, 0.25),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  transition:
    background 0.5s ease,
    box-shadow 0.4s ease,
    transform 0.2s ease;
  user-select: none;
}
.theme-toggle.is-dark {
  background: linear-gradient(135deg, #1a2340 0%, #0e1628 100%);
  box-shadow:
    0 3px 16px rgba(0, 0, 0, 0.5),
    inset 0 1px 2px rgba(255, 255, 255, 0.05);
}
.theme-toggle:hover {
  transform: scale(1.04);
}
.toggle-light-scene {
  position: absolute;
  inset: 0;
  opacity: 1;
  transition: opacity 0.4s;
}
.is-dark .toggle-light-scene {
  opacity: 0;
}
.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
}
.cloud::before,
.cloud::after {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}
.cloud-1 {
  width: 22px;
  height: 8px;
  top: 10px;
  left: 8px;
}
.cloud-1::before {
  width: 10px;
  height: 10px;
  top: -5px;
  left: 3px;
}
.cloud-1::after {
  width: 7px;
  height: 7px;
  top: -3px;
  left: 10px;
}
.cloud-2 {
  width: 18px;
  height: 7px;
  top: 22px;
  left: 10px;
}
.cloud-2::before {
  width: 8px;
  height: 8px;
  top: -4px;
  left: 2px;
}
.cloud-2::after {
  width: 6px;
  height: 6px;
  top: -2px;
  left: 8px;
}
.toggle-dark-scene {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s;
}
.is-dark .toggle-dark-scene {
  opacity: 1;
}
.tstar {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}
.tstar-1 {
  width: 3px;
  height: 3px;
  top: 10px;
  left: 50px;
}
.tstar-2 {
  width: 2px;
  height: 2px;
  top: 18px;
  left: 60px;
}
.tstar-3 {
  width: 2px;
  height: 2px;
  top: 28px;
  left: 54px;
}
.tstar-4 {
  width: 2px;
  height: 2px;
  top: 14px;
  left: 65px;
}
.toggle-knob {
  position: absolute;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  overflow: hidden;
  background: radial-gradient(
    circle at 35% 35%,
    #f8f0ff 0%,
    #e8daf5 40%,
    #c5b8dc 100%
  );
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.6);
  transition:
    transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1),
    background 0.4s,
    box-shadow 0.4s;
}
.is-dark .toggle-knob {
  transform: translateX(40px);
  background: radial-gradient(
    circle at 35% 35%,
    #e8e0f8 0%,
    #c8bce8 40%,
    #a090cc 100%
  );
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.5),
    inset 0 1px 3px rgba(255, 255, 255, 0.15);
}
.sun-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 240, 180, 0.9) 0%,
    rgba(255, 200, 60, 0.4) 50%,
    transparent 75%
  );
  opacity: 1;
  transition: opacity 0.4s;
}
.is-dark .sun-glow {
  opacity: 0;
}
.crater {
  position: absolute;
  border-radius: 50%;
  background: rgba(160, 140, 200, 0.45);
  opacity: 0;
  transition: opacity 0.4s;
}
.is-dark .crater {
  opacity: 1;
}
.crater-1 {
  width: 8px;
  height: 8px;
  top: 8px;
  left: 8px;
}
.crater-2 {
  width: 5px;
  height: 5px;
  top: 18px;
  left: 16px;
}
.crater-3 {
  width: 6px;
  height: 6px;
  top: 10px;
  left: 20px;
}

/* ── bg noise ── */
.bg-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* ── Fog blobs ── */
.fog-scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 1.4s ease;
}
.fog-scene.active {
  opacity: 1;
}

.fog-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: fogDrift linear infinite;
}

/* Light mode fog: soft indigo/lavender blobs */
.loading-screen:not(.dark-mode) .fog-blob-1 {
  width: 280px;
  height: 180px;
  top: 8%;
  left: -5%;
  background: radial-gradient(
    ellipse,
    rgba(180, 165, 215, 0.45) 0%,
    transparent 70%
  );
  animation-duration: 14s;
  animation-delay: 0s;
}
.loading-screen:not(.dark-mode) .fog-blob-2 {
  width: 240px;
  height: 160px;
  bottom: 12%;
  right: -4%;
  background: radial-gradient(
    ellipse,
    rgba(200, 185, 235, 0.4) 0%,
    transparent 70%
  );
  animation-duration: 17s;
  animation-delay: -4s;
}
.loading-screen:not(.dark-mode) .fog-blob-3 {
  width: 200px;
  height: 140px;
  top: 50%;
  left: 60%;
  background: radial-gradient(
    ellipse,
    rgba(210, 195, 240, 0.35) 0%,
    transparent 70%
  );
  animation-duration: 12s;
  animation-delay: -7s;
}
.loading-screen:not(.dark-mode) .fog-blob-4 {
  width: 180px;
  height: 130px;
  bottom: 25%;
  left: 5%;
  background: radial-gradient(
    ellipse,
    rgba(170, 155, 210, 0.38) 0%,
    transparent 70%
  );
  animation-duration: 19s;
  animation-delay: -2s;
}

/* Dark mode fog: purple/navy blobs */
.dark-mode .fog-blob-1 {
  width: 300px;
  height: 200px;
  top: 5%;
  left: -8%;
  background: radial-gradient(
    ellipse,
    rgba(108, 92, 231, 0.22) 0%,
    transparent 70%
  );
  animation-duration: 14s;
  animation-delay: 0s;
}
.dark-mode .fog-blob-2 {
  width: 260px;
  height: 180px;
  bottom: 10%;
  right: -6%;
  background: radial-gradient(
    ellipse,
    rgba(74, 63, 122, 0.28) 0%,
    transparent 70%
  );
  animation-duration: 17s;
  animation-delay: -4s;
}
.dark-mode .fog-blob-3 {
  width: 220px;
  height: 150px;
  top: 45%;
  left: 55%;
  background: radial-gradient(
    ellipse,
    rgba(245, 166, 35, 0.1) 0%,
    transparent 70%
  );
  animation-duration: 12s;
  animation-delay: -7s;
}
.dark-mode .fog-blob-4 {
  width: 200px;
  height: 140px;
  bottom: 22%;
  left: 3%;
  background: radial-gradient(
    ellipse,
    rgba(106, 176, 76, 0.1) 0%,
    transparent 70%
  );
  animation-duration: 19s;
  animation-delay: -2s;
}

@keyframes fogDrift {
  0% {
    transform: translateX(0px) translateY(0px) scale(1);
  }
  25% {
    transform: translateX(18px) translateY(-12px) scale(1.05);
  }
  50% {
    transform: translateX(30px) translateY(8px) scale(0.97);
  }
  75% {
    transform: translateX(10px) translateY(20px) scale(1.03);
  }
  100% {
    transform: translateX(0px) translateY(0px) scale(1);
  }
}

/* ── Ambient floating sparks ── */
.ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.ambient.active {
  opacity: 1;
}

.amb-spark {
  position: absolute;
  border-radius: 50%;
  animation: ambFloat ease-in-out infinite;
}
/* Light mode ambient sparks */
.loading-screen:not(.dark-mode) .amb-spark {
  background: rgba(120, 100, 170, 0.55);
  box-shadow: 0 0 5px 2px rgba(120, 100, 170, 0.4);
}
.loading-screen:not(.dark-mode) .amb-spark:nth-child(3n) {
  background: rgba(160, 140, 200, 0.5);
  box-shadow: 0 0 6px 2px rgba(160, 140, 200, 0.35);
}
.loading-screen:not(.dark-mode) .amb-spark:nth-child(3n + 1) {
  background: rgba(190, 170, 220, 0.45);
  box-shadow: 0 0 4px 1px rgba(190, 170, 220, 0.3);
}
/* Dark mode ambient sparks */
.dark-mode .amb-spark {
  background: rgba(167, 139, 250, 0.6);
  box-shadow: 0 0 6px 2px rgba(167, 139, 250, 0.4);
}
.dark-mode .amb-spark:nth-child(3n) {
  background: rgba(245, 166, 35, 0.55);
  box-shadow: 0 0 6px 2px rgba(245, 166, 35, 0.4);
}
.dark-mode .amb-spark:nth-child(3n + 1) {
  background: rgba(106, 176, 76, 0.5);
  box-shadow: 0 0 5px 2px rgba(106, 176, 76, 0.35);
}

@keyframes ambFloat {
  0% {
    transform: translateY(0px) scale(1);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  50% {
    transform: translateY(-22px) scale(1.2);
    opacity: 0.9;
  }
  85% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-44px) scale(0.7);
    opacity: 0;
  }
}

/* ── Stage ── */
.stage {
  position: relative;
  z-index: 2;
  width: 380px;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Ripples ── */
.ripple {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(100, 80, 160, 0.2);
  opacity: 0;
  pointer-events: none;
}
.dark-mode .ripple {
  border-color: rgba(167, 139, 250, 0.2);
}
.ripple-1 {
  width: 250px;
  height: 250px;
}
.ripple-2 {
  width: 330px;
  height: 330px;
}
.ripple.active {
  animation: rippleAnim 2s ease-out forwards;
}
.ripple-2.active {
  animation: rippleAnim 2s ease-out 0.3s forwards;
}
@keyframes rippleAnim {
  0% {
    opacity: 0;
    transform: scale(0.4);
  }
  25% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: scale(1.6);
  }
}

/* ── Sparks ── */
.spark {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #7c6ca8;
  box-shadow: 0 0 6px 2px rgba(124, 108, 168, 0.9);
  opacity: 0;
  animation: sparkFly 0.8s ease-out forwards;
}
.spark:nth-child(3n) {
  background: #9d8cc0;
  box-shadow: 0 0 6px 2px rgba(157, 140, 192, 0.9);
  width: 4px;
  height: 4px;
}
.spark:nth-child(3n + 1) {
  background: #b8a8d8;
  box-shadow: 0 0 6px 2px rgba(184, 168, 216, 0.9);
}
.dark-mode .spark {
  background: #a78bfa;
  box-shadow: 0 0 6px 2px rgba(167, 139, 250, 0.9);
}
.dark-mode .spark:nth-child(3n) {
  background: #f5a623;
  box-shadow: 0 0 6px 2px rgba(245, 166, 35, 0.9);
  width: 4px;
  height: 4px;
}
.dark-mode .spark:nth-child(3n + 1) {
  background: #6ab04c;
  box-shadow: 0 0 6px 2px rgba(106, 176, 76, 0.9);
}
.spark-burst {
  width: 4px;
  height: 4px;
  animation-duration: 1s;
}
.spark-burst:nth-child(3n) {
  width: 5px;
  height: 5px;
}
@keyframes sparkFly {
  0% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(50px) scale(1.2);
  }
  15% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(var(--dist)) scale(0.1);
  }
}

/* ── Portal ── */
.portal {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: conic-gradient(
    from 0deg,
    #4a3f7a 0%,
    #7c6ca8 25%,
    #b8a8d0 50%,
    #7c6ca8 75%,
    #4a3f7a 100%
  );
  -webkit-mask-image: radial-gradient(circle, transparent 72%, black 75%);
  mask-image: radial-gradient(circle, transparent 72%, black 75%);
  width: 0;
  height: 0;
  opacity: 0;
}
.dark-mode .portal {
  background: conic-gradient(
    from 0deg,
    #6c5ce7 0%,
    #a78bfa 20%,
    #f5a623 45%,
    #6ab04c 65%,
    #a78bfa 85%,
    #6c5ce7 100%
  );
}
.portal.phase-appear {
  animation: portalAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes portalAppear {
  to {
    width: 30px;
    height: 30px;
    opacity: 1;
  }
}
.portal.phase-expand {
  animation: portalSpinExpand 1.7s cubic-bezier(0.25, 0.8, 0.35, 1) forwards;
}
@keyframes portalSpinExpand {
  0% {
    width: 30px;
    height: 30px;
    opacity: 1;
    transform: rotate(0deg);
  }
  40% {
    width: 100px;
    height: 100px;
    transform: rotate(200deg);
  }
  100% {
    width: 210px;
    height: 210px;
    opacity: 1;
    transform: rotate(540deg);
    box-shadow:
      0 0 40px 10px rgba(100, 80, 160, 0.25),
      0 0 80px 20px rgba(74, 63, 122, 0.12);
  }
}
.portal.phase-hold {
  animation: portalIdleSpin 6s linear infinite;
  width: 210px;
  height: 210px;
  opacity: 1;
  box-shadow:
    0 0 40px 10px rgba(100, 80, 160, 0.25),
    0 0 80px 20px rgba(74, 63, 122, 0.12);
}
.dark-mode .portal.phase-hold {
  box-shadow:
    0 0 40px 10px rgba(167, 139, 250, 0.3),
    0 0 80px 20px rgba(245, 166, 35, 0.12);
}
@keyframes portalIdleSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ── Logo ── */
.logo-wrapper {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-wrapper.revealed {
  animation: logoReveal 0.7s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
@keyframes logoReveal {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    width: 320px;
    height: 320px;
    opacity: 1;
    filter: drop-shadow(0 0 14px rgba(100, 80, 160, 0.35))
      drop-shadow(0 0 32px rgba(74, 63, 122, 0.18));
  }
}
.dark-mode .logo-wrapper.revealed {
  animation: logoRevealDark 0.7s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
@keyframes logoRevealDark {
  0% {
    width: 0;
    height: 0;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    width: 320px;
    height: 320px;
    opacity: 1;
    filter: drop-shadow(0 0 14px rgba(167, 139, 250, 0.5))
      drop-shadow(0 0 32px rgba(245, 166, 35, 0.2));
  }
}
.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
}
.dark-mode .logo-img {
  mix-blend-mode: lighten;
}

/* ── Brand ── */
.brand {
  margin-top: -70px;
  text-align: center;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.brand.visible {
  opacity: 1;
  transform: translateY(0);
}

.brand-text-wrap {
  display: inline-block;
}
.brand-text-wrap.sweep {
  animation: wrapSweepLight 1.8s ease both;
  animation-delay: 0.1s;
}
.dark-mode .brand-text-wrap.sweep {
  animation: wrapSweepDark 1.8s ease both;
  animation-delay: 0.1s;
}
@keyframes wrapSweepLight {
  0% {
    opacity: 0.3;
    transform: scale(0.96);
  }
  40% {
    filter: drop-shadow(0 0 18px rgba(100, 80, 160, 0.7))
      drop-shadow(0 0 35px rgba(74, 63, 122, 0.4));
    transform: scale(1.03);
  }
  100% {
    filter: drop-shadow(0 0 6px rgba(100, 80, 160, 0.2));
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes wrapSweepDark {
  0% {
    opacity: 0.3;
    transform: scale(0.96);
  }
  40% {
    filter: drop-shadow(0 0 18px rgba(167, 139, 250, 0.9))
      drop-shadow(0 0 35px rgba(245, 166, 35, 0.6));
    transform: scale(1.03);
  }
  100% {
    filter: drop-shadow(0 0 6px rgba(167, 139, 250, 0.3));
    transform: scale(1);
    opacity: 1;
  }
}

.brand-text {
  display: block;
  font-family: "Playfair Display", Georgia, serif;
  font-weight: 700;
  font-size: 2.8rem;
  letter-spacing: 0.04em;
  line-height: 1.3;
  padding-bottom: 0.15em;
  background: linear-gradient(135deg, #2d2460 0%, #5a4d8a 50%, #8b7cc0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.dark-mode .brand-text {
  background: linear-gradient(
    135deg,
    #6c5ce7 0%,
    #a78bfa 35%,
    #f5a623 75%,
    #f9e04b 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  display: block;
  font-family: "Outfit", sans-serif;
  font-weight: 300;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  color: rgba(74, 63, 122, 0.6);
  margin-top: 4px;
  text-transform: uppercase;
}
.dark-mode .brand-tagline {
  color: rgba(106, 176, 76, 0.7);
}

/* ── Start button ── */
.start-btn {
  margin-top: 30px;
  padding: 13px 36px;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  border-radius: 50px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
  background: linear-gradient(160deg, #f5f0e8 0%, #ede4d8 100%);
  color: #4a3520;
  border: 1.5px solid rgba(140, 100, 60, 0.35);
  box-shadow:
    0 4px 0 rgba(140, 100, 60, 0.2),
    0 6px 18px rgba(100, 70, 40, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}
.start-btn.show {
  opacity: 1;
  transform: translateY(0);
}
.start-btn:hover {
  background: linear-gradient(160deg, #fff8f0 0%, #f5ece0 100%);
  box-shadow:
    0 5px 0 rgba(140, 100, 60, 0.22),
    0 10px 28px rgba(100, 70, 40, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}
.start-btn:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 rgba(140, 100, 60, 0.2),
    0 3px 10px rgba(100, 70, 40, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.dark-mode .start-btn {
  background: linear-gradient(160deg, #2a1f40 0%, #1e1530 100%);
  color: #c8b8f0;
  border: 1.5px solid rgba(167, 139, 250, 0.35);
  box-shadow:
    0 4px 0 rgba(108, 92, 231, 0.3),
    0 6px 20px rgba(108, 92, 231, 0.15),
    inset 0 1px 0 rgba(167, 139, 250, 0.15);
}
.dark-mode .start-btn:hover {
  background: linear-gradient(160deg, #341e54 0%, #26183e 100%);
  box-shadow:
    0 5px 0 rgba(108, 92, 231, 0.35),
    0 10px 30px rgba(167, 139, 250, 0.2),
    inset 0 1px 0 rgba(167, 139, 250, 0.2);
  transform: translateY(-2px);
}
.dark-mode .start-btn:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 rgba(108, 92, 231, 0.25),
    0 3px 12px rgba(108, 92, 231, 0.12),
    inset 0 1px 0 rgba(167, 139, 250, 0.1);
}
</style>
