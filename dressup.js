// =====================================================================
// TRANG "THAY ĐỒ" (#studio) – trò chơi phối đồ chibi, bố cục dọc kiểu ứng dụng điện thoại
// Dùng Avatar (js/avatar.js) để vẽ; trạng thái lưu vào hồ sơ người dùng (localStorage).
// =====================================================================
(() => {
  const { esc, toast, openModal, closeModal, render, go, me, routes, afterRender, actions: A } = App;

  // ---------- Tab & mục con ----------
  const ICON = {
    face: '<circle cx="12" cy="12" r="8"/><path d="M9 11h.01M15 11h.01M9.5 15q2.5 2 5 0"/>',
    hair: '<path d="M4 15q0-11 8-11t8 11"/><path d="M6 14q1-6 6-6t6 6"/><circle cx="12" cy="14" r="5"/>',
    eyes: '<path d="M2 12q10-10 20 0q-10 10-20 0z"/><circle cx="12" cy="12" r="3.2"/>',
    clothes: '<path d="M8 3l-5 4 3 4 2-1v11h8V10l2 1 3-4-5-4q-2 2-4 2t-4-2z"/>',
    feet: '<path d="M3 15h7l3-5 3 3 5 1v4H3z"/><path d="M3 18h18"/>',
    acc: '<path d="M2 15L12 4l10 11q-10 4-20 0z"/><path d="M7 10h10M5 13h14"/>',
    pose: '<path d="M7 11V5a1.5 1.5 0 013 0v5M10 10V3.5a1.5 1.5 0 013 0V10M13 10V5a1.5 1.5 0 013 0v7q0 7-6 7-4 0-6-4l-2-4a1.5 1.5 0 012.6-1.5L7 13"/>',
    bg: '<path d="M16 3a6 6 0 1 0 5 9 5 5 0 0 1-5-9z"/><path d="M2 17q5-3 10 0t10 0M2 21q5-3 10 0t10 0"/>',
  };
  const TABS = [
    { id: 'face', name: 'Mặt & da', subs: [['face', 'Dáng mặt'], ['skin', 'Màu da']] },
    { id: 'hair', name: 'Tóc', subs: [['hair', 'Kiểu tóc'], ['fringe', 'Mái & ngôi']] },
    { id: 'eyes', name: 'Mắt & môi', subs: [['eyes', 'Mắt'], ['brows', 'Lông mày'], ['mouth', 'Miệng'], ['blush', 'Má hồng']] },
    { id: 'clothes', name: 'Trang phục', subs: [['top', 'Áo bà ba & áo cánh'], ['dress', 'Áo dài & váy'], ['bottom', 'Quần & váy đụp'], ['outer', 'Khăn & áo ngoài']] },
    { id: 'feet', name: 'Dép guốc', subs: [['shoes', 'Dép, guốc & ủng'], ['socks', 'Ống chân']] },
    { id: 'acc', name: 'Phụ kiện', subs: [['acc', 'Nón, khăn & đồ đồng quê (chọn nhiều)']] },
    { id: 'pose', name: 'Dáng', subs: [['pose', 'Dáng & việc đồng áng']] },
    { id: 'bg', name: 'Khung cảnh', subs: [['bg', 'Khung cảnh làng quê']] },
  ];
  // mục con nào có hàng chấm màu
  const COLOR_OF = { hair: ['hairColor', 'HAIRC'], fringe: ['hairColor', 'HAIRC'], eyes: ['eyeColor', 'EYEC'], top: ['topColor', 'CLOTH'], outer: ['outerColor', 'CLOTH'], dress: ['dressColor', 'CLOTH'], bottom: ['bottomColor', 'CLOTH'], shoes: ['shoeColor', 'CLOTH'] };
  // nhãn ô "không mặc" cho từng mục không bắt buộc
  const NONE = { top: 'Không mặc áo', outer: 'Không khoác', dress: 'Không mặc', bottom: 'Không mặc', socks: 'Chân trần', shoes: 'Đi chân trần', blush: 'Không má hồng', acc: 'Bỏ hết' };

  let st = null, tab = 0, sub = 0, collapsed = false, hidden = [], showLayers = false, showHat = false;
  const HATS = [0, 1, 3];                                   // nón lá, khăn vấn, mũ – che mái tóc
  const load = () => { st = Avatar.normalize(me().avatar); if (!st.name) st.name = me().name; };
  const save = () => { State.user = { ...me(), avatar: { ...st } }; const n = document.getElementById('navAvatar'); if (n) n.innerHTML = Avatar.render(st, 28); };
  const cat = () => TABS[tab].subs[sub][0];
  const keepsBottom = () => !!(Avatar.CATS.dress[st.dress] || {}).keepBottom;   // áo dài mặc cùng quần

  // ---------- Vẽ các phần ----------
  function itemsHtml() {
    const c = cat();
    if (c === 'skin') return Avatar.SKINS.map(hex => cell(c, hex, st.skin === hex, false, Avatar.thumb('skin', hex, st), 'Màu da ' + hex)).join('');
    const big = ['pose', 'bg', 'acc'].includes(c);
    const none = NONE[c] ? cell(c, -1, c === 'acc' ? !st.accessories.length : st[c] < 0, false, `<span class="du-none-ic" aria-hidden="true">∅</span><span class="du-cap">${NONE[c]}</span>`, NONE[c], false, 'du-none') : '';
    return none + Avatar.CATS[c].map((it, i) => {
      const on = c === 'acc' ? st.accessories.includes(i) : st[c] === i;
      return cell(c, i, on, Avatar.isLocked(c, i, st), Avatar.thumb(c, i, st) + (big ? `<span class="du-cap">${esc(it.name)}</span>` : ''), it.name);
    }).join('');
  }
  function cell(c, v, on, locked, pic, name, dim, cls = '') {
    return `<button class="du-cell ${cls} ${on ? 'on' : ''} ${dim ? 'dim' : ''}" data-act="du-pick" data-v="${esc(String(v))}" aria-pressed="${on}" aria-label="${esc(name)}${locked ? ' (khóa)' : ''}" title="${esc(name)}${dim ? ' – đang ẩn vì mặc áo dài / váy liền' : ''}">
      ${pic}${on ? '<span class="du-tick" aria-hidden="true">✓</span>' : ''}${locked ? '<span class="du-lockb" aria-hidden="true">🔒</span>' : ''}</button>`;
  }
  function colorsHtml() {
    const c = cat(), m = COLOR_OF[c]; if (!m) return '';
    const cur = Avatar.CATS[c][st[c]];
    if (cur && cur.fixed) return `<p class="du-note">🎨 <b>${esc(cur.name)}</b> có màu cố định – chọn món khác để đổi màu.</p>`;
    if (c === 'eyes' && cur && cur.noColor) return `<p class="du-note">👁 Kiểu mắt nhắm này không lộ màu mắt.</p>`;
    return `<div class="du-colors" role="radiogroup" aria-label="Màu">${Avatar[m[1]].map(hex => `<button class="du-dot ${st[m[0]] === hex ? 'on' : ''}" style="--c:${hex}" data-act="du-color" data-k="${m[0]}" data-v="${hex}" role="radio" aria-checked="${st[m[0]] === hex}" aria-label="Màu ${hex}"></button>`).join('')}</div>`;
  }
  function panelBody() {
    const t = TABS[tab];
    return `${t.subs.length > 1 ? `<div class="du-subs" role="tablist">${t.subs.map(([k, n], i) => `<button class="${i === sub ? 'on' : ''}" data-act="du-sub" data-i="${i}" role="tab" aria-selected="${i === sub}">${n}</button>`).join('')}${['hair', 'fringe'].includes(cat()) && st.accessories.some(i => HATS.includes(i)) ? `<button class="du-peek" data-act="du-peek" aria-pressed="${showHat}">${showHat ? '🙈 Bỏ nón' : '👒 Hiện nón'}</button>` : ''}</div>` : `<div class="du-subs single">${t.subs[0][1]}</div>`}
      ${colorsHtml()}<div class="du-legend"><span><i class="du-tick">✓</i> đang mặc</span>${cat() !== 'skin' && Avatar.CATS[cat()].some((_, i) => Avatar.isLocked(cat(), i, st)) ? '<span><i class="du-lockb">🔒</i> món khóa – bấm để xem quảng cáo mở khóa</span>' : ''}</div><div class="du-grid ${['pose', 'bg', 'acc'].includes(cat()) ? 'big' : ''}" id="duGrid">${itemsHtml()}</div>`;
  }
  // bảng lớp nằm ở khung dưới → nhân vật luôn nhìn thấy đủ khi bật/tắt lớp
  const layersHtml = () => `<div class="du-layers" role="group" aria-label="Các lớp"><div class="du-layers-head"><b>Các lớp (dưới → trên)</b><span>bỏ chọn để ẩn lớp</span><button class="du-layers-close" data-act="du-layers">Đóng (Esc)</button></div>
    <div class="du-layers-list">${Avatar.LAYERS.map(([k, n], i) => `<label class="${hidden.includes(k) ? '' : 'on'}"><input type="checkbox" data-in="du-layer" value="${k}" ${hidden.includes(k) ? '' : 'checked'}><i>${i + 1}</i> ${n}</label>`).join('')}</div></div>`;
  const charHtml = () => `<g class="du-bounce" id="duBounce"><g class="du-char">${Avatar.charSvg(st, hidden)}</g></g>`;
  const btn = (act, icon, label, extra = '') => `<button class="du-btn" data-act="${act}" aria-label="${label}" title="${label}" ${extra}>${icon}</button>`;

  routes.studio = () => {
    load();
    return `<div class="du ${collapsed ? 'collapsed' : ''}" id="du" style="${Avatar.styleOf(st)}">
      <div class="du-stage">
        <svg class="du-svg" id="duSvg" viewBox="40 20 320 780" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Nhân vật của ${esc(st.name)}">
          <g id="duBg">${Avatar.bgSvg(st.bg, 'dub')}</g><g id="duChar">${charHtml()}</g></svg>
        <div class="du-name">${esc(st.name)}</div>
        <div class="du-col du-left">
          ${btn('du-layers', '<span class="du-txt">Lớp</span>', 'Xem từng lớp', `aria-pressed="${showLayers}"`)}
          ${btn('du-random', '🎲', 'Ngẫu nhiên')}
          ${btn('du-collapse', '<span class="du-chev">⌄⌄</span>', collapsed ? 'Mở bảng chọn đồ' : 'Thu gọn bảng chọn đồ', `aria-expanded="${!collapsed}"`)}
        </div>
        <div class="du-col du-right">
          ${btn('du-photo', '📷', 'Chụp ảnh')}
          ${btn('du-home', '🏠', 'Đặt tên / Trang chủ')}
          ${btn('du-png', '⬇', 'Lưu ảnh PNG')}
          ${btn('du-clear', '🗑', 'Xóa hết')}
        </div>
      </div>
      <section class="du-panel" id="duPanel" aria-label="Bảng chọn đồ">
        <div class="du-tabs" role="tablist">${TABS.map((t, i) => `<button class="${i === tab ? 'on' : ''}" data-act="du-tab" data-i="${i}" role="tab" aria-selected="${i === tab}" aria-label="${t.name}" title="${t.name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[t.id]}</svg></button>`).join('')}</div>
        <div class="du-body" id="duBody">${showLayers ? layersHtml() : panelBody()}</div>
      </section>
    </div>`;
  };
  App.NARROW.push('studio');

  // ---------- Cập nhật từng phần (không vẽ lại cả trang) ----------
  const $ = id => document.getElementById(id);
  function redrawChar(bounce = true) {
    $('duChar').innerHTML = charHtml();
    if (bounce) { const b = $('duBounce'); b.classList.remove('go'); void b.getBBox; requestAnimationFrame(() => b.classList.add('go')); }
    $('duBg').innerHTML = Avatar.bgSvg(st.bg, 'dub');
  }
  // đang chọn tóc/mái → làm mờ nón để thấy rõ tóc; rời tab thì nón hiện lại
  const syncPeek = () => { const el = $('du'); if (el) el.classList.toggle('peek', ['hair', 'fringe'].includes(cat()) && !showHat); };
  // vẽ lại khung dưới: giữ nguyên vị trí cuộn trang, đưa tab con đang chọn vào giữa thanh
  const redrawBody = () => {
    const y = window.scrollY;
    $('duBody').innerHTML = showLayers ? layersHtml() : panelBody(); syncPeek(); fitSubs();
    if (window.scrollY !== y) window.scrollTo(0, y);
  };
  function fitSubs() {
    const bar = document.querySelector('#duBody .du-subs'); if (!bar) return;
    const on = bar.querySelector('button.on');
    if (on) bar.scrollLeft = on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2;
    const mark = () => { bar.classList.toggle('more-r', bar.scrollLeft + bar.clientWidth < bar.scrollWidth - 2); bar.classList.toggle('more-l', bar.scrollLeft > 2); };
    mark(); bar.onscroll = mark;
  }
  const applyVars = () => { const v = Avatar.vars(st), el = $('du'); for (const k in v) el.style.setProperty('--' + k, v[k]); };

  function pick(raw) {
    const c = cat();
    if (c === 'skin') { st.skin = raw; applyVars(); redrawBody(); save(); return; }
    const i = +raw;
    if (Avatar.isLocked(c, i, st)) { askUnlock(c, i); return; }
    if (i < 0) { if (c === 'acc') st.accessories = []; else st[c] = -1; redrawChar(); redrawBody(); save(); return; }   // ô "Không mặc"
    if (c === 'acc') {
      const sl = Avatar.slotOf(i);   // nón lá, nón đeo lưng, khăn vấn, mũ: chỉ đội một món
      st.accessories = st.accessories.includes(i) ? st.accessories.filter(x => x !== i) : [...st.accessories.filter(x => !sl || Avatar.slotOf(x) !== sl), i];
    }
    else if (st[c] === i && !Avatar.REQUIRED.includes(c)) st[c] = -1;          // bấm lại món đang mặc → cởi
    else {
      st[c] = i;
      if (c === 'top' || (c === 'bottom' && !keepsBottom())) st.dress = -1;   // mặc áo/quần → bỏ váy liền (áo dài vẫn giữ quần)
      if (c === 'dress') { st.top = -1; if (Avatar.CATS.dress[i].keepBottom) { if (st.bottom < 0) st.bottom = 2; } else st.bottom = -1; }   // áo dài thay áo, không mặc chồng
    }
    redrawChar(); redrawBody(); save();
  }

  function askUnlock(c, i) {
    const name = Avatar.CATS[c][i].name;
    openModal('Mở khóa món này?', `<div class="du-unlock"><div class="du-unlock-pic" style="${Avatar.styleOf(st)}">${Avatar.thumb(c, i, st)}</div>
      <p><b>${esc(name)}</b> là món khóa. Xem một đoạn quảng cáo ngắn (giả lập) để mở khóa vĩnh viễn.</p>
      <div class="row wrap"><button class="btn" data-act="du-watch" data-c="${c}" data-i="${i}">▶ Xem quảng cáo</button><button class="btn ghost" data-act="close">Để sau</button></div></div>`);
  }
  let adTimer = null;
  A['du-watch'] = el => {
    const c = el.dataset.c, i = +el.dataset.i;
    const box = document.querySelector('.du-unlock'); let n = 3;
    box.innerHTML = `<div class="du-ad" aria-live="polite"><span>Quảng cáo (giả lập)</span><b id="duAdN">${n}</b><small>Phúc Long – Trà Độc Bản 🍃 · thưởng trà dưới trăng</small></div>`;
    clearInterval(adTimer);
    adTimer = setInterval(() => {
      n--; const nEl = document.getElementById('duAdN');
      if (!nEl) { clearInterval(adTimer); return; }
      if (n > 0) { nEl.textContent = n; return; }
      clearInterval(adTimer);
      st.unlocked.push(c + ':' + i);
      if (c === 'acc') { const sl = Avatar.slotOf(i); st.accessories = [...st.accessories.filter(x => !sl || Avatar.slotOf(x) !== sl), i]; } else { st[c] = i; if (c === 'top' || (c === 'bottom' && !keepsBottom())) st.dress = -1; if (c === 'dress') st.top = -1; }
      closeModal(); save(); redrawChar(); redrawBody();
      toast(`🔓 Đã mở khóa <b>${esc(Avatar.CATS[c][i].name)}</b>`);
    }, 1000);
  };

  Object.assign(A, {
    'du-tab': el => { tab = +el.dataset.i; sub = 0; if (showLayers) { showLayers = false; document.querySelector('[data-act="du-layers"].du-btn')?.setAttribute('aria-pressed', false); } document.querySelectorAll('.du-tabs button').forEach((b, i) => { b.classList.toggle('on', i === tab); b.setAttribute('aria-selected', i === tab); }); redrawBody(); },
    'du-sub': el => { sub = +el.dataset.i; redrawBody(); },
    'du-peek': () => { showHat = !showHat; redrawBody(); },
    'du-pick': el => pick(el.dataset.v),
    'du-color': el => { st[el.dataset.k] = el.dataset.v; applyVars(); document.querySelectorAll('.du-dot').forEach(d => { const on = d.dataset.v === el.dataset.v; d.classList.toggle('on', on); d.setAttribute('aria-checked', on); }); save(); },
    'du-random': () => { st = Avatar.random(st); st.name = st.name || me().name; applyVars(); redrawChar(); redrawBody(); save(); },
    'du-collapse': () => { collapsed = !collapsed; $('du').classList.toggle('collapsed', collapsed); const b = document.querySelector('[data-act="du-collapse"]'); b.setAttribute('aria-expanded', !collapsed); b.title = b.ariaLabel = collapsed ? 'Mở bảng chọn đồ' : 'Thu gọn bảng chọn đồ'; },
    'du-layers': () => { showLayers = !showLayers; const b = document.querySelector('[data-act="du-layers"].du-btn'); if (b) b.setAttribute('aria-pressed', showLayers); if (collapsed && showLayers) A['du-collapse'](); redrawBody(); },
    'du-photo': photoMode,
    'du-home': () => openModal('Nhân vật của bạn', `<label class="field"><span>Tên nhân vật</span><input class="input" id="duName" maxlength="24" value="${esc(st.name)}"></label>
      <div class="row wrap" style="margin-top:14px"><button class="btn" data-act="du-name">Lưu tên</button><a class="btn ghost" href="#home" data-act="close">🏠 Về trang chủ</a></div>`),
    'du-name': () => { st.name = document.getElementById('duName').value.trim() || me().name; save(); closeModal(); document.querySelector('.du-name').textContent = st.name; toast('✏️ Đã đổi tên nhân vật'); },
    'du-png': exportPng,
    'du-clear': () => openModal('Xóa hết?', `<p>Nhân vật sẽ trở về dáng mặc định, bỏ hết quần áo và phụ kiện. Các món đã mở khóa vẫn được giữ.</p><div class="row wrap"><button class="btn" data-act="du-clear-ok">Xóa hết</button><button class="btn ghost" data-act="close">Huỷ</button></div>`),
    'du-clear-ok': () => {
      st = { ...Avatar.DEFAULT, name: st.name, unlocked: st.unlocked, accessories: [], top: -1, bottom: -1, dress: -1, outer: -1, shoes: -1, socks: -1, fringe: 0, blush: -1 };
      closeModal(); applyVars(); redrawChar(); redrawBody(); save(); toast('🧹 Đã về nhân vật trống');
    },
  });

  // ẩn/hiện từng lớp (chỉ để xem, không lưu)
  document.addEventListener('change', e => {
    if (e.target.dataset?.in !== 'du-layer') return;
    const k = e.target.value;
    hidden = e.target.checked ? hidden.filter(x => x !== k) : [...hidden, k];
    const g = document.querySelector(`#duChar [data-layer="${k}"]`); if (g) g.style.display = e.target.checked ? '' : 'none';
    e.target.closest('label')?.classList.toggle('on', e.target.checked);
  });

  // ---------- Chụp ảnh: ẩn giao diện, flash ----------
  function photoMode() {
    const ov = document.createElement('div');
    ov.className = 'du-photo'; ov.tabIndex = 0; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Ảnh chụp – bấm để quay lại');
    ov.innerHTML = `<div class="du-photo-frame">${Avatar.renderFull(st, 900)}</div><div class="du-flash"></div><p class="du-photo-hint">Bấm vào đâu đó hoặc Esc để quay lại</p>`;
    const close = () => { ov.remove(); document.removeEventListener('keydown', onKey); document.querySelector('[data-act="du-photo"]')?.focus(); };
    const onKey = e => { if (e.key === 'Escape' || e.key === 'Enter') close(); };
    ov.addEventListener('click', close); document.addEventListener('keydown', onKey);
    document.body.appendChild(ov); ov.focus();
  }

  // ---------- Lưu PNG bằng canvas ----------
  function exportPng() {
    const svg = Avatar.exportSvg(st, 600);
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement('canvas'); cv.width = 600; cv.height = 1230;
      cv.getContext('2d').drawImage(img, 0, 0, 600, 1230); URL.revokeObjectURL(url);
      cv.toBlob(b => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(b);
        a.download = (st.name || 'nhan-vat').replace(/[^\p{L}\p{N}]+/gu, '-') + '.png';
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        toast('⬇ Đã lưu ảnh PNG');
      }, 'image/png');
    };
    img.onerror = () => toast('Không tạo được ảnh, thử lại nhé');
    img.src = url;
  }

  // Esc: đóng bảng lớp
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && showLayers && document.getElementById('du')) A['du-layers'](); });
  // bấm chuột vào nút trong tủ đồ không kéo focus → trình duyệt không tự cuộn trang (bàn phím vẫn focus bình thường)
  document.addEventListener('mousedown', e => { if (e.target.closest('#du .du-subs button, #du .du-tabs button, #du .du-cell, #du .du-dot')) e.preventDefault(); });
  afterRender.studio = () => { tab = Math.min(tab, TABS.length - 1); syncPeek(); fitSubs(); };
})();
