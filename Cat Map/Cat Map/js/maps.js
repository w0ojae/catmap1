// ── CAT MAP ─────────────────────────────────────────────
const typeColor=t=>({
  cheese:'#F0960A',black:'#333',white:'#C0B8AC',
  mackerel:'#6D4C28',calico:'#E53935',
  gray:'#9E9E9E',tuxedo:'#2B2B2B',cream:'#E8B46A',
}[t]||'#888');

function initCatMap(){
  catMap=L.map('catmap',{zoomControl:true,attributionControl:false}).setView([35.542,129.348],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18}).addTo(catMap);
  L.control.attribution({position:'bottomright',prefix:'<a href="https://osm.org">© OSM</a>'}).addTo(catMap);
  CATS.forEach(addMarker);
  buildSidebar(CATS);
}

function addMarker(cat){
  const bd=cat.type==='white'?'#aaa':'#fff';
  const icon=L.divIcon({
    html:`<div style="width:42px;height:42px;border-radius:50%;background:${typeColor(cat.type)};border:3px solid ${bd};display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 2px 12px rgba(0,0,0,.3);cursor:pointer">${cat.emo}</div>`,
    className:'',iconSize:[42,42],iconAnchor:[21,21]
  });
  const m=L.marker([cat.lat,cat.lng],{icon}).addTo(catMap);
  m.bindPopup(`
    <div class="lp">
      <div class="lp-top"><div class="lp-emo">${cat.emo}</div>
        <div><div class="lp-nm">${cat.name}</div><div class="lp-loc">📍 ${cat.loc}</div></div>
      </div>
      <div class="lp-meta">📅 ${cat.date}&emsp;🕒 ${cat.time}</div>
      <div class="lp-meta">👤 ${cat.reporter}&emsp;💛 팔로워 ${cat.followers}명</div>
      <div class="lp-feat">📝 ${cat.feat}</div>
      <button class="lp-btn" onclick="sw('jn')">관찰일지에서 보기 →</button>
    </div>
  `,{maxWidth:270});
  markers[cat.id]={m,type:cat.type,cat};
}

function buildSidebar(list){
  const el=document.getElementById('sb-list');
  el.innerHTML='';
  list.forEach(cat=>{
    const d=document.createElement('div');
    d.className='sb-item';
    d.innerHTML=`
      <div class="sb-emo">${cat.emo}</div>
      <div class="sb-inf">
        <div class="sb-nm">${cat.name}</div>
        <div class="sb-loc">📍 ${cat.loc.split(' ').at(-1)} &nbsp; 💛 ${cat.followers}명</div>
      </div>
      <div class="sb-cnt">${cat.tl.length}건</div>
    `;
    d.onclick=()=>{
      document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active-item'));
      d.classList.add('active-item');
      catMap.setView([cat.lat,cat.lng],15);
      setTimeout(()=>markers[cat.id].m.openPopup(),280);
    };
    el.appendChild(d);
  });
}

function filterType(type,el){
  document.querySelectorAll('.sb-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  if(!catMap)return;
  const filtered=type==='all'?CATS:CATS.filter(c=>c.type===type);
  Object.values(markers).forEach(({m,type:t})=>{
    (type==='all'||t===type)?m.addTo(catMap):catMap.removeLayer(m);
  });
  buildSidebar(filtered);
}

function filterByName(q){
  if(!catMap)return;
  const lq=q.toLowerCase();
  const filtered=CATS.filter(c=>c.name.includes(q)||c.loc.includes(q));
  Object.values(markers).forEach(({m,cat})=>{
    const show=!q||cat.name.includes(q)||cat.loc.includes(q);
    show?m.addTo(catMap):catMap.removeLayer(m);
  });
  buildSidebar(filtered);
}

// ── HEATMAP ─────────────────────────────────────────────
let hmHeatLayer=null;

function initHeatmap(){
  hmMap=L.map('hmmap',{zoomControl:true,attributionControl:false}).setView([35.542,129.348],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18}).addTo(hmMap);
  L.control.attribution({position:'bottomright',prefix:'<a href="https://osm.org">© OSM</a>'}).addTo(hmMap);

  // Canvas 기반 히트레이어 — 겹쳐도 투명도 누적 없음
  hmHeatLayer=L.heatLayer(HEAT,{
    radius:32,
    blur:22,
    maxZoom:17,
    max:0.55,
    minOpacity:0.45,
    gradient:{
      0.00:'#43A047',
      0.45:'#FDD835',
      0.72:'#FB8C00',
      1.00:'#E53935'
    }
  }).addTo(hmMap);

  // 초기 슬라이더 값 반영
  const slider=document.getElementById('hm-opct');
  if(slider) setHmOpacity(slider.value);

  animBars();
}

function setHmOpacity(val){
  document.getElementById('hm-opct-lbl').textContent=val+'%';
  if(!hmMap)return;
  // Leaflet.heat가 그리는 canvas에 opacity 적용
  const canvas=hmMap.getPane('overlayPane').querySelector('canvas');
  if(canvas) canvas.style.opacity=val/100;
}
