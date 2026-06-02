import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(express.json());

  app.post("/api/gemini/analyze", async (req, res) => {
    const { prompt, systemInstruction } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined
      });
      
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze with Gemini" });
    }
  });

  // Mock Market Data Endpoint
  app.get("/api/market/history", (req, res) => {
    const data = [];
    let price = 890;
    const now = new Date();
    
    for (let i = 60; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      const open = price + (Math.random() * 4 - 2);
      const high = open + Math.random() * 3;
      const low = open - Math.random() * 3;
      const close = (high + low) / 2 + (Math.random() * 2 - 1);
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });
      price = close;
    }
    res.json(data);
  });

  // Alpha Terminal Intelligence Engine Endpoint
  app.get("/api/alpha/status", async (req, res) => {
    try {
      // Simulation of the Intelligence Engine logic
      // In a production environment, this would call a Python microservice 
      // or use a Node-based ML library like 'ml-hmm'
      
      const symbols = ["BTC-USD", "ETH-USD", "NVDA", "TSLA", "AAPL"];
      const symbol = (req.query.symbol as string) || "BTC-USD";
      
      // Simulate regime detection (0: Bull, 1: Bear, 2: Volatile, 3: Accumulation)
      const regimes = [0, 1, 2, 3];
      const currentRegime = regimes[Math.floor(Math.random() * regimes.length)];
      
      // Simulate confidence score
      const confidence = 0.75 + Math.random() * 0.2;
      
      // Simulate orderbook imbalance (-1.0 to 1.0)
      const imbalance = (Math.random() * 2) - 1;
      
      // Signal Logic (Mirroring the Python prototype)
      let signal = "NEUTRAL";
      if (currentRegime === 0 && imbalance > 0.2) signal = "LONG";
      else if (currentRegime === 1 && imbalance < -0.2) signal = "SHORT";
      else if (currentRegime === 2) signal = "VOLATILITY_STRATEGY";
      else if (currentRegime === 3) signal = "ACCUMULATION_MONITOR";

      res.json({
        symbol,
        regime: currentRegime,
        confidence: parseFloat(confidence.toFixed(2)),
        orderbook_imbalance: parseFloat(imbalance.toFixed(2)),
        signal,
        timestamp: new Date().toISOString(),
        engine_status: "active"
      });
    } catch (error) {
      res.status(500).json({ error: "Intelligence Engine failure" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AlphaFlow Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
