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
  var targets = document.querySelectorAll('.sec-head, .project, .cta-card');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  targets.forEach(function (el) { el.setAttribute('data-reveal', ''); });

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

// The Home headline rises in word by word, keeping its italic accent words
(function () {
  if (reduceMotion) return;

  var esc = function (w) { return w.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  document.querySelectorAll('.hero h1').forEach(function (el) {
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
