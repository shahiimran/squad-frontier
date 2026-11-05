import * as THREE from 'three';

const $=id=>document.getElementById(id), mount=$('game');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fc4d5);scene.fog=new THREE.Fog(0x9fc4d5,75,190);
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,350);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xe6f4ff,0x4b6547,2));
const sun=new THREE.DirectionalLight(0xffedce,2.1);sun.position.set(-45,70,35);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);sun.shadow.camera.left=-85;sun.shadow.camera.right=85;sun.shadow.camera.top=85;sun.shadow.camera.bottom=-85;scene.add(sun);
const mat=(c,r=1)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const M={grass:mat(0x557e4d),grass2:mat(0x668e59),stone:mat(0x89969b),dark:mat(0x3e4b55),wood:mat(0x79553a),roof:mat(0x73443b),blue:mat(0x238ec8),blue2:mat(0x68c6ef),red:mat(0xb9573e),red2:mat(0xf0a36a),gold:mat(0xe0b34d),path:mat(0xb4a17d),leaf:mat(0x2d6547),skin:mat(0xe7bd98),farm:mat(0x9b8c4b)};
const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),M.grass);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const path=new THREE.Mesh(new THREE.RingGeometry(15,21,80),M.path);path.rotation.x=-Math.PI/2;path.position.y=.025;scene.add(path);
function box(w,h,d,material,x,y,z,parent=scene){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function cylinder(rt,rb,h,material,x,y,z,parent=scene){const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,8),material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function tree(x,z,s=1){cylinder(.22*s,.34*s,1.7*s,M.wood,x,.85*s,z);for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.ConeGeometry(1.25*s-i*.18,2.2*s,7),M.leaf);crown.position.set(x,2*s+i*.8*s,z);crown.castShadow=true;scene.add(crown)}}
for(let i=0;i<210;i++){const a=Math.random()*Math.PI*2,r=25+Math.random()*78,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<17&&Math.abs(z)<17)continue;tree(x,z,.65+Math.random()*.65)}
for(let i=0;i<45;i++){const x=(Math.random()-.5)*180,z=(Math.random()-.5)*180,rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.5+Math.random(),0),M.stone);rock.position.set(x,.35,z);rock.castShadow=true;scene.add(rock)}
// Kingdom castles
function castle(x,z,team,scale=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);const wall=team===1?M.stone:mat(0x927d73),roof=team===1?M.blue:M.red;
box(18,.8,17,wall,0,.4,0,g);for(let i=0;i<6;i++){box(2.7,5,.9,wall,-7+i*2.8,2.9,8.1,g);box(2.7,5,.9,wall,-7+i*2.8,2.9,-8.1,g)}
for(let i=0;i<4;i++){box(.9,5,4,wall,i<2?-9:9,2.9,i%2?5:-5,g)}
for(const [tx,tz] of [[-9,-8],[9,-8],[-9,8],[9,8]]){cylinder(1.55,1.8,7,wall,tx,3.5,tz,g);const cap=new THREE.Mesh(new THREE.ConeGeometry(2,3,8),roof);cap.position.set(tx,8.3,tz);g.add(cap)}
box(6,8,6,wall,0,4.4,-1,g);const keepRoof=new THREE.Mesh(new THREE.ConeGeometry(5,4,4),roof);keepRoof.position.set(0,10,-1);keepRoof.rotation.y=Math.PI/4;g.add(keepRoof);box(.2,4,.2,M.wood,0,12,3,g);box(2,1.2,.12,roof,1,12.9,3,g);
return {group:g,x,z,team,health:100,level:1};}
const home=castle(-48,30,1,1.1),enemy=castle(54,-42,-1,1.15);
function building(x,z,type,team=1){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const c=team===1?M.stone:mat(0x9a7566),r=team===1?M.blue:M.red;box(type==='barracks'?8:7,3.5,6,c,0,1.75,0,g);const roof=new THREE.Mesh(new THREE.ConeGeometry(5.8,2.8,4),r);roof.position.y=4.8;roof.rotation.y=Math.PI/4;g.add(roof);return {group:g,x,z,type,team,level:1}}
const buildings=[building(-30,28,'barracks'),building(-61,42,'farm'),building(39,-35,'barracks',-1)];
// units
const units=[],selected=new Set();let uid=1;
function person(team,kind){const g=new THREE.Group();const col=team===1?M.blue:M.red;const scale=kind==='knight'?1.08:kind==='archer'?.88:1;const body=new THREE.Mesh(new THREE.CapsuleGeometry(.36*scale,.68*scale,4,8),col);body.position.y=1.05*scale;body.castShadow=true;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.24*scale,12,10),M.skin);head.position.y=1.75*scale;g.add(head);const helm=new THREE.Mesh(new THREE.ConeGeometry(.28*scale,.4*scale,6),team===1?M.blue2:M.red2);helm.position.y=2.02*scale;g.add(helm);const shield=new THREE.Mesh(new THREE.BoxGeometry(.16,.55,.4),team===1?M.gold:M.dark);shield.position.set(.38,1.05,.1);g.add(shield);if(kind==='archer'){const bow=new THREE.Mesh(new THREE.TorusGeometry(.25,.035,5,12,Math.PI),M.wood);bow.position.set(-.38,1.2,0);g.add(bow)}if(kind==='knight'){const cape=new THREE.Mesh(new THREE.BoxGeometry(.45,.8,.12),team===1?M.blue2:M.red2);cape.position.set(0,1.1,-.32);g.add(cape)}return g}
function addUnit(team,kind,x,z){const mesh=person(team,kind);mesh.position.set(x,0,z);scene.add(mesh);const u={id:uid++,team,kind,mesh,hp:kind==='knight'?150:kind==='archer'?65:100,max:kind==='knight'?150:kind==='archer'?65:100,speed:kind==='knight'?5.4:kind==='archer'?4.5:4.8,damage:kind==='knight'?17:kind==='archer'?12:10,range:kind==='archer'?11:2.5,order:team===1?'follow':'defend',target:new THREE.Vector3(x,0,z),cool:Math.random(),alive:true};units.push(u);return u}
for(let i=0;i<5;i++)addUnit(1,'infantry',-42+(i%3)*2,39+Math.floor(i/3)*2);
for(let i=0;i<7;i++)addUnit(-1,i%3===0?'archer':'infantry',48+(i%3)*2,-35+Math.floor(i/3)*2);
const outposts=[{name:'Old Bridge',x:-4,z:2,owner:0,p:0},{name:'Windmill Hill',x:29,z:28,owner:0,p:0},{name:'Pinewatch',x:3,z:-48,owner:0,p:0}];
for(const o of outposts){const ring=new THREE.Mesh(new THREE.CylinderGeometry(4.5,4.5,.14,40),new THREE.MeshStandardMaterial({color:0xe9dfba,transparent:true,opacity:.75}));ring.position.set(o.x,.12,o.z);scene.add(ring);cylinder(.12,.16,4,M.wood,o.x,2,o.z);const flag=box(1.8,1,.12,M.gold,o.x+1,3.2,o.z);o.ring=ring;o.flag=flag}
let resources={gold:500,wood:250,stone:200,food:300},castleLevel=1,paused=true,started=false,selectedMode=false,moveMode=false,attackMode=false,clock=0,score=0,toastTimer;
function notify(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),1900);$('log').textContent=s}
function updateHUD(){$('gold').textContent=Math.floor(resources.gold);$('wood').textContent=Math.floor(resources.wood);$('stone').textContent=Math.floor(resources.stone);$('food').textContent=Math.floor(resources.food);$('army').textContent=units.filter(u=>u.alive&&u.team===1).length;$('objectives').innerHTML=outposts.map(o=>'<div class="obj"><span>'+o.name+'</span><b>'+(o.owner===1?'YOU':o.owner===-1?'RIVAL':'NEUTRAL')+'</b></div>').join('')+'<div class="obj"><span>Enemy keep</span><b>'+Math.max(0,Math.ceil(enemy.health))+'%</b></div>'}
function recruit(kind){const cost={infantry:60,archer:80,knight:130}[kind];if(resources.food<cost){notify('Not enough food to recruit.');return}resources.food-=cost;const n=units.filter(u=>u.alive&&u.team===1).length;const u=addUnit(1,kind,-43+(n%4)*2,43+Math.floor(n/4)*2);u.order='follow';notify(kind+' recruited.');updateHUD()}
$('recruitInf').onclick=()=>recruit('infantry');$('recruitArch').onclick=()=>recruit('archer');$('recruitKnight').onclick=()=>recruit('knight');
$('buildFarm').onclick=()=>{if(resources.wood<90)return notify('Need 90 wood.');resources.wood-=90;const n=buildings.filter(b=>b.team===1&&b.type==='farm').length;buildings.push(building(-65+n*9,53,'farm'));notify('Farm built. Food income increased.');updateHUD()};
$('buildBarracks').onclick=()=>{if(resources.wood<120)return notify('Need 120 wood.');resources.wood-=120;const n=buildings.filter(b=>b.team===1&&b.type==='barracks').length;buildings.push(building(-26+n*10,42,'barracks'));notify('Barracks built.');updateHUD()};
$('upgrade').onclick=()=>{if(resources.stone<120)return notify('Need 120 stone.');if(castleLevel>=5)return notify('Castle is max level.');resources.stone-=120;castleLevel++;home.level=castleLevel;home.group.scale.setScalar(1.1+(castleLevel-1)*.08);home.health=100;notify('Castle upgraded to level '+castleLevel);updateHUD()};
function selectAll(){selected.clear();units.filter(u=>u.alive&&u.team===1).forEach(u=>selected.add(u.id));notify(selected.size+' soldiers selected')}
$('selectArmy').onclick=selectAll;$('follow').onclick=()=>{selected.forEach(id=>{const u=units.find(v=>v.id===id);if(u)u.order='follow'});notify('Selected troops following commander.')};$('hold').onclick=()=>{selected.forEach(id=>{const u=units.find(v=>v.id===id);if(u){u.order='hold';u.target.copy(u.mesh.position)}});notify('Selected troops holding position.')};$('move').onclick=()=>{moveMode=true;notify('Tap the map to move selected troops.')};$('attack').onclick=()=>{attackMode=true;selected.forEach(id=>{const u=units.find(v=>v.id===id);if(u)u.order='siege'});notify('Select your army, then press Capture Enemy Keep.')};
$('save').onclick=()=>{const data={resources,castleLevel,units:units.filter(u=>u.alive&&u.team===1).map(u=>({kind:u.kind,x:u.mesh.position.x,z:u.mesh.position.z})),outposts:outposts.map(o=>({owner:o.owner,p:o.p})),enemyHealth:enemy.health};localStorage.setItem('sf-kingdom-save',JSON.stringify(data));notify('Kingdom saved on this device.')};
$('load').onclick=()=>{const raw=localStorage.getItem('sf-kingdom-save');if(!raw)return notify('No local save found.');const d=JSON.parse(raw);resources=d.resources;castleLevel=d.castleLevel;home.group.scale.setScalar(1.1+(castleLevel-1)*.08);units.filter(u=>u.team===1).forEach(u=>{u.alive=false;scene.remove(u.mesh)});d.units.forEach(v=>addUnit(1,v.kind,v.x,v.z));d.outposts.forEach((v,i)=>{outposts[i].owner=v.owner;outposts[i].p=v.p});enemy.health=d.enemyHealth;updateHUD();notify('Kingdom loaded.')};
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'Resume':'Pause';notify(paused?'Game paused.':'Game resumed.')};
$('start').onclick=()=>{$('intro').classList.add('hidden');paused=false;started=true;notify('Your kingdom is ready.');updateHUD()};
const keys=new Set();addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase()))e.preventDefault()});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
let yaw=.35,pitch=.65,zoom=27,drag=false,lastX=0,lastY=0,startX=0,startY=0;const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=startX=e.clientX;lastY=startY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;yaw-=dx*.006;pitch=THREE.MathUtils.clamp(pitch+dy*.004,.25,1.2);lastX=e.clientX;lastY=e.clientY});
renderer.domElement.addEventListener('pointerup',e=>{if(!drag)return;const dist=Math.hypot(e.clientX-startX,e.clientY-startY);drag=false;if(dist<8&&started&&!paused)groundClick(e.clientX,e.clientY)});
renderer.domElement.addEventListener('wheel',e=>zoom=THREE.MathUtils.clamp(zoom+e.deltaY*.02,13,48),{passive:true});
function groundClick(x,y){const r=renderer.domElement.getBoundingClientRect();pointer.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);ray.ray.intersectPlane(plane,hit);if(moveMode){selected.forEach(id=>{const u=units.find(v=>v.id===id);if(u){u.order='move';u.target.set(hit.x+(Math.random()-.5)*3,0,hit.z+(Math.random()-.5)*3)}});moveMode=false;return}if(attackMode){selected.forEach(id=>{const u=units.find(v=>v.id===id);if(u){u.order='siege';u.target.set(enemy.x,0,enemy.z)}});attackMode=false;return}
const clicked=units.find(u=>u.team===1&&u.alive&&u.mesh.position.distanceTo(hit)<1.5);if(clicked){if(!keys.has('shift'))selected.clear();selected.add(clicked.id);notify(selected.size+' selected');return}
if(selected.size){selected.forEach(id=>{const u=units.find(v=>v.id===id);if(u){u.order='move';u.target.set(hit.x+(Math.random()-.5)*4,0,hit.z+(Math.random()-.5)*4)}})}else commanderTarget.set(hit.x,0,hit.z)}
const commander={position:new THREE.Vector3(-43,0,48),rotation:{y:0}},commanderTarget=new THREE.Vector3(-43,0,48);const avatar=person(1,'knight');scene.add(avatar);avatar.position.copy(commander.position);
function moveToward(u,target,speed,dt){const d=target.clone().sub(u.mesh.position);d.y=0;if(d.length()>.3){d.normalize();u.mesh.position.addScaledVector(d,speed*dt);u.mesh.rotation.y=Math.atan2(d.x,d.z)}}
function ai(dt){const enemies=units.filter(u=>u.team===-1&&u.alive),friends=units.filter(u=>u.team===1&&u.alive);for(const e of enemies){let near=friends.filter(f=>f.mesh.position.distanceTo(e.mesh.position)<(e.range+f.range+3)).sort((a,b)=>a.mesh.position.distanceTo(e.mesh.position)-b.mesh.position.distanceTo(e.mesh.position))[0];if(near){e.cool-=dt;if(e.cool<=0){near.hp-=e.damage;e.cool=1.4;if(near.hp<=0){near.alive=false;scene.remove(near.mesh);selected.delete(near.id)}}}else{const goal=new THREE.Vector3(home.x+8,0,home.z+8);moveToward(e,goal,e.speed*.65,dt)}}}
function battles(dt){const friends=units.filter(u=>u.alive&&u.team===1),enemies=units.filter(u=>u.alive&&u.team===-1);for(const u of friends){if(u.order==='follow'){const offset=new THREE.Vector3(((u.id%3)-1)*2.5,0,5+Math.floor(u.id%4)*1.5).applyAxisAngle(new THREE.Vector3(0,1,0),avatar.rotation.y);u.target.copy(avatar.position).add(offset);moveToward(u,u.target,u.speed,dt)}else if(u.order==='move'||u.order==='siege')moveToward(u,u.target,u.speed,dt);
let foe=enemies.filter(e=>e.mesh.position.distanceTo(u.mesh.position)<u.range+2).sort((a,b)=>a.mesh.position.distanceTo(u.mesh.position)-b.mesh.position.distanceTo(u.mesh.position))[0];if(foe){u.cool-=dt;if(u.cool<=0){foe.hp-=u.damage;u.cool=u.kind==='archer'?1.25:1;if(foe.hp<=0){foe.alive=false;scene.remove(foe.mesh);resources.gold+=12;resources.food+=8}}}
if(u.order==='siege'&&u.mesh.position.distanceTo(new THREE.Vector3(enemy.x,0,enemy.z))<15){u.cool-=dt;if(u.cool<=0){enemy.health=Math.max(0,enemy.health-1.5);u.cool=1.2}}}
for(const o of outposts){let p=friends.filter(u=>u.mesh.position.distanceTo(new THREE.Vector3(o.x,0,o.z))<7).length,e=enemies.filter(u=>u.mesh.position.distanceTo(new THREE.Vector3(o.x,0,o.z))<7).length;const delta=p-e;o.p=THREE.MathUtils.clamp(o.p+delta*dt*.12,-1,1);if(o.p>.95)o.owner=1;if(o.p<-.95)o.owner=-1;o.ring.material.color.set(o.owner===1?0x42baff:o.owner===-1?0xf08b60:0xe9dfba);o.flag.material.color.set(o.owner===1?0x238ec8:o.owner===-1?0xb9573e:0xe0b34d)}
if(enemy.health<=0){enemy.health=0;notify('Victory! The rival keep has fallen.');paused=true}}
let income=0,aiSpawn=0;function economy(dt){income+=dt;if(income>=5){income=0;resources.gold+=8+outposts.filter(o=>o.owner===1).length*3;resources.wood+=buildings.filter(b=>b.team===1&&b.type==='farm').length*4;resources.food+=buildings.filter(b=>b.team===1&&b.type==='farm').length*5;resources.stone+=2}}
function rival(dt){aiSpawn+=dt;if(aiSpawn>28&&units.filter(u=>u.team===-1&&u.alive).length<15){aiSpawn=0;addUnit(-1,Math.random()>.7?'archer':'infantry',50+Math.random()*5,-36+Math.random()*5)}}
function update(dt){if(paused)return;clock+=dt;const forward=(keys.has('w')||keys.has('arrowup')?-1:0)+(keys.has('s')||keys.has('arrowdown')?1:0)-joy.y,side=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+joy.x;const dir=new THREE.Vector3(side,0,forward);if(dir.lengthSq()){dir.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw);avatar.position.addScaledVector(dir,10*dt);avatar.rotation.y=Math.atan2(dir.x,dir.z);commander.rotation.y=avatar.rotation.y;commander.position.copy(avatar.position)}else if(avatar.position.distanceTo(commanderTarget)>.5&&selected.size===0)moveToward({mesh:avatar},commanderTarget,8,dt);battles(dt);ai(dt);rival(dt);economy(dt);updateHUD()}
let joy={x:0,y:0},joyOn=false;const stick=$('mobileStick'),nub=$('nub');stick.addEventListener('pointerdown',e=>{joyOn=true;stick.setPointerCapture(e.pointerId);moveJoy(e)});stick.addEventListener('pointermove',e=>{if(joyOn)moveJoy(e)});stick.addEventListener('pointerup',()=>{joyOn=false;joy={x:0,y:0};nub.style.transform='translate(0,0)'});function moveJoy(e){const r=stick.getBoundingClientRect();let x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),d=Math.hypot(x,y),m=34;if(d>m){x=x/d*m;y=y/d*m}joy={x:x/m,y:y/m};nub.style.transform='translate('+x+'px,'+y+'px)'}
function cameraUpdate(){const target=avatar.position.clone().add(new THREE.Vector3(0,1,0));const off=new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(zoom);camera.position.copy(target).add(off);camera.lookAt(target)}
let prev=0;function frame(t){const dt=Math.min((t-prev)/1000||0,.04);prev=t;update(dt);cameraUpdate();renderer.render(scene,camera);requestAnimationFrame(frame)}requestAnimationFrame(frame);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5))});
updateHUD();

