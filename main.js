const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let currentGame = null;

// Simple loader for game modules
const games = {
    pong: () => import('./games/pong.js'),
    'tap-race': () => import('./games/tap-race.js')
};

document.getElementById('menu').addEventListener('click', async (e) => {
    const key = e.target.dataset.game;
    if (!key) return;
    const mod = await games[key]();
    if (currentGame && currentGame.destroy) currentGame.destroy();
    currentGame = mod.createGame({ canvas, ctx });
});
