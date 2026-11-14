# EFUP · Hub

**Eliminate Fear, Unleash Potential** — a small static site built from a folder of ~1,300 raw personal notes
(voice-memo transcripts, journal entries, reflections on Vipassana, AI, ego, and a zero-profit economy).

The notes are *not* included here. This repo turns their **ideas** into tiny, doable web tools.

## Apps

| App | Built from |
|---|---|
| 🌬️ Present-Moment Reminder | "Trust the present. Welcome it." |
| 🪜 Ask Why (5-Whys) | "Ask why — and don't stop." |
| 🎛️ Reward Dial | Reinforcement-learning → addiction → equanimous zero |
| 🛒 Zero-Profit Calculator | The zero-profit grocery store / EFUP |
| 🚪 The Open Store (game) | "A game of zero profit": open door, voluntary help, surplus refunded on receipts — with the assumptions on sliders (`node apps/open-store-model.test.js` checks the arithmetic) |
| 🪞 Ego Reframe | "Reality happens irrespective of the ego." |
| 🧭 Idea Compass | "Find your people" / alignment matrix |
| 📻 My Media Feed | Personal podcast-style feed from scattered notes |
| 🎙️ Voice-to-Idea Notepad | Audio → AI → small verifiable chunks |
| ♾️ Mantra Rotator | Ambient rotation of distilled lines |

Everything runs **100% client-side** — no backend, no accounts, no API keys shipped.
Personal data (your reminders, people, reward sources) is saved only in your own browser via `localStorage`.

## Run locally

It's plain static HTML/CSS/JS. Just open `index.html`, or:

```bash
npx serve .
```

## Deploy

GitHub Actions publishes to GitHub Pages on every push to `main`.
In the repo settings → **Pages → Build and deployment → Source**, choose **GitHub Actions**.

## Note

The source notes contained what looked like real API keys. Those were **not** copied into this repo —
the owner should rotate them immediately.
