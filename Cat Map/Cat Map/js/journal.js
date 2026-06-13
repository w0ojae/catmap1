// ── JOURNAL ─────────────────────────────────────────────
// 고양이별 보관 사진 (id → 사진 배열)
const CAT_PHOTOS={
  1:[
    {src:'https://loremflickr.com/400/400/cat?lock=201'},
    {src:'https://loremflickr.com/400/400/cat?lock=202'},
    {src:'https://loremflickr.com/400/400/cat?lock=203'},
  ],
  2:[
    {src:'https://loremflickr.com/400/400/cat?lock=211'},
    {src:'https://loremflickr.com/400/400/cat?lock=212'},
  ],
  3:[
    {src:'https://loremflickr.com/400/400/cat?lock=221'},
    {src:'https://loremflickr.com/400/400/cat?lock=222'},
    {src:'https://loremflickr.com/400/400/cat?lock=223'},
  ],
  4:[
    {src:'https://loremflickr.com/400/400/cat?lock=231'},
  ],
  5:[
    {src:'https://loremflickr.com/400/400/cat?lock=241'},
    {src:'https://loremflickr.com/400/400/cat?lock=242'},
  ],
  6:[
    {src:'https://loremflickr.com/400/400/cat?lock=251'},
    {src:'https://loremflickr.com/400/400/cat?lock=252'},
  ],
  7:[
    {src:'https://loremflickr.com/400/400/cat?lock=261'},
  ],
  8:[
    {src:'https://loremflickr.com/400/400/cat?lock=271'},
    {src:'https://loremflickr.com/400/400/cat?lock=272'},
  ],
  9:[
    {src:'https://loremflickr.com/400/400/cat?lock=281'},
  ],
  10:[
    {src:'https://loremflickr.com/400/400/cat?lock=291'},
  ],
  11:[
    {src:'https://loremflickr.com/400/400/cat?lock=301'},
    {src:'https://loremflickr.com/400/400/cat?lock=302'},
  ],
  12:[
    {src:'https://loremflickr.com/400/400/cat?lock=311'},
  ],
  13:[
    {src:'https://loremflickr.com/400/400/cat?lock=321'},
  ],
  14:[
    {src:'https://loremflickr.com/400/400/cat?lock=331'},
    {src:'https://loremflickr.com/400/400/cat?lock=332'},
  ],
};

function openCatPhoto(catId,idx){
  const photos=(CAT_PHOTOS[catId]||[]).map(p=>p.src);
  if(!photos.length)return;
  const cat=CATS.find(c=>c.id===catId);
  openPhLightbox(photos,idx,cat?cat.name:'고양이',cat?cat.date:'');
}
function buildJournal(){
  const left=document.getElementById('ccards-left');
  const right=document.getElementById('ccards-right');
  CATS.forEach((cat,idx)=>{
    const col=idx%2===0?left:right;
    const photos=CAT_PHOTOS[cat.id]||[];

    // 사진 섹션 HTML
    const photoHtml=photos.length?`
      <div class="jn-photo-sec">
        <div class="jn-photo-lbl">
          <span>📷 보관된 사진</span>
          <span class="jn-photo-cnt">${photos.length}장</span>
        </div>
        <div class="jn-photo-strip">
          ${photos.map((p,i)=>`
            <img class="jn-thumb" src="${p.src}" loading="lazy"
              alt="${cat.name} 사진"
              onclick="openCatPhoto(${cat.id},${i})"
              onerror="this.style.display='none'">
          `).join('')}
        </div>
      </div>
    `:'';

    // 사진 수 뱃지 (헤더용)
    const photoBadge=photos.length
      ?`<span class="jn-photo-badge">📷 ${photos.length}</span>`
      :'';

    const d=document.createElement('div');
    d.className='ccard';
    d.innerHTML=`
      <div class="ccard-h" onclick="toggleCard(this.parentElement)">
        <div class="cava">${cat.emo}</div>
        <div class="cinf">
          <div class="cnm">${cat.name}${photoBadge}</div>
          <div class="cmt"><span>📍 ${cat.loc.split(' ').at(-1)}</span><span>💛 ${cat.followers}명</span></div>
        </div>
        <button class="fbtn" onclick="doFollow(event,this)">팔로우</button>
        <span class="ccard-chev">›</span>
      </div>
      <div class="ctl"><div class="ctl-inner">
        ${photoHtml}
        <div class="tl-lbl">관찰 기록 ${cat.tl.length}건</div>
        ${cat.tl.map(t=>`
          <div class="tl-item">
            <div class="tldot">${cat.emo}</div>
            <div class="tlc">
              <div class="tldt">${t.date}</div>
              <div class="tllc">📍 ${t.loc}</div>
              <div class="tlnt">${t.note}</div>
              <span class="rptr">@${t.rp}</span>
            </div>
          </div>
        `).join('')}
      </div></div>
    `;
    col.appendChild(d);
  });
}
function toggleCard(c){c.classList.toggle('open')}
function doFollow(e,btn){
  e.stopPropagation();
  btn.classList.toggle('on');
  btn.textContent=btn.classList.contains('on')?'✓ 팔로잉':'팔로우';
}
