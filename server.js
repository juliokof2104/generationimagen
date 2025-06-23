import express from "express";
import cors from "cors";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "https://generationimagen.onrender.com"
}));

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

app.post("/api/generar", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          width: 512,
          height: 512,
          samples: 1,
          cfg_scale: 7,
          style_preset: "anime",
        }),
      }
    );

    const json = await response.json();

    if (json.artifacts?.[0]?.base64) {
      const img = json.artifacts[0].base64;
      res.json({ image: `data:image/png;base64,${img}` });
    } else {
      console.error("❌ Error en la respuesta:", json);
      res.status(500).json({ error: "No se pudo generar la imagen." });
    }
  } catch (error) {
    console.error("❌ Error del servidor:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// (opcional) para consultar tus motores disponibles
app.get("/api/engines", async (req, res) => {
  try {
    const response = await fetch("https://api.stability.ai/v1/engines/list", {
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Error al obtener engines:", error);
    res.status(500).json({ error: "No se pudieron obtener los engines" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
