export function createGame({ canvas, ctx }) {
    const state = {
        ball: { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 3, r: 8 },
        p1: { x: 30, y: canvas.height / 2 - 50, w: 12, h: 100 },
        p2: { x: canvas.width - 42, y: canvas.height / 2 - 50, w: 12, h: 100 },
        running: true
    };

    function drawRect(x, y, w, h, color = '#1f6feb') { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
    function drawBall() { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, state.ball.r, 0, Math.PI * 2); ctx.fill(); }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Move ball
        state.ball.x += state.ball.dx;
        state.ball.y += state.ball.dy;
        // Wall bounce
        if (state.ball.y < state.ball.r || state.ball.y > canvas.height - state.ball.r) state.ball.dy *= -1;
        // Paddle collisions
        const b = state.ball;
        const hitP1 = b.x - b.r < state.p1.x + state.p1.w && b.y > state.p1.y && b.y < state.p1.y + state.p1.h;
        const hitP2 = b.x + b.r > state.p2.x && b.y > state.p2.y && b.y < state.p2.y + state.p2.h;
        if (hitP1 || hitP2) state.ball.dx *= -1;
        // Reset if out of bounds
        if (b.x < 0 || b.x > canvas.width) Object.assign(state.ball, { x: canvas.width / 2, y: canvas.height / 2, dx: -state.ball.dx, dy: 3 });
        // Draw
        drawRect(state.p1.x, state.p1.y, state.p1.w, state.p1.h);
        drawRect(state.p2.x, state.p2.y, state.p2.w, state.p2.h);
        drawBall();
        if (state.running) requestAnimationFrame(update);
    }

    // Touch controls: left half controls P1, right half controls P2
    function onTouchMove(e) {
        for (const t of e.touches) {
            const rect = canvas.getBoundingClientRect();
            const x = t.clientX - rect.left;
            const y = t.clientY - rect.top;
            if (x < canvas.width / 2) state.p1.y = Math.max(0, Math.min(canvas.height - state.p1.h, y - state.p1.h / 2));
            else state.p2.y = Math.max(0, Math.min(canvas.height - state.p2.h, y - state.p2.h / 2));
        }
        e.preventDefault();
    }
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchstart', onTouchMove, { passive: false });

    update();

    return {
        destroy() {
            state.running = false;
            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('touchstart', onTouchMove);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
}
