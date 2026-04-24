<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="nm-overlay" @click.self="maybeSkip">
      <div class="nm-book" :class="{ open: bookOpen, 'is-dark': isDark }">
        <!-- Book spine -->
        <div class="nm-spine"></div>

        <!-- ═══ LEFT PAGE ═══ -->
        <div
          class="nm-page nm-page-left"
          :class="{ 'page-flip-out': isFlipping }"
        >
          <div class="nm-page-lines">
            <div v-for="i in 14" :key="i" class="nm-line"></div>
          </div>
          <Transition name="page-content" mode="out-in">
            <div v-if="currentPage === 1" key="l1" class="nm-deco-quote">
              <span class="nm-deco-mark">"</span>
              <p>Every journey<br />begins with a<br />first word.</p>
            </div>
            <div
              v-else-if="currentPage === 2"
              key="l2"
              class="nm-left-greeting"
            >
              <div class="nm-left-quill">
                <svg viewBox="0 0 40 40" fill="none">
                  <path
                    d="M35 5C35 5 20 8 12 20C8 26 8 34 8 34C8 34 14 30 18 26C16 24 16 20 20 18C24 16 26 20 24 24C28 22 32 16 35 5Z"
                    fill="currentColor"
                    opacity="0.12"
                  />
                  <path
                    d="M35 5C35 5 20 8 12 20C8 26 8 34 8 34C8 34 14 30 18 26C16 24 16 20 20 18C24 16 26 20 24 24C28 22 32 16 35 5Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 34L14 28"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <p class="nm-left-label">Reflecting today</p>
              <p class="nm-left-name">{{ resolvedName }}</p>
              <div class="nm-left-divider"></div>
              <p class="nm-left-hint">
                Take your time.<br />There's no rush here.
              </p>
            </div>
            <div
              v-else-if="currentPage === 3"
              key="l3"
              class="nm-overflow-page"
            >
              <p class="nm-overflow-label">...continued</p>
              <div class="nm-overflow-text">{{ reflection }}</div>
            </div>
          </Transition>
          <div class="nm-page-number">
            {{ currentPage === 1 ? "i" : currentPage === 2 ? "2" : "4" }}
          </div>
        </div>

        <!-- ═══ RIGHT PAGE ═══ -->
        <div class="nm-page nm-page-right">
          <div class="nm-page-lines">
            <div v-for="i in 14" :key="i" class="nm-line"></div>
          </div>
          <Transition name="page-content" mode="out-in">
            <!-- Page 1: Name -->
            <div v-if="currentPage === 1" key="r1" class="nm-content">
              <div class="nm-quill-wrap">
                <svg class="nm-quill" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M35 5C35 5 20 8 12 20C8 26 8 34 8 34C8 34 14 30 18 26C16 24 16 20 20 18C24 16 26 20 24 24C28 22 32 16 35 5Z"
                    fill="currentColor"
                    opacity="0.15"
                  />
                  <path
                    d="M35 5C35 5 20 8 12 20C8 26 8 34 8 34C8 34 14 30 18 26C16 24 16 20 20 18C24 16 26 20 24 24C28 22 32 16 35 5Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 34L14 28"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <p class="nm-eyebrow">Before we begin</p>
              <h2 class="nm-heading">What shall I<br />call you?</h2>
              <p class="nm-sub">Your name stays just between us.</p>
              <div class="nm-input-wrap">
                <input
                  ref="nameInputRef"
                  v-model="name"
                  type="text"
                  class="nm-input"
                  placeholder="Your name..."
                  maxlength="30"
                  @keydown.enter="goToPage2"
                />
                <div class="nm-input-underline"></div>
              </div>
              <div class="nm-actions">
                <button
                  class="nm-btn-primary"
                  @click="goToPage2"
                  :disabled="name.trim().length === 0"
                >
                  <span>Continue</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button class="nm-btn-skip" @click="skipAll">
                  skip for now
                </button>
              </div>
            </div>

            <!-- Page 2: Reflection -->
            <div
              v-else-if="currentPage === 2"
              key="r2"
              class="nm-content nm-content-reflection"
            >
              <p class="nm-eyebrow">Page 1 · Reflection</p>
              <h2 class="nm-heading nm-heading-sm">
                {{ resolvedGreeting }},<br />what's one thing you'd like<br />to
                reflect on today?
              </h2>
              <div class="nm-textarea-wrap">
                <textarea
                  ref="reflectionRef"
                  v-model="reflection"
                  class="nm-textarea"
                  placeholder="e.g. Today's presentation in class felt less than ideal..."
                  @input="onTextareaInput"
                  @keydown="onTextareaKeydown"
                  @scroll.prevent="
                    () => {
                      if (reflectionRef) reflectionRef.scrollTop = 0;
                    }
                  "
                ></textarea>
                <div class="nm-textarea-line"></div>
              </div>
              <div class="nm-char-hint" :class="{ overflow: isOverflowing }">
                <span v-if="isOverflowing"
                  >✦ Your reflection continues on the next page →</span
                >
                <span v-else>Write freely — it can be long or short.</span>
              </div>
              <div class="nm-actions">
                <button
                  class="nm-btn-primary"
                  @click="handleReflectionContinue"
                  :disabled="reflection.trim().length === 0"
                >
                  <span>{{
                    isOverflowing ? "Next page →" : "Let's begin"
                  }}</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button class="nm-btn-ghost" @click="goBackToPage1">
                  ← back
                </button>
              </div>
            </div>

            <!-- Page 3: Overflow -->
            <div
              v-else-if="currentPage === 3"
              key="r3"
              class="nm-content nm-content-reflection"
            >
              <p class="nm-eyebrow">Page 2 · Continued</p>
              <h2 class="nm-heading nm-heading-sm">Keep going...</h2>
              <div class="nm-textarea-wrap">
                <textarea
                  ref="overflowRef"
                  v-model="reflectionOverflow"
                  class="nm-textarea"
                  placeholder="Continue writing here..."
                ></textarea>
                <div class="nm-textarea-line"></div>
              </div>
              <div class="nm-actions">
                <button class="nm-btn-primary" @click="handleDone">
                  <span>Done &amp; begin</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button class="nm-btn-ghost" @click="goBackToPage2">
                  ← back
                </button>
              </div>
            </div>
          </Transition>
          <div class="nm-page-number">
            {{ currentPage === 1 ? "1" : currentPage === 2 ? "3" : "5" }}
          </div>
        </div>

        <div class="nm-flip-shadow" :class="{ active: isFlipping }"></div>
        <div class="nm-corner-fold"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, nextTick, watch } from "vue";

