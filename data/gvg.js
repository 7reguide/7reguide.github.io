// ============================================================
// GvG BUILDS / บิลด์กิลด์วอร์ — SAMPLE DATA, edit freely.
//
// Each entry is one team card (like the spreadsheet row):
//   tier        tier badge, e.g. "A+"  (colors in config.js)
//   boots       speed requirement shown under the tier ("-" = none)
//   skillOrder  skill order / ลำดับสกิล, e.g. ["2","1","3"]
//   members     1-5 characters, each with:
//     charId     id from data/characters.js
//     position   "F" = front / หน้า, "B" = back / หลัง
//     set        item set id from config.js sets  (เซ็ตของสวมใส่)
//     stats      up to 3 target stat rows: { stat, value }
//                stat ids are in config.js stats; value is free text
//     dedicated  dedicated option / ออปชั่นเฉพาะ: { stat, value }
//   pets        pet ids from config.js pets
//   notes       หมายเหตุ — free text, Thai OK
// ============================================================
window.DATA_GVG = [
  {
    tier: "A+",
    boots: "-",
    skillOrder: ["2", "1", "3"],
    members: [
      {
        charId: "kyle", position: "B", set: "crit",
        stats: [
          { stat: "crit",    value: "100" },
          { stat: "speed",   value: "32" },
          { stat: "critres", value: "ลดคริ" }
        ],
        dedicated: { stat: "def", value: "เยอะๆ" }
      },
      {
        charId: "spike", position: "B", set: "lifesteal",
        stats: [
          { stat: "crit",    value: "70+" },
          { stat: "speed",   value: "32" },
          { stat: "critres", value: "ลดคริ" }
        ],
        dedicated: { stat: "def", value: "เยอะๆ" }
      },
      {
        charId: "lina", position: "F", set: "hp",
        stats: [
          { stat: "speed",   value: "32" },
          { stat: "critres", value: "ลดคริ" }
        ],
        dedicated: { stat: "def", value: "เยอะๆ" }
      }
    ],
    pets: ["snowfluff", "fairy", "blueflame"],
    notes: "ตัวอย่างข้อมูล — แก้ไขได้ใน data/gvg.js\n→ เปิดด้วยสกิล 2 ก่อน\n→ ระวังทีมสวนกลับ"
  },
  {
    tier: "S",
    boots: "40+",
    skillOrder: ["1", "3", "2"],
    members: [
      {
        charId: "radgrid", position: "F", set: "hp",
        stats: [
          { stat: "hp",      value: "เยอะๆ" },
          { stat: "speed",   value: "40+" },
          { stat: "critres", value: "ลดคริ" }
        ],
        dedicated: { stat: "def", value: "เยอะๆ" }
      },
      {
        charId: "kagura", position: "B", set: "crit",
        stats: [
          { stat: "crit",    value: "100" },
          { stat: "critdmg", value: "เยอะๆ" },
          { stat: "speed",   value: "38" }
        ],
        dedicated: { stat: "atk", value: "เยอะๆ" }
      },
      {
        charId: "reginleif", position: "B", set: "speed",
        stats: [
          { stat: "speed",   value: "45+" },
          { stat: "hp",      value: "เยอะๆ" },
          { stat: "critres", value: "ลดคริ" }
        ],
        dedicated: { stat: "hp", value: "เยอะๆ" }
      }
    ],
    pets: ["fairy"],
    notes: "ตัวอย่างข้อมูล — ทีมบุกมาตรฐาน\n→ Reginleif ต้องเร็วกว่าทุกตัว"
  }
];
