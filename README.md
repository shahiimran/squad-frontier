# Squad Frontier — v0.1

A small, original, browser-playable squad coordination prototype. It takes inspiration from the broad idea of commanding a small group and competing to occupy map checkpoints, but uses original visuals and non-combat gameplay.

## Play

Open `index.html` in a modern browser. On desktop, click the map to move the commander or use **WASD / arrow keys**. On mobile, tap the map. Use **Follow**, **Hold**, and **Move squad** to coordinate the four helpers. Occupying checkpoints earns points; the top score wins when the two-minute timer ends.

## GitHub Pages

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
3. After the Pages deployment completes, open the published URL shown on the Pages settings screen.

## Current scope

- Solo browser game against a simple local computer opponent.
- Responsive canvas display for desktop and mobile browsers.
- Checkpoint capture, score, timer, squad orders, and local best-score storage.
- No accounts, server-side storage, or online multiplayer yet.

## Next development milestones

- v0.2: more maps, improved opponent behaviour, pause/settings, sound and better touch controls.
- v0.3: unit upgrades and unlocks using non-combat abilities (speed, coordination, support).
- v0.4: optional cloud save and rooms, which require a separate backend service.

This is an independent learning project and is not affiliated with Roblox or the creators of any other game.


## v0.3 — Castles & Armies
- Added two stylized medieval castles with towers, keeps, walls and banners.
- Added a recruit button that spends in-game gold to create additional soldiers.
- Added a simple arcade siege order against the rival castle; wall sections visibly disappear as the abstract castle health decreases.
- Added army count and gold HUD.
- Combat is fictional and abstract; this prototype does not model real-world tactics or weapons.

## v0.3 controls
- Recruit: spend 50 gold to add a soldier.
- Siege enemy castle: send your current army toward the rival fort.
- Existing movement and camera controls remain available.


## v0.4 — Kingdoms: full gameplay foundation

The game has expanded from a small squad demo into a larger browser-based medieval kingdom strategy prototype.

### Current gameplay
- Two stylized castles, a home settlement, rival keep, forests, rocks and paths.
- Three recruitable troop classes: infantry, archers and knights, each with different health, speed, range and damage values.
- Select individual friendly units or use Select Army; issue Follow, Hold and Move Selected orders.
- Build farms and barracks; earn gold, wood, stone and food over time.
- Upgrade the home castle through five levels.
- Capture three neutral outposts for additional passive income.
- Rival army patrol/approach behavior, reinforcements and abstract arcade-style unit encounters.
- Enemy keep objective with a visible health value.
- Local save/load using browser storage.
- Desktop keyboard/mouse and mobile virtual joystick controls.

### Controls
- WASD / arrow keys: move commander.
- Drag: orbit camera; mouse wheel: zoom.
- Click a friendly troop: select it. Shift-click can add to selection.
- Select Army: select all friendly troops.
- Move Selected: tap/click a destination.
- Follow / Hold: change selected troops' orders.
- Capture Enemy Keep: send selected troops toward the rival keep.
- Recruit buttons: spend food to create troop units.
- Build Farm / Build Barracks: spend wood.
- Upgrade Castle: spend stone.
- Save / Load: store or restore a local kingdom save on this browser/device.

### Notes and limitations
This is an expanding prototype, not yet a finished commercial-scale game. Combat is fictional and abstract. The current AI and path movement are intentionally lightweight; advanced pathfinding, proper unit animations, deeper building placement, sound, campaign missions, online multiplayer, server-side saves and extensive mobile optimization remain future work. Three.js is loaded from jsDelivr, so the game needs an internet connection.


## v0.5 — Modern UI refresh
- Reworked the interface with a modern glass-style HUD, clearer hierarchy and responsive panels.
- Improved resource readability, objective cards, command buttons, focus states and touch joystick styling.
- Added reduced-motion support and smaller-screen layout refinements.
- Existing Three.js gameplay code and controls are unchanged in this visual-only release.


## v0.9 — World Map & Rival AI
- Added a strategic nine-region frontier map with player, rival and neutral ownership.
- Added claimable neutral regions with a gold cost and starter resource rewards.
- Added rival kingdom expansion that periodically claims unowned frontier regions while the game is running.
- Added a responsive world-map overlay with ownership legend and region descriptions.
- This is a lightweight strategic layer; territory income, diplomacy, path-connected campaigns and persistent rival simulation are future upgrades.


## v1.0 — Command & Army gameplay direction
This release introduces a Command-and-Army-inspired battlefield interface and commander/squad command layer:
- Third-person battlefield command HUD: Rush, Attack, Follow and Hold.
- Three selectable formation presets (line, block and wedge) in the command UI.
- Mounted commander visual with a procedural horse model and mount/dismount toggle.
- Squad status card showing selected and total soldiers plus current order.
- Mobile-friendly action controls for heal, sprint and dodge-roll feedback.
- Existing recruitable infantry, archers, knights, unit selection and battlefield remain in place.

This is a gameplay foundation/prototype. Formation presets currently set command intent in the UI; full geometric formation movement, animated horse locomotion, dedicated mounted combat, real healing balance, and touch camera/targeting polish remain future work.