const props = defineProps({ isDark: Boolean });
const emit = defineEmits(["done"]);

const visible = ref(false);
const bookOpen = ref(false);
const isFlipping = ref(false);
const currentPage = ref(1);

const name = ref("");
const reflection = ref("");
const reflectionOverflow = ref("");
const isOverflowing = ref(false);

const nameInputRef = ref(null);
const reflectionRef = ref(null);
const overflowRef = ref(null);

const OVERFLOW_CHARS = 300;
const MAX_TEXTAREA_H = 180;

// Resize textarea whenever reflection changes (including on restore)
watch(reflection, () => {
  nextTick(() => {
    const el = reflectionRef.value;
    if (!el) return;
    el.value = reflection.value;
    el.style.height = "auto";
    const natural = el.scrollHeight;
    el.style.height = Math.min(natural, MAX_TEXTAREA_H) + "px";
    isOverflowing.value = natural > MAX_TEXTAREA_H;
    el.scrollTop = 0;
  });
});

const resolvedName = computed(() => name.value.trim() || "Hi there");
const resolvedGreeting = computed(() =>
  name.value.trim() ? name.value.trim() : "Hi there",
);

function open() {
  visible.value = true;
  currentPage.value = 1;
  setTimeout(() => {
    bookOpen.value = true;
    setTimeout(() => nameInputRef.value?.focus(), 700);
  }, 80);
}

function flipPage(to, afterFlip) {
  isFlipping.value = true;
  setTimeout(() => {
    currentPage.value = to;
    isFlipping.value = false;
    afterFlip?.();
  }, 420);
}

