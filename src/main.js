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
function battles(dt){const friends=units.filter(u=>u.alive&&u.team===1),enemies=units.filter(u=>u.alive&&u.team===-1);for(const u of friends){if(u.order==='follow'){const idx=friends.indexOf(u),col=(idx%5)-2,row=Math.floor(idx/5);let ox=col*2.6,oz=5+row*2.7;if(formation==='block'){ox=((idx%3)-1)*2.5;oz=4+Math.floor(idx/3)*2.5}else if(formation==='wedge'){const rank=Math.floor(Math.sqrt(idx*2));ox=(idx-rank*(rank+1)/2-rank/2)*2.8;oz=5+rank*2.5}const offset=new THREE.Vector3(ox,0,oz).applyAxisAngle(new THREE.Vector3(0,1,0),avatar.rotation.y);u.target.copy(avatar.position).add(offset);moveToward(u,u.target,u.speed,dt)}else if(u.order==='rush'){u.target.set(enemy.x,0,enemy.z);moveToward(u,u.target,u.speed*1.25,dt)}else if(u.order==='move'||u.order==='siege')moveToward(u,u.target,u.speed,dt);
let foe=enemies.filter(e=>e.mesh.position.distanceTo(u.mesh.position)<u.range+2).sort((a,b)=>a.mesh.position.distanceTo(u.mesh.position)-b.mesh.position.distanceTo(u.mesh.position))[0];if(foe){u.cool-=dt;if(u.cool<=0){foe.hp-=u.damage;u.cool=u.kind==='archer'?1.25:1;if(foe.hp<=0){foe.alive=false;scene.remove(foe.mesh);resources.gold+=12;resources.food+=8}}}
if(u.order==='siege'&&u.mesh.position.distanceTo(new THREE.Vector3(enemy.x,0,enemy.z))<15){u.cool-=dt;if(u.cool<=0){enemy.health=Math.max(0,enemy.health-1.5);u.cool=1.2}}}
for(const o of outposts){let p=friends.filter(u=>u.mesh.position.distanceTo(new THREE.Vector3(o.x,0,o.z))<7).length,e=enemies.filter(u=>u.mesh.position.distanceTo(new THREE.Vector3(o.x,0,o.z))<7).length;const delta=p-e;o.p=THREE.MathUtils.clamp(o.p+delta*dt*.12,-1,1);if(o.p>.95)o.owner=1;if(o.p<-.95)o.owner=-1;o.ring.material.color.set(o.owner===1?0x42baff:o.owner===-1?0xf08b60:0xe9dfba);o.flag.material.color.set(o.owner===1?0x238ec8:o.owner===-1?0xb9573e:0xe0b34d)}
if(enemy.health<=0){enemy.health=0;notify('Victory! The rival keep has fallen.');paused=true}}
let income=0,aiSpawn=0;function economy(dt){income+=dt;if(income>=5){income=0;resources.gold+=8+outposts.filter(o=>o.owner===1).length*3;resources.wood+=buildings.filter(b=>b.team===1&&b.type==='farm').length*4;resources.food+=buildings.filter(b=>b.team===1&&b.type==='farm').length*5;resources.stone+=2}}
function rival(dt){aiSpawn+=dt;if(aiSpawn>28&&units.filter(u=>u.team===-1&&u.alive).length<15){aiSpawn=0;addUnit(-1,Math.random()>.7?'archer':'infantry',50+Math.random()*5,-36+Math.random()*5)}}
function update(dt){if(paused)return;clock+=dt;const forward=(keys.has('w')||keys.has('arrowup')?-1:0)+(keys.has('s')||keys.has('arrowdown')?1:0)-joy.y,side=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+joy.x;const dir=new THREE.Vector3(side,0,forward);if(dir.lengthSq()){dir.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw);avatar.position.addScaledVector(dir,10*(sprinting?1.55:1)*dt);avatar.rotation.y=Math.atan2(dir.x,dir.z);commander.rotation.y=avatar.rotation.y;commander.position.copy(avatar.position)}else if(avatar.position.distanceTo(commanderTarget)>.5&&selected.size===0)moveToward({mesh:avatar},commanderTarget,8,dt);battles(dt);ai(dt);rival(dt);economy(dt);updateHUD()}
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


