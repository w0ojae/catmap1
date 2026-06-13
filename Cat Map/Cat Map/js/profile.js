// ── PROFILE ─────────────────────────────────────────────
let _profileBuilt=false;

function initProfile(){
  // 레벨바 애니메이션 (매번)
  setTimeout(()=>{
    const fill=document.getElementById('pf-lvl-fill');
    if(fill) fill.style.width=fill.dataset.p+'%';
    document.querySelectorAll('.fur-bf').forEach(el=>{el.style.width=el.dataset.p+'%';});
  },180);

  if(_profileBuilt)return;
  _profileBuilt=true;

  buildPfCalendar();
  buildPfFollows();
  buildPfFur();
  buildPfActs();
}

function buildPfCalendar(){
  const grid=document.getElementById('pf-cal');
  if(!grid)return;
  // 60일치 활동 강도 데이터 (0~4)
  const data=[
    0,1,0,2,1,0,3,2,0,1,
    2,0,0,1,3,0,2,4,1,0,
    1,2,0,0,2,1,3,0,1,2,
    0,0,3,1,0,2,1,0,2,3,
    1,0,0,2,3,1,0,2,1,0,
    0,1,2,3,0,1,2,0,1,2,
  ];
  const lv=['','lv1','lv2','lv3','lv4'];
  const today=new Date();
  data.forEach((v,i)=>{
    const d=document.createElement('div');
    d.className='cal-day'+(v>0?' '+lv[Math.min(v,4)]:'');
    const daysAgo=59-i;
    const dt=new Date(today);dt.setDate(dt.getDate()-daysAgo);
    const label=dt.toLocaleDateString('ko-KR',{month:'short',day:'numeric'});
    d.title=v>0?`${label} · ${v}건 제보`:`${label} · 기록 없음`;
    grid.appendChild(d);
  });
}

function buildPfFollows(){
  const el=document.getElementById('pf-follows');
  if(!el)return;
  CATS.slice(0,5).forEach(cat=>{
    const d=document.createElement('div');
    d.className='follow-item';
    d.innerHTML=`
      <span class="follow-emo">${cat.emo}</span>
      <div class="follow-inf">
        <div class="follow-nm">${cat.name}</div>
        <div class="follow-loc">📍 ${cat.loc.split(' ').slice(-2).join(' ')}</div>
      </div>
      <span class="follow-hearts">♥ ${cat.followers}</span>
    `;
    d.addEventListener('click',()=>sw('jn'));
    el.appendChild(d);
  });
}

function buildPfFur(){
  const el=document.getElementById('pf-fur');
  if(!el)return;
  const furs=[
    {lbl:'치즈',  color:'#F0960A', cnt:8,  pct:100},
    {lbl:'검은',  color:'#555',    cnt:6,  pct:75},
    {lbl:'고등어',color:'#8B6340', cnt:4,  pct:50},
    {lbl:'삼색',  color:'var(--accent)', cnt:3, pct:38},
    {lbl:'흰',    color:'#C8C0B6', cnt:2,  pct:25},
  ];
  furs.forEach(f=>{
    const d=document.createElement('div');
    d.className='fur-item';
    d.innerHTML=`
      <div class="fur-row">
        <span class="fur-lbl">
          <span class="fur-dot" style="background:${f.color}"></span>${f.lbl}
        </span>
        <span class="fur-cnt">${f.cnt}마리</span>
      </div>
      <div class="fur-bw">
        <div class="fur-bf" data-p="${f.pct}" style="background:${f.color}"></div>
      </div>
    `;
    el.appendChild(d);
  });
}

function buildPfActs(){
  const el=document.getElementById('pf-acts');
  if(!el)return;
  const acts=[
    {date:'2026.06.09',nm:'삼산공원 치즈냥',loc:'남구 삼산동',emo:'🟠',tag:'기존 고양이',isNew:false},
    {date:'2026.06.08',nm:'달동 새 고양이',loc:'남구 달동',emo:'🐱',tag:'신규 등록',isNew:true},
    {date:'2026.06.07',nm:'무거동 검은냥',loc:'남구 무거동',emo:'⚫',tag:'기존 고양이',isNew:false},
    {date:'2026.06.05',nm:'태화강 삼색냥',loc:'중구 태화동',emo:'🔴',tag:'사진 추가',isNew:false},
    {date:'2026.06.03',nm:'방어진 흰냥',loc:'동구 방어진',emo:'⚪',tag:'기존 고양이',isNew:false},
    {date:'2026.06.01',nm:'옥동 치즈냥',loc:'남구 옥동',emo:'🟠',tag:'기존 고양이',isNew:false},
  ];
  acts.forEach((a,i)=>{
    const d=document.createElement('div');
    d.className='act-item';
    const showLine=i<acts.length-1;
    d.innerHTML=`
      <div class="act-col">
        <div class="act-dot">${a.emo}</div>
        ${showLine?'<div class="act-line"></div>':''}
      </div>
      <div class="act-inf">
        <div class="act-date">${a.date}</div>
        <div class="act-nm">${a.nm}</div>
        <div class="act-loc">📍 ${a.loc}</div>
        <span class="act-tag${a.isNew?' new':''}">${a.tag}</span>
      </div>
    `;
    el.appendChild(d);
  });
}
