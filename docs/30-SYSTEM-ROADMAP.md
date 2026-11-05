# Squad Frontier — 30-System Development Roadmap

## Approved direction
An original browser-playable 3D third-person commander and real-time army command game inspired by the broad gameplay loop in the user's Roblox reference. No Roblox source code, branding, or ripped assets are used.

## 30 major systems
1. Third-person commander
2. Horse riding
3. Army recruitment
4. Army selection
5. Rush / Attack / Follow / Hold commands
6. Line / Block / Wedge formations
7. Infantry / Archers / Knights / Spearmen / Cavalry / Guards
8. Soldier combat AI
9. Rival AI
10. Combat animation
11. Unit progression and equipment
12. Army management
13. Castle capture
14. Flag/outpost capture
15. Castle defence
16. Building placement and construction
17. Territory ownership
18. Siege gameplay
19. 3D open battlefield
20. Multiple kingdoms
21. Resource economy
22. Villagers and workers
23. Trading
24. Diplomacy
25. Modern 3D rendering
26. Weather and day/night
27. Tactical and third-person camera
28. Landscape-first mobile controls
29. Audio and effects
30. Campaign save, missions and achievements

## v1.1 development preview status
Implemented foundations: commander movement, mount toggle, squad commands, three formation layouts, six troop recruitment classes, basic combat and rival logic, outposts, castle health, buildings, local economy, region map, trade panel, diplomacy-state panel, campaign objectives, achievements, worker decoration, river/bridge scenery, weather presets, day/night lighting, local save extension and landscape-first HUD.

## Remaining production work
- Real horse rig, locomotion and mounted combat
- True drag-select and squad grouping
- Geometric formation movement for every order
- Tactical enemy formations and multi-kingdom campaign simulation
- Real castle capture/defence states and siege units
- Modular building placement and construction progress
- Villager jobs, production chains and pathfinding
- Functional diplomacy and trade routes
- Seasonal terrain changes and rain particle effects
- Audio, animation blending, VFX and accessibility options
- Mobile performance profiling, touch camera polish and browser compatibility testing
- Cloud saves and multiplayer authority/server architecture

## Testing checklist
- Load the page over HTTP(S) so the Three.js module import resolves.
- Start the game and verify the existing recruit/build/upgrade/save/load controls.
- Verify landscape prompt in portrait and HUD fit in landscape on a touch device.
- Verify Rush, Attack, Follow, Hold and each formation preset.
- Recruit each troop class and verify its stats and visuals.
- Test each trade action with sufficient and insufficient resources.
- Test outpost capture, campaign mission notifications and local save/load.
- Cycle clear/rain/fog and inspect day/night lighting.
- Check browser console for runtime errors and profile performance on target Android devices.
