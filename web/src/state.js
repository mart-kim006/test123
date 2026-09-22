const KEY = "golf-score:v1";
export const PARS = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 3, 4, 5, 4, 4, 3, 4, 5];

export function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && Array.isArray(saved.players)) return saved;
  } catch {}
  return { hole: 0, players: [] };
}

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function addPlayer(state, name) {
  state.players.push({ name, scores: Array(PARS.length).fill(null) });
}

export function total(player) {
  return player.scores.reduce((sum, s) => sum + (s ?? 0), 0);
}
