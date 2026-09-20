/**
 * Exordium 5.0 - Cursor Following Robot Mascot & Floating Contact Widget
 * Lightweight, Vanilla JS, RequestAnimationFrame loop, Accessible & Reduced-Motion aware.
 */

(function () {
  'use strict';

  // =========================================================
  // 1. Floating Robot Contact Widget (Runs on all pages)
  // =========================================================
  function initFloatingContactWidget() {
    if (document.getElementById('floating-contact-container')) return;

    const widget = document.createElement('div');
    widget.id = 'floating-contact-container';
    widget.className = 'floating-contact-container';
    widget.innerHTML = `
      <div id="contact-popup-card" class="contact-popup-card" role="dialog" aria-label="Contact Representatives">
        <div class="contact-popup-header">
          <div class="contact-popup-title">
            <i class="bi bi-headset" style="color: #4da3ff;"></i> Need Help? Contact Us
          </div>
          <button type="button" id="contact-popup-close" class="contact-popup-close" aria-label="Close contact popup">&times;</button>
        </div>

        <div class="contact-speech-bubble">
          Have questions about <strong>Exordium 5.0</strong> or registration? Reach out directly:
        </div>

        <!-- Person 1: Bhagath B S -->
        <div class="contact-person-card">
          <div class="contact-person-name">Bhagath B S</div>
          <div class="contact-person-role">Vice Chair</div>
          <div class="contact-action-row">
            <a href="tel:+916238758530" class="contact-btn-call">
              <i class="bi bi-telephone-fill"></i> Call
            </a>
            <a href="https://wa.me/916238758530?text=Hi%20Bhagath,%20I%20have%20a%20query%20regarding%20Exordium%205.0" target="_blank" rel="noopener" class="contact-btn-wa">
              <i class="bi bi-whatsapp"></i> WhatsApp
            </a>
          </div>
        </div>

        <!-- Person 2: Sreya P Babu -->
        <div class="contact-person-card">
          <div class="contact-person-name">Sreya P Babu</div>
          <div class="contact-person-role">Joint Secretary</div>
          <div class="contact-action-row">
            <a href="tel:+918078005969" class="contact-btn-call">
              <i class="bi bi-telephone-fill"></i> Call
            </a>
            <a href="https://wa.me/918078005969?text=Hi%20Sreya,%20I%20have%20a%20query%20regarding%20Exordium%205.0" target="_blank" rel="noopener" class="contact-btn-wa">
              <i class="bi bi-whatsapp"></i> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <button type="button" id="floating-contact-btn" class="floating-contact-btn" aria-label="Open Contact Info" title="Need help? Contact us!">
        <div class="floating-robot-icon">
          <svg viewBox="0 0 100 100" style="width: 24px; height: 24px; fill: none;">
            <rect x="20" y="25" width="60" height="50" rx="14" fill="#16233a" stroke="#4da3ff" stroke-width="4"/>
            <rect x="28" y="33" width="44" height="34" rx="10" fill="#070c14" stroke="#2a3b57" stroke-width="2"/>
            <circle cx="40" cy="50" r="5" fill="#4da3ff"/>
            <circle cx="60" cy="50" r="5" fill="#4da3ff"/>
            <line x1="50" y1="25" x2="50" y2="12" stroke="#d19e54" stroke-width="3"/>
            <circle cx="50" cy="10" r="4" fill="#3ecf8e"/>
          </svg>
        </div>
        <div class="floating-contact-badge">
          Need Help? <span>Contact Us</span>
        </div>
      </button>
    `;

    document.body.appendChild(widget);

    const btn = document.getElementById('floating-contact-btn');
    const card = document.getElementById('contact-popup-card');
    const closeBtn = document.getElementById('contact-popup-close');

    if (btn && card) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('show');
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          card.classList.remove('show');
        });
      }

      document.addEventListener('click', (e) => {
        if (!widget.contains(e.target)) {
          card.classList.remove('show');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingContactWidget);
  } else {
    initFloatingContactWidget();
  }

  // =========================================================
  // 2. Cursor Following Hero Robot Mascot (If container exists)
  // =========================================================
  const container = document.getElementById('hero-robot-container');
  if (!container) return;

  // Insert Inline SVG
  container.innerHTML = `
    <div class="hero-robot-wrapper" role="presentation">
      <svg class="hero-robot" viewBox="0 0 320 360" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="botMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2a3b57"/>
            <stop offset="50%" stop-color="#16233a"/>
            <stop offset="100%" stop-color="#0e1726"/>
          </linearGradient>
          <linearGradient id="botGoldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#e9cf9f"/>
            <stop offset="50%" stop-color="#d19e54"/>
            <stop offset="100%" stop-color="#b37f35"/>
          </linearGradient>
          <linearGradient id="botVisor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#070c14"/>
            <stop offset="100%" stop-color="#101a2e"/>
          </linearGradient>
          <linearGradient id="thrusterGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4da3ff" stop-opacity="0.9"/>
            <stop offset="70%" stop-color="#3ecf8e" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#3ecf8e" stop-opacity="0"/>
          </linearGradient>
          <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- Thruster Glow / Shadow -->
        <g class="robot-thrusters">
          <ellipse cx="160" cy="328" rx="28" ry="8" fill="rgba(77, 163, 255, 0.2)" />
          <path class="robot-thruster-flame" d="M 144 300 Q 160 345 176 300 Z" fill="url(#thrusterGlow)" />
        </g>

        <!-- Main Floating Group -->
        <g id="robot-float" class="robot-float-group">
          
          <!-- Robot Body -->
          <g id="robot-body" class="robot-body-group">
            <!-- Left Arm -->
            <g class="robot-arm-left">
              <path d="M 85 220 C 65 235 60 265 75 285 C 80 292 90 290 92 282 C 82 268 85 245 98 235 Z" fill="url(#botMetallic)" stroke="#2a3b57" stroke-width="1.5"/>
              <circle cx="75" cy="285" r="7" fill="#d19e54"/>
            </g>

            <!-- Right Arm (Waving) -->
            <g id="robot-arm-right" class="robot-arm-right">
              <path d="M 235 220 C 255 235 260 265 245 285 C 240 292 230 290 228 282 C 238 268 235 245 222 235 Z" fill="url(#botMetallic)" stroke="#2a3b57" stroke-width="1.5"/>
              <circle cx="245" cy="285" r="7" fill="#d19e54"/>
            </g>

            <!-- Torso -->
            <rect x="105" y="195" width="110" height="105" rx="28" fill="url(#botMetallic)" stroke="#2a3b57" stroke-width="2"/>
            <!-- Gold Accent Trim -->
            <path d="M 120 205 L 200 205" stroke="url(#botGoldAccent)" stroke-width="3" stroke-linecap="round"/>
            <rect x="125" y="220" width="70" height="50" rx="14" fill="#0b1320" stroke="#2a3b57" stroke-width="1"/>
            
            <!-- Glowing Core Orb -->
            <circle id="robot-core" class="robot-chest-core" cx="160" cy="245" r="14" fill="#4da3ff" filter="url(#glowBlue)"/>
            <circle cx="160" cy="245" r="7" fill="#ffffff" opacity="0.8"/>
          </g>

          <!-- Robot Head (Tiltable & Rotatable) -->
          <g id="robot-head" class="robot-head-group">
            <!-- Antenna -->
            <line x1="160" y1="95" x2="160" y2="60" stroke="#d19e54" stroke-width="4" stroke-linecap="round"/>
            <circle class="robot-antenna-tip" cx="160" cy="54" r="8" fill="#4da3ff"/>

            <!-- Ear pods -->
            <rect x="70" y="125" width="14" height="30" rx="6" fill="#d19e54"/>
            <rect x="236" y="125" width="14" height="30" rx="6" fill="#d19e54"/>

            <!-- Head Outer Shell -->
            <rect x="78" y="90" width="164" height="105" rx="34" fill="url(#botMetallic)" stroke="#2a3b57" stroke-width="2.5"/>
            
            <!-- Visor Screen -->
            <rect x="92" y="102" width="136" height="80" rx="24" fill="url(#botVisor)" stroke="#1f2e47" stroke-width="2"/>

            <!-- Visor Reflection Sheen -->
            <path d="M 102 110 Q 160 118 218 110 C 224 110 224 116 218 118 Q 160 126 102 118 C 96 118 96 110 102 110 Z" fill="#ffffff" opacity="0.08"/>

            <!-- Normal Eyes Group -->
            <g class="robot-normal-eyes">
              <!-- Left Eye Outer Socket -->
              <g class="robot-eye robot-eye-left" transform-origin="128 142">
                <rect x="110" y="124" width="36" height="36" rx="18" fill="#0b172a" stroke="#203453" stroke-width="1.5"/>
                <!-- Eye Grid / Sclera Glow -->
                <circle cx="128" cy="142" r="13" fill="#162c4b"/>
                <!-- Clamped Pupil -->
                <g id="robot-pupil-left" class="robot-pupil">
                  <circle cx="128" cy="142" r="8" fill="#4da3ff"/>
                  <circle cx="126" cy="140" r="3" fill="#ffffff"/>
                </g>
              </g>

              <!-- Right Eye Outer Socket -->
              <g class="robot-eye robot-eye-right" transform-origin="192 142">
                <rect x="174" y="124" width="36" height="36" rx="18" fill="#0b172a" stroke="#203453" stroke-width="1.5"/>
                <!-- Eye Grid / Sclera Glow -->
                <circle cx="192" cy="142" r="13" fill="#162c4b"/>
                <!-- Clamped Pupil -->
                <g id="robot-pupil-right" class="robot-pupil">
                  <circle cx="192" cy="142" r="8" fill="#4da3ff"/>
                  <circle cx="190" cy="140" r="3" fill="#ffffff"/>
                </g>
              </g>
            </g>

            <!-- Happy Eyes (Arcs) -->
            <g class="robot-happy-eyes">
              <path d="M 116 146 Q 128 130 140 146" />
              <path d="M 180 146 Q 192 130 204 146" />
            </g>
          </g>

        </g>
      </svg>
    </div>
  `;

  const robotSvg = container.querySelector('.hero-robot');
  const headEl = container.querySelector('#robot-head');
  const floatGroup = container.querySelector('#robot-float');
  const pupilLeft = container.querySelector('#robot-pupil-left');
  const pupilRight = container.querySelector('#robot-pupil-right');
  const leftEyeEl = container.querySelector('.robot-eye-left');
  const rightEyeEl = container.querySelector('.robot-eye-right');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tracking state
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetPupilX = 0;
  let targetPupilY = 0;
  let currentPupilX = 0;
  let currentPupilY = 0;

  let targetHeadTilt = 0;
  let currentHeadTilt = 0;
  let targetHeadOffsetX = 0;
  let currentHeadOffsetX = 0;

  let lastActiveTime = Date.now();
  let isIdle = false;
  let isHappy = false;
  let rAFId = null;
  let isVisible = true;

  const MAX_PUPIL_RADIUS = 6.5;

  function onPointerMove(e) {
    lastActiveTime = Date.now();
    isIdle = false;

    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    mouseX = clientX;
    mouseY = clientY;

    if (prefersReducedMotion || !robotSvg) return;

    const rect = robotSvg.getBoundingClientRect();
    const robotCenterX = rect.left + rect.width / 2;
    const robotCenterY = rect.top + rect.height * 0.4;

    const dx = mouseX - robotCenterX;
    const dy = mouseY - robotCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    targetHeadTilt = Math.max(-14, Math.min(14, (dx / window.innerWidth) * 26));
    targetHeadOffsetX = Math.max(-8, Math.min(8, (dx / window.innerWidth) * 16));

    const clampedDist = Math.min(dist * 0.035, MAX_PUPIL_RADIUS);
    targetPupilX = (dx / dist) * clampedDist;
    targetPupilY = (dy / dist) * clampedDist;
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  function triggerHappy() {
    if (!robotSvg) return;
    isHappy = true;
    robotSvg.classList.add('happy', 'waving');
    setTimeout(() => {
      isHappy = false;
      robotSvg.classList.remove('happy', 'waving');
    }, 1100);
  }

  if (robotSvg) {
    robotSvg.addEventListener('mouseenter', triggerHappy);
    robotSvg.addEventListener('click', triggerHappy);
    robotSvg.addEventListener('touchstart', triggerHappy, { passive: true });
  }

  function scheduleBlink() {
    if (prefersReducedMotion) return;
    const nextBlinkMs = 3000 + Math.random() * 2500;
    setTimeout(() => {
      if (!isHappy && isVisible && leftEyeEl && rightEyeEl) {
        leftEyeEl.classList.add('blinking');
        rightEyeEl.classList.add('blinking');
        setTimeout(() => {
          leftEyeEl.classList.remove('blinking');
          rightEyeEl.classList.remove('blinking');
        }, 160);
      }
      scheduleBlink();
    }, nextBlinkMs);
  }
  scheduleBlink();

  function animate(time) {
    if (!isVisible || prefersReducedMotion) {
      rAFId = null;
      return;
    }

    const now = Date.now();
    const idleElapsed = now - lastActiveTime;

    if (idleElapsed > 3000) {
      isIdle = true;
    }

    if (isIdle && !isHappy && floatGroup) {
      const floatY = Math.sin(time * 0.002) * 5;
      floatGroup.setAttribute('transform', `translate(0, ${floatY})`);

      const lookTime = time * 0.0008;
      targetPupilX = Math.sin(lookTime) * 3;
      targetPupilY = Math.cos(lookTime * 0.7) * 2;
      targetHeadTilt = Math.sin(lookTime * 0.8) * 4;
      targetHeadOffsetX = Math.sin(lookTime) * 2;
    } else if (!prefersReducedMotion && floatGroup) {
      floatGroup.setAttribute('transform', `translate(0, ${Math.sin(time * 0.003) * 2})`);
    }

    currentPupilX += (targetPupilX - currentPupilX) * 0.12;
    currentPupilY += (targetPupilY - currentPupilY) * 0.12;

    currentHeadTilt += (targetHeadTilt - currentHeadTilt) * 0.08;
    currentHeadOffsetX += (targetHeadOffsetX - currentHeadOffsetX) * 0.08;

    if (pupilLeft && pupilRight) {
      pupilLeft.setAttribute('transform', `translate(${currentPupilX.toFixed(2)}, ${currentPupilY.toFixed(2)})`);
      pupilRight.setAttribute('transform', `translate(${currentPupilX.toFixed(2)}, ${currentPupilY.toFixed(2)})`);
    }

    if (headEl) {
      headEl.setAttribute(
        'transform',
        `translate(${currentHeadOffsetX.toFixed(2)}, 0) rotate(${currentHeadTilt.toFixed(2)} 160 145)`
      );
    }

    rAFId = requestAnimationFrame(animate);
  }

  function startLoop() {
    if (!rAFId && !prefersReducedMotion) {
      rAFId = requestAnimationFrame(animate);
    }
  }

  function stopLoop() {
    if (rAFId) {
      cancelAnimationFrame(rAFId);
      rAFId = null;
    }
  }

  if (container && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting && !document.hidden;
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
  } else if (container) {
    startLoop();
  }

  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      startLoop();
    } else {
      stopLoop();
    }
  });

  if (container && !prefersReducedMotion) {
    startLoop();
  }
})();