/* v1.0 — Command & Army battlefield gameplay layer */
const commanderHorse=new THREE.Group();scene.add(commanderHorse);
const horseCoat=mat(0x63351f),horseDark=mat(0x241914),horseLeather=mat(0x9b6b35);
const horseBody=new THREE.Mesh(new THREE.CapsuleGeometry(.55,.95,5,10),horseCoat);horseBody.rotation.z=Math.PI/2;horseBody.position.y=.95;commanderHorse.add(horseBody);
const horseNeck=new THREE.Mesh(new THREE.CapsuleGeometry(.27,.7,4,8),horseCoat);horseNeck.position.set(0,1.55,.48);horseNeck.rotation.x=-.35;commanderHorse.add(horseNeck);
const horseHead=new THREE.Mesh(new THREE.BoxGeometry(.34,.48,.48),horseCoat);horseHead.position.set(0,1.9,.76);commanderHorse.add(horseHead);
const horseMane=new THREE.Mesh(new THREE.BoxGeometry(.12,.6,.7),horseDark);horseMane.position.set(0,1.75,.22);commanderHorse.add(horseMane);
for(const x of [-.34,.34])for(const z of [-.48,.48]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.095,.07,.78,7),horseDark);leg.position.set(x,.43,z);commanderHorse.add(leg)}
const saddle=new THREE.Mesh(new THREE.BoxGeometry(.75,.17,.75),horseLeather);saddle.position.set(0,1.48,-.04);commanderHorse.add(saddle);
avatar.visible=false;
let mounted=true,sprinting=false,formation='line',commanderStamina=100,healCooldown=0;
function setOrder(order){
 const list=units.filter(u=>u.alive&&u.team===1);
 if(!selected.size)list.forEach(u=>selected.add(u.id));
 selected.forEach(id=>{const u=units.find(v=>v.id===id);if(!u)return;u.order=order;if(order==='follow')u.target.copy(avatar.position);if(order==='hold')u.target.copy(u.mesh.position);if(order==='rush'||order==='siege')u.target.set(enemy.x,0,enemy.z)});
 notify('COMMAND: '+order.toUpperCase()+' · '+selected.size+' SOLDIERS');updateBattleCard();
}
function updateBattleCard(){
 const count=units.filter(u=>u.alive&&u.team===1).length;
 $('unitCount').textContent=selected.size+' SELECTED / '+count+' SOLDIERS';
 const first=units.find(u=>selected.has(u.id));$('unitOrder').textContent='ORDER: '+(first?first.order.toUpperCase():'FOLLOW');
}
$('cmdRush').onclick=()=>setOrder('rush');$('cmdAttack').onclick=()=>{setOrder('siege');attackMode=false};
$('cmdFollow').onclick=()=>setOrder('follow');$('cmdHold').onclick=()=>setOrder('hold');
$('cmdMount').onclick=()=>{mounted=!mounted;avatar.visible=!mounted;$('cmdMount').innerHTML='<span>♞</span>'+(mounted?'DISMOUNT':'MOUNT');notify(mounted?'Mounted commander':'Commander on foot')};
$('cmdSprint').onclick=()=>{sprinting=!sprinting;$('cmdSprint').style.borderColor=sprinting?'#e7c84d':'#10151d';notify(sprinting?'Sprint enabled':'Sprint disabled')};
$('cmdRoll').onclick=()=>{commanderStamina=Math.max(0,commanderStamina-18);avatar.position.add(new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw)).multiplyScalar(3));notify('Dodge roll')};
$('cmdHeal').onclick=()=>{if(healCooldown>0)return notify('Heal is recharging');healCooldown=20;units.filter(u=>u.team===1&&u.alive&&u.mesh.position.distanceTo(avatar.position)<12).forEach(u=>u.hp=Math.min(u.max,u.hp+35));notify('Nearby squad healed')};
document.querySelectorAll('[data-formation]').forEach(btn=>btn.onclick=()=>{formation=btn.dataset.formation;document.querySelectorAll('[data-formation]').forEach(x=>x.classList.toggle('active',x===btn));notify('Formation: '+formation.toUpperCase());});
const oldSelectAll=selectAll;
selectAll=function(){oldSelectAll();updateBattleCard()};
const oldGroundClick=groundClick;
groundClick=function(x,y){oldGroundClick(x,y);updateBattleCard()};
const oldUpdate=update;
update=function(dt){
 oldUpdate(dt);
 commanderHorse.visible=mounted;
 commanderHorse.position.set(avatar.position.x,0,avatar.position.z);
 commanderHorse.rotation.y=avatar.rotation.y;
 commanderHorse.position.y=Math.sin(clock*7)*.035;
 if(mounted){avatar.position.y=1.48;avatar.rotation.y=commanderHorse.rotation.y}
 if(sprinting&&keys.size){} 
 healCooldown=Math.max(0,healCooldown-dt);
 commanderStamina=Math.min(100,commanderStamina+(sprinting?-.08:.12));
 updateBattleCard();
};
const oldRecruit=recruit;
recruit=function(kind){oldRecruit(kind);updateBattleCard()};
notify('Command & Army controls ready');updateBattleCard();


