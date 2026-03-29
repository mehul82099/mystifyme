const fs = require('fs');
const path = require('path');

const baseHtmlPath = path.join(__dirname, 'public', 'base.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('base.html not found! Run curl/Invoke-WebRequest first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

// Helper to inject scripts into the body
function injectScripts(html, inlineStyles, scriptContent, titleOverlay) {
  let mod = html;
  
  // Inject Title Overlay
  const overlayHtml = `
  <div style="position:fixed; top:20px; right:20px; z-index:9999; background:rgba(0,0,0,0.8); color:#f0d67b; font-size:24px; padding:10px 20px; border-radius:10px; border:1px solid #D4AF37; font-weight:bold; font-family:serif;">
    ${titleOverlay}
  </div>
  `;
  mod = mod.replace('<body>', `<body>${overlayHtml}`);

  // Inject Styles
  if (inlineStyles) {
    mod = mod.replace('</head>', `\n<style>${inlineStyles}</style>\n</head>`);
  }
  
  // Inject Script
  if (scriptContent) {
    mod = mod.replace('</body>', `\n<script>${scriptContent}</script>\n</body>`);
  }
  
  return mod;
}

// ============================
// VARIATION 1: TRUE ANTIGRAVITY (Matter.js)
// ============================
const v1Styles = `
  canvas { position: absolute; top:0; left:0; width:100%; height:100%; z-index: 100; pointer-events: none; }
  .matter-body { position: absolute; left:0; top:0; z-index:100; user-select:none; }
  #hero { overflow: hidden; pointer-events: none; }
  .interactive-layer { position:absolute; inset:0; z-index:105; }
`;
const v1Script = `
  function loadMatter() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js';
    script.onload = initMatter;
    document.body.appendChild(script);
  }
  
  function initMatter() {
    const Engine = Matter.Engine, Render = Matter.Render, Runner = Matter.Runner,
          Bodies = Matter.Bodies, Composite = Matter.Composite, Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;
    const engine = Engine.create();
    engine.gravity.y = 0.5;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const ground = Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true });
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true });

    Composite.add(engine.world, [ground, leftWall, rightWall]);
    
    const selectors = ['.hero-title span', '.hero-subtitle', '.hero-price-badge', '.hero-cta', '.floating-choco'];
    let bodies = [];
    
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if(rect.width === 0) return;
        
        el.style.position = 'absolute'; el.style.margin = '0'; el.style.transform = 'none';
        el.style.top = '0'; el.style.left = '0'; el.style.animation = 'none';
        
        document.body.appendChild(el);
        
        const body = Bodies.rectangle(rect.left + rect.width/2, rect.top + rect.height/2, rect.width, rect.height, {
          restitution: 0.8, frictionAir: 0.05, angle: (Math.random() - 0.5) * 0.2
        });
        
        bodies.push({el, body});
        Composite.add(engine.world, body);
      });
    });

    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse, constraint: { stiffness: 0.2, render: { visible: false } } });

    Composite.add(engine.world, mouseConstraint);
    Runner.run(Runner.create(), engine);

    Matter.Events.on(engine, 'afterUpdate', function() {
      bodies.forEach(obj => {
        obj.el.style.transform = 'translate(' + (obj.body.position.x - obj.el.offsetWidth/2) + 'px, ' + (obj.body.position.y - obj.el.offsetHeight/2) + 'px) rotate(' + obj.body.angle + 'rad)';
      });
    });
  }
  window.addEventListener('load', () => setTimeout(loadMatter, 1000));
`;

// ============================
// VARIATION 2: MAGNETIC GLASS SPACE
// ============================
const v2Styles = `
  #hero { background: radial-gradient(circle at center, #111, #000); }
  .hero-vibe-img { opacity: 1; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.8)); }
  .magnetic { transition: transform 0.2s cubic-bezier(0.2,0.8,0.2,1); }
`;
const v2Script = `
  const threshold2 = 250; 
  document.querySelectorAll('.hero-title span, .hero-cta, .floating-choco, .hero-subtitle').forEach(el => el.classList.add('magnetic'));
  window.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.magnetic').forEach(el => {
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;
      const distX = e.clientX - elX;
      const distY = e.clientY - elY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      if (dist < threshold2) {
        el.style.transform = 'translate(' + (distX/dist)*(threshold2-dist)*0.4 + 'px, ' + (distY/dist)*(threshold2-dist)*0.4 + 'px) scale(1.05)';
      } else {
        el.style.transform = 'translate(0px, 0px) scale(1)';
      }
    });
  });
`;

// ============================
// VARIATION 3: CINEMATIC PARALLAX 3D
// ============================
const v3Styles = `
  #hero { transform-style: preserve-3d; perspective: 1200px; }
  .hero-wrapper { transform-style: preserve-3d; transition: transform 0.1s; width:100%; height:100%; }
  .hero-bg-container { transform: translateZ(50px) scale(1.1); filter: drop-shadow(0 40px 60px rgba(0,0,0,0.9)); z-index: 20; }
  .hero-title { transform: translateZ(-50px); text-shadow: 0 20px 30px rgba(0,0,0,0.6); }
  .hero-cta { transform: translateZ(100px); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
  .floating-choco.c1 { transform: translateZ(150px); filter: drop-shadow(40px 40px 40px rgba(0,0,0,0.8)); }
  .floating-choco.c2 { transform: translateZ(200px); filter: drop-shadow(0 20px 30px rgba(0,0,0,0.8)); }
`;
const v3Script = `
  const hero3 = document.getElementById('hero');
  hero3.innerHTML = '<div class="hero-wrapper">' + hero3.innerHTML + '</div>';
  const wrapper3 = hero3.querySelector('.hero-wrapper');
  window.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    wrapper3.style.transform = 'rotateY(' + xAxis + 'deg) rotateX(' + yAxis + 'deg)';
  });
`;

// ============================
// VARIATION 4: CYBER-NEON VIBE
// ============================
const v4Styles = `
  #hero { background: #000; overflow:hidden; }
  .hero-vibe-img { filter: drop-shadow(0 0 30px #0ff) drop-shadow(0 0 10px #f0f) !important; opacity: 1 !important; mix-blend-mode: normal !important; transform: scale(1.1); z-index:50;}
  .hero-title { color: #fff; text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #f0f; font-family: monospace, sans-serif !important; }
  .hero-subtitle { color: #f0f; letter-spacing: 5px; text-transform: uppercase; font-weight: bold; }
  .hero-cta { background: transparent; border: 2px solid #0ff; box-shadow: 0 0 15px #0ff, inset 0 0 15px #0ff; color: #0ff; border-radius: 0; }
  .hero-cta:hover { background: #0ff; color: #000; }
  .cyber-grid {
    position: absolute; inset: -50%;
    background-image: linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px);
    background-size: 50px 50px;
    transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
    animation: gridMove 2s linear infinite; pointer-events: none; z-index:0;
  }
  @keyframes gridMove { 0% { background-position: 0 0; } 100% { background-position: 0 50px; } }
`;
const v4Script = `
  const grid4 = document.createElement('div');
  grid4.className = 'cyber-grid';
  document.getElementById('hero').prepend(grid4);
`;

// ============================
// VARIATION 5: LIQUID DREAM (Ripples)
// ============================
const v5Styles = `
  #hero { background: #1a1613; }
  .hero-bg-container { opacity: 1; filter: drop-shadow(0px -10px 40px rgba(212, 175, 55, 0.4)); }
  .ripple {
    position: absolute; border-radius: 50%; border: 2px solid rgba(212, 175, 55, 0.6);
    transform: translate(-50%, -50%) scale(0);
    animation: rippleAnim 1.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
    pointer-events: none; z-index: 200;
  }
  @keyframes rippleAnim {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; border-width: 4px; }
    100% { transform: translate(-50%, -50%) scale(4); opacity: 0; border-width: 0; }
  }
`;
const v5Script = `
  let lastX = 0, lastY = 0;
  window.addEventListener('mousemove', (e) => {
    const dist = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
    if (dist > 60) {
      lastX = e.clientX; lastY = e.clientY;
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = (e.clientY + window.scrollY) + 'px';
      ripple.style.width = '100px'; ripple.style.height = '100px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1500);
      document.querySelectorAll('.floating-choco').forEach(choco => {
        const cRect = choco.getBoundingClientRect();
        const cDist = Math.sqrt(Math.pow(e.clientX - (cRect.left+cRect.width/2), 2) + Math.pow(e.clientY - (cRect.top+cRect.height/2), 2));
        if (cDist < 200) {
          choco.style.transform = 'scale(1.1) rotate(' + (Math.random()*20 - 10) + 'deg)';
          choco.style.transition = 'transform 0.4s';
          setTimeout(() => choco.style.transform = '', 400);
        }
      });
    }
  });
`;

fs.writeFileSync(path.join(__dirname, 'public', 'v1.html'), injectScripts(baseHtml, v1Styles, v1Script, 'V1: True Antigravity'));
fs.writeFileSync(path.join(__dirname, 'public', 'v2.html'), injectScripts(baseHtml, v2Styles, v2Script, 'V2: Magnetic Void'));
fs.writeFileSync(path.join(__dirname, 'public', 'v3.html'), injectScripts(baseHtml, v3Styles, v3Script, 'V3: Cinematic Parallax'));
fs.writeFileSync(path.join(__dirname, 'public', 'v4.html'), injectScripts(baseHtml, v4Styles, v4Script, 'V4: Cyber Neon'));
fs.writeFileSync(path.join(__dirname, 'public', 'v5.html'), injectScripts(baseHtml, v5Styles, v5Script, 'V5: Liquid Dream'));
console.log('Successfully generated v1.html to v5.html in public/');
