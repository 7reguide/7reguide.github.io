// ============================================================
// CHARACTERS / ตัวละคร — SAMPLE DATA, edit freely.
//
// ─── HOW TO ADD A NEW CHARACTER (easy way) ──────────────────
// 1) Copy the TEMPLATE block below and paste it at the end of
//    the list (before the closing ];), then remove the //.
// 2) Fill in the names / descriptions (Thai OK, later is fine).
// 3) Drop pictures with these EXACT file names — the site picks
//    them up automatically, no code change needed:
//      Portrait:   images/characters/<id>.webp   (or .png)
//      Skills:     images/skills/<id>-normal.png
//                  images/skills/<id>-active1.png
//                  images/skills/<id>-active2.png
//                  images/skills/<id>-passive.png
//                  images/skills/<id>-awakening.png  (only if can awake)
//    No picture yet? A placeholder box is shown automatically.
//
// Skill slots: 1 normal + 2 active + 1 passive + 1 awakening
// (awakening: only for heroes that can awake — delete the line
// for everyone else). `skills` is optional — a hero without it
// still works; the builder then shows generic Skill 1 / Skill 2.
//
// ─── TEMPLATE — copy from here ──────────────────────────────
//  { id: "newhero", name: "New Hero", nameTh: "ชื่อไทย",
//    rarity: "Legendary",             // Legendary | Special | Normal
//    type: "Attack",                  // Attack | Magic | Defense | Support | Universal
//    role: "Physical DPS",
//    image: "images/characters/newhero.webp",
//    notes: "",
//    skills: {
//      normal:    { name: "Normal Attack", nameTh: "", desc: "" },
//      active1:   { name: "Skill 1",       nameTh: "", desc: "" },
//      active2:   { name: "Skill 2",       nameTh: "", desc: "" },
//      passive:   { name: "Passive",       nameTh: "", desc: "" },
//      awakening: { name: "Awakening",     nameTh: "", desc: "" }  // ← DELETE if cannot awake
//    }
//  },
// ─────────────────────────────────────────────────────────────
window.DATA_CHARACTERS = [
  // Full example WITHOUT awakening:
  { id: "kyle", name: "Kyle", nameTh: "ไคล์", rarity: "Legendary", type: "Attack", role: "Physical DPS",
    image: "images/characters/kyle.webp", notes: "",
    skills: {
      normal:  { name: "Normal Attack", nameTh: "โจมตีปกติ", desc: "" },
      active1: { name: "Skill 1", nameTh: "", desc: "" },
      active2: { name: "Skill 2", nameTh: "", desc: "" },
      passive: { name: "Passive", nameTh: "", desc: "" }
    } },
  // Full example WITH awakening:
  { id: "dellons", name: "Dellons", nameTh: "เดลลอนส์", rarity: "Legendary", type: "Attack", role: "Burst DPS",
    image: "images/characters/dellons.webp", notes: "",
    skills: {
      normal:    { name: "Normal Attack", nameTh: "โจมตีปกติ", desc: "" },
      active1:   { name: "Skill 1", nameTh: "", desc: "" },
      active2:   { name: "Skill 2", nameTh: "", desc: "" },
      passive:   { name: "Passive", nameTh: "", desc: "" },
      awakening: { name: "Awakening", nameTh: "ปลุกพลัง", desc: "" }
    } },
  { id: "kagura",    name: "Kagura",    nameTh: "คางุระ",    rarity: "Legendary", type: "Attack",    role: "Physical DPS",      image: "images/characters/kagura.webp",    notes: "" },
  { id: "fai",       name: "Fai",       nameTh: "ฟาย",       rarity: "Legendary", type: "Attack",    role: "Physical DPS",      image: "images/characters/fai.webp",       notes: "" },
  { id: "juri",      name: "Juri",      nameTh: "จูริ",      rarity: "Legendary", type: "Magic",     role: "Magic DPS",         image: "images/characters/juri.webp",      notes: "" },
  { id: "yeonhee",   name: "Yeonhee",   nameTh: "ยอนฮี",     rarity: "Legendary", type: "Magic",     role: "Magic DPS",         image: "images/characters/yeonhee.webp",   notes: "" },
  { id: "spike",     name: "Spike",     nameTh: "สไปค์",     rarity: "Legendary", type: "Magic",     role: "CC / Freeze",       image: "images/characters/spike.webp",     notes: "" },
  { id: "eileene",   name: "Eileene",   nameTh: "ไอลีน",     rarity: "Legendary", type: "Universal", role: "Buffer / DPS",      image: "images/characters/eileene.webp",   notes: "" },
  { id: "kris",      name: "Kris",      nameTh: "คริส",      rarity: "Legendary", type: "Defense",   role: "Tank / Revive",     image: "images/characters/kris.webp",      notes: "" },
  { id: "rudy",      name: "Rudy",      nameTh: "รูดี้",     rarity: "Legendary", type: "Defense",   role: "Tank",              image: "images/characters/rudy.webp",      notes: "" },
  { id: "rachel",    name: "Rachel",    nameTh: "ราเชล",     rarity: "Legendary", type: "Attack",    role: "Physical DPS",      image: "images/characters/rachel.webp",    notes: "" },
  { id: "lina",      name: "Lina",      nameTh: "ลีนา",      rarity: "Legendary", type: "Support",   role: "Healer",            image: "images/characters/lina.webp",      notes: "" },
  { id: "karin",     name: "Karin",     nameTh: "คาริน",     rarity: "Legendary", type: "Support",   role: "Debuffer",          image: "images/characters/karin.webp",     notes: "" },
  { id: "sein",      name: "Sein",      nameTh: "เซน",       rarity: "Legendary", type: "Support",   role: "Healer",            image: "images/characters/sein.webp",      notes: "" },
  { id: "radgrid",   name: "Radgrid",   nameTh: "ราดกริด",   rarity: "Legendary", type: "Defense",   role: "Tank / Taunt",      image: "images/characters/radgrid.webp",   notes: "" },
  { id: "reginleif", name: "Reginleif", nameTh: "เรกินเลฟ",  rarity: "Legendary", type: "Support",   role: "Cleanse / Support", image: "images/characters/reginleif.webp", notes: "" }
];
