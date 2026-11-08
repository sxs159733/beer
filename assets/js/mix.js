/* 微醺手册 · 调酒实验室 */
(function () {
  var R = window.WX.RECIPES, CATS = window.WX.CATS, BASES = window.WX.BASES;
  var state = { cat: "all", base: "all", q: "" };
  var mult = 1, current = null;

  var grid = document.getElementById("recipeGrid");
  var count = document.getElementById("resultCount");
  var catDesc = document.getElementById("catDesc");
  var modal = document.getElementById("recipeModal");

  function cardHTML(r) {
    var thumb = r.img
      ? '<img src="' + r.img + '" alt="' + WX.esc(r.name) + '" width="900" height="900" loading="lazy" decoding="async">'
      : WX.glassSVG(r.color);
    return '<button class="recipe-card" data-id="' + r.id + '" aria-haspopup="dialog">' +
      '<span class="thumb">' + thumb + "</span>" +
      '<span class="body"><span class="names"><strong>' + WX.esc(r.name) + "</strong><span>" + WX.esc(r.en) + "</span></span>" +
      '<span class="taste">' + WX.esc(r.taste) + "</span>" +
      '<span class="meta"><span class="tag">' + CATS[r.cat].label + '</span><span class="tag plain">' + WX.esc(r.base) + '</span><span class="tag plain">' + WX.esc(r.method) + '</span><span class="abv-dot">酒精度 ' + WX.esc(r.abv) + "</span></span>" +
      '<span class="card-cta">查看完整配方 <span aria-hidden="true">&rarr;</span></span></span></button>';
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    return R.filter(function (r) {
      if (state.cat !== "all" && r.cat !== state.cat) return false;
      if (state.base !== "all" && r.base !== state.base) return false;
      if (q) {
        var hay = (r.name + r.en + r.base + r.taste + r.ingredients.map(function (i) { return i.n; }).join(" ")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function render() {
    var list = filtered();
    count.textContent = "共 " + list.length + " 款配方";
    catDesc.textContent = state.cat === "all"
      ? "从便利店冰杯到签名鸡尾酒，按分类、基酒或材料搜索，点开任意一杯看完整做法。"
      : CATS[state.cat].desc;
    grid.innerHTML = list.length
      ? list.map(cardHTML).join("")
      : '<div class="empty-state" style="grid-column:1/-1">没有找到匹配的酒款。<br>换个关键词，或把分类切回"全部"试试。</div>';
  }

  /* ---- filters ---- */
  function buildChips() {
    var catRow = document.getElementById("catChips");
    var html = '<button class="chip" data-cat="all" aria-pressed="true">全部</button>';
    Object.keys(CATS).forEach(function (k) {
      html += '<button class="chip" data-cat="' + k + '" aria-pressed="false">' + CATS[k].label + " <span class='muted small'>" + R.filter(function (r) { return r.cat === k; }).length + "</span></button>";
    });
    catRow.innerHTML = html;
    var baseRow = document.getElementById("baseChips");
    var bhtml = '<button class="chip" data-base="all" aria-pressed="true">不限</button>';
    BASES.forEach(function (b) {
      bhtml += '<button class="chip" data-base="' + b + '" aria-pressed="false">' + b + "</button>";
    });
    baseRow.innerHTML = bhtml;
  }

  document.addEventListener("click", function (e) {
    var c = e.target.closest("[data-cat]");
    if (c) {
      state.cat = c.getAttribute("data-cat");
      document.querySelectorAll("[data-cat]").forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      render(); return;
    }
    var b = e.target.closest("[data-base]");
    if (b) {
      state.base = b.getAttribute("data-base");
      document.querySelectorAll("[data-base]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      render(); return;
    }
    var card = e.target.closest(".recipe-card");
    if (card) { openModal(card.getAttribute("data-id")); }
  });

  document.getElementById("searchInput").addEventListener("input", function (e) {
    state.q = e.target.value; render();
  });

  /* ---- modal ---- */
  function ingHTML(r) {
    return r.ingredients.map(function (i) {
      return "<li><span>" + WX.esc(i.n) + '</span><span class="q">' + WX.esc(WX.fmtQty(i, mult)) + "</span></li>";
    }).join("");
  }

  function fillModal(r) {
    current = r;
    document.getElementById("mPic").innerHTML = r.img
      ? '<img src="' + r.img + '" alt="' + WX.esc(r.name) + '" width="900" height="900">'
      : WX.glassSVG(r.color);
    document.getElementById("mName").textContent = r.name;
    document.getElementById("mEn").textContent = r.en;
    document.getElementById("mTags").innerHTML =
      '<span class="hero-chip">' + CATS[r.cat].label + '</span>' +
      '<span class="hero-chip">基酒 ' + WX.esc(r.base) + '</span>' +
      '<span class="hero-chip">' + WX.esc(r.method) + '</span>';
    document.getElementById("mFacts").innerHTML = [
      ["酒精度", r.abv],
      ["难度", WX.diffStars(r.diff)],
      ["调制时间", r.time],
      ["杯型", r.glass],
      ["参考比例", r.ratio || "单杯"],
      ["分类", CATS[r.cat].label]
    ].map(function (f) {
      return '<div class="hero-fact"><span>' + f[0] + '</span><b>' + WX.esc(f[1]) + '</b></div>';
    }).join("");
    document.getElementById("mRatio").textContent = r.ratio ? "参考比例 " + r.ratio + "（1 份约 45ml）" : "单杯参考量，可自由缩放";
    document.getElementById("mIng").innerHTML = ingHTML(r);
    document.getElementById("mSteps").innerHTML = r.steps.map(function (s) { return "<li>" + WX.esc(s) + "</li>"; }).join("");
    document.getElementById("mTaste").textContent = r.taste;
    document.getElementById("mTips").textContent = r.tips;
    document.getElementById("mGarnish").textContent = "装饰：" + (r.garnish || "无特殊装饰，冰够就是装饰");
    document.getElementById("mSource").textContent = "配方来源：" + r.source + " · 比例仅供参考";
    document.getElementById("mMult").textContent = "×" + mult;
  }

  function openModal(id) {
    var r = R.find(function (x) { return x.id === id; });
    if (!r) return;
    mult = 1;
    fillModal(r);
    if (!modal.open) modal.showModal();
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  }

  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.close();
  });
  modal.addEventListener("close", function () {
    if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
  });
  document.getElementById("mClose").addEventListener("click", function () { modal.close(); });
  document.getElementById("mMinus").addEventListener("click", function () {
    mult = Math.max(0.5, mult - 0.5); fillModal(current);
  });
  document.getElementById("mPlus").addEventListener("click", function () {
    mult = Math.min(4, mult + 0.5); fillModal(current);
  });
  document.getElementById("mCopy").addEventListener("click", function () {
    if (!current) return;
    var lines = ["【" + current.name + " " + current.en + "】 ×" + mult,
      "分类：" + CATS[current.cat].label + "｜基酒：" + current.base + "｜手法：" + current.method + "｜酒精度：" + current.abv];
    if (current.ratio) lines.push("参考比例：" + current.ratio);
    lines.push("材料：");
    current.ingredients.forEach(function (i) { lines.push("  · " + i.n + " " + WX.fmtQty(i, mult)); });
    lines.push("做法：");
    current.steps.forEach(function (s, i) { lines.push("  " + (i + 1) + ". " + s); });
    lines.push("口感：" + current.taste);
    lines.push("提示：" + current.tips);
    lines.push("—— 微醺手册 · 理性饮酒，未成年人禁止饮酒");
    WX.copyText(lines.join("\n"), document.getElementById("mCopy"));
  });

  /* deep link */
  function fromHash() {
    var id = location.hash.replace("#", "");
    if (id) openModal(id);
  }
  window.addEventListener("hashchange", fromHash);

  buildChips();
  render();
  fromHash();
})();