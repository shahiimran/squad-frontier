# Changelog

## v0.2 — 3D Foundation
- Replaced the root game entry point with a Three.js 3D prototype.
- Added a third-person follow camera with drag rotation and zoom.
- Added stylized terrain, trees, rocks, settlement props and outpost flags.
- Added commander movement, four squad helpers and Follow/Hold/Move Squad/Regroup orders.
- Added a mobile virtual joystick and touch-friendly HUD.
- Added three territory outposts, score, match timer and simple rival movement.
- Preserved the original v0.1 2D Canvas prototype under `legacy/`.
- Fixed pointer drag detection so camera movement is not mistaken for a ground-click command.

## Known limitations
- Early prototype geometry and basic opponent decision-making.
- No advanced pathfinding, multiplayer, accounts, cloud saves, audio or production-grade mobile optimization yet.
