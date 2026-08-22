/* ─────────────────────────────────────────────
   SHORTS Portfolio — main.js
   ───────────────────────────────────────────── */

'use strict';

// ── DOM Refs ────────────────────────────────
const copyEmailBtn    = document.getElementById('copy-email-btn');
const videoGrid       = document.getElementById('video-grid');
const videoCards      = document.querySelectorAll('.video-card');
const modalBackdrop   = document.getElementById('modal-backdrop');
const modalCloseBtn   = document.getElementById('modal-close-btn');
const modalPlayerWrap = document.getElementById('modal-player-wrap');
const modalTitle      = document.getElementById('modal-title');
const modalDesc       = document.getElementById('modal-desc');
const modalViews      = document.getElementById('modal-views');
const modalLikes      = document.getElementById('modal-likes');
const toast           = document.getElementById('toast');

document.querySelectorAll('.video-card__btn').forEach(cardButton => {
  cardButton.setAttribute('role', 'button');
  cardButton.setAttribute('tabindex', '0');

  const cardVideo = cardButton.querySelector('video');
  if (cardVideo) {
    cardVideo.muted = true;
    cardVideo.loop = true;
    cardVideo.playsInline = true;
    cardVideo.preload = 'metadata';
  }
});

// ── Copy Email Feature ───────────────────────
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    const email = 'dkfma4741@naver.com';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      const copyTextSpan = copyEmailBtn.querySelector('.copy-text');
      if (copyTextSpan) {
        const originalText = copyTextSpan.textContent;
        copyTextSpan.textContent = '완료!';
        setTimeout(() => { copyTextSpan.textContent = originalText; }, 2000);
      }
      showToast('이메일 주소가 복사되었습니다! ✨');
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  });
}

// ── Hero Stat Counter Animation ─────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.hero__stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach(el => {
        animateCounter(el, parseInt(el.dataset.count));
      });
    }
  });
}, { threshold: 0.5 });

if (statNums.length) {
  const statsContainer = statNums[0].closest('.hero__stats');
  if (statsContainer) statsObserver.observe(statsContainer);
}

// ── Scroll Reveal ────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section-header, .video-card, .about__inner').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ── Video Modal ──────────────────────────────
let currentVideoId = null;

function openModal(videoId, videoSrc, title, desc, views, likes) {
  currentVideoId = videoId;

  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalViews.textContent = views;
  modalLikes.textContent = likes;
  const video = document.createElement('video');
  video.src = videoSrc;
  video.title = title;
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'metadata';

  modalPlayerWrap.innerHTML = '';
  modalPlayerWrap.appendChild(video);

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => modalCloseBtn.focus());
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    modalPlayerWrap.innerHTML = '';
    currentVideoId = null;
  }, 300);
}

document.querySelectorAll('.video-card__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    openModal(
      btn.dataset.videoId,
      btn.querySelector('video').src,
      btn.dataset.title,
      btn.dataset.desc,
      btn.dataset.views,
      btn.dataset.likes
    );
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
    closeModal();
  }
});

// ── Toast Helper ─────────────────────────────
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
