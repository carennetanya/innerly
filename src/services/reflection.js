const API_URL = "/api/reflections";

export const reflectionService = {
  async getReflections(userId) {
    const response = await fetch(`${API_URL}/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch reflections");
    }
    return response.json();
  },

  async saveReflection(userId, data) {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to save reflection");
    }
    return response.json();
  },

  async deleteReflection(userId, date) {
    const response = await fetch(`${API_URL}/${userId}/${date}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete reflection");
    }
    return response.json();
  },
};