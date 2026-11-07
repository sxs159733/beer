/* 微醺手册 · 名酒图鉴 */
(function () {
  var CATS = window.WX.SPIRIT_CATS, LIST = window.WX.SPIRITS;
  var state = { cat: "baijiu", q: "" };
  var grid = document.getElementById("spiritGrid");
  var intro = document.getElementById("catIntro");
  var modal = document.getElementById("spiritModal");

  function cardHTML(s, idx) {
    return '<button class="spirit-card" data-idx="' + idx + '" aria-haspopup="dialog">' +
      '<span class="top"><strong>' + WX.esc(s.name) + '</strong><span class="en">' + WX.esc(s.en) + "</span></span>" +
      '<span class="facts"><span>产地 <b>' + WX.esc(s.origin) + "</b></span><span>度数 <b>" + WX.esc(s.abv) + "</b></span></span>" +
      '<span class="price">' + WX.esc(s.price) + "</span>" +
      '<span class="muted small">' + WX.esc(s.taste) + "</span></button>";
  }

  function render() {
    var cat = CATS.find(function (c) { return c.id === state.cat; });
    intro.innerHTML = "<h3>" + WX.esc(cat.label) + " · 它是怎么来的</h3><p class='muted'>" + WX.esc(cat.intro) + "</p>" +
      '<div class="process">' + cat.process.map(function (p, i) {
        return (i ? '<span class="arrow">→</span>' : "") + '<span class="step">' + WX.esc(p) + "</span>";
      }).join("") + "</div>";
    var q = state.q.trim().toLowerCase();
    var items = [];
    LIST.forEach(function (s, idx) {
      if (s.cat !== state.cat) return;
      if (q && (s.name + s.en + s.origin + s.taste).toLowerCase().indexOf(q) === -1) return;
      items.push(cardHTML(s, idx));
    });
    grid.innerHTML = items.length ? items.join("") :
      '<div class="empty-state" style="grid-column:1/-1">这个分类下没有匹配的酒款，换个关键词试试。</div>';
    document.getElementById("spiritCount").textContent = "本分类 " + items.length + " 款 · 价格为市场参考区间，随渠道与行情波动";
  }

  document.getElementById("spiritTabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-scat]");
    if (!b) return;
    state.cat = b.getAttribute("data-scat");
    document.querySelectorAll("[data-scat]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    render();
  });
  document.getElementById("spiritSearch").addEventListener("input", function (e) { state.q = e.target.value; render(); });

  grid.addEventListener("click", function (e) {
    var c = e.target.closest(".spirit-card");
    if (!c) return;
    var s = LIST[parseInt(c.getAttribute("data-idx"), 10)];
    document.getElementById("sName").textContent = s.name;
    document.getElementById("sEn").textContent = s.en;
    document.getElementById("sFacts").innerHTML =
      '<span class="tag plain">产地 ' + WX.esc(s.origin) + '</span> <span class="tag plain">度数 ' + WX.esc(s.abv) + '</span> <span class="tag">参考价 ' + WX.esc(s.price) + "</span>";
    document.getElementById("sTaste").textContent = s.taste;
    document.getElementById("sBrew").textContent = s.brew;
    document.getElementById("sUses").textContent = s.uses;
    if (!modal.open) modal.showModal();
  });
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
  document.getElementById("sClose").addEventListener("click", function () { modal.close(); });

  /* tabs */
  document.getElementById("spiritTabs").innerHTML = CATS.map(function (c, i) {
    return '<button class="chip" data-scat="' + c.id + '" aria-pressed="' + (i === 0 ? "true" : "false") + '">' + c.label + "</button>";
  }).join("");
  render();
})();