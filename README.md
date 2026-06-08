# Nexus Analytics — SaaS Dashboard

A production-grade SaaS analytics dashboard built with Next.js 14, TypeScript, TailwindCSS, React Query, Zustand, Recharts, and AI-powered insights via GapGPT API.

---

## ✨ Features

- **Real-time Metrics** — MRR, ARR, Active Users, Churn Rate, Conversion Rate and more
- **Interactive Charts** — Revenue trends, User growth, Plan distribution, Feature usage (Recharts)
- **AI Assistant** — Contextual SaaS insights powered by GapGPT (OpenAI-compatible API)
- **Customer Management** — Searchable, filterable customer table with status badges
- **Reports** — Generated reports with download support
- **Settings** — Profile, notifications, billing, team, API keys management
- **Bilingual UI** — Full English / Persian (RTL) support via next-intl
- **Dark / Light Mode** — Persistent theme via next-themes
- **Collapsible Sidebar** — Smooth animated layout
- **Skeleton Loading** — Every data state covered with loading skeletons

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + CSS Variables |
| State Management | Zustand |
| Server State / Cache | TanStack React Query v5 |
| Charts | Recharts |
| AI Integration | GapGPT API (OpenAI-compatible) |
| Internationalization | next-intl |
| Theme | next-themes |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/saas-analytics-dashboard.git
cd saas-analytics-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your GROQ API key:

```env
GROQ_API_KEY=gapgpt_api_key_here
```

> Get your API key from [console.groq.com](https://console.groq.com/keys)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 AI Assistant

The AI assistant is powered by GROQ and has full context of your dashboard metrics. It can:

- Analyze revenue trends and growth drivers
- Explain churn patterns and risk factors
- Forecast future MRR based on current trajectory
- Suggest actionable improvements for your SaaS

> **Note:** The architecture uses OpenAI-compatible API format. Switching to direct OpenAI API requires only changing the base URL and API key in `src/app/api/chat/route.ts`.

---

## 🌐 Internationalization

Switch between English and Persian (فارسی) using the language toggle in the topbar. Persian mode automatically applies RTL layout. Language preference is persisted via cookie.

---

## 🎨 Design System

- **Font:** DM Sans (EN) / Vazirmatn (FA)
- **Colors:** CSS custom properties with full dark/light mode support
- **Radius:** Consistent 10px border radius across components
- **Motion:** Framer Motion for panel animations, CSS keyframes for micro-interactions

---

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checker
```

---

## 🚢 Deployment

Deploy instantly on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://saas-dashboard-with-ai-assistant.vercel.app)

Remember to add `GROQ_API_KEY` to your Vercel environment variables.

---

## 📄 License

MIT
