import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/enhance", async (req, res) => {
  const { wish } = req.body;

  if (!wish) return res.status(400).json({ error: "Thiếu lời chúc." });

  try {
    const prompt = `
      Dựa trên lời chúc gốc sau đây: "${wish}", hãy viết lại nó theo 3 phong cách khác nhau để gửi tặng thầy cô nhân ngày 20/11:
      1. **Văn thơ:** (bay bổng)
      2. **Trang trọng:** (chân thành)
      3. **Gần gũi:** (thân mật)
      Yêu cầu: Trả về 3 lời chúc, mỗi lời bắt đầu bằng "1.", "2.", "3.", không thêm lời giải thích.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Bạn là AI chuyên viết lời chúc cảm động." },
          { role: "user", content: prompt }
        ],
      })
    });

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