/* v1.1 — Ultimate Command Campaign systems */
const campaign={mission:0,victories:0,weather:'Clear',diplomacy:'Neutral',day:1,season:0,achievements:[]};
const missionList=[
 {name:'Secure the Frontier',desc:'Capture at least one neutral outpost.',test:()=>outposts.some(o=>o.owner===1)},
 {name:'Raise the Banner',desc:'Control all three battlefield outposts.',test:()=>outposts.every(o=>o.owner===1)},
 {name:'Build the Host',desc:'Recruit at least 12 living soldiers.',test:()=>units.filter(u=>u.team===1&&u.alive).length>=12},
 {name:'Break the Keep',desc:'Defeat the rival castle.',test:()=>enemy.health<=0}
];
let empireTab='army',weatherClock=0,dayClock=0,workerCount=0,tradeCount=0;
const empirePanel=$('empirePanel'),empireContent=$('empireContent'),empireStatus=$('empireStatus');
function empireMessage(s){empireStatus.textContent=s;notify(s)}
function card(title,desc,action,label){return '<article class="empire-card"><b>'+title+'</b><small>'+desc+'</small><button class="empire-action" data-action="'+action+'">'+label+'</button></article>'}
function renderEmpire(){
 if(!empireContent)return;
 const alive=units.filter(u=>u.team===1&&u.alive).length;
 const owned=outposts.filter(o=>o.owner===1).length;
 let cards='';
 if(empireTab==='army'){
  cards=card('Infantry','Balanced frontline troops · 60 food','recruit-infantry','RECRUIT · 60 FOOD')+
  card('Archers','Ranged support · 80 food','recruit-archer','RECRUIT · 80 FOOD')+
  card('Knights','Armoured heavy troops · 130 food','recruit-knight','RECRUIT · 130 FOOD')+
  card('Spearmen','Anti-cavalry defensive unit · 95 food','recruit-spearman','RECRUIT · 95 FOOD')+
  card('Cavalry','Fast mounted squad · 150 food','recruit-cavalry','RECRUIT · 150 FOOD')+
  card('Royal Guards','Elite castle defenders · 180 food','recruit-guard','RECRUIT · 180 FOOD')+
  card('Command all','Select every living allied soldier','select','SELECT ALL')+
  card('Formation','Cycle line, block and wedge','formation','CHANGE FORMATION');
 }else if(empireTab==='realm'){
  cards=card('Build a farm','Adds food production · 90 wood','farm','BUILD FARM')+
  card('Build barracks','Adds recruitment infrastructure · 120 wood','barracks','BUILD BARRACKS')+
  card('Watchtower','A frontier landmark · 100 wood, 60 stone','tower','BUILD TOWER')+
  card('Hire workers','Grow your village workforce · 50 gold','workers','HIRE WORKERS')+
  card('Castle upgrade','Strengthen your keep · 120 stone','upgrade','UPGRADE KEEP')+
  card('Save campaign','Store local campaign progress','save','SAVE CAMPAIGN')+
  card('Load campaign','Restore local campaign progress','load','LOAD CAMPAIGN')+
  card('Realm overview',alive+' soldiers · '+owned+'/3 outposts · '+workerCount+' workers','overview','REFRESH STATUS');
 }else if(empireTab==='trade'){
  cards=card('Buy 100 food','Exchange 50 gold for food','buy-food','BUY FOOD')+
  card('Sell 100 wood','Receive 35 gold','sell-wood','SELL WOOD')+
  card('Buy 60 stone','Exchange 55 gold for stone','buy-stone','BUY STONE')+
  card('Sell 60 stone','Receive 40 gold','sell-stone','SELL STONE')+
  card('Buy 100 wood','Exchange 45 gold for wood','buy-wood','BUY WOOD')+
  card('Trade ledger',tradeCount+' completed trades','ledger','VIEW LEDGER');
 }else if(empireTab==='diplomacy'){
  cards=card('Offer peace','Set rival relations to peace (prototype)','peace','OFFER PEACE')+
  card('Declare rivalry','Return relations to hostile','war','DECLARE RIVALRY')+
  card('Send envoy','Spend 40 gold to improve relations','envoy','SEND ENVOY')+
  card('Relations',campaign.diplomacy,'relations','REFRESH RELATIONS');
 }else if(empireTab==='campaign'){
  cards=missionList.map((m,i)=>card('Mission '+(i+1)+': '+m.name,m.desc+' · '+(m.test()?'COMPLETED':'IN PROGRESS'),'mission-'+i,m.test()?'COMPLETED':'CHECK PROGRESS')).join('')+
  card('Achievements',campaign.achievements.length+' achievements unlocked','achievements','VIEW ACHIEVEMENTS');
 }else{
  cards=card('Weather: '+campaign.weather,'Cycle clear, rain and fog conditions','weather','CHANGE WEATHER')+
  card('Time of day','Day '+campaign.day+' · dynamic daylight','time','ADVANCE TIME')+
  card('World map','View region ownership and frontier','worldmap','OPEN WORLD MAP')+
  card('Camera zoom','Use mouse wheel or pinch/scroll to adjust view','zoom','ZOOM OUT')+
  card('Season','Season '+(campaign.season+1)+' of 4','season','CHANGE SEASON');
 }
 empireContent.innerHTML='<div class="empire-grid">'+cards+'</div>';
 empireContent.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>empireAction(btn.dataset.action)));
}
function empireAction(a){
 const buy=(key,amount,cost)=>{if(resources.gold<cost)return empireMessage('Not enough gold.');resources.gold-=cost;resources[key]+=amount;tradeCount++;updateHUD();empireMessage('Trade completed.');};
 if(a.startsWith('recruit-')){const kind=a.slice(8);const costs={infantry:60,archer:80,knight:130,spearman:95,cavalry:150,guard:180};const cost=costs[kind];if(resources.food<cost)return empireMessage('Not enough food.');resources.food-=cost;const n=units.filter(u=>u.team===1&&u.alive).length;const u=addUnit(1,kind,-43+(n%5)*2,43+Math.floor(n/5)*2);u.order='follow';updateHUD();empireMessage(kind+' recruited into your army.');}
 else if(a==='select'){selectAll();empireMessage('All allied soldiers selected.')}
 else if(a==='formation'){formation=formation==='line'?'block':formation==='block'?'wedge':'line';document.querySelectorAll('[data-formation]').forEach(b=>b.classList.toggle('active',b.dataset.formation===formation));empireMessage('Formation changed to '+formation+'.')}
 else if(a==='farm')$('buildFarm').click();
 else if(a==='barracks')$('buildBarracks').click();
 else if(a==='tower'){if(resources.wood<100||resources.stone<60)return empireMessage('Need 100 wood and 60 stone.');resources.wood-=100;resources.stone-=60;buildings.push(building(-72+buildings.length*5,58,'tower'));empireMessage('Watchtower raised on the frontier.');updateHUD();}
 else if(a==='workers'){if(resources.gold<50)return empireMessage('Need 50 gold.');resources.gold-=50;workerCount+=5;empireMessage('Five villagers joined your workforce.');updateHUD();}
 else if(a==='upgrade')$('upgrade').click();
 else if(a==='save')$('save').click();
 else if(a==='load')$('load').click();
 else if(a==='overview')empireMessage(units.filter(u=>u.team===1&&u.alive).length+' soldiers · '+outposts.filter(o=>o.owner===1).length+' outposts · '+workerCount+' workers.');
 else if(a==='buy-food')buy('food',100,50);
 else if(a==='sell-wood'){if(resources.wood<100)return empireMessage('Not enough wood.');resources.wood-=100;resources.gold+=35;tradeCount++;updateHUD();empireMessage('Sold 100 wood for 35 gold.');}
 else if(a==='buy-stone')buy('stone',60,55);
 else if(a==='sell-stone'){if(resources.stone<60)return empireMessage('Not enough stone.');resources.stone-=60;resources.gold+=40;tradeCount++;updateHUD();empireMessage('Sold 60 stone for 40 gold.');}
 else if(a==='buy-wood')buy('wood',100,45);
 else if(a==='ledger')empireMessage('Trade ledger: '+tradeCount+' completed transactions this session.');
 else if(a==='peace'){campaign.diplomacy='Peace';empireMessage('A peace proposal was recorded. Rival AI remains a gameplay prototype.');}
 else if(a==='war'){campaign.diplomacy='Hostile';empireMessage('Relations are hostile. Rival forces remain active.');}
 else if(a==='envoy'){if(resources.gold<40)return empireMessage('Need 40 gold.');resources.gold-=40;campaign.diplomacy='Improving';updateHUD();empireMessage('Your envoy has departed.');}
 else if(a==='relations')empireMessage('Current rival relations: '+campaign.diplomacy+'.');
 else if(a.startsWith('mission-')){const i=Number(a.slice(8));empireMessage(missionList[i].name+': '+(missionList[i].test()?'Mission completed!':'Not completed yet — '+missionList[i].desc));}
 else if(a==='achievements')empireMessage(campaign.achievements.length?campaign.achievements.join(' · '):'No achievements unlocked yet.');
 else if(a==='weather'){setWeather(campaign.weather==='Clear'?'Rain':campaign.weather==='Rain'?'Fog':'Clear');}
 else if(a==='time'){campaign.day++;dayClock=0;empireMessage('Advanced to day '+campaign.day+'.');}
 else if(a==='worldmap'){$('openWorldMap').click();}
 else if(a==='zoom'){zoom=Math.min(48,zoom+5);empireMessage('Camera zoom adjusted.');}
 else if(a==='season'){campaign.season=(campaign.season+1)%4;const seasons=['Spring','Summer','Autumn','Winter'];empireMessage('Season changed: '+seasons[campaign.season]+'.');}
 renderEmpire();
}
$('empireOpen').onclick=()=>{renderEmpire();empirePanel.classList.add('open');empirePanel.setAttribute('aria-hidden','false')};
$('empireClose').onclick=()=>{empirePanel.classList.remove('open');empirePanel.setAttribute('aria-hidden','true')};
empirePanel.addEventListener('click',e=>{if(e.target===empirePanel){empirePanel.classList.remove('open');empirePanel.setAttribute('aria-hidden','true')}});
document.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{empireTab=btn.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));renderEmpire()});
function setWeather(w){
 campaign.weather=w;
 scene.fog.density=0;
 if(w==='Fog'){scene.background=new THREE.Color(0x9aa9ad);scene.fog=new THREE.FogExp2(0x9aa9ad,.012);sun.intensity=1.05}
 else if(w==='Rain'){scene.background=new THREE.Color(0x788b98);scene.fog=new THREE.Fog(0x788b98,35,125);sun.intensity=.85}
 else{scene.background=new THREE.Color(0x9fc4d5);scene.fog=new THREE.Fog(0x9fc4d5,75,190);sun.intensity=2.1}
 $('weatherBadge').textContent=(w==='Clear'?'☀':w==='Rain'?'🌧':'🌫')+' '+w.toUpperCase()+' · DAY '+campaign.day;
}
const riverMat=new THREE.MeshStandardMaterial({color:0x267b9f,roughness:.25,metalness:.12});
const river=new THREE.Mesh(new THREE.PlaneGeometry(9,178),riverMat);river.rotation.x=-Math.PI/2;river.position.set(15,.035,-2);scene.add(river);
const bridge=box(13,.55,7,M.wood,15,.32,4);for(let i=0;i<7;i++)box(.12,.8,.12,M.dark,10+i*1.65,.75,4);
for(let i=0;i<9;i++){const hill=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),M.grass2);hill.scale.set(7+Math.random()*5,1.5+Math.random()*2,8+Math.random()*7);hill.position.set((Math.random()-.5)*180,0,(Math.random()-.5)*180);hill.receiveShadow=true;scene.add(hill)}
const villagers=[];
function spawnVillagers(){
 for(let i=0;i<8;i++){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.25,.55,3,6),mat(0xb58c5e));body.position.y=.75;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.18,8,8),M.skin);head.position.y=1.25;g.add(head);g.position.set(-58+(i%4)*3,0,52+Math.floor(i/4)*3);scene.add(g);villagers.push({mesh:g,phase:Math.random()*6})}
}
spawnVillagers();
const baseAddUnit=addUnit;
addUnit=function(team,kind,x,z){
 const u=baseAddUnit(team,kind,x,z);
 const stats={spearman:{hp:115,speed:4.1,damage:13,range:3},cavalry:{hp:125,speed:7.1,damage:19,range:3.2},guard:{hp:190,speed:3.5,damage:15,range:2.8}};
 if(stats[kind]){Object.assign(u,{max:stats[kind].hp,hp:stats[kind].hp,speed:stats[kind].speed,damage:stats[kind].damage,range:stats[kind].range});}
 if(kind==='spearman'){const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,1.8,6),M.wood);shaft.position.set(-.35,1.35,.18);shaft.rotation.x=-.22;u.mesh.add(shaft);const tip=new THREE.Mesh(new THREE.ConeGeometry(.09,.28,6),M.stone);tip.position.set(-.35,2.36,.28);u.mesh.add(tip)}
 if(kind==='guard'){const crest=new THREE.Mesh(new THREE.BoxGeometry(.55,.18,.12),M.gold);crest.position.set(0,2.18,.12);u.mesh.add(crest)}
 if(kind==='cavalry'){const mount=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.68,4,7),mat(team===1?0x67452d:0x4c3029));mount.position.set(0,.68,-.25);mount.rotation.x=Math.PI/2;u.mesh.add(mount)}
 return u;
};
const horseLegs=commanderHorse.children.filter(c=>c.geometry&&c.geometry.type==='CylinderGeometry');
const baseUpdate=update;
update=function(dt){
 baseUpdate(dt);
 dayClock+=dt;weatherClock+=dt;
 const daylight=.58+Math.sin(dayClock*.035)*.42;
 sun.intensity=campaign.weather==='Clear'?1.1+daylight:campaign.weather==='Rain'?.75:campaign.weather==='Fog'?.95:1;
 sun.position.set(Math.cos(dayClock*.035)*55,45+daylight*35,Math.sin(dayClock*.035)*45);
 if(dayClock>240){dayClock=0;campaign.day++;$('weatherBadge').textContent=campaign.weather.toUpperCase()+' · DAY '+campaign.day}
 horseLegs.forEach((leg,i)=>{leg.rotation.x=mounted?Math.sin(clock*9+i*Math.PI)*.32:0});
 villagers.forEach((v,i)=>{v.phase+=dt*.5;v.mesh.position.x+=Math.sin(v.phase)*dt*.18;v.mesh.position.z+=Math.cos(v.phase*.7)*dt*.12});
 if(weatherClock>100){weatherClock=0;if(Math.random()<.4)setWeather(['Clear','Rain','Fog'][Math.floor(Math.random()*3)])}
 missionList.forEach((m,i)=>{if(m.test()&&!campaign.achievements.includes(m.name)){campaign.achievements.push(m.name);notify('ACHIEVEMENT UNLOCKED: '+m.name)}});
};
const baseSave=$('save').onclick;
$('save').onclick=()=>{baseSave?.();const old=localStorage.getItem('sf-kingdom-save');if(old){const d=JSON.parse(old);d.campaign=campaign;d.workerCount=workerCount;d.tradeCount=tradeCount;d.formation=formation;localStorage.setItem('sf-kingdom-save',JSON.stringify(d));}empireMessage('Campaign and kingdom progress saved locally.')};
const baseLoad=$('load').onclick;
$('load').onclick=()=>{baseLoad?.();const raw=localStorage.getItem('sf-kingdom-save');if(raw){try{const d=JSON.parse(raw);if(d.campaign)Object.assign(campaign,d.campaign);workerCount=d.workerCount||0;tradeCount=d.tradeCount||0;if(d.formation)formation=d.formation;setWeather(campaign.weather||'Clear')}catch(e){console.warn('Campaign extension could not load',e)}}renderEmpire()};
setWeather('Clear');renderEmpire();
