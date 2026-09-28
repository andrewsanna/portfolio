var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header picks up a hairline once the page scrolls
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Fade sections in as they scroll into view
(function () {
  var targets = document.querySelectorAll('.page-head, .sec-head, .project, .plan, .note, .steps li, .principles > div, .tile, .big-quote, .about, .contact, .cta-card, .meta');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  targets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
    // Stagger items that sit side by side (pricing cards, steps, tiles)
    var siblings = el.parentElement.querySelectorAll(':scope > .plan, :scope > li, :scope > .tile, :scope > div');
    var i = Array.prototype.indexOf.call(siblings, el);
    if (i > 0 && !el.classList.contains('project')) el.style.transitionDelay = (i * 0.1) + 's';
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { io.observe(el); });
})();

// Headlines rise in word by word, keeping italic accent words
(function () {
  if (reduceMotion) return;

  var esc = function (w) { return w.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  document.querySelectorAll('.hero h1, .sec-head h2, .page-head h1, .about h1, .contact h1, .cta-card h2, .big-quote').forEach(function (el) {
    var n = 0, html = [];
    el.setAttribute('aria-label', el.textContent.trim());
    el.childNodes.forEach(function (node) {
      var words = node.textContent.split(/(\s+)/);
      var out = words.map(function (w) {
        if (!w) return '';
        if (/^\s+$/.test(w)) return ' ';
        return '<span class="w" aria-hidden="true" style="transition-delay:' + (n++ * 0.055) + 's">' + esc(w) + '</span>';
      }).join('');
      html.push(node.nodeType === 1 ? '<' + node.tagName.toLowerCase() + '>' + out + '</' + node.tagName.toLowerCase() + '>' : out);
    });
    el.innerHTML = html.join('');
    el.classList.add('split');
  });

  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () {
    requestAnimationFrame(function () { hero.classList.add('in'); });
  });
})();

// Home screenshots drift gently with the pointer
(function () {
  var collage = document.querySelector('.collage');
  if (!collage || reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
  var hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    collage.style.setProperty('--px', x.toFixed(3));
    collage.style.setProperty('--py', y.toFixed(3));
  });
  hero.addEventListener('pointerleave', function () {
    collage.style.setProperty('--px', 0);
    collage.style.setProperty('--py', 0);
  });
})();