function goToPage2() {
  flipPage(2, () =>
    nextTick(() => {
      const el = reflectionRef.value;
      if (!el) return;
      el.focus();
      // Lock scrollTop permanently via native listener
      el.addEventListener(
        "scroll",
        () => {
          el.scrollTop = 0;
        },
        { passive: true },
      );
      // Resize to current content
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, MAX_TEXTAREA_H) + "px";
    }),
  );
}
function goBackToPage1() {
  flipPage(1, () => nextTick(() => nameInputRef.value?.focus()));
}
function goBackToPage2() {
  // Restore full text first
  const full = reflectionOverflow.value
    ? reflection.value + " " + reflectionOverflow.value
    : reflection.value;
  reflection.value = full;
  reflectionOverflow.value = "";
  isOverflowing.value = false;

  flipPage(2, () => {
    setTimeout(() => {
      const el = reflectionRef.value;
      if (!el) return;
      el.value = reflection.value;
      el.style.height = "auto";
      const natural = el.scrollHeight;
      el.style.height = Math.min(natural, MAX_TEXTAREA_H) + "px";
      isOverflowing.value = natural > MAX_TEXTAREA_H;
      el.scrollTop = 0;
      el.focus();
    }, 200);
  });
}

function onTextareaInput() {
  const el = reflectionRef.value;
  if (!el) return;
  el.style.height = "auto";
  const natural = el.scrollHeight;
  el.style.height = Math.min(natural, MAX_TEXTAREA_H) + "px";
  isOverflowing.value = natural > MAX_TEXTAREA_H;
  // Always keep scroll at top — no scrolling allowed
  el.scrollTop = 0;
}

function onTextareaKeydown(e) {
  // When overflowing, block any key that adds characters (except navigation/delete)
  if (!isOverflowing.value) return;
  const allowed = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
    "Tab",
  ];
  if (e.ctrlKey || e.metaKey) return; // allow copy/paste shortcuts
  if (!allowed.includes(e.key)) {
    e.preventDefault();
  }
}

function handleReflectionContinue() {
  if (isOverflowing.value) {
    const el = reflectionRef.value;
    const text = reflection.value;

    // Binary search: find the longest prefix that fits in MAX_TEXTAREA_H
    let lo = 0;
    let hi = text.length;
    let fitIdx = 0;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.value = text.slice(0, mid);
      el.style.height = "auto";
      if (el.scrollHeight <= MAX_TEXTAREA_H) {
        fitIdx = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    // Restore original value
    el.value = text;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, MAX_TEXTAREA_H) + "px";

    // Snap to word boundary — find last space AT or before fitIdx
    const snapAt = text.lastIndexOf(" ", fitIdx);
    // Only snap back if there's a space reasonably close
    const idx = snapAt > 0 && fitIdx - snapAt < 30 ? snapAt : fitIdx;

    reflectionOverflow.value = text.slice(idx).trimStart();
    reflection.value = text.slice(0, idx).trimEnd();
    isOverflowing.value = false;

    flipPage(3, () =>
      setTimeout(() => {
        const ov = overflowRef.value;
        if (!ov) return;
        ov.value = reflectionOverflow.value;
        ov.style.height = "auto";
        ov.style.height = Math.min(ov.scrollHeight, MAX_TEXTAREA_H) + "px";
        ov.focus();
      }, 200),
    );
  } else {
    handleDone();
  }
}

function handleDone() {
  const full = reflectionOverflow.value
    ? reflection.value + " " + reflectionOverflow.value
    : reflection.value;
  emit("done", name.value.trim(), full.trim());
  close();
}

function skipAll() {
  goToPage2();
}

function maybeSkip() {
  if (currentPage.value === 1) skipAll();
}

function close() {
  bookOpen.value = false;
  setTimeout(() => {
    visible.value = false;
    currentPage.value = 1;
    name.value = "";
    reflection.value = "";
    reflectionOverflow.value = "";
    isOverflowing.value = false;
  }, 500);
}

defineExpose({ open });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;600&family=IM+Fell+English:ital@1&display=swap");

.nm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 12, 38, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.nm-book {
  position: relative;
  display: flex;
  width: 680px;
  max-width: 98vw;
  height: 420px;
  transform: scale(0.9) rotateY(-10deg);
  opacity: 0;
  transition:
    transform 0.65s cubic-bezier(0.34, 1.1, 0.64, 1),
    opacity 0.5s ease;
  filter: drop-shadow(0 24px 64px rgba(18, 12, 38, 0.55))
    drop-shadow(0 4px 18px rgba(18, 12, 38, 0.3));
}
.nm-book.open {
  transform: scale(1) rotateY(0deg);
  opacity: 1;
}

