// ===============================
// 烟花粒子特效（Canvas2D）
// ===============================
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const heartCanvas = document.getElementById("hearts");
const hctx = heartCanvas.getContext("2d");
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  heartCanvas.width = window.innerWidth;
  heartCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 背景图
const bgImage = new Image();
bgImage.src = "images/bg1.jpg";

// 初始化烟花粒子
let particles = [];
function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      alpha: Math.random() * 0.5 + 0.35,
      color: ["#ff3b30", "#ffd700", "#ff9500"][Math.floor(Math.random() * 3)]
    });
  }
}
initParticles();

function drawFireworks() {
  // 绘制尾迹效果
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 背景图（半透明叠加）
  if (bgImage.complete) {
    ctx.globalAlpha = 0.42;
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  // 绘制每个粒子
  particles.forEach(p => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // 更新位置
    p.x += p.vx;
    p.y += p.vy;
    // 飞出屏幕重置
    if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      p.x = Math.random() * canvas.width;
      p.y = canvas.height + Math.random() * 50;
    }
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawFireworks);
}
drawFireworks();

// ===============================
// 爱心漂浮特效
// ===============================
let hearts = [];
function initHearts() {
  hearts = [];
  for (let i = 0; i < 30; i++) {
    hearts.push({
      x: Math.random() * heartCanvas.width,
      y: heartCanvas.height + Math.random() * 100,
      size: Math.random() * 7 + 4,
      speed: Math.random() * 1.1 + 0.4,
      opacity: Math.random() * 0.45 + 0.25,
      color: ["#ff69b4", "#ff4d6d", "#ff85a2"][Math.floor(Math.random() * 3)]
    });
  }
}
initHearts();

function drawHearts() {
  hctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
  hearts.forEach(h => {
    h.y -= h.speed;
    drawHeartShape(h.x, h.y, h.size, h.color, h.opacity);
    if (h.y < -30) {
      h.y = heartCanvas.height + Math.random() * 80;
      h.x = Math.random() * heartCanvas.width;
    }
  });
  requestAnimationFrame(drawHearts);
}

function drawHeartShape(x, y, size, color, alpha) {
  hctx.save();
  hctx.translate(x, y);
  hctx.scale(size / 16, size / 16);
  hctx.globalAlpha = alpha;
  hctx.fillStyle = color;
  hctx.beginPath();
  hctx.moveTo(0, -4);
  hctx.bezierCurveTo(8, -16, 24, -2, 0, 18);
  hctx.bezierCurveTo(-24, -2, -8, -16, 0, -4);
  hctx.fill();
  hctx.restore();
}

drawHearts();

// ===============================
// Swiper 初始化
// ===============================
const swiper = new Swiper(".swiper", {
  direction: "vertical",
  mousewheel: true,
  simulateTouch: true,
  touchReleaseOnEdges: true, // 释放边缘滑动【5?L956-L964】
  speed: 700,
  resistanceRatio: 0.85
});

// ===============================
// 音乐控制
// ===============================
const music = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
let musicStarted = false;
music.volume = 0.01;

function setMusicButtonState() {
  if (music.paused) {
    musicBtn.classList.remove("playing");
    musicBtn.style.opacity = "0.9";
  } else {
    musicBtn.classList.add("playing");
    musicBtn.style.opacity = "1";
  }
}

function fadeInMusic(duration = 2500, targetVolume = 1) {
  const steps = 25;
  const interval = duration / steps;
  let currentStep = 0;
  const timer = setInterval(() => {
    currentStep++;
    music.volume = Math.min((targetVolume / steps) * currentStep, targetVolume);
    if (currentStep >= steps) {
      clearInterval(timer);
      music.volume = targetVolume;
    }
  }, interval);
}

function tryPlayMusic() {
  if (!music.paused && musicStarted) return;
  const playPromise = music.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        if (!musicStarted) {
          musicStarted = true;
          fadeInMusic(2500, 1);
        }
        setMusicButtonState();
      })
      .catch(() => { setMusicButtonState(); });
  }
}

document.addEventListener("WeixinJSBridgeReady", tryPlayMusic);
document.addEventListener("YixinJSBridgeReady", tryPlayMusic);
window.addEventListener("load", tryPlayMusic);
document.addEventListener("touchstart", () => tryPlayMusic(), { once: true, passive: true });
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) tryPlayMusic();
});
musicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play().then(() => {
      if (music.volume < 0.2) fadeInMusic(1200, 1);
      musicStarted = true;
      setMusicButtonState();
    }).catch(() => { setMusicButtonState(); });
  } else {
    music.pause();
    setMusicButtonState();
  }
});
music.addEventListener("play", setMusicButtonState);
music.addEventListener("pause", setMusicButtonState);
setMusicButtonState();

// ===============================
// 倒计时
// ===============================
const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");
const weddingDate = new Date("2026-04-26T10:00:00+08:00");
function updateCountdown() {
  const now = new Date();
  let diff = weddingDate.getTime() - now.getTime();
  if (diff < 0) diff = 0;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  if (dEl) dEl.textContent = String(d);
  if (hEl) hEl.textContent = String(h).padStart(2, "0");
  if (mEl) mEl.textContent = String(m).padStart(2, "0");
  if (sEl) sEl.textContent = String(s).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===============================
// 表单提交（Formspree）
// ===============================
const form = document.getElementById("guestForm");
const resultDiv = document.getElementById("result");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.innerText = "提交中...";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error("提交失败");
      resultDiv.innerHTML = "<p style='color:green;'>已收到您的回复 ??</p>";
      form.reset();
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = "<p style='color:red;'>提交失败，请稍后再试</p>";
    }
    btn.disabled = false;
    btn.innerText = "提交";
  });
}

// ===============================
// 高端特效：礼花/彩带（Canvas2D 实现）
// ===============================
// 生成随机彩带线段
function spawnConfetti() {
  const colors = ["#10b981","#7c3aed","#fbbf24","#ef4444","#3b82f6","#22c55e","#f97316","#ef4444"];
  for (let i = 0; i < 30; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = colors[Math.floor(Math.random()*colors.length)];
    const x0 = Math.random() * canvas.width;
    const y0 = Math.random() * canvas.height;
    const angle = Math.random() * Math.PI * 2;
    const len = Math.random() * 20 + 10;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + Math.cos(angle)*len, y0 + Math.sin(angle)*len);
    ctx.stroke();
    ctx.restore();
  }
}
// 简单性能检测：若设备性能低，则禁用高端特效
const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4)
               || (window.devicePixelRatio < 2 && window.innerWidth < 600);
if (!isLowEnd) {
  spawnConfetti();
}
