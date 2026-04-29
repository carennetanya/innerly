const API_URL = "/api/commitment";

export const commitmentService = {
  async saveCommitment(userId, { date, action, moodImg, mood }) {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, action, moodImg, mood }),
    });
    if (!response.ok) throw new Error("Failed to save commitment");
    return response.json();
  },

  async getToday(userId, date) {
    const response = await fetch(`${API_URL}/${userId}/today?date=${date}`);
    if (!response.ok) return null;
    return response.json();
  },

  async markDone(userId, id) {
    const response = await fetch(`${API_URL}/${userId}/${id}/done`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to mark done");
    return response.json();
  },
};