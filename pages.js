// Trang mới: Menu Phúc Long, Mood Mix (kiểu Spotify), Bạn bè & chuỗi check-in, Mô phỏng cửa hàng
(() => {
  const { esc, money, toast, openModal, closeModal, render, go, me, userById, byId, timeAgo, routes, actions: A, resizeImage, uid } = App;
  const drink = id => byId(DATA.drinks, id);
  const k = n => Math.round(n / 1000) + 'k';
  const catName = id => byId(DATA.menuCats, id)?.name || '';

  // ================= MENU =================
  let menuCat = 'all', menuQ = '';
  const likes = () => Store.get('likes', []);

  function menuRow(d) {
    const liked = likes().includes(d.id);
    return `<div class="mrow" data-act="m-open" data-id="${d.id}" role="button" tabindex="0">
      <span class="mthumb">${d.img ? `<img src="${d.img}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}${d.best ? '<i>★</i>' : ''}</span>
      <span class="mname"><b>${esc(d.name)}</b><small>${esc(d.desc)}</small></span>
      <span class="mprice">${d.m ? `<i>M</i>${k(d.m)}` : ''}<i>L</i>${k(d.l)}</span>
      <button class="mheart ${liked ? 'on' : ''}" data-act="m-like" data-id="${d.id}" aria-label="Thích">${liked ? '♥' : '♡'}</button></div>`;
  }

  routes.menu = () => {
    const want = location.hash.split('?')[1];
    if (want && drink(want)) setTimeout(() => openDrink(want), 0);
    const q = menuQ.trim().toLowerCase();
    const list = DATA.drinks.filter(d => (menuCat === 'all' || d.cat === menuCat) && (!q || d.name.toLowerCase().includes(q)));
    const cats = DATA.menuCats.filter(c => list.some(d => d.cat === c.id));
    const featured = DATA.drinks.filter(d => d.best).concat(byId(DATA.drinks, 'yen-mach-matcha'), byId(DATA.drinks, 'hong-tra-dao'));
    return `<section class="hero-photo hero-menu bleed"><img src="./bia-menu.jpg" alt="Người hái chè đội nón lá trên đồi chè xanh">
        <div class="hero-lab-text"><span class="eyebrow light">Tea & Coffee · since 1968</span><h1>Menu <em>nhà</em> Phúc Long</h1></div></section>

      <div class="menu-tools">
        <div class="row wrap">${[['all', 'Tất cả', '🍃'], ...DATA.menuCats.map(c => [c.id, c.name, c.icon])].map(([id, n, ic]) => `<button class="chip ${menuCat === id ? 'on' : ''}" data-act="m-cat" data-v="${id}">${ic} ${n}</button>`).join('')}</div>
        <input class="input menu-search" placeholder="Tìm món…" value="${esc(menuQ)}" data-in="m-q" aria-label="Tìm món">
      </div>

      <section class="menu-board">
        <div class="board-side">Phúc Long · Trà & Cà phê</div>
        <div class="board-feature">${featured.slice(0, 6).map(d => `<button class="feat" data-act="m-open" data-id="${d.id}">${Cups.render(d, 70)}<span>${esc(d.name.replace('Trà ', ''))}</span>${d.best ? '<em>HOT</em>' : ''}</button>`).join('')}</div>
        <div class="board-cols">${cats.map(c => `<div class="mcat"><h3><span class="mcat-ic">${c.icon}</span>${c.name.toUpperCase()}</h3>${list.filter(d => d.cat === c.id).map(menuRow).join('')}</div>`).join('') || '<div class="empty">Không tìm thấy món phù hợp.</div>'}</div>
        <div class="board-extra">
          <div class="xrow"><span class="xlabel">TOPPING EXTRA</span>${DATA.menuExtras.toppings.map(([n, p]) => `<span class="xitem">${n} <i>${k(p)}</i></span>`).join('')}</div>
          <div class="xrow"><span class="xlabel">SUGAR LEVEL</span>${DATA.menuExtras.sugar.map(n => `<span class="xitem">${n}</span>`).join('')}<span class="xlabel">ICE LEVEL</span>${DATA.menuExtras.ice.map(n => `<span class="xitem">${n}</span>`).join('')}</div>
        </div>
      </section>
      <p class="muted small" style="text-align:center;margin-top:10px">Tên món & giá tham khảo từ phuclong.com.vn (10/2026). Size M ước tính từ giá size L. Hình ly là minh hoạ.</p>`;
  };

  function openDrink(id, opts = {}) {
    const d = drink(id);
    let size = d.m ? 'M' : 'L', sugar = 2, ice = 2;
    const body = () => `<div class="drink-modal">
      <div class="dm-cup">${Cups.render(d, 150)}</div>
      <div class="dm-info"><span class="eyebrow">${catName(d.cat)}</span><h2>${esc(d.name)}</h2><p class="muted">${esc(d.desc)}</p>
        <div class="dm-moods">${d.moods.map(m => { const mm = byId(DATA.moods, m); return `<a class="tag" href="#mood/${m}" data-act="close">${mm.emoji} ${mm.name}</a>`; }).join(' ')}</div>
        ${d.look !== 'cake' ? `<div class="zone-label">Size</div><div class="row wrap">${(d.m ? ['M', 'L'] : ['L']).map(z => `<button class="chip ${size === z ? 'on' : ''}" data-act="dm-size" data-v="${z}">${z} · ${money(z === 'M' ? d.m : d.l)}</button>`).join('')}</div>
        <div class="zone-label">Độ ngọt</div><div class="row wrap">${DATA.menuExtras.sugar.map((n, i) => `<button class="chip ${sugar === i ? 'on' : ''}" data-act="dm-sugar" data-v="${i}">${n}</button>`).join('')}</div>
        <div class="zone-label">Đá</div><div class="row wrap">${DATA.menuExtras.ice.map((n, i) => `<button class="chip ${ice === i ? 'on' : ''}" data-act="dm-ice" data-v="${i}">${n}</button>`).join('')}</div>` : ''}
        <label class="field" style="margin-top:12px"><span>Nhận tại</span><select class="input" id="dmStore">${DATA.stores.map(s => `<option>${esc(s)}</option>`).join('')}</select></label>
        <button class="btn block" style="margin-top:14px" data-act="dm-order">Đặt món · ${money(size === 'M' ? d.m : d.l)}</button>
        ${opts.from ? `<p class="muted small" style="margin-top:8px">${esc(opts.from)}</p>` : ''}</div></div>`;
    openModal(esc(d.name), body());
    const rerender = () => { const box = document.querySelector('.drink-modal'); if (box) box.outerHTML = body(); };
    Object.assign(A, {
      'dm-size': el => { size = el.dataset.v; rerender(); },
      'dm-sugar': el => { sugar = +el.dataset.v; rerender(); },
      'dm-ice': el => { ice = +el.dataset.v; rerender(); },
      'dm-order': () => {
        const price = size === 'M' ? d.m : d.l, store = document.getElementById('dmStore').value;
        const code = 'B' + Math.floor(Math.random() * 900 + 100);
        State.orders = [{ code, drinkId: d.id, name: d.name + (d.look !== 'cake' ? ` (${size})` : ''), price, store, time: Date.now() }, ...State.orders];
        closeModal();
        toast(`🧾 Đã đặt <b>${esc(d.name)}</b> · #${code}`);
        setTimeout(() => toast(`🔔 Món “${esc(d.name)}” (#${code}) đã sẵn sàng tại ${esc(store)}!`, 5000), 4500);
      },
    });
  }
  window.openDrink = openDrink;

  Object.assign(A, {
    'm-cat': el => { menuCat = el.dataset.v; render(true); },
    'm-open': (el, e) => { if (e.target.closest('[data-act="m-like"]')) return; openDrink(el.dataset.id); },
    'm-like': (el, e) => {
      e.stopPropagation();
      const id = el.dataset.id, l = likes();
      Store.set('likes', l.includes(id) ? l.filter(x => x !== id) : [...l, id]);
      toast(l.includes(id) ? 'Đã bỏ khỏi Món yêu thích' : '💚 Đã thêm vào <b>Món yêu thích</b>');
      render(true);
    },
  });
  document.addEventListener('input', e => {
    if (e.target.dataset?.in !== 'm-q') return;
    menuQ = e.target.value;
    const pos = e.target.selectionStart;
    render(true);
    const inp = document.querySelector('.menu-search'); inp?.focus(); inp?.setSelectionRange(pos, pos);
  });

  // ================= MOOD MIX (kiểu Spotify) =================
  let playing = null, playQueue = [];

  function daylist() {
    const now = new Date(), h = now.getHours();
    const day = ['Chủ nhật', 'thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy'][now.getDay()];
    const part = h < 11 ? 'sáng' : h < 14 ? 'trưa' : h < 18 ? 'chiều' : 'tối';
    const ids = h < 11 ? ['energy', 'focus'] : h < 14 ? ['healthy', 'energy'] : h < 18 ? ['focus', 'healthy'] : ['relax', 'heal'];
    return { name: `${part} ${day} · ${byId(DATA.moods, ids[0]).name.toLowerCase()}`, ids };
  }
  function madeForYou() {
    const ids = [...likes(), ...State.orders.map(o => o.drinkId).filter(Boolean)];
    const uniq = [...new Set(ids)].map(drink).filter(Boolean);
    return uniq.length >= 3 ? uniq : uniq.concat(DATA.drinks.filter(d => d.best && !uniq.includes(d))).slice(0, 8);
  }
  const moodDrinks = id => id === 'day' ? DATA.drinks.filter(d => d.moods.some(m => daylist().ids.includes(m)) && d.cat !== 'cake').slice(0, 10)
    : id === 'foryou' ? madeForYou() : id === 'liked' ? likes().map(drink).filter(Boolean)
    : DATA.drinks.filter(d => d.moods.includes(id));
  const moodMeta = id => id === 'day' ? { name: 'daylist · ' + daylist().name, emoji: '🌤️', desc: 'Tự đổi theo giờ trong ngày', colors: ['#9ED8B4', '#0B6B3A'] }
    : id === 'foryou' ? { name: `Pha riêng cho ${me().name}`, emoji: '💚', desc: 'Từ món bạn thích & đã đặt', colors: ['#7FC79A', '#14281D'] }
    : id === 'liked' ? { name: 'Món yêu thích', emoji: '♥', desc: 'Những món bạn đã thả tim', colors: ['#B49AE0', '#3B2A6B'] }
    : byId(DATA.moods, id);

  const cover = (id, size = 'lg') => {
    const m = moodMeta(id), ds = moodDrinks(id).slice(0, 4);
    return `<div class="cover cover-${size}" style="--m1:${m.colors[0]};--m2:${m.colors[1]}"><div class="cover-cups">${ds.map(d => Cups.render(d, size === 'lg' ? 60 : 36)).join('')}</div><span class="cover-emoji">${m.emoji}</span><span class="cover-title">${esc(m.name)}</span></div>`;
  };

  routes.mood = param => {
    if (param) return moodPage(param);
    const dl = daylist();
    return `<section class="sp-head sp-head-under" style="--m1:#7FC79A;--m2:#0E2A1B"><div><span class="eyebrow light">Mood Mix · lấy cảm hứng từ Spotify</span><h1>Hôm nay<br><em>bạn</em> thấy thế nào?</h1>
        <div class="mood-pick">${DATA.moods.map(m => `<a class="mood-chip" href="#mood/${m.id}">${m.emoji} ${m.name}</a>`).join('')}</div></div></section>
      <div class="section"><h2>Dành riêng cho bạn</h2></div>
      <div class="sp-row">${['day', 'foryou', 'liked'].map(id => `<a class="sp-card" href="#mood/${id}">${cover(id, 'sm')}<b>${esc(moodMeta(id).name)}</b><small>${esc(moodMeta(id).desc)}</small></a>`).join('')}</div>
      <div class="section"><h2>Mix theo tâm trạng & mục đích</h2></div>
      <div class="sp-row">${DATA.moods.map(m => `<a class="sp-card" href="#mood/${m.id}">${cover(m.id, 'sm')}<b>${m.name}</b><small>${m.desc}</small></a>`).join('')}</div>`;
  };

  function moodPage(id) {
    const m = moodMeta(id); if (!m) return routes.mood();
    const ds = moodDrinks(id);
    playQueue = ds;
    return `<section class="sp-head" style="--m1:${m.colors[0]};--m2:${m.colors[1]}">
        ${cover(id)}
        <div><span class="eyebrow light">Playlist · Mood Mix</span><h1>${esc(m.name)}</h1><p>${esc(m.desc)}</p>
        <p class="small">Phúc Long · ${ds.length} món · khoảng ${ds.length * 2} phút pha</p></div></section>
      <div class="sp-controls"><button class="sp-play" data-act="sp-shuffle" aria-label="Gợi ý ngẫu nhiên">▶</button><button class="sp-icon" data-act="sp-shuffle" title="Trộn bài">🔀</button><a class="link" href="#mood">← Tất cả mood</a></div>
      <div class="sp-table">
        <div class="sp-tr sp-th"><span>#</span><span>Món</span><span class="hide-sm">Nhóm</span><span>Giá</span><span></span></div>
        ${ds.map((d, i) => `<div class="sp-tr ${playing === d.id ? 'playing' : ''}" data-act="sp-play" data-id="${d.id}" role="button" tabindex="0"><span class="sp-no">${playing === d.id ? '♫' : i + 1}</span>
          <span class="sp-track">${Cups.render(d, 34)}<span><b>${esc(d.name)}</b><small>${d.moods.map(x => byId(DATA.moods, x).emoji).join(' ')} ${esc(d.desc)}</small></span></span>
          <span class="hide-sm muted">${catName(d.cat)}</span><span>${money(d.l)}</span>
          <button class="mheart ${likes().includes(d.id) ? 'on' : ''}" data-act="m-like" data-id="${d.id}" aria-label="Thích">${likes().includes(d.id) ? '♥' : '♡'}</button></div>`).join('') || '<div class="empty">Chưa có món nào – hãy thả tim vài món trong Menu nhé.</div>'}
      </div>`;
  }

  function nowPlayingBar() {
    let bar = document.getElementById('nowPlaying');
    if (!playing) { bar?.remove(); return; }
    const d = drink(playing);
    if (!bar) { bar = document.createElement('div'); bar.id = 'nowPlaying'; bar.className = 'now-playing'; document.body.appendChild(bar); }
    bar.innerHTML = `${Cups.render(d, 40)}<div class="np-info"><b>${esc(d.name)}</b><small>Đang gợi ý cho bạn · ${money(d.l)}</small><div class="np-bar"><i></i></div></div>
      <div class="np-ctrl"><button data-act="sp-prev" aria-label="Trước">⏮</button><button data-act="sp-shuffle" aria-label="Ngẫu nhiên">🔀</button><button data-act="sp-next" aria-label="Tiếp">⏭</button></div>
      <button class="btn sm" data-act="m-open" data-id="${d.id}">Đặt ngay</button><button class="np-x" data-act="sp-stop" aria-label="Tắt">×</button>`;
  }
  const playAt = id => { playing = id; nowPlayingBar(); if ((location.hash || '').startsWith('#mood/')) render(true); };
  Object.assign(A, {
    'sp-play': (el, e) => { if (e.target.closest('[data-act="m-like"]')) return; playAt(el.dataset.id); },
    'sp-shuffle': () => { const q = playQueue.length ? playQueue : DATA.drinks; playAt(q[Math.floor(Math.random() * q.length)].id); },
    'sp-next': () => { const q = playQueue.length ? playQueue : DATA.drinks; const i = q.findIndex(d => d.id === playing); playAt(q[(i + 1) % q.length].id); },
    'sp-prev': () => { const q = playQueue.length ? playQueue : DATA.drinks; const i = q.findIndex(d => d.id === playing); playAt(q[(i - 1 + q.length) % q.length].id); },
    'sp-stop': () => { playing = null; nowPlayingBar(); },
  });

  // ================= STREAK & BẠN BÈ =================
  const pad = n => String(n).padStart(2, '0');
  const dayKey = (offsetDays = 0) => { const d = new Date(); d.setDate(d.getDate() + (Store.get('dayOffset', 0)) + offsetDays); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const Streak = {
    checkins: () => Store.get('checkins', []),
    days: () => [...new Set(Streak.checkins().map(c => c.day))].sort(),
    current() {
      const set = new Set(Streak.days());
      let off = set.has(dayKey()) ? 0 : -1, n = 0;
      while (set.has(dayKey(off))) { n++; off--; }
      return n;
    },
    best() {
      const ds = Streak.days().map(d => new Date(d + 'T00:00:00').getTime());
      let best = 0, run = 0;
      ds.forEach((t, i) => { run = i && t - ds[i - 1] === 864e5 ? run + 1 : 1; best = Math.max(best, run); });
      return best;
    },
    today: () => Streak.days().includes(dayKey()),
  };
  window.Streak = Streak;

  const friendIds = () => Store.get('friends', ['u1', 'u3']);
  const Friends = {
    feed() {
      const mine = Streak.checkins().map(c => ({ id: c.id, user: 'me', drink: c.drinkId, drinkName: drink(c.drinkId)?.name || '', time: c.time, store: c.store, note: c.note, photo: c.photo, reacts: c.reacts || {} }));
      const now = Date.now();
      const fr = DATA.friendActivity.filter(a => friendIds().includes(a.user)).map((a, i) => ({ id: 'fa' + i, user: a.user, drink: a.drink, drinkName: drink(a.drink).name, time: now - a.ago * 60000, store: a.store, note: a.note, bg: a.bg, reacts: { ...a.reacts, ...(Store.get('reacts', {})['fa' + i] || {}) } }));
      return [...mine, ...fr].sort((a, b) => b.time - a.time);
    },
    snapArt(f) {
      const d = drink(f.drink);
      return `<span class="snap-art"><svg viewBox="0 40 200 200" preserveAspectRatio="xMidYMid slice">${Avatar.sceneSvg((f.bg ?? 0) % Avatar.scenes.length, 'snap' + f.id)}</svg>${d ? Cups.render(d, 70) : ''}</span>`;
    },
  };
  window.Friends = Friends;

  routes.friends = () => {
    const u = me(), cur = Streak.current(), claimed = Store.get('streakClaimed', []);
    const week = Array.from({ length: 7 }, (_, i) => dayKey(i - 6));
    const days = new Set(Streak.days());
    const code = 'PL-' + (u.handle.length * 137 % 9000 + 1000);
    const fids = friendIds();
    const suggest = DATA.seedUsers.filter(x => !fids.includes(x.id));
    const feed = Friends.feed();
    return `<section class="friends-head">
        <div class="streak-card">
          <div class="streak-num"><span class="flame">🔥</span><b>${cur}</b><small>ngày liên tiếp</small></div>
          <div class="streak-week">${week.map(d => `<span class="${days.has(d) ? 'on' : ''} ${d === dayKey() ? 'today' : ''}"><i>${days.has(d) ? '✓' : ''}</i><small>${['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(d + 'T00:00:00').getDay()]}</small></span>`).join('')}</div>
          <button class="btn gold block" data-act="cam-open">📸 ${Streak.today() ? 'Chụp thêm ảnh hôm nay' : 'Chụp ảnh giữ chuỗi hôm nay'}</button>
          <button class="link small" data-act="day-next" title="Chỉ dùng để thử tính năng">⏩ Mô phỏng sang ngày mới (demo)</button>
        </div>
        <div class="card rewards"><h3>Đổi voucher theo chuỗi</h3>
          ${DATA.streakRewards.map(r => { const ok = Math.max(cur, Streak.best()) >= r.days, got = claimed.includes(r.code); return `<div class="reward ${ok ? 'ok' : ''}"><span class="rw-days">${r.days}🔥</span><span class="rw-title">${r.title}<span class="rw-bar"><i style="width:${Math.min(100, cur / r.days * 100)}%"></i></span></span>${got ? '<span class="tag">Đã nhận</span>' : `<button class="btn sm" data-act="rw-claim" data-code="${r.code}" ${ok ? '' : 'disabled'}>Đổi</button>`}</div>`; }).join('')}
          <p class="muted small">Mỗi ngày chụp 1 ảnh ly Phúc Long để giữ chuỗi. Lỡ 1 ngày chuỗi sẽ về 0.</p></div>
      </section>

      <div class="grid grid-2" style="align-items:start">
        <div>
          <div class="section"><h2>Bạn bè đang uống gì</h2></div>
          <div class="snap-grid">${feed.map(f => { const a = userById(f.user); return `<article class="snap">
            <div class="snap-photo">${f.photo ? `<img src="${f.photo}" alt="Ảnh check-in">` : Friends.snapArt(f)}<span class="snap-user">${Avatar.render(a.avatar, 28)}<b>${esc(f.user === 'me' ? 'Bạn' : a.name)}</b><small>${timeAgo(f.time)}</small></span></div>
            <div class="snap-body"><b>🧋 ${esc(f.drinkName)}</b><small>📍 ${esc(f.store)}</small>${f.note ? `<p>${esc(f.note)}</p>` : ''}
              <div class="snap-react">${['💚', '😍', '😂', '🔥'].map(em => `<button data-act="react" data-id="${f.id}" data-em="${em}">${em} ${f.reacts[em] || ''}</button>`).join('')}${f.user !== 'me' ? `<button class="link small" data-act="same-drink" data-id="${f.drink}" data-who="${esc(a.name)}">Uống giống bạn →</button>` : ''}</div></div></article>`; }).join('') || '<div class="empty card">Chưa có gì – chụp ảnh đầu tiên hoặc kết bạn nhé!</div>'}</div>
        </div>
        <div>
          <div class="section"><h2>Bạn bè (${fids.length})</h2></div>
          <div class="card">
            <div class="mycode">Mã kết bạn của bạn: <b>${code}</b> <button class="link small" data-act="copy-code" data-code="${code}">Sao chép</button></div>
            <form class="row" data-form="add-friend" style="margin:10px 0"><input class="input" name="q" placeholder="Nhập mã (VD: PL-1986) hoặc @tên" aria-label="Mã kết bạn"><button class="btn sm">Kết bạn</button></form>
            ${fids.map(id => { const f = byId(DATA.seedUsers, id), last = DATA.friendActivity.find(a => a.user === id); return `<div class="friend-row">${Avatar.render(f.avatar, 44)}<div><b>${esc(f.name)}</b><small>@${esc(f.handle)} · 🔥 ${DATA.friendStreaks[id]} ngày</small>${last ? `<small>Đang mê: ${esc(drink(last.drink).name)}</small>` : ''}</div><button class="link small" data-act="unfriend" data-id="${id}">Huỷ</button></div>`; }).join('')}
          </div>
          ${suggest.length ? `<div class="section"><h2>Gợi ý kết bạn</h2></div><div class="card">${suggest.map(f => `<div class="friend-row">${Avatar.render(f.avatar, 44)}<div><b>${esc(f.name)}</b><small>@${esc(f.handle)} · ${DATA.friendCodes[f.id]}</small></div><button class="btn sm" data-act="add-friend" data-id="${f.id}">+ Kết bạn</button></div>`).join('')}</div>` : ''}
        </div>
      </div>`;
  };

  function addFriend(id) {
    const f = byId(DATA.seedUsers, id);
    if (!f || friendIds().includes(id)) return;
    toast(`📨 Đã gửi lời mời kết bạn tới <b>${esc(f.name)}</b>`);
    setTimeout(() => { Store.set('friends', [...friendIds(), id]); toast(`🤝 <b>${esc(f.name)}</b> đã chấp nhận lời mời!`); if (location.hash.startsWith('#friends') || location.hash === '#home' || !location.hash) render(true); }, 1500);
  }

  Object.assign(A, {
    'add-friend': el => addFriend(el.dataset.id),
    unfriend: el => { Store.set('friends', friendIds().filter(x => x !== el.dataset.id)); render(true); },
    'copy-code': el => (navigator.clipboard?.writeText(el.dataset.code) || Promise.reject()).then(() => toast('🔗 Đã sao chép mã kết bạn'), () => toast('Mã của bạn: ' + el.dataset.code)),
    react: el => {
      const id = el.dataset.id, em = el.dataset.em;
      if (id.startsWith('fa')) {
        const all = Store.get('reacts', {}); const base = DATA.friendActivity[+id.slice(2)].reacts[em] || 0;
        all[id] = { ...(all[id] || {}), [em]: ((all[id] || {})[em] ?? base) + 1 }; Store.set('reacts', all);
      } else {
        Store.set('checkins', Streak.checkins().map(c => c.id === id ? { ...c, reacts: { ...(c.reacts || {}), [em]: ((c.reacts || {})[em] || 0) + 1 } } : c));
      }
      render(true);
    },
    'same-drink': el => openDrink(el.dataset.id, { from: `Gợi ý từ ly ${el.dataset.who} đang uống` }),
    'day-next': () => { Store.set('dayOffset', Store.get('dayOffset', 0) + 1); toast('⏩ (Demo) Đã chuyển sang ngày mới – chụp ảnh để giữ chuỗi!'); render(true); },
    'rw-claim': el => {
      const r = DATA.streakRewards.find(x => x.code === el.dataset.code);
      Store.set('streakClaimed', [...Store.get('streakClaimed', []), r.code]);
      State.vouchers = [...State.vouchers, { code: r.code, title: r.title, desc: `Quà chuỗi Phúc Long ${r.days} ngày` }];
      toast(`🎟️ Nhận voucher <b>${esc(r.title)}</b> – mã ${r.code}`, 4500); render(true);
    },
    'cam-open': openCamera,
  });
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form="add-friend"]'); if (!f) return;
    e.preventDefault();
    const q = f.q.value.trim().toUpperCase().replace(/^@/, '');
    const id = Object.keys(DATA.friendCodes).find(x => DATA.friendCodes[x] === q) || DATA.seedUsers.find(x => x.handle.toUpperCase() === q)?.id;
    if (!id) { toast('Không tìm thấy mã/tên này – thử PL-1986 nhé'); return; }
    if (friendIds().includes(id)) { toast('Hai bạn đã là bạn bè rồi 💚'); return; }
    addFriend(id);
  });

  // ---- Chụp ảnh tức thì ----
  let stream = null, shot = null;
  const stopCam = () => { stream?.getTracks().forEach(t => t.stop()); stream = null; };
  new MutationObserver(() => { if (document.getElementById('modal').hidden) stopCam(); }).observe(document.getElementById('modal'), { attributes: true, attributeFilter: ['hidden'] });

  function camForm() {
    return `<div class="cam">
      <div class="cam-view">${shot ? `<img src="${shot}" alt="Ảnh vừa chụp">` : `<video id="camVideo" autoplay playsinline muted></video><div class="cam-hint" id="camHint">Đang mở camera…</div>`}</div>
      ${shot ? `<div class="row" style="justify-content:center"><button class="btn ghost sm" data-act="cam-retake">↺ Chụp lại</button></div>
        <label class="field"><span>Bạn đang uống</span><select class="input" id="camDrink">${DATA.drinks.filter(d => d.cat !== 'cake').map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></label>
        <label class="field"><span>Tại</span><select class="input" id="camStore">${DATA.stores.map(s => `<option>${esc(s)}</option>`).join('')}</select></label>
        <label class="field"><span>Ghi chú</span><input class="input" id="camNote" maxlength="80" placeholder="Một câu cho bạn bè…"></label>
        <button class="btn gold block" data-act="cam-post">Đăng & giữ chuỗi 🔥</button>`
      : `<div class="row" style="justify-content:center;gap:16px"><button class="cam-shutter" data-act="cam-snap" aria-label="Chụp"></button></div>
        <label class="btn ghost sm" style="cursor:pointer;align-self:center">🖼️ Hoặc chọn ảnh có sẵn<input type="file" accept="image/*" capture="environment" class="sr" data-in="cam-file"></label>`}
    </div>`;
  }
  async function startCam() {
    const v = document.getElementById('camVideo'); if (!v) return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      v.srcObject = stream; document.getElementById('camHint')?.remove();
    } catch {
      const h = document.getElementById('camHint'); if (h) h.textContent = 'Không mở được camera – hãy chọn ảnh có sẵn bên dưới.';
    }
  }
  function openCamera() { shot = null; openModal('📸 Check-in Phúc Long', camForm()); startCam(); }
  const refreshCam = () => { const c = document.querySelector('.cam'); if (c) c.outerHTML = camForm(); if (!shot) startCam(); };
  Object.assign(A, {
    'cam-snap': () => {
      const v = document.getElementById('camVideo');
      if (!v || !v.videoWidth) { toast('Camera chưa sẵn sàng – hãy chọn ảnh có sẵn'); return; }
      const s = Math.min(v.videoWidth, v.videoHeight), c = document.createElement('canvas'); c.width = c.height = 480;
      c.getContext('2d').drawImage(v, (v.videoWidth - s) / 2, (v.videoHeight - s) / 2, s, s, 0, 0, 480, 480);
      shot = c.toDataURL('image/jpeg', 0.72); stopCam(); refreshCam();
    },
    'cam-retake': () => { shot = null; refreshCam(); },
    'cam-post': () => {
      const was = Streak.current(), wasToday = Streak.today();
      const c = { id: uid(), day: dayKey(), time: Date.now(), photo: shot, drinkId: document.getElementById('camDrink').value, store: document.getElementById('camStore').value, note: document.getElementById('camNote').value.trim(), reacts: {} };
      if (!Store.set('checkins', [c, ...Streak.checkins()])) { toast('⚠️ Bộ nhớ trình duyệt đầy – thử ảnh nhỏ hơn'); return; }
      closeModal();
      const now = Streak.current();
      toast(wasToday ? '📸 Đã đăng thêm ảnh hôm nay' : `🔥 Chuỗi Phúc Long: <b>${now} ngày</b>${now > was ? ' (+1)' : ''}`, 4000);
      DATA.streakRewards.filter(r => now >= r.days && was < r.days).forEach(r => setTimeout(() => toast(`🎁 Đạt mốc ${r.days} ngày – vào mục Bạn bè để đổi voucher!`, 4500), 800));
      go('friends');
    },
  });
  document.addEventListener('change', async e => {
    if (e.target.dataset?.in !== 'cam-file' || !e.target.files[0]) return;
    try { shot = await resizeImage(e.target.files[0]); stopCam(); refreshCam(); } catch { toast('Không đọc được ảnh này'); }
  });

  // ================= MÔ PHỎNG CỬA HÀNG =================
  const SPOTS = {
    hoian: {
      out: [[50, 24, 'Biển hiệu xanh Phúc Long', 'Giữ nguyên màu xanh nhận diện, đặt trên mái ngói âm dương – “thay áo, không thay hồn”.'], [36, 58, 'Đèn lồng lụa', 'Dây đèn lồng nhiều màu, buổi tối thắp sáng cả mặt tiền để du khách dừng chân chụp ảnh.'], [50, 70, 'Cửa gỗ & quầy order', 'Gọi món signature qua QR ngay cửa, không cần xếp hàng.'], [14, 92, 'Bến thuyền sông Hoài', 'Mua ly Local Collector và ngắm đèn hoa đăng từ thuyền.']],
      in: [[25, 40, 'Bức tường Trà Di sản', 'Trưng bày các dòng trà quý và câu chuyện Phúc Long cùng phố Hội.'], [27, 74, 'Quầy pha chế', 'Nhân viên pha theo định lượng chuẩn – 80% menu toàn quốc + 20% món Hội An.'], [75, 18, 'Đèn lồng lụa xanh', 'Đèn lồng làm thủ công cùng làng nghề địa phương.'], [80, 82, 'Bàn ghế mây tre', 'Góc ngồi lâu, nhìn ra giếng trời tiểu cảnh.']],
    },
    dalat: {
      out: [[50, 38, 'Cửa kính mái tam giác', 'Không gian mở 360° đón nắng và view đồi thông.'], [50, 88, 'Lò sưởi ngoài trời', 'Buổi tối se lạnh, ngồi quanh lửa pha trà nóng.'], [8, 60, 'Rừng thông', 'Góc check-in sương mù buổi sáng.'], [30, 48, 'Dây đèn vàng', 'Ánh sáng ấm cho những buổi tối Đà Lạt.']],
      in: [[25, 40, 'Bức tường Trà Di sản', 'Các dòng trà ô long và câu chuyện cao nguyên.'], [82, 52, 'Lò sưởi trong nhà', 'Workshop “pha trà nóng bên lò sưởi” tối thứ Bảy.'], [27, 74, 'Quầy pha chế', 'Món signature: Trà ô long kem bơ Đà Lạt – chỉ bán tại chỗ.'], [80, 84, 'Góc gỗ thông', 'Bàn gỗ, ghế đệm len cho người ngồi làm việc.']],
    },
    hanoi: {
      out: [[50, 30, 'Cửa chớp gỗ xanh lá', 'Cửa chớp kiểu phố cổ sơn đúng màu xanh Phúc Long.'], [50, 47, 'Ban công hoa giấy', 'Hoa giấy hồng rủ xuống – góc chụp ảnh từ dưới phố.'], [21, 40, 'Cây bàng', 'Lá bàng đổi màu theo mùa, gắn với ký ức Hà Nội.'], [52, 90, 'Ghế đẩu vỉa hè', 'Gợi nhớ văn hoá trà đá vỉa hè – ngồi ngắm phố.'], [82, 84, 'Xe đạp hoa', 'Xe hoa theo mùa – mỗi mùa một màu hoa để check-in.']],
      in: [[25, 40, 'Bức tường Trà Di sản', 'Trà sen, trà cốm và câu chuyện thưởng trà của người Hà Nội.'], [82, 42, 'Bình gốm Bát Tràng & sen', 'Workshop ướp trà sen thủ công sáng Chủ nhật.'], [27, 74, 'Quầy pha chế', 'Signature: Trà sen Tây Hồ, chỉ bán tại cửa hàng.'], [80, 84, 'Ghế đẩu xanh', 'Bàn ghế thấp như quán trà phố cổ, ấm cúng.']],
    },
  };
  let storeView = 'out', storeSpot = null, storePhoto = 0, storeId = null;
  // ảnh thật của từng cửa hàng (theo tài liệu đề án)
  const PHOTOS = DATA.storePhotos;

  routes.store = id => {
    const h = byId(DATA.hubs, id) || byId(DATA.hubs, 'hoian');
    if (storeId !== h.id) { storeId = h.id; storePhoto = 0; }
    const spots = SPOTS[h.id]?.[storeView] || [];
    const got = State.stamps.includes(h.id);
    const sigCup = { name: h.signature.name, look: h.id === 'dalat' ? 'milk' : 'ice', c: h.id === 'dalat' ? ['#F3E9C9', '#B98758'] : h.id === 'hanoi' ? ['#F4EFD9', '#E7D7A8'] : ['#F6EAD0', '#E8C98E'], fruit: h.id === 'hoian' ? 'nhan' : h.id === 'hanoi' ? 'vai' : null, top: h.id === 'dalat' ? 'kem' : null };
    const others = DATA.hubs.filter(x => x.type === 'Destination' && x.id !== h.id);
    return `<div class="store-head"><a class="link small" href="#hubs">← Tất cả cửa hàng</a><span class="eyebrow">${esc(h.city)} · Destination Hub</span><h1 class="bb-title"><span>${esc(h.name)}</span></h1></div>
      <div class="store-sim">
        <div class="store-gallery">
          <figure class="sg-main"><img src="${PHOTOS[h.id][storePhoto] || PHOTOS[h.id][0]}" alt="${esc(h.name)} – ảnh ${storePhoto + 1}"><figcaption>${storePhoto + 1}/${PHOTOS[h.id].length}</figcaption>
            <button class="sg-nav prev" data-act="sg-go" data-d="-1" aria-label="Ảnh trước">‹</button><button class="sg-nav next" data-act="sg-go" data-d="1" aria-label="Ảnh sau">›</button></figure>
          <div class="sg-thumbs">${PHOTOS[h.id].map((src, i) => `<button class="${i === storePhoto ? 'on' : ''}" data-act="sg-pick" data-i="${i}" aria-label="Xem ảnh ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}</div>
          <div class="sg-spots"><b>Điểm nổi bật</b>${[...(SPOTS[h.id]?.out || []), ...(SPOTS[h.id]?.in || [])].map(([, , t, d]) => `<span class="chip" title="${esc(d)}">${esc(t)}</span>`).join('')}</div>
        </div>
        <aside class="sim-info card">
          <p>${esc(h.space)}</p>
          <div class="sig">${Cups.render(sigCup, 70)}<div><span class="tag gold">Chỉ bán tại đây</span><b>${esc(h.signature.name)}</b><span>${money(h.signature.price)}</span></div></div>
          <div class="small"><b>Local Collector:</b> ${esc(h.collector.name)} · còn ${h.collector.left - State.preorders.filter(p => p.hub === h.id).length}/${h.collector.total}</div>
          <div class="small"><b>Workshop:</b> ${esc(h.workshop)}</div>
          <div class="row wrap" style="margin-top:12px">
            <button class="btn sm ${got ? 'soft' : ''}" data-act="checkin" data-hub="${h.id}" ${got ? 'disabled' : ''}>${got ? '✅ Đã có dấu mộc' : '🛂 Check-in nhận dấu'}</button>
            <button class="btn sm ghost" data-act="table-order" data-hub="${h.id}">Gọi món tại bàn</button>
            <button class="btn sm ghost" data-act="preorder" data-hub="${h.id}">Pre-order ly</button>
            <button class="btn sm ghost" data-act="workshop" data-hub="${h.id}">Đăng ký workshop</button>
          </div>
        </aside>
      </div>
      <div class="section"><h2>Ghé cửa hàng khác</h2></div>
      <div class="grid grid-2">${others.map(x => `<a class="card store-card" href="#store/${x.id}"><div class="store-thumb">${PHOTOS[x.id] ? `<img src="${PHOTOS[x.id][0]}" alt="${esc(x.name)}" loading="lazy">` : Scenes.storeOutside(x.id)}</div><div class="store-info"><span class="eyebrow">${esc(x.city)}</span><b>${esc(x.name)}</b><small>Tham quan →</small></div></a>`).join('')}</div>`;
  };
  Object.assign(A, {
    spot: el => { const i = +el.dataset.i; storeSpot = storeSpot === i ? null : i; render(true); },
    'sg-pick': el => { storePhoto = +el.dataset.i; render(true); },
    'sg-go': el => { const n = (PHOTOS[storeId] || [1]).length; storePhoto = (storePhoto + +el.dataset.d + n) % n; render(true); },
    'sim-view': el => { storeView = el.dataset.v; storeSpot = null; render(true); },
    workshop: el => { const h = byId(DATA.hubs, el.dataset.hub); toast(`🎨 Đã giữ chỗ workshop “${esc(h.workshop)}” tại ${esc(h.city)}`); },
  });
  window.addEventListener('hashchange', () => { storeSpot = null; });
})();

// thanh menu: thêm nền khi cuộn khỏi ảnh bìa
window.addEventListener('scroll', () => document.body.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
