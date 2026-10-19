// Lưu trữ demo bằng localStorage (bọc try/catch để chạy được cả khi bị chặn)
const Store = (() => {
  const PREFIX = 'pl-tealab:';
  const mem = {};

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw != null) return JSON.parse(raw);
    } catch (e) { if (key in mem) return mem[key]; }
    return key in mem ? mem[key] : structuredClone(fallback);
  }

  function set(key, val) {
    mem[key] = val;
    try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); return true; }
    catch (e) { return false; }
  }

  function reset() {
    try {
      Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
    } catch (e) {}
    Object.keys(mem).forEach(k => delete mem[k]);
  }

  return { get, set, reset };
})();

// Trạng thái ứng dụng
const State = {
  get user() { return Store.get('user', null); },
  set user(v) { Store.set('user', v); },

  get recipes() { return Store.get('recipes', []); },
  set recipes(v) { Store.set('recipes', v); },

  get orders() { return Store.get('orders', []); },
  set orders(v) { Store.set('orders', v); },

  get posts() {
    let posts = Store.get('posts', null);
    if (!posts) {
      const now = Date.now();
      posts = DATA.seedPosts.map(p => ({
        ...p, time: now - p.ago * 60000, liked: false, reposted: false, reported: false,
        replies: p.replies.map(r => ({ ...r, time: now - r.ago * 60000 })),
      }));
      Store.set('posts', posts);
    }
    return posts;
  },
  set posts(v) { Store.set('posts', v); },

  get votes() { return Store.get('votes', []); },
  set votes(v) { Store.set('votes', v); },

  get vouchers() { return Store.get('vouchers', []); },
  set vouchers(v) { Store.set('vouchers', v); },

  get stamps() { return Store.get('stamps', []); },
  set stamps(v) { Store.set('stamps', v); },

  get bookings() { return Store.get('bookings', []); },
  set bookings(v) { Store.set('bookings', v); },

  get preorders() { return Store.get('preorders', []); },
  set preorders(v) { Store.set('preorders', v); },
};
