import os
file_path = r'c:\Users\pc\.gemini\antigravity\scratch\chocolate-website\public\css\style.css'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
replacement = """/* ===== VIBE CODING 3D EFFECTS ===== */
.vibe-wrapper { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 2; pointer-events: none; }
.vibe-float { animation: vibeFloating 6s ease-in-out infinite; pointer-events: auto; cursor: pointer; border-radius: 20px; }
@keyframes vibeFloating {
    0% { transform: translateY(0px) rotate(-1deg); }
    50% { transform: translateY(-15px) rotate(1deg); }
    100% { transform: translateY(0px) rotate(-1deg); }
}
.vibe-glow {
    position: absolute;
    inset: -30px;
    border-radius: 20px;
    background: radial-gradient(circle at 50% 50%, rgba(220, 20, 40, 0.4), rgba(212, 175, 55, 0.2), transparent 70%);
    z-index: -1;
    filter: blur(35px);
    animation: vibePulse 4s ease-in-out infinite alternate;
}
@keyframes vibePulse {
    0% { opacity: 0.6; transform: scale(0.95); }
    100% { opacity: 1.2; transform: scale(1.05); }
}
.vibe-tilt { transform-style: preserve-3d; perspective: 1000px; }
.hero-vibe-img {
    max-width: 500px;
    width: 90vw;
    border-radius: 20px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1);
    object-fit: contain;
}
@media (max-width: 768px) {
    .hero-vibe-img { max-width: 300px; margin-top: 40px; }
}
"""
lines[1247:1279] = [replacement + '\n']
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
