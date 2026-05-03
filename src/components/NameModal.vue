<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="nm-overlay" @click.self="maybeSkip">
      <div class="nm-book" :class="{ open: bookOpen, 'is-dark': isDark }">
        <!-- Book spine -->
        <div class="nm-spine"></div>

        <!-- LEFT PAGE -->
        <div
          class="nm-page nm-page-left"
          :class="{ 'page-flip-out': isFlipping }"
        >
          <div class="nm-page-lines">
            <div v-for="i in 14" :key="i" class="nm-line"></div>
          </div>
          <Transition name="page-content" mode="out-in">
            <!-- Page 1 left: decorative quote -->
            <div v-if="currentPage === 1" key="l1" class="nm-deco-quote">
              <span class="nm-deco-mark">"</span>
              <p>
                <span v-for="(line, idx) in t.leftQuote" :key="idx">
                  {{ line }}<br v-if="idx < t.leftQuote.length - 1" />
                </span>
              </p>
            </div>
            <!-- Page 2 left: greeting -->
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
              <p class="nm-left-label">{{ t.reflectingToday }}</p>
              <p class="nm-left-name">{{ resolvedName }}</p>
              <div class="nm-left-divider"></div>
              <p class="nm-left-hint">{{ t.leftHint }}</p>
            </div>
            <!-- Page 3+ left: textarea for this spread's left side -->
            <div
              v-else
              :key="'l' + currentPage"
              class="nm-content nm-content-reflection nm-left-textarea-page"
            >
              <p class="nm-eyebrow">{{ t.pageLabel(leftPageNumber) }}</p>
              <div class="nm-textarea-wrap">
                <textarea
                  :ref="(el) => setLeftRef(el)"
                  v-model="pages[leftPageIndex]"
                  class="nm-textarea"
                  :placeholder="t.continueWriting"
                  @input="onPageInputResize(leftPageIndex, $event)"
                  @keydown="onPageKeydown(leftPageIndex, $event)"
                ></textarea>
              </div>
              <div class="nm-char-hint" :class="{ overflow: leftOverflowing }">
                <span v-if="leftOverflowing">{{ t.overflowHint }}</span>
              </div>
            </div>
          </Transition>
          <div class="nm-page-number">
            {{
              currentPage === 1 ? "i" : currentPage === 2 ? "" : leftPageNumber
            }}
          </div>
        </div>

        <!-- RIGHT PAGE -->
        <div class="nm-page nm-page-right">
          <div class="nm-page-lines">
            <div v-for="i in 14" :key="i" class="nm-line"></div>
          </div>
          <Transition name="page-content" mode="out-in">
            <!-- Page 1 right: name input -->
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
              <p class="nm-eyebrow">{{ t.beforeWeBegin }}</p>
              <h2 class="nm-heading">{{ t.whatShallICallYou }}</h2>
              <p class="nm-sub">{{ t.yourNameStays }}</p>
              <div class="nm-input-wrap">
                <input
                  ref="nameInputRef"
                  v-model="name"
                  type="text"
                  class="nm-input"
                  :placeholder="t.namePlaceholder"
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
                  <span>{{ t.continueBtn }}</span>
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
                  {{ t.skipForNow }}
                </button>
              </div>
            </div>

            <!-- Page 2 right: first reflection textarea -->
            <div
              v-else-if="currentPage === 2"
              key="r2"
              class="nm-content nm-content-reflection"
            >
              <p class="nm-eyebrow">{{ t.page1Label }}</p>
              <h2 class="nm-heading nm-heading-sm">
                {{ resolvedGreeting }},<br />{{ t.whatToReflect }}
              </h2>
              <div class="nm-textarea-wrap">
                <textarea
                  ref="reflectionRef"
                  v-model="pages[0]"
                  class="nm-textarea"
                  :placeholder="t.reflectionPlaceholder"
                  @input="onPageInputResize(0, $event)"
                  @keydown="onPageKeydown(0, $event)"
                ></textarea>
              </div>
              <div class="nm-char-hint">
                <span>{{ t.writeFreely }}</span>
              </div>
              <div class="nm-actions">
                <button
                  class="nm-btn-primary"
                  @click="handleDone"
                  :disabled="pages[0].trim().length === 0"
                >
                  <span>{{ t.letsBegin }}</span>
                </button>
                <button
                  class="nm-btn-done"
                  @click="handleSpreadNext(0)"
                  :disabled="!pageOverflowing[0]"
                >
                  {{ t.nextPage }}
                </button>
                <button class="nm-btn-ghost" @click="goBackToPage1">
                  ← back
                </button>
              </div>
            </div>

            <!-- Page 3+ right: continuation textarea + done button when not overflowing -->
            <div
              v-else
              :key="'r' + currentPage"
              class="nm-content nm-content-reflection"
            >
              <p class="nm-eyebrow">{{ t.pageLabel(rightPageNumber) }}</p>
              <h2 class="nm-heading nm-heading-sm">{{ t.keepGoing }}</h2>
              <div class="nm-textarea-wrap">
                <textarea
                  :ref="(el) => setRightRef(el)"
                  v-model="pages[rightPageIndex]"
                  class="nm-textarea"
                  :placeholder="t.continueWriting"
                  @input="onPageInputResize(rightPageIndex, $event)"
                  @keydown="onPageKeydown(rightPageIndex, $event)"
                ></textarea>
              </div>
              <div class="nm-char-hint" :class="{ overflow: rightOverflowing }">
                <span v-if="rightOverflowing">{{ t.overflowHint }}</span>
              </div>
              <div class="nm-actions">
                <button
                  class="nm-btn-primary"
                  @click="handleDone"
                  :disabled="allPagesEmpty"
                >
                  <span>{{ t.doneBegin }}</span>
                </button>
                <button
                  class="nm-btn-done"
                  @click="handleSpreadNext(rightPageIndex)"
                  :disabled="
                    !rightOverflowing &&
                    pages[rightPageIndex]?.trim().length === 0
                  "
                >
                  {{ t.nextPage }}
                </button>
                <button class="nm-btn-ghost" @click="goBackSpread">
                  ← back
                </button>
              </div>
            </div>
          </Transition>
          <div class="nm-page-number">
            {{
              currentPage === 1
                ? "1"
                : currentPage === 2
                  ? "1"
                  : rightPageNumber
            }}
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

