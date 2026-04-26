<template>
  <Transition name="modal-fade">
    <div v-if="visible" class="auth-overlay" @click.self="close">
      <div class="auth-modal" :class="{ 'is-dark': isDark }">
        <button class="auth-close" @click="close">×</button>

        <div class="auth-header">
          <h2>{{ isLogin ? "Welcome Back" : "Create Account" }}</h2>
          <p>
            {{
              isLogin
                ? "Sign in to continue your journey"
                : "Start your journaling journey"
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

          <div v-if="error" class="auth-error">{{ error }}</div>

          <button type="submit" class="auth-submit" :disabled="loading">
            {{
              loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"
            }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            {{
              isLogin ? "Don't have an account?" : "Already have an account?"
            }}
            <button @click="toggleMode" class="auth-toggle">
              {{ isLogin ? "Sign Up" : "Sign In" }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from "vue";
import { authService } from "../services/auth.js";

const props = defineProps({
  visible: Boolean,
  isDark: Boolean,
  initialMode: {
    type: String,
    default: "login",
  },
});

const emit = defineEmits(["close", "success"]);

const isLogin = ref(props.initialMode === "login");
const loading = ref(false);
const error = ref("");

const formData = reactive({
  name: "",
  email: "",
  password: "",
});

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = "";
};

const close = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  formData.name = "";
  formData.email = "";
  formData.password = "";
  error.value = "";
};

const handleSubmit = async () => {
  error.value = "";
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
      );
    }

    // Save token and user
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-modal {
  background: #faf8f5;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.auth-modal.is-dark {
  background: #1a1a1a;
  color: #fff;
}

.auth-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-header h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
}

.auth-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.is-dark .auth-header p {
  color: #999;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.is-dark .form-group label {
  color: #ccc;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #8b7355;
}

.is-dark .form-group input {
  background: #2a2a2a;
  border-color: #444;
  color: #fff;
}

.is-dark .form-group input:focus {
  border-color: #a08060;
}

.auth-error {
  background: #fee;
  color: #c00;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}

.is-dark .auth-error {
  background: #3a2020;
  color: #f88;
}

.auth-submit {
  background: #8b7355;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.auth-submit:hover:not(:disabled) {
  background: #6d5a45;
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.is-dark .auth-footer {
  color: #999;
}

.auth-toggle {
  background: none;
  border: none;
  color: #8b7355;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
}

.auth-toggle:hover {
  text-decoration: underline;
}

/* Transition animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
