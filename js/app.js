/* ============================================================
   7RE Guide — tiny hash-router single page app.
   Content lives in data/*.js — you normally never edit this file.
   ============================================================ */
(function () {
  "use strict";

  var C = window.CONFIG;
  var CHARS = window.DATA_CHARACTERS || [];
  var TIERS = window.DATA_TIERS || {};
  var GVG = window.DATA_GVG || [];

  var app = document.getElementById("app");

  // ---------- helpers ----------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function charById(id) {
    for (var i = 0; i < CHARS.length; i++) if (CHARS[i].id === id) return CHARS[i];
    return null;
  }

  function typeInfo(t) { return C.types[t] || { icon: "❓", color: "#8b93a7" }; }

  // Portrait: uses the image if it loads, otherwise a colored letter box.
  function phHtml(letter, color) {
    return '<div class="ph" style="background:linear-gradient(145deg,' + color + "33," + color + '66)">' +
      letter + "</div>";
  }

  function portrait(ch, size) {
    var cls = "portrait" + (size ? " " + size : "");
    var color = typeInfo(ch.type).color;
    var letter = esc(ch.name.charAt(0));
    var inner = ch.image
      ? '<img src="' + esc(ch.image) + '" alt="' + esc(ch.name) + '">'
      : phHtml(letter, color);
    return '<div class="' + cls + '" data-letter="' + letter + '" data-color="' + color +
      '" style="border-color:' + color + '55">' + inner + "</div>";
  }

  // Swap portraits whose image is missing/broken for the letter placeholder.
  function fixPortraits() {
    var imgs = document.querySelectorAll(".portrait img");
    Array.prototype.forEach.call(imgs, function (img) {
      var box = img.parentNode;
      function swap() { box.innerHTML = phHtml(box.getAttribute("data-letter"), box.getAttribute("data-color")); }
      if (img.complete && img.naturalWidth === 0) swap();
      else img.addEventListener("error", swap);
    });
  }

  function typeChip(t) {
    var ti = typeInfo(t);
    return '<span class="type-chip" style="color:' + ti.color + '">' + ti.icon + " " + esc(t) + "</span>";
  }

  function tierBadgeStyle(tier) {
    var col = C.tierColors[tier] || "#9aa4b2";
    return "background:" + col + ";";
  }

  function setNav(name) {
    var links = document.querySelectorAll("#main-nav a");
    for (var i = 0; i < links.length; i++) {
      links[i].classList.toggle("active", links[i].getAttribute("data-nav") === name);
    }
  }

  // ---------- views ----------
  function viewHome() {
    setNav("home");
    app.innerHTML =
      '<div class="hero">' +
      "<h1>7RE <span>Guide</span></h1>" +
      "<p>Fan-made guide for Seven Knights Re:Birth — characters, tier lists for GvG / Arena / Total War, and detailed GvG builds (item sets, target stats, dedicated options).</p>" +
      "</div>" +
      '<div class="home-grid">' +
      homeCard("#/characters", "🧙", "Characters", "All heroes with type, role and builds. / ตัวละครทั้งหมด") +
      homeCard("#/tier-list", "🏆", "Tier List", "GvG · Arena · Total War rankings. / จัดอันดับตัวละคร") +
      homeCard("#/gvg", "⚔️", "GvG Builds", "Item sets, target stats, dedicated options, pets and notes. / บิลด์กิลด์วอร์") +
      "</div>";
  }

  function homeCard(href, icon, title, sub) {
    return '<a class="home-card" href="' + href + '"><div class="hc-icon">' + icon + "</div><h3>" +
      esc(title) + "</h3><p>" + esc(sub) + "</p></a>";
  }

  function viewCharacters() {
    setNav("characters");
    var types = Object.keys(C.types);
    var html =
      '<h1 class="page-title">Characters</h1>' +
      '<p class="page-sub">ตัวละครทั้งหมด — click a hero for details and builds.</p>' +
      '<div class="filter-bar">' +
      '<input type="search" id="char-search" placeholder="Search / ค้นหา...">' +
      '<button class="chip active" data-type="">All</button>' +
      types.map(function (t) {
        return '<button class="chip" data-type="' + esc(t) + '">' + typeInfo(t).icon + " " + esc(t) + "</button>";
      }).join("") +
      "</div>" +
      '<div class="char-grid" id="char-grid"></div>';
    app.innerHTML = html;

    var state = { q: "", type: "" };
    function renderGrid() {
      var list = CHARS.filter(function (ch) {
        if (state.type && ch.type !== state.type) return false;
        if (state.q) {
          var q = state.q.toLowerCase();
          var hay = (ch.name + " " + (ch.nameTh || "") + " " + (ch.role || "")).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
      document.getElementById("char-grid").innerHTML = list.length
        ? list.map(function (ch) {
            return '<a class="char-card" href="#/characters/' + esc(ch.id) + '">' +
              portrait(ch) +
              '<div class="cname">' + esc(ch.name) + "</div>" +
              (ch.nameTh ? '<div class="cname-th">' + esc(ch.nameTh) + "</div>" : "") +
              typeChip(ch.type) +
              '<div class="role-txt">' + esc(ch.role || "") + "</div>" +
              "</a>";
          }).join("")
        : '<div class="empty">No characters found.</div>';
      fixPortraits();
    }
    renderGrid();

    document.getElementById("char-search").addEventListener("input", function (e) {
      state.q = e.target.value.trim();
      renderGrid();
    });
    var chips = app.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener("click", function (e) {
        for (var j = 0; j < chips.length; j++) chips[j].classList.remove("active");
        e.currentTarget.classList.add("active");
        state.type = e.currentTarget.getAttribute("data-type");
        renderGrid();
      });
    }
  }

  function viewCharacter(id) {
    setNav("characters");
    var ch = charById(id);
    if (!ch) {
      app.innerHTML = '<div class="empty">Character not found. <a href="#/characters">Back to list</a></div>';
      return;
    }
    var rar = C.rarities[ch.rarity] || { color: "#8b93a7" };

    // tier placements across all modes
    var placements = C.modes.map(function (m) {
      var found = "-";
      var list = TIERS[m.id] || {};
      Object.keys(list).forEach(function (tier) {
        if ((list[tier] || []).indexOf(ch.id) !== -1) found = tier;
      });
      var col = C.tierColors[found] || "#9aa4b2";
      return '<div class="placement"><div class="mode">' + esc(m.label) + '</div>' +
        '<div class="tval" style="color:' + col + '">' + esc(found) + "</div></div>";
    }).join("");

    // GvG builds featuring this character
    var builds = GVG.filter(function (b) {
      return (b.members || []).some(function (mm) { return mm.charId === ch.id; });
    });

    app.innerHTML =
      '<a class="back-link" href="#/characters">← Characters</a>' +
      '<div class="char-head">' +
      portrait(ch, "lg") +
      "<div><h1>" + esc(ch.name) + (ch.nameTh ? ' <small style="color:var(--text-dim);font-size:1rem">' + esc(ch.nameTh) + "</small>" : "") + "</h1>" +
      '<div class="meta">' +
      '<span class="badge" style="color:' + rar.color + '">★ ' + esc(ch.rarity) + "</span>" +
      typeChip(ch.type) +
      (ch.role ? '<span class="badge">' + esc(ch.role) + "</span>" : "") +
      "</div></div></div>" +
      '<h2 class="section-title">Tier Placements <small>อันดับในแต่ละโหมด</small></h2>' +
      '<div class="tier-placements">' + placements + "</div>" +
      (ch.notes ? '<h2 class="section-title">Notes <small>หมายเหตุ</small></h2><div class="notes-box">' + esc(ch.notes) + "</div>" : "") +
      '<h2 class="section-title">GvG Builds <small>บิลด์กิลด์วอร์</small></h2>' +
      (builds.length ? builds.map(gvgCard).join("") : '<div class="empty">No GvG builds yet for this hero.</div>');
  }

  function viewTierList(mode) {
    setNav("tier-list");
    var modeIds = C.modes.map(function (m) { return m.id; });
    if (modeIds.indexOf(mode) === -1) mode = modeIds[0];

    var tabs = C.modes.map(function (m) {
      return '<a class="tab' + (m.id === mode ? " active" : "") + '" href="#/tier-list/' + m.id + '">' + esc(m.label) + "</a>";
    }).join("");

    var list = TIERS[mode] || {};
    var rows = C.tierOrder.filter(function (t) { return (list[t] || []).length; }).map(function (t) {
      var chars = (list[t] || []).map(function (cid) {
        var ch = charById(cid);
        if (!ch) return "";
        return '<a class="tier-char" href="#/characters/' + esc(ch.id) + '" title="' + esc(ch.name) + '">' +
          portrait(ch) + '<div class="tc-name">' + esc(ch.name) + "</div></a>";
      }).join("");
      return '<div class="tier-row"><div class="tier-label" style="' + tierBadgeStyle(t) + '">' + esc(t) +
        '</div><div class="tier-chars">' + chars + "</div></div>";
    }).join("");

    app.innerHTML =
      '<h1 class="page-title">Tier List</h1>' +
      '<p class="page-sub">จัดอันดับตัวละครแยกตามโหมด — edit in <code>data/tiers.js</code>.</p>' +
      '<div class="tabs">' + tabs + "</div>" +
      (rows || '<div class="empty">No tier data for this mode yet.</div>');
  }

  // One GvG team card (shared by GvG page and character detail)
  function gvgCard(b) {
    var members = (b.members || []).map(function (m) {
      var ch = charById(m.charId) || { id: m.charId, name: m.charId, type: "" };
      var set = C.sets[m.set];
      var setHtml = set
        ? '<span class="set-chip" style="color:' + set.color + ';border-color:' + set.color + '55">' +
          set.icon + " " + esc(set.name) + (set.nameTh ? ' <small style="color:var(--text-dim)">' + esc(set.nameTh) + "</small>" : "") + "</span>"
        : '<span class="set-chip">-</span>';

      var statRows = (m.stats || []).map(function (s) {
        var st = C.stats[s.stat] || { icon: "❓", name: s.stat, nameTh: "" };
        return '<div class="stat-row"><span class="s-icon">' + st.icon + '</span>' +
          '<span class="s-name">' + esc(st.name) + (st.nameTh ? " / " + esc(st.nameTh) : "") + "</span>" +
          '<span class="s-val">' + esc(s.value) + "</span></div>";
      }).join("");

      var ded = "";
      if (m.dedicated) {
        var ds = C.stats[m.dedicated.stat] || { icon: "❓", name: m.dedicated.stat, nameTh: "" };
        ded = '<div><div class="m-section-label">Dedicated Option / ออปชั่นเฉพาะ</div>' +
          '<div class="stat-row dedicated-row"><span class="s-icon">' + ds.icon + '</span>' +
          '<span class="s-name">' + esc(ds.name) + (ds.nameTh ? " / " + esc(ds.nameTh) : "") + "</span>" +
          '<span class="s-val">' + esc(m.dedicated.value) + "</span></div></div>";
      }

      return '<div class="member">' +
        '<div class="member-top">' + portrait(ch, "sm") +
        '<div class="m-name"><a href="#/characters/' + esc(ch.id) + '">' + esc(ch.name) + "</a><br>" +
        '<span class="pos-badge pos-' + esc(m.position) + '">' + (m.position === "F" ? "F · Front" : "B · Back") + "</span></div></div>" +
        '<div><div class="m-section-label">Item Set / เซ็ตของสวมใส่</div>' + setHtml + "</div>" +
        '<div><div class="m-section-label">Target Stats / สเตตัสเป้าหมาย</div>' + (statRows || '<div class="stat-row">-</div>') + "</div>" +
        ded +
        "</div>";
    }).join("");

    var pets = (b.pets || []).map(function (pid) {
      var p = C.pets[pid] || { name: pid, icon: "🐾" };
      var inner = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' : p.icon;
      return '<div class="pet" title="' + esc(p.name) + '">' + inner + "</div>";
    }).join("");

    var skills = (b.skillOrder || []).map(function (s) {
      return '<div class="so-icon">' + esc(s) + "</div>";
    }).join("");

    return '<div class="gvg-card">' +
      '<div class="gvg-left">' +
      '<div class="gvg-tier" style="' + tierBadgeStyle(b.tier) + '">' + esc(b.tier) + "</div>" +
      '<div class="gvg-boots">' + esc(b.boots || "-") + "</div>" +
      (skills ? '<div class="skill-order"><div class="so-label">Skill order<br>ลำดับสกิล</div><div class="so-icons">' + skills + "</div></div>" : "") +
      "</div>" +
      '<div class="gvg-members">' + members + "</div>" +
      '<div class="gvg-side">' +
      (pets ? '<div><div class="m-section-label">Pets / สัตว์เลี้ยง</div><div class="pets-row">' + pets + "</div></div>" : "") +
      '<div><div class="m-section-label">Notes / หมายเหตุ</div><div class="gvg-notes">' + esc(b.notes || "-") + "</div></div>" +
      "</div>" +
      "</div>";
  }

  function viewGvg() {
    setNav("gvg");
    app.innerHTML =
      '<h1 class="page-title">GvG Builds</h1>' +
      '<p class="page-sub">บิลด์กิลด์วอร์ — item set → target stats → dedicated option. Edit in <code>data/gvg.js</code>.</p>' +
      (GVG.length ? GVG.map(gvgCard).join("") : '<div class="empty">No builds yet.</div>');
  }

  // ---------- router ----------
  function render() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/").filter(Boolean);
    window.scrollTo(0, 0);

    if (parts.length === 0) viewHome();
    else if (parts[0] === "characters" && parts[1]) viewCharacter(decodeURIComponent(parts[1]));
    else if (parts[0] === "characters") viewCharacters();
    else if (parts[0] === "tier-list") viewTierList(parts[1] || "");
    else if (parts[0] === "gvg") viewGvg();
    else viewHome();
    fixPortraits();
  }

  window.addEventListener("hashchange", render);
  render();
})();