/* v0.9 — World Map & Rival Kingdom AI */
const frontierRegions=[
 {name:'Highwatch',owner:'player',income:'+12 gold',desc:'Your ancestral seat'},
 {name:'Pine March',owner:'neutral',income:'+5 wood',desc:'Dense timberland'},
 {name:'Ashen Vale',owner:'rival',income:'+8 gold',desc:'Rival border province'},
 {name:'Old Bridge',owner:'player',income:'+4 gold',desc:'A strategic crossing'},
 {name:'Greenfields',owner:'neutral',income:'+8 food',desc:'Rich farmland'},
 {name:'Redwater',owner:'rival',income:'+6 stone',desc:'Quarry settlements'},
 {name:'Westmoor',owner:'neutral',income:'+5 food',desc:'Quiet frontier villages'},
 {name:'Kingsroad',owner:'neutral',income:'+7 gold',desc:'Busy trade route'},
 {name:'Stormpeak',owner:'rival',income:'+5 stone',desc:'Mountain stronghold'}
];
let frontierTurn=0;
const wm=$('worldMap'),wmGrid=$('wmGrid');
function renderWorldMap(){
 if(!wmGrid)return;
 wmGrid.innerHTML=frontierRegions.map((r,i)=>{
  const label=r.owner==='player'?'YOUR REALM':r.owner==='rival'?'RIVAL KINGDOM':'NEUTRAL';
  const action=r.owner==='neutral'?'<button data-claim="'+i+'">CLAIM · 100G</button>':r.owner==='player'?'<button disabled>CONTROLLED</button>':'<button disabled>RIVAL TERRITORY</button>';
  return '<article class="wm-tile '+r.owner+'"><div><strong>'+r.name+'</strong><br><small>'+r.desc+'</small></div><div><small>'+label+' · '+r.income+'</small><br>'+action+'</div></article>';
 }).join('');
 wmGrid.querySelectorAll('[data-claim]').forEach(btn=>btn.addEventListener('click',()=>{
  const region=frontierRegions[Number(btn.dataset.claim)];
  if(resources.gold<100){$('wmStatus').textContent='You need 100 gold to claim this frontier.';return}
  resources.gold-=100;region.owner='player';resources.wood+=18;resources.food+=12;
  $('wmStatus').textContent=region.name+' joined your realm. Resource stores received a small supply.';
  renderWorldMap();updateHUD();
 }));
}
$('openWorldMap').onclick=()=>{renderWorldMap();wm.classList.add('open');wm.setAttribute('aria-hidden','false')};
$('closeWorldMap').onclick=()=>{wm.classList.remove('open');wm.setAttribute('aria-hidden','true')};
wm.addEventListener('click',e=>{if(e.target===wm){wm.classList.remove('open');wm.setAttribute('aria-hidden','true')}});
setInterval(()=>{
 if(!started||paused)return;
 frontierTurn++;
 const neutral=frontierRegions.map((r,i)=>({r,i})).filter(x=>x.r.owner==='neutral');
 if(neutral.length){
  const pick=neutral[Math.floor(Math.random()*neutral.length)];
  pick.r.owner='rival';
  if(wm.classList.contains('open'))renderWorldMap();
  notify('Rival rulers expanded into '+pick.r.name+'. Check the world map.');
 }
},35000);
