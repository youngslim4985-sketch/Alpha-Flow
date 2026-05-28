
# Alpha-Flow

**Alpha Terminal Intelligence Engine** — A quantitative trading microservice for regime detection, order-book analysis, and alpha signal generation.

Powering the next generation of intelligent trading terminals.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

---

## ✨ Overview

Alpha-Flow is an intelligent trading analytics engine designed to provide real-time market regime detection, order flow analysis, and actionable alpha signals. It serves as the backend intelligence layer for modern trading terminals.

### Key Features

- **Market Regime Detection** — Identifies Bull, Bear, Volatile, and Accumulation phases
- **Order Book Analysis** — Real-time imbalance and liquidity analysis
- **Alpha Signal Generation** — Confidence-weighted trading signals
- **Live Market Data Visualization** — Candlestick charts with regime overlays
- **AI-Powered Insights** — Integrated with Google Gemini for natural language market analysis
- **Scalable Microservice Architecture** — Built for high-frequency trading environments

---

## 🚀 Live Demo

[alpha-flow-eta.vercel.app](https://alpha-flow-eta.vercel.app)

---

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS + Recharts
- **Backend**: Express.js + TypeScript
- **AI Integration**: Google Gemini (`@google/genai`)
- **Messaging**: NATS (for future microservices)
- **Styling**: Tailwind CSS + Lucide Icons
- **Data Visualization**: Recharts

---

## 📦 Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/youngslim4985-sketch/Alpha-Flow.git
   cd Alpha-Flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   Add your Gemini API key in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
Alpha-Flow/
├── src/
│   ├── components/          # React components
│   ├── lib/                 # Utilities and API clients
│   ├── types/               # TypeScript definitions
│   ├── migration/           # Database migrations
│   ├── App.tsx
│   └── main.tsx
├── db/                      # Database related files
├── server.ts                # Express backend server
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint                    | Description                        |
|--------|----------------------------|------------------------------------|
| GET    | `/api/health`              | Health check                       |
| GET    | `/api/market/history`      | Mock historical market data        |
| GET    | `/api/alpha/status`        | Alpha engine status & signals      |

---

## 🎯 Roadmap

- [ ] Real-time WebSocket market data
- [ ] Advanced regime detection ML models
- [ ] Order book depth visualization
- [ ] Backtesting engine
- [ ] Multi-symbol correlation analysis
- [ ] Python microservice integration (for heavy ML)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ⚠️ Disclaimer

This software is for **educational and research purposes only**. It does not constitute financial advice. Trading involves significant risk of loss.

---

**Made with ❤️ for the quant trading community**
```

---

Just copy the content above and replace the existing `README.md` in your repository. Would you like me to also create a more technical version or add badges for specific features?
