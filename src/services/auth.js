const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${BASE}/api/auth`;

export const authService = {
  async register(name, email, password, username) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, username }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  saveToken(token) {
    localStorage.setItem("token", token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async updateEmail(newEmail) {
    console.log('[DEBUG-auth] updateEmail fetch to:', `${API_URL}/email`)
    const res = await fetch(`${API_URL}/email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ email: newEmail }),
    });
    console.log('[DEBUG-auth] response status:', res.status)
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update email");
    return data;
  },

  async updatePassword(newPassword) {
    console.log('[DEBUG-auth] updatePassword fetch to:', `${API_URL}/password`)
    const res = await fetch(`${API_URL}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });
    console.log('[DEBUG-auth] response status:', res.status)
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update password");
    return data;
  },
};
