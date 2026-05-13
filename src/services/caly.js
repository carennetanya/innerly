// Caly AI Service - Empathetic reflection companion
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_INSTRUCTION = `Kamu adalah Caly, seorang teman yang empati dan penuh pengertian yang membantu seseorang merefleksikan pengalaman mereka. 

PERSONA:
- Tenang, empati, dan tidak menggurui
- Mendengarkan dengan hati, tidak moralisir
- Mengajukan pertanyaan terbuka yang mendalam namun lembut
- Menggunakan bahasa informal dan hangat seperti teman dekat
- Validasi perasaan mereka dan tunjukkan pemahaman

GAYA KOMUNIKASI:
- Respon singkat tapi cukup jelas (1-3 kalimat), natural, dan conversational
- Jangan memberikan nasihat langsung kecuali diminta
- Gunakan ekspresi empati: "Wah...", "Aku ngerti...", "Itu berat ya..."
- Tanya satu pertanyaan follow-up yang relevan untuk membantu mereka menggali lebih dalam
- Jangan terlalu formal atau terasa seperti AI

CONTOH RESPONS:
- User: "Presentasi saya jelek, semua tertawa."
- Caly: "Wah, kedengarannya intens ya. Pas kejadian itu, apa yang sebenarnya kamu rasakan?"

Respon kamu harus SELALU dalam bahasa Indonesia dan terasa natural, seperti percakapan dengan teman.`;

export const calyService = {
  async sendMessage(userMessage, conversationHistory = []) {
    if (!GEMINI_API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY is not configured");
    }

    try {
      // Build message history - convert from our format to Gemini format
      const contents = [];
      
      // Add previous conversation
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.text || (msg.parts?.[0]?.text) || "" }],
          });
        });
      }
      
      // Add current user message
      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const requestBody = {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: contents,
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
      };

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Gemini API error response:", error);
        throw new Error(error.error?.message || "Failed to get response from Caly");
      }

      const data = await response.json();
      const calyResponse =
        data.candidates?.[0]?.content?.parts
          ?.map((part) => part?.text || "")
          .join("") ||
        "Aku sedang memikirkan hal ini... bisa coba lagi?";

      return {
        role: "assistant",
        text: calyResponse,
      };
    } catch (error) {
      console.error("Caly API error:", error);
      throw error;
    }
  },

  // Generate initial response based on user's description
  async getInitialResponse(description) {
    if (!GEMINI_API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY is not configured");
    }

    try {
      const prompt = `Pengguna baru saja menceritakan pengalaman mereka. Berdasarkan cerita ini, berikan respons empati awal dari Caly yang menunjukkan bahwa kamu mengerti, dan ajukan satu pertanyaan follow-up yang dalam namun lembut.

Cerita mereka:
"${description}"

Ingat: Respon singkat tapi cukup jelas (1-3 kalimat), natural, empati, dan HANYA dalam bahasa Indonesia. Jangan memberikan analisis atau nasihat.`;

      const requestBody = {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
      };

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Gemini API error response:", error);
        throw new Error(error.error?.message || "Failed to get initial response");
      }

      const data = await response.json();
      const calyResponse =
        data.candidates?.[0]?.content?.parts
          ?.map((part) => part?.text || "")
          .join("") ||
        "Wah, terima kasih sudah berbagi cerita ini denganku. Apa perasaan terbesar yang kamu alami?";

      return calyResponse;
    } catch (error) {
      console.error("Caly initial response error:", error);
      throw error;
    }
  },
};
