# 🛰️ Job Radar 2026: Career Intelligence Platform

High-performance career intelligence platform designed for strategic GTM and Fintech executive roles. This system automates the job hunting process using a swarm of AI agents and professional-grade web harvesting.

## 🚀 Core Intelligence Suite

- **Dual-Engine Search:** Simultaneously scans the market using the **Remotive API** (Remote-first) and **Google Strategic Search** via **Scrape.do**, bypassing anti-bot measures to find vacancies on LinkedIn, Indeed, and direct company boards.
- **DeepSeek AI Brain:** Uses DeepSeek-V3 for CV-to-Vacancy matching and tactical rewriting, ensuring high-impact applications with minimum effort.
- **Telegram Sentinel:** Automated real-time alerts sent directly to your phone for "Elite Matches" (Score > 8/10).
- **Daily Autonomous Scan:** A GitHub Action triggers a full market sweep every day at 8:00 AM CDMX, updating the vacancy database and deploying changes to production.

## 🛠️ Technology Stack

- **Frontend:** React + TailwindCSS (Tactical Glassmorphism UI).
- **Backend:** FastAPI (Serverless ready).
- **Deployment:** Vercel (Unified Monorepo).
- **Automation:** GitHub Actions.

## 📋 Environment Variables (Vercel)

To run this platform, the following secrets must be configured in Vercel:

| Variable | Description |
| --- | --- |
| `DEEPSEEK_API_KEY` | Primary AI engine for matching and optimization. |
| `SCRAPE_DO_TOKEN` | Token for professional Google/LinkedIn harvesting. |
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather for alerts. |
| `TELEGRAM_CHAT_ID` | Your personal ID from @userinfobot. |

## 📦 Project Structure

- `/backend`: Python logic, radar engine, and AI optimizers.
- `/frontend`: React dashboard and tactical UI.
- `/.github/workflows`: Daily automation scripts.
- `active_vacancies.json`: The living database of verified opportunities.

## 🛡️ Setup & Deployment

1. Connect this repo to **Vercel**.
2. Add the Environment Variables listed above.
3. Deploy.
4. The system will start fetching and alerting immediately.

---
*Developed for Antonio Gutierrez - Strategic GTM Intelligence.*
