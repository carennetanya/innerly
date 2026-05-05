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
        <span class="kb-brand-name kb-brand-name--desktop">Innerly</span>
      </div>

      <!-- Right: Streak + Lang & Dark Mode (desktop only for dark mode) -->
      <div class="kb-header-right">
        <!-- Dark mode: desktop only -->
        <button class="kb-profile-icon-btn kb-header-desktop-btn" @click="$emit('toggle-theme')" :title="isDark ? 'Light mode' : 'Dark mode'">
          <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <button class="kb-profile-lang-btn kb-header-desktop-btn" @click="$emit('toggle-lang')">
          {{ lang === 'id' ? 'Indonesia' : 'English' }}
        </button>
        <div class="kb-streak-container">
          <div class="kb-streak-main">
            <img :src="headerStreakImg" alt="streak plant" class="kb-streak-plant-img" />
            <span class="kb-streak-num">{{ streakDays }}</span>
          </div>
          <div class="kb-progress-box">
            <div class="kb-progress-track">
              <div class="kb-progress-fill" :style="{ width: streakProgress + '%' }"></div>
            </div>
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
            <div class="kb-profile-email">@{{ userUsername || props.userName || 'user' }}</div>
          </div>
          <!-- Lang & dark mode toggle (mobile only, desktop shows in header) -->
          <div class="kb-profile-header-actions kb-profile-actions-mobile">
            <button class="kb-profile-icon-btn" @click="$emit('toggle-theme')" :title="isDark ? 'Light mode' : 'Dark mode'">
              <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
            <button class="kb-profile-lang-btn" @click="$emit('toggle-lang')">
              {{ lang === 'id' ? 'ID' : 'EN' }}
            </button>
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
        <button class="kb-profile-logout-btn" @click="onLogout">🚪 Log Out</button>
      </div>
    </Transition>

    <!-- Month navigation bar -->
    <div class="kb-month-bar">
      <button class="kb-nav-btn" @click="prevMonth">&#8249;</button>
      <span class="kb-month-title">{{ monthLabel }}</span>
      <button class="kb-nav-btn" @click="nextMonth">&#8250;</button>
    </div>

    <!-- Calendar grid (desktop) -->
    <div class="kb-calendar kb-calendar-desktop">
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
        <div class="kb-flowers kb-flowers-large" v-if="getDayReflections(day).length > 0">
          <!-- Tanah sebagai background, ukuran besar -->
          <img src="/dirt.png" alt="dirt" class="kb-dirt-img kb-dirt-img-large" />
          <transition-group name="fade-flower" tag="div" class="kb-flower-group">
            <template v-for="(flower, idx) in getDayFlowers(day).slice(0, 3)" :key="'flower-' + idx">
              <div
                class="kb-flower-wrap kb-flower-on-dirt"
                @click.stop="openPopup(day, flower.refIdx)"
                :title="flower.label"
              >
                <img
                  v-if="flower.img"
                  :src="flower.img"
                  :alt="flower.label"
                  class="kb-mood-img kb-mood-img-large fade-flower-item"
                />
                <span v-else class="kb-flower-emoji fade-flower-item">{{ flower.emoji }}</span>
              </div>
            </template>
            <span v-if="getDayFlowers(day).length > 3" class="kb-flower-more">+{{ getDayFlowers(day).length - 3 }}</span>
          </transition-group>
        </div>

        <!-- Empty plot (today, no reflection yet) -->
          <div class="kb-plot" v-else-if="!isFuture(day)">
            <img src="/dirt.png" alt="dirt" class="kb-dirt-img kb-dirt-img-large" />
          </div>
      </div>
    </div>

    <!-- List view (mobile only) -->
    <div class="kb-list-view">
      <!-- Month nav -->
      <div class="kb-list-empty" v-if="listDays.length === 0">
        <span>🌱 {{ lang === 'id' ? 'Belum ada refleksi bulan ini.' : 'No reflections this month yet.' }}</span>
      </div>
      <div
        v-for="day in listDays"
        :key="day"
        class="kb-list-card"
        :class="{ 'kb-list-card-today': isToday(day) }"
        @click="onCellClick(day)"
      >
        <!-- Date badge -->
        <div class="kb-list-date">
          <span class="kb-list-day-num">{{ day }}</span>
          <span class="kb-list-day-name">{{ getDayName(day) }}</span>
        </div>
        <!-- Flowers -->
        <div class="kb-list-flowers">
          <div class="kb-list-dirt">
            <img src="/dirt.png" alt="dirt" class="kb-list-dirt-img" />
            <div class="kb-list-flower-row">
              <img
                v-for="(flower, idx) in getDayFlowers(day).slice(0, 3)"
                :key="idx"
                :src="flower.img"
                :alt="flower.label"
                class="kb-list-flower-img"
              />
              <span v-if="getDayFlowers(day).length > 3" class="kb-list-flower-more">+{{ getDayFlowers(day).length - 3 }}</span>
            </div>
          </div>
        </div>
        <!-- Mood labels -->
        <div class="kb-list-moods">
          <span
            v-for="(flower, idx) in getDayFlowers(day).slice(0, 2)"
            :key="idx"
            class="kb-list-mood-tag"
          >{{ lang === 'id' ? getMoodLabelId(flower.label) : flower.label }}</span>
          <span v-if="getDayFlowers(day).length > 2" class="kb-list-mood-more">+{{ getDayFlowers(day).length - 2 }}</span>
        </div>
        <!-- Time -->
        <div class="kb-list-time" v-if="formatCreatedAt(getDayReflections(day)[0]?.created_at)">
          🕐 {{ formatCreatedAt(getDayReflections(day)[0]?.created_at) }}
        </div>
        <span class="kb-list-arrow">›</span>
      </div>
    </div>

    <!-- FAB add button -->
    <div class="kb-fab-wrap">
      <button class="kb-fab" :class="{ 'kb-fab-no-ref': !props.hasReflectionToday, 'kb-fab-done': props.hasReflectionToday && !hasWateredLocally, 'kb-fab-watered': hasWateredLocally }" @click="toggleGrowthPanel" :title="lang === 'id' ? 'Tambah Refleksi' : 'Add Reflection'">
        <img alt="scope" src="/scope.png" class="kb-fab-scope" />
        <span class="kb-fab-plus">+</span>
      </button>
      <Transition name="collection-bubble-pop">
        <div v-if="showCollectionBubble && collectedFlowers.length > 0" class="kb-fab-chat-bubble kb-collection-bubble" key="collection" @click.stop="openCollectionPopup">
          <span class="kb-fab-chat-text">🌸 {{ lang === 'id' ? 'Koleksi bungamu!' : 'Your flower collection!' }}</span>
        </div>
        <div v-else-if="!props.justRegistered && (!props.hasReflectionToday || (props.hasReflectionToday && !hasWateredLocally))" class="kb-fab-chat-bubble" key="hint">
          <span class="kb-fab-chat-text">
            {{ lang === 'id'
              ? (!props.hasReflectionToday ? 'Kamu belum isi refleksi hari ini loh!' : 'Jangan lupa siram tanamanmu hari ini!')
              : (!props.hasReflectionToday ? 'You haven\'t filled reflection today yet!' : 'Don\'t forget to water your plant today!')
            }}
          </span>
        </div>
      </Transition>
      <span class="kb-fab-label">{{ lang === 'id' ? 'Tambah Refleksi' : 'Add Reflection' }}</span>
    </div>

    <!-- Flower Collection Button (floating, bottom left) -->
    <button class="kb-collection-fab" @click="openCollectionPopup" :title="lang === 'id' ? 'Koleksi Bunga' : 'Flower Collection'">
      <img :src="collectedFlowers.length > 0 ? collectedFlowers[collectedFlowers.length - 1].img : flowerOptions[0].img" class="kb-collection-fab-img" alt="flower" />
      <span class="kb-collection-fab-count">{{ collectedFlowers.length }}</span>
    </button>

    <!-- Growth Garden Panel -->
    <Transition name="growth-panel">
      <div class="kb-growth-overlay" v-if="growthPanelOpen" @click.self="growthPanelOpen = false">
        <div class="kb-growth-panel">
          <div class="kb-growth-header">
            <div class="kb-growth-title-row">
              <div class="kb-growth-brand">
                <img src="/logo.png" alt="Innerly" class="kb-growth-logo" />
                <span class="kb-growth-brand-name">Innerly</span>
              </div>
              <button class="kb-growth-close" @click="growthPanelOpen = false">✕</button>
            </div>
            <div class="kb-growth-subtitle-row">
              <span class="kb-growth-subtitle">{{ lang === 'id' ? 'Dashboard Kebunmu' : 'Your Garden Dashboard' }}</span>
              <div class="kb-growth-streak-badge">
                <img src="/pot.png" alt="pot" class="kb-streak-pot" />
                <div class="kb-streak-badge-text">
                  <span class="kb-streak-badge-label">Streak</span>
                  <span class="kb-streak-badge-day">Day {{ streakDays }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Banner: no reflection today (show above everything) -->
          <Transition name="hint-fade">
            <div v-if="!props.hasReflectionToday && !props.justRegistered && !hasWateredLocally" class="kb-no-ref-banner">
              <span class="kb-no-ref-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </span>
              <div class="kb-no-ref-text">
                <strong>{{ lang === 'id' ? 'Belum ada refleksi hari ini' : 'No reflection yet today' }}</strong>
                <span>{{ lang === 'id' ? 'Buat refleksi dulu sebelum menyiram tanamanmu.' : 'Create a reflection before watering your plant.' }}</span>
              </div>
              <button class="kb-no-ref-btn" @click="onPlantReflection">
                {{ lang === 'id' ? 'Buat Refleksi →' : 'Make Reflection →' }}
              </button>
            </div>
          </Transition>

          <div class="kb-growth-date-row">
            <div class="kb-growth-date">
              <span class="kb-growth-month">{{ currentMonthShort }}</span>
              <span class="kb-growth-daynum">{{ currentDay }}</span>
            </div>
            <div class="kb-watercan-wrap">
              <span class="kb-watercan-hint kb-watercan-no-ref" v-if="!hasWateredLocally && !props.hasReflectionToday && !props.justRegistered">
                📝 {{ lang === 'id' ? 'Buat refleksi dulu!' : 'Make a reflection first!' }}
              </span>
              <span class="kb-watercan-hint" v-else-if="!hasWateredLocally">Water your plant 💧</span>
              <span class="kb-watercan-hint kb-watercan-done" v-else>✅ {{ lang === 'id' ? 'Sudah disiram hari ini!' : 'Watered today!' }}</span>
              <img
                v-if="!hasWateredLocally"
                class="kb-growth-watercan"
                :class="{ 'is-watering': isWatering, 'watercan-disabled': !props.hasReflectionToday && !props.justRegistered }"
                src="/water-can.png"
                alt="water can"
                @mousedown.prevent="onWatercanMouseDown"
                @touchstart.prevent="onWatercanTouchStart"
                @touchmove.prevent="onWatercanTouchMove"
                @touchend.prevent="onWatercanTouchEnd"
                ref="watercanRef"
              />
            </div>
          </div>

          <div
            class="kb-growth-plant-area"
            :class="{ 'drop-active': isDragOver, 'is-watered': justWatered }"

            ref="plantAreaRef"
          >
            <!-- Water drops animation -->
            <div v-if="isWatering" class="kb-water-drops">
              <span v-for="i in 8" :key="i" class="kb-drop" :style="getDropStyle(i)">💧</span>
            </div>
            <div class="kb-growth-notes">
              <span class="kb-note kb-note-1">♪</span>
              <span class="kb-note kb-note-2">♫</span>
              <span class="kb-note kb-note-3">✦</span>
            </div>
            <div class="kb-growth-plant-stage" v-if="!isLoadingWateredState">
              <img v-if="plantStage === 'dirt'" src="/dirt.png" alt="dirt" class="kb-plant-img kb-plant-dirt" />
              <img v-else-if="plantStage === 'seed'" src="/seeds.png" alt="seed" class="kb-plant-img kb-plant-seed" />
              <img v-else-if="plantStage === 'sprout'" src="/leaf.png" alt="sprout" class="kb-plant-img kb-plant-sprout" />
              <img v-else-if="plantStage === 'flower' && chosenFlower" :src="chosenFlower" alt="flower" class="kb-plant-img kb-plant-flower" />
              <img v-else src="/pot.png" alt="flower" class="kb-plant-img kb-plant-flower" />
            </div>

            <!-- Hint per stage -->
            <Transition name="hint-fade">
              <div v-if="!hasWateredLocally && plantStage === 'dirt'" class="kb-soil-hint">
                💧 {{ lang === 'id' ? 'Seret ember siram ke tanah untuk menanam benih!' : 'Drag the watering can to plant your first seed!' }}
              </div>
            </Transition>
            <Transition name="hint-fade">
              <div v-if="!hasWateredLocally && plantStage === 'seed'" class="kb-soil-hint">
                💧 {{ lang === 'id' ? 'Sirami benihmu hari ini agar tumbuh!' : 'Water your seed today to help it grow!' }}
              </div>
            </Transition>
            <Transition name="hint-fade">
              <div v-if="!hasWateredLocally && plantStage === 'sprout'" class="kb-soil-hint">
                💧 {{ lang === 'id' ? 'Sirami tunasmu — sebentar lagi mekar!' : 'Water your sprout — almost blooming!' }}
              </div>
            </Transition>
            <Transition name="hint-fade">
              <div v-if="hasWateredLocally && plantStage === 'seed'" class="kb-soil-hint kb-soil-hint--seeded">
                🌱 {{ lang === 'id' ? 'Benih ditanam! Besok tunasmu mulai tumbuh.' : 'Seed planted! Come back tomorrow for your sprout.' }}
              </div>
            </Transition>
            <Transition name="hint-fade">
              <div v-if="hasWateredLocally && plantStage === 'sprout'" class="kb-soil-hint kb-soil-hint--seeded">
                🌿 {{ lang === 'id' ? 'Tunasmu disiram! Besok bungamu akan mekar.' : 'Sprout watered! Tomorrow your flower blooms.' }}
              </div>
            </Transition>
            <Transition name="hint-fade">
              <div v-if="hasWateredLocally && plantStage === 'flower'" class="kb-soil-hint kb-soil-hint--seeded">
                🌸 {{ lang === 'id' ? 'Bungamu sedang mekar! Terus jaga streakmu.' : 'Your flower is blooming! Keep your streak going.' }}
              </div>
            </Transition>
          </div>

          <!-- Toast: come back tomorrow -->
          <Transition name="toast-up">
            <div v-if="showToast" class="kb-tomorrow-toast">
              🌿 {{ lang === 'id' ? 'Datang lagi besok untuk menyiram tanamanmu!' : 'Come back tomorrow to water your plant!' }}
            </div>
          </Transition>

          <!-- Toast: reflection required -->
          <Transition name="toast-up">
            <div v-if="showReflectionToast" class="kb-reflection-toast">
              📝 {{ lang === 'id' ? 'Silakan buat refleksi untuk hari ini dulu, baru bisa menyiram!' : 'Please make a reflection for today first, then you can water!' }}
            </div>
          </Transition>

          <div class="kb-growth-progress-section">
            <div class="kb-growth-streak-row">
              <img :src="headerStreakImg" alt="streak plant" class="kb-growth-plant-icon" />
              <span class="kb-growth-streak-label">Streak: Day {{ streakDays }}</span>
            </div>
            <div class="kb-growth-progress-label">
              {{ lang === 'id' ? 'Menuju Tunas:' : 'Towards Sprout:' }}
              <strong>{{ streakInCycle }} / 3 {{ lang === 'id' ? 'hari' : 'days' }}</strong>
            </div>
            <div class="kb-growth-progress-track">
              <div class="kb-growth-progress-fill" :style="{ width: cycleProgress + '%' }"></div>
            </div>
            <p class="kb-growth-tip">{{ growthTip }}</p>
          </div>

          <div class="kb-growth-actions">
            <button class="kb-growth-plant-btn" @click="onPlantReflection">
              <span>{{ lang === 'id' ? 'Tanam Refleksi Baru (+)' : 'Plant New Reflection (+)' }}</span>
              <span class="kb-shovel"></span>
            </button>
            <p class="kb-growth-hint">
              {{ lang === 'id'
                ? 'Satu refleksi lagi besok untuk menjaga kesehatan kebunmu.'
                : 'One more reflection tomorrow to keep your garden healthy.'
              }}
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Popup -->
    <Transition name="kb-popup">
      <div class="kb-popup-overlay" v-if="popup.show" @click.self="closePopup">
        <div class="kb-popup">
          <div class="kb-popup-header">
            <div class="kb-popup-title-wrap">
              <span class="kb-popup-date-badge">{{ formatPopupDate(popup.reflection?.date) }}</span>
              <span v-if="formatCreatedAt(popup.reflection?.created_at)" class="kb-popup-time-badge">
                🕐 {{ formatCreatedAt(popup.reflection?.created_at) }}
              </span>
              <span class="kb-popup-title">
                {{ popup.reflection?.trigger?.slice(0, 36) }}{{ (popup.reflection?.trigger?.length ?? 0) > 36 ? '…' : '' }}
              </span>
            </div>
            <button class="kb-popup-close" @click="closePopup">✕</button>
          </div>
          <!-- View mode -->
          <div class="kb-popup-body" v-if="popup.reflection && !editMode">
            <div class="kb-popup-title-entry" v-if="popup.reflection.title">
              {{ popup.reflection.title }}
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.moods?.length || popup.reflection.mood">
              <span class="kb-popup-label">{{ lang === 'id' ? '💜 Perasaan' : '💜 Feeling' }}:</span>
              <div class="kb-popup-moods-row">
                <template v-if="popup.reflection.moods && popup.reflection.moods.length > 0">
                  <div v-for="(mLabel, mi) in popup.reflection.moods" :key="mi" class="kb-popup-mood-item">
                    <img v-if="getMoodImage(mLabel)" :src="getMoodImage(mLabel)" :alt="mLabel" class="kb-popup-mood-img-lg" />
                    <span class="kb-popup-mood-name">{{ mLabel }}</span>
                  </div>
                </template>
                <div v-else class="kb-popup-mood-item">
                  <img v-if="getMoodImage(popup.reflection.mood)" :src="getMoodImage(popup.reflection.mood)" :alt="popup.reflection.mood" class="kb-popup-mood-img-lg" />
                  <span class="kb-popup-mood-name">{{ popup.reflection.mood }}</span>
                </div>
              </div>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.feeling">
              <span class="kb-popup-label">{{ lang === 'id' ? 'Deskripsi perasaan' : 'Feeling detail' }}:</span>
              <span>{{ popup.reflection.feeling }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.description || popup.reflection.trigger">
              <span class="kb-popup-label">{{ lang === 'id' ? '📖 Deskripsi' : '📖 Description' }}:</span>
              <span>{{ popup.reflection.description || popup.reflection.trigger }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.wentWell">
              <span class="kb-popup-label">{{ lang === 'id' ? '✅ Kontribusi positif' : '✅ Positive contribution' }}:</span>
              <span>{{ popup.reflection.wentWell }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.improve">
              <span class="kb-popup-label">{{ lang === 'id' ? '🔧 Kontribusi negatif' : '🔧 Negative contribution' }}:</span>
              <span>{{ popup.reflection.improve }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.analysis || popup.reflection.insight">
              <span class="kb-popup-label">{{ lang === 'id' ? '🔍 Analisis' : '🔍 Analysis' }}:</span>
              <span>{{ popup.reflection.analysis || popup.reflection.insight }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.conclusion">
              <span class="kb-popup-label">{{ lang === 'id' ? '💡 Kesimpulan' : '💡 Conclusion' }}:</span>
              <span>{{ popup.reflection.conclusion }}</span>
            </div>
            <div class="kb-popup-row" v-if="popup.reflection.action">
              <span class="kb-popup-label">{{ lang === 'id' ? '🎯 Rencana Tindakan' : '🎯 Action Plan' }}:</span>
              <span>{{ popup.reflection.action }}</span>
            </div>
          </div>

          <!-- Edit mode -->
          <div class="kb-popup-edit-form" v-if="popup.reflection && editMode">
            <div class="kb-edit-save-status" v-if="editAutoSaving">
              {{ lang === 'id' ? '💾 Menyimpan...' : '💾 Saving...' }}
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? 'Judul' : 'Title' }}</label>
              <input v-model="editDraft.title" class="kb-edit-input" type="text" />
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? '📖 Deskripsi' : '📖 Description' }}</label>
              <textarea v-model="editDraft.description" class="kb-edit-textarea" rows="3"></textarea>
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? '💜 Deskripsi perasaan' : '💜 Feeling detail' }}</label>
              <textarea v-model="editDraft.feeling" class="kb-edit-textarea" rows="2"></textarea>
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? '✅ Kontribusi positif' : '✅ Positive contribution' }}</label>
              <textarea v-model="editDraft.wentWell" class="kb-edit-textarea" rows="2"></textarea>
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? '🔧 Kontribusi negatif' : '🔧 Negative contribution' }}</label>
              <textarea v-model="editDraft.improve" class="kb-edit-textarea" rows="2"></textarea>
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? '🔍 Analisis' : '🔍 Analysis' }}</label>
              <textarea v-model="editDraft.analysis" class="kb-edit-textarea" rows="2"></textarea>
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? '💡 Kesimpulan' : '💡 Conclusion' }}</label>
              <textarea v-model="editDraft.conclusion" class="kb-edit-textarea" rows="2"></textarea>
            </div>
            <div class="kb-edit-field">
              <label>{{ lang === 'id' ? '🎯 Rencana Tindakan' : '🎯 Action Plan' }}</label>
              <textarea v-model="editDraft.action" class="kb-edit-textarea" rows="2"></textarea>
            </div>
          </div>

          <!-- Bottom actions -->
          <button v-if="!editMode" class="kb-popup-edit-btn" @click="enterEditMode">
            {{ lang === 'id' ? 'Edit / Lihat Lebih' : 'Edit / See More' }}
          </button>
          <button v-else class="kb-edit-cancel-btn" @click="cancelEdit">
            {{ lang === 'id' ? '← Selesai edit' : '← Done editing' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Flower Picker Popup (muncul saat Day 3 siram pertama kali) -->
    <Transition name="kb-popup">
      <div class="kb-popup-overlay" v-if="showFlowerPicker" @click.self="onFlowerPickerClose">
        <div class="kb-flower-picker">
          <div class="kb-flower-picker-header">
            <span class="kb-flower-picker-title">
              {{ lang === 'id' ? '🌸 Pilih Bungamu!' : '🌸 Choose Your Flower!' }}
            </span>
            <button class="kb-popup-close" @click="onFlowerPickerClose">✕</button>
          </div>
          <p class="kb-flower-picker-subtitle">
            {{ lang === 'id'
              ? 'Kebunmu sudah siap mekar! Pilih bunga yang mewakili perasaanmu.'
              : 'Your garden is ready to bloom! Pick a flower that represents you.'
            }}
          </p>
          <div class="kb-flower-grid">
            <button
              v-for="f in flowerOptions"
              :key="f.key"
              class="kb-flower-option"
              :class="{ 'selected': tempFlower === f.img }"
              @click="tempFlower = f.img"
            >
              <img :src="f.img" :alt="f.label" class="kb-flower-option-img" />
              <span class="kb-flower-option-label">{{ lang === 'id' ? f.labelId : f.label }}</span>
            </button>
          </div>
          <button
            class="kb-flower-confirm-btn"
            :disabled="!tempFlower"
            @click="confirmFlower"
          >
            {{ lang === 'id' ? 'Tanam Bunga Ini 🌱' : 'Plant This Flower 🌱' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Warning: Already reflected today -->
    <Transition name="kb-popup">
      <div class="kb-popup-overlay" v-if="showReflectionAlreadyDoneWarning" @click.self="closeReflectionWarning">
        <div class="kb-reflection-warning">
          <div class="kb-reflection-warning-icon">🌱</div>
          <div class="kb-reflection-warning-title">
            {{ lang === 'id' ? "Sudah Refleksi Hari Ini!" : "You've already reflected today!" }}
          </div>
          <div class="kb-reflection-warning-message">
            {{ lang === 'id' 
              ? "Kamu sudah membuat refleksi untuk hari ini. Datang lagi besok untuk menjaga streakmu tetap hidup! 🌱" 
              : "You've already made a reflection for today. Come back tomorrow to keep your streak going! 🌱" 
            }}
          </div>
          <button class="kb-reflection-warning-btn" @click="closeReflectionWarning">
            {{ lang === 'id' ? 'OK, Mengerti' : "Got It" }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Flower Collection Popup -->
    <Transition name="kb-popup">
      <div class="kb-popup-overlay" v-if="showCollectionPopup" @click.self="closeCollectionPopup">
        <div class="kb-collection-popup">
          <div class="kb-collection-popup-header">
            <span class="kb-collection-popup-title">🌸 {{ lang === 'id' ? 'Koleksi Bungamu' : 'Your Flower Collection' }}</span>
            <button class="kb-popup-close" @click="closeCollectionPopup">✕</button>
          </div>
          <p class="kb-collection-popup-subtitle">
            {{ lang === 'id'
              ? `${collectedFlowers.length} dari ${flowerOptions.length} bunga berhasil kamu tanam!`
              : `${collectedFlowers.length} of ${flowerOptions.length} flowers collected!`
            }}
          </p>
          <!-- Progress bar -->
          <div class="kb-collection-progress-wrap">
            <div class="kb-collection-progress-track">
              <div class="kb-collection-progress-fill" :style="{ width: (collectedFlowers.length / flowerOptions.length * 100) + '%' }"></div>
            </div>
            <span class="kb-collection-progress-label">{{ Math.round(collectedFlowers.length / flowerOptions.length * 100) }}%</span>
          </div>
          <!-- Collected flowers grid -->
          <div class="kb-collection-grid">
            <div
              v-for="f in flowerOptions"
              :key="f.key"
              class="kb-collection-slot"
              :class="{ 'kb-collection-slot-owned': isFlowerCollected(f.key), 'kb-collection-slot-locked': !isFlowerCollected(f.key) }"
            >
              <div class="kb-collection-slot-inner">
                <img v-if="isFlowerCollected(f.key)" :src="f.img" :alt="f.label" class="kb-collection-flower-img" />
                <span v-else class="kb-collection-locked-icon">🔒</span>
              </div>
              <span class="kb-collection-flower-name">{{ lang === 'id' ? f.labelId : f.label }}</span>
              <span v-if="isFlowerCollected(f.key)" class="kb-collection-owned-badge">✓</span>
            </div>
          </div>
          <p class="kb-collection-hint">
            {{ lang === 'id'
              ? 'Setiap 3 hari streak, kamu bisa menanam 1 bunga baru!'
              : 'Every 3-day streak, you can grow a new flower!'
            }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { authService } from '../services/auth.js'
import { reflectionService } from '../services/reflection.js'

const props = defineProps({
  isDark: Boolean,
  lang: { type: String, default: 'id' },
  reflections: { type: Array, default: () => [] },
  streakDays: { type: Number, default: 0 },
  openGarden: { type: Number, default: 0 },
  userName: { type: String, default: '' },
  userId: { type: [String, Number], default: null },
  pendingReflection: { type: Object, default: null },
  justRegistered: { type: Boolean, default: false }, // New user from onboarding
  hasReflectionToday: { type: Boolean, default: false }, // Whether user already has reflection today
})

const emit = defineEmits(['start-journal', 'logout', 'watered', 'reflection-updated', 'toggle-theme', 'toggle-lang'])

// Open garden popup when triggered from parent (after journal done)
// Always open - let the panel itself show appropriate content
watch(() => props.openGarden, (val) => {
  if (val > 0) {
    setTimeout(() => { growthPanelOpen.value = true }, 600)
  }
})

watch(() => props.pendingReflection, (newVal) => {
  if (newVal) {
    setTimeout(() => { growthPanelOpen.value = true }, 600)
  }
})

// Auto-open only triggered by new reflection (see pendingReflection watch above)

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

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  // Load user profile from auth service
  const user = authService.getUser()
  if (user) {
    userEmail.value = user.email || 'user@innerly.app'
    userUsername.value = user.username || ''
  }
})

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed

const dayLabels = computed(() =>
  props.lang === 'id'
    ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
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

// Days that have reflections, sorted descending (for list view)
const listDays = computed(() => {
  const days = []
  for (let d = 1; d <= daysInMonth.value; d++) {
    if (getDayReflections(d).length > 0) days.push(d)
  }
  return days.reverse()
})

function getDayName(day) {
  const d = new Date(viewYear.value, viewMonth.value, day)
  const names = {
    en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    id: ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
  }
  return (names[props.lang] || names.en)[d.getDay()]
}

function getMoodLabelId(label) {
  const map = {
    'Happy': 'Senang', 'Calm': 'Tenang', 'Excited': 'Bersemangat',
    'Sad': 'Sedih', 'Anxious': 'Cemas', 'Frustrated': 'Frustrasi',
    'Confused': 'Bingung', 'Tired': 'Lelah', 'Touched': 'Terharu', 'So-so': 'Biasa aja'
  }
  return map[label] || label
}

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

// Helper to flatten all flowers for a day (max 3 shown)
function getDayFlowers(day) {
  const refs = getDayReflections(day)
  const flowers = []
  refs.forEach((ref, refIdx) => {
    if (ref.moods && ref.moods.length > 0) {
      ref.moods.forEach((moodLabel) => {
        flowers.push({
          img: getMoodImage(moodLabel),
          label: moodLabel,
          emoji: '🌸',
          refIdx,
        })
      })
    } else if (ref.mood) {
      flowers.push({
        img: getMoodImage(ref.mood),
        label: ref.mood,
        emoji: '🌱',
        refIdx,
      })
    } else {
      flowers.push({
        img: null,
        label: '',
        emoji: '🌱',
        refIdx,
      })
    }
  })
  return flowers
}

// Mood label → image file key (same as /public/*.png)
const moodImageMap = {
  // ID labels (from GuidedJournal)
  'Senang': 'happy', 'Tenang': 'calm', 'Bersemangat': 'excited',
  'Sedih': 'sad', 'Cemas': 'anxious', 'Frustrasi': 'frustrated',
  'Bingung': 'confused', 'Lelah': 'tired', 'Terharu': 'touched',
  'Biasa aja': 'so-so', 'Biasa saja': 'so-so', 'Bangga': 'excited', 'Marah': 'frustrated', 'Tersentuh': 'touched',
  // EN labels (from GuidedJournal)
  'Happy': 'happy', 'Calm': 'calm', 'Excited': 'excited',
  'Sad': 'sad', 'Anxious': 'anxious', 'Frustrated': 'frustrated',
  'Confused': 'confused', 'Tired': 'tired', 'Touched': 'touched',
  'So-so': 'so-so', 'Proud': 'excited', 'Angry': 'frustrated',
}

function getMoodImage(mood) {
  const key = moodImageMap[mood]
  if (!key) return null
  return `/${key}1.png`
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
  editMode.value = false
  editDraft.value = {}
}

// Edit mode
const editMode = ref(false)
const editDraft = ref({})
const editAutoSaving = ref(false)

function enterEditMode() {
  const r = popup.value.reflection
  editDraft.value = {
    title: r?.title ?? '',
    description: (r?.description || r?.trigger) ?? '',
    feeling: r?.feeling ?? '',
    wentWell: r?.wentWell ?? '',
    improve: r?.improve ?? '',
    analysis: (r?.analysis || r?.insight) ?? '',
    conclusion: r?.conclusion ?? '',
    action: r?.action ?? '',
  }
  editMode.value = true
}

function cancelEdit() {
  editMode.value = false
  editDraft.value = {}
}

// Debounced real-time auto-save
let _saveTimer = null
watch(editDraft, (draft) => {
  if (!editMode.value || !popup.value.reflection) return
  clearTimeout(_saveTimer)
  editAutoSaving.value = true
  _saveTimer = setTimeout(async () => {
    try {
      const updatedRef = {
        ...popup.value.reflection,
        ...draft,
        trigger: draft.description || draft.trigger || popup.value.reflection?.trigger || '',
        insight: draft.analysis || draft.insight || popup.value.reflection?.insight || '',
      }
      try {
        const existing = JSON.parse(localStorage.getItem('innerly_reflections') || '[]')
        const updated = existing.map(r => r.date === updatedRef.date ? updatedRef : r)
        localStorage.setItem('innerly_reflections', JSON.stringify(updated))
      } catch {}
      const user = authService.getUser()
      const userId = user && (user.id || user._id)
      if (userId) {
        try { await reflectionService.saveReflection(userId, updatedRef) } catch {}
      }
      popup.value = { ...popup.value, reflection: updatedRef }
      emit('reflection-updated', updatedRef)
    } finally {
      editAutoSaving.value = false
    }
  }, 1200)
}, { deep: true })

function formatPopupDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const months = {
    en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    id: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
  }
  const names = months[props.lang] || months.en
  return `${d.getDate()} ${names[d.getMonth()]} ${d.getFullYear()}`
}

function formatCreatedAt(createdAt) {
  if (!createdAt) return null
  const d = new Date(createdAt)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

// ── Growth Garden Panel ──
const growthPanelOpen = ref(false)
const isWatering = ref(false)
const justWatered = ref(false)
const isDragOver = ref(false)
const watercanRef = ref(null)
const plantAreaRef = ref(null)

// Toast for "come back tomorrow"
const showToast = ref(false)
const showReflectionToast = ref(false)
let toastTimer = null

function showComeBackToast() {
  showToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { showToast.value = false }, 2800)
}

function showReflectionRequiredToast() {
  showReflectionToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { showReflectionToast.value = false }, 3500)
}

// Watered state persisted to DB + localStorage
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Cek localStorage dulu (instant, tidak perlu tunggu DB)
const todayKey = getTodayKey();
const localWatered = localStorage.getItem('innerly_watered_date');
// Kalau tanggal di localStorage bukan hari ini, hapus supaya tidak carryover ke hari berikutnya
if (localWatered && localWatered !== todayKey) {
  localStorage.removeItem('innerly_watered_date');
}
const hasWateredLocally = ref(localWatered === todayKey);
const isLoadingWateredState = ref(false); // tidak perlu loading karena localStorage instant

// ── Flower picker ──
const showFlowerPicker = ref(false)
const tempFlower = ref(null)
const chosenFlower = ref(null) // Will be loaded from DB in onMounted; fallback to localStorage

// ── Flower Collection ──
const collectedFlowers = ref([]) // Array of { key, img, label, labelId, collectedAt }
const showCollectionPopup = ref(false)
const showCollectionBubble = ref(false)
let collectionBubbleTimer = null

function getCollectionKey() {
  // Scope per user so different accounts don't share collection
  const userId = props.userId
  return userId ? `innerly_collected_flowers_${userId}` : 'innerly_collected_flowers_guest'
}

function loadCollectedFlowers() {
  try {
    collectedFlowers.value = []
    const stored = localStorage.getItem(getCollectionKey())
    if (stored) collectedFlowers.value = JSON.parse(stored)
  } catch {}

  // Also load from DB to ensure persistence across devices
  const userId = props.userId
  if (userId) {
    fetch(`/api/streak/${userId}/collection`)
      .then(r => r.json())
      .then(data => {
        if (data.flowers && data.flowers.length > 0) {
          // Merge DB flowers with local, DB takes precedence if more
          if (data.flowers.length >= collectedFlowers.value.length) {
            collectedFlowers.value = data.flowers
            saveCollectedFlowers()
          }
        } else if (collectedFlowers.value.length > 0) {
          // Sync local to DB if DB is empty but local has data
          syncCollectionToDb()
        }
      })
      .catch(() => {})
  }
}

function saveCollectedFlowers() {
  try {
    localStorage.setItem(getCollectionKey(), JSON.stringify(collectedFlowers.value))
  } catch {}
  syncCollectionToDb()
}

function syncCollectionToDb() {
  const userId = props.userId
  if (!userId) return
  fetch(`/api/streak/${userId}/collection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flowers: collectedFlowers.value })
  }).catch(() => {})
}

function isFlowerCollected(key) {
  return collectedFlowers.value.some(f => f.key === key)
}

function openCollectionPopup() {
  showCollectionBubble.value = false
  showCollectionPopup.value = true
}

function closeCollectionPopup() {
  showCollectionPopup.value = false
}

function triggerCollectionBubble() {
  showCollectionBubble.value = true
  if (collectionBubbleTimer) clearTimeout(collectionBubbleTimer)
  collectionBubbleTimer = setTimeout(() => {
    showCollectionBubble.value = false
  }, 5000)
}

// ── Already reflected today warning ──
const showReflectionAlreadyDoneWarning = ref(false)

const flowerOptions = [
  { key: 'happy',      img: '/happy1.png',      label: 'Happy',      labelId: 'Senang'      },
  { key: 'calm',       img: '/calm1.png',        label: 'Calm',       labelId: 'Tenang'      },
  { key: 'excited',    img: '/excited1.png',     label: 'Excited',    labelId: 'Bersemangat' },
  { key: 'sad',        img: '/sad1.png',         label: 'Sad',        labelId: 'Sedih'       },
  { key: 'anxious',    img: '/anxious1.png',     label: 'Anxious',    labelId: 'Cemas'       },
  { key: 'frustrated', img: '/frustrated1.png',  label: 'Frustrated', labelId: 'Frustrasi'   },
  { key: 'confused',   img: '/confused1.png',    label: 'Confused',   labelId: 'Bingung'     },
  { key: 'tired',      img: '/tired1.png',       label: 'Tired',      labelId: 'Lelah'       },
  { key: 'touched',    img: '/touched1.png',     label: 'Touched',    labelId: 'Terharu'     },
  { key: 'so-so',      img: '/so-so1.png',       label: 'So-so',      labelId: 'Biasa aja'   },
]

function confirmFlower() {
  if (!tempFlower.value) return
  const pickedImg = tempFlower.value
  chosenFlower.value = pickedImg
  localStorage.setItem('innerly_chosen_flower', pickedImg)
  showFlowerPicker.value = false

  // Add to collection if not already there
  const pickedOption = flowerOptions.find(f => f.img === pickedImg)
  if (pickedOption && !isFlowerCollected(pickedOption.key)) {
    collectedFlowers.value.push({
      key: pickedOption.key,
      img: pickedOption.img,
      label: pickedOption.label,
      labelId: pickedOption.labelId,
      collectedAt: new Date().toISOString(),
    })
    saveCollectedFlowers()
    // Show collection bubble after a short delay (let watering animation finish)
    setTimeout(() => triggerCollectionBubble(), 2200)
  }

  // Reset plant to dirt after this cycle — next watering starts fresh
  // We use a small delay so the flower is visible briefly
  setTimeout(() => {
    chosenFlower.value = null
    localStorage.removeItem('innerly_chosen_flower')
  }, 3500)

  // Save chosen flower to DB so it persists across logout/login
  const userId = props.userId
  if (userId) {
    console.log('[Innerly] Saving chosen flower to DB:', pickedImg, 'for userId:', userId);
    fetch(`/api/streak/${userId}/flower`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flower: pickedImg })
    })
      .then(res => res.json())
      .then(data => console.log('[Innerly] Flower saved to DB:', data))
      .catch(e => console.error('[Innerly] FAILED to save flower to DB:', e));
  } else {
    console.warn('[Innerly] confirmFlower: userId is null, cannot save to DB. User must be logged in.');
  }
  tempFlower.value = null
}

function onFlowerPickerClose() {
  // Jika user tutup tanpa pilih, pakai default pot.png
  if (!chosenFlower.value) chosenFlower.value = '/pot.png'
  showFlowerPicker.value = false
  tempFlower.value = null
}

// Load watered state + chosen flower from DB
async function loadUserDataFromDB(userId) {
  if (!userId) return;
  try {
    const res = await fetch(`/api/streak/${userId}`);
    if (!res.ok) return;
    const data = await res.json();
    console.log('[Innerly] Loaded streak data from DB:', data);
    // Sync watered state
    if (data.last_watered_date) {
      const watered = data.last_watered_date.split('T')[0];
      if (watered === getTodayKey()) {
        hasWateredLocally.value = true;
        localStorage.setItem('innerly_watered_date', getTodayKey());
      }
    }
    // Load chosen flower — DB is source of truth, overrides localStorage
    if (data.chosen_flower) {
      chosenFlower.value = data.chosen_flower;
      localStorage.setItem('innerly_chosen_flower', data.chosen_flower);
      console.log('[Innerly] Restored chosen flower from DB:', data.chosen_flower);
    }
  } catch (e) {
    console.warn('[Innerly] loadUserDataFromDB error:', e);
  }
}

onMounted(async () => {
  // Load from localStorage first (instant fallback while waiting for DB)
  const localFlower = localStorage.getItem('innerly_chosen_flower');
  if (localFlower) chosenFlower.value = localFlower;

  // Load collected flowers from localStorage
  loadCollectedFlowers();

  // Load from DB (props.userId mungkin sudah tersedia saat mount)
  await loadUserDataFromDB(props.userId);
});

// Watch userId — jika saat mount userId masih null (belum login),
// watch ini akan trigger load dari DB begitu userId tersedia
watch(() => props.userId, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log('[Innerly] userId changed, reloading from DB:', newId);
    // Reload collection for the new user (different accounts must not share data)
    loadCollectedFlowers();
    await loadUserDataFromDB(newId);
  }
}, { immediate: false });

// Touch drag state
let touchOffsetX = 0
let touchOffsetY = 0
let touchEl = null

// ── Drag logic: floating clone follows cursor/touch ──
let floatingEl = null

function createFloating(x, y) {
  floatingEl = document.createElement('img')
  floatingEl.src = '/water-can1.png'
  floatingEl.style.cssText = 'position:fixed;width:80px;height:80px;object-fit:contain;z-index:9999;pointer-events:none;opacity:0.92;transform:rotate(-20deg);filter:drop-shadow(0 6px 16px rgba(76,175,80,0.5));'
  moveFloating(x, y)
  document.body.appendChild(floatingEl)
}

function moveFloating(x, y) {
  if (!floatingEl) return
  floatingEl.style.left = (x - 40) + 'px'
  floatingEl.style.top = (y - 40) + 'px'
}

function removeFloating() {
  if (floatingEl) { document.body.removeChild(floatingEl); floatingEl = null }
}

function checkOverPlantArea(x, y) {
  if (!plantAreaRef.value) return false
  const rect = plantAreaRef.value.getBoundingClientRect()
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function onWatercanMouseDown(e) {
  e.preventDefault()
  createFloating(e.clientX, e.clientY)
  const onMove = (ev) => {
    moveFloating(ev.clientX, ev.clientY)
    isDragOver.value = checkOverPlantArea(ev.clientX, ev.clientY)
  }
  const onUp = (ev) => {
    removeFloating()
    const droppedOnPlant = checkOverPlantArea(ev.clientX, ev.clientY)
    if (droppedOnPlant) {
      triggerWatering()
    }
    isDragOver.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onWatercanTouchStart(e) {
  e.preventDefault()
  const touch = e.touches[0]
  createFloating(touch.clientX, touch.clientY)
}
function onWatercanTouchMove(e) {
  e.preventDefault()
  const touch = e.touches[0]
  moveFloating(touch.clientX, touch.clientY)
  isDragOver.value = checkOverPlantArea(touch.clientX, touch.clientY)
}
function onWatercanTouchEnd(e) {
  const dropped = isDragOver.value
  removeFloating()
  isDragOver.value = false
  if (dropped) {
    triggerWatering()
  }
}

function onWatercanDragStart(e) { e.preventDefault() }
function onWaterDrop() {}

// Check if user has made reflection today
function hasReflectionToday() {
  const today = getTodayKey()
  return props.reflections && props.reflections.some(r => {
    const refDate = r.date ? r.date.split('T')[0] : r.date
    return refDate === today
  })
}

function triggerWatering() {
  if (isWatering.value) return
  // Block if already watered today
  if (hasWateredLocally.value) {
    showComeBackToast()
    return
  }
  // Block if no reflection today - user must make reflection first
  // Exception: new users who just registered (they made reflection during onboarding)
  const hasRef = props.hasReflectionToday || props.justRegistered || hasReflectionToday()
  if (!hasRef) {
    showReflectionRequiredToast()
    return
  }
  // Animasi siram
  isWatering.value = true
  justWatered.value = true
  setTimeout(() => {
    isWatering.value = false
    justWatered.value = false
    hasWateredLocally.value = true
    const todayDate = getTodayKey()
    localStorage.setItem('innerly_watered_date', todayDate)
    // Save watered date to DB
    const userId = props.userId;
    if (userId) {
      fetch(`/api/streak/${userId}/water`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: todayDate })
      })
        .then(res => res.json())
        .then(data => console.log('[Innerly] Watered saved to DB:', data))
        .catch(e => console.warn('[Innerly] Could not save watered date:', e));
    } else {
      console.warn('[Innerly] triggerWatering: userId not found (user not logged in), skipping DB save');
    }
    emit('watered')
    // Tampilkan flower picker saat Day 3 dalam siklus.
    // Karena props.streakDays belum di-update parent saat ini,
    // kita hitung manual: streakDays + 1 (setelah siram hari ini)
    const newStreak = (props.streakDays || 0) + 1
    const newMod = newStreak % 3
    const newCycleDay = newMod === 0 ? 3 : newMod
    const nextStage = newCycleDay >= 3 ? 'flower' : (newCycleDay === 2 ? 'sprout' : 'seed')
    if (nextStage === 'flower' && !chosenFlower.value) {
      setTimeout(() => { showFlowerPicker.value = true }, 400)
    }
  }, 1800)
}

function getDropStyle(i) {
  const x = 20 + ((i * 37) % 60)
  const delay = (i * 0.12) % 0.9
  return { left: x + '%', animationDelay: delay + 's' }
}

function toggleGrowthPanel() {
  growthPanelOpen.value = !growthPanelOpen.value
}

const todayDate = new Date()

const currentDay = computed(() => todayDate.getDate())

const currentMonthShort = computed(() => {
  const months = {
    id: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'],
    en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  }
  return (months[props.lang] || months.en)[todayDate.getMonth()]
})

// How many days into current 3-day cycle
const streakInCycle = computed(() => {
  // Progress baru naik setelah user siram hari ini
  const base = hasWateredLocally.value ? props.streakDays : props.streakDays - 1
  if (base <= 0) return 0
  const mod = base % 3
  return mod === 0 ? 3 : mod
})

const cycleProgress = computed(() => {
  return (streakInCycle.value / 3) * 100
})

// Plant stage:
// Day 1: dirt → (siram) → seed
// Day 2: seed → (siram) → leaf
// Day 3+: leaf → (siram) → flower pilihan
const plantStage = computed(() => {
  // Use actual streak days (not reduced by 1) to determine the correct stage
  // streakDays reflects how many days have been completed (watered)
  // On a new day before watering, streakDays = days already done
  const completedDays = props.streakDays || 0
  const mod = completedDays % 3
  const dayInCycle = mod === 0 && completedDays > 0 ? 3 : mod  // 0=no streak, 1, 2, or 3

  // Day 1: before water → dirt, after water → seed
  // Day 2: before water → seed (from yesterday), after water → sprout/leaf
  // Day 3: before water → sprout (from yesterday), after water → flower
  if (dayInCycle === 0) return 'dirt'
  if (dayInCycle === 1) return hasWateredLocally.value ? 'seed' : 'dirt'
  if (dayInCycle === 2) return hasWateredLocally.value ? 'sprout' : 'seed'
  if (dayInCycle >= 3) return hasWateredLocally.value ? 'flower' : 'sprout'
  return 'dirt'
})

// Header streak icon
const headerStreakImg = computed(() => {
  const stage = plantStage.value
  if (stage === 'dirt') return '/dirt.png'
  if (stage === 'seed') return '/seeds.png'
  if (stage === 'sprout') return '/leaf.png'
  return chosenFlower.value || '/pot.png'
})

const growthTip = computed(() => {
  const stage = plantStage.value
  if (props.lang === 'id') {
    if (stage === 'dirt') return 'Seret ember siram ke tanah untuk menanam benih pertamamu!'
    if (stage === 'seed' && !hasWateredLocally.value) return 'Benihmu sudah ada! Sirami hari ini agar tumbuh jadi tunas.'
    if (stage === 'seed' && hasWateredLocally.value) return 'Benih disiram! Besok tunasmu mulai tumbuh 🌱'
    if (stage === 'sprout' && !hasWateredLocally.value) return 'Tunasmu tumbuh! Sirami hari ini agar mekar jadi bunga.'
    if (stage === 'sprout' && hasWateredLocally.value) return 'Hampir mekar! Besok pilihlah bungamu 🌸'
    if (stage === 'flower' && !hasWateredLocally.value) return 'Kebunmu sudah mekar! Sirami untuk menjaga bungamu tetap indah.'
    return 'Luar biasa! Kebunmu sedang mekar. Terus jaga streakmu!'
  } else {
    if (stage === 'dirt') return 'Drag the watering can to plant your first seed!'
    if (stage === 'seed' && !hasWateredLocally.value) return 'Your seed is here! Water it today to grow a sprout.'
    if (stage === 'seed' && hasWateredLocally.value) return 'Seed watered! Tomorrow your sprout begins to grow 🌱'
    if (stage === 'sprout' && !hasWateredLocally.value) return 'Your sprout is growing! Water today to make it bloom.'
    if (stage === 'sprout' && hasWateredLocally.value) return 'Almost there! Tomorrow choose your flower 🌸'
    if (stage === 'flower' && !hasWateredLocally.value) return 'Your garden bloomed! Water it to keep your flower beautiful.'
    return 'Amazing! Your garden is blooming. Keep up your streak!'
  }
})

// Reset local watered state saat tanggal berubah (hari baru)
// Ini dihandle by onMounted yang cek last_watered_date dari DB
watch(() => props.streakDays, (val) => {
  // Jika streak naik (hari baru, refleksi baru disimpan), reset hasWateredLocally
  // agar user bisa siram lagi hari itu
  // (state sebenarnya dicek dari DB di onMounted)
})

function onLogout() {
  // Bersihkan SEMUA data user dari localStorage
  try {
    localStorage.removeItem('innerly_user')
    localStorage.removeItem('innerly_reflections')
    localStorage.removeItem('innerly_watered_date')
    localStorage.removeItem('innerly_reminder')
    localStorage.removeItem('innerly_chosen_flower')
  } catch {}
  profileOpen.value = false
  emit('logout')
}

function onPlantReflection() {
  if (props.hasReflectionToday) {
    showReflectionAlreadyDoneWarning.value = true
    return
  }
  growthPanelOpen.value = false
  emit('start-journal')
}

function closeReflectionWarning() {
  showReflectionAlreadyDoneWarning.value = false
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
  overflow: visible;
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

.kb-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
/* Desktop header controls */
.kb-header-desktop-btn {
  display: flex;
}
@media (max-width: 768px) {
  .kb-header-desktop-btn {
    display: none !important;
  }
}

/* Profile dropdown controls - mobile only */
.kb-profile-actions-mobile {
  display: flex;
}
@media (min-width: 769px) {
  .kb-profile-actions-mobile {
    display: none !important;
  }
}

/* Brand: always visible, text hidden on mobile */
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
.kb-brand-name {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}
.kb-brand-name--desktop {
  display: inline;
}
@media (max-width: 768px) {
  .kb-brand-name--desktop {
    display: none;
  }
}

/* Right: streak */
/* Update atau Tambahkan CSS ini */
.kb-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.kb-header-lang-btn {
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--accent-soft);
  cursor: pointer;
  transition: all 0.2s;
}
.kb-header-lang-btn:hover {
  color: var(--accent);
  background: var(--accent-glow);
}
.kb-header-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--accent-soft);
  cursor: pointer;
  transition: all 0.2s;
}
.kb-header-icon-btn:hover {
  color: var(--accent);
  background: var(--accent-glow);
}
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
.kb-streak-plant-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.15));
}
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
.kb-profile-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
}
.kb-profile-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.kb-profile-icon-btn:hover { background: var(--bg-card); }
.kb-profile-lang-btn {
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kb-profile-lang-btn:hover { background: var(--bg-card); }
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
  width: clamp(40px, 10vw, 70px);
  height: clamp(25px, 6vw, 45px);
  object-fit: contain;
  opacity: 0.55;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
  transition: opacity 0.15s;
}
.kb-dirt-img-large {
  width: clamp(40px, 10vw, 70px);
  height: clamp(25px, 6vw, 45px);
}
.kb-cell:hover .kb-dirt-img {
  opacity: 0.75;
}

/* ── Calendar ── */
/* Desktop: show grid, hide list */
.kb-calendar-desktop { display: grid; }
.kb-list-view { display: none; }
@media (max-width: 768px) {
  .kb-calendar-desktop { display: none !important; }
  .kb-list-view { display: flex; }
  /* also hide the day-labels row which is inside the grid */
}

/* List view */
.kb-list-view {
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  flex: 1;
  overflow-y: auto;
}
.kb-list-empty {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.88rem;
  padding: 40px 0;
}
.kb-list-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative;
}
.kb-list-card:active { transform: scale(0.98); }
.kb-list-card-today {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent);
}
.kb-list-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 36px;
}
.kb-list-day-num {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}
.kb-list-day-name {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.kb-list-flowers {
  flex-shrink: 0;
}
.kb-list-dirt {
  position: relative;
  width: 72px;
  height: 48px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.kb-list-dirt-img {
  position: absolute;
  bottom: 0;
  width: 72px;
  height: 38px;
  object-fit: cover;
}
.kb-list-flower-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  padding-bottom: 6px;
}
.kb-list-flower-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.kb-list-flower-more {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
}
.kb-list-moods {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.kb-list-mood-tag {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  border-radius: 20px;
  padding: 3px 9px;
  font-size: 0.72rem;
  font-weight: 600;
}
.kb-list-mood-more {
  color: var(--text-secondary);
  font-size: 0.72rem;
  align-self: center;
}
.kb-list-time {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}
.kb-list-arrow {
  color: var(--text-secondary);
  font-size: 1.2rem;
  flex-shrink: 0;
}

.kb-calendar {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(80px, auto);
  gap: 0;
  border-left: 1px solid var(--border);
  border-top: 1px solid var(--border);
  overflow: visible;
}

.kb-day-label {
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  text-align: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 6px 2px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
}

.kb-cell {
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
  min-height: 70px;
  padding: 4px 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
  overflow: hidden;
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
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  align-self: center;
  line-height: 1;
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
  gap: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  position: relative;
}
.kb-flower-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  max-width: 100%;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}
.kb-flower-more {
  font-size: 1.1rem;
  color: #c084fc;
  margin-left: 4px;
  font-weight: 600;
  align-self: center;
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
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
  transition: transform 0.2s ease;
  animation: flower-appear 0.4s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}
.kb-mood-img-large {
  width: clamp(30px, 8vw, 56px);
  height: clamp(30px, 8vw, 56px);
}
@keyframes flower-appear {
  from { transform: scale(0) translateY(8px); opacity: 0; }
  to   { transform: scale(1) translateY(0);   opacity: 1; }
}
.kb-flower-wrap:nth-child(2) .kb-mood-img { animation-delay: 0.06s; }
.kb-flower-wrap:nth-child(3) .kb-mood-img { animation-delay: 0.12s; }
.kb-flower-wrap:nth-child(4) .kb-mood-img { animation-delay: 0.18s; }
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

/* Multi-mood display in popup */
.kb-popup-moods-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}
.kb-popup-mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.kb-popup-mood-img-lg {
  width: 52px;
  height: 52px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.12));
  transition: transform 0.15s;
}
.kb-popup-mood-item:hover .kb-popup-mood-img-lg {
  transform: scale(1.1) translateY(-2px);
}
.kb-popup-mood-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
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
  bottom: 88px;
  right: 24px;
  left: auto;
  transform: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  z-index: 50;
}
.kb-fab {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  border: none;
  color: white;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(76, 175, 80, 0.5);
  transition: transform 0.18s, box-shadow 0.18s, background 0.3s;
  position: relative;
}

/* Belum refleksi hari ini → kedip merah */
.kb-fab.kb-fab-no-ref {
  background: linear-gradient(135deg, #e53935 0%, #ef9a9a 100%);
  box-shadow: 0 6px 24px rgba(229, 57, 53, 0.5);
  animation: fab-blink-red 1.4s ease-in-out infinite;
}

/* Sudah siram hari ini → hijau solid, tidak kedip */
.kb-fab.kb-fab-watered {
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  box-shadow: 0 6px 24px rgba(76, 175, 80, 0.4);
  animation: none;
}

/* Sudah refleksi hari ini → kedip hijau */
.kb-fab.kb-fab-done {
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
  box-shadow: 0 6px 24px rgba(76, 175, 80, 0.5);
  animation: fab-blink-green 2s ease-in-out infinite;
}

@keyframes fab-blink-red {
  0%, 100% {
    box-shadow: 0 6px 24px rgba(229, 57, 53, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 6px 32px rgba(229, 57, 53, 0.9), 0 0 24px rgba(229, 57, 53, 0.5);
    transform: scale(1.07);
  }
}

@keyframes fab-blink-green {
  0%, 100% {
    box-shadow: 0 6px 24px rgba(76, 175, 80, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 6px 32px rgba(76, 175, 80, 0.8), 0 0 20px rgba(76, 175, 80, 0.4);
    transform: scale(1.05);
  }
}
.kb-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.6);
}
.kb-fab-scope {
  position: absolute;
  right: -18px;
  bottom: 6px;
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
  transform: rotate(-15deg);
  pointer-events: none;
}
.kb-fab-plus {
  line-height: 1;
  margin-top: -2px;
  font-size: 2rem;
  font-weight: 700;
}
.kb-fab-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.kb-fab-chat-bubble {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  width: 220px;
  padding: 12px 16px;
  border-radius: 18px;
  background: rgba(255, 246, 238, 0.98);
  color: #1f2937;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
  font-size: 0.82rem;
  line-height: 1.35;
  text-align: left;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kb-fab-chat-bubble::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -10px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 10px solid rgba(255, 246, 238, 0.98);
}
@media (max-width: 768px) {
  .kb-fab-chat-bubble {
    right: 0;
    left: auto;
    top: auto;
    bottom: calc(100% + 10px);
    transform: none;
    width: 200px;
    text-align: center;
  }
  .kb-fab-chat-bubble::after {
    top: auto;
    right: 28px;
    bottom: -10px;
    left: auto;
    transform: none;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid rgba(255, 246, 238, 0.98);
    border-bottom: none;
  }
}
.kb-fab-chat-text {
  display: block;
  font-weight: 600;
  text-align: center;
}

/* FAB pulse animation when no reflection today */
@keyframes fab-pulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(124, 108, 168, 0.4), 0 0 0 0 rgba(124, 108, 168, 0.4); }
  50% { box-shadow: 0 8px 32px rgba(124, 108, 168, 0.6), 0 0 0 12px rgba(124, 108, 168, 0); }
}
.kb-fab.kb-fab-pulse {
  animation: fab-pulse 1.8s ease-in-out infinite;
}
.kb-fab.kb-fab-pulse .kb-fab-plus {
  animation: none;
}

/* ── Water drop animation ── */
.kb-water-drops {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}
.kb-drop {
  position: absolute;
  top: 0;
  font-size: 1.2rem;
  animation: drop-fall 0.8s ease-in forwards;
}
@keyframes drop-fall {
  0% { transform: translateY(-10px); opacity: 1; }
  100% { transform: translateY(80px); opacity: 0; }
}
.kb-growth-plant-area.drop-active {
  outline: 3px dashed #4caf50;
  outline-offset: -3px;
  background: linear-gradient(180deg, #d4f0cc 0%, #b8e0a8 100%);
}
.kb-growth-plant-area.is-watered {
  animation: watered-flash 1.8s ease;
}
@keyframes watered-flash {
  0%, 100% { filter: none; }
  30% { filter: brightness(1.15) saturate(1.3); }
}
.kb-watercan-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.kb-watercan-hint {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(80, 100, 60, 0.6);
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
}
.kb-watercan-done {
  color: #4caf50;
  font-size: 0.75rem;
  padding: 6px 10px;
  background: rgba(76,175,80,0.1);
  border-radius: 12px;
  border: 1.5px solid rgba(76,175,80,0.3);
  margin-top: 8px;
}
.kb-growth-watercan {
  cursor: grab;
  touch-action: none;
}
.kb-growth-watercan:active,
.kb-growth-watercan.is-watering {
  cursor: grabbing;
  filter: drop-shadow(0 4px 12px rgba(76,175,80,0.5));
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
  box-sizing: border-box;
  overflow: hidden;
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
.kb-popup-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.kb-popup-date-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 2px 8px;
  border-radius: 20px;
  width: fit-content;
  letter-spacing: 0.04em;
}
.kb-popup-time-badge {
  font-size: 0.68rem;
  font-weight: 600;
  color: #888;
  margin-top: 2px;
}
.kb-popup-title {
  font-weight: 700;
  font-size: 0.92rem;
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
.kb-popup-edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 42vh;
  overflow-y: auto;
}
.kb-edit-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kb-edit-field label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
}
.kb-edit-textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1.5px solid rgba(124, 108, 168, 0.25);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.kb-edit-textarea:focus {
  border-color: var(--accent);
}
.kb-edit-save-status {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: right;
  min-height: 16px;
}
.kb-edit-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1.5px solid rgba(124, 108, 168, 0.25);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.kb-edit-input:focus {
  border-color: var(--accent);
}
.kb-edit-cancel-btn {
  width: 100%;
  padding: 10px;
  border-radius: 50px;
  background: transparent;
  border: 1.5px solid rgba(124, 108, 168, 0.3);
  color: var(--text-secondary);
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.kb-edit-cancel-btn:hover {
  background: rgba(124, 108, 168, 0.08);
}
.kb-popup-title-entry {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-soft);
  border-radius: 10px;
  padding: 6px 12px;
  margin-bottom: 2px;
}

/* Transitions */
.kb-popup-enter-active, .kb-popup-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.kb-popup-enter-from, .kb-popup-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ── Growth Garden Panel ── */
.kb-growth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

.kb-growth-panel {
  background: #f0f7ee;
  border-radius: 28px 28px 0 0;
  padding: 24px 24px 32px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
  max-height: 88vh;
  overflow-y: hidden;
}

/* Header */
.kb-growth-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kb-growth-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kb-growth-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.kb-growth-logo {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.kb-growth-brand-name {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: 1.2rem;
  font-weight: 800;
  color: #5a4a3a;
  letter-spacing: -0.01em;
}
.kb-growth-close {
  background: rgba(0,0,0,0.08);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 0.85rem;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.kb-growth-close:hover { background: rgba(0,0,0,0.15); }

.kb-growth-subtitle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kb-growth-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3d3529;
}
.kb-growth-streak-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff9e8;
  border: 1.5px solid #f0d080;
  border-radius: 14px;
  padding: 6px 12px;
}
.kb-streak-pot {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.kb-streak-badge-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.kb-streak-badge-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #a08040;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.kb-streak-badge-day {
  font-size: 0.9rem;
  font-weight: 800;
  color: #5a4a2a;
}

/* Date + water can row */
.kb-growth-date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}
.kb-growth-date {
  display: flex;
  flex-direction: column;
  line-height: 1;
}
.kb-growth-month {
  font-size: 0.85rem;
  font-weight: 600;
  color: #7a6a5a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.kb-growth-daynum {
  font-size: 2.4rem;
  font-weight: 800;
  color: #3d3529;
  line-height: 1;
}
.kb-growth-watercan {
  width: 80px;
  height: 80px;
  object-fit: contain;
  opacity: 0.85;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12));
  animation: watercan-bob 3s ease-in-out infinite;
}
@keyframes watercan-bob {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-6px) rotate(2deg); }
}

/* Plant area */
.kb-growth-plant-area {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 130px;
  background: linear-gradient(180deg, #e8f5e3 0%, #c8e8b8 100%);
  border-radius: 18px;
  overflow: hidden;
}
.kb-growth-plant-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 0;
}
.kb-plant-img {
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12));
  transition: transform 0.3s ease;
}
.kb-plant-seed {
  width: 70px;
  height: 70px;
  animation: seed-pulse 2s ease-in-out infinite;
}
@keyframes seed-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
.kb-plant-dirt {
  width: 150px;
  height: 90px;
  object-fit: contain;
  opacity: 0.7;
  margin-bottom: 28px;
}
.kb-plant-sprout {
  width: 90px;
  height: 90px;
  animation: sprout-sway 3s ease-in-out infinite;
}
@keyframes sprout-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}
.kb-plant-flower {
  width: 110px;
  height: 110px;
  animation: flower-bounce 2.5s ease-in-out infinite;
}
@keyframes flower-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Floating music notes */
.kb-growth-notes {
  position: absolute;
  top: 8px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kb-note {
  font-size: 1.1rem;
  opacity: 0.6;
  animation: note-float 2.5s ease-in-out infinite;
}
.kb-note-1 { color: #a855f7; animation-delay: 0s; }
.kb-note-2 { color: #ec4899; animation-delay: 0.6s; font-size: 0.9rem; }
.kb-note-3 { color: #f59e0b; animation-delay: 1.2s; font-size: 0.8rem; }
@keyframes note-float {
  0%, 100% { transform: translateY(0) rotate(-5deg); opacity: 0.5; }
  50% { transform: translateY(-10px) rotate(5deg); opacity: 0.9; }
}

/* Progress section */
.kb-growth-progress-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.kb-growth-streak-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.kb-growth-fire { font-size: 1.2rem; }
.kb-growth-plant-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.15));
}
.kb-growth-streak-label {
  font-size: 1rem;
  font-weight: 700;
  color: #3d3529;
}
.kb-growth-progress-label {
  font-size: 0.82rem;
  color: #6b5a48;
}
.kb-growth-progress-label strong {
  color: #3d3529;
}
.kb-growth-progress-track {
  width: 100%;
  height: 10px;
  background: #d4e8c8;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #b0d4a0;
}
.kb-growth-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6ab04c, #a8e060);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.34, 1.2, 0.64, 1);
  box-shadow: 0 2px 6px rgba(106, 176, 76, 0.4);
}
.kb-growth-tip {
  font-size: 0.8rem;
  color: #7a6a5a;
  font-style: italic;
  line-height: 1.4;
}

/* Action area */
.kb-growth-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kb-growth-plant-btn {
  width: 100%;
  padding: 14px 20px;
  border-radius: 50px;
  background: linear-gradient(135deg, #6ab04c, #a8e060);
  border: none;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(106, 176, 76, 0.4);
  transition: transform 0.18s, box-shadow 0.18s;
  font-family: 'Outfit', sans-serif;
}
.kb-growth-plant-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 28px rgba(106, 176, 76, 0.5);
}
.kb-shovel { font-size: 1.2rem; }
.kb-growth-hint {
  font-size: 0.75rem;
  color: #8a7a6a;
  text-align: center;
  line-height: 1.4;
}

/* Growth panel transition — slide up from bottom */
.growth-panel-enter-active, .growth-panel-leave-active {
  transition: opacity 0.25s ease;
}
.growth-panel-enter-active .kb-growth-panel,
.growth-panel-leave-active .kb-growth-panel {
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.growth-panel-enter-from { opacity: 0; }
.growth-panel-leave-to { opacity: 0; }
.growth-panel-enter-from .kb-growth-panel { transform: translateY(100%); }
.growth-panel-leave-to .kb-growth-panel { transform: translateY(100%); }

/* ── Soil hint text (new user instruction) ── */
.kb-soil-hint {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.88);
  color: #4a7c3f;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(76,175,80,0.18);
  border: 1.5px solid rgba(106,176,76,0.3);
  pointer-events: none;
  text-align: center;
}
.kb-soil-hint--seeded {
  color: #3a6a2a;
  background: rgba(220,255,200,0.92);
  border-color: rgba(106,176,76,0.5);
}

/* Hint fade transition */
.hint-fade-enter-active, .hint-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.hint-fade-enter-from, .hint-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}

/* ── Toast: come back tomorrow ── */
.kb-tomorrow-toast {
  background: #fff9e8;
  border: 1.5px solid #f0d080;
  color: #7a5a20;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(240,208,128,0.3);
  margin-top: -6px;
}

/* ── Toast: reflection required ── */
.kb-reflection-toast {
  background: #ffeef0;
  border: 1.5px solid #f5a6b0;
  color: #8b3a3a;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(245,166,166,0.3);
  margin-top: -6px;
}

/* No reflection banner */
.kb-no-ref-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #fff8e7, #fff3cd);
  border: 1.5px solid #f5c842;
  border-radius: 14px;
  padding: 12px 14px;
  margin: 8px 0 2px;
  flex-wrap: wrap;
}
.kb-no-ref-icon {
  flex-shrink: 0;
  color: #b45309;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kb-no-ref-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.kb-no-ref-text strong {
  font-size: 0.82rem;
  font-weight: 700;
  color: #7a5c00;
}
.kb-no-ref-text span {
  font-size: 0.75rem;
  color: #8a6a00;
}
.kb-no-ref-btn {
  background: #f5c842;
  border: none;
  border-radius: 20px;
  padding: 7px 14px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #4a3800;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.kb-no-ref-btn:hover {
  background: #e6b800;
  transform: translateY(-1px);
}

/* Watercan disabled when no reflection */
.kb-growth-watercan.watercan-disabled {
  opacity: 0.35;
  filter: grayscale(60%);
  cursor: not-allowed;
}
.kb-watercan-no-ref {
  color: #c0392b;
  font-weight: 700;
}

/* Toast slide-up transition */
.toast-up-enter-active, .toast-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-up-enter-from, .toast-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ── Flower Picker Popup ── */
.kb-flower-picker {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 85vh;
  overflow-y: auto;
}
.kb-flower-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kb-flower-picker-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}
.kb-flower-picker-subtitle {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: -8px 0 0;
}
.kb-flower-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.kb-flower-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px;
  border-radius: 14px;
  border: 2px solid var(--border);
  background: var(--bg-base);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}
.kb-flower-option:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
  transform: translateY(-3px);
}
.kb-flower-option.selected {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.12);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}
.kb-flower-option-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12));
}
.kb-flower-option-label {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.2;
}
.kb-flower-confirm-btn {
  width: 100%;
  padding: 14px;
  border-radius: 50px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  border: none;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.kb-flower-confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(76, 175, 80, 0.5);
}
.kb-flower-confirm-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ── Reflection Already Done Warning ── */
.kb-reflection-warning {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 32px 24px;
  max-width: 380px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.kb-reflection-warning-icon {
  font-size: 3.5rem;
  line-height: 1;
}

.kb-reflection-warning-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
}

.kb-reflection-warning-message {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-top: 8px;
}

.kb-reflection-warning-btn {
  width: 100%;
  padding: 12px 24px;
  margin-top: 8px;
  border-radius: 50px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  border: none;
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}

.kb-reflection-warning-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(76, 175, 80, 0.5);
}

.kb-reflection-warning-btn:active {
  transform: translateY(0);
}

/* ── Flower Collection FAB (bottom left) ── */
.kb-collection-fab {
  position: fixed;
  bottom: 88px;
  left: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: transform 0.18s, box-shadow 0.18s;
  animation: collection-glow 2.5s ease-in-out infinite;
}
.kb-collection-fab:hover {
  transform: scale(1.12);
  box-shadow: 0 10px 28px rgba(245, 158, 11, 0.65);
}
@keyframes collection-glow {
  0%, 100% { box-shadow: 0 6px 20px rgba(245,158,11,0.5); }
  50% { box-shadow: 0 6px 28px rgba(245,158,11,0.8), 0 0 16px rgba(245,158,11,0.3); }
}
.kb-collection-fab-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}
.kb-collection-fab-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

/* Collection bubble */
.kb-collection-bubble {
  background: linear-gradient(135deg, #fef3c7, #fde68a) !important;
  color: #78350f !important;
  cursor: pointer;
  border: 1.5px solid #f59e0b;
}
.kb-collection-bubble:hover {
  background: linear-gradient(135deg, #fde68a, #fcd34d) !important;
}

/* Collection button pop transition */
.collection-btn-pop-enter-active, .collection-btn-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.collection-btn-pop-enter-from, .collection-btn-pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

/* Collection bubble pop transition */
.collection-bubble-pop-enter-active, .collection-bubble-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.collection-bubble-pop-enter-from, .collection-bubble-pop-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(8px);
}

/* ── Flower Collection Popup ── */
.kb-collection-popup {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 24px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 85vh;
  overflow-y: auto;
}
.kb-collection-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kb-collection-popup-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
}
.kb-collection-popup-subtitle {
  font-size: 0.82rem;
  color: var(--text-secondary);
  margin: -6px 0 0;
}
.kb-collection-progress-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.kb-collection-progress-track {
  flex: 1;
  height: 10px;
  background: var(--bg-base);
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid var(--border);
}
.kb-collection-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fcd34d);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.34, 1.2, 0.64, 1);
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
}
.kb-collection-progress-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-secondary);
  min-width: 32px;
  text-align: right;
}
.kb-collection-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
@media (max-width: 768px) {
  .kb-collection-popup {
    max-width: 100%;
    padding: 20px 16px;
    box-sizing: border-box;
  }
  .kb-collection-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
}
.kb-collection-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  position: relative;
}
.kb-collection-slot-inner {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}
.kb-collection-slot-owned .kb-collection-slot-inner {
  background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(252,211,77,0.2));
  border: 2px solid rgba(245,158,11,0.4);
  box-shadow: 0 4px 14px rgba(245,158,11,0.2);
  animation: flower-appear 0.5s cubic-bezier(0.34,1.4,0.64,1) both;
}
.kb-collection-slot-locked .kb-collection-slot-inner {
  background: var(--bg-base);
  border: 2px dashed var(--border);
  opacity: 0.5;
}
.kb-collection-slot-owned:hover .kb-collection-slot-inner {
  transform: translateY(-4px) scale(1.08);
}
.kb-collection-flower-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}
.kb-collection-locked-icon {
  font-size: 1.2rem;
  opacity: 0.4;
}
.kb-collection-flower-name {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.2;
}
.kb-collection-owned-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.55rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.kb-collection-hint {
  font-size: 0.78rem;
  color: var(--text-secondary);
  text-align: center;
  font-style: italic;
  line-height: 1.5;
  background: var(--bg-base);
  border-radius: 10px;
  padding: 8px 12px;
}
</style>