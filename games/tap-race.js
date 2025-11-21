export function createGame({ canvas, ctx }) {
  const target = 50;
  const score = { p1: 0, p2: 0 };
  let running = true;

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#222'; ctx.fillRect(0,0,canvas.width/2,canvas.height);
    ctx.fillStyle = '#333'; ctx.fillRect(canvas.width/2,0,canvas.width/2,canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '28px system-ui';
    ctx.fillText(`P1: ${score.p1}/${target}`, 40, 50);
    ctx.fillText(`P2: ${score.p2}/${target}`, canvas.width-220, 50);
    if (!running) {
      ctx.fillText('Tap to restart', canvas.width/2 - 100, canvas.height/2 + 30);
    }
  }

  function checkWin(){
    if (score.p1 >= target || score.p2 >= target) {
      running = false;
      ctx.fillStyle = '#1f6feb';
      ctx.font = '36px system-ui';
      const msg = score.p1 >= target ? 'Player 1 Wins!' : 'Player 2 Wins!';
      ctx.fillText(msg, canvas.width/2 - 130, canvas.height/2);
    }
  }

  function onTouchStart(e){
    const rect = canvas.getBoundingClientRect();
    for (const t of e.changedTouches) {
      const x = t.clientX - rect.left;
      if (!running) { score.p1 = 0; score.p2 = 0; running = true; }
      if (x < canvas.width/2) score.p1++;
      else score.p2++;
    }
    draw(); checkWin();
    e.preventDefault();
  }

  canvas.addEventListener('touchstart', onTouchStart, { passive: false });

  // Start loop (simple redraw)
  function loop(){ draw(); requestAnimationFrame(loop); }
  loop();

  return {
    destroy(){
      canvas.removeEventListener('touchstart', onTouchStart);
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  };
}
