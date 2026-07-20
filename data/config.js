// ============================================================
// SITE CONFIG — icons, colors, item sets, stats, pets
// Edit this file to add new sets / stats / pets.
// ============================================================
window.CONFIG = {
  siteName: "7RE Guide",

  // Hero types (class)
  types: {
    Attack:    { icon: "⚔️", color: "#e5484d" },
    Magic:     { icon: "🔮", color: "#a06bff" },
    Defense:   { icon: "🛡️", color: "#4d9de5" },
    Support:   { icon: "✚",  color: "#3fbf7f" },
    Universal: { icon: "⭐", color: "#e5b84d" }
  },

  rarities: {
    Legendary: { color: "#f2b53d" },
    Special:   { color: "#a06bff" },
    Normal:    { color: "#8b93a7" }
  },

  // Tier row order + colors (used by tier list and GvG cards)
  tierOrder: ["S+", "S", "A+", "A", "B", "C"],
  tierColors: {
    "S+": "#ff5c5c",
    "S":  "#ff9f43",
    "A+": "#f7d154",
    "A":  "#7bd88f",
    "B":  "#5cb3ff",
    "C":  "#9aa4b2"
  },

  // Game modes for the tier list tabs
  modes: [
    { id: "gvg",      label: "GvG" },
    { id: "arena",    label: "Arena" },
    { id: "totalwar", label: "Total War" }
  ],

  // Position formations / รูปแบบตำแหน่ง (5 slots = back + front)
  // backBonus / frontBonus = stat bonus each row gets in that formation.
  formationOrder: ["b3f2", "b2f3", "b4f1", "b1f4"],
  formations: {
    b3f2: { name: "Back 3 · Front 2", back: 3, front: 2, backBonus: "14%",   frontBonus: "21%" },
    b2f3: { name: "Back 2 · Front 3", back: 2, front: 3, backBonus: "21%",   frontBonus: "14%" },
    b4f1: { name: "Back 4 · Front 1", back: 4, front: 1, backBonus: "10.5%", frontBonus: "42%" },
    b1f4: { name: "Back 1 · Front 4", back: 1, front: 4, backBonus: "42%",   frontBonus: "10.5%" }
  },

  // Item sets / เซ็ตของสวมใส่
  sets: {
    crit:      { name: "Crit",        nameTh: "คริ",        icon: "🎯", color: "#b16bff" },
    critdmg:   { name: "Crit DMG",    nameTh: "แรงคริ",     icon: "💥", color: "#ff6b9d" },
    atk:       { name: "Attack",      nameTh: "พลังโจมตี",  icon: "⚔️", color: "#e5484d" },
    def:       { name: "Defense",     nameTh: "ป้องกัน",    icon: "🛡️", color: "#4d9de5" },
    hp:        { name: "HP",          nameTh: "พลังชีวิต",  icon: "❤️", color: "#ff5c7a" },
    speed:     { name: "Speed",       nameTh: "ความเร็ว",   icon: "👟", color: "#3fbf7f" },
    lifesteal: { name: "Lifesteal",   nameTh: "ดูดเลือด",   icon: "🩸", color: "#d64562" },
    counter:   { name: "Counter",     nameTh: "สวนกลับ",    icon: "🔄", color: "#e5b84d" },
    critres:   { name: "Crit Resist", nameTh: "ต้านคริ",    icon: "🚫", color: "#9aa4b2" },
    evasion:   { name: "Evasion",     nameTh: "หลบหลีก",    icon: "💨", color: "#6bd0e5", svg: "eva" }
  },

  // Target stats / สเตตัสเป้าหมาย
  stats: {
    crit:    { name: "Crit Chance", nameTh: "อัตราคริ", icon: "🎯" },
    critdmg: { name: "Crit DMG",    nameTh: "แรงคริ",   icon: "💥" },
    speed:   { name: "Speed",       nameTh: "ความเร็ว", icon: "👟" },
    critres: { name: "Crit Resist", nameTh: "ลดคริ",    icon: "💢" },
    def:     { name: "Defense",     nameTh: "ป้องกัน",  icon: "🛡️" },
    hp:      { name: "HP",          nameTh: "พลังชีวิต",icon: "❤️" },
    atk:     { name: "Attack",      nameTh: "พลังโจมตี",icon: "⚔️" },
    acc:     { name: "Accuracy",    nameTh: "แม่นยำ",   icon: "👁️" },
    eva:     { name: "Evasion",     nameTh: "หลบหลีก",  icon: "💨" }
  },

  // Pets / สัตว์เลี้ยง — replace icon with an image later if you want:
  // add  image: "images/pets/xxx.png"  and it will be used instead of the emoji.
  pets: {
    snowfluff: { name: "Snow Fluff", icon: "🦁" },
    fairy:     { name: "Fairy",      icon: "🧚" },
    blueflame: { name: "Blue Flame", icon: "🔥" }
  }
};
