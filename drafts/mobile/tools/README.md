# Screenshot helpers for the mobile audit

Throw-away helpers used to make the before/after images in the PRs. They need `pillow` (Python) and the
emulation setup from `docs/mobile-check.md`.

- `shot.mjs <base> <url> <device> <out.jpg> [js] [wait-ms] [--full] [--theme=dark]` one emulated screenshot
- `probe.mjs <url> <w> <h> '<js>'` evaluate an expression in an emulated viewport (`BASE=` picks the server)
- `sheet.py` / `grid.py` tile screenshots side by side or in a captioned grid (small JPEGs)
- `mkgrid.sh` before/after grid at 320, 375 and 430
