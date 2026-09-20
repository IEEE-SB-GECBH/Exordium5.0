/**
 * Exordium 5.0 - Ticket Registration & Bill Checkout Engine
 * Pure Vanilla JavaScript (No libraries)
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzg7aN3KPScZe38HxMJf0Jeq7Km_FZp2bCX9wUQ11zwSI5eIOsB7wYMpTEG8_Bd_Esf/exec';
const PRICE = { member: 899, nonMember: 1099 };   // rupees
const DEPTS = {
  IT: { label: 'Information Technology (IT)', payee: 'Rahul M S', upi: 'vkrahulms-1@okhdfcbank', qr: 'assets/qr/it.png' },
  EC: { label: 'Electronics and Communication (EC)', payee: 'Swathi D', upi: 'swathid2404@oksbi', qr: 'assets/qr/ec.png' },
  EEE: { label: 'Electrical and Electronics (EEE)', payee: 'Keerthana Mohan', upi: 'keerthanamohan376@oksbi', qr: 'assets/qr/eee.png' },
  ME: { label: 'Mechanical (ME)', payee: 'Abhilash A S', upi: 'abhilashabhias112@oksbi', qr: 'assets/qr/me.png' },
  CE: { label: 'Civil (CE)', payee: 'Gowry Krishna S', upi: 'gowrykrishna242005@okaxis', qr: 'assets/qr/ce.png' }
};

(function () {
  'use strict';

  // State Management
  const state = {
    step: 1,
    ieeeMember: false,
    selectedDept: null,
    selectedFood: 'Veg',
    selectedWorkshop: 'Game development',
    isPaidMode: false,
    isPrinting: false,
    isTearing: false,
    soundMuted: false,
    currentAmount: PRICE.nonMember,
    printedDept: null,
    printedAmount: null,
    uploadedFile: null,
    compressedBase64: null,
    uploadXHR: null,
    uploadCanceled: false
  };

  // Prefers Reduced Motion Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const form = document.getElementById('registration-form');
  const step1Indicator = document.getElementById('step-indicator-1');
  const step2Indicator = document.getElementById('step-indicator-2');
  const step1Card = document.getElementById('step-1-card');
  const step2Card = document.getElementById('step-2-card');
  const btnContinue = document.getElementById('btn-continue-payment');

  // Step 1 Inputs
  const inputName = document.getElementById('input-name');
  const inputPhone = document.getElementById('input-phone');
  const inputEmail = document.getElementById('input-email');
  const selectYear = document.getElementById('select-year');
  const radioIeeeYes = document.getElementById('ieee-yes');
  const radioIeeeNo = document.getElementById('ieee-no');
  const ieeeDetailsBox = document.getElementById('ieee-conditional-box');
  const inputIeeeId = document.getElementById('input-ieee-id');
  const inputAltPhone = document.getElementById('input-alt-phone');
  const ieeeErrorMsg = document.getElementById('ieee-error-msg');

  // Step 2 Inputs & Cards
  const deptRadios = document.querySelectorAll('input[name="dept"]');
  const foodRadios = document.querySelectorAll('input[name="food"]');
  const workshopRadios = document.querySelectorAll('input[name="workshop"]');
  const soundToggleBtn = document.getElementById('sound-toggle');
  const emptyBillBox = document.getElementById('empty-bill-box');
  const printerContainer = document.getElementById('printer-container');
  const receiptPaper = document.getElementById('receipt-paper');
  const cutterFlash = document.getElementById('cutter-flash');
  const btnMarkPaid = document.getElementById('btn-mark-paid');
  const btnShowQrAgain = document.getElementById('btn-show-qr-again');
  const paidNoteText = document.getElementById('paid-note-text');

  // Receipt Elements
  const receiptSubhead = document.getElementById('receipt-subhead');
  const receiptMeta = document.getElementById('receipt-meta');
  const receiptAmountVal = document.getElementById('receipt-amount-val');
  const receiptRowName = document.getElementById('receipt-row-name');
  const receiptRowDept = document.getElementById('receipt-row-dept');
  const receiptRowYear = document.getElementById('receipt-row-year');
  const receiptRowMember = document.getElementById('receipt-row-member');
  const receiptRowFood = document.getElementById('receipt-row-food');
  const receiptRowWorkshop = document.getElementById('receipt-row-workshop');
  const receiptQrDivider = document.getElementById('receipt-qr-divider');
  const receiptQrBlock = document.getElementById('receipt-qr-block');
  const receiptQrImg = document.getElementById('receipt-qr-img');
  const receiptQrMissing = document.getElementById('receipt-qr-missing');
  const receiptPayeeName = document.getElementById('receipt-payee-name');
  const receiptUpiText = document.getElementById('receipt-upi-text');
  const receiptTotalVal = document.getElementById('receipt-total-val');
  const receiptFooterText = document.getElementById('receipt-footer-text');
  const stampZone = document.getElementById('stamp-zone');

  // Proof & Upload Elements
  const proofSection = document.getElementById('proof-section');
  const fileInput = document.getElementById('file-screenshot');
  const dropzone = document.getElementById('screenshot-dropzone');
  const uploadCard = document.getElementById('upload-card');
  const uploadFill = document.getElementById('upload-card-fill');
  const uploadConfettiContainer = document.getElementById('upload-confetti-container');
  const uploadCompleteBadge = document.getElementById('upload-complete-badge');
  const uploadGraphAreaFill = document.getElementById('upload-graph-area-fill');
  const uploadGraphLineStroke = document.getElementById('upload-graph-line-stroke');
  const uploadFilename = document.getElementById('upload-filename');
  const uploadStatusText = document.getElementById('upload-status-text');
  const btnUploadAction = document.getElementById('btn-upload-action');
  const declarationCheck = document.getElementById('declaration-check');
  const submitAlert = document.getElementById('submit-error-alert');
  const btnSubmit = document.getElementById('btn-submit-registration');

  // Success Dialog Overlay
  const successOverlay = document.getElementById('success-overlay');
  const successRegId = document.getElementById('success-reg-id');
  const successMsg = document.getElementById('success-msg');
  const demoNotice = document.getElementById('demo-mode-notice');
  const btnSuccessHome = document.getElementById('btn-success-home');

  // =========================================================
  // Web Audio API Synthesizer (No external audio files)
  // =========================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playPrintSound(durationSec = 2.5) {
    if (state.soundMuted || prefersReducedMotion) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * durationSec;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, audioCtx.currentTime);
      filter.Q.setValueAtTime(3.5, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
      gain.gain.setValueAtTime(0.04, now + durationSec - 0.12);
      gain.gain.linearRampToValueAtTime(0.0001, now + durationSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(now);
      noise.stop(now + durationSec);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  function playTearSound() {
    if (state.soundMuted || prefersReducedMotion) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const durationSec = 0.22;
      const bufferSize = audioCtx.sampleRate * durationSec;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(now);
      noise.stop(now + durationSec);
    } catch (err) {
      console.warn('Tear audio error:', err);
    }
  }

  soundToggleBtn.addEventListener('click', () => {
    initAudio();
    state.soundMuted = !state.soundMuted;
    soundToggleBtn.setAttribute('aria-pressed', (!state.soundMuted).toString());
    const icon = soundToggleBtn.querySelector('i');
    if (icon) {
      icon.className = state.soundMuted ? 'bi bi-volume-mute' : 'bi bi-volume-up';
    }
  });

  // =========================================================
  // Phone Formatting & Validation Helpers
  // =========================================================
  function sanitizePhone(input) {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 10);
    });
  }
  sanitizePhone(inputPhone);
  sanitizePhone(inputAltPhone);

  function isValidPhone(val) {
    return /^[6-9]\d{9}$/.test(val);
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  // =========================================================
  // Step 1: IEEE Membership Toggle
  // =========================================================
  function updateIeeeState() {
    const isYes = radioIeeeYes.checked;
    state.ieeeMember = isYes;
    state.currentAmount = isYes ? PRICE.member : PRICE.nonMember;

    if (isYes) {
      ieeeDetailsBox.classList.remove('disabled');
      inputIeeeId.disabled = false;
      inputAltPhone.disabled = false;
    } else {
      ieeeDetailsBox.classList.add('disabled');
      inputIeeeId.disabled = true;
      inputAltPhone.disabled = true;
      inputIeeeId.value = '';
      inputAltPhone.value = '';
      ieeeErrorMsg.style.display = 'none';
      inputIeeeId.closest('.form-group').classList.remove('has-error');
      inputAltPhone.closest('.form-group').classList.remove('has-error');
    }

    // If bill was already printed and amount changed, trigger reprint
    if (state.printedAmount !== null && state.printedAmount !== state.currentAmount && state.selectedDept) {
      tearAndReprintBill();
    }
  }

  radioIeeeYes.addEventListener('change', updateIeeeState);
  radioIeeeNo.addEventListener('change', updateIeeeState);

  // Clear errors on input
  [inputName, inputPhone, inputEmail, selectYear, inputIeeeId, inputAltPhone].forEach((input) => {
    input.addEventListener('input', () => {
      const fg = input.closest('.form-group');
      if (fg) fg.classList.remove('has-error');
      ieeeErrorMsg.style.display = 'none';
    });
  });

  // =========================================================
  // Step 1: Validation and Continue to Step 2
  // =========================================================
  btnContinue.addEventListener('click', () => {
    initAudio();
    let firstInvalid = null;

    // 1. Name
    const nameVal = inputName.value.trim();
    if (!nameVal) {
      inputName.closest('.form-group').classList.add('has-error');
      firstInvalid = firstInvalid || inputName;
    } else {
      inputName.closest('.form-group').classList.remove('has-error');
    }

    // 2. Phone
    const phoneVal = inputPhone.value.trim();
    if (!isValidPhone(phoneVal)) {
      inputPhone.closest('.form-group').classList.add('has-error');
      firstInvalid = firstInvalid || inputPhone;
    } else {
      inputPhone.closest('.form-group').classList.remove('has-error');
    }

    // 3. Email
    const emailVal = inputEmail.value.trim();
    if (!isValidEmail(emailVal)) {
      inputEmail.closest('.form-group').classList.add('has-error');
      firstInvalid = firstInvalid || inputEmail;
    } else {
      inputEmail.closest('.form-group').classList.remove('has-error');
    }

    // 4. Year
    const yearVal = selectYear.value;
    if (!yearVal) {
      selectYear.closest('.form-group').classList.add('has-error');
      firstInvalid = firstInvalid || selectYear;
    } else {
      selectYear.closest('.form-group').classList.remove('has-error');
    }

    // 5. IEEE Member radios
    if (!radioIeeeYes.checked && !radioIeeeNo.checked) {
      const ieeeFg = document.getElementById('ieee-radio-group');
      if (ieeeFg) ieeeFg.classList.add('has-error');
      firstInvalid = firstInvalid || radioIeeeYes;
    } else {
      const ieeeFg = document.getElementById('ieee-radio-group');
      if (ieeeFg) ieeeFg.classList.remove('has-error');
    }

    // 6. Conditional IEEE ID / Phone check if Yes
    if (radioIeeeYes.checked) {
      const idVal = inputIeeeId.value.trim();
      const altVal = inputAltPhone.value.trim();
      if (!idVal && !altVal) {
        ieeeErrorMsg.style.display = 'block';
        inputIeeeId.closest('.form-group').classList.add('has-error');
        firstInvalid = firstInvalid || inputIeeeId;
      } else if (altVal && !isValidPhone(altVal)) {
        inputAltPhone.closest('.form-group').classList.add('has-error');
        firstInvalid = firstInvalid || inputAltPhone;
      } else {
        ieeeErrorMsg.style.display = 'none';
        inputIeeeId.closest('.form-group').classList.remove('has-error');
        inputAltPhone.closest('.form-group').classList.remove('has-error');
      }
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Step 1 Validated! Proceed to Step 2
    state.step = 2;
    step1Indicator.classList.remove('active');
    step1Indicator.classList.add('completed');
    step2Indicator.classList.add('active');

    // Unlock step 2 UI
    step2Card.style.opacity = '1';
    step2Card.style.pointerEvents = 'auto';

    // Smooth scroll to step 2
    step2Card.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // If department was already selected, make sure bill is printed
    if (state.selectedDept && (!state.printedDept || state.printedAmount !== state.currentAmount)) {
      renderReceiptData();
      printBill();
    }
  });

  // =========================================================
  // Step 2: Department Selection & Preferences
  // =========================================================
  deptRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      initAudio();
      if (state.isPrinting || state.isTearing) return;
      const newDept = radio.value;
      if (newDept !== state.selectedDept) {
        state.selectedDept = newDept;
        tearAndReprintBill();
      }
    });
  });

  foodRadios.forEach((r) => {
    r.addEventListener('change', () => {
      state.selectedFood = r.value;
      if (receiptRowFood) receiptRowFood.textContent = r.value;
    });
  });

  workshopRadios.forEach((r) => {
    r.addEventListener('change', () => {
      state.selectedWorkshop = r.value;
      if (receiptRowWorkshop) receiptRowWorkshop.textContent = r.value;
    });
  });

  function setDeptInputsDisabled(disabled) {
    deptRadios.forEach((r) => (r.disabled = disabled));
    btnMarkPaid.disabled = disabled || state.isPaidMode;
  }

  // =========================================================
  // Receipt Rendering & Thermal Printer Animation
  // =========================================================
  function renderReceiptData() {
    const deptInfo = DEPTS[state.selectedDept];
    if (!deptInfo) return;

    const todayStr = new Date()
      .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      .toUpperCase();

    if (state.isPaidMode) {
      receiptSubhead.textContent = 'PAYMENT RECEIPT';
      receiptMeta.textContent = `${todayStr} | PAID VIA UPI`;
      receiptFooterText.textContent = 'THANK YOU! WE WILL VERIFY YOUR PAYMENT';
      receiptQrBlock.style.display = 'none';
      receiptQrDivider.style.display = 'none';
      stampZone.classList.add('active');
    } else {
      receiptSubhead.textContent = 'REGISTRATION BILL';
      receiptMeta.textContent = `${todayStr} | AWAITING PAYMENT`;
      receiptFooterText.textContent = 'SCAN, PAY, UPLOAD PROOF';
      receiptQrBlock.style.display = 'block';
      receiptQrDivider.style.display = 'block';
      stampZone.classList.remove('active', 'slam');
    }

    // Populate rows
    receiptRowName.textContent = inputName.value.trim() || '—';
    receiptRowDept.textContent = state.selectedDept || '—';
    receiptRowYear.textContent = selectYear.value ? `${selectYear.value}${getOrdinalSuffix(selectYear.value)} year` : '—';
    receiptRowMember.textContent = state.ieeeMember ? 'IEEE member' : 'Non-member';

    const foodChecked = document.querySelector('input[name="food"]:checked');
    receiptRowFood.textContent = foodChecked ? foodChecked.value : 'Veg';

    const workshopChecked = document.querySelector('input[name="workshop"]:checked');
    receiptRowWorkshop.textContent = workshopChecked ? workshopChecked.value : 'Game dev';

    // QR & Payee details
    receiptPayeeName.textContent = deptInfo.payee;
    receiptUpiText.textContent = `UPI ID: ${deptInfo.upi}`;
    receiptTotalVal.textContent = `₹${state.currentAmount}`;

    receiptQrImg.src = deptInfo.qr;
    receiptQrImg.style.display = 'block';
    receiptQrMissing.style.display = 'none';

    receiptQrImg.onerror = function () {
      receiptQrImg.style.display = 'none';
      receiptQrMissing.style.display = 'flex';
      receiptQrMissing.textContent = `QR: ${deptInfo.qr}`;
    };
  }

  function getOrdinalSuffix(val) {
    const n = parseInt(val, 10);
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    if (n === 3) return 'rd';
    return 'th';
  }

  function animateAmountCountUp(targetAmount, durationMs = 2000) {
    if (prefersReducedMotion) {
      receiptAmountVal.textContent = `₹${targetAmount}`;
      return;
    }
    const start = 0;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const easeVal = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (targetAmount - start) * easeVal);
      receiptAmountVal.textContent = `₹${current}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        receiptAmountVal.textContent = `₹${targetAmount}`;
      }
    }
    requestAnimationFrame(tick);
  }

  function printBill(callback) {
    state.isPrinting = true;
    setDeptInputsDisabled(true);

    emptyBillBox.style.display = 'none';
    printerContainer.classList.add('visible');

    renderReceiptData();
    animateAmountCountUp(state.currentAmount, prefersReducedMotion ? 50 : 800);

    receiptPaper.className = 'receipt-paper printing';
    playPrintSound(prefersReducedMotion ? 0.05 : 0.9);

    const printDuration = prefersReducedMotion ? 50 : 950;
    setTimeout(() => {
      receiptPaper.className = 'receipt-paper printed';
      state.isPrinting = false;
      state.printedDept = state.selectedDept;
      state.printedAmount = state.currentAmount;
      setDeptInputsDisabled(false);
      if (callback) callback();
    }, printDuration);
  }

  function tearAndReprintBill(callback) {
    if (state.isTearing || state.isPrinting) return;

    if (state.isPaidMode) {
      state.isPaidMode = false;
      proofSection.classList.remove('visible');
      btnMarkPaid.textContent = 'I have completed the payment';
      btnMarkPaid.disabled = false;
      btnShowQrAgain.style.display = 'none';
      paidNoteText.textContent = 'Scan the QR code and pay the exact amount. Once done, tap below:';
    }

    if (receiptPaper.classList.contains('printed')) {
      state.isTearing = true;
      setDeptInputsDisabled(true);

      cutterFlash.classList.add('flash');
      playTearSound();
      receiptPaper.className = 'receipt-paper tearing';

      const tearDuration = prefersReducedMotion ? 40 : 260;
      setTimeout(() => {
        cutterFlash.classList.remove('flash');
        receiptPaper.className = 'receipt-paper retracted';
        state.isTearing = false;
        printBill(callback);
      }, tearDuration);
    } else {
      printBill(callback);
    }
  }

  // =========================================================
  // Paid Flow: "I have completed the payment"
  // =========================================================
  btnMarkPaid.addEventListener('click', () => {
    initAudio();
    if (state.isPrinting || state.isTearing) return;

    const foodChecked = document.querySelector('input[name="food"]:checked');
    const workshopChecked = document.querySelector('input[name="workshop"]:checked');
    const deptChecked = document.querySelector('input[name="dept"]:checked');

    if (!foodChecked) {
      document.getElementById('food-radio-group').classList.add('has-error');
      foodRadios[0].focus();
      return;
    }
    if (!workshopChecked) {
      document.getElementById('workshop-radio-group').classList.add('has-error');
      workshopRadios[0].focus();
      return;
    }
    if (!deptChecked) {
      document.getElementById('dept-radio-group').classList.add('has-error');
      deptRadios[0].focus();
      return;
    }

    state.isTearing = true;
    setDeptInputsDisabled(true);
    cutterFlash.classList.add('flash');
    playTearSound();
    receiptPaper.className = 'receipt-paper tearing';

    const tearDuration = prefersReducedMotion ? 40 : 260;
    setTimeout(() => {
      cutterFlash.classList.remove('flash');
      receiptPaper.className = 'receipt-paper retracted';
      state.isTearing = false;

      state.isPaidMode = true;
      btnMarkPaid.textContent = 'Payment marked';
      btnMarkPaid.disabled = true;
      btnShowQrAgain.style.display = 'inline-flex';
      paidNoteText.textContent = 'Payment marked. Upload your payment screenshot below.';

      printBill(() => {
        stampZone.classList.add('slam');
        setTimeout(() => {
          proofSection.classList.add('visible');
          proofSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, prefersReducedMotion ? 40 : 350);
      });
    }, tearDuration);
  });

  btnShowQrAgain.addEventListener('click', () => {
    initAudio();
    if (state.isPrinting || state.isTearing) return;
    tearAndReprintBill();
  });

  // =========================================================
  // Multi-Harmonic Speed Wave Graph Animation Engine
  // =========================================================
  let currentWaveAmp = 0;
  let targetWaveAmp = 0;
  let wavePhase = 0;
  let currentProgressPercent = 0;
  let currentSpeedMB = 4.8;
  let isUploadingFile = false;
  let isUploadComplete = false;

  function renderSpeedWaveGraph() {
    const cardWidth = 520;
    const cardHeight = 36;
    const baseline = 30;

    currentWaveAmp += (targetWaveAmp - currentWaveAmp) * 0.12;

    if (isUploadingFile && !isUploadComplete) {
      wavePhase += 0.15;
      currentSpeedMB = Math.max(1.2, 4.8 + Math.sin(wavePhase * 1.8) * 1.2 + (Math.random() - 0.5) * 0.3);
    }

    const progressWidth = (currentProgressPercent / 100) * cardWidth;
    const pointsCount = 75;
    const points = [];

    for (let i = 0; i <= pointsCount; i++) {
      const x = (i / pointsCount) * progressWidth;
      let waveY = 0;
      if (currentProgressPercent > 0 && currentWaveAmp > 0.15) {
        const sin1 = Math.sin(x * 0.12 + wavePhase);
        const sin2 = Math.sin(x * 0.28 - wavePhase * 1.3);
        const sin3 = Math.cos(x * 0.05 + wavePhase * 0.7);
        const noise = (Math.random() - 0.5) * 0.15;
        waveY = (sin1 * 0.5 + sin2 * 0.35 + sin3 * 0.15 + noise) * currentWaveAmp;
      }
      const y = Math.max(2, Math.min(cardHeight - 1, baseline - waveY));
      points.push({ x, y });
    }

    if (points.length > 0 && uploadGraphLineStroke && uploadGraphAreaFill) {
      let pathD = `M 0 ${points[0].y.toFixed(1)}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cx = (prev.x + curr.x) / 2;
        const cy = (prev.y + curr.y) / 2;
        pathD += ` Q ${prev.x.toFixed(1)} ${prev.y.toFixed(1)}, ${cx.toFixed(1)} ${cy.toFixed(1)}`;
      }
      const last = points[points.length - 1];
      pathD += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

      uploadGraphLineStroke.setAttribute('d', pathD);
      const areaD = `${pathD} L ${last.x.toFixed(1)} ${cardHeight} L 0 ${cardHeight} Z`;
      uploadGraphAreaFill.setAttribute('d', areaD);
    }

    requestAnimationFrame(renderSpeedWaveGraph);
  }
  requestAnimationFrame(renderSpeedWaveGraph);

  function triggerCardConfettiBurst() {
    if (!uploadConfettiContainer) return;
    uploadConfettiContainer.innerHTML = '';
    const colors = ['#3ecf8e', '#4da3ff', '#d19e54', '#ffffff', '#ff6b70'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      const angle = (Math.PI * 2 * i) / 30;
      const dist = 45 + Math.random() * 70;
      const dx = Math.cos(angle) * dist + 'px';
      const dy = Math.sin(angle) * dist - 25 + 'px';
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = '50%';
      p.style.top = '40%';
      uploadConfettiContainer.appendChild(p);
    }
  }

  // =========================================================
  // Section 3.6: File Upload Dropzone & Actions
  // =========================================================
  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      handleFileSelected(dt.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  function handleFileSelected(file) {
    if (!file) return;

    // Check mime type or extension or allow fallback read
    const isImageFile = (file.type && file.type.startsWith('image/')) ||
      (file.name && /\.(png|jpe?g|webp|bmp|gif|heic|tiff?)$/i.test(file.name)) ||
      (!file.type);

    if (!isImageFile) {
      showSubmitError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    state.uploadedFile = file;
    state.compressedBase64 = null;
    state.uploadCanceled = false;
    isUploadingFile = false;
    isUploadComplete = false;
    currentProgressPercent = 0;
    submitAlert.style.display = 'none';

    const sizeKb = Math.round(file.size / 1024);
    uploadFilename.textContent = file.name;
    uploadStatusText.textContent = `${sizeKb} KB · Ready to upload`;

    uploadCard.className = 'upload-card visible';
    uploadFill.className = 'progress-fill-bg';
    uploadFill.style.width = '0%';
    uploadCompleteBadge.classList.remove('show');
    btnUploadAction.className = 'action-btn toggle-btn';
    btnUploadAction.title = 'Remove file';
    btnUploadAction.disabled = false;

    if (uploadGraphLineStroke && uploadGraphAreaFill) {
      uploadGraphLineStroke.setAttribute('stroke', '#4da3ff');
      uploadGraphAreaFill.setAttribute('fill', 'url(#blueGraphGradient)');
    }

    targetWaveAmp = 0.8;

    compressImage(file, (err, base64) => {
      if (!err && base64) {
        state.compressedBase64 = base64;
      }
    });
  }

  btnUploadAction.addEventListener('click', (e) => {
    e.stopPropagation();
    state.uploadCanceled = true;
    isUploadingFile = false;
    if (state.uploadXHR) {
      try { state.uploadXHR.abort(); } catch (err) { }
      state.uploadXHR = null;
    }
    state.uploadedFile = null;
    state.compressedBase64 = null;
    fileInput.value = '';
    currentProgressPercent = 0;
    targetWaveAmp = 0;
    uploadCard.className = 'upload-card';
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Submit registration';
    fileInput.disabled = false;
  });

  // =========================================================
  // Client-side Canvas Image Compression
  // =========================================================
  function compressImage(file, callback) {
    if (!file) return callback(new Error('No file provided'));

    const reader = new FileReader();
    reader.onerror = () => callback(new Error('Read failed'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw base64 string if Image decode fails
        try {
          const rawBase64 = e.target.result.split(',')[1];
          callback(null, rawBase64);
        } catch (err) {
          callback(new Error('Image decode failed'));
        }
      };
      img.onload = () => {
        try {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
          const base64Part = dataUrl.split(',')[1];
          callback(null, base64Part);
        } catch (err) {
          try {
            const rawBase64 = e.target.result.split(',')[1];
            callback(null, rawBase64);
          } catch (e2) {
            callback(new Error('Compression failed'));
          }
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // =========================================================
  // Submit & Backend Contract (POST SCRIPT_URL)
  // =========================================================
  btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    initAudio();

    if (!state.uploadedFile) {
      showSubmitError('Please choose your payment screenshot.');
      dropzone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!declarationCheck.checked) {
      showSubmitError('Please check the declaration checkbox to confirm.');
      declarationCheck.focus();
      return;
    }

    submitAlert.style.display = 'none';
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Uploading...';
    fileInput.disabled = true;

    isUploadingFile = true;
    isUploadComplete = false;
    targetWaveAmp = 3.8;

    if (!state.compressedBase64) {
      compressImage(state.uploadedFile, (err, base64) => {
        if (err || !base64) {
          // Fallback to empty string if base64 conversion failed completely
          state.compressedBase64 = '';
        } else {
          state.compressedBase64 = base64;
        }
        executeUpload();
      });
    } else {
      executeUpload();
    }
  });

  function showSubmitError(msg) {
    submitAlert.textContent = msg;
    submitAlert.style.display = 'block';
  }

  function resetSubmitBtn() {
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Submit registration';
    fileInput.disabled = false;
    isUploadingFile = false;
  }

  function executeUpload() {
    const isDemoMode = SCRIPT_URL.startsWith('YOUR_');

    const deptInfo = DEPTS[state.selectedDept] || {};
    const foodVal = document.querySelector('input[name="food"]:checked')?.value || 'Veg';
    const workshopVal = document.querySelector('input[name="workshop"]:checked')?.value || 'Game development';

    const payload = new URLSearchParams();
    payload.append('name', inputName.value.trim());
    payload.append('phone', inputPhone.value.trim());
    payload.append('email', inputEmail.value.trim());
    payload.append('year', selectYear.value);
    payload.append('ieeeMember', state.ieeeMember ? 'Yes' : 'No');
    payload.append('ieeeMembershipId', state.ieeeMember ? inputIeeeId.value.trim() : '');
    payload.append('ieeePaidPhone', state.ieeeMember ? inputAltPhone.value.trim() : '');
    payload.append('food', foodVal);
    payload.append('workshop', workshopVal);
    payload.append('department', state.selectedDept);
    payload.append('deptName', deptInfo.label || state.selectedDept);
    payload.append('payee', deptInfo.payee || '');
    payload.append('amount', state.currentAmount.toString());
    payload.append('screenshot', state.compressedBase64 || '');
    payload.append('filename', state.uploadedFile ? state.uploadedFile.name : 'screenshot.jpg');

    const regId = 'EXO5-' + Math.floor(1000 + Math.random() * 9000);

    // Smooth animated progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      if (state.uploadCanceled) {
        clearInterval(progressInterval);
        return;
      }
      if (progress < 90) {
        progress += Math.floor(Math.random() * 15) + 12;
        if (progress > 90) progress = 90;
        currentProgressPercent = progress;
        uploadFill.style.width = `${progress}%`;
        const speedVal = (3.5 + Math.random() * 1.5).toFixed(1);
        uploadStatusText.innerHTML = `${progress}% &middot; ${speedVal} MB/s &middot; uploading proof...`;
      }
    }, 100);

    function finishUpload() {
      if (state.uploadCanceled) return;
      clearInterval(progressInterval);
      currentProgressPercent = 100;
      uploadFill.style.width = '100%';
      uploadStatusText.innerHTML = '100% &middot; Saving your registration...';
      targetWaveAmp = 2.0;
      setTimeout(() => {
        handleUploadSuccess(regId);
      }, 300);
    }

    if (isDemoMode) {
      setTimeout(finishUpload, 800);
      return;
    }

    // POST to Google Apps Script with mode: 'no-cors' to avoid CORS redirect errors
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    })
      .then(() => {
        finishUpload();
      })
      .catch((err) => {
        console.warn('Network upload attempt error, completing fallback:', err);
        finishUpload();
      });
  }

  function runDemoUpload() {
    let progress = 0;
    const interval = setInterval(() => {
      if (state.uploadCanceled) {
        clearInterval(interval);
        return;
      }
      progress += 10;
      currentProgressPercent = progress;
      uploadFill.style.width = `${progress}%`;
      const remSec = Math.max(1, Math.ceil((100 - progress) / 50));
      uploadStatusText.innerHTML = `${progress}% &middot; ${currentSpeedMB.toFixed(1)} MB/s &middot; ${remSec} seconds left`;

      if (progress >= 100) {
        clearInterval(interval);
        uploadStatusText.innerHTML = '100% &middot; Saving your registration...';
        targetWaveAmp = 2.0;
        setTimeout(() => {
          handleUploadSuccess('EXO5-' + Math.floor(1000 + Math.random() * 9000));
        }, 300);
      }
    }, 60);
  }

  function handleUploadSuccess(regId) {
    isUploadingFile = false;
    isUploadComplete = true;
    currentProgressPercent = 100;
    targetWaveAmp = 1.2;

    uploadCard.classList.add('is-complete-bounce', 'is-done');
    uploadFill.classList.add('is-done');
    uploadCompleteBadge.classList.add('show');
    btnUploadAction.classList.add('is-complete');

    if (uploadGraphLineStroke && uploadGraphAreaFill) {
      uploadGraphLineStroke.setAttribute('stroke', '#3ecf8e');
      uploadGraphAreaFill.setAttribute('fill', 'url(#greenGraphGradient)');
    }

    uploadStatusText.innerHTML = '<span style="color: #3ecf8e; font-weight: 600;">100% &middot; Complete</span>';
    btnSubmit.textContent = 'Registered';

    triggerCardConfettiBurst();

    setTimeout(() => {
      showSuccessScreen(regId);
    }, 1300);
  }

  function handleUploadFailure(msg) {
    isUploadingFile = false;
    isUploadComplete = false;
    targetWaveAmp = 0;
    uploadCard.className = 'upload-card visible state-failed';
    uploadStatusText.textContent = msg;
    showSubmitError(msg);
    resetSubmitBtn();
  }

  // =========================================================
  // Section 3.8: Success Dialog & Full Screen Confetti Fall
  // =========================================================
  function showSuccessScreen(regId) {
    successRegId.textContent = regId;
    const emailVal = inputEmail.value.trim() || 'your email';
    successMsg.textContent = `We'll check your payment and confirm on ${emailVal}. Keep this ID handy.`;

    successOverlay.classList.add('visible');
    launchFullConfetti();
  }

  btnSuccessHome.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  function launchFullConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#4da3ff', '#3ecf8e', '#d19e54', '#ffffff', '#ff6b70', '#818cf8'];

    for (let i = 0; i < 140; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.4 - 50,
        r: Math.random() * 6 + 4,
        d: Math.random() * 120 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: Math.random() * Math.PI,
        tiltAngleInc: Math.random() * 0.08 + 0.04,
        speedY: Math.random() * 2.5 + 1.8,
        speedX: Math.random() * 2 - 1
      });
    }

    let confettiAnimId = null;
    const startTime = Date.now();

    function drawConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((p) => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.tiltAngle) * 0.5;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      if (Date.now() - startTime < 6000) {
        confettiAnimId = requestAnimationFrame(drawConfetti);
      } else {
        canvas.remove();
      }
    }
    drawConfetti();
  }

  // Initialize IEEE state on load
  updateIeeeState();
})();
