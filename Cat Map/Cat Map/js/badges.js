// ── BADGE FILTER ────────────────────────────────────────
function bdFilterOwned(){
  const tog=document.getElementById('bd-own-tog');
  tog.classList.toggle('on');
  const onlyGot=tog.classList.contains('on');

  // locked 뱃지 숨기기 / 보이기
  document.querySelectorAll('.bcard.locked').forEach(el=>{
    el.classList.toggle('bd-hidden',onlyGot);
  });

  // 획득 뱃지가 0개인 카테고리 섹션 전체 숨기기
  document.querySelectorAll('.bd-cat').forEach(sec=>{
    if(onlyGot){
      const hasGot=sec.querySelectorAll('.bcard.got').length>0;
      sec.style.display=hasGot?'':'none';
    }else{
      sec.style.display='';
    }
  });

  // 카운트 레이블 업데이트
  const total=onlyGot
    ?document.querySelectorAll('.bcard.got').length
    :document.querySelectorAll('.bcard').length;
  document.getElementById('bd-cnt-lbl').textContent=total+'개 표시 중';
}
