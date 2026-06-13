// ── 사진 광장 ─────────────────────────────────────────────
let phLbPhotos=[],phLbIdx=0;

function openPhLightbox(photos,idx,nick,time){
  phLbPhotos=Array.isArray(photos)?photos:[photos];
  phLbIdx=Math.max(0,Math.min(idx,phLbPhotos.length-1));
  document.getElementById('ph-lb-nick').textContent='@'+nick+' · '+time;
  renderPhLb();
  document.getElementById('ph-lb').classList.add('open');
  document.body.style.overflow='hidden';
}
function closePhLb(){
  document.getElementById('ph-lb').classList.remove('open');
  document.body.style.overflow='';
}
function renderPhLb(){
  const img=document.getElementById('ph-lb-img');
  img.style.opacity='0';img.src=phLbPhotos[phLbIdx];
  img.onload=()=>{img.style.opacity='1';};
  document.getElementById('ph-lb-prev').classList.toggle('hide',phLbIdx===0);
  document.getElementById('ph-lb-next').classList.toggle('hide',phLbIdx===phLbPhotos.length-1);
  const total=phLbPhotos.length;
  document.getElementById('ph-lb-counter').textContent=total>1?`${phLbIdx+1} / ${total}`:'';
  const dots=document.getElementById('ph-lb-dots');dots.innerHTML='';
  if(total>1){
    phLbPhotos.forEach((_,i)=>{
      const d=document.createElement('span');
      d.className='ph-lb-dot'+(i===phLbIdx?' active':'');
      d.addEventListener('click',()=>{phLbIdx=i;renderPhLb();});
      dots.appendChild(d);
    });
  }
}
document.getElementById('ph-lb-prev').addEventListener('click',()=>{if(phLbIdx>0){phLbIdx--;renderPhLb();}});
document.getElementById('ph-lb-next').addEventListener('click',()=>{if(phLbIdx<phLbPhotos.length-1){phLbIdx++;renderPhLb();}});
document.getElementById('ph-lb-close').addEventListener('click',closePhLb);
document.getElementById('ph-lb-bg').addEventListener('click',closePhLb);
document.addEventListener('keydown',e=>{
  if(!document.getElementById('ph-lb').classList.contains('open'))return;
  if(e.key==='ArrowLeft'&&phLbIdx>0){phLbIdx--;renderPhLb();}
  if(e.key==='ArrowRight'&&phLbIdx<phLbPhotos.length-1){phLbIdx++;renderPhLb();}
  if(e.key==='Escape')closePhLb();
});

// ── 사진 광장 샘플 데이터 ──────────────────────────────────
const SAMPLE_PHOTOS=[
  {id:'sp01',nick:'삼산냥덕',time:'오전 7:45',loc:'남구 삼산동',
   photos:['https://loremflickr.com/400/400/cat?lock=11'],hearts:47},
  {id:'sp02',nick:'태화강산책러',time:'오전 8:12',loc:'중구 태화동',
   photos:['https://loremflickr.com/400/400/cat?lock=22'],hearts:38},
  {id:'sp03',nick:'방어진바다냥',time:'오전 9:05',loc:'동구 방어진',
   photos:['https://loremflickr.com/400/400/cat?lock=33'],hearts:35},
  {id:'sp04',nick:'옥동골목탐험',time:'오전 10:20',loc:'남구 옥동',
   photos:['https://loremflickr.com/400/400/cat?lock=44'],hearts:29},
  {id:'sp05',nick:'학성공원러',time:'오전 11:33',loc:'중구 학성동',
   photos:['https://loremflickr.com/400/400/cat?lock=55'],hearts:24},
  {id:'sp06',nick:'무거동냥이지기',time:'오후 12:18',loc:'남구 무거동',
   photos:['https://loremflickr.com/400/400/cat?lock=66'],hearts:18},
  {id:'sp07',nick:'울산고양이탐정',time:'오후 1:44',loc:'북구 염포동',
   photos:['https://loremflickr.com/400/400/cat?lock=77'],hearts:15},
  {id:'sp08',nick:'태화루고양이',time:'오후 2:05',loc:'중구 태화동',
   photos:['https://loremflickr.com/400/400/cat?lock=88'],hearts:12},
  {id:'sp09',nick:'달동냥이맘',time:'오후 2:58',loc:'남구 달동',
   photos:['https://loremflickr.com/400/400/cat?lock=99'],hearts:9},
  {id:'sp10',nick:'장생포냥탐',time:'오후 3:30',loc:'남구 장생포',
   photos:['https://loremflickr.com/400/400/cat?lock=10'],hearts:7},
  {id:'sp11',nick:'선암호수냥',time:'오후 4:15',loc:'남구 선암동',
   photos:['https://loremflickr.com/400/400/cat?lock=111'],hearts:5},
  {id:'sp12',nick:'남목고양이',time:'오후 5:00',loc:'동구 남목동',
   photos:['https://loremflickr.com/400/400/cat?lock=122'],hearts:3},
];

