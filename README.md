# 7RE Guide

Fan-made guide site for **Seven Knights Re:Birth** — characters, tier lists (GvG / Arena / Total War) and GvG builds.
Pure static site: no build step, no framework. Hosted on GitHub Pages.

## How to edit content / วิธีแก้ไขข้อมูล

All content lives in the `data/` folder. Edit the file → commit → push → the site updates in ~1 minute.

| File | What it holds |
|---|---|
| `data/characters.js` | All heroes (name, type, rarity, role, image path) |
| `data/tiers.js` | Tier lists for `gvg`, `arena`, `totalwar` |
| `data/gvg.js` | GvG team cards: item set, target stats, dedicated option, pets, notes |
| `data/config.js` | Item sets, stat icons, pets, tier colors, hero types |

Everything supports Thai text.

### Add a character

1. Add one line in `data/characters.js` with a unique `id`.
2. (Optional) Put a portrait at `images/characters/<id>.webp` (or change the `image` path).
   If the image is missing, the site shows a colored letter placeholder — nothing breaks.
3. Add the `id` to a tier in `data/tiers.js`.

### Add a GvG build

Copy one block in `data/gvg.js` and change it. Structure per member:

```js
{
  charId: "kyle",          // id from characters.js
  position: "B",           // "F" front / "B" back
  set: "crit",             // item set id from config.js
  stats: [                 // up to 3 target stat rows
    { stat: "crit",    value: "100" },
    { stat: "speed",   value: "32" },
    { stat: "critres", value: "ลดคริ" }
  ],
  dedicated: { stat: "def", value: "เยอะๆ" }   // dedicated option
}
```

## Run locally

Any static file server works, e.g.:

```
php -S 127.0.0.1:8010
```

then open http://127.0.0.1:8010

## Disclaimer

Fan project. Not affiliated with Netmarble. Game assets belong to their owners —
this repo ships no game art; portraits are placeholders until you add your own images.
