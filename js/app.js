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

  // Icon for a stat/set id: custom image > inline SVG (data/icons.js) > emoji.
  function icon(id, cfg) {
    cfg = cfg || {};
    if (cfg.image) return '<img class="icon-img" src="' + esc(cfg.image) + '" alt="">';
    var key = cfg.svg || id;
    if (window.ICONS && window.ICONS[key]) return '<span class="icon-svg">' + window.ICONS[key] + "</span>";
    return cfg.icon || "❓";
  }

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

  // ---------- skills ----------
  // Every character can have: 1 normal + 2 active + 1 passive
  // + 1 awakening (only some heroes). See data/characters.js template.
  var SKILL_SLOTS = ["normal", "active1", "active2", "passive", "awakening"];
  var SKILL_META = {
    normal:    { label: "N",  tag: "Normal",    defName: "Normal Attack" },
    active1:   { label: "1",  tag: "Active 1",  defName: "Skill 1" },
    active2:   { label: "2",  tag: "Active 2",  defName: "Skill 2" },
    passive:   { label: "P",  tag: "Passive",   defName: "Passive" },
    awakening: { label: "AW", tag: "Awakening", defName: "Awakening" }
  };
  function skillOf(ch, key) { return (ch && ch.skills && ch.skills[key]) || null; }
  function skillName(ch, key) {
    var sk = skillOf(ch, key);
    return (sk && sk.name) || SKILL_META[key].defName;
  }
  // Skill icon: images/skills/<charId>-<key>.png (or .webp), else a letter box.
  function skillIcon(ch, key, cls) {
    var sk = skillOf(ch, key);
    var base = "images/skills/" + ch.id + "-" + key;
    var src = (sk && sk.image) || base + ".png";
    var alt = sk && sk.image ? "" : base + ".webp";
    return '<span class="skill-ico' + (cls ? " " + cls : "") + '" data-fb="' + SKILL_META[key].label + '"' +
      (alt ? ' data-alt="' + esc(alt) + '"' : "") + '><img src="' + esc(src) + '" alt=""></span>';
  }
  // Swap skill icons whose image is missing for the letter fallback
  // (tries .png first, then .webp).
  function fixSkillIcons() {
    var imgs = document.querySelectorAll(".skill-ico img");
    Array.prototype.forEach.call(imgs, function (img) {
      function fail() {
        var box = img.parentNode;
        if (!box) return;
        var alt = box.getAttribute("data-alt");
        if (alt) { box.removeAttribute("data-alt"); img.src = alt; return; }
        box.innerHTML = '<span class="skill-fb">' + esc(box.getAttribute("data-fb") || "?") + "</span>";
      }
      img.addEventListener("error", fail);
      if (img.complete && img.naturalWidth === 0) fail();
    });
  }
  function fixImages() { fixPortraits(); fixSkillIcons(); }

  // ---------- picker modal (click-to-choose with pictures) ----------
  function openPicker(title, bodyHtml, wire) {
    var back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = '<div class="modal"><div class="modal-head"><span>' + title +
      '</span><button type="button" class="modal-x">✕</button></div><div class="modal-body">' + bodyHtml + "</div></div>";
    document.body.appendChild(back);
    function onKey(e) { if (e.key === "Escape") close(); }
    function close() {
      if (back.parentNode) back.parentNode.removeChild(back);
      document.removeEventListener("keydown", onKey);
    }
    back.addEventListener("click", function (e) { if (e.target === back) close(); });
    back.querySelector(".modal-x").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    wire(back, close);
    fixImages();
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
      homeCard("#/builder", "🛠️", "Team Builder", "Build a team visually and get the code for gvg.js. / สร้างทีมแบบคลิกเลือก") +
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
      (ch.skills ? '<h2 class="section-title">Skills <small>สกิล</small></h2><div class="skill-list">' +
        SKILL_SLOTS.filter(function (k) { return ch.skills[k]; }).map(function (k) {
          var sk = ch.skills[k];
          return '<div class="skill-card">' + skillIcon(ch, k, "lg") +
            '<div class="skill-info"><div class="skill-top"><span class="skill-slot sk-' + k + '">' + SKILL_META[k].tag + "</span>" +
            "<b>" + esc(sk.name || SKILL_META[k].defName) + "</b>" +
            (sk.nameTh ? ' <small class="dim">' + esc(sk.nameTh) + "</small>" : "") + "</div>" +
            (sk.desc ? '<div class="skill-desc">' + esc(sk.desc) + "</div>" : "") +
            "</div></div>";
        }).join("") + "</div>" : "") +
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
          icon(m.set, set) + " " + esc(set.name) + (set.nameTh ? ' <small style="color:var(--text-dim)">' + esc(set.nameTh) + "</small>" : "") + "</span>"
        : '<span class="set-chip">-</span>';

      var statRows = (m.stats || []).map(function (s) {
        var st = C.stats[s.stat] || { icon: "❓", name: s.stat, nameTh: "" };
        return '<div class="stat-row"><span class="s-icon">' + icon(s.stat, st) + '</span>' +
          '<span class="s-name">' + esc(st.name) + (st.nameTh ? " / " + esc(st.nameTh) : "") + "</span>" +
          '<span class="s-val">' + esc(s.value) + "</span></div>";
      }).join("");

      var ded = "";
      if (m.dedicated) {
        var ds = C.stats[m.dedicated.stat] || { icon: "❓", name: m.dedicated.stat, nameTh: "" };
        ded = '<div><div class="m-section-label">Dedicated Option / ออปชั่นเฉพาะ</div>' +
          '<div class="stat-row dedicated-row"><span class="s-icon">' + icon(m.dedicated.stat, ds) + '</span>' +
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

    // skillOrder entries: plain text ("2") or Builder objects ({charId, skill})
    var skills = (b.skillOrder || []).map(function (s) {
      if (s && typeof s === "object") {
        var sch = charById(s.charId);
        if (!sch) return "";
        return '<div class="so-unit" title="' + esc(sch.name + " — " + skillName(sch, s.skill)) + '">' +
          portrait(sch, "xs") + '<span class="so-b">' + esc((SKILL_META[s.skill] || {}).label || "?") + "</span></div>";
      }
      return '<div class="so-icon">' + esc(s) + "</div>";
    }).join("");

    return '<div class="gvg-card">' +
      '<div class="gvg-left">' +
      '<div class="gvg-tier" style="' + tierBadgeStyle(b.tier) + '">' + esc(b.tier) + "</div>" +
      '<div class="gvg-boots">' + esc(b.boots || "-") + "</div>" +
      (function () {
        var fm = b.formation && C.formations && C.formations[b.formation];
        return fm ? '<div class="gvg-fm" title="' + esc(fm.name + " — Back +" + fm.backBonus + " / Front +" + fm.frontBonus) + '">' +
          fm.back + "B·" + fm.front + "F</div>" : "";
      })() +
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

  // ---------- team builder ----------
  var BKEY = "7re-builder-draft";
  var B = null;
  var TEAM_SIZE = 5;

  function fmGet(id) { return C.formations[id] || C.formations[C.formationOrder[0]]; }
  // Slot positions for a formation: back slots first, then front slots.
  function fmPositions(id) {
    var f = fmGet(id), arr = [], i;
    for (i = 0; i < f.back; i++) arr.push("B");
    for (i = 0; i < f.front; i++) arr.push("F");
    return arr;
  }

  function emptyMember() {
    return { charId: "", set: "",
      stats: [{ stat: "", value: "" }, { stat: "", value: "" }, { stat: "", value: "" }],
      dedicated: { stat: "", value: "" } };
  }
  function defaultBuild() {
    return { tier: "A+", boots: "-", formation: C.formationOrder[0], skillOrder: [],
      members: [emptyMember(), emptyMember(), emptyMember(), emptyMember(), emptyMember()],
      pet: "", notes: "" };
  }
  function loadBuild() {
    if (B) return B;
    try { B = JSON.parse(localStorage.getItem(BKEY) || "null"); } catch (e) { B = null; }
    if (!B || !B.members) { B = defaultBuild(); return B; }
    // migrate old drafts (3 members, pets array, free-text skill order)
    B.formation = C.formations[B.formation] ? B.formation : C.formationOrder[0];
    B.members = B.members.slice(0, TEAM_SIZE);
    while (B.members.length < TEAM_SIZE) B.members.push(emptyMember());
    B.members.forEach(function (m) {
      if (!m.stats || m.stats.length !== 3) m.stats = emptyMember().stats;
      if (!m.dedicated) m.dedicated = { stat: "", value: "" };
    });
    if (B.pet == null) B.pet = (B.pets || []).filter(Boolean)[0] || "";
    delete B.pets;
    B.skillOrder = (B.skillOrder || []).filter(function (s) { return s && typeof s === "object" && s.charId; });
    if (B.tier == null) B.tier = "A+";
    if (B.boots == null) B.boots = "-";
    if (B.notes == null) B.notes = "";
    return B;
  }
  function saveBuild() { try { localStorage.setItem(BKEY, JSON.stringify(B)); } catch (e) {} }

  // Builder state -> clean team object (same shape as data/gvg.js entries)
  function buildTeamObj() {
    var t = { tier: B.tier || "A+", boots: B.boots || "-", formation: B.formation };
    var pos = fmPositions(B.formation);
    var present = {};
    t.members = [];
    B.members.forEach(function (m, i) {
      if (!m.charId) return;
      present[m.charId] = true;
      var mm = { charId: m.charId, position: pos[i] };
      if (m.set) mm.set = m.set;
      mm.stats = (m.stats || []).filter(function (s) { return s.stat; })
        .map(function (s) { return { stat: s.stat, value: s.value || "" }; });
      if (m.dedicated && m.dedicated.stat) mm.dedicated = { stat: m.dedicated.stat, value: m.dedicated.value || "" };
      t.members.push(mm);
    });
    var so = (B.skillOrder || []).filter(function (s) { return present[s.charId]; });
    if (so.length) t.skillOrder = so;
    if (B.pet) t.pets = [B.pet];
    if (B.notes) t.notes = B.notes;
    return t;
  }

  function teamToCode(t) {
    var L = ["  {"];
    L.push("    tier: " + JSON.stringify(t.tier) + ",");
    L.push("    boots: " + JSON.stringify(t.boots) + ",");
    if (t.formation) L.push("    formation: " + JSON.stringify(t.formation) + ",");
    if (t.skillOrder) {
      L.push("    skillOrder: [");
      t.skillOrder.forEach(function (s, i) {
        L.push("      { charId: " + JSON.stringify(s.charId) + ", skill: " + JSON.stringify(s.skill) + " }" +
          (i < t.skillOrder.length - 1 ? "," : ""));
      });
      L.push("    ],");
    }
    L.push("    members: [");
    t.members.forEach(function (m, i) {
      L.push("      {");
      L.push("        charId: " + JSON.stringify(m.charId) + ", position: " + JSON.stringify(m.position) +
        (m.set ? ", set: " + JSON.stringify(m.set) : "") + ",");
      L.push("        stats: [");
      m.stats.forEach(function (s, j) {
        L.push("          { stat: " + JSON.stringify(s.stat) + ", value: " + JSON.stringify(s.value) + " }" +
          (j < m.stats.length - 1 ? "," : ""));
      });
      L.push("        ]" + (m.dedicated ? "," : ""));
      if (m.dedicated) L.push("        dedicated: { stat: " + JSON.stringify(m.dedicated.stat) + ", value: " + JSON.stringify(m.dedicated.value) + " }");
      L.push("      }" + (i < t.members.length - 1 ? "," : ""));
    });
    L.push("    ]" + (t.pets || t.notes ? "," : ""));
    if (t.pets) L.push("    pets: [" + t.pets.map(function (p) { return JSON.stringify(p); }).join(", ") + "]" + (t.notes ? "," : ""));
    if (t.notes) L.push("    notes: " + JSON.stringify(t.notes));
    L.push("  },");
    return L.join("\n");
  }

  // ---- picker helpers (shared by the builder pop-ups) ----
  function pickItem(id, iconHtml, name, sub, search, color) {
    return '<button type="button" class="pick-item" data-pick="' + esc(id) + '"' +
      (search ? ' data-search="' + esc(search) + '"' : "") + ">" +
      '<div class="pc-ico"' + (color ? ' style="color:' + color + '"' : "") + ">" + iconHtml + "</div>" +
      '<div class="pc-name">' + esc(name) + "</div>" +
      (sub ? '<div class="pc-sub">' + esc(sub) + "</div>" : "") + "</button>";
  }
  function wirePicker(back, close, onPick) {
    Array.prototype.forEach.call(back.querySelectorAll(".pick-item"), function (el) {
      el.addEventListener("click", function () { onPick(el.getAttribute("data-pick")); close(); });
    });
    var se = back.querySelector(".modal-search");
    if (se) {
      se.focus();
      se.addEventListener("input", function () {
        var q = se.value.trim().toLowerCase();
        Array.prototype.forEach.call(back.querySelectorAll(".pick-item"), function (el) {
          var hay = el.getAttribute("data-search") || "";
          el.style.display = !q || hay.indexOf(q) !== -1 ? "" : "none";
        });
      });
    }
  }

  function openCharPicker(mi) {
    var used = {};
    B.members.forEach(function (m, j) { if (j !== mi && m.charId) used[m.charId] = true; });
    var body = '<input type="search" class="modal-search" placeholder="Search / ค้นหา...">' +
      '<div class="picker-grid">' +
      pickItem("", "✖", "None", "ไม่เลือก", "") +
      CHARS.filter(function (c) { return !used[c.id]; }).map(function (c) {
        return pickItem(c.id, portrait(c), c.name, c.nameTh || "",
          (c.name + " " + (c.nameTh || "") + " " + (c.role || "")).toLowerCase());
      }).join("") + "</div>";
    openPicker("เลือกตัวละคร / Pick hero — Slot " + (mi + 1), body, function (back, close) {
      wirePicker(back, close, function (id) {
        B.members[mi].charId = id;
        var present = {};
        B.members.forEach(function (m) { if (m.charId) present[m.charId] = true; });
        B.skillOrder = B.skillOrder.filter(function (s) { return present[s.charId]; });
        saveBuild(); viewBuilder();
      });
    });
  }
  function openSetPicker(mi) {
    var body = '<div class="picker-grid">' + pickItem("", "✖", "None", "ไม่เลือก", "") +
      Object.keys(C.sets).map(function (id) {
        var s = C.sets[id];
        return pickItem(id, icon(id, s), s.name, s.nameTh || "", "", s.color);
      }).join("") + "</div>";
    openPicker("เลือกเซ็ตของสวมใส่ / Item Set", body, function (back, close) {
      wirePicker(back, close, function (id) { B.members[mi].set = id; saveBuild(); viewBuilder(); });
    });
  }
  function openStatPicker(mi, si) {
    var body = '<div class="picker-grid">' + pickItem("", "✖", "None", "ไม่เลือก", "") +
      Object.keys(C.stats).map(function (id) {
        var s = C.stats[id];
        return pickItem(id, icon(id, s), s.name, s.nameTh || "", "");
      }).join("") + "</div>";
    openPicker(si < 0 ? "Tuning / ออปชั่นเฉพาะ" : "เลือกสเตตัส / Stat " + (si + 1), body, function (back, close) {
      wirePicker(back, close, function (id) {
        if (si < 0) B.members[mi].dedicated.stat = id; else B.members[mi].stats[si].stat = id;
        saveBuild(); viewBuilder();
      });
    });
  }
  function openPetPicker() {
    var body = '<div class="picker-grid">' + pickItem("", "✖", "None", "ไม่เลือก", "") +
      Object.keys(C.pets).map(function (id) {
        var p = C.pets[id];
        var ic = p.image ? '<img class="pc-img" src="' + esc(p.image) + '" alt="">' : (p.icon || "🐾");
        return pickItem(id, ic, p.name, p.nameTh || "", "");
      }).join("") + "</div>";
    openPicker("เลือกสัตว์เลี้ยง / Pet (1 ตัว)", body, function (back, close) {
      wirePicker(back, close, function (id) { B.pet = id; saveBuild(); viewBuilder(); });
    });
  }

  function viewBuilder() {
    setNav("builder");
    loadBuild();
    var fm = fmGet(B.formation);
    var pos = fmPositions(B.formation);

    // formation cards (4 layouts)
    var fmCards = C.formationOrder.map(function (fid) {
      var f = C.formations[fid], bd = "", fd = "", i;
      for (i = 0; i < f.back; i++) bd += '<span class="fm-dot db"></span>';
      for (i = 0; i < f.front; i++) fd += '<span class="fm-dot df"></span>';
      return '<button type="button" class="fm-card' + (fid === B.formation ? " active" : "") + '" data-f="' + fid + '">' +
        '<div class="fm-diagram"><div class="fm-col">' + bd + '</div><div class="fm-col">' + fd + "</div></div>" +
        '<div class="fm-name">' + esc(f.name) + "</div>" +
        '<div class="fm-bonus"><span style="color:var(--back)">B +' + esc(f.backBonus) + '</span><span style="color:var(--front)">F +' + esc(f.frontBonus) + "</span></div>" +
        "</button>";
    }).join("");

    // team diagram — click a slot to pick the hero
    function slotBtn(i) {
      var ch = charById(B.members[i].charId);
      return '<button type="button" class="td-slot" data-m="' + i + '" title="Slot ' + (i + 1) + '">' +
        (ch ? portrait(ch) : '<span class="td-plus">+</span>') + "</button>";
    }
    var backSlots = "", frontSlots = "";
    pos.forEach(function (p, i) { if (p === "B") backSlots += slotBtn(i); else frontSlots += slotBtn(i); });

    // member cards
    var memberCols = B.members.map(function (m, i) {
      var p = pos[i];
      var bonus = p === "F" ? fm.frontBonus : fm.backBonus;
      var ch = charById(m.charId);
      var head = '<div class="b-mtitle">Slot ' + (i + 1) +
        ' <span class="slot-badge pos-' + p + '">' + (p === "F" ? "F · Front หน้า" : "B · Back หลัง") + " +" + esc(bonus) + "</span></div>" +
        '<button type="button" class="b-pick js-pick-char" data-m="' + i + '">' +
        (ch ? portrait(ch, "sm") + '<span class="bp-label">' + esc(ch.name) + (ch.nameTh ? ' <small class="dim">' + esc(ch.nameTh) + "</small>" : "") + "</span>"
            : '<span class="bp-plus">+</span><span class="bp-label dim">เลือกตัวละคร / pick hero</span>') +
        "</button>";
      if (!ch) return '<div class="b-member">' + head + "</div>";

      var set = m.set ? C.sets[m.set] : null;
      var statRows = m.stats.map(function (s, j) {
        var st = s.stat ? C.stats[s.stat] : null;
        return '<div class="b-row">' +
          '<button type="button" class="b-pick sq js-pick-stat" data-m="' + i + '" data-s="' + j + '">' + (st ? icon(s.stat, st) : "+") + "</button>" +
          '<div class="b-statname">' + (st ? esc(st.name) + (st.nameTh ? '<small class="dim"> ' + esc(st.nameTh) + "</small>" : "") : '<span class="dim">— เลือกสเตตัส —</span>') + "</div>" +
          '<input type="text" class="b-val" data-m="' + i + '" data-s="' + j + '" value="' + esc(s.value) + '" placeholder="100 / เยอะๆ">' +
          "</div>";
      }).join("");
      var dst = m.dedicated.stat ? C.stats[m.dedicated.stat] : null;
      return '<div class="b-member">' + head +
        '<label>1) Item Set / เซ็ตของสวมใส่</label>' +
        '<button type="button" class="b-pick js-pick-set" data-m="' + i + '">' +
        (set ? '<span class="bp-ico" style="color:' + set.color + '">' + icon(m.set, set) + "</span>" +
               '<span class="bp-label" style="color:' + set.color + '">' + esc(set.name) + (set.nameTh ? ' <small class="dim">' + esc(set.nameTh) + "</small>" : "") + "</span>"
             : '<span class="bp-plus">+</span><span class="bp-label dim">เลือกเซ็ต / pick set</span>') +
        "</button>" +
        '<label>2) Main Stats / สเตตัสหลัก (3 แถว)</label>' + statRows +
        '<label>3) Tuning / ออปชั่นเฉพาะ</label>' +
        '<div class="b-row">' +
        '<button type="button" class="b-pick sq js-pick-dstat" data-m="' + i + '">' + (dst ? icon(m.dedicated.stat, dst) : "+") + "</button>" +
        '<div class="b-statname">' + (dst ? esc(dst.name) + (dst.nameTh ? '<small class="dim"> ' + esc(dst.nameTh) + "</small>" : "") : '<span class="dim">— เลือกสเตตัส —</span>') + "</div>" +
        '<input type="text" class="b-dval" data-m="' + i + '" value="' + esc(m.dedicated.value) + '" placeholder="เยอะๆ">' +
        "</div></div>";
    }).join("");

    // skill order — tap the active skills (or awakening) of picked heroes
    var withChar = [];
    B.members.forEach(function (m, i) { var c = charById(m.charId); if (c) withChar.push({ i: i, ch: c }); });
    var skoRows = withChar.map(function (e) {
      var keys = ["active1", "active2"];
      if (skillOf(e.ch, "awakening")) keys.push("awakening");
      var btns = keys.map(function (k) {
        return '<button type="button" class="sk-btn' + (k === "awakening" ? " aw" : "") + '" data-m="' + e.i + '" data-skill="' + k + '" title="' + esc(skillName(e.ch, k)) + '">' +
          skillIcon(e.ch, k) + '<span class="sk-lb">' + esc(skillName(e.ch, k)) + "</span></button>";
      }).join("");
      return '<div class="sko-row">' + portrait(e.ch, "xs") + '<div class="sko-name">' + esc(e.ch.name) + "</div>" +
        '<div class="sko-btns">' + btns + "</div></div>";
    }).join("");
    var soChips = (B.skillOrder || []).map(function (s, idx) {
      var c = charById(s.charId);
      if (!c) return "";
      return '<button type="button" class="so-chip" data-idx="' + idx + '" title="คลิกเพื่อลบ / click to remove">' +
        (idx + 1) + ". " + esc(c.name) + " · " + esc((SKILL_META[s.skill] || {}).label || "?") + " ✕</button>";
    }).join("");

    var pet = B.pet ? C.pets[B.pet] : null;
    var petBtn = pet
      ? '<span class="bp-ico">' + (pet.image ? '<img class="pc-img sm" src="' + esc(pet.image) + '" alt="">' : (pet.icon || "🐾")) + "</span>" +
        '<span class="bp-label">' + esc(pet.name) + "</span>"
      : '<span class="bp-plus">+</span><span class="bp-label dim">เลือกสัตว์เลี้ยง / pick pet</span>';

    app.innerHTML =
      '<h1 class="page-title">Team Builder</h1>' +
      '<p class="page-sub">เลือกรูปแบบตำแหน่ง → ตัวละคร 5 ตัว + สัตว์เลี้ยง 1 ตัว → เซ็ตของ → สเตตัส → Tuning แล้วคัดลอกโค้ดไปวางใน <code>data/gvg.js</code></p>' +
      '<div class="builder" id="builder">' +
      '<div class="b-panel"><div class="b-mtitle">Position / รูปแบบตำแหน่ง</div>' +
      '<div class="fm-grid">' + fmCards + "</div>" +
      '<div class="team-diagram">' +
        '<div class="td-col"><div class="td-head">Back / หลัง <span style="color:var(--back)">+' + esc(fm.backBonus) + "</span></div>" + backSlots + "</div>" +
        '<div class="td-col"><div class="td-head">Front / หน้า <span style="color:var(--front)">+' + esc(fm.frontBonus) + "</span></div>" + frontSlots + "</div>" +
      "</div></div>" +
      '<div class="b-panel"><div class="b-mtitle">Team / ทีม</div><div class="b-team">' +
        '<div><label>Tier</label><select id="b-tier">' + C.tierOrder.map(function (t) { return "<option" + (t === B.tier ? " selected" : "") + ">" + t + "</option>"; }).join("") + "</select></div>" +
        '<div><label>Boots / ความเร็ว</label><input type="text" id="b-boots" value="' + esc(B.boots) + '"></div>' +
        '<div><label>Pet / สัตว์เลี้ยง (1 ตัว)</label><button type="button" class="b-pick js-pick-pet">' + petBtn + "</button></div>" +
        '<div class="b-notes"><label>Notes / หมายเหตุ</label><textarea id="b-notes" rows="3">' + esc(B.notes) + "</textarea></div>" +
      "</div></div>" +
      '<div class="b-members">' + memberCols + "</div>" +
      '<div class="b-panel"><div class="b-mtitle">Skill order / ลำดับสกิล</div>' +
      (withChar.length
        ? '<p class="b-hint">กดสกิลเพื่อเพิ่มเข้าลำดับ · กดที่ลำดับเพื่อลบ / tap a skill to add it, tap an order chip to remove</p>' + skoRows +
          '<div class="so-order">' + (soChips || '<span class="dim">— ยังไม่ได้เลือกลำดับ —</span>') + "</div>"
        : '<p class="b-hint dim">เลือกตัวละครก่อน / pick heroes first</p>') +
      "</div>" +
      '<h2 class="section-title">Preview <small>ตัวอย่าง</small></h2><div id="b-preview"></div>' +
      '<h2 class="section-title">Code <small>คัดลอกไปวางต่อท้ายใน DATA_GVG (data/gvg.js)</small></h2>' +
      '<textarea id="b-code" class="b-code" rows="16" readonly></textarea>' +
      '<div class="b-actions"><button class="btn" id="b-copy">📋 Copy code</button><button class="btn ghost" id="b-reset">Reset</button></div>' +
      "</div>";

    var box = document.getElementById("builder");

    function readState() {
      B.tier = document.getElementById("b-tier").value;
      B.boots = document.getElementById("b-boots").value;
      B.notes = document.getElementById("b-notes").value;
      Array.prototype.forEach.call(box.querySelectorAll(".b-val"), function (el) {
        B.members[+el.getAttribute("data-m")].stats[+el.getAttribute("data-s")].value = el.value;
      });
      Array.prototype.forEach.call(box.querySelectorAll(".b-dval"), function (el) {
        B.members[+el.getAttribute("data-m")].dedicated.value = el.value;
      });
    }

    function updateOut() {
      var t = buildTeamObj();
      document.getElementById("b-preview").innerHTML = t.members.length
        ? gvgCard(t)
        : '<div class="empty">เลือกตัวละครอย่างน้อย 1 ตัว เพื่อดูตัวอย่างทีม</div>';
      document.getElementById("b-code").value = t.members.length ? teamToCode(t) : "";
      fixImages();
    }

    box.addEventListener("input", function () { readState(); saveBuild(); updateOut(); });

    box.addEventListener("click", function (ev) {
      var el = ev.target.closest ? ev.target.closest("button") : null;
      if (!el || !box.contains(el)) return;
      var m = +el.getAttribute("data-m");
      if (el.classList.contains("fm-card")) { B.formation = el.getAttribute("data-f"); saveBuild(); viewBuilder(); }
      else if (el.classList.contains("js-pick-char") || el.classList.contains("td-slot")) openCharPicker(m);
      else if (el.classList.contains("js-pick-set")) openSetPicker(m);
      else if (el.classList.contains("js-pick-stat")) openStatPicker(m, +el.getAttribute("data-s"));
      else if (el.classList.contains("js-pick-dstat")) openStatPicker(m, -1);
      else if (el.classList.contains("js-pick-pet")) openPetPicker();
      else if (el.classList.contains("sk-btn")) {
        B.skillOrder.push({ charId: B.members[m].charId, skill: el.getAttribute("data-skill") });
        saveBuild(); viewBuilder();
      }
      else if (el.classList.contains("so-chip")) {
        B.skillOrder.splice(+el.getAttribute("data-idx"), 1);
        saveBuild(); viewBuilder();
      }
    });

    document.getElementById("b-copy").addEventListener("click", function () {
      var ta = document.getElementById("b-code");
      var btn = this;
      function okMsg() { btn.textContent = "✔ Copied!"; setTimeout(function () { btn.textContent = "📋 Copy code"; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(okMsg, function () { ta.select(); document.execCommand("copy"); okMsg(); });
      } else { ta.select(); document.execCommand("copy"); okMsg(); }
    });
    document.getElementById("b-reset").addEventListener("click", function () {
      B = defaultBuild(); saveBuild(); viewBuilder();
    });

    updateOut();
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
    else if (parts[0] === "builder") viewBuilder();
    else viewHome();
    fixImages();
  }

  // ---------- custom icon pictures ----------
  // Drop a file at images/icons/<stat-id>.png (or .webp) to replace a
  // stat/set icon; images/pets/<pet-id>.png (or .webp) for pets.
  // Found images are applied and the page re-renders once.
  function probeCustomImages() {
    var jobs = [];
    function add(cfg, base, id) {
      if (!cfg || cfg.image) return;
      jobs.push({ cfg: cfg, urls: [base + id + ".png", base + id + ".webp"] });
    }
    Object.keys(C.stats).forEach(function (id) { add(C.stats[id], "images/icons/", id); });
    Object.keys(C.sets).forEach(function (id) { add(C.sets[id], "images/icons/", C.sets[id].svg || id); });
    Object.keys(C.pets).forEach(function (id) { add(C.pets[id], "images/pets/", id); });

    var pending = jobs.length, found = false;
    if (!pending) return;
    jobs.forEach(function (job) {
      function tryUrl(i) {
        if (i >= job.urls.length) {
          if (--pending === 0 && found) render();
          return;
        }
        var im = new Image();
        im.onload = function () {
          job.cfg.image = job.urls[i];
          found = true;
          if (--pending === 0) render();
        };
        im.onerror = function () { tryUrl(i + 1); };
        im.src = job.urls[i];
      }
      tryUrl(0);
    });
  }

  window.addEventListener("hashchange", render);
  render();
  probeCustomImages();
})();