// 하트 localStorage 헬퍼
function getHearts(){
  try{return JSON.parse(localStorage.getItem('nyangi_hearts')||'{}');}catch(e){return {};}
}
function saveHeartsStore(obj){
  try{localStorage.setItem('nyangi_hearts',JSON.stringify(obj));}catch(e){}
}
function toggleHeart(id,btn,baseHearts){
  const h=getHearts();
  const wasLiked=!!h[id];
  if(wasLiked){delete h[id];}else{h[id]=1;}
  saveHeartsStore(h);
  const liked=!wasLiked;
  const cnt=baseHearts+(liked?1:0);
  btn.classList.toggle('liked',liked);
  btn.classList.remove('pop');
  if(liked)requestAnimationFrame(()=>{btn.classList.add('pop');});
  btn.querySelector('.hico').textContent=liked?'♥':'♡';
  btn.querySelector('.hcnt').textContent=cnt;
}

// 배열 셔플 (Fisher–Yates)
function shuffleArray(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function makePhCard({id='',photos,nick,time,loc='',hearts=0,rank=0,liked=false}){
  photos=(Array.isArray(photos)&&photos.length)?photos:[];
  const h=getHearts();
  const isLiked=liked||!!h[id];
  const totalH=hearts+(isLiked?1:0);
  let idx=0;
  const card=document.createElement('div');card.className='photo-card';

  // 이미지 영역
  const wrap=document.createElement('div');wrap.className='card-img-wrap';wrap.style.cursor='pointer';
  wrap.addEventListener('click',()=>openPhLightbox(photos,idx,nick,time));
  const img=document.createElement('img');
  img.alt=nick+'의 고양이';img.loading='lazy';img.src=photos[0]||'';
  img.onerror=()=>{img.remove();const fb=document.createElement('div');fb.className='card-img-fallback';fb.textContent='🐱';wrap.appendChild(fb);};
  wrap.appendChild(img);

  // 순위 뱃지
  if(rank>=1&&rank<=5){
    const rb=document.createElement('div');
    rb.className=`rank-badge rank-${rank}`;
    rb.textContent=rank+'위';
    wrap.appendChild(rb);
  }

  // 다중 사진 캐러셀
  if(photos.length>1){
    const prev=document.createElement('button');prev.className='card-nav card-nav-prev hide';prev.innerHTML='&#8249;';
    const next=document.createElement('button');next.className='card-nav card-nav-next';next.innerHTML='&#8250;';
    const posEl=document.createElement('div');posEl.className='card-pos';
    const dots=photos.map((_,i)=>{const d=document.createElement('span');d.className='card-dot'+(i===0?' active':'');return d;});
    dots.forEach(d=>posEl.appendChild(d));
    function goTo(n){idx=n;img.style.opacity='0.55';img.src=photos[idx];img.onload=()=>{img.style.opacity='1';};dots.forEach((d,i)=>d.classList.toggle('active',i===idx));prev.classList.toggle('hide',idx===0);next.classList.toggle('hide',idx===photos.length-1);}
    prev.addEventListener('click',e=>{e.stopPropagation();if(idx>0)goTo(idx-1);});
    next.addEventListener('click',e=>{e.stopPropagation();if(idx<photos.length-1)goTo(idx+1);});
    wrap.append(prev,next,posEl);
  }

  // 카드 정보 + 하트 버튼
  const info=document.createElement('div');info.className='card-info';
  const left=document.createElement('div');left.className='card-info-left';
  left.innerHTML=`<div class="card-nick">@${nick}</div><div class="card-sub">📍 ${loc||time} ${loc?'· '+time:''}</div>`;

  const hBtn=document.createElement('button');
  hBtn.className='card-heart-btn'+(isLiked?' liked':'');
  hBtn.innerHTML=`<i class="hico">${isLiked?'♥':'♡'}</i><span class="hcnt">${totalH}</span>`;
  hBtn.addEventListener('click',e=>{e.stopPropagation();toggleHeart(id,hBtn,hearts);});

  info.append(left,hBtn);
  card.append(wrap,info);
  return card;
}

let _restPhotos=[];  // 셔플용 전역 저장

function initPhotoGallery(){
  const heartsStore=getHearts();
  const todayKey=`nyangi_${new Date().toISOString().slice(0,10)}`;
  let userRaw=[];
  try{userRaw=JSON.parse(localStorage.getItem(todayKey)||'[]');}catch(e){}

  // 유저 업로드 → 공통 포맷 변환
  const userEntries=userRaw.map(g=>({
    id:g.id||(g.nick+g.time),
    nick:g.nick,time:g.time,loc:'내 위치',
    photos:g.photos||[g.src],hearts:0,
  }));

  // 샘플 + 유저 합치기 → 하트 적용 → hearts순 정렬
  const allPhotos=[...SAMPLE_PHOTOS,...userEntries].map(p=>({
    ...p,
    totalHearts:p.hearts+(heartsStore[p.id]?1:0),
    liked:!!heartsStore[p.id],
  })).sort((a,b)=>b.totalHearts-a.totalHearts);

  if(!allPhotos.length){
    document.getElementById('ph-empty').style.display='block';
    document.getElementById('ph-top5-sec').style.display='none';
    document.getElementById('ph-rest-sec').style.display='none';
    document.getElementById('ph-meta').textContent='아직 오늘 사진이 없어요';
    return;
  }

  document.getElementById('ph-empty').style.display='none';
  document.getElementById('ph-meta').textContent=`오늘 ${allPhotos.length}명이 사진을 올렸어요`;

  // TOP 5 렌더
  const top5=allPhotos.slice(0,5);
  const top5Grid=document.getElementById('ph-top5-grid');
  top5Grid.innerHTML='';
  top5.forEach((p,i)=>{
    const card=makePhCard({...p,rank:i+1});
    card.style.animation=`cardIn .35s ease ${i*.07}s both`;
    top5Grid.appendChild(card);
  });
  document.getElementById('ph-top5-sec').style.display='';

  // 나머지 셔플 렌더
  _restPhotos=shuffleArray(allPhotos.slice(5));
  renderRestPhotos();
  if(_restPhotos.length>0){
    document.getElementById('ph-rest-sec').style.display='';
  }
}

function renderRestPhotos(){
  const grid=document.getElementById('photo-grid');
  grid.innerHTML='';
  _restPhotos.forEach((p,i)=>{
    const card=makePhCard(p);
    card.style.animation=`cardIn .3s ease ${i*.04}s both`;
    grid.appendChild(card);
  });
}

function shuffleRestPhotos(){
  shuffleArray(_restPhotos);
  renderRestPhotos();
}
