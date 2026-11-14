import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "EDU RESEARCH AI × SHARE" }));

app.post("/api/analyze", async (req, res) => {
  try {
    const { researchTitle, researchQuestion, subject, method, data } = req.body || {};
    if (!researchTitle || !data) return res.status(400).json({ error: "Зерттеу атауы мен деректер қажет." });
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "GEMINI_API_KEY серверде бапталмаған. хостингтің серверлік Environment Variables бөліміне GEMINI_API_KEY қосыңыз." });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Сен білім беру саласындағы зерттеу әдіснамасы бойынша ассистентсің.
Тек берілген деректерге сүйен. Дерек жетіспесе, оны ашық көрсет. Себеп-салдарлық байланыс бар деп дәлелсіз тұжырымдама.
Оқушылардың аты-жөнін, ЖСН, телефон, мекенжай және өзге жеке деректерді талдама; мәтінде байқалса, оларды елеме.
Зерттеу атауы: ${researchTitle}
Пәні: ${subject || "көрсетілмеген"}
Зерттеу сұрағы: ${researchQuestion || "көрсетілмеген"}
Әдісі: ${method || "көрсетілмеген"}
Деректер (жиынтық/анонимделген): ${JSON.stringify(data)}
Қазақ тілінде мына бөлімдермен жауап бер:
1. Қысқаша деректер сипаттамасы
2. Байқалған үрдістер (тек дерекпен расталған)
3. Мүмкін түсіндірмелер және балама түсіндірмелер
4. Зерттеу сұрағына қатысты алдын ала қорытынды
5. Деректердің шектеулері
6. Мұғалімге арналған келесі 3 қадам
7. Есепте көрсетуге болатын бейтарап тұжырым.
Бұл талдау мұғалімнің кәсіби шешімін алмастырмайтынын ескерт.`;
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: { temperature: 0.3 }
    });
    res.json({ analysis: response.text || "Талдау мәтіні алынбады." });
  } catch (err) {
    console.error("Gemini analysis error:", err);
    res.status(500).json({ error: "AI талдау кезінде қате пайда болды. Сервер журналын тексеріңіз." });
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "../dist");
app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
app.listen(PORT, () => console.log(`EDU RESEARCH AI × SHARE: http://localhost:${PORT}`));
