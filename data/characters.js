// ============================================================
// CHARACTERS / ตัวละคร  — SAMPLE DATA, edit freely.
//
// Each character:
//   id        unique short id (used by tiers.js and gvg.js)
//   name      display name
//   nameTh    Thai name (optional)
//   rarity    Legendary | Special | Normal   (see config.js)
//   type      Attack | Magic | Defense | Support | Universal
//   role      short text shown on the card
//   image     optional: "images/characters/<id>.webp" or .png
//             If the file does not exist, a colored placeholder
//             with the first letter is shown instead.
//   notes     free text for the character detail page
// ============================================================
window.DATA_CHARACTERS = [
  { id: "kyle",      name: "Kyle",      nameTh: "ไคล์",      rarity: "Legendary", type: "Attack",    role: "Physical DPS",      image: "images/characters/kyle.webp",      notes: "" },
  { id: "kagura",    name: "Kagura",    nameTh: "คางุระ",    rarity: "Legendary", type: "Attack",    role: "Physical DPS",      image: "images/characters/kagura.webp",    notes: "" },
  { id: "fai",       name: "Fai",       nameTh: "ฟาย",       rarity: "Legendary", type: "Attack",    role: "Physical DPS",      image: "images/characters/fai.webp",       notes: "" },
  { id: "juri",      name: "Juri",      nameTh: "จูริ",      rarity: "Legendary", type: "Magic",     role: "Magic DPS",         image: "images/characters/juri.webp",      notes: "" },
  { id: "yeonhee",   name: "Yeonhee",   nameTh: "ยอนฮี",     rarity: "Legendary", type: "Magic",     role: "Magic DPS",         image: "images/characters/yeonhee.webp",   notes: "" },
  { id: "spike",     name: "Spike",     nameTh: "สไปค์",     rarity: "Legendary", type: "Magic",     role: "CC / Freeze",       image: "images/characters/spike.webp",     notes: "" },
  { id: "dellons",   name: "Dellons",   nameTh: "เดลลอนส์",  rarity: "Legendary", type: "Attack",    role: "Burst DPS",         image: "images/characters/dellons.webp",   notes: "" },
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
