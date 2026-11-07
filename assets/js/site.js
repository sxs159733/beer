/* 微醺手册 · shared utilities */
(function () {
  window.WX = window.WX || {};

  /* mobile nav */
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".nav-toggle");
    if (t) {
      var links = document.getElementById("navLinks");
      var open = links.classList.toggle("open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
    }
  });

  /* scroll reveal */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    });
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    });
  }

  WX.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* simple rocks-glass illustration for recipes without a photo */
  WX.glassSVG = function (color) {
    var c = color || "#d9a53c";
    return '<svg viewBox="0 0 120 120" role="img" aria-label="鸡尾酒示意">' +
      '<defs><linearGradient id="g' + c.replace("#", "") + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + c + '" stop-opacity="0.55"/>' +
      '<stop offset="1" stop-color="' + c + '" stop-opacity="0.95"/></linearGradient></defs>' +
      '<path d="M28 22 L34 102 Q34 108 40 108 L80 108 Q86 108 86 102 L92 22 Z" fill="none" stroke="#b9a98f" stroke-width="3"/>' +
      '<path d="M32 46 L36 100 Q36 104 40 104 L80 104 Q84 104 84 100 L88 46 Z" fill="url(#g' + c.replace("#", "") + ')"/>' +
      '<rect x="42" y="34" width="16" height="16" rx="3" fill="#ffffff" opacity="0.75" transform="rotate(-12 50 42)"/>' +
      '<rect x="62" y="40" width="15" height="15" rx="3" fill="#ffffff" opacity="0.6" transform="rotate(14 69 47)"/>' +
      '<path d="M28 22 L92 22" stroke="#b9a98f" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="78" cy="20" r="7" fill="' + c + '" opacity="0.9"/>' +
      '<path d="M78 13 q3 -6 8 -7" stroke="#7d8f5a" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>';
  };

  /* quantity formatting with serving multiplier */
  WX.fmtQty = function (ing, mult) {
    var q = ing.q, u = ing.u;
    if (q == null) return u;                      /* 补满 */
    if (u === "分满" || u === "杯") return q + " " + u;  /* relative to glass */
    var v = q * mult;
    if (u === "ml" || u === "g") v = Math.round(v);
    else v = Math.round(v * 2) / 2;
    return v + " " + u;
  };

  WX.diffStars = function (d) { return "●".repeat(d) + "○".repeat(3 - d); };

  WX.copyText = function (text, btn) {
    function done(ok) {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = ok ? "已复制 ✓" : "复制失败";
      setTimeout(function () { btn.textContent = old; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta); done(ok);
    }
  };
})();