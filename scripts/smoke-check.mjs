import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('index.html', 'utf8');
const js = readFileSync('src/main.js', 'utf8');
const requiredIds = [
  'game','start','landscapePrompt','rotateContinue','fullscreenBtn',
  'cmdRush','cmdAttack','cmdFollow','cmdHold','cmdMount','cmdHeal',
  'cmdRoll','cmdSprint','empireOpen','empirePanel','empireContent',
  'empireClose','worldMap','openWorldMap','closeWorldMap'
];
for (const id of requiredIds) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing UI element: ${id}`);
}
for (const token of [
  'function setOrder','function renderEmpire','function empireAction',
  'function setWeather','function battles','function ai','function economy',
  'function rival','data-formation','frontierRegions','missionList',\n  "kind==='spearman'","kind==='cavalry'","kind==='guard'"
]) {
  assert.ok(js.includes(token), `Missing gameplay system: ${token}`);
}
assert.match(html, /orientation:landscape/, 'Landscape layout media query missing');
assert.match(html, /ROTATE TO LANDSCAPE/, 'Portrait rotation prompt missing');
console.log('Squad Frontier smoke checks passed.');
