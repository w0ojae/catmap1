// ── UPLOAD ──────────────────────────────────────────────
document.getElementById('fi-img').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    const img=document.getElementById('prev-img');
    img.src=ev.target.result;img.style.display='block';
    document.getElementById('dz').classList.add('has');
  };
  r.readAsDataURL(f);
});

function selA(el){el.closest('.chips').querySelectorAll('.chip').forEach(c=>c.classList.remove('sela'));el.classList.toggle('sela')}
function selG(el){el.closest('.chips').querySelectorAll('.chip').forEach(c=>c.classList.remove('selg'));el.classList.toggle('selg')}

function doLoc(){
  const btn=document.getElementById('locbtn');
  document.getElementById('loctxt').textContent='📡 위치 확인 중...';
  setTimeout(()=>{
    document.getElementById('loctxt').textContent='✅  울산 남구 삼산동 (GPS)';
    btn.classList.add('set');
  },1100);
}

(()=>{
  const n=new Date();
  const cd=document.getElementById('cdate');
  const ct=document.getElementById('ctime');
  if(cd)cd.value=n.toISOString().slice(0,10);
  if(ct)ct.value=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
})();

function doSubmit(){
  document.getElementById('modal').classList.add('open');
  setTimeout(()=>document.getElementById('mfill').style.width='92%',400);
}

// ── MODAL ───────────────────────────────────────────────
function closeMod(e){
  if(e&&e.target!==document.getElementById('modal'))return;
  document.getElementById('modal').classList.remove('open');
  document.getElementById('mfill').style.width='0';
}
function doReg(type){
  document.getElementById('modal').classList.remove('open');
  document.getElementById('mfill').style.width='0';

  const prevImg=document.getElementById('prev-img');
  if(prevImg.src&&prevImg.src.startsWith('data:')){
    const nick=document.querySelector('.user-pill').textContent.trim().replace(/^./,'').trim()||'고양이탐정';
    const time=new Date().toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit',hour12:true});
    const key=`nyangi_${new Date().toISOString().slice(0,10)}`;
    const tmpImg=new Image();
    tmpImg.onload=()=>{
      let w=tmpImg.width,h=tmpImg.height;
      if(w>900){h=Math.round(h*900/w);w=900;}
      const cvs=document.createElement('canvas');cvs.width=w;cvs.height=h;
      cvs.getContext('2d').drawImage(tmpImg,0,0,w,h);
      const compressed=cvs.toDataURL('image/jpeg',0.78);
      try{
        const arr=JSON.parse(localStorage.getItem(key)||'[]');
        arr.unshift({id:Date.now().toString(),nick,time,photos:[compressed]});
        localStorage.setItem(key,JSON.stringify(arr));
      }catch(e){console.warn('사진 저장 실패:',e);}
      resetUploadForm();
      sw('photo');
    };
    tmpImg.src=prevImg.src;
    toast(type==='same'?'✅ 등록 완료! 사진 광장에서 확인하세요 🖼️':'🆕 새 고양이 등록 완료! 사진 광장에서 확인하세요 🖼️');
  }else{
    resetUploadForm();
    sw('photo');
    toast(type==='same'?'✅ 기록됐어요!':'🆕 새 고양이로 등록 완료!');
  }
}

function resetUploadForm(){
  // 드롭존 & 미리보기 초기화
  const dz=document.getElementById('dz');
  const prevImg=document.getElementById('prev-img');
  dz.classList.remove('has');
  prevImg.src='';
  prevImg.style.display='none';

  // 파일 인풋 초기화
  const fi=document.getElementById('fi-img');
  fi.value='';
  if(fi.value){fi.type='text';fi.type='file';}

  // 위치 버튼 초기화
  document.getElementById('locbtn').classList.remove('set');
  document.getElementById('loctxt').textContent='GPS로 현재 위치 가져오기';

  // 날짜·시간 현재 시각으로
  const n=new Date();
  document.getElementById('cdate').value=n.toISOString().slice(0,10);
  document.getElementById('ctime').value=
    String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');

  // 칩 선택 해제
  document.querySelectorAll('#sc-up .chip.sela,#sc-up .chip.selg').forEach(c=>{
    c.classList.remove('sela','selg');
  });

  // 목걸이 토글 OFF
  document.getElementById('colTog').classList.remove('on');

  // 꼬리 select 초기화
  const sel=document.querySelector('#sc-up .f-sel');
  if(sel)sel.selectedIndex=0;

  // 특이사항 textarea 초기화
  const ta=document.querySelector('#sc-up .f-ta');
  if(ta)ta.value='';
}
function toast(msg){
  const t=document.createElement('div');
  t.className='toast';t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2700);
}
