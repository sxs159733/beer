/* 微醺手册 · 名酒图鉴 */
(function () {
  var CATS = window.WX.SPIRIT_CATS;
  var DEFAULTS = window.WX.CAT_PROFILE || {};
  var EXTRA = window.WX.SPIRIT_EXTRA || {};
  var TODO = "待补充";
  var state = { cat: "baijiu", q: "" };
  var grid = document.getElementById("spiritGrid");
  var intro = document.getElementById("catIntro");
  var modal = document.getElementById("spiritModal");

  /* 把原有档案与补充档案合并为统一的十字段结构；缺失一律标「待补充」 */
  function pick(v, fallback) {
    if (v && v !== TODO) return v;
    if (fallback && fallback !== TODO) return fallback;
    return TODO;
  }
  function expand(s) {
    var d = DEFAULTS[s.cat] || {};
    var p = EXTRA[s.name] || {};
    return {
      cat: s.cat, name: s.name, en: s.en || "", origin: s.origin || TODO,
      abv: s.abv || TODO, price: s.price || TODO,
      material: pick(p.material || s.material, d.material),
      brew: pick(p.brew || s.brew, d.brew),
      taste: pick(p.taste || s.taste, ""),
      sweet: pick(p.sweet || s.sweet, ""),
      body: pick(p.body || s.body, ""),
      finish: pick(p.finish || s.finish, ""),
      size: pick(p.size || s.size, d.size),
      temp: pick(p.temp || s.temp, d.temp),
      pairing: pick(p.pairing || s.pairing || s.uses, d.pairing),
      background: pick(p.background || s.background, "")
    };
  }
  var LIST = (window.WX.SPIRITS || []).concat(window.WX.SPIRITS_NEW || []).map(expand);

  function catLabel(k) {
    var c = CATS.find(function (x) { return x.id === k; });
    return c ? c.label : k;
  }
  function priceText(p) {
    return (p && p !== TODO) ? p : "参考价待补充";
  }
  function cardHTML(s, idx) {
    return '<button class="spirit-card" data-idx="' + idx + '" aria-haspopup="dialog">' +
      '<span class="top"><strong>' + WX.esc(s.name) + '</strong><span class="en">' + WX.esc(s.en) + "</span></span>" +
      '<span class="facts"><span>产地 <b>' + WX.esc(s.origin) + "</b></span><span>度数 <b>" + WX.esc(s.abv) + "</b></span></span>" +
      '<span class="sp-card-cat tag plain">' + WX.esc(catLabel(s.cat)) + "</span>" +
      '<span class="price">' + WX.esc(priceText(s.price)) + "</span>" +
      '<span class="muted small">' + WX.esc(s.taste === TODO ? "口感资料整理中" : s.taste) + "</span></button>";
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

  /* 详情弹窗：按统一字段分组呈现 */
  function field(label, value, wide) {
    var todo = !value || value === TODO;
    return '<div class="sp-field' + (wide ? ' sp-field--wide' : '') + '"><dt>' + label + '</dt>' +
      '<dd' + (todo ? ' class="sp-todo"' : '') + '>' + WX.esc(todo ? TODO : value) + '</dd></div>';
  }
  function group(title, rows) {
    return '<section class="sp-group"><h4 class="sp-group-title">' + title + '</h4><dl class="sp-fields">' + rows + "</dl></section>";
  }
  function profileHTML(s) {
    return group("基础档案",
        field("酒类与产地", catLabel(s.cat) + " · " + s.origin, true) +
        field("酒精度数", s.abv) + field("常见规格", s.size, true)) +
      group("香气与口感",
        field("总体描述", s.taste, true) +
        field("苦甜", s.sweet) + field("醇厚度", s.body) + field("余味", s.finish, true)) +
      group("工艺与饮用",
        field("主要原料", s.material, true) +
        field("酿造方法", s.brew, true) +
        field("适饮温度", s.temp, true) +
        field("搭配建议", s.pairing, true)) +
      group("背景", field("简要背景与特点", s.background, true));
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
      '<span class="tag plain">产地 ' + WX.esc(s.origin) + '</span> <span class="tag plain">度数 ' + WX.esc(s.abv) + '</span> <span class="tag">' + WX.esc(priceText(s.price)) + "</span>";
    document.getElementById("sProfile").innerHTML = profileHTML(s);
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
