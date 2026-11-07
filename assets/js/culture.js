/* 微醺手册 · 酒文化与产地 */
(function () {
  /* timeline accordion */
  var tl = document.getElementById("timeline");
  tl.innerHTML = WX.TIMELINE.map(function (t, i) {
    return '<div class="tl-item' + (i === 0 ? " open" : "") + '">' +
      '<button aria-expanded="' + (i === 0 ? "true" : "false") + '"><span class="tl-era">' + WX.esc(t.era) + '</span><span class="tl-year">' + WX.esc(t.year) + '</span><span class="hint">展开</span></button>' +
      '<div class="tl-detail">' + WX.esc(t.detail) + "</div></div>";
  }).join("");
  tl.addEventListener("click", function (e) {
    var b = e.target.closest(".tl-item button");
    if (!b) return;
    var item = b.parentElement;
    var open = item.classList.toggle("open");
    b.setAttribute("aria-expanded", open ? "true" : "false");
    b.querySelector(".hint").textContent = open ? "收起" : "展开";
  });

  /* region tabs */
  var labels = { cn: "中国", eu: "欧洲", am: "美洲", as: "亚洲·新现场" };
  var tabs = document.getElementById("regionTabs");
  var grid = document.getElementById("regionGrid");
  function renderRegions(key) {
    grid.innerHTML = WX.REGIONS[key].map(function (r) {
      return '<article class="card region-card"><span class="place">' + WX.esc(r.place) + "</span><h3>" + WX.esc(r.title) + "</h3><p class='muted small'>" + WX.esc(r.desc) + "</p></article>";
    }).join("");
  }
  tabs.innerHTML = Object.keys(labels).map(function (k, i) {
    return '<button class="chip" data-region="' + k + '" aria-pressed="' + (i === 0 ? "true" : "false") + '">' + labels[k] + "</button>";
  }).join("");
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest("[data-region]");
    if (!b) return;
    tabs.querySelectorAll("[data-region]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    renderRegions(b.getAttribute("data-region"));
  });
  renderRegions("cn");

  /* poems */
  document.getElementById("poemGrid").innerHTML = WX.POEMS.map(function (p) {
    return '<article class="card quote-card"><div class="verse">' + WX.esc(p.verse) + '</div><div class="who">—— ' + WX.esc(p.who) + "</div></article>";
  }).join("");
})();