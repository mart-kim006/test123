import "./style.css";
import { PARS, SUGGESTED_NAMES, load, save, addPlayer, total, toPar, formatToPar } from "./state.js";
import { renderStats } from "./stats.js";

const state = load();
const app = document.getElementById("app");

function render() {
  const hole = state.hole;
  app.innerHTML = `
    <header>
      <h1>Golf Score</h1>
    </header>
    <nav class="tabs">
      <button id="tab-card" class="${state.view === "stats" ? "" : "active"}" aria-label="Scorecard tab">Scorecard</button>
      <button id="tab-stats" class="${state.view === "stats" ? "active" : ""}" aria-label="Stats tab">Stats</button>
    </nav>
    ${state.view === "stats" ? `<section class="stats">${renderStats(state.players, escape)}</section>` : scorecard(hole)}
  `;
}

function scorecard(hole) {
  return `
    <section class="hole">
      <button id="prev-hole" aria-label="Previous hole" ${hole === 0 ? "disabled" : ""}>‹</button>
      <div>
        <div id="hole-number" class="hole-number">Hole ${hole + 1}</div>
        <div class="par">Par ${PARS[hole]}</div>
      </div>
      <button id="next-hole" aria-label="Next hole" ${hole === PARS.length - 1 ? "disabled" : ""}>›</button>
    </section>
    <ul class="players">
      ${state.players
        .map(
          (p, i) => `
        <li class="player">
          <div class="name">${escape(p.name)}<small>Total ${total(p)} · <b class="${toParClass(toPar(p))}">${formatToPar(toPar(p))}</b></small></div>
          <button id="minus-${i}" data-minus="${i}" aria-label="Minus ${escape(p.name)}">−</button>
          <span id="score-${i}" class="score ${p.scores[hole] == null ? "" : toParClass(p.scores[hole] - PARS[hole])}">${p.scores[hole] ?? "–"}</span>
          <button id="plus-${i}" data-plus="${i}" aria-label="Plus ${escape(p.name)}">+</button>
        </li>`,
        )
        .join("")}
    </ul>
    <form id="add-player-form" class="add">
      <input id="player-name" placeholder="Player name" autocomplete="off" />
      <button id="add-player" type="submit">Add</button>
    </form>
    ${suggestions()}`;
}

function suggestions() {
  const taken = new Set(state.players.map((p) => p.name.toLowerCase()));
  const names = SUGGESTED_NAMES.filter((n) => !taken.has(n.toLowerCase()));
  if (!names.length) return "";
  return `<div class="suggest">${names
    .map((n) => `<button data-suggest="${n}" aria-label="Add ${n}">+ ${n}</button>`)
    .join("")}</div>`;
}

function toParClass(diff) {
  if (diff < 0) return "under";
  if (diff > 0) return "over";
  return "even";
}

function escape(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

function update() {
  save(state);
  render();
}

app.addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.id === "tab-card") state.view = "card";
  else if (t.id === "tab-stats") state.view = "stats";
  else if (t.id === "prev-hole") state.hole--;
  else if (t.id === "next-hole") state.hole++;
  else if (t.dataset.suggest) addPlayer(state, t.dataset.suggest);
  else if (t.dataset.plus) {
    const p = state.players[t.dataset.plus];
    p.scores[state.hole] = (p.scores[state.hole] ?? PARS[state.hole]) + 1;
  } else if (t.dataset.minus) {
    const p = state.players[t.dataset.minus];
    p.scores[state.hole] = Math.max(1, (p.scores[state.hole] ?? PARS[state.hole]) - 1);
  } else return;
  update();
});

app.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("player-name");
  const name = input.value.trim();
  if (!name) return;
  addPlayer(state, name);
  update();
});

render();
