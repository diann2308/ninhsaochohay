export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { wish } = req.body;
  if (!wish) {
    return res.status(400).json({ error: "Thiếu nội dung lời chúc!" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Bạn là AI chuyên viết lời chúc 20/11 cảm động và sáng tạo.",
          },
          {
            role: "user",
            content: `
              Dựa trên lời chúc gốc sau: "${wish}", hãy viết lại nó theo 3 phong cách khác nhau để gửi tặng thầy cô nhân ngày 20/11:
              1. **Văn thơ:** (bay bổng, giàu hình ảnh)
              2. **Trang trọng:** (lịch sự, chân thành)
              3. **Gần gũi:** (thân mật, đáng yêu)
              Trả về đúng 3 dòng, không kèm lời giải thích.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "Không có kết quả.";
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
