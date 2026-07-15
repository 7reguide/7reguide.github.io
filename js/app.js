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

  // ---------- team builder ----------
  var BKEY = "7re-builder-draft";
  var B = null;

  function emptyMember() {
    return { charId: "", position: "B", set: "",
      stats: [{ stat: "", value: "" }, { stat: "", value: "" }, { stat: "", value: "" }],
      dedicated: { stat: "", value: "" } };
  }
  function defaultBuild() {
    return { tier: "A+", boots: "-", skillOrder: ["", "", ""],
      members: [emptyMember(), emptyMember(), emptyMember()],
      pets: ["", "", ""], notes: "" };
  }
  function loadBuild() {
    if (B) return B;
    try { B = JSON.parse(localStorage.getItem(BKEY) || "null"); } catch (e) { B = null; }
    if (!B || !B.members || B.members.length !== 3) B = defaultBuild();
    return B;
  }
  function saveBuild() { try { localStorage.setItem(BKEY, JSON.stringify(B)); } catch (e) {} }

  function selOpts(pairs, selected, placeholder) {
    var html = '<option value="">' + esc(placeholder) + "</option>";
    pairs.forEach(function (p) {
      html += '<option value="' + esc(p[0]) + '"' + (p[0] === selected ? " selected" : "") + ">" + esc(p[1]) + "</option>";
    });
    return html;
  }

  // Builder state -> clean team object (same shape as data/gvg.js entries)
  function buildTeamObj() {
    var t = { tier: B.tier || "A+", boots: B.boots || "-" };
    var so = (B.skillOrder || []).filter(Boolean);
    if (so.length) t.skillOrder = so;
    t.members = [];
    (B.members || []).forEach(function (m) {
      if (!m.charId) return;
      var mm = { charId: m.charId, position: m.position || "B" };
      if (m.set) mm.set = m.set;
      mm.stats = (m.stats || []).filter(function (s) { return s.stat; })
        .map(function (s) { return { stat: s.stat, value: s.value || "" }; });
      if (m.dedicated && m.dedicated.stat) mm.dedicated = { stat: m.dedicated.stat, value: m.dedicated.value || "" };
      t.members.push(mm);
    });
    var pets = (B.pets || []).filter(Boolean);
    if (pets.length) t.pets = pets;
    if (B.notes) t.notes = B.notes;
    return t;
  }

  function teamToCode(t) {
    var L = ["  {"];
    L.push("    tier: " + JSON.stringify(t.tier) + ",");
    L.push("    boots: " + JSON.stringify(t.boots) + ",");
    if (t.skillOrder) L.push("    skillOrder: [" + t.skillOrder.map(function (s) { return JSON.stringify(s); }).join(", ") + "],");
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

  function viewBuilder() {
    setNav("builder");
    loadBuild();
    var charPairs = CHARS.map(function (c) { return [c.id, c.name + (c.nameTh ? " / " + c.nameTh : "")]; });
    var setPairs = Object.keys(C.sets).map(function (id) { var s = C.sets[id]; return [id, s.name + (s.nameTh ? " / " + s.nameTh : "")]; });
    var statPairs = Object.keys(C.stats).map(function (id) { var s = C.stats[id]; return [id, s.name + (s.nameTh ? " / " + s.nameTh : "")]; });
    var petPairs = Object.keys(C.pets).map(function (id) { return [id, C.pets[id].name]; });

    var memberCols = B.members.map(function (m, i) {
      var statRows = m.stats.map(function (s, j) {
        return '<div class="b-row">' +
          '<select class="b-stat" data-m="' + i + '" data-s="' + j + '">' + selOpts(statPairs, s.stat, "— stat —") + "</select>" +
          '<input type="text" class="b-val" data-m="' + i + '" data-s="' + j + '" value="' + esc(s.value) + '" placeholder="100 / เยอะๆ">' +
          "</div>";
      }).join("");
      return '<div class="b-member">' +
        '<div class="b-mtitle">Character ' + (i + 1) + "</div>" +
        '<label>ตัวละคร</label><select class="b-char" data-m="' + i + '">' + selOpts(charPairs, m.charId, "— เลือกตัวละคร —") + "</select>" +
        '<label>ตำแหน่ง</label><select class="b-pos" data-m="' + i + '">' +
          '<option value="B"' + (m.position !== "F" ? " selected" : "") + '>B · Back / หลัง</option>' +
          '<option value="F"' + (m.position === "F" ? " selected" : "") + '>F · Front / หน้า</option>' +
        "</select>" +
        '<label>1) Item Set / เซ็ตของสวมใส่</label><select class="b-set" data-m="' + i + '">' + selOpts(setPairs, m.set, "— เลือกเซ็ต —") + "</select>" +
        '<label>2) Main Stats / สเตตัสหลัก (3 แถว)</label>' + statRows +
        '<label>3) Tuning / Dedicated · ออปชั่นเฉพาะ</label>' +
        '<div class="b-row">' +
          '<select class="b-dstat" data-m="' + i + '">' + selOpts(statPairs, m.dedicated.stat, "— stat —") + "</select>" +
          '<input type="text" class="b-dval" data-m="' + i + '" value="' + esc(m.dedicated.value) + '" placeholder="เยอะๆ">' +
        "</div>" +
      "</div>";
    }).join("");

    app.innerHTML =
      '<h1 class="page-title">Team Builder</h1>' +
      '<p class="page-sub">เลือกตัวละคร 3 ตัว + สัตว์เลี้ยง → เซ็ตของ → สเตตัสหลัก 3 แถว → Tuning แล้วคัดลอกโค้ดไปวางใน <code>data/gvg.js</code></p>' +
      '<div class="builder" id="builder">' +
      '<div class="b-panel"><div class="b-mtitle">Team / ทีม</div><div class="b-team">' +
        '<div><label>Tier</label><select id="b-tier">' + C.tierOrder.map(function (t) { return "<option" + (t === B.tier ? " selected" : "") + ">" + t + "</option>"; }).join("") + "</select></div>" +
        '<div><label>Boots / ความเร็ว</label><input type="text" id="b-boots" value="' + esc(B.boots) + '"></div>' +
        '<div><label>Skill order / ลำดับสกิล</label><div class="b-row">' + [0, 1, 2].map(function (k) { return '<input type="text" class="b-so" data-k="' + k + '" value="' + esc(B.skillOrder[k] || "") + '" maxlength="2">'; }).join("") + "</div></div>" +
        '<div><label>Pets / สัตว์เลี้ยง</label><div class="b-row">' + [0, 1, 2].map(function (k) { return '<select class="b-pet" data-k="' + k + '">' + selOpts(petPairs, B.pets[k] || "", "— pet —") + "</select>"; }).join("") + "</div></div>" +
        '<div class="b-notes"><label>Notes / หมายเหตุ</label><textarea id="b-notes" rows="3">' + esc(B.notes) + "</textarea></div>" +
      "</div></div>" +
      '<div class="b-members">' + memberCols + "</div>" +
      '<h2 class="section-title">Preview <small>ตัวอย่าง</small></h2><div id="b-preview"></div>' +
      '<h2 class="section-title">Code <small>คัดลอกไปวางต่อท้ายใน DATA_GVG (data/gvg.js)</small></h2>' +
      '<textarea id="b-code" class="b-code" rows="16" readonly></textarea>' +
      '<div class="b-actions"><button class="btn" id="b-copy">📋 Copy code</button><button class="btn ghost" id="b-reset">Reset</button></div>' +
      "</div>";

    var box = document.getElementById("builder");

    function readState() {
      B.tier = document.getElementById("b-tier").value;
      B.boots = document.getElementById("b-boots").value;
      B.skillOrder = [].map.call(box.querySelectorAll(".b-so"), function (e) { return e.value.trim(); });
      B.pets = [].map.call(box.querySelectorAll(".b-pet"), function (e) { return e.value; });
      B.notes = document.getElementById("b-notes").value;
      B.members.forEach(function (m, i) {
        m.charId = box.querySelector('.b-char[data-m="' + i + '"]').value;
        m.position = box.querySelector('.b-pos[data-m="' + i + '"]').value;
        m.set = box.querySelector('.b-set[data-m="' + i + '"]').value;
        m.stats.forEach(function (s, j) {
          s.stat = box.querySelector('.b-stat[data-m="' + i + '"][data-s="' + j + '"]').value;
          s.value = box.querySelector('.b-val[data-m="' + i + '"][data-s="' + j + '"]').value;
        });
        m.dedicated.stat = box.querySelector('.b-dstat[data-m="' + i + '"]').value;
        m.dedicated.value = box.querySelector('.b-dval[data-m="' + i + '"]').value;
      });
    }

    function updateOut() {
      var t = buildTeamObj();
      document.getElementById("b-preview").innerHTML = t.members.length
        ? gvgCard(t)
        : '<div class="empty">เลือกตัวละครอย่างน้อย 1 ตัว เพื่อดูตัวอย่างทีม</div>';
      document.getElementById("b-code").value = t.members.length ? teamToCode(t) : "";
      fixPortraits();
    }

    box.addEventListener("input", function () { readState(); saveBuild(); updateOut(); });

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
    fixPortraits();
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
