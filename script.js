// --- BOOT SEQUENCE ---
window.onload = () => {
  setTimeout(() => {
    document.getElementById('boot-screen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('boot-screen').style.display = 'none';
      initGame(); // start game loop
    }, 500);
  }, 2500); // Wait 2.5 seconds for boot
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(drainAura, 1000); // start pet drain
};

// --- CLOCK ---
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  m = m < 10 ? '0' + m : m;
  document.getElementById('clock').innerText = h + ':' + m + ' ' + ampm;
}

// --- WINDOW MANAGEMENT & DRAGGING ---
let globalZIndex = 20;
let isDragging = false;
let currentWindow = null;
let offsetX = 0, offsetY = 0;

function openWindow(id) {
  const win = document.getElementById(id);
  win.style.display = 'flex';
  bringToFront(win);
}

function closeWindow(id) {
  document.getElementById(id).style.display = 'none';
}

function bringToFront(win) {
  globalZIndex++;
  win.style.zIndex = globalZIndex;
}

document.querySelectorAll('.os-window').forEach(win => {
  win.addEventListener('mousedown', () => bringToFront(win));
  win.addEventListener('touchstart', () => bringToFront(win));
});

function startDrag(e, id) {
  isDragging = true;
  currentWindow = document.getElementById(id);
  bringToFront(currentWindow);
  
  let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

  offsetX = clientX - currentWindow.getBoundingClientRect().left;
  offsetY = clientY - currentWindow.getBoundingClientRect().top;
}

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag, {passive: false});
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function drag(e) {
  if (!isDragging || !currentWindow) return;
  
  let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

  if(e.type.includes('touch')) e.preventDefault(); 

  currentWindow.style.left = (clientX - offsetX) + 'px';
  currentWindow.style.top = (clientY - offsetY) + 'px';
}

function stopDrag() {
  isDragging = false;
  currentWindow = null;
}

// --- BRAINROT ORACLE ---
const brainrotQuotes = [
  "Erm, what the sigma?",
  "Bro thought he cooked but burnt the water 💀",
  "Negative 1000 Aura for that move.",
  "Skibidi toilet rizz activated.",
  "Livin rent free in my head fr fr.",
  "We making it out the hood with this one 🔥",
  "Only in Ohio bro...",
  "Bro is the main character.",
  "Let him cook! Wait, no, stop him!",
  "Valid. Extremely valid.",
  "W Rizz, unspoken honestly.",
  "What is Sonion on.",
  "My dude just got hit with the 0.0000001% rizz, that’s a yikes from me.",
  "ERRRRRRRRRRRRRRRRRRRRRR",
  "ERRRR What the Sigma?",
  "67676767676767676767676767",  
];

function generateBrainrot() {
  const display = document.getElementById('quote-display');
  display.style.transform = "scale(0.8)";
  setTimeout(() => {
    const random = brainrotQuotes[Math.floor(Math.random() * brainrotQuotes.length)];
    display.innerText = `"${random}"`;
    display.style.transform = "scale(1.1)";
    setTimeout(() => display.style.transform = "scale(1)", 150);
  }, 100);
}

// --- CURSED PAINT ---
const pCanvas = document.getElementById('paintCanvas');
const ctxPaint = pCanvas.getContext('2d');
let painting = false;
let currentColor = '#ff00ff';
ctxPaint.lineWidth = 5;
ctxPaint.lineCap = 'round';
ctxPaint.lineJoin = 'round';

