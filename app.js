// Phúc Long Tea Lab – prototype SPA
(() => {
  const app = document.getElementById('app');
  const modal = document.getElementById('modal');

  // ---------- Helpers ----------
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => n.toLocaleString('vi-VN') + 'đ';
  const byId = (arr, id) => arr.find(x => x.id === id);
  const uid = () => Math.random().toString(36).slice(2, 9);

  function timeAgo(t) {
    const m = Math.floor((Date.now() - t) / 60000);
    if (m < 1) return 'vừa xong';
    if (m < 60) return m + ' phút';
    if (m < 1440) return Math.floor(m / 60) + ' giờ';
    return Math.floor(m / 1440) + ' ngày';
  }

  function toast(html, ms = 3200) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span>' + html + '</span>';
    const box = document.getElementById('toasts');
    box.appendChild(el);
    while (box.children.length > 3) box.firstElementChild.remove();
    setTimeout(() => el.remove(), ms);
  }

  function openModal(title, body) {
    modal.innerHTML = `<div class="modal-box" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-head"><h2>${title}</h2><button class="x" data-act="close" aria-label="Đóng">×</button></div>${body}</div>`;
    modal.hidden = false;
  }
  function closeModal() { modal.hidden = true; modal.innerHTML = ''; }
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const ch = s => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
    const [r1, g1, b1] = ch(pa), [r2, g2, b2] = ch(pb);
    const m = (x, y) => Math.round(x + (y - x) * t);
    return '#' + ((1 << 24) | (m(r1, r2) << 16) | (m(g1, g2) << 8) | m(b1, b2)).toString(16).slice(1);
  }

  // ---------- Recipe helpers ----------
  const flavorsOf = r => r.flavors || (r.flavor ? [r.flavor] : []);
  const CAFF = { 1: 'Nhẹ', 2: 'Vừa', 3: 'Đậm', 4: 'Đậm + 2 shot Espresso' };

  function recipePrice(r) {
    const base = byId(DATA.bases, r.base);
    let p = base ? base.price : 0;
    flavorsOf(r).forEach(f => p += byId(DATA.flavors, f)?.price || 0);
    (r.toppings || []).forEach(t => p += byId(DATA.toppings, t)?.price || 0);
    p += byId(DATA.sizes, r.size || 'M')?.add || 0;
    if (r.caffeine === 4) p += 12000;
    return p;
  }

  function recipeLine(r) {
    const parts = [byId(DATA.bases, r.base)?.name, ...flavorsOf(r).map(f => byId(DATA.flavors, f)?.name), ...(r.toppings || []).map(t => byId(DATA.toppings, t)?.name)];
    return parts.filter(Boolean).join(' · ');
  }
  const recipeLevels = r => `Ngọt ${r.sugar}% · Đá ${r.ice}% · Caffeine ${CAFF[r.caffeine] || 'Vừa'}`;

  let cupId = 0;
  function renderCup(r, cls = 'cup') {
    const base = byId(DATA.bases, r.base);
    const fl = flavorsOf(r).map(f => byId(DATA.flavors, f)).filter(Boolean);
    let color = base ? base.color : '#EFE9DC';
    fl.forEach(f => color = mix(color, f.color, 0.38));
    const empty = !base;
    const id = 'cup' + (++cupId);
    const ice = Math.round((r.ice ?? 0) / 25);
    const icePos = [[30, 40], [52, 36], [44, 52], [62, 48], [26, 58]];
    const tops = (r.toppings || []).map(t => byId(DATA.toppings, t)).filter(Boolean);
    let dots = '';
    tops.forEach((t, ti) => {
      for (let i = 0; i < 9; i++) {
        const x = 27 + i * 5.5 + (ti % 2) * 2.5, y = 124 - ti * 7 - (i % 2) * 3;
        dots += t.id === 'pudding' || t.id === 'nhadam' || t.id === 'thachdua' || t.id === 'suongsao'
          ? `<rect x="${x - 2.6}" y="${y - 2.6}" width="5.2" height="5.2" rx="1.2" fill="${t.color}" stroke="rgba(0,0,0,.18)" stroke-width=".6"/>`
          : `<circle cx="${x}" cy="${y}" r="2.8" fill="${t.color}"/>`;
      }
    });
    return `<svg class="${cls}" viewBox="0 0 100 140" aria-hidden="true">
      <defs><clipPath id="${id}"><path d="M15 32 L85 32 L78 132 L22 132Z"/></clipPath></defs>
      <rect x="10" y="20" width="80" height="10" rx="5" fill="#5E8C4A" stroke="#3B2A20" stroke-width="2"/>
      <path d="M14 30 L86 30 L78 134 L22 134Z" fill="${empty ? '#FBF3E6' : '#FFFBF4'}" stroke="#3B2A20" stroke-width="2.4" stroke-linejoin="round"/>
      <g clip-path="url(#${id})">
        ${empty ? '' : `<rect x="0" y="${38 + (100 - (r.ice ?? 50)) * 0.02}" width="100" height="100" fill="${color}"/>
        <rect x="0" y="38" width="100" height="6" fill="#fff" opacity=".18"/>
        ${icePos.slice(0, ice).map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="11" rx="2.5" fill="#fff" opacity=".45" transform="rotate(${x % 20 - 10} ${x + 6} ${y + 5})"/>`).join('')}
        ${dots}`}
      </g>
      <path d="M58 30 L62 6" stroke="#3B2A20" stroke-width="6" stroke-linecap="round"/><path d="M58 30 L62 6" stroke="#E2A94B" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="86" r="11" fill="#fff" opacity="${empty ? 0 : .85}"/>
      <path d="M50 79 q-6 5 0 14 q6-9 0-14Z" fill="#5E8C4A" opacity="${empty ? 0 : 1}"/>
    </svg>`;
  }

  // ---------- Users ----------
  const me = () => State.user;
  function userById(id) {
    if (id === 'me') { const u = me(); return u ? { ...u, id: 'me' } : { name: 'Bạn', handle: 'ban', avatar: {} }; }
    return byId(DATA.seedUsers, id) || { name: 'Ẩn danh', handle: 'an.danh', avatar: {} };
  }

  function updateNav(route) {
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === route));
    const u = me();
    document.getElementById('navAvatar').innerHTML = u ? Avatar.render(u.avatar, 28) : '👤';
  }

  // ---------- Router ----------
  const routes = { home: renderHome, tealab: renderLab, community: renderCommunity, challenge: renderChallenge, profile: renderProfile, hubs: renderHubs, onboard: renderOnboard };
  const NARROW = ['community', 'onboard'];
  const NAV_ALIAS = { store: 'hubs', challenge: 'home', studio: 'profile' };

  function render(keepScroll = false) {
    const y = window.scrollY;
    const [path] = (location.hash.slice(1) || 'home').split('?');
    let [route, param] = path.split('/');
    if (!me() && route !== 'onboard') route = 'onboard';
    if (!routes[route]) route = 'home';
    app.className = 'app page-' + route + (NARROW.includes(route) ? ' narrow' : '');
    document.body.dataset.route = route;
    app.innerHTML = routes[route](param);
    updateNav(NAV_ALIAS[route] || route);
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
    afterRender[route]?.(param);
  }
  const afterRender = {};
  window.addEventListener('hashchange', () => render());
  const go = h => { if (location.hash === '#' + h) render(); else location.hash = h; };

  // ---------- Onboarding (đồng ý NĐ 13/2023) ----------
  let onboardAvatar = { ...Avatar.REF };
  function renderOnboard() {
    return `<div class="onboard">
      <div class="poster poster-sm">${Scenes.forest(420)}<div class="poster-text"><span class="tag">Phúc Long Tea Lab</span><h1>Mỗi ly trà là một độc bản</h1><p>Tự phối trà theo gu riêng, tạo nhân vật của bạn và kể câu chuyện #TràĐộcBản cùng cộng đồng.</p></div></div>
      <div class="card stack">
        <div class="row"><div id="obAv">${Avatar.render(onboardAvatar, 64)}</div><div><b>Nhân vật tạm thời của bạn</b><br><button class="link" data-act="ob-random">🎲 Đổi ngẫu nhiên</button> <span class="muted small">· tùy chỉnh chi tiết sau</span></div></div>
        <label class="field"><span>Tên hiển thị</span><input class="input" id="obName" maxlength="30" placeholder="VD: Minh Anh" data-in="ob"></label>
        <div><b class="small">Điều khoản bảo mật</b>
          <div class="policy">Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, Phúc Long Tea Lab thu thập: công thức trà bạn tạo, lịch sử đặt món, lượt check-in Tea Passport và bài đăng cộng đồng – nhằm lưu "My Tea's Profile", tổng kết Tea Wrapped và gợi ý công thức. Bạn có thể rút lại sự đồng ý và xoá dữ liệu bất cứ lúc nào trong mục Hồ sơ. (Bản demo: dữ liệu chỉ lưu trong trình duyệt của bạn.)</div></div>
        <label class="check"><input type="checkbox" id="obConsent" data-in="ob"> <span>Tôi <b>đồng ý thu thập dữ liệu hành vi</b> để tạo Profile (bắt buộc).</span></label>
        <button class="btn block" id="obGo" data-act="ob-create" disabled>Tạo Profile</button>
      </div></div>`;
  }

  // ---------- Home ----------
  function topRecipes() {
    return State.posts.filter(p => p.recipe && !p.reported).sort((a, b) => b.likes - a.likes).slice(0, 10);
  }
  const ORN = side => `<svg class="orn" viewBox="0 0 60 14" aria-hidden="true">${side === 'l' ? '<path d="M2 7 H52 M44 2 L54 7 L44 12 M8 3 Q14 7 8 11" fill="none" stroke="currentColor" stroke-width="1.6"/>' : '<path d="M58 7 H8 M16 2 L6 7 L16 12 M52 3 Q46 7 52 11" fill="none" stroke="currentColor" stroke-width="1.6"/>'}</svg>`;
  const FLOWER = (x, y, s, r = 0) => `<svg class="hero-flower" style="left:${x}%;top:${y}%;width:${s}px;transform:rotate(${r}deg)" viewBox="-30 -30 60 60" aria-hidden="true">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="9" ry="20" cy="-14" fill="#FFFFFF" opacity=".95" transform="rotate(${a})"/>`).join('')}<circle r="6" fill="#F6C85F"/></svg>`;

  function renderHome() {
    const u = me();
    const best = DATA.drinks.filter(d => d.best);
    const hero = byId(DATA.drinks, 'tra-sua-pl');
    const h = new Date().getHours();
    const moodNow = h < 11 ? 'energy' : h < 14 ? 'healthy' : h < 18 ? 'focus' : h < 21 ? 'relax' : 'heal';
    const friends = window.Friends ? Friends.feed().slice(0, 6) : [];
    const streak = window.Streak ? Streak.current() : 0;
    const latest = State.posts.filter(p => !p.reported).sort((a, b) => b.time - a.time).slice(0, 2);
    const dest = DATA.hubs.filter(x => x.type === 'Destination');
    return `
      <section class="hero-photo hero-home bleed">
        <img src="./bia-trang-chu-doi-che.jpg" alt="Đồi chè xanh trong sương lúc hoàng hôn" fetchpriority="high">
        <div class="hero-home-text"><span class="eyebrow light">Phúc Long · since 1968</span><h2>Từ đồi chè<br><em>tới ly trà độc bản</em></h2></div>
      </section>
      <section class="hero-intro bleed">
        <div class="hero-intro-in">
          <div class="eyebrow">Phúc Long · Trà Độc Bản</div>
          <h1 class="bb-title">${ORN('l')}<span>Chào <em>bạn</em> ${esc(u.name)}</span>${ORN('r')}</h1>
          <p>Hôm nay bạn đang cảm thấy thế nào? Chọn mood – Phúc Long gợi ý ly trà hợp với bạn.</p>
          <div class="row wrap"><a class="btn" href="#mood/${moodNow}">▶ Mood lúc này</a><a class="btn ghost" href="#menu">Xem menu</a></div>
        </div>
        <div class="hero-intro-cup">${Cups.render(hero, 200, 'pl-cup')}</div>
      </section>

      <section class="bb-board">
        <div class="board-side">Phúc Long · Mood Mix</div>
        <div class="board-main">
          <div class="section"><h2>Mix theo tâm trạng</h2><a class="link small" href="#mood">Tất cả mood →</a></div>
          <div class="mood-row">${DATA.moods.map(m => `<a class="mood-card" href="#mood/${m.id}" style="--m1:${m.colors[0]};--m2:${m.colors[1]}"><span class="mood-emoji">${m.emoji}</span><b>${m.name}</b><small>${DATA.drinks.filter(d => d.moods.includes(m.id)).length} món</small><span class="play">▶</span></a>`).join('')}</div>
        </div>
      </section>

      <section class="bb-board">
        <div class="board-side">Best seller</div>
        <div class="board-main">
          <div class="section"><h2>Được yêu thích nhất</h2><a class="link small" href="#menu">Menu đầy đủ →</a></div>
          <div class="cup-row">${best.map(d => `<a class="cup-item" href="#menu?${d.id}">${Cups.render(d, 84)}<b>${esc(d.name)}</b><span>${money(d.l)}</span></a>`).join('')}</div>
        </div>
      </section>

      <div class="grid grid-2" style="align-items:start;margin-top:20px">
        <section class="card">
          <div class="section" style="margin-top:0"><h2>Bạn bè đang uống</h2><a class="link small" href="#friends">Xem tất cả →</a></div>
          <div class="streak-pill">🔥 Chuỗi Phúc Long: <b>${streak} ngày</b> <a class="btn sm" href="#friends">📸 Chụp check-in</a></div>
          <div class="friend-strip">${friends.map(f => `<a href="#friends" class="friend-snap">${f.photo ? `<img src="${f.photo}" alt="">` : Friends.snapArt(f)}<span class="snap-who">${Avatar.render(userById(f.user).avatar, 26)}</span><small>${esc(f.drinkName)}</small></a>`).join('') || '<div class="empty">Kết bạn để xem bạn bè uống gì nhé!</div>'}</div>
        </section>
        <section class="card">
          <div class="section" style="margin-top:0"><h2>Tự phối ly của riêng bạn</h2></div>
          <p class="muted">Chọn cốt trà, hương vị, topping – đặt tên cho ly độc bản và nhận Thẻ Độc Bản.</p>
          <div class="row wrap"><a class="btn" href="#tealab">🧪 Vào Tea Lab</a><a class="btn ghost" href="#challenge">🏆 Thử thách #TràĐộcBản</a></div>
          <div class="rank-mini">${topRecipes().slice(0, 3).map((p, i) => `<div class="rank"><span class="rank-no top">${i + 1}</span>${renderCup(p.recipe, 'cup-mini')}<div class="rank-body"><b>${esc(p.recipe.name)}</b><span class="muted small">@${esc(userById(p.user).handle)} · ♥ ${p.likes}</span></div><button class="link small" data-act="order-from" data-id="${p.id}">Đặt</button></div>`).join('')}</div>
        </section>
      </div>

      <div class="section"><h2>Cửa hàng độc bản</h2><a class="link small" href="#hubs">Tea Passport →</a></div>
      <div class="grid grid-3">${dest.map(x => `<a class="card store-card" href="#store/${x.id}"><div class="store-thumb"><img src="${DATA.storePhotos[x.id][0]}" alt="${esc(x.name)}" loading="lazy"></div><div class="store-info"><span class="eyebrow">${esc(x.city)}</span><b>${esc(x.name)}</b><small>Tham quan cửa hàng →</small></div></a>`).join('')}</div>

      <div class="section"><h2>Mới trên cộng đồng</h2><a class="link small" href="#community">Tất cả →</a></div>
      <div class="card" style="padding:0 16px">${latest.map(p => renderPost(p, { compact: true })).join('')}</div>`;
  }

  // ---------- Tea Lab: Custom Tea 6 bước ----------
  const STEP_TITLES = ['Chọn cốt trà', 'Chọn hương vị', 'Chọn topping', 'Độ ngọt · đá · caffeine', 'Đặt tên công thức', 'Lưu & đặt món'];
  const freshLab = () => ({ step: 0, base: null, flavors: [], toppings: [], size: 'M', sugar: 50, ice: 70, caffeine: 2, name: '', story: '', store: DATA.stores[3], save: true, done: null });
  let lab = freshLab();

  function badWith(id, sel) {
    return DATA.badCombos.find(c => (c.a === id && sel.includes(c.b)) || (c.b === id && sel.includes(c.a)));
  }

  function labCanNext() {
    if (lab.step === 0) return !!lab.base;
    if (lab.step === 1) return lab.flavors.length > 0;
    if (lab.step === 4) return lab.name.trim().length > 0;
    return true;
  }

  function labPreviewHtml() {
    return `${renderCup(lab)}
      <h3 style="margin-top:8px">${esc(lab.name || 'Ly trà chưa đặt tên')}</h3>
      <div class="muted small">${esc(recipeLine(lab) || 'Bắt đầu bằng việc chọn cốt trà')}</div>
      ${lab.step >= 3 ? `<div class="small">${esc(recipeLevels(lab))} · Size ${lab.size}</div>` : ''}
      <div class="price" style="margin-top:8px">${money(recipePrice(lab))}</div>`;
  }

  function labStepHtml() {
    const s = lab.step;
    if (s === 0) return `<div class="opts">${DATA.bases.map(b => `
      <button class="opt ${lab.base === b.id ? 'on' : ''}" data-act="lab-base" data-v="${b.id}">
        <span class="sw" style="background:${b.color}"></span><b>${b.name}</b><small>${b.desc}</small><small>${money(b.price)}</small></button>`).join('')}</div>`;
    if (s === 1) {
      return `<p class="muted small">Chọn tối đa 2 hương vị. Những tổ hợp khó uống đã được ẩn để giữ chất lượng.</p>
      <div class="opts">${DATA.flavors.map(f => {
        const bad = badWith(f.id, [lab.base, ...lab.flavors.filter(x => x !== f.id)]);
        const on = lab.flavors.includes(f.id);
        const full = !on && lab.flavors.length >= 2;
        return `<button class="opt ${on ? 'on' : ''}" data-act="lab-flavor" data-v="${f.id}" ${bad || full ? 'disabled' : ''}>
          <span style="font-size:1.4rem">${f.emoji}</span><b>${f.name}</b><small>+${money(f.price)}</small>${bad ? `<span class="warn">${esc(bad.why)}</span>` : ''}</button>`;
      }).join('')}</div>`;
    }
    if (s === 2) return `<p class="muted small">Tối đa ${DATA.maxToppings} topping – để topping không lấn át cốt trà. Có thể bỏ qua.</p>
      <div class="opts">${DATA.toppings.map(t => {
        const on = lab.toppings.includes(t.id);
        const full = !on && lab.toppings.length >= DATA.maxToppings;
        return `<button class="opt ${on ? 'on' : ''}" data-act="lab-top" data-v="${t.id}" ${full ? 'disabled' : ''}>
          <span class="sw" style="background:${t.color}"></span><b>${t.name}</b><small>+${money(t.price)}</small></button>`;
      }).join('')}</div>`;
    if (s === 3) return `
      <div class="zone-label">Size</div>
      <div class="row wrap">${DATA.sizes.map(z => `<button class="chip ${lab.size === z.id ? 'on' : ''}" data-act="lab-size" data-v="${z.id}">${z.name}${z.add ? ' +' + money(z.add) : ''}</button>`).join('')}</div>
      <div class="slider-row"><label for="sSugar">Độ ngọt</label><input id="sSugar" type="range" min="0" max="100" step="10" value="${lab.sugar}" data-in="lab-sugar"><output id="oSugar">${lab.sugar}%</output></div>
      <div class="slider-row"><label for="sIce">Đá</label><input id="sIce" type="range" min="0" max="100" step="10" value="${lab.ice}" data-in="lab-ice"><output id="oIce">${lab.ice}%</output></div>
      <div class="zone-label">Caffeine</div>
      <div class="row wrap">${[1, 2, 3, 4].map(c => `<button class="chip ${lab.caffeine === c ? 'on' : ''}" data-act="lab-caff" data-v="${c}">${CAFF[c]}${c === 4 ? ' +' + money(12000) : ''}</button>`).join('')}</div>`;
    if (s === 4) return `
      <label class="field"><span>Tên ly trà của bạn</span>
        <div class="row"><input class="input" id="labName" maxlength="30" value="${esc(lab.name)}" placeholder="VD: Deadline Không Sợ" data-in="lab-name"><button class="btn soft sm" data-act="lab-suggest-name" title="Gợi ý tên">🎲</button></div></label>
      <p class="muted small">Tên này sẽ được in trên tem nhãn “định danh cá nhân” và gọi khi trả món.</p>
      <label class="field" style="margin-top:12px"><span>Câu chuyện độc bản (tuỳ chọn)</span>
        <textarea class="input" rows="3" maxlength="200" data-in="lab-story" placeholder="Ly trà này nói gì về bạn?">${esc(lab.story)}</textarea></label>`;
    const peak = [11, 12, 17, 18].includes(new Date().getHours());
    return `
      <div class="card" style="box-shadow:none;background:var(--cream)">
        <b>${esc(lab.name)}</b><div class="small">${esc(recipeLine(lab))}</div><div class="small muted">${esc(recipeLevels(lab))} · Size ${lab.size}</div>
        ${lab.story ? `<p class="small" style="margin-top:6px">“${esc(lab.story)}”</p>` : ''}
      </div>
      <label class="field" style="margin-top:12px"><span>Nhận tại cửa hàng Tea Lab</span>
        <select class="input" data-in="lab-store">${DATA.stores.map(s => `<option ${s === lab.store ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
      ${peak ? `<div class="notice" style="margin-top:10px">⏰ Đang giờ cao điểm – Custom Tea chỉ nhận qua app, thời gian chờ có thể lâu hơn. Gợi ý: đặt trước để lấy món đúng giờ.</div>` : ''}
      <label class="check" style="margin-top:12px"><input type="checkbox" ${lab.save ? 'checked' : ''} data-in="lab-save"> Lưu vào <b>My Tea's Profile</b></label>
      <p class="muted small" style="margin-top:8px">Bạn chọn thành phần – nhân viên pha chế theo định lượng chuẩn để giữ chất lượng.</p>`;
  }

  function renderLab() {
    if (lab.done) return renderLabDone();
    const s = lab.step;
    return `<section class="hero-photo hero-lab bleed"><img src="./bia-tealab.jpg" alt="Hai ly trà trái cây Phúc Long trên nền đồi chè">
        <div class="hero-lab-text"><span class="eyebrow light">Phúc Long Tea Lab</span><h1>Tự phối ly trà <em>độc bản</em></h1><p>Từ búp chè trên đồi tới ly trà mang tên bạn – 6 bước, một câu chuyện.</p></div></section>
      <div class="section" style="margin-top:0"><div><span class="tag">Bước ${s + 1}/6</span><h1 style="margin-top:6px">${STEP_TITLES[s]}</h1></div>
        <button class="link small" data-act="lab-reset">Làm lại</button></div>
      ${s === 0 ? `<div class="zone-label">Gợi ý theo khẩu vị</div><div class="presets">${DATA.presets.map((p, i) => `<button class="chip" data-act="lab-preset" data-i="${i}">${esc(p.name)}</button>`).join('')}</div><div style="height:12px"></div>` : ''}
      <div class="lab">
        <div class="card lab-preview" id="labPreview">${labPreviewHtml()}</div>
        <div class="card">
          <div class="steps">${STEP_TITLES.map((_, i) => `<i class="${i <= s ? 'done' : ''}"></i>`).join('')}</div>
          <div id="labStep">${labStepHtml()}</div>
          <div class="wizard-nav">
            <button class="btn ghost" data-act="lab-back" ${s === 0 ? 'disabled' : ''}>← Quay lại</button>
            ${s < 5 ? `<button class="btn" id="labNext" data-act="lab-next" ${labCanNext() ? '' : 'disabled'}>Tiếp →</button>`
              : `<div class="row"><button class="btn ghost" data-act="lab-save-only">Chỉ lưu</button><button class="btn" data-act="lab-order">Đặt món · ${money(recipePrice(lab))}</button></div>`}
          </div>
        </div>
      </div>`;
  }

  function renderLabDone() {
    const o = lab.done, r = o.recipe, u = me();
    return `<div class="grid grid-2" style="align-items:start">
      <div class="stack">
        <div class="docban">
          <div class="row" style="justify-content:space-between;align-items:flex-start">
            <div><div class="small" style="opacity:.8">THẺ ĐỘC BẢN · #${o.code}</div><div class="name">${esc(r.name)}</div><div class="meta">${esc(recipeLine(r))}</div><div class="meta">${esc(recipeLevels(r))}</div></div>
            ${renderCup(r)}
          </div>
          <div class="row" style="margin-top:14px">${Avatar.render(u.avatar, 44)}<div><b>${esc(u.name)}</b><div class="meta">Sáng tạo ngày ${new Date(o.time).toLocaleDateString('vi-VN')}</div></div></div>
        </div>
        <div class="row wrap">
          <button class="btn" data-act="share-recipe" data-rid="${r.id}">💬 Chia sẻ lên Cộng đồng</button>
          <button class="btn gold" data-act="contest-recipe" data-rid="${r.id}">🏆 Gửi dự thi #TràĐộcBản</button>
          <button class="btn ghost" data-act="lab-new">Phối ly khác</button>
        </div>
      </div>
      <div class="stack">
        ${o.ordered ? `<div class="card"><h3>🧾 Đơn của bạn</h3>
          <div class="label-sticker"><div>PHÚC LONG TEA LAB · ${esc(o.store)}</div><b>#${o.code} · ${esc(r.name)}</b><div>KH: ${esc(u.name)}</div><div>${esc(recipeLine(r))}</div><div>${esc(recipeLevels(r))} · Size ${r.size}</div><div>${money(o.price)}</div></div>
          <p class="small muted" style="margin-top:8px">Tem nhãn “định danh cá nhân”: nhân viên sẽ gọi tên món <b>“${esc(r.name)}”</b> và app gửi thông báo khi ly hoàn thành.</p>
          <div class="row" id="orderStatus"><span class="tag ${o.ready ? '' : 'gold'}">${o.ready ? '✅ Đã sẵn sàng' : '⏳ Đang pha chế…'}</span></div></div>`
        : `<div class="card"><h3>✅ Đã lưu vào My Tea's Profile</h3><p class="muted small">Bạn có thể đặt lại ly này bất cứ lúc nào trong Hồ sơ.</p></div>`}
      </div></div>`;
  }

  function updateLabLive() {
    const p = document.getElementById('labPreview');
    if (p) p.innerHTML = labPreviewHtml();
    const n = document.getElementById('labNext');
    if (n) n.disabled = !labCanNext();
  }

  function saveLabRecipe() {
    const r = { id: uid(), name: lab.name.trim(), base: lab.base, flavors: [...lab.flavors], toppings: [...lab.toppings], size: lab.size, sugar: lab.sugar, ice: lab.ice, caffeine: lab.caffeine, story: lab.story, time: Date.now() };
    if (!lab.save) r.temp = true;
    State.recipes = [r, ...State.recipes];
    return r;
  }

  function loadIntoLab(r) {
    lab = { ...freshLab(), base: r.base, flavors: flavorsOf(r), toppings: [...(r.toppings || [])], size: r.size || 'M', sugar: r.sugar ?? 50, ice: r.ice ?? 70, caffeine: r.caffeine ?? 2, name: r.name || '', step: 5 };
  }

  // ---------- Community (kiểu Threads) ----------
  let feedTab = 'all', feedTag = '';
  const openReplies = new Set();
  const contestVotes = p => Math.round((p.seedVotes ?? p.likes * 0.4)) + (State.votes.includes(p.id) ? 1 : 0);

  function linkify(text) {
    return esc(text).replace(/#([\p{L}\p{N}_]+)/gu, '<span class="ht" data-act="tag" data-tag="$1">#$1</span>');
  }

  function renderAttach(p) {
    if (p.recipe) {
      const r = p.recipe;
      return `<div class="attach">${renderCup(r)}<div class="attach-body"><span class="tag">Công thức</span><b>${esc(r.name)}</b>${esc(recipeLine(r))}<div class="muted">${esc(recipeLevels(r))} · ${money(recipePrice(r))}</div></div>
        <button class="btn sm" data-act="order-from" data-id="${p.id}">Đặt ly này</button></div>`;
    }
    if (p.review) {
      const v = p.review;
      return `<div class="attach"><span style="font-size:1.8rem">🧋</span><div class="attach-body"><span class="tag gold">Review</span><b>${esc(v.item)}</b><span class="stars">${'★'.repeat(v.stars)}${'☆'.repeat(5 - v.stars)}</span><div class="muted">📍 ${esc(v.store)}</div></div></div>`;
    }
    return '';
  }

  function renderPost(p, opt = {}) {
    if (p.reported) return `<div class="hidden-post">Bạn đã báo cáo bài viết này – đội kiểm duyệt sẽ xem xét. <button class="link" data-act="unreport" data-id="${p.id}">Hoàn tác</button></div>`;
    const a = userById(p.user);
    const open = openReplies.has(p.id);
    const hasThread = p.replies.length > 0 && open;
    return `<article class="post" id="post-${p.id}">
      ${p.reposted && opt.showRepost ? `<div class="repost-by">🔁 Bạn đã đăng lại</div>` : ''}
      <div class="post-rail">${Avatar.render(a.avatar, 40)}${hasThread ? '<span class="thread-line"></span>' : ''}</div>
      <div>
        <div class="post-head"><b>${esc(a.handle)}</b>${p.contest ? '<span class="tag gold">#TràĐộcBản</span>' : ''}<span class="time">${timeAgo(p.time)}</span>
          ${opt.compact ? '' : `<button class="more" data-act="post-more" data-id="${p.id}" aria-label="Tuỳ chọn">•••</button>`}</div>
        <div class="post-text">${linkify(p.text)}</div>
        ${p.image ? `<img class="post-img" src="${p.image}" alt="Ảnh trong bài đăng">` : ''}
        ${renderAttach(p)}
        ${opt.compact ? '' : `<div class="actions">
          <button class="${p.liked ? 'on-like' : ''}" data-act="like" data-id="${p.id}" aria-label="Thích">${p.liked ? '♥' : '♡'} ${p.likes}</button>
          <button data-act="toggle-replies" data-id="${p.id}" aria-label="Trả lời">💬 ${p.replies.length}</button>
          <button class="${p.reposted ? 'on-repost' : ''}" data-act="repost" data-id="${p.id}" aria-label="Đăng lại">🔁 ${p.reposts}</button>
          <button data-act="share" data-id="${p.id}" aria-label="Chia sẻ">↗</button>
        </div>
        ${open ? `<div class="replies">${p.replies.map(r => { const ra = userById(r.user); return `<div class="reply">${Avatar.render(ra.avatar, 30)}<div><b>${esc(ra.handle)}</b> <span class="muted small">${timeAgo(r.time)}</span><p>${linkify(r.text)}</p></div></div>`; }).join('')}
          <form class="reply-form" data-reply="${p.id}"><input maxlength="300" placeholder="Trả lời @${esc(a.handle)}…" aria-label="Nội dung trả lời"><button class="btn sm">Gửi</button></form></div>` : ''}`}
      </div></article>`;
  }

  function feedPosts() {
    let ps = State.posts.slice().sort((a, b) => b.time - a.time);
    if (feedTab === 'recipe') ps = ps.filter(p => p.type === 'recipe');
    if (feedTab === 'review') ps = ps.filter(p => p.type === 'review');
    if (feedTab === 'contest') ps = ps.filter(p => p.contest);
    if (feedTab === 'mine') ps = ps.filter(p => p.user === 'me' || p.reposted);
    if (feedTag) ps = ps.filter(p => p.text.toLowerCase().includes('#' + feedTag.toLowerCase()));
    return ps;
  }

  function renderCommunity() {
    const u = me();
    const tabs = [['all', 'Dành cho bạn'], ['recipe', 'Công thức'], ['review', 'Review'], ['contest', '#TràĐộcBản'], ['mine', 'Của tôi']];
    const ps = feedPosts();
    return `<section class="hero-photo hero-community bleed"><img src="./bia-cong-dong.jpg" alt="Tranh minh hoạ đồi chè ruộng bậc thang, đàn chim bay và người hái chè">
        <div class="hero-lab-text"><span class="eyebrow light">Chia sẻ công thức & review</span><h1>Cộng đồng <em>Tea Lab</em></h1></div></section>
      <div class="feed-wrap">
      <div class="tabs">${tabs.map(([k, n]) => `<button class="${feedTab === k ? 'on' : ''}" data-act="feed-tab" data-v="${k}">${n}</button>`).join('')}</div>
      ${feedTag ? `<div class="row" style="padding:10px 0"><span class="tag">#${esc(feedTag)}</span><button class="link small" data-act="tag-clear">Bỏ lọc ×</button></div>` : ''}
      <div class="composer-trigger" data-act="compose">${Avatar.render(u.avatar, 40)}<span class="ph">Chia sẻ công thức hoặc review món…</span><button class="btn sm">Đăng</button></div>
      ${ps.length ? ps.map(p => renderPost(p, { showRepost: feedTab === 'mine' })).join('') : '<div class="empty">Chưa có bài viết nào ở đây.</div>'}
    </div>`;
  }

  // Composer
  let draft = null;
  function newDraft(over = {}) {
    draft = { type: 'free', text: '', recipeId: State.recipes[0]?.id || '', item: DATA.menu[0], store: DATA.stores[0], stars: 5, image: null, contest: false, rights: false, age: false, ...over };
  }

  function composerHtml() {
    const u = me(), d = draft, recipes = State.recipes;
    const over = d.text.length > 500;
    let extra = '';
    if (d.type === 'recipe') {
      extra = recipes.length
        ? `<label class="field"><span>Đính kèm công thức của bạn</span><select class="input" data-in="d-recipe">${recipes.map(r => `<option value="${r.id}" ${r.id === d.recipeId ? 'selected' : ''}>${esc(r.name)} – ${esc(recipeLine(r))}</option>`).join('')}</select></label>
           <label class="check"><input type="checkbox" data-in="d-contest" ${d.contest ? 'checked' : ''}> Gửi dự thi <b>#TràĐộcBản</b></label>
           ${d.contest ? `<div class="notice stack" style="margin-top:6px">
             <label class="check"><input type="checkbox" data-in="d-rights" ${d.rights ? 'checked' : ''}> Tôi đồng ý chuyển giao quyền sử dụng thương mại miễn phí công thức này cho Phúc Long.</label>
             <label class="check"><input type="checkbox" data-in="d-age" ${d.age ? 'checked' : ''}> Tôi từ 18 tuổi trở lên hoặc có người giám hộ đồng ý.</label></div>` : ''}`
        : `<div class="notice">Bạn chưa có công thức nào. <a class="link" href="#tealab" data-act="close">Phối ly đầu tiên tại Tea Lab →</a></div>`;
    } else if (d.type === 'review') {
      extra = `<div class="grid" style="grid-template-columns:1fr 1fr">
        <label class="field"><span>Món</span><select class="input" data-in="d-item">${DATA.menu.map(m => `<option ${m === d.item ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select></label>
        <label class="field"><span>Cửa hàng</span><select class="input" data-in="d-store">${DATA.stores.map(m => `<option ${m === d.store ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select></label></div>
        <div class="row star-pick" role="radiogroup" aria-label="Số sao">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="${n <= d.stars ? 'on' : ''}" data-act="d-star" data-v="${n}" aria-label="${n} sao">★</button>`).join('')}</div>`;
    }
    const canPost = d.text.trim() && !over && (d.type !== 'recipe' || (recipes.length && (!d.contest || (d.rights && d.age))));
    return `<div class="composer stack" id="composer">
      <div class="row wrap">${[['free', '✍️ Tự do'], ['recipe', '🧪 Công thức'], ['review', '⭐ Review']].map(([k, n]) => `<button class="chip ${d.type === k ? 'on' : ''}" data-act="d-type" data-v="${k}">${n}</button>`).join('')}</div>
      <div class="row" style="align-items:flex-start">${Avatar.render(u.avatar, 40)}<div style="flex:1"><b>${esc(u.handle)}</b>
        <textarea id="dText" data-in="d-text" placeholder="${d.type === 'review' ? 'Món này thế nào? Không gian, phục vụ ra sao…' : d.type === 'recipe' ? 'Kể câu chuyện độc bản đằng sau ly trà của bạn…' : 'Có gì mới?'}">${esc(d.text)}</textarea>
        ${d.image ? `<div class="img-preview"><img src="${d.image}" alt="Ảnh đính kèm"><button data-act="d-img-remove" aria-label="Xoá ảnh">×</button></div>` : ''}</div></div>
      ${extra}
      <div class="row"><label class="btn sm soft" style="cursor:pointer">🖼️ Ảnh<input type="file" accept="image/*" class="sr" data-in="d-img"></label>
        <span class="spacer"></span><span class="counter ${over ? 'over' : ''}" id="dCount">${d.text.length}/500</span>
        <button class="btn" id="dPost" data-act="d-post" ${canPost ? '' : 'disabled'}>Đăng</button></div>
      <p class="muted small">Quy tắc cộng đồng: tôn trọng, không kỳ thị hay quấy rối. Bài vi phạm sẽ bị gỡ.</p>
    </div>`;
  }
  const openComposer = () => openModal('Bài viết mới', composerHtml());
  const refreshComposer = () => { const c = document.getElementById('composer'); if (c) c.outerHTML = composerHtml(); };

  function resizeImage(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const k = Math.min(1, 800 / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL('image/jpeg', 0.75));
        };
        img.onerror = rej;
        img.src = fr.result;
      };
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  function publishDraft() {
    const d = draft;
    const low = d.text.toLowerCase();
    const bad = DATA.bannedWords.find(w => low.includes(w));
    if (bad) { toast('🚫 Bài viết chứa từ ngữ không phù hợp với quy tắc cộng đồng.'); return; }
    const post = { id: uid(), user: 'me', time: Date.now(), type: d.type, text: d.text.trim(), likes: 0, reposts: 0, replies: [], liked: false, reposted: false, reported: false, mine: true, image: d.image };
    if (d.type === 'recipe') {
      const r = byId(State.recipes, d.recipeId);
      post.recipe = { ...r };
      if (d.contest) { post.contest = true; post.seedVotes = 0; if (!/#TràĐộcBản/i.test(post.text)) post.text += ' #TràĐộcBản'; }
    }
    if (d.type === 'review') post.review = { item: d.item, store: d.store, stars: d.stars };
    const wasLocked = !Avatar.isUnlocked('contest');
    if (!Store.set('posts', [post, ...State.posts])) { toast('⚠️ Ảnh quá lớn để lưu trong bản demo – thử ảnh khác.'); return; }
    closeModal();
    toast('✅ Đã đăng bài lên Cộng đồng');
    if (post.contest && wasLocked) (Avatar.grant('acc:9'), toast('🎉 Mở khóa <b>Vòng bạc</b> trong tủ đồ!', 4500));
    feedTab = 'all'; feedTag = '';
    go('community');
  }

  function updatePost(id, fn) {
    State.posts = State.posts.map(p => p.id === id ? fn({ ...p }) : p);
  }

  // ---------- Challenge #TràĐộcBản ----------
  function renderChallenge() {
    const entries = State.posts.filter(p => p.contest && !p.reported).map(p => ({ p, v: contestVotes(p) })).sort((a, b) => b.v - a.v);
    const maxV = Math.max(1, ...entries.map(e => e.v));
    const left = DATA.maxVotes - State.votes.length;
    return `<section class="poster poster-night">${Scenes.nightField(460)}<div class="poster-text"><span class="tag">Thử thách cộng đồng</span><h1>#TràĐộcBản – Kể câu chuyện độc bản của bạn</h1>
        <p>Phối ly trà riêng, kể câu chuyện về màu sắc, phong cách, lối sống của bạn. Câu chuyện truyền cảm hứng nhất sẽ trở thành ly trà giới hạn mang tên bạn.</p>
        <button class="btn gold" data-act="contest-new">Gửi bài dự thi</button></div></section>
      <div class="section"><h2>Cách tham gia</h2></div>
      <div class="steps4"><div>Phối ly trà riêng tại Tea Lab hoặc app, nhận <b>Thẻ Độc Bản</b>.</div><div>Quay video 30–60 giây / viết câu chuyện về “độc bản” của bạn.</div><div>Đăng kèm <b>#TràĐộcBản</b> trên Cộng đồng hoặc TikTok, gắn Phúc Long.</div><div>Cộng đồng bình chọn trong app; hội đồng chấm điểm.</div></div>

      <div class="section"><h2>Bình chọn</h2><span class="tag ${left ? '' : 'red'}">Còn ${left}/${DATA.maxVotes} phiếu</span></div>
      <p class="muted small">Chỉ tài khoản app mới được bình chọn. Phiếu đầu tiên tặng bạn voucher giảm 25% (tối đa 15.000đ).</p>
      <div class="grid grid-2">${entries.map(({ p, v }) => {
        const a = userById(p.user), voted = State.votes.includes(p.id);
        return `<div class="card"><div class="row">${Avatar.render(a.avatar, 40)}<div style="flex:1"><b>${esc(p.recipe?.name || 'Bài dự thi')}</b><div class="muted small">@${esc(a.handle)}</div></div>${p.recipe ? renderCup(p.recipe, 'cup-mini" style="width:40px') : ''}</div>
          <p class="small" style="margin:10px 0">${linkify(p.text.length > 140 ? p.text.slice(0, 140) + '…' : p.text)}</p>
          <div class="row"><b>${v}</b><span class="muted small">phiếu</span><span class="spacer"></span>
          ${p.user === 'me' ? '<span class="tag">Bài của bạn</span>' : `<button class="btn sm ${voted ? 'soft' : ''}" data-act="vote" data-id="${p.id}" ${!voted && !left ? 'disabled' : ''}>${voted ? '✓ Đã bình chọn' : 'Bình chọn'}</button>`}</div>
          <div class="vote-bar"><i style="width:${(v / maxV) * 100}%"></i></div></div>`;
      }).join('')}</div>

      <div class="section"><h2>Cơ cấu giải thưởng</h2></div>
      <div class="grid grid-2">${DATA.prizes.map(z => `<div class="card prize"><h3>🏅 ${z.name}</h3><div class="muted small">${z.rule}</div><p class="small" style="margin-top:6px">${z.reward}</p></div>`).join('')}</div>
      <div class="card" style="margin-top:16px"><h3>Nguyên tắc chân thành & an toàn</h3><ul class="small">
        <li>Tự nguyện hoàn toàn – không ai bị yêu cầu tiết lộ điều không muốn kể.</li>
        <li>Kiểm duyệt: gỡ bình luận kỳ thị, quấy rối theo quy tắc ứng xử.</li>
        <li>Người nhận giải từ 18 tuổi trở lên hoặc có người giám hộ đồng ý.</li>
        <li>Người tham gia đồng ý chuyển giao quyền sử dụng thương mại miễn phí công thức cho Phúc Long.</li></ul></div>`;
  }

  // ---------- Profile ----------
  function renderProfile() {
    const u = me();
    const recipes = State.recipes.filter(r => !r.temp);
    const myPosts = State.posts.filter(p => p.user === 'me');
    const vouchers = State.vouchers, bookings = State.bookings, pre = State.preorders;
    return `<div class="card"><div class="profile-head">${Avatar.render(u.avatar, 96)}<div style="flex:1;min-width:0"><h1 style="margin:0">${esc(u.name)}</h1><div class="muted">@${esc(u.handle)}</div>
        <div class="row wrap" style="margin-top:8px"><a class="btn sm soft" href="#studio">🧑‍🎨 Sửa nhân vật</a><button class="btn sm gold" data-act="wrapped">🎁 Tea Wrapped</button></div></div></div>
      <div class="stats"><div><b>${State.orders.length}</b><small>Ly đã đặt</small></div><div><b>${recipes.length}</b><small>Công thức</small></div><div><b>${myPosts.length}</b><small>Bài đăng</small></div><div><b>${State.stamps.length}/3</b><small>Dấu mộc</small></div></div></div>

      <div class="grid grid-2" style="align-items:start;margin-top:12px">
        <div>
          <div class="section"><h2>🍵 My Tea's Profile</h2><a class="link small" href="#tealab">+ Phối mới</a></div>
          <div class="card">${recipes.length ? recipes.map(r => `<div class="recipe-item" style="padding:8px 0;border-bottom:1px solid var(--line)">${renderCup(r)}<div style="flex:1;min-width:0"><b>${esc(r.name)}</b><div class="muted small">${esc(recipeLine(r))}</div><div class="small">${money(recipePrice(r))}</div></div>
              <div class="row" style="gap:4px;flex-direction:column;align-items:flex-end"><button class="btn sm" data-act="reorder" data-rid="${r.id}">Đặt lại</button><button class="link small" data-act="share-recipe" data-rid="${r.id}">Chia sẻ</button><button class="link small" style="color:var(--danger)" data-act="del-recipe" data-rid="${r.id}">Xoá</button></div></div>`).join('')
            : '<div class="empty">Chưa có công thức. <a class="link" href="#tealab">Phối ly đầu tiên →</a></div>'}</div>

          <div class="section"><h2>💬 Bài đăng của tôi</h2></div>
          <div class="card" style="padding:0 16px">${myPosts.length ? myPosts.map(p => renderPost(p)).join('') : '<div class="empty">Chưa có bài đăng.</div>'}</div>
        </div>
        <div>
          <div class="section"><h2>💳 Thẻ thành viên</h2></div>
          <div class="member-card"><div><div class="small" style="opacity:.75">PHÚC LONG · TEA PASS</div><b style="font-size:1.1rem">${esc(u.name)}</b><div class="small" style="opacity:.75">Thẻ Độc Bản · ${recipes.length} công thức</div></div>${Avatar.render(u.avatar, 56)}</div>

          <div class="section"><h2>🎟️ Voucher</h2></div>
          ${vouchers.length ? vouchers.map(v => `<div class="voucher"><div><b>${esc(v.title)}</b><div class="muted small">${esc(v.desc)}</div></div><code>${esc(v.code)}</code></div>`).join('<div style="height:8px"></div>') : '<div class="card empty">Bình chọn #TràĐộcBản để nhận voucher 25%.</div>'}

          <div class="section"><h2>📅 Đặt chỗ & pre-order</h2></div>
          <div class="card small">${bookings.length || pre.length ? [
            ...bookings.map(b => `<div>🪑 Focus Zone · ghế <b>${esc(b.seat)}</b> · ${esc(b.date)} · ${esc(b.slot)}</div>`),
            ...pre.map(p => `<div>🏺 ${esc(p.name)} · số <b>#${String(p.no).padStart(4, '0')}</b></div>`)].join('')
            : '<span class="muted">Chưa có. Xem mục <a class="link" href="#hubs">Hub</a>.</span>'}</div>

          <div class="section"><h2>🔐 Quyền riêng tư</h2></div>
          <div class="card small"><p>Bạn đã đồng ý thu thập dữ liệu hành vi theo NĐ 13/2023/NĐ-CP ngày ${new Date(u.consentAt).toLocaleDateString('vi-VN')}.</p>
            <button class="btn sm ghost" data-act="withdraw">Rút lại đồng ý & xoá dữ liệu demo</button></div>
        </div>
      </div>`;
  }

  // ---------- Tea Wrapped ----------
  let wrapTimer = null, wrapIdx = 0;
  function wrappedSlides() {
    const u = me(), rs = State.recipes, orders = State.orders;
    const count = (arr) => { const m = {}; arr.forEach(x => m[x] = (m[x] || 0) + 1); return Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0]; };
    const favBase = byId(DATA.bases, count(rs.map(r => r.base)) || 'olong');
    const favFlavor = byId(DATA.flavors, count(rs.flatMap(flavorsOf)) || 'dao');
    const favTop = byId(DATA.toppings, count(rs.flatMap(r => r.toppings || [])) || 'tranchau');
    const avgCaff = rs.length ? rs.reduce((s, r) => s + (r.caffeine || 2), 0) / rs.length : 2;
    const persona = avgCaff >= 3 ? ['Hệ chạy deadline', '⚡', 'Bạn cần năng lượng để chinh phục mọi deadline – và Ô long đậm luôn bên bạn.']
      : favBase.id === 'lai' ? ['Hệ chữa lành', '🌿', 'Nhẹ nhàng, dịu dàng, bạn biết cách chậm lại và thương chính mình.']
      : favBase.id === 'xanh' ? ['Hệ năng lượng tươi mới', '🌱', 'Tươi tắn và lạc quan, bạn là người mở đầu mọi cuộc vui.']
      : favBase.id === 'hong' ? ['Hệ cổ điển có gu', '🎻', 'Bạn trân trọng những giá trị bền vững như một tách hồng trà.']
      : ['Hệ sành trà', '🍵', 'Bạn hiểu trà, yêu trà và luôn tìm vị trà đậm đà nhất.'];
    const myPosts = State.posts.filter(p => p.user === 'me');
    const likes = myPosts.reduce((s, p) => s + p.likes, 0) + myPosts.reduce((s, p) => s + p.replies.length, 0);
    return [
      { scene: Scenes.forest(720), bg: '#B7D88C', dark: true, html: `<div class="small">TEA WRAPPED ${new Date().getFullYear()}</div><h2>${esc(u.name)}, đây là năm trà của bạn</h2>${Avatar.render(u.avatar, 140)}` },
      { scene: Scenes.teaHills(720), bg: '#F3DDA8', dark: true, html: `<div>Năm nay bạn đã phối</div><div class="big">${rs.length}</div><h2>công thức độc bản</h2><div>và đặt <b>${orders.length}</b> ly tại Tea Lab.</div>` },
      { bg: `linear-gradient(170deg,#FBEBD6,${favBase.color})`, dark: true, html: `<div>Cốt trà “ruột” của bạn</div><h2 style="font-size:2.4rem">${favBase.name}</h2><div>Hương vị yêu thích: <b>${favFlavor.emoji} ${favFlavor.name}</b></div><div>Topping không thể thiếu: <b>${favTop.name}</b></div>${renderCup({ base: favBase.id, flavors: [favFlavor.id], toppings: [favTop.id], ice: 50 }, 'cup" style="width:110px')}` },
      { scene: Scenes.nightField(720), bg: '#2E2A5C', html: `<div>Tính cách trà của bạn</div><div class="big">${persona[1]}</div><h2>${persona[0]}</h2><p>${persona[2]}</p>` },
      { scene: Scenes.hub('hoian'), bg: '#F7D98A', dark: true, html: `<div>Tea Passport</div><div class="big">${State.stamps.length}/3</div><h2>dấu mộc đã sưu tầm</h2><div>${DATA.hubs.filter(h => State.stamps.includes(h.id)).map(h => h.city).join(' · ') || 'Hãy lên đường đến Hội An, Đà Lạt, Phố cổ Hà Nội nhé!'}</div><div style="margin-top:8px">Cộng đồng đã dành cho bạn <b>${likes}</b> lượt tương tác 💚</div>` },
      { scene: Scenes.storefront(), bg: '#F6D7B6', dark: true, html: `<div class="small">TEA WRAPPED · #TràĐộcBản</div><div class="row">${Avatar.render(u.avatar, 72)}<div><b style="font-size:1.2rem">${esc(u.name)}</b><div>${persona[1]} ${persona[0]}</div></div></div>
        <div style="background:rgba(255,255,255,.1);border-radius:14px;padding:12px">🧪 ${rs.length} công thức · 🧋 ${orders.length} ly<br>🍵 ${favBase.name} + ${favFlavor.name}<br>🛂 ${State.stamps.length}/3 dấu mộc</div>
        <button class="btn gold wrapped-share" data-act="wrap-share">Chia sẻ Tea Wrapped</button>` },
    ];
  }

  function showWrapped(i) {
    const slides = wrappedSlides();
    wrapIdx = Math.max(0, Math.min(i, slides.length - 1));
    clearTimeout(wrapTimer);
    let el = document.getElementById('wrapped');
    if (!el) { el = document.createElement('div'); el.id = 'wrapped'; el.className = 'wrapped'; document.body.appendChild(el); }
    const s = slides[wrapIdx];
    el.innerHTML = `<div class="wrapped-story ${s.dark ? 'ink' : ''}" style="background:${s.bg}">${s.scene ? `<div class="wrapped-scene">${s.scene}</div>` : ''}
      <div class="wrapped-bars">${slides.map((_, j) => `<i class="${j < wrapIdx ? 'done' : j === wrapIdx ? 'cur' : ''}"></i>`).join('')}</div>
      <button class="wrapped-close" data-act="wrap-close" aria-label="Đóng">×</button>
      <div class="wrapped-nav"><button data-act="wrap-prev" aria-label="Trước"></button><button data-act="wrap-next" aria-label="Tiếp"></button></div>
      <div class="wrapped-slide">${s.html}</div></div>`;
    if (wrapIdx < slides.length - 1) wrapTimer = setTimeout(() => showWrapped(wrapIdx + 1), 5000);
  }
  function closeWrapped() { clearTimeout(wrapTimer); document.getElementById('wrapped')?.remove(); }

  // ---------- Hubs (Idea 2) ----------
  let hubDate = 0, hubSlot = DATA.focusSlots[1], hubSeat = null;
  function dateLabel(off) { const d = new Date(); d.setDate(d.getDate() + off); return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }); }
  function seatTaken(seat) {
    const key = hubDate + hubSlot + seat;
    let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const mine = State.bookings.some(b => b.date === dateLabel(hubDate) && b.slot === hubSlot && b.seat === seat);
    return !mine && h % 3 === 0;
  }

  function renderHubs() {
    const stamps = State.stamps;
    const dest = DATA.hubs.filter(h => h.type === 'Destination');
    const urban = byId(DATA.hubs, 'urban');
    const seats = Array.from({ length: 12 }, (_, i) => 'F' + (i + 1));
    return `<h1>“Tắc Kè Hoa” – Mỗi Phúc Long một bản sắc</h1>
      <p class="muted">Thay áo, không thay hồn: giữ màu xanh, chất lượng trà và 80% menu chuẩn – kiến trúc, không gian và 20% menu theo từng vùng.</p>

      <div class="section"><h2>🛂 Tea Passport</h2><span class="muted small">${stamps.length}/3 dấu mộc</span></div>
      <div class="card"><div class="passport">${dest.map(h => {
        const got = stamps.includes(h.id);
        return `<div class="stamp ${got ? 'got' : ''}" style="${got ? `background:${h.color};border-color:${h.color}` : ''}"><div><span>${got ? '🍃' : '○'}</span>${h.city}</div></div>`;
      }).join('')}</div>
      <p class="small muted" style="margin-top:12px">${stamps.length >= 3 ? '🎉 Bạn đã đủ bộ! Nhận phụ kiện <b>Nón lá</b> cho nhân vật và ưu đãi đổi ly Local Collector.' : 'Đủ 3 dấu để nhận quà & mở khóa phụ kiện Nón lá. Mỗi hub còn mở khóa 1 trang phục riêng cho nhân vật.'}</p></div>

      <div class="section"><h2>🏯 Destination Hub</h2></div>
      <div class="grid grid-3">${dest.map(h => {
        const got = stamps.includes(h.id);
        return `<div class="card hub"><div class="hub-cover hub-photo"><img src="${DATA.storePhotos[h.id][0]}" alt="${esc(h.name)}" loading="lazy"><span class="tag">${h.type} Hub</span>${got ? '<span class="stamp-ok">✅</span>' : ''}</div><h3 class="hub-name">${h.name} <small>· ${h.city}</small></h3>
          <div class="hub-body"><p>${h.space}</p>
            <div class="small"><b>Signature chỉ bán tại chỗ:</b> ${h.signature.name} · ${money(h.signature.price)}</div>
            <div class="small"><b>Local Collector:</b> ${h.collector.name} · còn ${h.collector.left - State.preorders.filter(p => p.hub === h.id).length}/${h.collector.total}</div>
            <div class="small muted">🎨 Workshop: ${h.workshop}</div>
            <div class="row wrap" style="margin-top:10px">
              <a class="btn sm" href="#store/${h.id}">🏪 Tham quan cửa hàng</a>
              <button class="btn sm ${got ? 'soft' : 'ghost'}" data-act="checkin" data-hub="${h.id}" ${got ? 'disabled' : ''}>${got ? 'Đã check-in' : '📷 Check-in'}</button>
              <button class="btn sm ghost" data-act="table-order" data-hub="${h.id}">Gọi món tại bàn</button>
              <button class="btn sm ghost" data-act="preorder" data-hub="${h.id}">Pre-order ly</button></div></div></div>`;
      }).join('')}</div>

      <div class="section"><h2>🏙️ Urban Hub – Dual-Zone</h2></div>
      <div class="grid grid-2" style="align-items:start">
        <div class="card hub"><div class="hub-cover hub-photo urban-collage">${DATA.storePhotos.urban.map((src, i) => `<img src="${src}" alt="${['Góc làm việc yên tĩnh', 'Mặt tiền Phúc Long Coffee & Tea', 'Phòng đọc Focus Zone'][i]}" loading="lazy">`).join('')}<span class="tag">Urban Hub</span><h3>${urban.name}</h3></div><div class="hub-body"><p class="small">${urban.space}</p>
          <ul class="small"><li>Order qua QR tại bàn – không xếp hàng, không mất chỗ.</li><li>Báo trả món qua app/thiết bị rung – không gọi loa ở Focus Zone.</li></ul>
          <button class="btn sm ghost" data-act="table-order" data-hub="urban">Gọi món tại bàn (QR)</button></div></div>
        <div class="card"><h3>🪑 Đặt chỗ Focus Zone</h3>
          <div class="zone-label">Ngày</div>
          <div class="row wrap">${[0, 1, 2, 3].map(i => `<button class="chip ${hubDate === i ? 'on' : ''}" data-act="hub-date" data-v="${i}">${dateLabel(i)}</button>`).join('')}</div>
          <div class="zone-label">Khung giờ</div>
          <div class="row wrap">${DATA.focusSlots.map(s => `<button class="chip ${hubSlot === s ? 'on' : ''}" data-act="hub-slot" data-v="${s}">${s}</button>`).join('')}</div>
          <div class="zone-label">Focus Zone · bàn cá nhân có ổ cắm</div>
          <div class="seatmap">${seats.map(s => { const t = seatTaken(s); return `<button class="seat ${t ? 'taken' : ''} ${hubSeat === s ? 'on' : ''}" data-act="hub-seat" data-v="${s}" ${t ? 'disabled' : ''} aria-label="Ghế ${s}">${s}</button>`; }).join('')}</div>
          <div class="zone-label">Chill/Social Zone · không cần đặt</div>
          <div class="muted small">🛋️ Sofa nhóm 4–6 người · gương check-in · art-installation theo mùa</div>
          <button class="btn block" style="margin-top:12px" data-act="hub-book" ${hubSeat ? '' : 'disabled'}>Giữ chỗ ${hubSeat ? hubSeat + ' · ' + hubSlot : ''}</button></div>
      </div>`;
  }

  // ---------- Actions (event delegation) ----------
  const postById = id => State.posts.find(p => p.id === id);
  const A = {
    close: closeModal,
    'ob-random': () => { onboardAvatar = Avatar.random(); document.getElementById('obAv').innerHTML = Avatar.render(onboardAvatar, 64); },
    'ob-create': () => {
      const name = document.getElementById('obName').value.trim();
      if (!name || !document.getElementById('obConsent').checked) return;
      const handle = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') || 'ban';
      State.user = { name, handle: handle + '.' + Math.floor(Math.random() * 90 + 10), avatar: onboardAvatar, consentAt: Date.now() };
      studioCfg = null;
      toast(`👋 Chào ${esc(name)}! Hãy tạo nhân vật của riêng bạn.`);
      go('studio');
    },

    'lab-base': el => { lab.base = el.dataset.v; lab.flavors = lab.flavors.filter(f => !badWith(f, [lab.base])); render(true); },
    'lab-flavor': el => { const v = el.dataset.v; lab.flavors = lab.flavors.includes(v) ? lab.flavors.filter(x => x !== v) : [...lab.flavors, v]; render(true); },
    'lab-top': el => { const v = el.dataset.v; lab.toppings = lab.toppings.includes(v) ? lab.toppings.filter(x => x !== v) : [...lab.toppings, v]; render(true); },
    'lab-size': el => { lab.size = el.dataset.v; render(true); },
    'lab-caff': el => { lab.caffeine = +el.dataset.v; render(true); },
    'lab-next': () => { if (labCanNext()) { lab.step++; render(true); } },
    'lab-back': () => { lab.step = Math.max(0, lab.step - 1); render(true); },
    'lab-reset': () => { lab = freshLab(); render(); },
    'lab-new': () => { lab = freshLab(); render(); },
    'lab-suggest-name': () => {
      const fl = byId(DATA.flavors, lab.flavors[0]);
      const pool = ['Nắng ' + (fl?.name || 'Sớm'), 'Độc Bản Của Tôi', 'Deadline Không Sợ', 'Chiều Thứ Sáu', (fl?.name || 'Trà') + ' Mộng Mơ', 'Hệ Chữa Lành', 'Một Chút Bình Yên'];
      lab.name = pool[Math.floor(Math.random() * pool.length)];
      document.getElementById('labName').value = lab.name; updateLabLive();
    },
    'lab-preset': el => {
      const p = DATA.presets[+el.dataset.i];
      lab = { ...freshLab(), base: p.base, flavors: [p.flavor], toppings: [...p.toppings], sugar: p.sugar, ice: p.ice, caffeine: p.caffeine, name: p.name.replace('Độc bản của ', '').replace(/^./, c => c.toUpperCase()), step: 3 };
      go('tealab');
    },
    'lab-save-only': () => {
      lab.save = true;
      const r = saveLabRecipe();
      lab.done = { code: 'A' + Math.floor(Math.random() * 900 + 100), recipe: r, time: Date.now(), ordered: false };
      toast('💾 Đã lưu “' + esc(r.name) + '” vào My Tea\'s Profile');
      render();
    },
    'lab-order': () => {
      const r = saveLabRecipe();
      const first = !Avatar.isUnlocked('order');
      const o = { code: 'A' + Math.floor(Math.random() * 900 + 100), recipe: r, store: lab.store, price: recipePrice(r), time: Date.now(), ordered: true, ready: false };
      State.orders = [{ code: o.code, recipeId: r.id, name: r.name, price: o.price, store: o.store, time: o.time }, ...State.orders];
      lab.done = o;
      render();
      toast('🧾 Đã gửi đơn #' + o.code + ' tới quầy Tea Lab');
      if (first) setTimeout(() => (Avatar.grant('acc:4'), toast('🎉 Mở khóa <b>Đèn bão</b> trong tủ đồ!', 4500)), 900);
      setTimeout(() => {
        o.ready = true;
        toast(`🔔 <span><b>${esc(me().name)}</b> ơi, ly “${esc(r.name)}” (#${o.code}) đã sẵn sàng!</span>`, 5000);
        const st = document.getElementById('orderStatus');
        if (st && lab.done === o) st.innerHTML = '<span class="tag">✅ Đã sẵn sàng</span>';
      }, 5000);
    },
    'order-from': el => { const p = postById(el.dataset.id); if (p?.recipe) { loadIntoLab(p.recipe); go('tealab'); toast('🧪 Đã nạp công thức “' + esc(p.recipe.name) + '” – kiểm tra rồi đặt món nhé'); } },
    reorder: el => { const r = byId(State.recipes, el.dataset.rid); if (r) { loadIntoLab(r); go('tealab'); } },
    'del-recipe': el => { State.recipes = State.recipes.filter(r => r.id !== el.dataset.rid); render(true); },
    'share-recipe': el => { newDraft({ type: 'recipe', recipeId: el.dataset.rid }); openComposer(); },
    'contest-recipe': el => { newDraft({ type: 'recipe', recipeId: el.dataset.rid, contest: true, text: '' }); openComposer(); },
    'contest-new': () => { newDraft({ type: 'recipe', contest: true }); openComposer(); },

    compose: () => { newDraft(); openComposer(); },
    'd-type': el => { draft.type = el.dataset.v; if (draft.type !== 'recipe') draft.contest = false; refreshComposer(); },
    'd-star': el => { draft.stars = +el.dataset.v; refreshComposer(); },
    'd-img-remove': () => { draft.image = null; refreshComposer(); },
    'd-post': publishDraft,
    'feed-tab': el => { feedTab = el.dataset.v; render(true); },
    tag: el => { feedTag = el.dataset.tag; feedTab = 'all'; closeModal(); go('community'); },
    'tag-clear': () => { feedTag = ''; render(true); },
    like: el => { updatePost(el.dataset.id, p => { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; return p; }); render(true); },
    repost: el => { updatePost(el.dataset.id, p => { p.reposted = !p.reposted; p.reposts += p.reposted ? 1 : -1; return p; }); toast(postById(el.dataset.id).reposted ? '🔁 Đã đăng lại' : 'Đã bỏ đăng lại'); render(true); },
    'toggle-replies': el => { const id = el.dataset.id; openReplies.has(id) ? openReplies.delete(id) : openReplies.add(id); render(true); document.querySelector(`[data-reply="${id}"] input`)?.focus({ preventScroll: true }); },
    share: el => {
      const url = location.href.split('#')[0] + '#community';
      const p = postById(el.dataset.id);
      const text = `${p.recipe ? '“' + p.recipe.name + '” – ' : ''}${p.text}\n${url}`;
      (navigator.clipboard?.writeText(text) || Promise.reject()).then(() => toast('🔗 Đã sao chép để chia sẻ'), () => toast('Không sao chép được – hãy thử lại'));
    },
    'post-more': el => {
      const p = postById(el.dataset.id);
      openModal('Tuỳ chọn', `<div class="stack">${p.user === 'me' ? `<button class="btn block ghost" style="color:var(--danger);border-color:var(--danger)" data-act="del-post" data-id="${p.id}">🗑️ Xoá bài viết</button>` : `<button class="btn block ghost" data-act="report" data-id="${p.id}">🚩 Báo cáo bài viết</button>`}<button class="btn block soft" data-act="close">Huỷ</button></div>`);
    },
    report: el => { updatePost(el.dataset.id, p => ({ ...p, reported: true })); closeModal(); toast('🚩 Cảm ơn bạn – đội kiểm duyệt sẽ xem xét'); render(true); },
    unreport: el => { updatePost(el.dataset.id, p => ({ ...p, reported: false })); render(true); },
    'del-post': el => {
      if (!confirm('Xoá bài viết này?')) return;
      State.posts = State.posts.filter(p => p.id !== el.dataset.id); closeModal(); toast('Đã xoá bài viết'); render(true);
    },


    vote: el => {
      const id = el.dataset.id, votes = State.votes;
      if (votes.includes(id)) { State.votes = votes.filter(v => v !== id); render(true); return; }
      if (votes.length >= DATA.maxVotes) { toast('Bạn đã dùng hết ' + DATA.maxVotes + ' phiếu bình chọn'); return; }
      State.votes = [...votes, id];
      if (!State.vouchers.some(v => v.code === 'DOCBAN25')) {
        State.vouchers = [...State.vouchers, { code: 'DOCBAN25', title: 'Giảm 25% (tối đa 15.000đ)', desc: 'Quà cảm ơn vì đã bình chọn #TràĐộcBản' }];
        toast('🎟️ Bạn nhận được voucher <b>giảm 25%</b> (tối đa 15.000đ)!', 4500);
      } else toast('✓ Đã bình chọn');
      render(true);
    },

    wrapped: () => showWrapped(0),
    'wrap-next': () => { const n = wrappedSlides().length; if (wrapIdx < n - 1) showWrapped(wrapIdx + 1); },
    'wrap-prev': () => showWrapped(wrapIdx - 1),
    'wrap-close': closeWrapped,
    'wrap-share': () => {
      const u = me();
      const text = `🍵 Tea Wrapped ${new Date().getFullYear()} của ${u.name}: ${State.recipes.length} công thức độc bản, ${State.orders.length} ly, ${State.stamps.length}/3 dấu Tea Passport. #TràĐộcBản`;
      (navigator.clipboard?.writeText(text) || Promise.reject()).then(() => toast('🔗 Đã sao chép Tea Wrapped để chia sẻ'), () => toast(esc(text), 6000));
    },
    withdraw: () => {
      if (!confirm('Rút lại đồng ý sẽ xoá toàn bộ dữ liệu demo (công thức, bài đăng, dấu mộc…). Tiếp tục?')) return;
      Store.reset(); lab = freshLab(); studioCfg = null; onboardAvatar = { ...Avatar.REF }; go('onboard');
    },

    checkin: el => {
      const h = byId(DATA.hubs, el.dataset.hub);
      openModal('Quét QR check-in', `<div style="text-align:center">${qrSvg(h.id)}<p class="muted small" style="margin-top:10px">Đang quét mã QR tại quầy ${esc(h.name)}…</p></div>`);
      setTimeout(() => {
        const before = Avatar.outfits.concat(Avatar.accs).filter(o => o.lock && !Avatar.isUnlocked(o.lock));
        State.stamps = [...new Set([...State.stamps, h.id])];
        closeModal();
        toast(`🛂 Nhận dấu mộc <b>${esc(h.city)}</b> trên Tea Passport!`);
        before.filter(o => Avatar.isUnlocked(o.lock)).forEach((o, i) => setTimeout(() => toast(`🎉 Mở khóa <b>${esc(o.name)}</b> cho nhân vật!`, 4500), 700 * (i + 1)));
        render(true);
      }, 1400);
    },
    preorder: el => {
      const h = byId(DATA.hubs, el.dataset.hub);
      const mine = State.preorders.filter(p => p.hub === h.id).length;
      const no = h.collector.total - h.collector.left + mine + 1;
      openModal('Pre-order ' + esc(h.collector.name), `<p>Bộ ly <b>Local Collector</b> sản xuất số lượng giới hạn, đánh số, hợp tác làng nghề địa phương. Bao bì in câu chuyện về ${esc(h.city)}.</p>
        <div class="card" style="box-shadow:none;background:var(--cream)"><b>${esc(h.collector.name)}</b><div>Số thứ tự dự kiến: <b>#${String(no).padStart(4, '0')}</b> / ${h.collector.total}</div><div class="price">${money(h.collector.price)}</div></div>
        <p class="muted small">Nhận tại ${esc(h.name)} · thanh toán khi nhận (bản demo).</p>
        <button class="btn block" data-act="preorder-ok" data-hub="${h.id}" data-no="${no}">Xác nhận giữ ly</button>`);
    },
    'preorder-ok': el => {
      const h = byId(DATA.hubs, el.dataset.hub);
      State.preorders = [...State.preorders, { hub: h.id, name: h.collector.name, no: +el.dataset.no }];
      closeModal(); toast('🏺 Đã giữ ly ' + esc(h.collector.name) + ' số #' + el.dataset.no.padStart(4, '0')); render(true);
    },
    'table-order': el => {
      const h = byId(DATA.hubs, el.dataset.hub);
      const items = [...(h.signature ? [h.signature.name + ' (chỉ tại đây)'] : []), ...DATA.menu.slice(0, 6)];
      openModal('Order tại bàn · ' + esc(h.city), `<p class="muted small">Đã quét QR tại bàn – không cần xếp hàng, không mất chỗ.</p>
        <label class="field"><span>Số bàn</span><select class="input" id="tblNo">${Array.from({ length: 12 }, (_, i) => `<option>${h.id === 'urban' ? 'F' : 'B'}${i + 1}</option>`).join('')}</select></label>
        <label class="field" style="margin-top:10px"><span>Món</span><select class="input" id="tblItem">${items.map(i => `<option>${esc(i)}</option>`).join('')}</select></label>
        <button class="btn block" style="margin-top:14px" data-act="table-order-ok">Gửi order</button>`);
    },
    'table-order-ok': () => {
      const t = document.getElementById('tblNo').value, it = document.getElementById('tblItem').value;
      closeModal();
      toast(`🧾 Đã nhận order bàn <b>${esc(t)}</b>: ${esc(it)}`);
      setTimeout(() => toast(`📳 Món “${esc(it)}” đã sẵn sàng – nhân viên mang ra bàn ${esc(t)} (không gọi loa)`, 5000), 4000);
    },
    'hub-date': el => { hubDate = +el.dataset.v; hubSeat = null; render(true); },
    'hub-slot': el => { hubSlot = el.dataset.v; hubSeat = null; render(true); },
    'hub-seat': el => { hubSeat = el.dataset.v; render(true); },
    'hub-book': () => {
      State.bookings = [...State.bookings, { seat: hubSeat, date: dateLabel(hubDate), slot: hubSlot }];
      toast(`🪑 Đã giữ ghế <b>${hubSeat}</b> · ${dateLabel(hubDate)} · ${hubSlot}`);
      hubSeat = null; render(true);
    },
  };

  function qrSvg(seed) {
    let h = 7; for (const c of seed) h = (h * 131 + c.charCodeAt(0)) >>> 0;
    let cells = '';
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      let on;
      if (finder) { const fx = x % 14, fy = y % 14; on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx > 1 && fx < 5 && fy > 1 && fy < 5); }
      else { h = (h * 1103515245 + 12345) >>> 0; on = (h >>> 16) % 2 === 0; }
      if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    return `<svg class="qr" viewBox="-1 -1 23 23" fill="#1D2420" aria-label="Mã QR mô phỏng"><rect x="-1" y="-1" width="23" height="23" fill="#fff"/>${cells}</svg>`;
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = A[el.dataset.act];
    if (!fn) return;
    if (!(el.tagName === 'A' && el.getAttribute('href'))) e.preventDefault();
    fn(el, e);
  });

  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-reply]');
    if (!f) return;
    e.preventDefault();
    const text = f.querySelector('input').value.trim();
    if (!text) return;
    if (DATA.bannedWords.some(w => text.toLowerCase().includes(w))) { toast('🚫 Bình luận chứa từ ngữ không phù hợp.'); return; }
    updatePost(f.dataset.reply, p => { p.replies = [...p.replies, { user: 'me', text, time: Date.now() }]; return p; });
    render(true);
  });

  document.addEventListener('input', e => {
    const k = e.target.dataset?.in;
    if (!k) return;
    const v = e.target.value;
    if (k === 'ob') { document.getElementById('obGo').disabled = !(document.getElementById('obName').value.trim() && document.getElementById('obConsent').checked); }
    if (k === 'lab-sugar') { lab.sugar = +v; document.getElementById('oSugar').textContent = v + '%'; updateLabLive(); }
    if (k === 'lab-ice') { lab.ice = +v; document.getElementById('oIce').textContent = v + '%'; updateLabLive(); }
    if (k === 'lab-name') { lab.name = v; updateLabLive(); }
    if (k === 'lab-story') lab.story = v;
    if (k === 'd-text') {
      draft.text = v;
      const c = document.getElementById('dCount'); c.textContent = v.length + '/500'; c.classList.toggle('over', v.length > 500);
      const d = draft, has = State.recipes.length;
      document.getElementById('dPost').disabled = !(v.trim() && v.length <= 500 && (d.type !== 'recipe' || (has && (!d.contest || (d.rights && d.age)))));
    }
  });

  document.addEventListener('change', async e => {
    const k = e.target.dataset?.in;
    if (!k) return;
    const t = e.target;
    if (k === 'lab-store') lab.store = t.value;
    if (k === 'lab-save') lab.save = t.checked;
    if (k === 'd-recipe') draft.recipeId = t.value;
    if (k === 'd-item') draft.item = t.value;
    if (k === 'd-store') draft.store = t.value;
    if (['d-contest', 'd-rights', 'd-age'].includes(k)) { draft[k.slice(2)] = t.checked; refreshComposer(); }
    if (k === 'd-img' && t.files[0]) {
      try { draft.image = await resizeImage(t.files[0]); refreshComposer(); }
      catch { toast('Không đọc được ảnh này'); }
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (document.getElementById('wrapped')) closeWrapped(); else if (!modal.hidden) closeModal(); }
    if (document.getElementById('wrapped')) { if (e.key === 'ArrowRight') A['wrap-next'](); if (e.key === 'ArrowLeft') A['wrap-prev'](); }
  });

  window.App = { esc, money, toast, openModal, closeModal, render, go, me, userById, byId, timeAgo, routes, afterRender, actions: A, renderCup, resizeImage, uid, NARROW };
  document.addEventListener('DOMContentLoaded', () => render());
})();
