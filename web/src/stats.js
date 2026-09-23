import { PARS, total, toPar, formatToPar } from "./state.js";

export function playerStats(player) {
  const played = player.scores
    .map((s, i) => ({ hole: i, score: s, diff: s == null ? null : s - PARS[i] }))
    .filter((h) => h.score != null);
  const count = (pred) => played.filter((h) => pred(h.diff)).length;
  const best = played.reduce((b, h) => (b == null || h.diff < b.diff ? h : b), null);
  return {
    thru: played.length,
    total: total(player),
    toPar: toPar(player),
    average: played.length ? total(player) / played.length : 0,
    birdies: count((d) => d <= -1),
    pars: count((d) => d === 0),
    bogeys: count((d) => d === 1),
    doubles: count((d) => d >= 2),
    best,
  };
}

export function leaderboard(players) {
  return players
    .map((p) => ({ name: p.name, ...playerStats(p) }))
    .sort((a, b) => a.toPar - b.toPar || b.thru - a.thru);
}

export function renderStats(players, escape) {
  if (!players.length) return `<p class="empty">Add players to see stats.</p>`;
  return leaderboard(players)
    .map((s, rank) => {
      const bar = [
        ["birdie", s.birdies],
        ["par", s.pars],
        ["bogey", s.bogeys],
        ["double", s.doubles],
      ]
        .filter(([, n]) => n)
        .map(([k, n]) => `<span class="seg ${k}" style="flex:${n}"></span>`)
        .join("");
      return `
      <article class="stat-card">
        <div class="stat-head">
          <span class="rank">${rank + 1}</span>
          <span class="stat-name">${escape(s.name)}</span>
          <span class="stat-topar ${s.toPar < 0 ? "under" : s.toPar > 0 ? "over" : "even"}">${formatToPar(s.toPar)}</span>
        </div>
        <div class="stat-sub">Thru ${s.thru} · ${s.total} strokes · ${s.average.toFixed(1)} avg</div>
        <div class="dist">${bar}</div>
        <dl class="stat-grid">
          <div><dt>Birdie+</dt><dd>${s.birdies}</dd></div>
          <div><dt>Pars</dt><dd>${s.pars}</dd></div>
          <div><dt>Bogeys</dt><dd>${s.bogeys}</dd></div>
          <div><dt>Double+</dt><dd>${s.doubles}</dd></div>
        </dl>
        ${s.best ? `<div class="stat-best">Best hole: #${s.best.hole + 1} (${s.best.score} on par ${PARS[s.best.hole]})</div>` : ""}
      </article>`;
    })
    .join("");
}