function getMousePos(e) {
  const rect = pCanvas.getBoundingClientRect();
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function startPosition(e) {
  painting = true;
  draw(e);
  if(e.type.includes('touch')) e.preventDefault();
}

function endPosition() {
  painting = false;
  ctxPaint.beginPath(); // reset path so lines don't connect
}

function draw(e) {
  if (!painting) return;
  if(e.type.includes('touch')) e.preventDefault();
  
  const pos = getMousePos(e);
  ctxPaint.strokeStyle = currentColor;
  ctxPaint.shadowBlur = 10;
  ctxPaint.shadowColor = currentColor;
  
  ctxPaint.lineTo(pos.x, pos.y);
  ctxPaint.stroke();
  ctxPaint.beginPath();
  ctxPaint.moveTo(pos.x, pos.y);
}

pCanvas.addEventListener('mousedown', startPosition);
pCanvas.addEventListener('mouseup', endPosition);
pCanvas.addEventListener('mousemove', draw);
pCanvas.addEventListener('mouseleave', endPosition);

pCanvas.addEventListener('touchstart', startPosition, {passive: false});
pCanvas.addEventListener('touchend', endPosition);
pCanvas.addEventListener('touchmove', draw, {passive: false});

function changeColor(color) {
  currentColor = color;
}

function clearCanvas() {
  ctxPaint.clearRect(0, 0, pCanvas.width, pCanvas.height);
}

// --- VIRTUAL PET (AURA DRAIN) ---
let auraLevel = 100;
function drainAura() {
  if(auraLevel > 0) {
    auraLevel -= 2; // drain speed
    updateAuraUI();
  }
}

function feedPet() {
  auraLevel += 20;
  if (auraLevel > 100) auraLevel = 100;
  updateAuraUI();
  
  // Little jump animation
  const img = document.getElementById('pet-img');
  img.style.transform = "scale(1.2) translateY(-20px)";
  setTimeout(() => img.style.transform = "scale(1) translateY(0)", 200);
}

function updateAuraUI() {
  const bar = document.getElementById('aura-bar');
  bar.style.width = auraLevel + '%';
  
  if (auraLevel > 60) bar.style.background = '#0f0';
  else if (auraLevel > 30) bar.style.background = '#ffea00';
  else bar.style.background = '#ff0000';

  if(auraLevel <= 0) {
    document.getElementById('pet-img').style.filter = "grayscale(100%)";
  } else {
    document.getElementById('pet-img').style.filter = "none";
  }
}

// --- FLAPPY ALIEN (FULL CANVAS GAME) ---
const gCanvas = document.getElementById('gameCanvas');
const ctx = gCanvas.getContext('2d');

let frames = 0;
let score = 0;
let gameActive = true;

const alien = {
  x: 50, y: 150, w: 30, h: 30,
  velocity: 0, gravity: 0.6, jumpPower: -8,
  draw() {
    ctx.fillStyle = '#0f0';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0f0';
    ctx.beginPath();
    ctx.arc(this.x + this.w/2, this.y + this.h/2, this.w/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset for other things
    
    // draw alien eye
    ctx.fillStyle = '#000';
    ctx.fillRect(this.x + 20, this.y + 5, 5, 5);
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    
    // Floor collision
    if (this.y + this.h >= gCanvas.height) {
      this.y = gCanvas.height - this.h;
      resetGame();
    }
    // Ceiling collision
    if (this.y <= 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
};

const pipes = {
  items: [],
  width: 40,
  gap: 120,
  dx: 3,
  draw() {
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#ff00ff';
    
    for (let i = 0; i < this.items.length; i++) {
      let p = this.items[i];
      // Top pipe
      ctx.fillRect(p.x, 0, this.width, p.top);
      // Bottom pipe
      ctx.fillRect(p.x, gCanvas.height - p.bottom, this.width, p.bottom);
    }
    ctx.shadowBlur = 0;
  },
  update() {
    // Add new pipe every 100 frames
    if (frames % 100 === 0) {
      let topH = Math.random() * (gCanvas.height - this.gap - 50) + 20;
      let bottomH = gCanvas.height - this.gap - topH;
      this.items.push({ x: gCanvas.width, top: topH, bottom: bottomH, passed: false });
    }

    for (let i = 0; i < this.items.length; i++) {
      let p = this.items[i];
      p.x -= this.dx;

      // Collision detection AABB
      if (
        alien.x + alien.w > p.x && 
        alien.x < p.x + this.width && 
        (alien.y < p.top || alien.y + alien.h > gCanvas.height - p.bottom)
      ) {
        resetGame();
      }

      // Score update
      if (p.x + this.width < alien.x && !p.passed) {
        score++;
        document.getElementById('flappy-score').innerText = score;
        p.passed = true;
      }

      // Remove off-screen pipes
      if (p.x + this.width < 0) {
        this.items.shift();
        i--;
      }
    }
  }
};

function jump() {
  if(!gameActive) {
    // restart game if it was dead
    score = 0;
    document.getElementById('flappy-score').innerText = score;
    pipes.items = [];
    alien.y = 150;
    alien.velocity = 0;
    frames = 0;
    gameActive = true;
    gameLoop();
  } else {
    alien.velocity = alien.jumpPower;
  }
}

function resetGame() {
  gameActive = false;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0,0,gCanvas.width, gCanvas.height);
  ctx.fillStyle = "#ff00ff";
  ctx.font = "30px 'VT323'";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", gCanvas.width/2, gCanvas.height/2);
  ctx.fillStyle = "#fff";
  ctx.font = "20px 'VT323'";
  ctx.fillText("Click to restart", gCanvas.width/2, gCanvas.height/2 + 30);
  ctx.textAlign = "left"; // reset
}

function gameLoop() {
  if(!gameActive) return;
  
  // clear canvas
  ctx.clearRect(0, 0, gCanvas.width, gCanvas.height);
  
  alien.draw();
  alien.update();
  
  pipes.draw();
  pipes.update();
  
  frames++;
  requestAnimationFrame(gameLoop);
}

function initGame() {
  gameLoop();
}