.nm-spine {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    rgba(100, 80, 160, 0.45) 0%,
    rgba(55, 42, 100, 0.75) 50%,
    rgba(100, 80, 160, 0.45) 100%
  );
  z-index: 10;
  box-shadow:
    1px 0 6px rgba(100, 80, 160, 0.2),
    -1px 0 6px rgba(100, 80, 160, 0.2);
}
.nm-book.is-dark .nm-spine {
  background: linear-gradient(
    180deg,
    rgba(167, 139, 250, 0.35) 0%,
    rgba(108, 92, 231, 0.65) 50%,
    rgba(167, 139, 250, 0.35) 100%
  );
}

.nm-page {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 28px 26px 22px;
}
.nm-page-left {
  background: linear-gradient(160deg, #f5f0e8 0%, #ede5d5 55%, #e4d9c8 100%);
  border-radius: 4px 0 0 4px;
  border: 1px solid rgba(140, 108, 65, 0.22);
  border-right: none;
}
.nm-page-right {
  background: linear-gradient(160deg, #fbf8f3 0%, #f5efe4 55%, #ede5d5 100%);
  border-radius: 0 4px 4px 0;
  border: 1px solid rgba(140, 108, 65, 0.22);
  border-left: none;
}
.nm-book.is-dark .nm-page-left {
  background: linear-gradient(160deg, #1c1530 0%, #160f25 55%, #110c1d 100%);
  border-color: rgba(167, 139, 250, 0.14);
}
.nm-book.is-dark .nm-page-right {
  background: linear-gradient(160deg, #201838 0%, #1a1230 55%, #150e26 100%);
  border-color: rgba(167, 139, 250, 0.14);
}

.nm-page-left.page-flip-out {
  animation: pageFlip 0.42s cubic-bezier(0.4, 0, 0.2, 1) both;
  transform-origin: right center;
}
@keyframes pageFlip {
  0% {
    transform: rotateY(0deg);
    filter: none;
  }
  35% {
    transform: rotateY(-28deg);
    filter: brightness(0.9);
    box-shadow: -8px 0 20px rgba(20, 12, 40, 0.18);
  }
  100% {
    transform: rotateY(0deg);
    filter: none;
  }
}

.nm-page-lines {
  position: absolute;
  inset: 0;
  padding: 38px 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  pointer-events: none;
  z-index: 0;
}
.nm-line {
  height: 1px;
  background: rgba(140, 108, 65, 0.1);
}
.nm-book.is-dark .nm-line {
  background: rgba(167, 139, 250, 0.18);
}

/* Left deco */
.nm-deco-quote {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 60px;
  text-align: center;
  gap: 6px;
}
.nm-deco-mark {
  font-family: "IM Fell English", Georgia, serif;
  font-style: italic;
  font-size: 5.5rem;
  line-height: 0.75;
  color: rgba(100, 80, 140, 0.18);
  display: block;
}
.nm-book.is-dark .nm-deco-mark {
  color: rgba(167, 139, 250, 0.55);
}
.nm-deco-quote p {
  font-family: "IM Fell English", Georgia, serif;
  font-style: italic;
  font-size: 0.86rem;
  line-height: 1.7;
  color: rgba(80, 60, 110, 0.42);
  margin: 0;
}
.nm-book.is-dark .nm-deco-quote p {
  color: rgba(167, 139, 250, 0.82);
}

/* Left greeting */
.nm-left-greeting {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
}
.nm-left-quill svg {
  width: 30px;
  height: 30px;
  color: rgba(100, 80, 140, 0.45);
}
.nm-book.is-dark .nm-left-quill svg {
  color: rgba(167, 139, 250, 0.38);
}
.nm-left-label {
  font-family: "Outfit", sans-serif;
  font-size: 0.63rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(100, 80, 140, 0.38);
  margin: 0;
}
.nm-book.is-dark .nm-left-label {
  color: rgba(167, 139, 250, 0.78);
}
.nm-left-name {
  font-family: "Playfair Display", Georgia, serif;
  font-style: italic;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d2460;
  margin: 0;
  word-break: break-word;
}
.nm-book.is-dark .nm-left-name {
  color: #d8cefc;
}
.nm-left-divider {
  width: 36px;
  height: 1.5px;
  background: rgba(100, 80, 140, 0.2);
  border-radius: 2px;
}
.nm-book.is-dark .nm-left-divider {
  background: rgba(167, 139, 250, 0.38);
}
.nm-left-hint {
  font-family: "IM Fell English", Georgia, serif;
  font-style: italic;
  font-size: 0.78rem;
  line-height: 1.65;
  color: rgba(80, 60, 110, 0.36);
  margin: 0;
}
.nm-book.is-dark .nm-left-hint {
  color: rgba(167, 139, 250, 0.7);
}

/* Overflow left */
.nm-overflow-page {
  position: relative;
  z-index: 2;
  height: 100%;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
}
.nm-overflow-label {
  font-family: "IM Fell English", Georgia, serif;
  font-style: italic;
  font-size: 0.7rem;
  color: rgba(100, 80, 140, 0.32);
  margin: 0 0 10px;
  text-align: center;
  flex-shrink: 0;
}
.nm-overflow-page ~ .nm-page-lines .nm-line,
.nm-overflow-page + .nm-page-lines .nm-line {
  opacity: 0.4;
}

/* Hide lines behind overflow text area */
.nm-overflow-text {
  font-family: "Playfair Display", Georgia, serif;
  font-style: italic;
  font-size: 0.78rem;
  line-height: 1.78;
  color: rgba(60, 44, 100, 0.65);
  word-break: break-word;
  flex: 1;
  overflow: hidden;
}
.nm-book.is-dark .nm-overflow-text {
  color: rgba(167, 139, 250, 0.62);
}

.nm-page-number {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "IM Fell English", Georgia, serif;
  font-style: italic;
  font-size: 0.7rem;
  color: rgba(100, 80, 140, 0.28);
  z-index: 2;
}
.nm-book.is-dark .nm-page-number {
  color: rgba(167, 139, 250, 0.6);
}

/* Right content */
.nm-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  padding-bottom: 14px;
}
.nm-content-reflection {
  gap: 2px;
}

.nm-quill-wrap {
  margin-bottom: 8px;
}
.nm-quill {
  width: 24px;
  height: 24px;
  color: rgba(100, 80, 140, 0.5);
}
.nm-book.is-dark .nm-quill {
  color: rgba(167, 139, 250, 0.45);
}

.nm-eyebrow {
  font-family: "Outfit", sans-serif;
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(100, 80, 140, 0.42);
  margin: 0 0 4px;
}
.nm-book.is-dark .nm-eyebrow {
  color: rgba(167, 139, 250, 0.88);
}

.nm-heading {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.42rem;
  font-weight: 700;
  line-height: 1.22;
  color: #2d2460;
  margin: 0 0 4px;
}
.nm-heading-sm {
  font-size: 1.05rem;
  line-height: 1.35;
}
.nm-book.is-dark .nm-heading {
  color: #e8e0f8;
}

.nm-sub {
  font-family: "Outfit", sans-serif;
  font-size: 0.74rem;
  font-weight: 300;
  font-style: italic;
  color: rgba(80, 60, 110, 0.48);
  margin: 0 0 16px;
}
.nm-book.is-dark .nm-sub {
  color: rgba(200, 185, 255, 0.78);
}

/* Name input */
.nm-input-wrap {
  width: 100%;
  position: relative;
  margin-bottom: 18px;
}
.nm-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: "Playfair Display", Georgia, serif;
  font-style: italic;
  font-size: 1.06rem;
  color: #2d2460;
  padding: 4px 0 8px;
  caret-color: #7c6ca8;
}
.nm-book.is-dark .nm-input {
  color: #e8e0f8;
  caret-color: #a78bfa;
}
.nm-input::placeholder {
  color: rgba(100, 80, 140, 0.26);
}
.nm-book.is-dark .nm-input::placeholder {
  color: rgba(167, 139, 250, 0.55);
}
.nm-input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.5px;
  background: rgba(100, 80, 140, 0.2);
  border-radius: 2px;
  transition:
    background 0.3s,
    box-shadow 0.3s;
}
.nm-input:focus ~ .nm-input-underline {
  background: #7c6ca8;
  box-shadow: 0 2px 8px rgba(124, 108, 168, 0.2);
}
.nm-book.is-dark .nm-input:focus ~ .nm-input-underline {
  background: #a78bfa;
  box-shadow: 0 2px 8px rgba(167, 139, 250, 0.25);
}

/* Textarea */
.nm-textarea-wrap {
  width: 100%;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin-bottom: 4px;
}
.nm-textarea {
  width: 100%;
  min-height: 60px;
  max-height: 180px;
  resize: none;
  background: transparent;
  border: none;
  outline: none;
  font-family: "Playfair Display", Georgia, serif;
  font-style: italic;
  font-size: 0.86rem;
  line-height: 1.78;
  color: #2d2460;
  padding: 4px 0 6px;
  caret-color: #7c6ca8;
  scrollbar-width: none;
  overflow: hidden;
  overscroll-behavior: none;
  box-sizing: border-box;
  touch-action: manipulation;
}
.nm-textarea::-webkit-scrollbar {
  display: none;
}
.nm-book.is-dark .nm-textarea {
  color: #e8e0f8;
  caret-color: #a78bfa;
}
.nm-textarea::placeholder {
  color: rgba(100, 80, 140, 0.26);
  font-style: italic;
  font-size: 0.8rem;
}
.nm-book.is-dark .nm-textarea::placeholder {
  color: rgba(167, 139, 250, 0.52);
}
.nm-textarea-line {
  height: 1px;
  background: rgba(100, 80, 140, 0.16);
  border-radius: 2px;
  margin-top: 2px;
}

.nm-char-hint {
  font-family: "Outfit", sans-serif;
  font-size: 0.64rem;
  font-weight: 400;
  color: rgba(100, 80, 140, 0.35);
  margin-bottom: 4px;
  font-style: italic;
  transition: color 0.3s;
  min-height: 1em;
}
.nm-char-hint.overflow {
  color: #7c6ca8;
  font-weight: 600;
  font-style: normal;
}
.nm-book.is-dark .nm-char-hint {
  color: rgba(167, 139, 250, 0.7);
}
.nm-book.is-dark .nm-char-hint.overflow {
  color: #a78bfa;
}

/* Buttons */
.nm-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  flex-shrink: 0;
}
.nm-btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 50px;
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #4a3f7a 0%, #7c6ca8 100%);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 4px 14px rgba(74, 63, 122, 0.28);
}
.nm-btn-primary:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.nm-btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 63, 122, 0.4);
}
.nm-btn-primary:active {
  transform: translateY(0);
}
.nm-book.is-dark .nm-btn-primary {
  background: linear-gradient(135deg, #6c5ce7 0%, #a78bfa 100%);
  box-shadow: 0 4px 14px rgba(108, 92, 231, 0.36);
}
.nm-book.is-dark .nm-btn-primary:not(:disabled):hover {
  box-shadow: 0 6px 20px rgba(108, 92, 231, 0.5);
}

.nm-btn-skip,
.nm-btn-ghost {
  font-family: "Outfit", sans-serif;
  font-size: 0.68rem;
  font-weight: 400;
  color: rgba(100, 80, 140, 0.4);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 2px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.nm-btn-skip:hover,
.nm-btn-ghost:hover {
  color: rgba(100, 80, 140, 0.7);
}
.nm-book.is-dark .nm-btn-skip,
.nm-book.is-dark .nm-btn-ghost {
  color: rgba(167, 139, 250, 0.75);
}
.nm-book.is-dark .nm-btn-skip:hover,
.nm-book.is-dark .nm-btn-ghost:hover {
  color: rgba(167, 139, 250, 1);
}

.nm-flip-shadow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 4px;
  background: transparent;
  transition: background 0.21s ease;
  z-index: 8;
}
.nm-flip-shadow.active {
  background: linear-gradient(
    90deg,
    rgba(20, 12, 40, 0.1) 0%,
    rgba(20, 12, 40, 0.03) 50%,
    transparent 100%
  );
}

.nm-corner-fold {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 22px 22px 0;
  border-color: transparent rgba(100, 80, 140, 0.15) transparent transparent;
  border-radius: 0 4px 0 0;
  z-index: 11;
}
.nm-book.is-dark .nm-corner-fold {
  border-color: transparent rgba(167, 139, 250, 0.17) transparent transparent;
}

/* Transitions */
.page-content-enter-active {
  transition:
    opacity 0.26s ease 0.14s,
    transform 0.26s ease 0.14s;
}
.page-content-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
.page-content-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.page-content-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.modal-fade-enter-active {
  transition: opacity 0.35s ease;
}
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
