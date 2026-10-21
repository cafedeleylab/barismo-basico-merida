(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var journey = document.querySelector('.motion-journey');
  var steps = journey ? Array.from(journey.querySelectorAll('[data-step]')) : [];
  var photos = journey ? Array.from(journey.querySelectorAll('[data-journey-image]')) : [];
  var counter = journey ? journey.querySelector('[data-journey-counter]') : null;
  var progress = journey ? journey.querySelector('[data-journey-progress]') : null;
  var ribbon = document.querySelector('.motion-ribbon-track');

  function activateStep(index) {
    steps.forEach(function (step, i) { step.classList.toggle('is-active', i === index); });
    photos.forEach(function (photo, i) { photo.classList.toggle('is-active', i === index); });
    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    if (progress) progress.style.width = ((index + 1) / steps.length * 100) + '%';
  }

  if (steps.length) activateStep(0);

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = Array.from(document.querySelectorAll(
      '.section-head, .intro-specs, .day-card, .cert-panel, .why-copy, .instructor-row, .price-panel, .steps-banner, .step, .loc-panel, .final .wrap, .journey-intro'
    ));
    targets.forEach(function (target, index) {
      target.setAttribute('data-motion', index % 2 ? 'right' : 'left');
      target.style.setProperty('--enter-delay', (index % 3) * 70 + 'ms');
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });
    document.documentElement.classList.add('motion-ready');
    targets.forEach(function (target) { observer.observe(target); });
  }

  var scheduled = false;
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      if (steps.length && !reduceMotion) {
        var focus = window.innerHeight * 0.5;
        var closest = 0;
        var distance = Infinity;
        steps.forEach(function (step, i) {
          var rect = step.getBoundingClientRect();
          var delta = Math.abs((rect.top + rect.bottom) / 2 - focus);
          if (delta < distance) { distance = delta; closest = i; }
        });
        activateStep(closest);
      }
      if (ribbon && !reduceMotion) {
        var rect = ribbon.parentElement.getBoundingClientRect();
        var viewProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        ribbon.style.setProperty('--ribbon-x', (-120 * viewProgress) + 'px');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();