const props = defineProps({
  isDark: Boolean,
  lang: { type: String, default: "en" },
});

const i18n = {
  en: {
    leftQuote: ["Every journey", "begins with a", "first word."],
    reflectingToday: "Reflecting today",
    takeYourTime: "Take your time. There's no rush here.",
    continued: "...continued",
    beforeWeBegin: "Before we begin",
    whatShallICallYou: "What shall I call you?",
    yourNameStays: "Your name stays just between us.",
    namePlaceholder: "Your name...",
    continueBtn: "Continue",
    skipForNow: "skip for now",
    page1Label: "Page 1 · Reflection",
    whatToReflect: "what's one thing you'd like to reflect on today?",
    reflectionPlaceholder:
      "e.g. Today's presentation in class felt less than ideal...",
    writeFreely: "Write freely — it can be long or short.",
    overflowHint: "✦ Your reflection continues on the next page →",
    nextPage: "Next page →",
    letsBegin: "Let's begin",
    back: "← back",
    page2Label: "Page 2 · Continued",
    keepGoing: "Keep going...",
    continueWriting: "Continue writing here...",
    doneBegin: "Done & begin",
    hiThere: "Hey",
    leftHint: "Take your time. There's no rush here.",
    pageLabel: (n) => `Page ${n} · Continued`,
  },
  id: {
    leftQuote: ["Setiap perjalanan", "dimulai dengan", "satu kata."],
    reflectingToday: "Merenung hari ini",
    takeYourTime: "Santai saja. Tidak ada yang terburu-buru.",
    continued: "...lanjutan",
    beforeWeBegin: "Sebelum kita mulai",
    whatShallICallYou: "Boleh aku tahu nama kamu?",
    yourNameStays: "Namamu hanya untuk kita berdua.",
    namePlaceholder: "Nama kamu...",
    continueBtn: "Lanjut",
    skipForNow: "lewati untuk sekarang",
    page1Label: "Halaman 1 · Refleksi",
    whatToReflect: "apa satu hal yang ingin kamu renungkan hari ini?",
    reflectionPlaceholder: "mis. Presentasi hari ini terasa kurang ideal...",
    writeFreely: "Tulis bebas — bisa panjang atau pendek.",
    overflowHint: "✦ Refleksimu berlanjut di halaman berikut →",
    nextPage: "Halaman berikut →",
    letsBegin: "Yuk mulai",
    back: "← kembali",
    page2Label: "Halaman 2 · Lanjutan",
    keepGoing: "Lanjutkan...",
    continueWriting: "Lanjut menulis di sini...",
    doneBegin: "Selesai & mulai",
    hiThere: "Hei",
    leftHint: "Santai saja. Tidak ada yang terburu-buru.",
    pageLabel: (n) => `Halaman ${n} · Lanjutan`,
  },
};

