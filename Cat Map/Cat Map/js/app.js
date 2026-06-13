// ── SCREEN SWITCH ───────────────────────────────────────
function sw(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('sc-'+id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>{
    if(b.getAttribute('onclick')===`sw('${id}')`) b.classList.add('active');
  });
  if(id==='map'){
    if(!mapDone){initCatMap();mapDone=true}
    else setTimeout(()=>catMap.invalidateSize(),80);
  }
  if(id==='hm'){
    if(!hmDone){initHeatmap();hmDone=true}
    else{setTimeout(()=>hmMap.invalidateSize(),80);animBars()}
  }
  if(id==='bd') animBadges();
  if(id==='photo') initPhotoGallery();
  if(id==='profile') initProfile();
}

// ── ANIMATIONS ──────────────────────────────────────────
function animBadges(){
  setTimeout(()=>document.querySelectorAll('.bpf').forEach(el=>{el.style.width=el.dataset.p+'%'}),200);
}
function animBars(){
  setTimeout(()=>document.querySelectorAll('.hm-bar').forEach(el=>{el.style.width=el.dataset.p+'%'}),350);
}

// ── INIT ────────────────────────────────────────────────
buildJournal();
