import express from "express";
import cors from "cors";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS explícito y completo
const corsOptions = {
  origin: "https://generationimagen.onrender.com",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Importante: manejar preflight (OPTIONS) manualmente
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// Ruta principal de generación
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

// Ruta opcional para listar modelos
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