const t = computed(() => i18n[props.lang] ?? i18n.en);
const emit = defineEmits(["done"]);

const visible = ref(false);
const bookOpen = ref(false);
const isFlipping = ref(false);
const currentPage = ref(1);

const name = ref("");

const pages = ref([""]);
const pageOverflowing = ref([false]);

const nameInputRef = ref(null);
const reflectionRef = ref(null);
const activeLeftRef = ref(null);
const activeRightRef = ref(null);

const MAX_TEXTAREA_H = 180;

function getMaxTextareaH(el) {
  try {
    const content = el.closest(".nm-content");
    const page = el.closest(".nm-page");
    if (!content || !page) return MAX_TEXTAREA_H;
    const pageH = page.clientHeight;
    const pagePadT = parseInt(getComputedStyle(page).paddingTop) || 0;
    const pagePadB = parseInt(getComputedStyle(page).paddingBottom) || 0;
    const available = pageH - pagePadT - pagePadB;
    const wrap = el.closest(".nm-textarea-wrap");
    let siblingsH = 0;
    for (const child of content.children) {
      if (child === wrap) continue;
      siblingsH +=
        child.offsetHeight +
        parseInt(getComputedStyle(child).marginTop || 0) +
        parseInt(getComputedStyle(child).marginBottom || 0);
    }
    const gap = parseInt(getComputedStyle(content).gap) || 2;
    const siblingCount = content.children.length - 1;
    siblingsH += gap * siblingCount;
    const maxH = Math.max(60, available - siblingsH - 8);
    return maxH;
  } catch {
    return MAX_TEXTAREA_H;
  }
}
const ALLOWED_KEYS = [
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

const leftPageIndex = computed(() => (currentPage.value - 3) * 2 + 1);
const rightPageIndex = computed(() => (currentPage.value - 3) * 2 + 2);
const leftPageNumber = computed(() => (currentPage.value - 3) * 2 + 2);
const rightPageNumber = computed(() => (currentPage.value - 3) * 2 + 3);

const leftOverflowing = computed(
  () => pageOverflowing.value[leftPageIndex.value] ?? false,
);
const rightOverflowing = computed(
  () => pageOverflowing.value[rightPageIndex.value] ?? false,
);

const allPagesEmpty = computed(() => pages.value.every((p) => !p.trim()));

const resolvedName = computed(() => name.value.trim() || t.value.hiThere);
const resolvedGreeting = computed(() =>
  name.value.trim() ? name.value.trim() : t.value.hiThere,
);

function setLeftRef(el) {
  activeLeftRef.value = el;
}
function setRightRef(el) {
  activeRightRef.value = el;
}

function resizeTextarea(el, idx, forcedValue) {
  if (!el) return;
  if (forcedValue !== undefined && el.value !== forcedValue) {
    el.value = forcedValue;
  }
  el.style.height = "auto";
  void el.offsetHeight;
  const natural = el.scrollHeight;
  const maxH = getMaxTextareaH(el);
  const overflows = natural > maxH;

  if (idx === 0 && overflows) {
    const trimmed = pages.value[0].slice(0, -1);
    pages.value[0] = trimmed;
    el.value = trimmed;
    el.style.height = maxH + "px";
    el.scrollTop = 0;
    const newOverflowing = [...pageOverflowing.value];
    newOverflowing[0] = true;
    pageOverflowing.value = newOverflowing;
    handleSpreadNext(0);
    return;
  }

  el.style.height = Math.min(natural, maxH) + "px";
  const newOverflowing = [...pageOverflowing.value];
  newOverflowing[idx] = overflows;
  pageOverflowing.value = newOverflowing;
  el.scrollTop = 0;
}

function onPageInput(idx, e) {
  pages.value[idx] = e.target.value;
  resizeTextarea(e.target, idx);
}

function onPageInputResize(idx, e) {
  resizeTextarea(e.target, idx);
}

function onPageKeydown(idx, e) {
  if (!pageOverflowing.value[idx]) return;
  if (e.ctrlKey || e.metaKey) return;
  if (!ALLOWED_KEYS.includes(e.key)) e.preventDefault();
}

function open() {
  if (visible.value) return; // sudah terbuka, jangan reset
  visible.value = true;
  currentPage.value = 1;
  pages.value = [""];
  pageOverflowing.value = [false];
  setTimeout(() => {
    bookOpen.value = true;
    setTimeout(() => nameInputRef.value?.focus(), 700);
  }, 80);
}

// Buka kembali tanpa reset nama & refleksi (dipakai saat back dari moodcheck)
function reopen() {
  if (visible.value) return;
  visible.value = true;
  // Jangan reset name dan pages — pertahankan data yang sudah diisi
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
  flipPage(2, () => restoreTextarea(() => reflectionRef.value, 0, 80));
}

function goBackToPage1() {
  flipPage(1, () => nextTick(() => nameInputRef.value?.focus()));
}

function handleSpreadNext(idx) {
  while (pages.value.length <= idx + 2) {
    pages.value.push("");
    pageOverflowing.value.push(false);
  }

  const nextSpread = idx === 0 ? 3 : currentPage.value + 1;

  flipPage(nextSpread, () => {
    const leftIdx = (nextSpread - 3) * 2 + 1;
    const rightIdx = (nextSpread - 3) * 2 + 2;
    restoreTextarea(() => activeLeftRef.value, leftIdx, 80, true);
    restoreTextarea(() => activeRightRef.value, rightIdx, 80, false);
  });
}

function restoreTextarea(getEl, idx, delay = 0, shouldFocus = true) {
  const delays = [delay, delay + 100, delay + 250, delay + 450];
  let done = false;
  delays.forEach((d) => {
    setTimeout(() => {
      if (done) return;
      nextTick(() => {
        const el = getEl();
        if (!el) return;
        done = true;

        if (el.value !== (pages.value[idx] ?? "")) {
          el.value = pages.value[idx] ?? "";
        }
        void el.offsetHeight;
        el.style.height = "auto";
        void el.offsetHeight;
        const natural = el.scrollHeight;
        const maxH = getMaxTextareaH(el);
        el.style.height = Math.min(natural, maxH) + "px";
        const overflows = natural > maxH;
        const newOverflowing = [...pageOverflowing.value];

        newOverflowing[idx] =
          overflows || (idx === 0 && pageOverflowing.value[0] === true);
        pageOverflowing.value = newOverflowing;
        el.scrollTop = 0;
        if (shouldFocus) el.focus();
      });
    }, d);
  });
}

function goBackSpread() {
  const prevPage = currentPage.value - 1;

  if (prevPage === 2) {
    flipPage(2, () => restoreTextarea(() => reflectionRef.value, 0, 80));
  } else {
    const targetLeftIdx = (prevPage - 3) * 2 + 1;
    const targetRightIdx = (prevPage - 3) * 2 + 2;
    flipPage(prevPage, () => {
      restoreTextarea(() => activeLeftRef.value, targetLeftIdx, 80, false);
      restoreTextarea(() => activeRightRef.value, targetRightIdx, 80, true);
    });
  }
}

function handleDone() {
  const full = pages.value.join(" ").replace(/\s+/g, " ").trim();
  emit("done", name.value.trim(), full);
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
    pages.value = [""];
    pageOverflowing.value = [false];
  }, 500);
}

