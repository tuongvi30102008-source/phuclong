// =====================================================================
// NHÂN VẬT "ĐỒNG QUÊ ĐÊM TRĂNG" (SVG ghép lớp) – tủ đồ #studio & ảnh đại diện toàn trang
// Phong cách: tranh phẳng nét mực đậm, tỉ lệ thanh mảnh (~6,5 đầu), áo bà ba / áo dài / áo tứ thân,
// quần đen xắn gối, nón lá, khăn vấn, bát cơm, bó mạ, đèn bão; nền đồng lúa dưới trăng.
// - Toàn bộ nhân vật nằm trong MỘT object trạng thái (xem DEFAULT), vẽ thẳng trong khung 400 x 820.
// - Mỗi bộ phận là một <g data-layer="…">, xếp chồng theo thứ tự LAYERS.
// - Màu dùng biến CSS (--skin, --hair, --top…) nên đổi màu chỉ cần đổi biến.
// =====================================================================
const Avatar = (() => {
  const O = '#2a2438';                                   // nét mực
  const LN = `stroke="${O}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
  const LT = `stroke="${O}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" fill="none"`;
  const LTB = `stroke="${O}" stroke-linejoin="round" stroke-linecap="round" fill="none"`;   // nét chỉ (tự đặt độ dày)
  const F = v => `style="fill:var(--${v})"`;
  const S = v => `style="stroke:var(--${v})"`;
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16), c = x => Math.max(0, Math.min(255, x + amt));
    return '#' + ((1 << 24) | (c(n >> 16) << 16) | (c((n >> 8) & 255) << 8) | c(n & 255)).toString(16).slice(1);
  };
  const warm = hex => { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) * .95, g = ((n >> 8) & 255) * .86, b = (n & 255) * .82; return '#' + ((1 << 24) | (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)).toString(16).slice(1); };
  const mx = d => d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(400 - x).toFixed(1)} ${y}`);   // lật trái ↔ phải quanh x = 200
  const rnd = k => { const v = Math.sin(k * 12.9898 + 4.1) * 43758.5453; return v - Math.floor(v); };

  // ---------- Bảng màu ----------
  const SKINS = ['#fff0e6', '#fbe0cc', '#f8d9c2', '#f1c6a6', '#e9b48e', '#dfa078', '#d08d63', '#bb7850', '#a36440', '#8a5233', '#6e3f27', '#53301e'];
  const HAIRC = ['#1c1a24', '#4a3226', '#6e4a30', '#94673f', '#b98a52', '#dcc08a', '#2e4278', '#7a2e3a', '#4f6b3a', '#9e9aa6', '#ece6da', '#c8662d'];
  const EYEC = ['#2a2024', '#6b4426', '#a8743e', '#2e4a8a', '#4f8fc0', '#3f7a4a', '#7a5aa8', '#a83a3a', '#c9a23a'];
  const CLOTH = ['#c8372d', '#e0564a', '#7cc46a', '#3f8f5a', '#4f6fb8', '#2b3f7a', '#f2c14e', '#f4ead5', '#8a5a3a', '#23202b', '#e98fa6', '#7fc3c9'];

  // ---------- Trạng thái mặc định: cô gái áo bà ba đỏ, khăn vấn, bưng bát cơm trên bờ ruộng ----------
  const DEFAULT = { v: 6, name: '', face: 0, skin: '#f8d9c2', hair: 0, hairColor: '#1c1a24', fringe: 0, eyes: 0, eyeColor: '#2a2024', brows: 0, mouth: 0, blush: 0,
    top: 0, topColor: '#c8372d', outer: -1, outerColor: '#f4ead5', dress: -1, dressColor: '#f4ead5', bottom: 0, bottomColor: '#23202b',
    shoes: 0, shoeColor: '#c8372d', socks: -1, accessories: [1], pose: 2, bg: 0, unlocked: [] };

  // ---------- Mốc toạ độ (khung 400 x 820, tâm x = 200) ----------
  const EYE_L = [181, 140], EYE_R = [219, 140];
  const TORSO = 'M180 205 Q200 213 220 205 Q244 209 251 228 Q247 276 239 318 Q243 346 246 372 L154 372 Q157 346 161 318 Q153 276 149 228 Q156 209 180 205Z';
  const LEGL = 'M156 368 Q151 452 164 548 Q168 640 176 728 L194 728 Q192 640 194 548 Q200 452 200 380Z', LEGR = mx(LEGL);
  const FOOTL = 'M176 722 L194 722 Q198 742 197 752 Q195 763 182 763 L165 763 Q156 761 160 752 Q167 744 176 722Z', FOOTR = mx(FOOTL);
  let P = 'p', gid = 0;                                  // tiền tố id <pattern>, đổi mỗi lần vẽ để không đụng nhau giữa các ảnh

  // ---------- Hoa văn vải (pattern dùng biến màu của từng món) ----------
  function pat(kind, c) {
    const id = `${P}-${c}`, bg = `<rect width="40" height="40" ${F(c)}/>`;
    const L = `style="fill:var(--${c}-l)"`, D = `style="fill:var(--${c}-d)"`;
    const body = {
      hoa: [16, `${bg}<g ${L}><circle cx="4" cy="4" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="2" cy="4" r="1"/><circle cx="6" cy="4" r="1"/><circle cx="4" cy="2" r="1"/><circle cx="4" cy="6" r="1"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="12" cy="14" r="1"/></g><circle cx="4" cy="4" r=".8" fill="#f2c14e"/><circle cx="12" cy="12" r=".8" fill="#f2c14e"/><g ${D}><circle cx="12" cy="4" r=".9"/><circle cx="4" cy="12" r=".9"/></g>`],
      keo: [12, `${bg}<rect width="6" height="12" ${L} opacity=".5"/><rect width="12" height="6" ${L} opacity=".5"/><path d="M0 .5 H12 M.5 0 V12" ${S(c + '-d')} stroke-width=".8" opacity=".6"/>`],
      tram: [14, `${bg}<path d="M7 0 L14 7 L7 14 L0 7Z" fill="none" ${S(c + '-l')} stroke-width="1.3"/><rect x="5.6" y="5.6" width="2.8" height="2.8" transform="rotate(45 7 7)" ${D}/><circle cx="0" cy="0" r="1" ${L}/><circle cx="14" cy="14" r="1" ${L}/>`],
      soc: [10, `${bg}<rect width="10" height="3.5" ${L}/><rect y="7" width="10" height="1" ${D} opacity=".6"/>`],
      sen: [40, `${bg}<g fill="#f4a3b8" stroke="#c8607a" stroke-width=".6" transform="scale(1.25)"><path d="M8 12 Q4 6 8 2 Q12 6 8 12Z"/><path d="M8 12 Q2 10 1 5 Q6 6 8 12Z"/><path d="M8 12 Q14 10 15 5 Q10 6 8 12Z"/><path d="M24 28 Q20 22 24 18 Q28 22 24 28Z"/><path d="M24 28 Q18 26 17 21 Q22 22 24 28Z"/><path d="M24 28 Q30 26 31 21 Q26 22 24 28Z"/></g><path d="M8 12 Q9 16 12 18 M24 28 Q25 31 28 32" fill="none" ${S(c + '-d')} stroke-width=".8"/>`],
      tho: [20, `${bg}<rect y="0" width="20" height="5" fill="#c8372d"/><path d="M0 5 L5 1 L10 5 L15 1 L20 5" fill="none" stroke="#f2c14e" stroke-width="1.2"/><rect y="12" width="20" height="2" ${L}/><path d="M2 17 h3 M9 17 h3 M16 17 h3" stroke="#f2c14e" stroke-width="1.4"/>`],
    }[kind];
    return `<defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="${body[0]}" height="${body[0]}">${body[1]}</pattern></defs>`;
  }
  const paint = (it, c) => it.fixed ? `fill="${it.fixed}"` : it.pat ? `fill="url(#${P}-${c})"` : F(c);
  const defsOf = (it, c) => it.pat && !it.fixed ? pat(it.pat, c) : '';

  // ===== DANH SÁCH VẬT PHẨM =====
  // Dáng mặt (rộng ~92, đỉnh y≈70, cằm y≈186)
  const FACES = [
    ['Trái xoan', 'M154 128 Q154 70 200 70 Q246 70 246 128 Q246 160 228 176 Q214 188 200 189 Q186 188 172 176 Q154 160 154 128Z'],
    ['Tròn', 'M151 130 Q151 70 200 70 Q249 70 249 130 Q249 185 200 187 Q151 185 151 130Z'],
    ['Trái tim', 'M150 116 Q150 70 200 70 Q250 70 250 116 Q248 150 226 172 Q212 186 200 192 Q188 186 174 172 Q152 150 150 116Z'],
    ['Dài', 'M158 122 Q158 66 200 66 Q242 66 242 122 L242 162 Q240 194 200 197 Q160 194 158 162Z'],
    ['Kim cương', 'M164 106 Q174 70 200 70 Q226 70 236 106 Q252 132 244 152 Q232 178 200 192 Q168 178 156 152 Q148 132 164 106Z'],
    ['Quả lê', 'M162 112 Q164 70 200 70 Q236 70 238 112 Q252 146 246 166 Q236 187 200 189 Q164 187 154 166 Q148 146 162 112Z'],
    ['Bầu bĩnh', 'M158 118 Q158 70 200 70 Q242 70 242 118 Q258 146 254 168 Q244 194 200 194 Q156 194 146 168 Q142 146 158 118Z'],
  ].map(([name, d], i) => ({ name, chin: [189, 187, 192, 197, 192, 189, 194][i], draw: () => `<ellipse cx="153" cy="138" rx="7" ry="11" ${F('skin')} ${LN}/><ellipse cx="247" cy="138" rx="7" ry="11" ${F('skin')} ${LN}/>
    <path d="M151 134 q4 0 4 6 M249 134 q-4 0 -4 6" fill="none" ${S('skin-d')} stroke-width="2"/>
    <path d="${d}" ${F('skin')} ${LN}/>
    <path d="M200 150 Q203 156 198 158" fill="none" ${S('skin-d')} stroke-width="1.8" stroke-linecap="round"/>` }));

  // Tóc: back = sau đầu/thân, front = phía trước (bím, lọn), ties = dây buộc
  const BASE = 'M144 164 Q130 46 200 42 Q270 46 256 164 Q252 170 247 162 L153 162 Q148 170 144 164Z';
  const braid = (pts, n = 8, sc = .62) => {
    let s = ''; for (let k = 0; k < n; k++) {
      const t = k / (n - 1), [x0, y0] = pts[0], [x1, y1] = pts[1], [x2, y2] = pts[2];
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t * t * x2, y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
      const r = (10 - t * 3) * sc;
      s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 1.3).toFixed(1)}" transform="rotate(${k % 2 ? 24 : -24} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    return s;
  };
  const braidEnd = (x, y) => `<path d="M${x - 3} ${y} L${x - 4} ${y + 10} L${x} ${y + 7} L${x + 4} ${y + 10} L${x + 3} ${y}Z" style="fill:var(--hair)" ${LN}/><rect x="${x - 4}" y="${y - 3.5}" width="8" height="4.5" rx="1.5" fill="#c8372d" ${LN}/>`;
  // bím rủ TRƯỚC vai, liền một mạch từ chân tóc → vai → ngực; dây buộc ở cuối bím
  const ROOT_R = 'M244 110 Q260 146 254 180 L242 182 Q248 150 238 116Z';
  const SIDE = 'M138 190 Q120 62 200 50 Q280 62 262 190 Q252 198 244 188 L244 140 L156 140 L156 188 Q148 198 138 190Z';
  // lọn tóc gom từ thái dương, ôm sau tai, thu nhỏ dần vào chân bím
  const LOCK_L = 'M150 100 Q134 130 136 200 Q146 208 160 200 Q156 150 162 110Z';
  const bow = (x, y) => `<path d="M${x} ${y} l-9 -5 l0 10Z M${x} ${y} l9 -5 l0 10Z" fill="#c8372d" ${LN}/><circle cx="${x}" cy="${y}" r="2.6" fill="#9e2a22" ${LN}/><path d="M${x - 2} ${y + 2} l-3 9 M${x + 2} ${y + 2} l3 9" stroke="#c8372d" stroke-width="2.4" stroke-linecap="round"/><path d="M${x - 3} ${y + 12} q3 4 6 0 l-3 -6Z" style="fill:var(--hair)" ${LN}/>`;
  const HAIRS = [
    { name: 'Búi thấp kẹp xanh', back: `<circle cx="240" cy="94" r="22"/><path d="${BASE}"/>`,
      ties: `<path d="M226 80 Q238 72 250 78 L246 88 Q236 84 228 90Z" fill="#7cc46a" ${LN}/><path d="M232 98 q8 -10 16 -2 M236 106 q8 -6 12 0" fill="none" ${S('hair-l')} stroke-width="1.6" opacity=".7"/>` },
    { name: 'Búi tó cao', back: `<circle cx="200" cy="34" r="24"/><path d="${BASE}"/>`,
      ties: `<path d="M178 58 Q200 66 222 58 L220 66 Q200 74 180 66Z" fill="#c8372d" ${LN}/><path d="M186 40 q10 -12 24 -2 M190 48 q8 -6 16 0" fill="none" ${S('hair-l')} stroke-width="1.6" opacity=".7"/>` },
    { name: 'Dài buông', back: `<path d="M146 130 Q128 210 138 262 Q170 272 200 268 Q230 272 262 262 Q272 210 254 130Z"/><path d="${BASE}"/>`,
      front: `<path d="M152 112 Q144 170 152 222 Q160 228 168 220 Q158 170 162 122Z"/><path d="${mx('M152 112 Q144 170 152 222 Q160 228 168 220 Q158 170 162 122Z')}"/>` },
    { name: 'Ngang vai', back: `<path d="M146 130 Q132 180 142 208 Q170 216 200 212 Q230 216 258 208 Q268 180 254 130Z"/><path d="${BASE}"/>` },
    { name: 'Tóc ngắn', back: `<path d="M146 150 Q128 46 200 42 Q272 46 254 150 L246 150 L244 126 L156 126 L154 150Z"/>` },
    { name: 'Đuôi ngựa thấp', back: `<path d="M160 120 Q128 170 132 222 Q136 248 152 262 Q148 226 156 198 Q164 172 176 150Z"/><path d="${BASE}"/>`,
      ties: `<g transform="rotate(18 146 178)"><rect x="135" y="172" width="23" height="12" rx="6" fill="#c8372d" ${LN}/><path d="M141 173 v10 M147 172 v12 M153 173 v10" stroke="#9e2a22" stroke-width="1.4"/><ellipse cx="144" cy="175" rx="4" ry="1.5" fill="#fff" opacity=".35"/></g>` },
  ];
  // Mái & ngôi – mép dưới luôn cao hơn lông mày (y 126)
  const CROWN = 'M148 134 Q136 46 200 44 Q264 46 252 134';
  const FRINGES = [
    ['Rẽ ngôi giữa', `${CROWN} Q248 112 230 102 Q214 95 203 97 L200 88 L197 97 Q186 95 170 102 Q152 112 150 132Z`],
    ['Rẽ ngôi lệch', `${CROWN} Q248 110 224 100 Q192 92 172 106 Q158 116 150 132Z`],
    ['Vén gọn', `${CROWN} Q248 106 200 96 Q152 106 150 132Z`],
    ['Mái thưa', `${CROWN} Q248 112 240 110 L234 98 L228 114 L216 100 L210 116 L200 100 L192 116 L184 100 L176 114 L168 98 L162 110 Q152 112 150 132Z`],
    ['Mái bằng', `${CROWN} Q250 116 242 116 L236 112 L230 117 L170 117 L164 112 L158 116 Q150 116 150 132Z`],
    ['Mái lượn', `${CROWN} Q248 104 232 100 Q206 96 190 108 Q176 118 162 112 Q152 116 150 132Z`],
    ['Mái chạm mày', `${CROWN} Q250 120 242 120 L236 104 L230 120 L218 104 L212 121 L200 104 L190 121 L182 104 L172 120 L166 104 L160 120 Q150 120 150 132Z`],
  ].map(([name, d, locks]) => ({ name, d, locks }));

  // Mắt: vẽ quanh (0,0) cho mắt trái, mắt phải lật gương. Phía -x là đuôi mắt.
  const flick = `<path d="M-9 -1 l-4 -2.5 M-8 -3 l-3 -3.4" stroke="${O}" stroke-width="1.4" stroke-linecap="round"/>`;
  const EYES = [
    ['Hiền nhìn xuống', `<path d="M-6.5 0.5 Q0 5.5 6.5 0.5Z" style="fill:var(--eye)"/><path d="M-3.2 0.8 Q0 4.2 3.2 0.8Z" style="fill:var(--eye-p)"/><path d="M-9 0 Q0 -6 9 0" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>${flick}`],
    ['Cười híp', `<path d="M-8.5 2 Q0 -6 8.5 2" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>${flick}`],
    ['Mắt tròn', `<ellipse rx="5.2" ry="6.2" cy="1" style="fill:var(--eye)"/><ellipse rx="2.6" ry="3.2" cy="1.4" style="fill:var(--eye-p)"/><circle cx="-1.8" cy="-1.4" r="1.8" fill="#fff"/><path d="M-8.5 -3.5 Q0 -10 8.5 -3.5" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>${flick}`],
    ['Mắt phượng', `<path d="M-10 1 Q-3 -6 10 -4 Q3 5 -10 1Z" fill="#fff" stroke="${O}" stroke-width="1.2"/><circle cx="1" cy="-.5" r="3.8" style="fill:var(--eye)"/><circle cx="1" cy="-.5" r="1.8" style="fill:var(--eye-p)"/><circle cx="0" cy="-2" r="1" fill="#fff"/><path d="M-10 1 Q-3 -6 10 -4 L13 -7" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>`],
    ['Long lanh', `<ellipse rx="8" ry="7" fill="#fff" stroke="${O}" stroke-width="1"/><ellipse rx="5.6" ry="6.6" cy=".5" style="fill:var(--eye)"/><circle cy="1" r="2.8" style="fill:var(--eye-p)"/><circle cx="-2.2" cy="-2.2" r="2" fill="#fff"/><circle cx="2.4" cy="3" r="1" fill="#fff"/><path d="M-9.5 -3 Q0 -11 9.5 -3" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>${flick}`],
    ['Khép hờ', `<path d="M-6 -1 Q0 6 6 -1Z" style="fill:var(--eye)"/><path d="M-3 -.6 Q0 4 3 -.6Z" style="fill:var(--eye-p)"/><circle cx="-2" cy="1" r="1" fill="#fff"/><path d="M-9 -1 Q0 -3 9 -1" fill="none" stroke="${O}" stroke-width="2.8" stroke-linecap="round"/>${flick}`],
    ['Nháy mắt', 'WINK'],
    ['Ngái ngủ', `<path d="M-9 1 Q0 5 9 1" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/><path d="M-5 3.5 l-1 3 M0 4.5 v3 M5 3.5 l1 3" stroke="${O}" stroke-width="1.2" stroke-linecap="round"/>`],
  ].map(([name, g], i) => ({ name, g, dy: [-1.5, 0, 0, 0, 0, -1, 0, -2.5][i], noColor: i === 1 || i === 7 }));
  const BROWS = [
    ['Lá liễu', 'M-9 1 Q0 -3.5 9 0', 2], ['Thẳng', 'M-9 0 H9', 2], ['Cong cao', 'M-9 2 Q-1 -6 9 -1', 2], ['Nhíu', 'M-9 -3 L9 2', 2.4],
    ['Lo lắng', 'M-9 2 L9 -3', 2.2], ['Đậm', 'M-10 1.5 Q0 -4 10 0', 3.4], ['Mảnh', 'M-8 .5 Q0 -2.5 8 .5', 1.2], ['Ngắn', 'M-4 0 H4', 3],
  ].map(([name, d, w]) => ({ name, d, w }));
  const MOUTHS = [
    ['Cười mỉm', `<path d="M-6 -1 Q0 4.5 6 -1 Q0 1.5 -6 -1Z" fill="#c2453a" stroke="#8a2a24" stroke-width="1" stroke-linejoin="round"/>`],
    ['Cười tươi', `<path d="M-8 -2 Q0 10 8 -2Z" fill="#9b2f2a" stroke="${O}" stroke-width="1.4" stroke-linejoin="round"/><path d="M-6 -1.4 Q0 .6 6 -1.4 L5 1 Q0 2.4 -5 1Z" fill="#fff"/>`],
    ['Môi hồng', `<path d="M-6 0 Q-3 -3 0 -1.4 Q3 -3 6 0 Q0 5 -6 0Z" fill="#d0505a" stroke="#8a2a24" stroke-width=".9"/><path d="M-6 0 H6" stroke="#8a2a24" stroke-width=".8"/>`],
    ['Bình thản', `<path d="M-5 0 Q0 1 5 0" fill="none" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>`],
    ['Chữ O', `<ellipse rx="3.4" ry="4.2" fill="#9b2f2a" stroke="${O}" stroke-width="1.4"/>`],
    ['Chu môi', `<path d="M-3.6 .5 Q-3.6 -3 0 -1.4 Q3.6 -3 3.6 .5 Q0 4.6 -3.6 .5Z" fill="#d0505a" stroke="#8a2a24" stroke-width="1"/><circle cx="-1.2" cy="-.6" r=".7" fill="#fff" opacity=".7"/>`],
    ['Cười lém', `<path d="M-5 0 Q2 3 7 -3" fill="none" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>`],
    ['Lè lưỡi', `<path d="M-6 -1 Q0 4 6 -1" fill="none" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/><path d="M-3 1.6 Q0 9 3 1.6Z" fill="#e8707a" stroke="${O}" stroke-width="1.1"/>`],
  ].map(([name, g]) => ({ name, g }));
  const BLUSHES = [
    ['Hồng đào', '<ellipse rx="11" ry="6" fill="#f08a8a" opacity=".22"/><ellipse rx="7" ry="4" fill="#f08a8a" opacity=".25"/>'],
    ['Đỏ má', '<ellipse rx="9" ry="6" fill="#e0564a" opacity=".38"/>'],
    ['Gạch chéo', '<path d="M-6 3 l3 -6 M-1 3 l3 -6 M4 3 l3 -6" stroke="#e0564a" stroke-width="1.5" stroke-linecap="round"/>'],
    ['Nắng cháy', '<ellipse rx="13" ry="7" fill="#d9734a" opacity=".3"/>'],
    ['Tàn nhang', '<g fill="#a86a4a"><circle cx="-5" cy="-1" r="1.1"/><circle cx="0" cy="1" r="1.1"/><circle cx="5" cy="-1" r="1.1"/><circle cx="-2" cy="4" r="1"/><circle cx="3" cy="4" r="1"/></g>'],
    ['Má đỏ hây', '<ellipse rx="15" ry="9" fill="#e8506a" opacity=".45"/><ellipse cx="-4" cy="-2" rx="3" ry="1.6" fill="#fff" opacity=".6"/>'],
    ['Lấp lánh', '<ellipse rx="9" ry="5" fill="#f08a8a" opacity=".35"/><path d="M7 -8 l1.3 2.6 2.6 1.3 -2.6 1.3 -1.3 2.6 -1.3 -2.6 -2.6 -1.3 2.6 -1.3Z" fill="#fff"/>'],
    ['Cam đào', '<ellipse rx="11" ry="6.5" fill="#f07a3a" opacity=".55"/>'],
  ].map(([name, g]) => ({ name, g }));

  // ---------- Quần áo ----------
  const tunic = (hem, fl = 0) => { const m = Math.round((318 + hem) / 2); return `M180 205 Q200 213 220 205 Q244 209 251 228 Q247 276 239 318 Q${244 + fl} ${m} ${248 + fl} ${hem} Q200 ${hem + 8} ${152 - fl} ${hem} Q${156 - fl} ${m} 161 318 Q153 276 149 228 Q156 209 180 205Z`; };
  const COLLAR = {
    tron: () => `<path d="M182 206 Q200 222 218 206" ${LTB} stroke-width="2"/>`,
    dung: c => `<path d="M183 197 Q200 203 217 197 L218 210 Q200 217 182 210Z" style="fill:var(--${c}-d)" ${LN}/>`,
    cheo: c => COLLAR.dung(c) + `<path d="M200 215 Q224 222 244 240" ${LTB} stroke-width="1.8"/>${[[212, 218], [226, 224], [238, 233]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#f2c14e" stroke="${O}" stroke-width=".8"/>`).join('')}`,
    somi: c => `<path d="M182 203 L200 224 L190 232 L176 210Z M218 203 L200 224 L210 232 L224 210Z" style="fill:var(--${c}-l)" ${LN}/>`,
  };
  const buttons = (y0, y1, n) => Array.from({ length: n }, (_, k) => `<circle cx="200" cy="${(y0 + (y1 - y0) * k / (n - 1)).toFixed(0)}" r="2.2" fill="#f4ead5" stroke="${O}" stroke-width="1"/>`).join('');
  const slits = (hem, len = 44) => `<path d="M156 ${hem - len} Q157 ${hem - len / 2} 153 ${hem} M244 ${hem - len} Q243 ${hem - len / 2} 247 ${hem}" ${LTB} stroke-width="1.8"/>`;
  const longSlits = hem => `<path d="M163 352 Q160 ${(352 + hem) / 2} 162 ${hem + 4} M237 352 Q240 ${(352 + hem) / 2} 238 ${hem + 4}" ${LTB} stroke-width="1.8"/><path d="M161 330 Q155 ${(330 + hem) / 2} 150 ${hem} L162 ${hem + 4} Q160 ${(352 + hem) / 2} 163 352Z M239 330 Q245 ${(330 + hem) / 2} 250 ${hem} L238 ${hem + 4} Q240 ${(352 + hem) / 2} 237 352Z" fill="#000" opacity=".14"/>`;
  const wear = (c, it, d) => `${defsOf(it, c)}<path d="${d}" ${paint(it, c)} ${LN}/>`;

  const TOPS = [
    { name: 'Áo bà ba hoa nhí', h: 404, pat: 'hoa', sleeve: 'rolled', draw() { return wear('top', this, tunic(404)) + COLLAR.tron() + `<path d="M200 214 L200 400" ${LT}/>` + buttons(232, 372, 6) + slits(404); } },
    { name: 'Áo dài tay xắn kẻ ô', h: 560, pat: 'keo', sleeve: 'rolled', draw() { return wear('top', this, tunic(560, 4)) + longSlits(560) + COLLAR.cheo('top'); } },
    { name: 'Áo cánh hoa trám', h: 410, pat: 'tram', sleeve: 'rolled', draw() { return wear('top', this, tunic(410)) + COLLAR.dung('top') + `<path d="M200 212 L200 406" ${LT}/>` + buttons(232, 380, 5) + slits(410); } },
    { name: 'Áo bà ba trơn', h: 404, sleeve: 'long', draw() { return wear('top', this, tunic(404)) + COLLAR.tron() + `<path d="M200 214 L200 400" ${LT}/>` + buttons(232, 372, 6) + `<path d="M166 346 L190 346 L190 374 L166 374Z M210 346 L234 346 L234 374 L210 374Z" ${LT}/>` + slits(404); } },
    { name: 'Sơ mi nông trại', h: 396, sleeve: 'rolled', draw() { return wear('top', this, tunic(396)) + COLLAR.somi('top') + `<path d="M200 224 L200 392" ${LT}/>` + buttons(244, 372, 5) + `<path d="M210 250 L232 250 L232 272 L210 272Z" ${LT}/>`; } },
    { name: 'Áo tứ thân & yếm', h: 560, sleeve: 'long', draw() { return wear('top', this, tunic(560, 6)) + longSlits(560) + `<path d="M184 209 L216 209 L232 300 Q200 310 168 300Z" fill="#c8372d" ${LN}/><path d="M184 209 Q180 260 168 300 M216 209 Q220 260 232 300" ${LTB} stroke-width="2"/>
      <path d="M160 312 Q200 324 240 312 L240 328 Q200 340 160 328Z" fill="#7cc46a" ${LN}/><path d="M196 330 L186 388 L198 386Z M204 330 L214 386 L202 388Z" fill="#7cc46a" ${LN}/>`; } },
    { name: 'Áo cánh sọc', h: 398, pat: 'soc', sleeve: 'short', draw() { return wear('top', this, tunic(398)) + COLLAR.tron() + slits(398, 30); } },
    { name: 'Áo Phúc Long', h: 390, fixed: '#0b6b3a', sleeve: 'short', draw() { return wear('top', this, tunic(390)) + `<path d="M182 206 Q200 222 218 206" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="200" cy="266" r="15" fill="#fff"/><path d="M200 254 q-9 10 0 24 q9 -14 0 -24Z" fill="#0b6b3a"/><path d="M200 258 V276" stroke="#fff" stroke-width="1"/>`; } },
  ];
  const OUTERS = [
    { name: 'Tạp dề trắng', vb: '148 200 104 290', draw() { return `<path d="M176 270 L188 210 M224 270 L212 210" style="stroke:var(--outer-d)" stroke-width="3"/><path d="M172 266 L228 266 L238 470 Q200 478 162 470Z" ${F('outer')} ${LN}/><path d="M160 320 Q200 330 240 320" fill="none" style="stroke:var(--outer-d)" stroke-width="4"/><path d="M182 376 L218 376 L218 404 L182 404Z" ${LT}/>`; } },
    { name: 'Khăn rằn quàng cổ', vb: '160 190 80 112', pat: 'keo', draw() { return wear('outer', this, 'M176 200 Q200 224 224 200 L232 214 Q200 242 168 214Z') + `<path d="M212 222 L226 292 L212 298 L202 228Z" fill="url(#${P}-outer)" ${LN}/><path d="M213 294 l-2 8 M219 292 l0 8 M225 290 l2 8" stroke="${O}" stroke-width="1.2"/>`; } },
    { name: 'Áo tơi lá', vb: '104 190 192 300', fixed: '#b8a05e', draw() { return `<path d="M180 200 Q200 208 220 200 Q262 220 272 300 Q280 400 282 470 Q200 488 118 470 Q120 400 128 300 Q138 220 180 200Z" fill="#b8a05e" ${LN}/><g stroke="#8a7440" stroke-width="1.6" fill="none">${Array.from({ length: 13 }, (_, k) => { const x = 128 + k * 12; return `<path d="M${200 + (x - 200) * .35} 214 Q${x} 340 ${x + (x - 200) * .12} 474"/>`; }).join('')}</g><path d="M140 300 Q200 316 260 300 M126 390 Q200 408 274 390" fill="none" stroke="#e1cf8e" stroke-width="2.4" opacity=".7"/>`; } },
    { name: 'Gilê thổ cẩm', vb: '132 196 136 196', pat: 'tho', draw() { const d = 'M176 207 Q158 212 152 232 Q156 300 162 384 L194 388 L196 262Z'; return defsOf(this, 'outer') + `<path d="${d}" fill="url(#${P}-outer)" ${LN}/><path d="${mx(d)}" fill="url(#${P}-outer)" ${LN}/>`; } },
    { name: 'Khăn choàng len', vb: '126 192 148 132', draw() { return `<path d="M176 202 Q200 212 224 202 Q258 212 264 252 L250 306 Q226 264 200 266 Q174 264 150 306 L136 252 Q142 212 176 202Z" ${F('outer')} ${LN}/><path d="M150 306 l-2 10 M156 296 l-2 10 M250 306 l2 10 M244 296 l2 10" style="stroke:var(--outer-d)" stroke-width="2"/><path d="M160 240 Q200 256 240 240" fill="none" style="stroke:var(--outer-d)" stroke-width="2" opacity=".7"/>`; } },
    { name: 'Áo khoác len', vb: '118 192 164 228', sleeve: 'long', draw() { const d = 'M180 205 L195 214 L194 410 L150 404 Q155 361 161 318 Q153 276 149 228 Q156 209 180 205Z'; return `<path d="${d}" ${F('outer')} ${LN}/><path d="${mx(d)}" ${F('outer')} ${LN}/><g style="stroke:var(--outer-d)" stroke-width="1.4" opacity=".7">${[170, 182, 218, 230].map(x => `<path d="M${x} 236 L${x} 396"/>`).join('')}</g>${[250, 290, 330].map(y => `<circle cx="190" cy="${y}" r="2.6" fill="#f4ead5" stroke="${O}"/>`).join('')}`; } },
    { name: 'Đai lưng vải', vb: '146 296 124 100', draw() { return `<path d="M158 312 Q200 324 242 312 L244 332 Q200 344 156 332Z" ${F('outer')} ${LN}/><path d="M232 326 L246 384 L236 388Z M238 326 L262 372 L252 380Z" ${F('outer')} ${LN}/><circle cx="236" cy="324" r="6" style="fill:var(--outer-d)" ${LN}/>`; } },
    { name: 'Áo khoác dù', vb: '116 180 168 240', sleeve: 'long', draw() { return `<path d="M166 210 Q200 186 234 210 Q200 220 166 210Z" style="fill:var(--outer-d)" ${LN}/>` + `<path d="${tunic(412)}" ${F('outer')} ${LN}/><path d="M200 210 L200 414" stroke="${O}" stroke-width="2"/><path d="M200 216 L200 414" stroke="#f2c14e" stroke-width="1" stroke-dasharray="3 3"/><path d="M150 400 Q200 412 250 400" fill="none" style="stroke:var(--outer-d)" stroke-width="5"/>`; } },
  ];
  const DRESSES = [
    { name: 'Áo dài trơn', h: 704, sleeve: 'long', keepBottom: true, draw() { return wear('dress', this, tunic(700, 8)) + longSlits(700) + COLLAR.cheo('dress'); } },
    { name: 'Áo dài hoa sen', h: 704, pat: 'sen', sleeve: 'long', keepBottom: true, draw() { return wear('dress', this, tunic(700, 8)) + longSlits(700) + COLLAR.cheo('dress'); } },
    { name: 'Áo dài cách tân', h: 566, sleeve: 'short', keepBottom: true, draw() { return wear('dress', this, tunic(560, 22)) + longSlits(560) + `<path d="M183 197 Q200 203 217 197 L218 210 Q200 217 182 210Z" fill="#f2c14e" ${LN}/><path d="M132 556 Q200 572 268 556" fill="none" stroke="#f2c14e" stroke-width="6"/><path d="M200 214 Q220 230 236 252 L236 300" fill="none" stroke="#f2c14e" stroke-width="3"/>${[0, 1, 2, 3].map(k => `<circle cx="${180 + k * 14}" cy="${470 + (k % 2) * 30}" r="6" fill="#f2c14e" opacity=".85"/>`).join('')}`; } },
    { name: 'Áo tứ thân đủ bộ', h: 712, sleeve: 'long', draw() { return `<path d="M158 326 Q200 334 242 326 Q258 520 266 708 Q200 720 134 708 Q142 520 158 326Z" fill="#23202b" ${LN}/>` + wear('dress', this, tunic(580, 8)) + longSlits(580) + `<path d="M184 209 L216 209 L232 300 Q200 310 168 300Z" fill="#c8372d" ${LN}/><path d="M184 209 Q180 260 168 300 M216 209 Q220 260 232 300" ${LTB} stroke-width="2"/><path d="M160 312 Q200 324 240 312 L240 328 Q200 340 160 328Z" fill="#f2c14e" ${LN}/><path d="M196 330 L186 396 L198 394Z M204 330 L214 394 L202 396Z" fill="#f2c14e" ${LN}/>`; } },
    { name: 'Váy hoa nhí', h: 646, pat: 'hoa', sleeve: 'short', draw() { return wear('dress', this, tunic(640, 34)) + COLLAR.tron() + `<path d="M161 318 Q200 330 239 318" ${LTB} stroke-width="1.8"/>`; } },
    { name: 'Váy yếm', h: 628, sleeve: 'short', sc: '#f4ead5', draw() { return `<path d="${tunic(400)}" fill="#f4ead5" ${LN}/>${COLLAR.tron()}<path d="M174 250 L226 250 L234 330 Q256 470 262 624 Q200 636 138 624 Q144 470 166 330Z" ${F('dress')} ${LN}/><path d="M178 252 L172 210 M222 252 L228 210" style="stroke:var(--dress)" stroke-width="7"/><circle cx="180" cy="256" r="3" fill="#f2c14e" stroke="${O}"/><circle cx="220" cy="256" r="3" fill="#f2c14e" stroke="${O}"/><path d="M186 280 L214 280 L214 300 L186 300Z" ${LT}/>`; } },
    { name: 'Váy suông', h: 608, sleeve: 'none', draw() { return `<path d="M178 224 L174 206 M222 224 L226 206" stroke="${O}" stroke-width="2.4"/><path d="M166 222 Q200 232 234 222 L248 604 Q200 614 152 604Z" ${F('dress')} ${LN}/>`; } },
    { name: 'Váy xoè đồng nội', h: 626, sleeve: 'rolled', draw() { return wear('dress', this, tunic(620, 44)) + COLLAR.tron() + `<path d="M161 318 Q200 330 239 318" fill="none" style="stroke:var(--dress-d)" stroke-width="5"/><path d="M110 612 Q130 626 150 616 Q170 630 200 620 Q230 630 250 616 Q270 626 290 612" fill="none" style="stroke:var(--dress-d)" stroke-width="3"/>`; } },
  ];
  const WAIST = `<path d="M158 326 Q200 334 242 326 L242 338 Q200 346 158 338Z" ${F('bottom-d')} ${LN}/>`;
  const leg2 = d => `<path d="${d}" ${F('bottom')} ${LN}/>`;
  const folds = (y0, y1) => `<path d="M176 ${y0} Q180 ${(y0 + y1) / 2} 172 ${y1} M224 ${y0} Q220 ${(y0 + y1) / 2} 228 ${y1}" fill="none" style="stroke:var(--bottom-d)" stroke-width="1.8" opacity=".8"/>`;
  const CUFF_L = 'M148 538 L194 542 L194 562 L148 558Z';
  const BOTTOMS = [
    { name: 'Quần xắn gối', h: 562, draw: () => leg2('M158 326 Q200 334 242 326 Q252 440 252 552 L206 556 L200 408 L194 556 L148 552 Q148 440 158 326Z') + folds(420, 530) + `<path d="${CUFF_L}" ${F('bottom-d')} ${LN}/><path d="${mx(CUFF_L)}" ${F('bottom-d')} ${LN}/>` + WAIST },
    { name: 'Quần ống loe', h: 730, draw: () => leg2('M158 326 Q200 334 242 326 Q260 520 276 728 L206 728 L200 408 L194 728 L124 728 Q140 520 158 326Z') + folds(430, 700) + WAIST },
    { name: 'Quần lụa bóng', h: 730, draw: () => leg2('M158 326 Q200 334 242 326 Q256 520 252 728 L206 728 L200 408 L194 728 L148 728 Q144 520 158 326Z') + `<path d="M168 400 Q178 560 166 712 M178 420 Q184 560 178 700 M232 400 Q222 560 234 712 M222 420 Q216 560 222 700" fill="none" style="stroke:var(--bottom-l)" stroke-width="4" opacity=".75" stroke-linecap="round"/>` + WAIST },
    { name: 'Quần lửng', h: 646, draw: () => leg2('M158 326 Q200 334 242 326 Q252 480 246 640 L206 642 L200 408 L194 642 L154 640 Q148 480 158 326Z') + folds(430, 620) + `<path d="M154 628 L194 630 L194 644 L154 642Z" ${F('bottom-d')} ${LN}/><path d="${mx('M154 628 L194 630 L194 644 L154 642Z')}" ${F('bottom-d')} ${LN}/>` + WAIST },
    { name: 'Váy đụp dài', h: 714, draw: () => `<path d="M158 326 Q200 334 242 326 Q258 520 266 708 Q200 720 134 708 Q142 520 158 326Z" ${F('bottom')} ${LN}/><path d="M180 420 Q178 560 172 706 M220 420 Q222 560 228 706 M200 430 L200 712" fill="none" style="stroke:var(--bottom-d)" stroke-width="1.8"/>` + WAIST },
    { name: 'Quần xắn một bên', h: 730, draw: () => leg2('M158 326 Q200 334 242 326 Q256 520 250 728 L206 728 L200 408 L194 556 L148 552 Q148 440 158 326Z') + folds(430, 540) + `<path d="${CUFF_L}" ${F('bottom-d')} ${LN}/>` + WAIST },
    { name: 'Váy xếp ly', h: 566, draw: () => `<path d="M158 326 Q200 334 242 326 Q262 450 268 560 Q200 572 132 560 Q138 450 158 326Z" ${F('bottom')} ${LN}/><g style="stroke:var(--bottom-d)" stroke-width="1.8">${[172, 186, 200, 214, 228].map(x => `<path d="M${x} 340 L${200 + (x - 200) * 2.2} 562"/>`).join('')}</g>` + WAIST },
    { name: 'Quần jean', h: 730, fixed: '#3d5a8a', draw: () => `<path d="M160 326 Q200 334 240 326 Q248 520 228 728 L206 728 L200 408 L194 728 L172 728 Q152 520 160 326Z" fill="#3d5a8a" ${LN}/><path d="M172 700 L194 702 L194 728 L172 728Z M206 702 L228 700 L228 728 L206 728Z" fill="#6d8cbe" ${LN}/><path d="M166 350 Q180 372 196 360 M234 350 Q220 372 204 360" fill="none" stroke="#f2c14e" stroke-width="1.2"/>` + `<path d="M182 340 Q176 540 186 726 M218 340 Q224 540 214 726" fill="none" stroke="#f2c14e" stroke-width="1" stroke-dasharray="3 2"/>` + WAIST },
  ];
  // Ống chân & cổ chân
  const legX = y => y < 548 ? [156 + 8 * (y - 368) / 180, 200 - 6 * (y - 368) / 180] : [164 + 12 * (y - 548) / 180, 194];
  const sockPair = (top, fill, extra = '') => { const a = legX(top), b = legX(730); const d = `M${a[0] - 1} ${top} L${a[1] + 1} ${top} L${b[1] + 1} 730 L${b[0] - 1} 730Z`; return `<path d="${d}" fill="${fill}" ${LN}/><path d="${mx(d)}" fill="${fill}" ${LN}/>${extra}`; };
  const both = s => s + mx(s);
  const SOCKS = [
    { name: 'Bùn ruộng', draw: () => `<g fill="#6b5040" opacity=".85"><path d="${both('M166 646 Q180 640 194 648 L194 730 L176 730 Q170 690 166 646Z')}"/></g><g fill="#6b5040" opacity=".6">${[[170, 628], [188, 618], [212, 624], [230, 632]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g>` },
    { name: 'Nước ngập cổ chân', draw: () => `<g fill="#8fb4e0" opacity=".45"><ellipse cx="185" cy="716" rx="22" ry="6"/><ellipse cx="215" cy="716" rx="22" ry="6"/></g><g fill="none" stroke="#dfeaff" stroke-width="1.4" opacity=".8"><ellipse cx="185" cy="716" rx="16" ry="4"/><ellipse cx="215" cy="716" rx="16" ry="4"/><ellipse cx="185" cy="718" rx="28" ry="8"/><ellipse cx="215" cy="718" rx="28" ry="8"/></g>` },
    { name: 'Xà cạp vải', draw: () => sockPair(600, '#d9c9a3', `<g stroke="#a8946a" stroke-width="1.6">${[612, 628, 644, 660, 676, 692, 708].map(y => both(`M${legX(y)[0]} ${y} L${legX(y + 10)[1]} ${y + 10} `)).map(d => `<path d="${d}"/>`).join('')}</g>`) },
    { name: 'Vòng bạc cổ chân', draw: () => `<path d="${both('M176 714 Q185 720 194 714 ')}" fill="none" stroke="#c9ccd6" stroke-width="3"/><circle cx="185" cy="720" r="2.2" fill="#e6e8ee" stroke="${O}" stroke-width=".8"/><circle cx="215" cy="720" r="2.2" fill="#e6e8ee" stroke="${O}" stroke-width=".8"/>` },
    { name: 'Vòng chỉ đỏ', draw: () => `<path d="${both('M176 712 Q185 717 194 712 ')}" fill="none" stroke="#c8372d" stroke-width="2.4"/>` },
    { name: 'Tất trắng ngắn', draw: () => sockPair(700, '#f4ead5') },
    { name: 'Tất len cao', draw: () => sockPair(590, '#c8372d', `<path d="${both('M172 600 L174 728 M186 600 L187 728 ')}" stroke="#9e2a22" stroke-width="1.4"/>`) },
    { name: 'Tất kẻ', draw: () => sockPair(620, '#f4ead5', `<g stroke="#2b3f7a" stroke-width="5">${[634, 656, 678, 700].map(y => `<path d="M${legX(y)[0]} ${y} L${legX(y)[1]} ${y} M${400 - legX(y)[1]} ${y} L${400 - legX(y)[0]} ${y}"/>`).join('')}</g>`) },
  ];
  // Dép & guốc
  const SOLEL = 'M157 754 Q155 768 168 768 L190 768 Q201 768 199 754Z';
  const SHOEL = 'M174 718 L196 718 Q201 742 200 754 Q199 768 184 768 L164 768 Q153 766 157 754 Q163 744 174 718Z';
  const pairOf = (d, fill) => { const a = fill.startsWith('var') ? `style="fill:${fill}"` : `fill="${fill}"`; return `<path d="${d}" ${a} ${LN}/><path d="${mx(d)}" ${a} ${LN}/>`; };
  const SHOES = [
    { name: 'Dép cói', draw: () => pairOf(SOLEL, '#d9b878') + pairOf('M170 738 Q184 730 198 738 L198 748 Q184 740 168 748Z', 'var(--shoe)') },
    { name: 'Guốc mộc', draw: () => pairOf('M155 756 Q153 776 168 776 L190 776 Q203 776 201 756Z', '#a8743e') + pairOf('M170 740 Q184 732 198 740 L198 748 Q184 742 168 748Z', 'var(--shoe)') + `<path d="${both('M160 768 L196 768 ')}" stroke="#7a5230" stroke-width="2"/>` },
    { name: 'Dép tổ ong', draw: () => pairOf(SOLEL, 'var(--shoe)') + pairOf('M166 736 Q184 724 200 736 L200 752 Q184 744 164 752Z', 'var(--shoe)') + `<g fill="#000" opacity=".18">${[[172, 742], [180, 738], [188, 738], [196, 742], [228, 742], [220, 738], [212, 738], [204, 742]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6"/>`).join('')}</g>` },
    { name: 'Giày vải', draw: () => pairOf(SHOEL, 'var(--shoe)') + `<path d="${both('M160 764 L198 764 ')}" stroke="#f4ead5" stroke-width="3"/>` + pairOf('M176 726 L194 726 L194 732 L176 732Z', 'var(--shoe-d)') },
    { name: 'Giày thêu', draw: () => pairOf(SHOEL, 'var(--shoe)') + `<g fill="#f2c14e">${[[178, 750], [188, 744], [222, 750], [212, 744]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4"/>`).join('')}</g><path d="${both('M168 756 Q180 748 196 756 ')}" fill="none" stroke="#7cc46a" stroke-width="1.6"/>` },
    { name: 'Ủng cao su', draw: () => pairOf('M168 640 L198 640 L200 754 Q199 768 184 768 L162 768 Q152 766 156 754 L168 718Z', 'var(--shoe)') + `<path d="${both('M168 652 L198 652 ')}" style="stroke:var(--shoe-d)" stroke-width="4"/>` },
    { name: 'Dép lê', draw: () => pairOf(SOLEL, 'var(--shoe-d)') + pairOf('M162 744 Q182 734 200 744 L200 756 Q182 748 160 756Z', 'var(--shoe)') },
  ];
  // Phụ kiện: at = 'head' | 'body' | 'back'
  const NON = (x, y, w, h) => { const ring = f => `M${x - w * f} ${y - h + h * f} Q${x} ${y - h + h * f + 6 * f} ${x + w * f} ${y - h + h * f}`; return `<path d="M${x - w} ${y} L${x} ${y - h} L${x + w} ${y} Q${x} ${y + 26} ${x - w} ${y}Z" fill="#e9d39b" ${LN}/><path d="M${x} ${y - h} L${x + w} ${y} Q${x + w / 2} ${y + 16} ${x} ${y + 13}Z" fill="#cdb57a" opacity=".55"/><path d="${ring(.35)} ${ring(.6)} ${ring(.85)}" fill="none" stroke="#a88f55" stroke-width="1.4"/>`; };
  const FIREFLY = pts => pts.map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="${7 + (k % 3) * 2}" fill="#eaff8a" opacity=".22"/><circle cx="${x}" cy="${y}" r="2.4" fill="#fbffd0"/>`).join('');
  const ACCS = [
    { name: 'Nón lá', at: 'head', slot: 'hat', chin: true, draw: () => NON(200, 104, 94, 74) },
    { name: 'Khăn vấn đỏ', at: 'head', slot: 'hat', draw: () => `<path d="M148 106 Q200 76 252 106 L251 120 Q200 92 149 120Z" fill="#c8372d" ${LN}/><path d="M160 106 Q200 86 240 106" fill="none" stroke="#9e2a22" stroke-width="1.6"/><path d="M246 104 l10 -4 l2 10 l-10 2Z" fill="#c8372d" ${LN}/>` },
    { name: 'Kẹp tóc ngọc bích', at: 'head', draw: () => `<rect x="220" y="78" width="26" height="10" rx="4" transform="rotate(-24 233 83)" fill="#3fae6a" ${LN}/><circle cx="227" cy="86" r="2.6" fill="#d9ffe6" ${LN}/><circle cx="238" cy="81" r="2.6" fill="#d9ffe6" ${LN}/>` },
    { name: 'Mũ lưỡi trai vàng', at: 'head', slot: 'hat', draw: () => `<path d="M146 106 Q140 36 200 34 Q260 36 254 106 Q200 94 146 106Z" fill="#f2c14e" ${LN}/><path d="M150 104 Q192 94 238 106 Q246 116 236 118 Q194 108 152 116Z" fill="#d9a83a" ${LN}/><circle cx="200" cy="36" r="4" fill="#d9a83a" ${LN}/><path d="M200 38 L200 98" ${LT}/>` },
    { name: 'Đèn bão', at: 'free', draw: () => `<circle cx="306" cy="724" r="46" fill="#ffd36b" opacity=".22"/><circle cx="306" cy="724" r="26" fill="#ffd36b" opacity=".3"/>${lantern(306, 690, 1.15)}` },
    { name: 'Giỏ tre bên hông', at: 'body', draw: () => `<path d="M168 212 L252 378" stroke="#8a6a3a" stroke-width="4"/><path d="M246 352 l-6 -30 M256 350 l2 -34 M266 352 l8 -28" stroke="#5fae4a" stroke-width="3" stroke-linecap="round"/><path d="M234 352 L284 352 L278 404 Q259 414 240 404Z" fill="#c9a063" ${LN}/><path d="M236 366 L282 366 M238 380 L280 380 M240 394 L278 394" stroke="#9a7440" stroke-width="1.4"/>` },
    { name: 'Hoa sen cài tóc', at: 'head', draw: () => `<g transform="translate(160 92) rotate(-20)"><path d="M0 8 Q-12 0 -8 -10 Q-2 -4 0 8Z M0 8 Q12 0 8 -10 Q2 -4 0 8Z" fill="#f4a3b8" ${LN}/><path d="M0 8 Q-5 -6 0 -14 Q5 -6 0 8Z" fill="#e98fa6" ${LN}/><path d="M-4 10 Q0 14 4 10" stroke="#7cc46a" stroke-width="2.4" fill="none"/></g>` },
    { name: 'Nón lá đeo lưng', at: 'back', slot: 'hat', strap: true, draw: () => `<g transform="rotate(-18 246 250)">${NON(246, 300, 82, 92)}</g>` },
    { name: 'Túi cói', at: 'body', draw: () => `<path d="M234 212 L148 382" stroke="#a8843e" stroke-width="3.4"/><path d="M118 380 L164 380 L160 428 Q141 436 122 428Z" fill="#d8b878" ${LN}/><path d="M120 394 L162 394 M121 408 L161 408" stroke="#a8843e" stroke-width="1.4"/><circle cx="141" cy="416" r="5" fill="#c8372d" ${LN}/>` },
    { name: 'Vòng bạc', at: 'body', draw: () => `<path d="M183 208 Q200 226 217 208" fill="none" stroke="#c9ccd6" stroke-width="3.6"/><path d="M183 208 Q200 226 217 208" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/><circle cx="200" cy="222" r="4" fill="#e6e8ee" stroke="${O}" stroke-width="1"/>` },
    { name: 'Trâm cài bạc', at: 'head', draw: () => `<path d="M218 94 L254 60" stroke="#c9ccd6" stroke-width="3.4" stroke-linecap="round"/><circle cx="254" cy="60" r="4" fill="#f2c14e" stroke="${O}" stroke-width="1"/><path d="M226 88 l-2 16 M230 84 l0 14" stroke="#c9ccd6" stroke-width="1.2"/><circle cx="224" cy="105" r="2" fill="#c8372d"/><circle cx="230" cy="99" r="2" fill="#7cc46a"/>` },
    { name: 'Đom đóm', at: 'free', draw: () => FIREFLY([[106, 290], [300, 230], [318, 430], [92, 520], [296, 566], [128, 176], [86, 400], [322, 330]]) },
  ];
  function lantern(x, y, k = 1) {
    const t = (dx, dy) => `${(x + dx * k).toFixed(1)} ${(y + dy * k).toFixed(1)}`;
    return `<path d="M${t(-10, 0)} Q${t(0, -16)} ${t(10, 0)}" fill="none" stroke="${O}" stroke-width="${2 * k}"/><path d="M${t(-12, 0)} L${t(12, 0)} L${t(10, 8)} L${t(-10, 8)}Z" fill="#8a5a3a" ${LN}/>
      <path d="M${t(-12, 8)} Q${t(-16, 28)} ${t(-11, 46)} L${t(11, 46)} Q${t(16, 28)} ${t(12, 8)}Z" fill="#fff4c8" fill-opacity=".85" ${LN}/><ellipse cx="${x}" cy="${y + 28 * k}" rx="${6 * k}" ry="${10 * k}" fill="#ffc94a"/><ellipse cx="${x}" cy="${y + 30 * k}" rx="${2.5 * k}" ry="${5 * k}" fill="#fff"/>
      <path d="M${t(-14, 46)} L${t(14, 46)} L${t(12, 56)} L${t(-12, 56)}Z" fill="#8a5a3a" ${LN}/><path d="M${t(-11, 27)} H${t(11, 27).split(' ')[0]}" stroke="#8a5a3a" stroke-width="${1.6 * k}"/>`;
  }

  // Dáng: [khuỷu, bàn tay, kiểu tay] cho tay trái / phải; prop = vật cầm
  const POSES = [
    { name: 'Đứng thẳng', L: [[138, 440], [132, 500], 'open'], R: [[262, 440], [268, 500], 'open'] },
    { name: 'Cầm bó mạ', L: [[132, 436], [186, 474], 'fist'], R: [[268, 436], [214, 474], 'fist'], prop: 'ma', at: [200, 474] },
    { name: 'Bưng bát cơm', L: [[134, 442], [182, 452], 'fist'], R: [[274, 452], [238, 406], 'fist'], prop: 'bat', at: [186, 428] },
    { name: 'Vẫy tay', L: [[138, 440], [132, 500], 'open'], R: [[296, 370], [306, 304], 'wave'] },
    { name: 'Chống nạnh', L: [[108, 428], [146, 466], 'fist'], R: [[292, 428], [254, 466], 'fist'] },
    { name: 'Xách đèn bão', L: [[138, 440], [132, 500], 'open'], R: [[266, 440], [272, 498], 'fist'], prop: 'den', at: [272, 498] },
    { name: 'Ôm nón lá', L: [[130, 440], [160, 480], 'fist'], R: [[270, 440], [240, 480], 'fist'], prop: 'non', at: [200, 476] },
    { name: 'Cầm ly trà', L: [[138, 440], [132, 500], 'open'], R: [[270, 448], [234, 424], 'fist'], prop: 'ly', at: [234, 420] },
  ];
  const RY = ([x, y]) => [x, Math.round(437 + (y - 380) * 1.3)];
  POSES.forEach(p => { for (const sd of ['L', 'R']) p[sd] = [RY(p[sd][0]), RY(p[sd][1]), p[sd][2]]; if (p.at) p.at = RY(p.at); });
  Object.assign(POSES[2], { at: [184, 506] }); POSES[2].R = [[274, 531], [242, 484], 'fist'];   // bát cơm đặt đúng trên lòng bàn tay
  // điểm neo của từng vật (toạ độ vẽ gốc) + tỉ lệ; 'back' = vẽ sau cánh tay
  const PROP_AT = { ma: [200, 368, 1.15, true], bat: [190, 296, 1.1], den: [266, 408, 1.1], non: [200, 352, 1, true], ly: [225, 288, 1.1] };
  const PROPS = {
    ma: `<g stroke-linecap="round">${[-34, -22, -12, -4, 4, 12, 22, 34].map((dx, k) => `<path d="M200 368 Q${200 + dx * .5} ${330} ${200 + dx} ${296 + (k % 3) * 8}" fill="none" stroke="#2f6b2a" stroke-width="4.6"/><path d="M200 368 Q${200 + dx * .5} ${330} ${200 + dx} ${296 + (k % 3) * 8}" fill="none" stroke="#6cbf4c" stroke-width="2.6"/>`).join('')}<path d="M192 378 l-4 22 M198 380 l-1 24 M204 380 l2 22 M209 378 l5 20" stroke="#8a6a4a" stroke-width="1.8"/></g><rect x="190" y="364" width="20" height="9" rx="3" fill="#c9a063" ${LN}/>`,
    bat: `<path d="M166 290 Q190 278 214 290 Q206 280 190 276 Q174 280 166 290Z" fill="#fff" ${LN}/><g fill="#e8e2d4">${[[180, 284], [188, 281], [196, 283], [204, 286], [186, 287], [194, 287]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="1"/>`).join('')}</g><path d="M164 290 Q190 290 216 290 Q212 312 190 314 Q168 312 164 290Z" fill="#f4f6fb" ${LN}/><path d="M168 298 Q190 302 212 298" fill="none" stroke="#4f6fb8" stroke-width="1.8"/><path d="M192 280 L246 266 M194 284 L248 276" stroke="#2a2438" stroke-width="3.6" stroke-linecap="round"/><path d="M192 280 L246 266 M194 284 L248 276" stroke="#b07a4a" stroke-width="1.8" stroke-linecap="round"/>`,
    den: lantern(266, 416, 1),
    non: `<circle cx="200" cy="352" r="54" fill="#e9d39b" ${LN}/><circle cx="200" cy="352" r="38" fill="none" stroke="#a88f55" stroke-width="1.4"/><circle cx="200" cy="352" r="22" fill="none" stroke="#a88f55" stroke-width="1.4"/><circle cx="200" cy="352" r="6" fill="#cdb57a" ${LN}/><path d="M200 298 L200 406 M146 352 L254 352" stroke="#cdb57a" stroke-width="1" opacity=".7"/>`,
    ly: `<g transform="translate(212 262)"><path d="M2 6 L24 6 L21 42 L5 42Z" fill="#fff" fill-opacity=".92" ${LN}/><path d="M4 18 L22 18 L20.5 41 L5.5 41Z" fill="#c98a4a"/><circle cx="13" cy="28" r="5" fill="#fff"/><path d="M13 24 q-3 3.5 0 8 q3 -4.5 0 -8Z" fill="#0b6b3a"/><rect x="0" y="2" width="26" height="6" rx="3" fill="#fff" ${LN}/><path d="M17 2 L21 -12" stroke="#0b6b3a" stroke-width="3" stroke-linecap="round"/></g>`,
  };

  // ---------- Khung cảnh (400 x 820) ----------
  const STARS = Array.from({ length: 90 }, (_, k) => [Math.round(rnd(k) * 800 - 200), Math.round(rnd(k + 300) * 330), rnd(k + 600)]);
  const tree = (x, y, s, c) => `<g fill="${c}"><rect x="${x - 2 * s}" y="${y - 30 * s}" width="${4 * s}" height="${30 * s}"/><circle cx="${x}" cy="${y - 44 * s}" r="${16 * s}"/><circle cx="${x - 12 * s}" cy="${y - 34 * s}" r="${12 * s}"/><circle cx="${x + 13 * s}" cy="${y - 36 * s}" r="${12 * s}"/><circle cx="${x + 2 * s}" cy="${y - 58 * s}" r="${10 * s}"/></g>`;
  const house = (x, y, s, wall, roof, win) => `<path d="M${x - 26 * s} ${y} L${x - 26 * s} ${y - 22 * s} L${x + 26 * s} ${y - 22 * s} L${x + 26 * s} ${y}Z" fill="${wall}"/><path d="M${x - 34 * s} ${y - 20 * s} L${x} ${y - 46 * s} L${x + 34 * s} ${y - 20 * s}Z" fill="${roof}"/><rect x="${x - 16 * s}" y="${y - 16 * s}" width="${8 * s}" height="${8 * s}" fill="${win}"/><rect x="${x + 6 * s}" y="${y - 16 * s}" width="${8 * s}" height="${8 * s}" fill="${win}"/><path d="M${x - 26 * s} ${y} L${x - 32 * s} ${y + 6 * s} M${x + 26 * s} ${y} L${x + 32 * s} ${y + 6 * s}" stroke="${roof}" stroke-width="${2 * s}"/>`;
  const tufts = (rows, c1, c2, skip) => {
    let a = '', b = '';
    rows.forEach(([y, gap, h], r) => { for (let x = -380 + (r % 2) * gap / 2; x < 780; x += gap) { if (skip && x > skip[0] && x < skip[1]) continue; const q = `M${x} ${y} l${-h * .35} ${-h} M${x} ${y} l0 ${-h * 1.15} M${x} ${y} l${h * .35} ${-h} `; a += q; } });
    return `<path d="${a}" stroke="${c2}" stroke-width="${rows[0][2] > 8 ? 3.4 : 2.2}" stroke-linecap="round" fill="none"/><path d="${a}" stroke="${c1}" stroke-width="${rows[0][2] > 8 ? 1.8 : 1.1}" stroke-linecap="round" fill="none"/>`;
  };
  function field(id, o) {
    let s = `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.sky[0]}"/><stop offset="1" stop-color="${o.sky[1]}"/></linearGradient><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.water[0]}"/><stop offset="1" stop-color="${o.water[1]}"/></linearGradient><radialGradient id="${id}g"><stop offset="0" stop-color="${o.glow}" stop-opacity=".6"/><stop offset="1" stop-color="${o.glow}" stop-opacity="0"/></radialGradient></defs>`;
    s += `<rect x="-400" y="-200" width="1200" height="580" fill="url(#${id}s)"/>`;
    if (o.stars) s += `<g fill="#fff">${STARS.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${(r * 1.3 + .5).toFixed(1)}" opacity="${(.45 + r * .55).toFixed(2)}"/>`).join('')}</g>`;
    if (o.orb) s += `<circle cx="${o.orb[0]}" cy="${o.orb[1]}" r="${o.orb[2] * 4}" fill="url(#${id}g)"/><circle cx="${o.orb[0]}" cy="${o.orb[1]}" r="${o.orb[2]}" fill="${o.orbC}"/>`;
    if (o.clouds) s += `<g fill="#fff" opacity=".85"><ellipse cx="70" cy="120" rx="44" ry="14"/><ellipse cx="94" cy="108" rx="26" ry="14"/><ellipse cx="300" cy="200" rx="40" ry="12"/><ellipse cx="318" cy="190" rx="22" ry="12"/></g>`;
    s += `<path d="M-400 360 L-400 330 Q-200 300 0 326 Q60 304 130 322 Q210 298 290 318 Q350 302 400 320 Q600 300 800 330 V360Z" fill="${o.hill}"/>`;
    s += [[-60, 340, 1.1], [36, 344, 1.3], [92, 342, .9], [430, 342, 1.2], [470, 344, .9]].map(([x, y, k]) => tree(x, y, k, o.tree)).join('');
    if (o.village) s += [[268, 346, .8], [322, 342, 1], [376, 346, .85], [214, 350, .6]].map(([x, y, k]) => house(x, y, k, o.wall, o.roof, o.win)).join('') + tree(350, 350, .8, o.tree);
    if (o.bamboo) s += [-30, 10, 380, 420].map((x, k) => `<g>${[0, 9, 18, 27].map(dx => `<path d="M${x + dx} 480 Q${x + dx + (k < 2 ? 10 : -10)} 300 ${x + dx + (k < 2 ? 30 : -30)} 120" fill="none" stroke="#5f9a4a" stroke-width="5"/>`).join('')}${Array.from({ length: 14 }, (_, j) => `<ellipse cx="${x + 14 + (k < 2 ? 1 : -1) * (j * 3)}" cy="${140 + j * 22}" rx="16" ry="5" transform="rotate(${(j % 2 ? 30 : -30)} ${x + 14 + (k < 2 ? 1 : -1) * (j * 3)} ${140 + j * 22})" fill="#3f7a36"/>`).join('')}</g>`).join('');
    s += `<rect x="-400" y="352" width="1200" height="130" fill="${o.field[0]}"/>` + tufts([[364, 12, 5], [378, 14, 6], [394, 16, 6], [412, 18, 7], [432, 20, 7], [456, 22, 8]], o.field[1], o.field[2]);
    s += `<path d="M-400 352 Q0 346 800 356" stroke="${o.dike}" stroke-width="4" fill="none"/><path d="M-400 420 Q100 412 800 424" stroke="${o.dike}" stroke-width="6" fill="none"/>`;
    s += `<rect x="-400" y="478" width="1200" height="350" fill="url(#${id}w)"/><path d="M-400 478 Q100 470 800 482" stroke="${o.dike}" stroke-width="10" fill="none"/>`;
    if (o.orb) s += `<g fill="${o.orbC}" opacity=".5">${[0, 1, 2, 3, 4, 5].map(k => `<ellipse cx="${o.orb[0] + (k % 2 ? 6 : -6)}" cy="${506 + k * 26}" rx="${20 - k * 2}" ry="2.4"/>`).join('')}</g>`;
    s += `<g fill="none" stroke="#fff" stroke-width="1.2" opacity=".18">${[[60, 560], [140, 640], [330, 600], [260, 700], [40, 720]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="26" ry="5"/>`).join('')}</g>`;
    s += tufts([[516, 46, 10], [566, 54, 13], [626, 62, 16], [700, 72, 20]], o.field[1], o.field[2], [112, 288]);
    s += `<path d="M-400 830 V778 Q-100 760 100 772 Q200 756 300 770 Q500 760 800 776 V830Z" fill="${o.bank}"/><path d="${[[24, 774], [70, 770], [118, 768], [286, 768], [338, 772], [384, 774]].map(([x, y]) => `M${x} ${y} l-4 -12 M${x} ${y} l2 -14 M${x} ${y} l7 -10`).join(' ')}" stroke="${o.grass}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
    if (o.fireflies) s += FIREFLY([[40, 380], [96, 300], [340, 280], [360, 420], [30, 560], [372, 620], [150, 440], [270, 470], [70, 680], [330, 700]]);
    return s;
  }
  const NIGHT = { sky: ['#1b1d4a', '#4b3f8f'], stars: true, orb: [300, 150, 24], orbC: '#fff3c2', glow: '#fff3c2', hill: '#2f4a3a', tree: '#1f3328', village: true, wall: '#3d3248', roof: '#2a2230', win: '#ffc966', field: ['#3f8a36', '#7cd05a', '#2a5a26'], dike: '#3a3a52', water: ['#4a5c9a', '#262d5c'], bank: '#3e3230', grass: '#4f8a3e' };
  const BGS = [
    { name: 'Đồng lúa đêm trăng', c: ['#1b1d4a', '#4b3f8f'], o: NIGHT },
    { name: 'Ban mai trên đồng', c: ['#ffd9b0', '#bfe3f5'], o: { ...NIGHT, sky: ['#ffd9b0', '#cdeaf7'], stars: false, orb: [90, 260, 28], orbC: '#fff4d6', glow: '#ffe7a8', hill: '#7fb38a', tree: '#4f8a5a', wall: '#f1e2c4', roof: '#b0573a', win: '#8a6a4a', field: ['#8fd06a', '#c8f09a', '#5a9a3c'], dike: '#8a6a4a', water: ['#b5dcef', '#7fb3d4'], bank: '#7a5a40', grass: '#6aa84a', clouds: true } },
    { name: 'Hoàng hôn lúa chín', c: ['#ff8c6b', '#ffd29a'], o: { ...NIGHT, sky: ['#ff8c6b', '#ffd29a'], stars: false, orb: [110, 300, 32], orbC: '#fff0b0', glow: '#ffd28a', hill: '#a0604a', tree: '#5a3a3a', wall: '#7a4a3a', roof: '#4a2a2a', win: '#ffd27a', field: ['#d9b44a', '#f2d77a', '#a98a2a'], dike: '#7a4a30', water: ['#f2a07a', '#8a5a7a'], bank: '#5a3a30', grass: '#a98a2a' } },
    { name: 'Bến sông chiều', c: ['#ffb98a', '#cfe6f2'], river: true },
    { name: 'Bờ tre xanh', c: ['#bfe6f5', '#eefaff'], o: { ...NIGHT, sky: ['#9fd3f0', '#eefaff'], stars: false, orb: [320, 90, 22], orbC: '#fffbe0', glow: '#ffffff', hill: '#6aa57a', tree: '#3f7a4a', village: false, field: ['#7cc45a', '#b5ea8a', '#4f8a3a'], dike: '#8a6a4a', water: ['#a0d0e8', '#6fa6c8'], bank: '#6a4a36', grass: '#5a9a3a', bamboo: true, clouds: true } },
    { name: 'Phố cổ đèn lồng', c: ['#1d1b45', '#523a7a'], town: true },
    { name: 'Đồi chè Phúc Long', c: ['#cfeaff', '#f3fbff'], tea: true },
    { name: 'Đêm đom đóm', c: ['#0f1236', '#2c2a66'], o: { ...NIGHT, sky: ['#0f1236', '#2c2a66'], orb: null, hill: '#1f3a2e', tree: '#122820', wall: '#2a2236', win: '#e0a84a', field: ['#2f6a2a', '#5fae4a', '#1f4a1e'], water: ['#33407a', '#171c44'], bank: '#2e2624', grass: '#3a6a2e', fireflies: true } },
  ];
  function town(id) {
    const lan = (x, y, c) => `<circle cx="${x}" cy="${y}" r="22" fill="${c}" opacity=".25"/><path d="M${x} ${y - 16} L${x} ${y - 24}" stroke="#2a2230" stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${c}" ${LN}/><path d="M${x - 11} ${y} H${x + 11}" stroke="#f2c14e" stroke-width="1" opacity=".7"/><rect x="${x - 5}" y="${y - 17}" width="10" height="4" fill="#f2c14e"/><path d="M${x} ${y + 14} l0 9" stroke="#f2c14e" stroke-width="1.6"/>`;
    const facade = (x, w, h, c) => `<rect x="${x}" y="${560 - h}" width="${w}" height="${h}" fill="${c}"/><path d="M${x - 8} ${560 - h} L${x + w / 2} ${520 - h} L${x + w + 8} ${560 - h}Z" fill="#7a3a2a"/><rect x="${x + w * .2}" y="${560 - h * .55}" width="${w * .25}" height="${h * .35}" fill="#ffd27a"/><rect x="${x + w * .55}" y="${560 - h * .55}" width="${w * .25}" height="${h * .55}" fill="#6b3a24"/>`;
    return `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1b45"/><stop offset="1" stop-color="#523a7a"/></linearGradient></defs><rect x="-400" y="-200" width="1200" height="800" fill="url(#${id}s)"/><g fill="#fff">${STARS.slice(0, 40).map(([x, y, r]) => `<circle cx="${x}" cy="${y * .8}" r="${(r + .4).toFixed(1)}" opacity=".7"/>`).join('')}</g>
      ${[[-300, 120, 220, '#d9a24a'], [-170, 110, 250, '#e7b65a'], [-50, 100, 200, '#cf9a48'], [50, 70, 170, '#e7b65a'], [280, 80, 180, '#cf9a48'], [370, 110, 240, '#e7b65a'], [490, 120, 210, '#d9a24a']].map(([x, w, h, c]) => facade(x, w, h, c)).join('')}
      <path d="M-40 230 Q200 290 440 230" fill="none" stroke="#2a2230" stroke-width="1.4"/>${[[20, 250, '#e0453a'], [80, 266, '#f2c14e'], [140, 276, '#e0453a'], [200, 280, '#f2c14e'], [260, 276, '#e0453a'], [320, 266, '#f2c14e'], [380, 250, '#e0453a']].map(([x, y, c]) => lan(x, y, c)).join('')}
      <rect x="-400" y="560" width="1200" height="270" fill="#4a3a48"/>${Array.from({ length: 9 }, (_, k) => `<path d="M-400 ${580 + k * 28} H800" stroke="#5a4a58" stroke-width="2"/>`).join('')}<path d="M-400 780 Q200 766 800 780 V830 H-400Z" fill="#3a2e3a"/>`;
  }
  function tea(id) {
    const rows = (y, c, c2) => `<path d="M-400 ${y} Q-100 ${y - 60} 200 ${y - 20} Q500 ${y - 70} 800 ${y} V900 H-400Z" fill="${c}"/>${[0, 1, 2, 3, 4, 5].map(k => `<path d="M-400 ${y + 16 + k * 16} Q-100 ${y - 44 + k * 16} 200 ${y - 4 + k * 16} Q500 ${y - 54 + k * 16} 800 ${y + 16 + k * 16}" fill="none" stroke="${c2}" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 6"/>`).join('')}`;
    return `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f7"/><stop offset="1" stop-color="#f3fbff"/></linearGradient></defs><rect x="-400" y="-200" width="1200" height="800" fill="url(#${id}s)"/><circle cx="310" cy="110" r="26" fill="#fff6d0"/><g fill="#fff" opacity=".9"><ellipse cx="80" cy="140" rx="46" ry="14"/><ellipse cx="104" cy="128" rx="26" ry="14"/></g>
      ${rows(380, '#8cc49c', '#6fb084')}${rows(500, '#5fae6a', '#3f8f5a')}${rows(640, '#3f8f5a', '#2f7448')}<path d="M-400 830 V780 Q200 760 800 780 V830Z" fill="#6a4a36"/>`;
  }
  function river(id) {
    const boat = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-60 0 Q0 22 60 0 L52 -6 Q0 10 -52 -6Z" fill="#6b4a32" ${LN}/><path d="M-30 -6 Q0 -40 30 -6Z" fill="#c9a063" ${LN}/><path d="M-22 -10 Q0 -32 22 -10" fill="none" stroke="#9a7440" stroke-width="1.4"/><path d="M40 -4 L76 -60" stroke="#6b4a32" stroke-width="2.4"/></g>`;
    return `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb98a"/><stop offset="1" stop-color="#ffe2b8"/></linearGradient><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc9dc"/><stop offset="1" stop-color="#4f8aa8"/></linearGradient></defs>
      <rect x="-400" y="-200" width="1200" height="600" fill="url(#${id}s)"/><circle cx="96" cy="250" r="34" fill="#fff0c8"/><circle cx="96" cy="250" r="70" fill="#fff0c8" opacity=".25"/>
      <path d="M-400 360 L-400 320 Q-100 296 100 318 Q220 300 320 316 Q520 296 800 320 V360Z" fill="#7a9a6a"/>${[[20, 330, 1], [70, 334, .8], [330, 330, 1.1], [380, 334, .8]].map(([x, y, k]) => tree(x, y, k, '#4f6f48')).join('')}
      <rect x="-400" y="352" width="1200" height="420" fill="url(#${id}w)"/><g fill="#fff" opacity=".35">${[[96, 380, 30], [90, 410, 22], [100, 440, 16], [94, 470, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="2.4"/>`).join('')}</g>
      <g fill="none" stroke="#fff" stroke-width="1.4" opacity=".4">${[[40, 520], [300, 470], [340, 600], [60, 650], [250, 560]].map(([x, y]) => `<path d="M${x - 24} ${y} q12 -5 24 0 t24 0"/>`).join('')}</g>
      ${boat(300, 440, .9)}${boat(60, 560, .6)}
      <path d="M-400 830 V720 L-20 720 L-20 700 L120 700 L120 716 L800 716 V830Z" fill="#8a5a3a"/><g stroke="#6b4426" stroke-width="2">${Array.from({ length: 9 }, (_, k) => `<path d="M${-10 + k * 16} 702 V718"/>`).join('')}</g><path d="M-10 718 V770 M118 718 V770" stroke="#5a3a24" stroke-width="6"/>
      <path d="M-400 830 V776 Q200 760 800 778 V830Z" fill="#6a4a36"/>`;
  }
  function bgSvg(i, id) {
    const b = BGS[i] || BGS[0];
    return b.town ? town(id) : b.tea ? tea(id) : b.river ? river(id) : field(id, b.o);
  }

  const CATS = { face: FACES, hair: HAIRS, fringe: FRINGES, eyes: EYES, brows: BROWS, mouth: MOUTHS, blush: BLUSHES, top: TOPS, outer: OUTERS, dress: DRESSES, bottom: BOTTOMS, socks: SOCKS, shoes: SHOES, acc: ACCS, pose: POSES, bg: BGS };
  const REQUIRED = ['face', 'hair', 'fringe', 'eyes', 'brows', 'mouth', 'pose', 'bg'];
  const isLocked = (cat, i, st) => {
    if (cat === 'skin' || i < 0) return false;
    const u = st.unlocked || [];
    if (cat === 'pose') return i === 5 && !u.includes('pose:5') && !u.includes('acc:4');   // xách đèn bão: mở cùng món Đèn bão
    return i % 5 === 4 && !u.includes(cat + ':' + i);
  };
  const slotOf = i => ACCS[i] && ACCS[i].slot;

  // ---------- Biến màu ----------
  function vars(st) {
    const s = st.skin, h = st.hairColor, e = st.eyeColor;
    const v = { skin: s, 'skin-d': warm(s), hair: h, 'hair-d': shade(h, -30), 'hair-l': shade(h, 70), eye: e, 'eye-d': shade(e, -40), 'eye-l': shade(e, 45), 'eye-p': shade(e, -60) };
    for (const k of ['top', 'outer', 'dress', 'bottom', 'shoe']) { const c = st[k + 'Color'] || DEFAULT[k + 'Color']; v[k] = c; v[k + '-d'] = shade(c, -42); v[k + '-l'] = shade(c, 70); }
    return v;
  }
  const styleOf = st => Object.entries(vars(st)).map(([k, v]) => `--${k}:${v}`).join(';');

  // ---------- Cánh tay theo dáng ----------
  const along = (pts, f) => {
    const seg = []; let total = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; }
    let need = total * f; const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      if (need <= seg[i - 1]) { const t = need / seg[i - 1]; out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]); return out; }
      need -= seg[i - 1]; out.push(pts[i]);
    }
    return out;
  };
  const poly = pts => 'M' + pts.map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L');
  const stroke2 = (d, w, paintAttr) => `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w + 3.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" ${paintAttr} stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  function hand(x, y, type, ang, k = 1) {
    const deg = ang * 180 / Math.PI, f = (n, a = ang) => [x + Math.cos(a) * n * k, y + Math.sin(a) * n * k];
    if (type === 'wave') return `${[-.5, -.17, .17, .5].map(o => { const [a, b] = f(8, ang + o), [c, d] = f(19, ang + o * 1.2); return `<path d="M${a.toFixed(1)} ${b.toFixed(1)} L${c.toFixed(1)} ${d.toFixed(1)}" stroke="${O}" stroke-width="${6 * k}" stroke-linecap="round"/><path d="M${a.toFixed(1)} ${b.toFixed(1)} L${c.toFixed(1)} ${d.toFixed(1)}" style="stroke:var(--skin)" stroke-width="${3.4 * k}" stroke-linecap="round"/>`; }).join('')}<ellipse cx="${x}" cy="${y}" rx="${9 * k}" ry="${8 * k}" ${F('skin')} ${LN} transform="rotate(${deg} ${x} ${y})"/>`;
    const R = (inner, cx, cy) => `<g transform="rotate(${deg.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})">${inner}</g>`;
    if (type === 'fist') { const [cx, cy] = f(3); return R(`<rect x="${(cx - 9 * k).toFixed(1)}" y="${(cy - 9 * k).toFixed(1)}" width="${18 * k}" height="${18 * k}" rx="${8 * k}" ${F('skin')} ${LN}/><path d="M${(cx + 2 * k).toFixed(1)} ${(cy - 6 * k).toFixed(1)} v${12 * k} M${(cx + 6 * k).toFixed(1)} ${(cy - 5 * k).toFixed(1)} v${10 * k}" ${S('skin-d')} stroke-width="1.3" stroke-linecap="round"/><ellipse cx="${(cx - 3 * k).toFixed(1)}" cy="${(cy - 9 * k).toFixed(1)}" rx="${5 * k}" ry="${3.4 * k}" ${F('skin')} ${LN}/>`, cx, cy); }
    const [cx, cy] = f(6);
    return R(`<path d="M${(cx - 8 * k).toFixed(1)} ${(cy - 8 * k).toFixed(1)} L${(cx + 7 * k).toFixed(1)} ${(cy - 8 * k).toFixed(1)} Q${(cx + 14 * k).toFixed(1)} ${cy.toFixed(1)} ${(cx + 7 * k).toFixed(1)} ${(cy + 8 * k).toFixed(1)} L${(cx - 8 * k).toFixed(1)} ${(cy + 8 * k).toFixed(1)}Z" ${F('skin')} ${LN}/><path d="M${(cx + 2 * k).toFixed(1)} ${(cy - 3 * k).toFixed(1)} h${7 * k} M${(cx + 2 * k).toFixed(1)} ${(cy + 2 * k).toFixed(1)} h${7 * k}" ${S('skin-d')} stroke-width="1.2" stroke-linecap="round"/><ellipse cx="${(cx - 2 * k).toFixed(1)}" cy="${(cy - 9 * k).toFixed(1)}" rx="${5 * k}" ry="${3 * k}" transform="rotate(-30 ${(cx - 2 * k).toFixed(1)} ${(cy - 9 * k).toFixed(1)})" ${F('skin')} ${LN}/>`, cx, cy);
  }
  // orig = true: đổi về toạ độ vẽ gốc (dùng cho ảnh nhỏ áo/váy)
  function arms(st, sleevesOnly = false, orig = false) {
    const p = POSES[st.pose] || POSES[0], K = orig ? 1 : 1.12;
    const top = TOPS[st.top], dress = DRESSES[st.dress], outer = OUTERS[st.outer];
    let src = null, sc = null;
    if (outer && outer.sleeve) { src = outer; sc = 'outer'; } else if (dress) { src = dress; sc = 'dress'; } else if (top) { src = top; sc = 'top'; }
    const sleeve = src && src.sleeve;
    const fill = !src ? '' : src.sc ? `stroke="${src.sc}"` : src.fixed ? `stroke="${src.fixed}"` : src.pat ? `stroke="url(#${P}-${sc})"` : `style="stroke:var(--${sc})"`;
    const cuffFill = !src ? '' : src.sc || src.fixed ? `stroke="${shade(src.sc || src.fixed, -40)}"` : `style="stroke:var(--${sc}-d)"`;
    const pts = side => { const [el, hd] = p[side]; const q = [SHOULDER[side], el, hd]; return orig ? q.map(toOrig) : q; };
    const armG = side => {
      const q = pts(side); let g = sleevesOnly ? '' : stroke2(poly(q), 14.5 * K, 'style="stroke:var(--skin)"');
      if (sleeve && sleeve !== 'none') {
        const f = sleeve === 'long' ? .86 : sleeve === 'rolled' ? .5 : .28, sp = along(q, f);
        g += stroke2(poly(sp), (sleeve === 'short' ? 23 : 21) * K, fill);
        if (sleeve === 'rolled') { const a = sp[sp.length - 1], b = sp[sp.length - 2], L = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, t = 7 * K / L; g += `<path d="M${(a[0] - (a[0] - b[0]) * t).toFixed(1)} ${(a[1] - (a[1] - b[1]) * t).toFixed(1)} L${a[0].toFixed(1)} ${a[1].toFixed(1)}" stroke="${O}" stroke-width="${27 * K}" stroke-linecap="butt"/><path d="M${(a[0] - (a[0] - b[0]) * t * .8).toFixed(1)} ${(a[1] - (a[1] - b[1]) * t * .8).toFixed(1)} L${(a[0] - (a[0] - b[0]) * t * .1).toFixed(1)} ${(a[1] - (a[1] - b[1]) * t * .1).toFixed(1)}" ${cuffFill} stroke-width="${23.5 * K}" stroke-linecap="butt"/>`; }
      }
      // nối vai: tô đè đoạn đầu cánh tay trong phạm vi thân áo → mất đường viền tròn ở vai, chỉ giữ đường vai ngoài
      if (sleeve !== 'none') { const w = (sleeve ? (sleeve === 'short' ? 23 : 21) : 14.5) * K + 4; g += `<g clip-path="url(#${P}-tc${side})"><path d="${poly(along(q, .24))}" fill="none" ${sleeve ? fill : 'style="stroke:var(--skin)"'} stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
      return g;
    };
    const clipDef = side => `<defs><clipPath id="${P}-tc${side}" clipPathUnits="userSpaceOnUse"><path d="${TORSO}"${orig ? '' : ` transform="${UP_T}"`}/></clipPath></defs>`;
    const handG = side => { const q = pts(side), [el, hd, type] = [q[1], q[2], p[side][2]]; return type === 'none' ? '' : hand(hd[0], hd[1], type, Math.atan2(hd[1] - el[1], hd[0] - el[0]), K); };
    if (sleevesOnly) return clipDef('L') + clipDef('R') + armG('L') + armG('R');
    let prop = '', behind = false;
    if (p.prop) { const [ax, ay, s, back] = PROP_AT[p.prop]; behind = back; prop = `<g transform="translate(${p.at[0]} ${p.at[1]}) scale(${s}) translate(${-ax} ${-ay})">${PROPS[p.prop]}</g>`; }
    return clipDef('L') + clipDef('R') + (behind ? prop : '') + armG('L') + armG('R') + (behind ? '' : prop) + handG('L') + handG('R');
  }

  // ---------- Thứ tự lớp (từ dưới lên) ----------
  const LAYERS = [
    ['accBack', 'Đồ đeo sau lưng'], ['hairBack', 'Tóc sau'], ['body', 'Thân & da'], ['socks', 'Ống chân'], ['shoes', 'Dép guốc'], ['bottom', 'Quần / váy'], ['top', 'Áo'], ['dress', 'Áo dài / váy liền'], ['outer', 'Khăn & áo ngoài'],
    ['accBody', 'Phụ kiện người'], ['accFree', 'Đèn & đom đóm'], ['face', 'Mặt'], ['blush', 'Má hồng'], ['eyes', 'Mắt'], ['brows', 'Lông mày'], ['mouth', 'Miệng'], ['fringe', 'Mái'], ['hairFront', 'Tóc trước & bím'], ['arms', 'Tay & vật cầm'], ['hatStrap', 'Quai nón'], ['acc', 'Phụ kiện đầu'],
  ];
  const accOf = (st, at) => (st.accessories || []).filter(i => ACCS[i] && ACCS[i].at === at);
  function layer(name, st) {
    const hair = HAIRS[st.hair] || HAIRS[0];
    switch (name) {
      case 'accBack': return accOf(st, 'back').map(i => ACCS[i].draw()).join('');
      case 'hairBack': return `<g style="fill:var(--hair)" ${LN}>${hair.back}</g>`;
      case 'body': return `<path d="M187 168 L213 168 L214 214 Q200 224 186 214Z" ${F('skin')} ${LN}/><path d="M187 176 Q200 192 213 176 L213 188 Q200 198 187 188Z" ${F('skin-d')} opacity=".7"/>
        <path d="${TORSO}" ${F('skin')} ${LN}/>
        <path d="${LEGL}" ${F('skin')} ${LN}/><path d="${LEGR}" ${F('skin')} ${LN}/><path d="M172 560 q8 6 16 0 M212 560 q8 6 16 0" fill="none" ${S('skin-d')} stroke-width="1.6"/>
        <path d="${FOOTL}" ${F('skin')} ${LN}/><path d="${FOOTR}" ${F('skin')} ${LN}/><path d="M166 762 v-4 M171 763 v-4 M176 763 v-4 M234 762 v-4 M229 763 v-4 M224 763 v-4" ${S('skin-d')} stroke-width="1.2" stroke-linecap="round"/>
        <path d="M168 214 Q200 226 232 214 L240 330 L160 330Z" fill="#f4ead5" ${LN}/><path d="M158 326 L242 326 L248 420 L204 424 L200 384 L196 424 L152 420Z" fill="#f4ead5" ${LN}/>`;
      case 'face': return (FACES[st.face] || FACES[0]).draw();
      case 'blush': return st.blush < 0 ? '' : [[174, 157], [226, 157]].map(([x, y]) => `<g transform="translate(${x} ${y})">${BLUSHES[st.blush].g}</g>`).join('');
      case 'eyes': {
        const e = EYES[st.eyes] || EYES[0];
        if (e.g === 'WINK') return `<g transform="translate(${EYE_L})">${EYES[2].g}</g><g transform="translate(${EYE_R}) scale(-1 1)">${EYES[1].g}</g>`;
        return `<g transform="translate(${EYE_L[0]} ${EYE_L[1] + e.dy})">${e.g}</g><g transform="translate(${EYE_R[0]} ${EYE_R[1] + e.dy}) scale(-1 1)">${e.g}</g>`;
      }
      case 'brows': { const b = BROWS[st.brows] || BROWS[0]; return `<path d="${b.d}" transform="translate(181 122)" fill="none" style="stroke:var(--hair-d)" stroke-width="${b.w}" stroke-linecap="round"/><path d="${b.d}" transform="translate(219 122) scale(-1 1)" fill="none" style="stroke:var(--hair-d)" stroke-width="${b.w}" stroke-linecap="round"/>`; }
      case 'mouth': return `<g transform="translate(200 164)">${(MOUTHS[st.mouth] || MOUTHS[0]).g}</g>`;
      case 'socks': return st.socks < 0 || !SOCKS[st.socks] ? '' : SOCKS[st.socks].draw();
      case 'shoes': return st.shoes < 0 || !SHOES[st.shoes] ? '' : SHOES[st.shoes].draw();
      case 'bottom': return st.bottom < 0 || (st.dress >= 0 && !DRESSES[st.dress].keepBottom) ? '' : BOTTOMS[st.bottom].draw();
      case 'top': return st.top < 0 || st.dress >= 0 ? '' : TOPS[st.top].draw();
      case 'dress': return st.dress < 0 ? '' : DRESSES[st.dress].draw();
      case 'outer': return st.outer < 0 ? '' : OUTERS[st.outer].draw();
      case 'fringe': { const fr = FRINGES[st.fringe] || FRINGES[0]; return `<path d="${fr.d}" style="fill:var(--hair)" ${LN}/>${fr.locks ? `<g style="fill:var(--hair)" ${LN}>${fr.locks}</g>` : ''}<path d="M166 72 Q182 60 198 60 M208 61 Q222 62 232 70" fill="none" style="stroke:var(--hair-l)" stroke-width="3" stroke-linecap="round" opacity=".5"/><path d="M176 70 Q166 84 160 104 M224 70 Q234 84 240 104" fill="none" style="stroke:var(--hair-l)" stroke-width="1.2" opacity=".45"/>`; }
      case 'hairFront': return `${hair.front ? `<g style="fill:var(--hair)" ${LN}>${hair.front}</g>` : ''}${hair.ties || ''}`;
      case 'acc': return accOf(st, 'head').map(i => `<g data-acc="${i}">${ACCS[i].draw()}</g>`).join('');
      case 'accFree': return accOf(st, 'free').map(i => ACCS[i].draw()).join('');
      // quai nón: nằm DƯỚI mặt → chỉ lộ ở hai mép má rồi vòng xuống dưới cằm
      case 'hatStrap': { const c = (FACES[st.face] || FACES[0]).chin, d = `M156 112 Q150 154 170 ${c - 12} Q200 ${c + 14} 230 ${c - 12} Q250 154 244 112`;   // ôm theo mép má, vòng dưới cằm
        return accOf(st, 'head').filter(i => ACCS[i].chin).map(i => `<g data-acc="${i}"><path d="${d}" fill="none" stroke="${O}" stroke-width="3.2"/><path d="${d}" fill="none" stroke="#c8372d" stroke-width="1.7"/></g>`).join(''); }
      case 'accBody': return accOf(st, 'body').map(i => ACCS[i].draw()).join('') + (accOf(st, 'back').some(i => ACCS[i].strap) ? `<path d="M178 206 Q200 236 222 206" fill="none" stroke="#c8372d" stroke-width="2"/>` : '');
      case 'arms': return arms(st);
    }
    return '';
  }

  // Nhân vật (không nền): mỗi lớp một <g data-layer>, ẩn lớp theo danh sách hidden
  const W = 400, H = 820;
  // Khổ chibi: đầu phóng 1.7 (cằm ở y 349, đỉnh tóc ~y 108) ≈ 1/3 chiều cao; thân & chân co 0.72, nở ngang 1.25 cho đầy đặn
  // Tỉ lệ theo ảnh mẫu: đầu ~38% chiều cao (cằm y 383), cổ ~30px, thân dài (co giãn 1.1), chân ngắn (0.43)
  // Thân & chân dùng 2 phép biến đổi nối nhau tại hông (y gốc 372 → y 597.7), cắt bằng clipPath để liền mạch.
  const HEAD_T = 'translate(200 383) scale(1.82 1.56) translate(-200 -190)';
  const BSX = 1.25, SU = 1.1, SL = .43, NECK_Y = 414, HIP = 372, HIP_Y = NECK_Y + (HIP - 205) * SU;
  const UP_T = `translate(200 ${NECK_Y}) scale(${BSX} ${SU}) translate(-200 -205)`;
  const LO_T = `translate(200 ${HIP_Y.toFixed(1)}) scale(${BSX} ${SL}) translate(-200 -${HIP})`;
  const bodyWrap = inner => { const id = P + 'cl'; return `<defs><clipPath id="${id}u" clipPathUnits="userSpaceOnUse"><rect x="-400" y="-400" width="1200" height="${(HIP_Y + 400.4).toFixed(1)}"/></clipPath><clipPath id="${id}l" clipPathUnits="userSpaceOnUse"><rect x="-400" y="${(HIP_Y - .4).toFixed(1)}" width="1200" height="800"/></clipPath></defs><g clip-path="url(#${id}u)"><g transform="${UP_T}">${inner}</g></g><g clip-path="url(#${id}l)"><g transform="${LO_T}">${inner}</g></g>`; };
  const toOrig = ([x, y]) => [200 + (x - 200) / BSX, 205 + (y - NECK_Y) / SU];
  const SHOULDER = { L: [155, 437], R: [245, 437] };
  const HEADS = ['hairBack', 'hatStrap', 'face', 'blush', 'eyes', 'brows', 'mouth', 'fringe', 'hairFront', 'acc'];
  const FREE = ['arms', 'accFree'];
  const thin = s => s.replace(/stroke-width="([\d.]+)"/g, (m, w) => `stroke-width="${+(w * .58).toFixed(2)}"`);   // giữ nét đầu ≈ nét thân sau khi phóng
  function charSvg(st, hidden = []) {
    P = 'p' + (++gid);
    const acc = st.accessories || [], hatTop = acc.includes(0) ? 100 : acc.includes(3) ? 100 : 0;   // nón lá / mũ lưỡi trai che đỉnh đầu
    const hatDef = `<defs><clipPath id="${P}-hat" clipPathUnits="userSpaceOnUse"><rect x="0" y="${hatTop}" width="400" height="400"/></clipPath></defs>`;
    return LAYERS.map(([k]) => {
      let inner = layer(k, st);
      if (HEADS.includes(k)) inner = thin(inner);
      if (k === 'eyes') inner = `<g class="du-blink">${inner}</g>`;
      const head = HEADS.includes(k), free = FREE.includes(k);
      if (hatTop && (k === 'hairBack' || k === 'fringe' || k === 'hairFront')) inner = `<g class="hatclip" clip-path="url(#${P}-hat)">${inner}</g>`;
      return `<g data-layer="${k}"${head ? ` transform="${HEAD_T}"` : ''}${hidden.includes(k) ? ' style="display:none"' : ''}>${k === 'hairBack' && hatTop ? hatDef : ''}${head || free ? inner : bodyWrap(inner)}</g>`;
    }).join('');
  }

  // Bảng màu cũ (v4/v5) → chuyển sang bảng màu mới theo cùng vị trí
  const OLD_HAIR = ['#3b2a24', '#5a3a2a', '#8a5a3a', '#b07a4a', '#d9a86a', '#f2d38a', '#e8e8ee', '#f4a6c0', '#b79be0', '#8fc7f0', '#9fd8b4', '#e5735a'];
  const OLD_CLOTH = ['#ffffff', '#f5c542', '#f49ab8', '#8fc7f0', '#9fd8b4', '#b79be0', '#e5735a', '#2f3a4a', '#c9a27e', '#0b6b3a', '#ff8a5c', '#9aa6b8'];
  const NEW_CLOTH = ['#f4ead5', '#f2c14e', '#e98fa6', '#7fc3c9', '#7cc46a', '#4f6fb8', '#c8372d', '#23202b', '#8a5a3a', '#3f8f5a', '#e0564a', '#2b3f7a'];
  const normalize = cfg => {
    let st;
    if (cfg && cfg.v === 6) st = { ...DEFAULT, ...cfg };
    else if (cfg && cfg.v) {
      st = { ...DEFAULT, name: cfg.name || '', unlocked: cfg.unlocked || [] };
      for (const k of ['face', 'hair', 'eyes', 'brows', 'mouth', 'blush', 'top', 'outer', 'dress', 'bottom', 'shoes', 'socks', 'pose', 'bg']) if (Number.isInteger(cfg[k])) st[k] = cfg[k];
      const hi = OLD_HAIR.indexOf(cfg.hairColor); st.hairColor = HAIRC[Math.max(0, hi) % 6];
      for (const k of ['top', 'outer', 'dress', 'bottom']) { const ci = OLD_CLOTH.indexOf(cfg[k + 'Color']); if (ci >= 0) st[k + 'Color'] = NEW_CLOTH[ci]; }
      const si = ['#fff1e8', '#fbe3d3', '#fbd5bf', '#f6c7a8', '#f0b892', '#e6a77e', '#d8956c', '#c4805a', '#ad6c4a', '#94593d', '#7a4630', '#5f3524'].indexOf(cfg.skin); if (si >= 0) st.skin = SKINS[si];
      st.accessories = (cfg.accessories || []).filter(i => i < ACCS.length);
      if (st.top >= 0 && st.bottom < 0 && st.dress < 0) st.bottom = 0;
    } else st = { ...DEFAULT, name: cfg?.name || '' };
    for (const [k, list] of Object.entries(CATS)) if (k !== 'acc' && k in st) { const n = list.length; if (!(st[k] < n)) st[k] = REQUIRED.includes(k) ? 0 : -1; if (st[k] < 0 && REQUIRED.includes(k)) st[k] = 0; }
    st.accessories = [...(st.accessories || [])].filter(i => i >= 0 && i < ACCS.length); st.unlocked = [...(st.unlocked || [])];
    // không mặc đồ còn khóa (dữ liệu cũ / ngẫu nhiên cũ) – trả về mặc định
    for (const k of Object.keys(CATS)) if (k !== 'acc' && st[k] >= 0 && isLocked(k, st[k], st)) st[k] = REQUIRED.includes(k) ? DEFAULT[k] : -1;
    const seen = new Set(); st.accessories = st.accessories.filter(i => { if (isLocked('acc', i, st)) return false; const sl = slotOf(i); if (!sl) return true; if (seen.has(sl)) return false; seen.add(sl); return true; });
    if (st.dress >= 0) { st.top = -1; if (!DRESSES[st.dress].keepBottom) st.bottom = -1; }
    return st;
  };

  let uid = 0;
  // Ảnh đại diện tròn (bán thân) – dùng ở thanh menu, bài đăng, bạn bè…
  function render(cfg, size = 64) {
    const st = normalize(cfg), id = 'av' + (++uid);
    return `<svg class="avatar" width="${size}" height="${size}" viewBox="34 100 332 332" style="${styleOf(st)}" role="img" aria-label="Nhân vật">
      <defs><clipPath id="${id}c"><circle cx="200" cy="266" r="166"/></clipPath></defs><g clip-path="url(#${id}c)">${bgSvg(st.bg, id)}${charSvg(st)}</g></svg>`;
  }
  // Toàn thân kèm nền (khung 400 x 820)
  function renderFull(cfg, height = 820, withBg = true) {
    const st = normalize(cfg), id = 'avf' + (++uid);
    return `<svg class="avatar-full" width="${Math.round(height * W / H)}" height="${height}" viewBox="0 0 ${W} ${H}" style="${styleOf(st)}" role="img" aria-label="Nhân vật toàn thân">${withBg ? bgSvg(st.bg, id) : ''}<g class="du-char">${charSvg(st)}</g></svg>`;
  }
  // SVG độc lập (đã thay biến màu bằng mã màu thật) – để xuất PNG
  function exportSvg(cfg, w = 600) {
    const st = normalize(cfg), v = vars(st);
    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round(w * H / W)}" viewBox="0 0 ${W} ${H}">${bgSvg(st.bg, 'ex')}${charSvg(st)}</svg>`;
    return s.replace(/var\(--([a-z-]+)\)/g, (m, k) => v[k] || m);
  }

  // Hình thu nhỏ cho ô vật phẩm (kế thừa biến màu từ khung chứa)
  const ACC_VB = ['102 24 196 120', '138 50 124 100', '170 52 100 80', '138 30 124 100', '256 640 100 136', '160 200 140 220', '130 52 100 80', '150 170 190 200', '100 200 140 240', '172 190 56 50', '176 40 100 80', '60 160 280 420'];
  function thumb(cat, i, st) {
    P = 't' + (++gid);
    const t = { ...st, accessories: [] };
    const svg = (vb, inner) => `<svg class="du-ic" viewBox="${vb}" aria-hidden="true">${inner}</svg>`;
    const only = (layers, vb, s2 = t) => svg(vb, layers.map(k => layer(k, s2)).join(''));
    const skinBg = (vb) => { const [x, y, w, h] = vb.split(' ').map(Number); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${F('skin')}/>`; };
    const sq = (y0, h) => { const z = Math.max(180, h - y0 + 16); return `${200 - z / 2} ${y0 - 6} ${z} ${z}`; };
    const HEADCTX = ['hairBack', 'face', 'fringe'];
    switch (cat) {
      case 'face': return only(['face', 'blush', 'eyes', 'mouth'], '128 54 144 148', { ...t, face: i, blush: 0, eyes: 0, mouth: 1 });
      case 'skin': return svg('128 54 144 148', `<g style="--skin:${i};--skin-d:${warm(i)}">${layer('face', t)}</g>`);
      case 'hair': return only(['hairBack', 'face', 'fringe', 'hairFront'], '82 14 236 300', { ...t, hair: i });
      case 'fringe': return only(['hairBack', 'face', 'fringe'], '122 24 156 164', { ...t, fringe: i, hair: HAIRS.findIndex(h => h.name === 'Tóc ngắn') });
      case 'eyes': return svg('158 112 84 56', skinBg('158 112 84 56') + layer('eyes', { ...t, eyes: i }));
      case 'brows': return svg('158 104 84 56', skinBg('158 104 84 56') + layer('eyes', t) + layer('brows', { ...t, brows: i }));
      case 'mouth': return svg('178 146 44 36', skinBg('178 146 44 36') + layer('mouth', { ...t, mouth: i }));
      case 'blush': return svg('150 126 100 64', skinBg('150 126 100 64') + layer('blush', { ...t, blush: i }));
      case 'top': { const s2 = { ...t, top: i, dress: -1, outer: -1, pose: 0 }; return svg(sq(196, TOPS[i].h), arms(s2, true, true) + TOPS[i].draw()); }
      case 'outer': { const s2 = { ...t, outer: i, dress: -1, top: -1, pose: 0 }; return svg(OUTERS[i].vb, `<path d="${TORSO}" fill="#e9e2d2" opacity=".5"/>` + arms(s2, true, true) + OUTERS[i].draw()); }
      case 'dress': { const s2 = { ...t, dress: i, outer: -1, pose: 0 }; return svg(sq(196, DRESSES[i].h), arms(s2, true, true) + DRESSES[i].draw()); }
      case 'bottom': return svg(sq(322, BOTTOMS[i].h), BOTTOMS[i].draw());
      case 'socks': return svg('136 520 128 250', `<path d="${LEGL}" ${F('skin')} ${LN}/><path d="${LEGR}" ${F('skin')} ${LN}/>` + BOTTOMS[0].draw() + SOCKS[i].draw());
      case 'shoes': return svg('148 640 104 140', `<path d="${FOOTL}" ${F('skin')} ${LN}/><path d="${FOOTR}" ${F('skin')} ${LN}/>` + SHOES[i].draw());
      case 'acc': { const a = ACCS[i], head = a.at === 'head' && !a.slot ? HEADCTX.map(k => layer(k, t)).join('') : ''; return svg(ACC_VB[i], (i === 11 ? '<rect x="60" y="160" width="280" height="420" rx="20" fill="#23285e"/>' : '') + head + a.draw() + (a.strap ? `<path d="M178 206 Q200 236 222 206" fill="none" stroke="#c8372d" stroke-width="2"/>` : '')); }
      // dáng: chỉ cắt thân trên + tay (khung cuối) để thấy rõ khác biệt
      case 'pose': { const s2 = { ...t, pose: i, outer: -1, dress: -1 }; return svg('62 318 276 290', bodyWrap(layer('body', s2) + layer('bottom', s2) + layer('top', s2)) + arms(s2)); }
      case 'bg': return `<svg class="du-ic" viewBox="0 0 400 820" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bgSvg(i, 'tb' + (++gid))}</svg>`;
    }
    return '';
  }

  // nền chủ đề cho ảnh check-in của bạn bè (toạ độ 200 x 340)
  function sceneSvg(i, id) { const b = BGS[i % BGS.length]; return `<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b.c[0]}"/><stop offset="1" stop-color="${b.c[1]}"/></linearGradient></defs><rect width="200" height="340" fill="url(#${id}s)"/>`; }

  function random(base = {}) {
    const r = n => Math.floor(Math.random() * n), pick = a => a[r(a.length)];
    const st = normalize(base);
    const free = (cat, n) => pick(Array.from({ length: n }, (_, i) => i).filter(i => !isLocked(cat, i, st)));
    const useDress = Math.random() < .3;
    const accs = [...new Set([free('acc', ACCS.length), free('acc', ACCS.length)])].filter(() => Math.random() < .65).filter((a, k, arr) => !slotOf(a) || arr.findIndex(b => slotOf(b) === slotOf(a)) === k);
    Object.assign(st, {
      face: free('face', FACES.length), skin: pick(SKINS), hair: free('hair', HAIRS.length), hairColor: Math.random() < .7 ? pick(HAIRC.slice(0, 6)) : pick(HAIRC), fringe: free('fringe', FRINGES.length),
      eyes: free('eyes', EYES.length), eyeColor: pick(EYEC), brows: free('brows', BROWS.length), mouth: free('mouth', MOUTHS.length), blush: Math.random() < .2 ? -1 : free('blush', BLUSHES.length),
      top: useDress ? -1 : free('top', TOPS.length), topColor: pick(CLOTH), bottom: free('bottom', BOTTOMS.length), bottomColor: Math.random() < .6 ? '#23202b' : pick(CLOTH),
      dress: useDress ? free('dress', DRESSES.length) : -1, dressColor: pick(CLOTH), outer: Math.random() < .3 ? free('outer', OUTERS.length) : -1, outerColor: pick(CLOTH),
      shoes: Math.random() < .75 ? free('shoes', SHOES.length) : -1, shoeColor: pick(CLOTH), socks: Math.random() < .35 ? free('socks', SOCKS.length) : -1,
      accessories: accs, pose: free('pose', POSES.length), bg: free('bg', BGS.length),
    });
    return normalize(st);
  }

  // Thưởng mở khoá từ hoạt động trên web (đặt ly, dự thi…)
  function grant(key) {
    const u = State.user; if (!u) return;
    const st = normalize(u.avatar);
    if (!st.unlocked.includes(key)) { st.unlocked.push(key); State.user = { ...u, avatar: st }; }
  }

  return {
    DEFAULT, REQUIRED, LAYERS, CATS, slotOf, SKINS, HAIRC, EYEC, CLOTH,
    normalize, vars, styleOf, render, renderFull, exportSvg, thumb, charSvg, bgSvg, sceneSvg, random, grant, isLocked,
    REF: DEFAULT, scenes: BGS, outfits: [], accs: [], isUnlocked: () => true,
  };
})();
