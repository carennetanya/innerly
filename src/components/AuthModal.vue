<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="auth-overlay" @click.self="close">
      <div class="auth-modal" :class="{ 'is-dark': isDark }">

        <!-- Tab switcher -->
        <div class="auth-tabs">
          <button
            class="auth-tab"
            :class="{ active: !isLogin }"
            @click="
              isLogin = false;
              error = '';
            "
          >
            Register
          </button>
          <button
            class="auth-tab"
            :class="{ active: isLogin }"
            @click="
              isLogin = true;
              error = '';
            "
          >
            Sign In
          </button>
        </div>

        <div class="auth-header">
          <h2>
            {{ isLogin ? "Welcome Back 👋" : "Create Your Innerly Account 🌱" }}
          </h2>
          <p>
            {{
              isLogin
                ? "Sign in to continue your journey"
                : "Save your garden and track your growth over time"
            }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div v-if="!isLogin" class="form-group">
            <label>Name</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Your name"
              required
            />
          </div>

          <div v-if="!isLogin" class="form-group">
            <label>Username</label>
            <input
              v-model="formData.username"
              type="text"
              placeholder="your_username"
              required
              pattern="[a-zA-Z0-9_]+"
              title="Letters, numbers, and underscores only"
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
            />
          </div>

          <div v-if="!isLogin" class="form-group">
            <label>Confirm Password</label>
            <input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minlength="6"
            />
          </div>

          <div v-if="error" class="auth-error">{{ error }}</div>

          <button type="submit" class="auth-submit" :disabled="loading">
            {{ loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account" }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button
              @click="
                isLogin = !isLogin;
                error = '';
              "
              class="auth-toggle"
            >
              {{ isLogin ? "Register" : "Sign In" }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { authService } from "../services/auth.js";

const props = defineProps({
  visible: Boolean,
  isDark: Boolean,
  initialMode: {
    type: String,
    default: "register",
  },
});

const emit = defineEmits(["close", "success"]);

const isLogin = ref(props.initialMode === "login");
const loading = ref(false);
const error = ref("");

watch(
  () => props.initialMode,
  (v) => {
    isLogin.value = v === "login";
  },
);

const formData = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const close = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  formData.name = "";
  formData.username = "";
  formData.email = "";
  formData.password = "";
  formData.confirmPassword = "";
  error.value = "";
};

const handleSubmit = async () => {
  error.value = "";

  // Client-side validation for register
  if (!isLogin.value) {
    if (!formData.username.trim()) {
      error.value = "Username cannot be empty.";
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      error.value = "Username can only contain letters, numbers, and underscores.";
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      error.value = "Passwords do not match.";
      return;
    }
  }

  loading.value = true;

  try {
    let data;

    if (isLogin.value) {
      data = await authService.login(formData.email, formData.password);
    } else {
      data = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.username,
      );
    }

    authService.saveToken(data.token);
    authService.saveUser(data.user);

    emit("success", data.user);
    close();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 10, 60, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.auth-modal {
  background: #faf8ff;
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 24px 72px rgba(80, 40, 180, 0.22),
    0 2px 10px rgba(80, 40, 180, 0.08);
  border: 1px solid rgba(160, 120, 250, 0.15);
  scrollbar-width: none;
}
.auth-modal::-webkit-scrollbar {
  display: none;
}

.auth-modal.is-dark {
  background: #0f0b1e;
  border-color: rgba(167, 139, 250, 0.18);
  color: #ede8ff;
}



/* Tabs */
.auth-tabs {
  display: flex;
  background: rgba(124, 108, 168, 0.08);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
  gap: 4px;
}
.auth-tab {
  flex: 1;
  padding: 9px;
  border-radius: 9px;
  border: none;
  background: transparent;
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(100, 80, 160, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}
.auth-tab.active {
  background: white;
  color: #5b4a9a;
  box-shadow: 0 2px 8px rgba(80, 40, 160, 0.12);
}
.is-dark .auth-tab {
  color: rgba(180, 160, 255, 0.4);
}
.is-dark .auth-tab.active {
  background: rgba(167, 139, 250, 0.15);
  color: #c4b5fd;
  box-shadow: none;
}

.auth-header {
  text-align: center;
  margin-bottom: 22px;
}
.auth-header h2 {
  margin: 0 0 6px;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d1f6e;
  line-height: 1.3;
}
.is-dark .auth-header h2 {
  color: #e8d8ff;
}
.auth-header p {
  margin: 0;
  color: rgba(80, 60, 140, 0.6);
  font-size: 0.82rem;
  font-family: "Outfit", sans-serif;
  line-height: 1.5;
}
.is-dark .auth-header p {
  color: rgba(180, 160, 255, 0.55);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(80, 60, 140, 0.65);
  font-family: "Outfit", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.is-dark .form-group label {
  color: rgba(180, 160, 255, 0.5);
}

.form-group input {
  padding: 12px 16px;
  border: 1.5px solid rgba(124, 108, 168, 0.2);
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: "Outfit", sans-serif;
  background: rgba(255, 255, 255, 0.7);
  color: #2d1f6e;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;
}
.form-group input::placeholder {
  color: rgba(100, 80, 160, 0.35);
}
.form-group input:focus {
  border-color: #7c6ca8;
  box-shadow: 0 0 0 3px rgba(124, 108, 168, 0.12);
}
.is-dark .form-group input {
  background: rgba(30, 20, 50, 0.7);
  border-color: rgba(167, 139, 250, 0.2);
  color: #e8d8ff;
}
.is-dark .form-group input:focus {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.12);
}

.auth-error {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-family: "Outfit", sans-serif;
  border: 1px solid rgba(220, 38, 38, 0.15);
}
.is-dark .auth-error {
  background: rgba(220, 38, 38, 0.1);
  color: #f87171;
}

.auth-submit {
  background: linear-gradient(135deg, #5b4a9a 0%, #9333ea 100%);
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 50px;
  font-family: "Outfit", sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.22s ease;
  box-shadow: 0 6px 22px rgba(147, 51, 234, 0.3);
  margin-top: 4px;
}
.auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(147, 51, 234, 0.42);
  filter: brightness(1.06);
}
.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 0.82rem;
  color: rgba(80, 60, 140, 0.5);
  font-family: "Outfit", sans-serif;
}
.is-dark .auth-footer {
  color: rgba(180, 160, 255, 0.4);
}
.auth-toggle {
  background: none;
  border: none;
  color: #7c6ca8;
  font-weight: 700;
  cursor: pointer;
  margin-left: 4px;
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
}
.auth-toggle:hover {
  text-decoration: underline;
  color: #5b4a9a;
}
.is-dark .auth-toggle {
  color: #a78bfa;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .auth-modal {
  transition: transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.modal-fade-enter-from {
  opacity: 0;
}
.modal-fade-enter-from .auth-modal {
  transform: scale(0.9) translateY(16px);
}
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .auth-overlay {
    padding: 16px;
  }

  .auth-modal {
    padding: 20px 18px;
    border-radius: 20px;
    max-height: 92vh;
  }

  .auth-tabs {
    margin-bottom: 14px;
  }

  .auth-header {
    margin-bottom: 14px;
  }

  .auth-header h2 {
    font-size: 1.05rem;
  }

  .auth-header p {
    font-size: 0.75rem;
  }

  .auth-form {
    gap: 10px;
  }

  .form-group label {
    font-size: 0.65rem;
  }

  .form-group input {
    padding: 9px 12px;
    font-size: 0.82rem;
  }

  .auth-submit {
    padding: 11px;
    font-size: 0.88rem;
  }

  .auth-footer {
    margin-top: 10px;
    font-size: 0.72rem;
  }
}
</style>