defineExpose({ open, reopen });
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
  padding-top: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.nm-overflow-label {
  font-family: "IM Fell English", Georgia, serif;
  font-style: italic;
  font-size: 0.7rem;
  color: rgba(100, 80, 140, 0.32);
  margin: 0 0 0;
  padding-bottom: 10px;
  text-align: center;
  flex-shrink: 0;
  line-height: 23px;
}
.nm-overflow-page ~ .nm-page-lines .nm-line,
.nm-overflow-page + .nm-page-lines .nm-line {
  opacity: 0.4;
}

.nm-overflow-text {
  font-family: "Playfair Display", Georgia, serif;
  font-style: italic;
  font-size: 0.78rem;
  line-height: 23px;
  color: rgba(60, 44, 100, 0.88);
  word-break: break-word;
  flex: 1;
  overflow: hidden;
  position: relative;
  padding-top: 2px;
  mask-image: linear-gradient(to bottom, black 55%, transparent 92%);
  -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 92%);
}
.nm-book.is-dark .nm-overflow-text {
  color: rgba(200, 180, 255, 0.92);
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
  max-height: none;
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

/* Overflow page textarea — no max-height cap, scrollable */
.nm-textarea.nm-textarea-overflow {
  max-height: none;
  overflow-y: auto;
  flex: 1;
}

/* Page 1 textarea when content exceeds available height — scroll in place */
.nm-textarea.nm-textarea-scrollable {
  overflow-y: auto;
}

/* Left page when it's a textarea page (page 3+) */
.nm-left-textarea-page {
  padding-top: 0;
}
.nm-left-textarea-page .nm-eyebrow {
  margin-bottom: 8px;
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
  min-width: 120px;
  justify-content: center;
  white-space: nowrap;
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

.nm-btn-done {
  font-family: "Outfit", sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(100, 80, 140, 0.55);
  background: none;
  border: 1px solid rgba(100, 80, 140, 0.25);
  border-radius: 50px;
  cursor: pointer;
  padding: 6px 14px;
  transition: all 0.2s;
}
.nm-btn-done:not(:disabled):hover {
  background: rgba(100, 80, 140, 0.08);
  color: rgba(100, 80, 140, 0.8);
}
.nm-btn-done:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.nm-book.is-dark .nm-btn-done {
  color: rgba(167, 139, 250, 0.7);
  border-color: rgba(167, 139, 250, 0.28);
}
.nm-book.is-dark .nm-btn-done:not(:disabled):hover {
  background: rgba(167, 139, 250, 0.1);
  color: rgba(167, 139, 250, 1);
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

/* ══ MOBILE: tampilan HP rapi ══ */
@media (max-width: 600px) {
  .nm-overlay {
    padding: 16px;
    align-items: center;
  }

  .nm-book {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 0;
    flex-direction: column;
    transform: scale(0.95) translateY(10px);
  }
  .nm-book.open {
    transform: scale(1) translateY(0);
  }

  /* Sembunyikan halaman kiri di mobile */
  .nm-page-left {
    display: none;
  }

  /* Spine jadi horizontal separator tipis */
  .nm-spine {
    display: none;
  }

  /* Halaman kanan jadi full card */
  .nm-page-right {
    border-radius: 12px;
    border: 1px solid rgba(140, 108, 65, 0.22);
    padding: 28px 22px 22px;
    height: auto;
    min-height: 380px;
    display: flex;
    flex-direction: column;
  }
  .nm-book.is-dark .nm-page-right {
    border-color: rgba(167, 139, 250, 0.14);
  }

  /* Corner fold di kanan atas */
  .nm-corner-fold {
    border-radius: 0 12px 0 0;
  }

  /* Content flex column supaya tombol bisa push ke bawah */
  .nm-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: auto;
    padding-bottom: 10px;
  }

  /* Spacer sebelum tombol */
  .nm-actions {
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
    padding-top: 16px;
  }

  .nm-btn-primary {
    min-width: 0;
    flex: 1;
  }

  /* Input margin lebih rapat */
  .nm-input-wrap {
    margin-bottom: 14px;
  }

  .nm-sub {
    margin-bottom: 10px;
  }
}
</style>