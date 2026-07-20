// ============================================================
// GvG BUILDS / บิลด์กิลด์วอร์ — SAMPLE DATA, edit freely.
//
// Each entry is one team card (like the spreadsheet row):
//   tier        tier badge, e.g. "A+"  (colors in config.js)
//   boots       speed requirement shown under the tier ("-" = none)
//   formation   optional: "b3f2" | "b2f3" | "b4f1" | "b1f4"
//               (position formation — see config.js formations)
//   skillOrder  skill order / ลำดับสกิล — two formats work:
//                 simple text:  ["2", "1", "3"]
//                 from Builder: [{ charId: "kyle", skill: "active1" }, ...]
//                 (skill: "active1" | "active2" | "awakening")
//   members     1-5 characters, each with:
//     charId     id from data/characters.js
//     position   "F" = front / หน้า, "B" = back / หลัง
//     set        item set id from config.js sets  (เซ็ตของสวมใส่)
//     stats      up to 3 target stat rows: { stat, value }
//                stat ids are in config.js stats; value is free text
//     dedicated  dedicated option / ออปชั่นเฉพาะ: { stat, value }
//   pets        pet ids from config.js pets
//   notes       หมายเหตุ — free text, Thai OK
//
// CUSTOM ICON PICTURES / ใส่รูปไอคอนเอง:
//   Put a picture at  images/icons/<stat-id>.png  (or .webp) and the
//   site uses it automatically for that stat / set / dedicated option.
//   วางรูปที่ images/icons/ ตั้งชื่อตาม id เช่น crit.png, speed.png
//   Pets: images/pets/<pet-id>.png  เช่น images/pets/fairy.png
//   stat ids: crit, critdmg, speed, critres, def, hp, atk, acc, eva
// ============================================================
//
// ─── TEMPLATE — copy this block to add a new team ───────────
// คัดลอกบล็อกนี้ไปวางใน DATA_GVG ด้านล่าง แล้วลบ // ออก
//
//  {
//    tier: "S",                        // S+ | S | A+ | A | B | C
//    boots: "-",                       // ความเร็วรองเท้า ("-" = ไม่กำหนด)
//    skillOrder: ["1", "2", "3"],      // ลำดับสกิล
//    members: [
//      {
//        charId: "kyle",               // id จาก data/characters.js
//        position: "B",                // "F" = หน้า, "B" = หลัง
//        set: "crit",                  // crit | critdmg | atk | def | hp | speed | lifesteal | counter | critres | evasion
//        stats: [                      // สเตตัสเป้าหมาย (สูงสุด 3 แถว)
//          { stat: "crit",    value: "100" },
//          { stat: "speed",   value: "32" },
//          { stat: "critres", value: "ลดคริ" }
//        ],
//        dedicated: { stat: "def", value: "เยอะๆ" }   // ออปชั่นเฉพาะ
//      }
//      // เพิ่มสมาชิกได้ 1-5 ตัว (คั่นด้วย , )
//    ],
//    pets: ["fairy"],                  // id จาก config.js pets
//    notes: "หมายเหตุ...\n→ ขึ้นบรรทัดใหม่ด้วย \\n"
//  },
// ─────────────────────────────────────────────────────────────
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
