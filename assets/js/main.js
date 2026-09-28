// Fade sections in as they scroll into view
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.page-head, .sec-head, .project, .svc, .note, .steps li, .about, .cta-band .wrap');

  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  targets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
    // Stagger items that sit side by side (pricing rows, process steps)
    var siblings = el.parentElement.querySelectorAll(':scope > .svc, :scope > li');
    var i = Array.prototype.indexOf.call(siblings, el);
    if (i > 0) el.style.transitionDelay = (i * 0.12) + 's';
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();

// Headlines rise in word by word; the hero line cycles through client types
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.hero h1, .sec-head h1, .sec-head h2, .page-head h1, .about h1, .cta-band h2').forEach(function (el) {
    var text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map(function (w, i) {
      w = w.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      return '<span class="w" aria-hidden="true" style="transition-delay:' + (i * 0.06) + 's">' + w + '</span>';
    }).join(' ');
    el.classList.add('split');
  });

  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () {
    requestAnimationFrame(function () { hero.classList.add('in'); });
  });

  var word = document.querySelector('.rotator-word');
  if (word) {
    var words = word.dataset.words.split('|'), i = 0;
    setInterval(function () {
      word.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        word.textContent = words[i];
        word.classList.remove('out');
        word.classList.add('enter');
        void word.offsetWidth;
        word.classList.remove('enter');
      }, 350);
    }, 2600);
  }
})();
