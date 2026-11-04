/** 純前端簡報；無 API、資料上傳或第三方依賴。 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const data = window.SITE_DATA;
  const imageSlides = [
    ...data.flows.map((item, i) => ({...item, kind:'flow', image:`9流程圖/流程${i + 1}.png`, number:i + 1, ratio:'16/9'})),
    ...data.cases.map((item, i) => ({...item, kind:'case', image:`7案例圖/案例${i + 1}.png`, number:i + 1, ratio:'3/2'}))
  ];
  const slides = [
    {kind:'intro', type:'cover', title:'已有雲端 AI，為何還要評估地端？'},
    {kind:'intro', type:'benefits', title:'AI 能為運彩公司帶來哪些效益'},
    {kind:'intro', type:'concept', title:'將 AI 整合進流程，也打造企業 AI 助理'},
    ...imageSlides
  ];
  const pageFor = kind => slides.findIndex(s => s.kind === kind) + 1;
  const state = {index:0, viewerIndex:0, scale:1, x:0, y:0, pointers:new Map(), gesture:null, returnTo:null};
  const clamp = (v, low, high) => Math.max(low, Math.min(high, v));
  const section = s => s.kind === 'case' ? `企業 AI 助理情境 ${s.number} / 7` : `AI 工作流程整合 ${s.number} / 9`;
  const heading = (label, title, caption='') => `<header class="slide-heading"><div><p class="section-label">${label}</p><h1 id="slideTitle">${title}</h1></div>${caption ? `<p class="slide-caption">${caption}</p>` : ''}</header>`;
  function figure(s) {
    return `<figure class="figure"><button type="button" class="image-button" style="--ratio:${s.ratio}" data-image="${imageSlides.indexOf(s)}" aria-label="放大：${s.title}"><img src="${s.image}" alt="${s.title}，完整原圖" draggable="false" fetchpriority="high"><span class="image-error" hidden>圖片無法載入，請確認原圖位置。</span></button><figcaption>原圖完整呈現，點圖可放大檢視</figcaption></figure>`;
  }
  function markup(s) {
    if (s.type === 'cover') return `<div class="cover landing"><div class="cover-copy"><p class="section-label">AI 效益與地端價值</p><h1 id="slideTitle">已有雲端 AI，<br>為何還要評估地端？</h1><p class="cover-lede">既然有 ChatGPT、Gemini 等服務，公司建置自己的 AI，究竟能多帶來什麼？</p><div class="cover-rule" aria-hidden="true"></div><p class="landing-purpose">以運彩業務說明：AI 如何改善工作，以及哪些需求適合採用地端部署。</p><div class="cover-links"><a href="#slide-${pageFor('flow')}" class="button primary">按此看AI工作流程整合案例</a><a href="#slide-${pageFor('case')}" class="button primary">按此看企業AI助理應用案例</a></div></div><div class="landing-values"><section class="value-distinction"><h2>企業導入 AI 的效益</h2><p class="distinction-lead">減少人工作業、提高效率、改善服務、強化風險管理。</p><p>這些效益並非地端專屬，雲端 AI 也可能做到。</p></section><section class="value-distinction local-distinction"><h2>採用地端 AI 的額外效益</h2><p class="distinction-lead">讓重要資料與 AI 運算留在企業控制的環境。</p><p>降低敏感資料外傳需求，提高內部系統整合自主性，並減少部分外部服務依賴。</p></section><p class="landing-note">是否值得投入，仍須依資料、效益、成本與維運能力評估。</p></div></div>`;
    if (s.type === 'benefits') return `${heading('AI 效益與地端價值',s.title)}<p class="concept-intro">讓人員把時間留給專業判斷，讓組織累積可持續運用的能力。</p><div class="benefit-grid">${data.benefits.map(v=>`<section class="benefit-item"><h2>${v.title}</h2><p>${v.text}</p></section>`).join('')}</div><p class="principle-line">這些是<strong>企業導入 AI 的效益</strong>；雲端或地端皆可能達成，實際成果須由試點量測。</p>`;
    if (s.type === 'concept') return `${heading('AI 效益與地端價值',s.title)}<p class="concept-intro">兩種應用可以並存：流程處理固定工作，助理支援隨時出現的問題。</p><div class="concept-columns"><section class="concept-panel flow-panel"><h2>AI 工作流程整合</h2><p class="lead">事件或排程觸發，接續任務與追蹤</p><p>設備故障、賽事異動、客服進件或每日報表，依規則啟動；重要節點保留人工覆核。</p><a class="button primary" href="#slide-${pageFor('flow')}">按此看AI工作流程整合案例</a></section><section class="concept-panel"><h2>企業 AI 助理</h2><p class="lead">人員提出問題，助理查詢與分析</p><p>以公司授權知識與資料，支援經銷商、風控、客服、稽核及主管等不同情境的問題。</p><a class="button primary" href="#slide-${pageFor('case')}">按此看企業AI助理應用案例</a></section></div><p class="principle-line"><strong>共同基礎：</strong>資料經授權、回答有依據、權限有界線，重要判斷由人員負責。</p>`;
    if (s.image) return `${heading(section(s),s.title,'應用建議情境')}<div class="visual-body"><div class="slide-copy"><section class="copy-block"><h2>可評估的效益</h2><p>${s.value}</p></section><section class="copy-block local-value"><h2>適合評估地端的理由</h2><p>${s.local}</p></section><section class="copy-block human-note"><h2>關鍵把關</h2><p>${s.human}</p></section></div>${figure(s)}</div>`;
    return '';
  }
  function render(focus=false) {
    const s = slides[state.index];
    $('slide').innerHTML = markup(s);
    $('slide').dataset.kind = s.kind;
    $('pageCount').innerHTML = `<strong>${String(state.index + 1).padStart(2,'0')}</strong> / ${slides.length}`;
    $('progress').style.width = `${(state.index + 1) / slides.length * 100}%`;
    $('prev').disabled = state.index === 0;
    $('next').disabled = state.index === slides.length - 1;
    document.querySelectorAll('[data-chapter]').forEach(a => {
      const active = a.dataset.chapter === s.kind;
      a.classList.toggle('active',active);
      if (active) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
    });
    document.title = `${s.title}｜運彩企業 AI`;
    $('slide').querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => openViewer(Number(button.dataset.image), button)));
    const img = $('slide').querySelector('img');
    if (img) img.onerror = () => { img.hidden = true; img.parentElement.querySelector('.image-error').hidden = false; };
    if (focus) { $('slide').focus({preventScroll:true}); window.scrollTo(0,0); }
  }
  function go(index, focus=true, replace=false) {
    state.index = clamp(index,0,slides.length - 1);
    const hash = `#slide-${state.index + 1}`;
    if (location.hash !== hash) history[replace ? 'replaceState' : 'pushState'](null,'',hash);
    render(focus);
  }
  function fromHash(focus=false) {
    const match = location.hash.match(/^#slide-(\d+)$/);
    go(match ? Number(match[1])-1 : 0,focus,true);
    if ($('viewer').open) $('viewer').close();
    if ($('contents').open) $('contents').close();
  }
  $('prev').addEventListener('click', () => go(state.index - 1));
  $('next').addEventListener('click', () => go(state.index + 1));
  window.addEventListener('hashchange', () => fromHash(true));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#slide-"]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); go(Number(a.hash.slice(7))-1);
  });

  function openContents() {
    const groups = [['AI 效益與地端價值','intro'],['AI 工作流程整合：9 張流程圖','flow'],['企業 AI 助理應用：7 張情境圖','case']];
    $('contentsBody').innerHTML = groups.map(([title,kind]) => `<section><h3>${title}</h3><div class="${kind === 'case' || kind === 'flow' ? 'contents-grid' : 'contents-text-grid'}">${slides.map((s,i) => s.kind === kind ? `<button class="contents-item" type="button" data-page="${i}" ${state.index === i ? 'aria-current="page"' : ''}>${s.image ? `<img src="${s.image}" alt="" loading="lazy">` : ''}<span class="contents-number">${String(i+1).padStart(2,'0')}</span>${s.short || s.title}</button>` : '').join('')}</div></section>`).join('');
    $('contentsBody').querySelectorAll('[data-page]').forEach(b => b.addEventListener('click', () => { $('contents').close(); go(Number(b.dataset.page)); }));
    $('contents').showModal();
  }
  $('openContents').addEventListener('click',openContents);
  $('closeContents').addEventListener('click', () => $('contents').close());
  $('contents').addEventListener('click', e => { if (e.target === $('contents')) { const r = $('contents').getBoundingClientRect(); if (e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) $('contents').close(); } });
  const full = $('fullscreen');
  if (!document.fullscreenEnabled) full.hidden = true;
  full.addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { full.textContent = '全螢幕不可用'; }
  });
  document.addEventListener('fullscreenchange', () => { full.textContent = document.fullscreenElement ? '退出全螢幕' : '全螢幕'; resetZoom(); });

  const viewer = $('viewer'), stage = $('viewerStage'), viewerImage = $('viewerImage');
  function applyTransform() {
    const r = stage.getBoundingClientRect();
    const ratio = Math.min(r.width / (viewerImage.naturalWidth || r.width),r.height / (viewerImage.naturalHeight || r.height));
    const width = (viewerImage.naturalWidth || r.width)*ratio*state.scale;
    const height = (viewerImage.naturalHeight || r.height)*ratio*state.scale;
    const maxX = Math.max(0,(width-r.width)/2), maxY = Math.max(0,(height-r.height)/2);
    state.x = clamp(state.x,-maxX,maxX); state.y = clamp(state.y,-maxY,maxY);
    viewerImage.style.transform = `translate(${state.x}px,${state.y}px) scale(${state.scale})`;
    $('zoomLevel').textContent = `${Math.round(state.scale*100)}%`;
    $('zoomOut').disabled = state.scale <= 1;
    $('zoomIn').disabled = state.scale >= 5;
    stage.classList.toggle('zoomed',state.scale > 1);
  }
  function resetZoom() { state.scale=1;state.x=0;state.y=0;state.pointers.clear();state.gesture=null;stage.classList.remove('dragging');if(viewer.open) applyTransform(); }
  function zoom(value,clientX,clientY) {
    const r = stage.getBoundingClientRect(), old = state.scale;
    const x = clientX == null ? 0 : clientX-r.left-r.width/2;
    const y = clientY == null ? 0 : clientY-r.top-r.height/2;
    state.scale = clamp(value,1,5);
    state.x = x-(x-state.x)*state.scale/old;
    state.y = y-(y-state.y)*state.scale/old;
    applyTransform();
  }
  function renderViewer() {
    const s = imageSlides[state.viewerIndex];
    $('viewerTitle').textContent = s.title;
    $('viewerCategory').textContent = section(s);
    $('viewerCount').textContent = `${state.viewerIndex+1} / ${imageSlides.length}`;
    $('viewerPrev').disabled = state.viewerIndex === 0;
    $('viewerNext').disabled = state.viewerIndex === imageSlides.length-1;
    $('originalImage').href = s.image;
    $('viewerError').hidden = true;
    viewerImage.hidden = false;
    viewerImage.alt = `${s.title}，完整原圖，可縮放與拖曳`;
    viewerImage.onload = () => applyTransform();
    viewerImage.onerror = () => { viewerImage.hidden=true;$('viewerError').hidden=false; };
    viewerImage.src = s.image;
    resetZoom();
  }
  function openViewer(index,button) { state.viewerIndex=index;state.returnTo=button;viewer.showModal();renderViewer(); }
  function changeImage(delta) {
    state.viewerIndex = clamp(state.viewerIndex+delta,0,imageSlides.length-1);
    go(slides.indexOf(imageSlides[state.viewerIndex]),false);
    renderViewer();
  }
  $('closeViewer').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    resetZoom();
    if (state.returnTo?.isConnected) state.returnTo.focus({preventScroll:true});
    else $('slide').querySelector('[data-image]')?.focus({preventScroll:true});
  });
  $('viewerPrev').addEventListener('click', () => changeImage(-1));
  $('viewerNext').addEventListener('click', () => changeImage(1));
  $('zoomIn').addEventListener('click', () => zoom(state.scale*1.3));
  $('zoomOut').addEventListener('click', () => zoom(state.scale/1.3));
  $('fitImage').addEventListener('click',resetZoom);
  stage.addEventListener('wheel', e => { e.preventDefault();zoom(state.scale*Math.exp(-e.deltaY*.0015),e.clientX,e.clientY); },{passive:false});
  stage.addEventListener('dblclick', e => { zoom(state.scale > 1 ? 1 : 2,e.clientX,e.clientY); });
  function gesture() {
    const p = [...state.pointers.values()];
    if (!p.length) { state.gesture=null; return; }
    state.gesture={x:p[0].x,y:p[0].y,panX:state.x,panY:state.y,scale:state.scale};
    if (p.length >= 2) {
      state.gesture.distance=Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y);
      state.gesture.midX=(p[0].x+p[1].x)/2;state.gesture.midY=(p[0].y+p[1].y)/2;
    }
  }
  stage.addEventListener('pointerdown', e => { if (e.pointerType==='mouse' && e.button!==0) return;stage.setPointerCapture(e.pointerId);state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});gesture();stage.classList.add('dragging'); });
  stage.addEventListener('pointermove', e => {
    if (!state.pointers.has(e.pointerId)) return;
    state.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const p=[...state.pointers.values()],g=state.gesture;
    if (p.length>=2 && g.distance) {
      const r=stage.getBoundingClientRect();
      state.scale=clamp(g.scale*Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y)/g.distance,1,5);
      const x=g.midX-r.left-r.width/2,y=g.midY-r.top-r.height/2;
      state.x=x-(x-g.panX)*state.scale/g.scale+(p[0].x+p[1].x)/2-g.midX;
      state.y=y-(y-g.panY)*state.scale/g.scale+(p[0].y+p[1].y)/2-g.midY;
    } else { state.x=g.panX+e.clientX-g.x;state.y=g.panY+e.clientY-g.y; }
    applyTransform();
  });
  const endPointer = e => { state.pointers.delete(e.pointerId);gesture();if(!state.pointers.size) stage.classList.remove('dragging'); };
  stage.addEventListener('pointerup',endPointer);stage.addEventListener('pointercancel',endPointer);stage.addEventListener('lostpointercapture',endPointer);
  window.addEventListener('resize', () => { if(viewer.open) applyTransform(); });
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.matches('input,textarea,select,[contenteditable]')) return;
    const activeDialog = viewer.open ? viewer : $('contents').open ? $('contents') : null;
    if (activeDialog && e.key === 'Tab') {
      const focusable = [...activeDialog.querySelectorAll('button:not(:disabled),a[href]')].filter(el => el.getClientRects().length);
      const current = focusable.indexOf(document.activeElement);
      e.preventDefault();
      focusable[(current + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus();
      return;
    }
    if ($('contents').open) return;
    if (viewer.open) {
      if (e.key==='ArrowLeft') {e.preventDefault();changeImage(-1);}
      if (e.key==='ArrowRight') {e.preventDefault();changeImage(1);}
      if (e.key==='+' || e.key==='=') {e.preventDefault();zoom(state.scale*1.3);}
      if (e.key==='-') {e.preventDefault();zoom(state.scale/1.3);}
      if (e.key==='0') {e.preventDefault();resetZoom();}
      return;
    }
    if (e.key==='ArrowLeft' || e.key==='PageUp') {e.preventDefault();go(state.index-1);}
    if (e.key==='ArrowRight' || e.key==='PageDown') {e.preventDefault();go(state.index+1);}
    if (e.key==='Home') {e.preventDefault();go(0);}
    if (e.key==='End') {e.preventDefault();go(slides.length-1);}
  });
  fromHash();
})();
