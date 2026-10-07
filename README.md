# 🎲 Yahtzee

A browser version of the classic dice game, built with React and Vite.

**▶ Play it here: https://thecanadian0417.github.io/react-yahtzee/**

## Features

- **Roll and hold.** Roll five dice, click any die to hold it, and re-roll the rest.
- **Full scorecard.** All 13 categories, from Ones through Sixes up to Full House, Straights, and Yahtzee.
- **Score previews.** Every open category shows what your current roll would score, so you can compare options before committing.
- **Scratching.** Bank a 0 in any category when nothing fits, just like the paper game.
- **Automatic totals.** Upper total, the 35-point bonus (with progress toward 63), lower total, and grand total update as you play.
- **Game over and replay.** The game ends when all 13 categories are filled, shows your final score, and lets you start fresh.
- **Table-top look.** A red felt dice tray with a wood rim, and a scorecard styled after the classic paper card.

## How to play

1. Each turn starts with a fresh roll of five dice.
2. Click a die to hold it. Held dice stay put when you roll again.
3. Roll up to 3 more times per turn (a house rule; the official game allows 2).
4. Open the scorecard and click a category to bank your score. This ends your turn.
5. Each category can only be used once. Fill all 13 to finish the game.

**Bonus:** score 63 or more in the upper section (Ones through Sixes) to earn 35 extra points.

## Scoring

| Category | Score |
| --- | --- |
| Ones – Sixes | Sum of the dice showing that number |
| Three of a Kind | Sum of all dice, if 3+ match |
| Four of a Kind | Sum of all dice, if 4+ match |
| Full House | 25 (three of one number + two of another) |
| Small Straight | 30 (four in a row) |
| Large Straight | 40 (five in a row) |
| Yahtzee | 50 (all five match) |
| Chance | Sum of all dice |

## Running locally

Requires [Node.js](https://nodejs.org/) (LTS recommended).

```bash
git clone https://github.com/thecanadian0417/yahtzee.git
cd yahtzee
npm install
npm run dev
```

Then open the local URL Vite prints in the terminal.

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

## Project structure

```
src/
  App.jsx          Game state, event handlers, and layout
  Die.jsx          A single clickable die
  game/
    dice.js        Rolling, re-rolling, and holding (pure functions)
    scoring.js     Category scoring, totals, and game-over check (pure functions)
```

Game rules live in `src/game/` as plain JavaScript with no React code, so they can be read and tested on their own. The components hold state and call into those functions.

## Deployment

Every push to `main` triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the app and publishes it to GitHub Pages.

## Built with

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- GitHub Actions + GitHub Pages
