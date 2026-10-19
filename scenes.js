// Tranh minh hoạ vẽ bằng SVG cho các trang – phong cách sách tranh, màu nước ấm
const Scenes = (() => {
  const INK = '#3B2A20';
  let n = 0;
  const wrap = (w, h, body, cls = 'scene', align = 'xMidYMax slice') => {
    const id = 'sc' + (++n);
    return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${align}" aria-hidden="true">${body(id)}
      <filter id="${id}g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .23 0 0 0 0 .16 0 0 0 0 .12 0 0 0 .09 0"/></filter>
      <rect width="${w}" height="${h}" filter="url(#${id}g)"/></svg>`;
  };

  const bush = (x, y, s = 1, cols = ['#7FA0D8', '#9FB8E6', '#A99AD8']) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="10" rx="34" ry="16" fill="#5E8C4A"/>
      ${[[-18, 0, 0], [0, -6, 1], [18, 0, 2], [-8, 8, 1], [10, 8, 0]].map(([dx, dy, k]) => `<circle cx="${dx}" cy="${dy}" r="12" fill="${cols[k]}"/>`).join('')}
      ${[[-20, -3], [-2, -9], [16, -3], [6, 6]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="1.8" fill="#fff" opacity=".7"/>`).join('')}</g>`;

  const tree = (x, y, s = 1, light = '#B9CF6E', dark = '#7FA650') =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 Q-4 -60 -14 -120 L6 -120 Q4 -60 8 0Z" fill="#7A5236"/>
      <path d="M-4 -90 Q-30 -110 -44 -104 M2 -100 Q24 -124 40 -120" stroke="#7A5236" stroke-width="5" fill="none"/>
      ${[[-50, -130, 34, dark], [0, -160, 44, dark], [46, -132, 36, dark], [-26, -158, 30, light], [24, -170, 30, light], [-56, -112, 22, light], [54, -112, 22, light]].map(([cx, cy, r, f]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" opacity=".95"/>`).join('')}</g>`;

  // Mặt tiền quán trà – trang chủ
  function storefront() {
    return wrap(1200, 560, id => `
      <defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCEBD6"/><stop offset=".65" stop-color="#F6D7B6"/></linearGradient>
        <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1D2"/><stop offset="1" stop-color="#F3C98E"/></linearGradient></defs>
      <rect width="1200" height="560" fill="url(#${id}k)"/>
      <circle cx="980" cy="120" r="70" fill="#FBDDB5" opacity=".8"/>
      <path d="M0 300 Q120 180 220 250 Q300 120 380 230 Q460 150 560 240 L560 330 H0Z" fill="#CFE0C9" opacity=".7"/>
      <path d="M640 250 Q760 140 860 230 Q960 160 1060 240 Q1130 190 1200 220 V330 H640Z" fill="#CFE0C9" opacity=".7"/>
      <g fill="#F1E2CC" opacity=".9"><rect x="300" y="90" width="600" height="200"/>${Array.from({ length: 6 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${318 + c * 58}" y="${104 + r * 30}" width="36" height="18" fill="#E6D2B6"/>`).join('')).join('')}</g>
      <path d="M-40 250 Q200 200 420 260 T900 230 T1260 250" fill="none" stroke="#FFF8EC" stroke-width="26" opacity=".55" stroke-linecap="round"/>
      <rect x="0" y="440" width="1200" height="120" fill="#F1DCC2"/>
      <g stroke="#E5C9A8" stroke-width="2">${Array.from({ length: 16 }, (_, k) => `<path d="M${k * 80} 440 L${k * 80 - 60} 560"/>`).join('')}<path d="M0 480 H1200 M0 524 H1200"/></g>
      <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
        <rect x="330" y="230" width="540" height="220" fill="#8A5A3B"/>
        <rect x="330" y="230" width="540" height="64" fill="#A0704C"/>
        ${Array.from({ length: 26 }, (_, k) => `<path d="M${342 + k * 20.5} 234 V290" stroke="#7A4E30" stroke-width="2"/>`).join('')}
        <rect x="350" y="304" width="150" height="136" fill="url(#${id}w)"/><rect x="520" y="304" width="160" height="136" fill="url(#${id}w)"/><rect x="700" y="304" width="150" height="136" fill="url(#${id}w)"/>
      </g>
      <g stroke="#C79A6A" stroke-width="2.5" opacity=".8">${[0, 1, 2, 3].map(k => `<path d="M352 ${312 + k * 8} h146 M702 ${312 + k * 8} h146"/>`).join('')}</g>
      <rect x="560" y="340" width="80" height="100" fill="#7A4E30" stroke="${INK}" stroke-width="3"/><circle cx="626" cy="392" r="4" fill="#E2A94B"/>
      <g fill="#C2553F" stroke="${INK}" stroke-width="2"><path d="M380 404 h90 v36 h-90z" fill="#E9C9A6"/><path d="M730 404 h90 v36 h-90z" fill="#E9C9A6"/></g>
      ${[400, 430, 760, 790].map(x => `<path d="M${x} 404 v-14 h14 v14" fill="#FFFBF4" stroke="${INK}" stroke-width="1.6"/>`).join('')}
      ${[[420, 330], [600, 318], [780, 330]].map(([x, y]) => `<path d="M${x} 304 V${y}" stroke="${INK}" stroke-width="1.5"/><path d="M${x - 10} ${y} h20 l-4 10 h-12z" fill="#E2A94B" stroke="${INK}" stroke-width="1.5"/><circle cx="${x}" cy="${y + 16}" r="14" fill="#FFE7A8" opacity=".5"/>`).join('')}
      <text x="600" y="274" text-anchor="middle" font-family="Pangolin, cursive" font-size="34" fill="#FFF3DC">Tea Lab · Trà Độc Bản</text>
      ${bush(300, 450, 1.2)}${bush(400, 452, 1, ['#E58FA0', '#F2B6C2', '#A99AD8'])}${bush(500, 454, .9)}${bush(700, 454, .9, ['#A99AD8', '#9FB8E6', '#7FA0D8'])}${bush(800, 452, 1)}${bush(900, 450, 1.2, ['#E58FA0', '#9FB8E6', '#F2B6C2'])}
      ${tree(160, 470, 1.25)}${tree(1080, 470, 1.15, '#C9DB8C', '#8DB45E')}
      <g stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round">
        <path d="M150 520 l20 -40 h40 l20 40 M170 480 l-6 -30 M210 480 l6 -30" /><path d="M236 520 l16 -34 h36 l16 34"/>
      </g>
      <path d="M160 450 q20 -8 46 0 l-4 30 h-40z" fill="#3E5A7A" stroke="${INK}" stroke-width="2.4"/>
      <ellipse cx="270" cy="484" rx="34" ry="7" fill="#F4EEE2" stroke="${INK}" stroke-width="2.4"/><path d="M270 491 V520" stroke="${INK}" stroke-width="2.4"/>
      <g transform="translate(930 400)" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
        <path d="M0 110 V40 Q0 0 50 0 H170 Q200 0 206 40 L210 110Z" fill="#EFE3CB"/>
        <path d="M0 74 H210" stroke="#C79A6A" stroke-width="10"/>
        <rect x="16" y="14" width="40" height="34" rx="6" fill="#CFE3E6"/><rect x="66" y="14" width="40" height="34" rx="6" fill="#CFE3E6"/><rect x="116" y="14" width="40" height="34" rx="6" fill="#CFE3E6"/><path d="M168 14 h22 q10 0 12 34 h-34z" fill="#CFE3E6"/>
        <circle cx="50" cy="114" r="20" fill="#3B3B3B"/><circle cx="50" cy="114" r="8" fill="#BBB"/><circle cx="168" cy="114" r="20" fill="#3B3B3B"/><circle cx="168" cy="114" r="8" fill="#BBB"/>
        <path d="M100 60 q-8 6 0 16 q8 -10 0 -16z" fill="#7FA650" stroke-width="1.6"/>
      </g>
      <g transform="translate(1150 330)"><rect x="-4" y="0" width="8" height="200" fill="#fff" stroke="${INK}" stroke-width="2"/>${[0, 1, 2, 3, 4, 5, 6].map(k => `<rect x="-4" y="${10 + k * 28}" width="8" height="14" fill="#C8463B"/>`).join('')}<rect x="-6" y="-20" width="50" height="24" rx="3" fill="#3E6FA8" stroke="${INK}" stroke-width="2"/><text x="19" y="-3" text-anchor="middle" font-size="13" font-family="Pangolin, cursive" fill="#fff">1986</text></g>`);
  }

  // Đồi chè bậc thang + ấm trà – Tea Lab / Wrapped
  function teaHills(h = 320) {
    return wrap(1200, h, id => `
      <defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6DE"/><stop offset="1" stop-color="#F3DDA8"/></linearGradient></defs>
      <rect width="1200" height="${h}" fill="url(#${id}k)"/><circle cx="880" cy="70" r="28" fill="#E86F4A"/>
      ${[[620, 220, 40, 150], [700, 200, 30, 170], [1000, 210, 36, 160], [1080, 190, 28, 180]].map(([x, b, w, t]) => `<path d="M${x} ${b + 60} Q${x + 4} ${b - t + 60} ${x + w / 2} ${b - t + 40} Q${x + w - 4} ${b - t + 60} ${x + w} ${b + 60}Z" fill="#8FB8A8" opacity=".6"/>`).join('')}
      <path d="M-20 120 Q200 60 420 130 T860 110 T1240 100" fill="none" stroke="#FFFBF0" stroke-width="24" opacity=".6" stroke-linecap="round"/>
      ${[0, 1, 2, 3, 4].map(k => `<path d="M0 ${170 + k * 34} Q300 ${130 + k * 34} 600 ${170 + k * 36} T1200 ${150 + k * 34} V${h} H0Z" fill="${['#D9E59A', '#C2D97F', '#A8C66C', '#8DB45E', '#76A050'][k]}"/>
        <path d="M0 ${178 + k * 34} Q300 ${138 + k * 34} 600 ${178 + k * 36} T1200 ${158 + k * 34}" fill="none" stroke="#F4EBA0" stroke-width="3" opacity=".7"/>`).join('')}
      <g transform="translate(160 150)" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
        <path d="M70 0 C10 0 0 70 70 76 C140 70 130 0 70 0Z" fill="#C2553F"/>
        <path d="M128 30 Q170 20 182 -6" fill="none" stroke-width="10"/><path d="M128 30 Q170 20 182 -6" fill="none" stroke="#C2553F" stroke-width="5"/>
        <path d="M14 28 Q-20 26 -8 56 Q2 68 18 56" fill="none" stroke-width="6"/><path d="M14 28 Q-20 26 -8 56 Q2 68 18 56" fill="none" stroke="#C2553F" stroke-width="2"/>
        <rect x="50" y="-12" width="40" height="14" rx="5" fill="#C2553F"/><circle cx="70" cy="-18" r="7" fill="#C2553F"/>
        <path d="M40 30 Q70 20 100 30" fill="none" stroke="#E07A5F" stroke-width="3" opacity=".7"/>
      </g>
      <path d="M342 144 Q420 90 520 140 T720 120" fill="none" stroke="#FFF6E0" stroke-width="14" opacity=".75" stroke-linecap="round"/>
      ${[[420, 250, 1], [760, 232, .8], [980, 270, .9]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${INK}" stroke-width="2"><path d="M-6 0 L-10 30 H10 L6 0Z" fill="#3E6FA8"/><circle cx="0" cy="-8" r="7" fill="#E2AE88"/><path d="M-16 -10 L0 -26 L16 -10Z" fill="#E8D39A"/><ellipse cx="14" cy="18" rx="8" ry="6" fill="#C9A06A"/></g>`).join('')}
      ${[[300, 60], [560, 40], [1100, 70], [40, 90]].map(([x, y]) => `<path d="M${x} ${y} q8 -8 16 0 q-8 8 -16 0z" fill="#7FA650" transform="rotate(${x % 40} ${x} ${y})"/>`).join('')}`);
  }

  // Đêm ruộng lúa có đèn dầu – thử thách #TràĐộcBản
  function nightField(h = 420) {
    return wrap(1200, h, id => `
      <defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241F4D"/><stop offset="1" stop-color="#4B3F86"/></linearGradient>
        <radialGradient id="${id}m"><stop offset="0" stop-color="#FCE9A8" stop-opacity=".6"/><stop offset="1" stop-color="#FCE9A8" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}l"><stop offset="0" stop-color="#FFD27A" stop-opacity=".8"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs>
      <rect width="1200" height="${h}" fill="url(#${id}k)"/>
      ${Array.from({ length: 70 }, (_, k) => `<circle cx="${(k * 173) % 1200}" cy="${(k * 97) % (h * .5)}" r="${k % 5 ? 1.2 : 2}" fill="#fff" opacity="${.5 + (k % 3) * .2}"/>`).join('')}
      <circle cx="860" cy="80" r="80" fill="url(#${id}m)"/><circle cx="860" cy="80" r="30" fill="#FCE9A8"/>
      <path d="M0 ${h * .52} Q200 ${h * .46} 420 ${h * .5} T900 ${h * .48} T1200 ${h * .5} V${h * .56} H0Z" fill="#2F3D5C"/>
      ${[[180, .46], [1000, .44]].map(([x, f]) => `<g transform="translate(${x} ${h * f})"><path d="M0 34 l40 -34 l40 34 v30 h-80z" fill="#4A3A30"/><rect x="30" y="40" width="16" height="14" fill="#F2B94B"/></g>`).join('')}
      ${[80, 300, 620, 1120].map(x => `<g transform="translate(${x} ${h * .52})"><rect x="-3" y="-60" width="6" height="60" fill="#2A2340"/><circle cx="0" cy="-70" r="26" fill="#2E4A3A"/></g>`).join('')}
      <rect x="0" y="${h * .56}" width="1200" height="${h * .44}" fill="#36508A"/>
      <g stroke="#7FB069" stroke-width="3" stroke-linecap="round">${Array.from({ length: 6 }, (_, r) => Array.from({ length: 30 }, (_, k) => `<path d="M${k * 42 + (r % 2) * 21} ${h * .6 + r * h * .065} l-3 -12 M${k * 42 + (r % 2) * 21} ${h * .6 + r * h * .065} l4 -10"/>`).join('')).join('')}</g>
      <path d="M760 ${h * .62} q60 6 120 0" stroke="#FCE9A8" stroke-width="3" opacity=".5"/>
      <g transform="translate(210 ${h - 40})"><circle r="70" fill="url(#${id}l)"/><g stroke="${INK}" stroke-width="2.4"><rect x="-12" y="-44" width="24" height="8" rx="2" fill="#5A4636"/><path d="M-16 -36 Q-22 -10 -16 6 H16 Q22 -10 16 -36Z" fill="#FFD27A"/><rect x="-18" y="6" width="36" height="10" rx="3" fill="#5A4636"/><path d="M-10 -44 Q0 -64 10 -44" fill="none"/></g></g>
      <path d="M300 ${h - 20} L360 ${h - 64} L420 ${h - 20} Q360 ${h - 10} 300 ${h - 20}Z" fill="#E8D39A" stroke="${INK}" stroke-width="2.4"/>`);
  }

  // Suối trong rừng – trang chào mừng
  function forest(h = 360) {
    return wrap(1200, h, id => `
      <defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5F3B8"/><stop offset="1" stop-color="#B7D88C"/></linearGradient></defs>
      <rect width="1200" height="${h}" fill="url(#${id}k)"/>
      ${[[60, '#5E9150', 26], [140, '#8C6A44', 20], [230, '#4F8A52', 30], [330, '#7FA650', 16], [860, '#7B5A3A', 28], [960, '#5E9150', 22], [1060, '#8C6A44', 34], [1150, '#4F8A52', 20]].map(([x, c, w]) => `<rect x="${x}" y="0" width="${w}" height="${h * .8}" fill="${c}" opacity=".85"/>`).join('')}
      <path d="M0 0 H1200 V40 Q1000 90 800 50 Q600 100 400 50 Q200 90 0 50Z" fill="#3F7A48"/>
      <path d="M0 ${h * .7} Q300 ${h * .62} 600 ${h * .7} T1200 ${h * .66} V${h} H0Z" fill="#6FB3A8"/>
      <g stroke="#E2F4EC" stroke-width="3" stroke-linecap="round" opacity=".8">${[[100, .8], [380, .76], [640, .84], [900, .8], [1080, .9]].map(([x, f]) => `<path d="M${x} ${h * f} h${50}"/>`).join('')}</g>
      ${[[120, .68, 50, '#E9D8CC'], [420, .66, 40, '#D6CCE0'], [1000, .64, 60, '#9AA2B8'], [1140, .7, 40, '#E9D8CC']].map(([x, f, r, c]) => `<ellipse cx="${x}" cy="${h * f}" rx="${r}" ry="${r * .6}" fill="${c}" stroke="${INK}" stroke-width="2"/>`).join('')}
      <g transform="translate(700 ${h * .62})"><path d="M-80 20 Q0 -20 120 10 L120 40 H-80Z" fill="#5E9150"/>${[-60, -30, 0, 30, 60, 90].map(x => `<path d="M${x} 10 q10 -30 30 -40" stroke="#4F8A52" stroke-width="5" fill="none"/>`).join('')}</g>
      ${Array.from({ length: 14 }, (_, k) => `<circle cx="${(k * 211) % 1200}" cy="${(k * 67) % (h * .6) + 40}" r="3" fill="#FFF8C8" opacity=".8"/>`).join('')}`);
  }

  // Bìa từng Hub
  // Ảnh bìa Destination Hub – phong cách banner "Tôn vinh di sản": nền kem, bậc đá be, công trình di sản,
  // mặt tiền Phúc Long bảng hiệu xanh ở giữa, người đạp xe đội nón lá, tiêu đề xanh + chữ nghiêng, con dấu since 1968
  function hub(idh) {
    const W = 600, H = 220, LN = '#6B5B4B', G = '#0B6B3A';
    const birds = `<path d="M64 30 l6 4 l6 -4 M86 20 l5 3 l5 -3 M104 34 l4 3 l4 -3 M498 70 l5 3 l5 -3" stroke="#5a5a5a" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    const steps = (x0, n, dir) => Array.from({ length: n }, (_, k) => {
      const w = 34, h = 18 + (n - k) * 13, x = dir > 0 ? x0 + k * w : x0 - (k + 1) * w, y = H - h;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#E6D8B6"/><rect x="${x}" y="${y}" width="${w}" height="5" fill="#F2EAD5"/><rect x="${x + w - 5}" y="${y}" width="5" height="${h}" fill="#CDB98F"/>
        <path d="M${x} ${y + 18} h${w} M${x} ${y + 34} h${w} M${x + 12} ${y + 5} v13 M${x + 22} ${y + 18} v16" stroke="#D2C29C" stroke-width="1"/>`;
    }).join('');
    const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2" y="-18" width="4" height="18" fill="#7A5A3A"/><circle cy="-30" r="16" fill="#5E9444"/><circle cx="-11" cy="-22" r="11" fill="#6FA64F"/><circle cx="11" cy="-24" r="12" fill="#4F8338"/><circle cx="3" cy="-38" r="9" fill="#7DB25A"/></g>`;
    const rider = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-10" cy="0" r="7" fill="none" stroke="#3a3a3a" stroke-width="1.6"/><circle cx="12" cy="0" r="7" fill="none" stroke="#3a3a3a" stroke-width="1.6"/><path d="M-10 0 L0 -8 L12 0 M0 -8 L-3 -14 M8 -14 L12 0" stroke="#3a3a3a" stroke-width="1.5" fill="none"/>
      <path d="M-4 -14 L4 -14 L2 -28 L-2 -28Z" fill="${c}"/><circle cy="-31" r="3.4" fill="#F1C9A5"/><path d="M-7 -32 L0 -40 L7 -32Z" fill="#EAD9A0" stroke="#B89A55" stroke-width=".8"/><path d="M-2 -14 L-6 -4" stroke="#2f2f2f" stroke-width="2"/></g>`;
    const walker = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4 0 L4 0 L3 -20 L-3 -20Z" fill="${c}"/><path d="M-2 0 v6 M2 0 v6" stroke="#2f2f2f" stroke-width="1.6"/><circle cy="-23" r="3.4" fill="#F1C9A5"/><path d="M-7 -24 L0 -32 L7 -24Z" fill="#EAD9A0" stroke="#B89A55" stroke-width=".8"/></g>`;
    const stamp = `<g transform="translate(560 40)"><circle r="26" fill="#F7F4EC" stroke="${G}" stroke-width="1.6"/><circle r="20" fill="none" stroke="${G}" stroke-width=".8"/><path d="M0 -9 q-7 7 0 17 q7 -10 0 -17Z" fill="${G}"/>
      <text y="-12" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="5.5" letter-spacing="1" fill="${G}">PHÚC LONG</text><text y="17" text-anchor="middle" font-family="Arial, sans-serif" font-size="4.6" letter-spacing="1" fill="${G}">SINCE 1968</text></g>`;
    const title = (big, script, id) => `<defs><linearGradient id="${id}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6DB33F"/><stop offset="1" stop-color="#1F6B2E"/></linearGradient></defs>
      <text x="300" y="36" text-anchor="middle" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="30" letter-spacing="1" fill="url(#${id}t)" stroke="#fff" stroke-width=".6">${big}</text>
      <text x="300" y="54" text-anchor="middle" font-family="'Playfair', Georgia, serif" font-style="italic" font-size="15" fill="#3E7D2E">${script}</text>`;
    // mặt tiền Phúc Long: tầng trên cửa sổ, bảng hiệu xanh, quầy kính ấm
    const store = (cx, top, w, wall, extra = '') => {
      const x0 = cx - w / 2, x1 = cx + w / 2, gy = 200, n = Math.max(3, Math.floor(w / 42));
      const win = Array.from({ length: n }, (_, i) => { const wx = x0 + 16 + i * ((w - 32) / n) + ((w - 32) / n - 18) / 2; return `<rect x="${wx}" y="${top + 14}" width="18" height="26" fill="#45565a" stroke="#fff" stroke-width="1.6"/><path d="M${wx + 9} ${top + 14} v26 M${wx} ${top + 26} h18" stroke="#fff" stroke-width="1"/>`; }).join('');
      const shop = Array.from({ length: n }, (_, i) => { const sx = x0 + 12 + i * ((w - 24) / n); const sw = (w - 24) / n - 6; return `<rect x="${sx}" y="${top + 82}" width="${sw}" height="${gy - top - 86}" fill="${i === Math.floor(n / 2) ? '#2F5A3E' : '#F4D9A2'}" stroke="#2f3a35" stroke-width="1.4"/>${i === Math.floor(n / 2) ? '' : `<path d="M${sx} ${top + 98} h${sw}" stroke="#2f3a35" stroke-width="1"/>`}`; }).join('');
      return `<rect x="${x0}" y="${top}" width="${w}" height="${gy - top}" fill="${wall}" stroke="${LN}" stroke-width="1.2"/><rect x="${x0 - 6}" y="${top - 8}" width="${w + 12}" height="9" fill="${wall}" stroke="${LN}" stroke-width="1.2"/>
        ${win}<rect x="${x0 - 3}" y="${top + 48}" width="${w + 6}" height="5" fill="#E2D6C0" stroke="${LN}" stroke-width=".8"/>
        <rect x="${x0 + 18}" y="${top + 58}" width="${w - 36}" height="17" rx="2" fill="${G}" stroke="#08502b" stroke-width="1.2"/><circle cx="${x0 + 30}" cy="${top + 66.5}" r="5.5" fill="#fff"/><path d="M${x0 + 30} ${top + 62} q-3.5 4 0 9 q3.5 -5 0 -9Z" fill="${G}"/>
        <text x="${cx + 6}" y="${top + 70.5}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="10" letter-spacing="2.5" fill="#fff">PHÚC LONG</text>
        ${shop}<rect x="${x0 - 4}" y="${gy}" width="${w + 8}" height="5" fill="#D8CBB0"/>${extra}`;
    };
    const ground = `<rect x="0" y="203" width="${W}" height="17" fill="#EFE7D4"/>`;
    const bodies = {
      hoian: id => `<rect width="${W}" height="${H}" fill="#F7F3EA"/>${birds}${steps(0, 3, 1)}${steps(W, 3, -1)}${ground}
        <path d="M0 196 Q150 188 300 198 T600 194 V220 H0Z" fill="#8EC3C7"/><path d="M40 204 q20 4 40 0 M440 206 q24 4 48 0" stroke="#fff" stroke-width="1.4" opacity=".7" fill="none"/>
        <g><path d="M20 196 Q80 160 140 196" fill="none" stroke="#B6834E" stroke-width="7"/><rect x="38" y="142" width="84" height="30" fill="#D6A866" stroke="${LN}" stroke-width="1.2"/>${[50, 66, 82, 98, 112].map(x => `<path d="M${x} 146 v24" stroke="#8a5a34" stroke-width="2"/>`).join('')}
          <path d="M26 144 Q34 136 44 130 L116 130 Q126 136 134 144 Q120 140 80 140 Q40 140 26 144Z" fill="#8C3F2A" stroke="${LN}" stroke-width="1"/><path d="M50 130 Q80 118 110 130Z" fill="#9C4A30"/></g>
        ${store(300, 92, 190, '#F2C94C', `<path d="M197 86 L221 70 L379 70 L403 86Z" fill="#9A4B2E" stroke="${LN}" stroke-width="1"/>${[230, 260, 290, 320, 350].map(x => `<path d="M${x} 72 l-4 13" stroke="#7a3a22" stroke-width="1"/>`).join('')}`)}
        <path d="M200 90 Q300 104 400 90" stroke="#5a4a3a" stroke-width=".8" fill="none"/>${[[216, '#C8372D'], [246, '#F2B13A'], [276, '#C8372D'], [324, '#2F8F6A'], [354, '#F2B13A'], [384, '#C8372D']].map(([x, c], k) => `<g transform="translate(${x} ${95 + (k === 2 || k === 3 ? 4 : 1)})"><ellipse cy="6" rx="5" ry="6.5" fill="${c}"/><rect x="-2.5" y="-1" width="5" height="2" fill="#F2C14E"/></g>`).join('')}
        <rect x="448" y="120" width="96" height="80" fill="#F0C451" stroke="${LN}" stroke-width="1.2"/><path d="M440 122 L470 102 L522 102 L552 122Z" fill="#9A4B2E"/>${[460, 490, 520].map(x => `<rect x="${x}" y="140" width="14" height="22" fill="#3E7D9A" stroke="#fff" stroke-width="1"/>`).join('')}
        ${tree(178, 200, .9)}${tree(426, 200, .8)}${rider(250, 206, '#C8372D', .9)}${walker(352, 204, '#2F8F6A', .9)}<path d="M470 210 q30 12 64 0 l-8 7 h-48z" fill="#8C4A2F"/>
        ${title('HỘI AN', 'Phố cổ đèn lồng', id)}${stamp}`,
      dalat: id => `<rect width="${W}" height="${H}" fill="#F3F5EE"/>${birds}<path d="M0 150 Q120 110 240 140 T480 120 T600 132 V220 H0Z" fill="#B9D3B5"/><path d="M0 170 Q160 140 320 168 T600 160 V220 H0Z" fill="#9CC09A"/>${steps(0, 3, 1)}${steps(W, 2, -1)}${ground}
        ${[20, 44, 520, 548, 578].map((x, k) => `<path d="M${x} ${196 - (k % 2) * 6} l-12 0 l12 -54 l12 54z" fill="#3F6B4F"/><path d="M${x} ${142 - (k % 2) * 6} v54" stroke="#2c4a36" stroke-width="1"/>`).join('')}
        <g><rect x="70" y="150" width="110" height="50" fill="#F2E3B3" stroke="${LN}" stroke-width="1.2"/>${[[80, 150, 26], [112, 150, 26], [144, 150, 26]].map(([x, y, w]) => `<path d="M${x} ${y} L${x + w / 2} ${y - 46} L${x + w} ${y}Z" fill="#C9643A" stroke="${LN}" stroke-width="1"/><rect x="${x + w / 2 - 4}" y="${y - 22}" width="8" height="12" fill="#F7E9C2" stroke="${LN}" stroke-width=".8"/>`).join('')}
          ${[84, 108, 132, 156].map(x => `<rect x="${x}" y="168" width="12" height="20" fill="#5E8CA6" stroke="#fff" stroke-width="1"/>`).join('')}<text x="125" y="162" text-anchor="middle" font-family="Arial" font-size="5.5" font-weight="700" fill="${LN}">GA ĐÀ LẠT</text></g>
        ${store(320, 96, 180, '#F6F1E7', `<path d="M222 90 L320 58 L418 90Z" fill="#8E4B3A" stroke="${LN}" stroke-width="1"/><circle cx="320" cy="76" r="6" fill="#F7E9C2" stroke="${LN}"/>`)}
        ${[[232, 198, '#8FA6E0'], [246, 200, '#B08FD8'], [404, 198, '#8FA6E0'], [418, 200, '#E9A0C0']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x + 5}" cy="${y - 3}" r="5" fill="${c}" opacity=".8"/>`).join('')}
        <path d="M0 88 Q150 72 300 92 T600 80" stroke="#fff" stroke-width="14" opacity=".55" fill="none"/>${rider(470, 206, '#3F6B9A', .9)}${walker(206, 204, '#7A4A8A', .9)}
        ${title('ĐÀ LẠT', 'Đồi thông sương sớm', id)}${stamp}`,
      hanoi: id => `<rect width="${W}" height="${H}" fill="#F7F4EC"/>${birds}${steps(0, 4, 1)}${steps(W, 3, -1)}${ground}
        <g><rect x="40" y="158" width="70" height="42" fill="#D9A05A" stroke="${LN}" stroke-width="1.2"/><rect x="50" y="138" width="50" height="20" fill="#D39252" stroke="${LN}" stroke-width="1.2"/><rect x="58" y="70" width="34" height="68" fill="#B85C3A" stroke="${LN}" stroke-width="1.2"/>
          ${[86, 104, 122].map(y => `<path d="M58 ${y} h34" stroke="#8a3f26" stroke-width="1.4"/>`).join('')}<rect x="54" y="62" width="42" height="9" fill="#9A4B2E" stroke="${LN}"/><path d="M75 62 V34" stroke="#555" stroke-width="1.6"/><path d="M75 34 h20 v12 h-20Z" fill="#D7262D"/><path d="M85 38 l1.2 2.4 2.6 .4 -1.9 1.8 .5 2.6 -2.4 -1.2 -2.4 1.2 .5 -2.6 -1.9 -1.8 2.6 -.4Z" fill="#FFD43B"/></g>
        ${store(300, 88, 210, '#F4EFE4', `<rect x="408" y="150" width="34" height="14" rx="2" fill="#2F5FA8" stroke="#fff" stroke-width="1"/><text x="425" y="160" text-anchor="middle" font-family="Arial" font-size="5.5" font-weight="700" fill="#fff">HÀNG GAI</text>
          ${[[204, 130], [214, 122], [226, 128], [380, 126], [392, 132]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#E85A9A" opacity=".9"/>`).join('')}`)}
        <g><rect x="470" y="138" width="90" height="62" fill="#E0B36A" stroke="${LN}" stroke-width="1.2"/><path d="M460 140 Q470 132 480 126 L550 126 Q560 132 570 140 Q540 134 515 134 Q490 134 460 140Z" fill="#8C3F2A" stroke="${LN}"/>
          <rect x="490" y="104" width="50" height="22" fill="#E7C27A" stroke="${LN}"/><path d="M482 106 Q500 96 515 92 Q530 96 548 106Z" fill="#8C3F2A" stroke="${LN}"/><circle cx="515" cy="115" r="6" fill="#F7E9C2" stroke="${LN}"/>${[484, 506, 528].map(x => `<path d="M${x} 200 v-30 a8 8 0 0 1 16 0 v30" fill="#6B3A24"/>`).join('')}</g>
        ${tree(160, 200, .9)}${tree(446, 200, .7)}${rider(232, 206, '#C8372D', .9)}${rider(378, 206, '#2F8F6A', .85)}${walker(130, 204, '#E8C341', .9)}
        ${title('HÀ NỘI', 'Phố cổ hoa giấy', id)}${stamp}`,
      urban: id => `<rect width="${W}" height="${H}" fill="#F4F6F2"/>${birds}${steps(0, 2, 1)}${steps(W, 2, -1)}${ground}
        ${[[80, 96, 90], [430, 80, 110]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${200 - y}" fill="#DDE6EA" stroke="${LN}" stroke-width="1.1"/>${Array.from({ length: Math.floor((200 - y) / 18) }, (_, r) => Array.from({ length: Math.floor(w / 20) }, (_, c) => `<rect x="${x + 6 + c * 20}" y="${y + 8 + r * 18}" width="12" height="10" fill="#9FB8C6"/>`).join('')).join('')}`).join('')}
        ${store(300, 100, 190, '#EEF2EC', `<rect x="250" y="80" width="100" height="16" rx="8" fill="#F2C14E" stroke="${LN}"/><text x="300" y="91" text-anchor="middle" font-family="Arial" font-size="8" font-weight="700" fill="#2a2438">FOCUS · CHILL</text>`)}
        ${tree(192, 200, .9)}${tree(412, 200, .9)}${rider(150, 206, '#2F6FA0', .9)}${walker(460, 204, '#C8372D', .9)}${walker(476, 204, '#3F8F5A', .9)}
        ${title('URBAN HUB', 'Làng Đại học · TP.HCM', id)}${stamp}`,
    };
    return wrap(W, H, bodies[idh] || bodies.urban, 'scene', 'xMidYMid slice');
  }

  // Dải chợ phiên – đầu trang cộng đồng
  function market(h = 180) {
    return wrap(1200, h, id => `<rect width="1200" height="${h}" fill="#CDE7F0"/>
      ${[[80, 20, 90], [300, 10, 110], [700, 16, 100], [1000, 6, 120], [1180, 20, 80]].map(([x, y, r], k) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${k % 2 ? '#9CC77A' : '#7FB069'}"/>`).join('')}
      ${[[40, '#E5735A'], [260, '#4FA39A'], [480, '#E9B44C'], [700, '#E58FA0'], [920, '#4FA39A'], [1140, '#E5735A']].map(([x, c]) => `<g transform="translate(${x} 60)"><path d="M-80 30 L0 0 L80 30Z" fill="${c}" stroke="${INK}" stroke-width="2.4"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(k => `<rect x="${-80 + k * 20}" y="30" width="20" height="14" fill="${k % 2 ? '#F4EEE2' : c}" stroke="${INK}" stroke-width="1.2"/>`).join('')}
        <rect x="-70" y="44" width="140" height="${h}" fill="#F7E9CF" stroke="${INK}" stroke-width="2"/></g>`).join('')}
      <path d="M0 ${h - 40} H1200 V${h} H0Z" fill="#E9D9B4"/>`);
  }


  // Núi sương xanh (banner kiểu menu Bông Biêng, tông xanh Phúc Long)
  function misty(h = 560) {
    return wrap(1400, h, id => `
      <defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4F1E8"/><stop offset="1" stop-color="#BFDCC8"/></linearGradient>
        ${[0, 1, 2, 3].map(k => `<linearGradient id="${id}m${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${['#C9E1D0', '#A6CDB2', '#7DB495', '#4F9271'][k]}"/><stop offset="1" stop-color="${['#E1EFE5', '#CFE5D6', '#B7D7C1', '#9CC9AC'][k]}" stop-opacity=".2"/></linearGradient>`).join('')}</defs>
      <rect width="1400" height="${h}" fill="url(#${id}k)"/>
      <circle cx="1060" cy="120" r="70" fill="#F4FAF5" opacity=".9"/>
      <path d="M0 ${h * .52} L80 ${h * .4} L150 ${h * .46} L260 ${h * .3} L360 ${h * .42} L470 ${h * .34} L560 ${h * .44} L700 ${h * .28} L820 ${h * .4} L940 ${h * .32} L1060 ${h * .42} L1180 ${h * .3} L1300 ${h * .4} L1400 ${h * .34} V${h} H0Z" fill="url(#${id}m0)"/>
      <path d="M-40 ${h * .52} Q300 ${h * .44} 700 ${h * .54} T1440 ${h * .5}" stroke="#fff" stroke-width="40" opacity=".55" fill="none"/>
      <path d="M0 ${h * .62} L120 ${h * .48} L220 ${h * .56} L340 ${h * .44} L460 ${h * .58} L600 ${h * .46} L720 ${h * .56} L860 ${h * .5} L1000 ${h * .6} L1120 ${h * .48} L1260 ${h * .58} L1400 ${h * .5} V${h} H0Z" fill="url(#${id}m1)"/>
      <path d="M-40 ${h * .64} Q400 ${h * .56} 800 ${h * .66} T1440 ${h * .6}" stroke="#fff" stroke-width="34" opacity=".5" fill="none"/>
      <path d="M0 ${h * .72} L160 ${h * .6} L300 ${h * .7} L420 ${h * .62} L580 ${h * .74} L740 ${h * .62} L900 ${h * .72} L1040 ${h * .64} L1200 ${h * .74} L1400 ${h * .64} V${h} H0Z" fill="url(#${id}m2)"/>
      ${Array.from({ length: 34 }, (_, k) => { const x = k * 44 + (k % 3) * 6, y = h * (.72 + (k % 4) * .012); return `<path d="M${x} ${y} l7 -24 l7 24z" fill="#4F9271" opacity=".55"/>`; }).join('')}
      <path d="M-40 ${h * .78} Q500 ${h * .7} 900 ${h * .8} T1440 ${h * .74}" stroke="#fff" stroke-width="30" opacity=".55" fill="none"/>
      <path d="M0 ${h * .86} Q350 ${h * .78} 700 ${h * .86} T1400 ${h * .82} V${h} H0Z" fill="url(#${id}m3)"/>
      ${[[180, 90], [210, 104], [240, 96], [980, 70], [1010, 82]].map(([x, y]) => `<path d="M${x} ${y} q6 -6 12 0 q6 -6 12 0" stroke="#3E7D5A" stroke-width="2" fill="none" opacity=".6"/>`).join('')}`, 'scene', 'xMidYMax slice');
  }

  // ---------- Mô phỏng cửa hàng theo địa điểm ----------
  const lantern = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cy="22" r="26" fill="#FFD27A" opacity=".22"/><path d="M0 -10 V0" stroke="${INK}" stroke-width="2"/><ellipse cy="22" rx="14" ry="18" fill="${c}" stroke="${INK}" stroke-width="2"/><path d="M0 4 V40 M-8 8 Q-12 22 -8 36 M8 8 Q12 22 8 36" stroke="rgba(0,0,0,.18)" stroke-width="1.5" fill="none"/><rect x="-7" y="1" width="14" height="5" rx="2" fill="#F2C14E" stroke="${INK}" stroke-width="1.5"/><rect x="-7" y="38" width="14" height="5" rx="2" fill="#F2C14E" stroke="${INK}" stroke-width="1.5"/><path d="M0 43 V54" stroke="#C8463B" stroke-width="2"/></g>`;
  const sign = (x, y, w, txt, sub) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-26" width="${w}" height="52" rx="10" fill="#0B6B3A" stroke="${INK}" stroke-width="3"/><text y="-2" text-anchor="middle" font-family="Josefin Sans, sans-serif" font-weight="600" font-size="22" letter-spacing="3" fill="#FFF8EC">${txt}</text><text y="18" text-anchor="middle" font-family="Josefin Sans, sans-serif" font-size="13" letter-spacing="4" fill="#CFE8D6">${sub}</text></g>`;
  const pot = (x, y, c = '#E58FA0') => `<g transform="translate(${x} ${y})"><path d="M-14 0 L14 0 L10 22 L-10 22Z" fill="#B5643E" stroke="${INK}" stroke-width="2"/>${[[-8, -8], [0, -14], [8, -8], [-3, -4], [5, -2]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="${c}"/>`).join('')}</g>`;
  const table = (x, y, c = '#8A5A36') => `<g transform="translate(${x} ${y})"><ellipse rx="34" ry="8" fill="${c}" stroke="${INK}" stroke-width="2.4"/><path d="M0 8 V46 M-16 46 H16" stroke="${INK}" stroke-width="3"/><g transform="translate(-6 -22) scale(.32)">${window.Cups ? Cups.render({ look: 'ice', c: ['#E9A25A', '#C9662A'], fruit: 'dao' }, 60).replace(/<svg[^>]*>/, '').replace('</svg>', '') : ''}</g></g>`;

  function storeOutside(idh) {
    const W = 1200, H = 640;
    const ground = (c = '#E7D9C2') => `<rect x="0" y="${H - 110}" width="${W}" height="110" fill="${c}"/><g stroke="rgba(0,0,0,.08)" stroke-width="2">${Array.from({ length: 16 }, (_, k) => `<path d="M${k * 80} ${H - 110} L${k * 80 - 40} ${H}"/>`).join('')}</g>`;
    const bodies = {
      hoian: id => `<defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE7B8"/><stop offset="1" stop-color="#F6CF86"/></linearGradient></defs>
        <rect width="${W}" height="${H}" fill="url(#${id}k)"/><circle cx="1020" cy="110" r="60" fill="#FFF3D0"/>
        <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
          <path d="M150 210 L600 120 L1050 210Z" fill="#9C4F2F"/>
          ${Array.from({ length: 22 }, (_, k) => `<path d="M${180 + k * 40} 206 q20 12 40 0" fill="none" stroke="#7A3A22" stroke-width="2.5"/>`).join('')}
          <rect x="190" y="210" width="820" height="320" fill="#F2C24E"/>
          <path d="M170 340 H1030 L1010 362 H190Z" fill="#9C4F2F"/>
          ${[260, 420, 700, 860].map(x => `<rect x="${x}" y="236" width="90" height="80" fill="#2F7A55"/><path d="M${x + 45} 236 V316 M${x} 276 H${x + 90}" stroke="${INK}" stroke-width="2"/>`).join('')}
          ${[230, 380, 760, 910].map(x => `<rect x="${x}" y="380" width="70" height="150" fill="#0B6B3A"/><path d="M${x + 35} 380 V530" stroke="${INK}" stroke-width="2"/>`).join('')}
          <rect x="500" y="372" width="200" height="158" fill="#FFE7A8"/><path d="M600 372 V530" stroke="${INK}" stroke-width="2"/>
        </g>
        ${sign(600, 170, 300, 'PHÚC LONG', 'HỘI AN · 1986')}
        <path d="M150 352 Q600 420 1050 352" stroke="${INK}" stroke-width="1.5" fill="none"/>
        ${[[230, '#E5473B'], [330, '#F2C14E'], [430, '#2F7A55'], [530, '#E5473B'], [670, '#2F7AB8'], [770, '#E5473B'], [870, '#F2C14E'], [970, '#2F7A55']].map(([x, c], k) => lantern(x, 370 + Math.sin(k) * 10, c, .9)).join('')}
        ${pot(206, 520, '#E58FA0')}${pot(994, 520, '#F2B6C2')}
        <rect x="0" y="${H - 110}" width="${W}" height="40" fill="#E7D2A8"/><rect x="0" y="${H - 70}" width="${W}" height="70" fill="#6FA9B8"/>
        <g stroke="#DFF1F6" stroke-width="3" stroke-linecap="round">${[80, 300, 560, 820, 1080].map(x => `<path d="M${x} ${H - 40} h46"/>`).join('')}</g>
        <path d="M120 ${H - 34} q60 20 140 0 l-16 16 h-108z" fill="#9C4F2F" stroke="${INK}" stroke-width="2.5"/>${lantern(190, H - 100, '#E5473B', .6)}`,
      dalat: id => `<defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDEBE6"/><stop offset="1" stop-color="#B9D3C6"/></linearGradient></defs>
        <rect width="${W}" height="${H}" fill="url(#${id}k)"/>
        <path d="M0 330 Q300 220 600 300 T1200 260 V${H} H0Z" fill="#9CC2A8"/><path d="M-40 300 Q500 240 1240 300" stroke="#fff" stroke-width="40" opacity=".55" fill="none"/>
        ${[60, 130, 1040, 1110, 1170].map((x, k) => `<path d="M${x} ${520 - (k % 2) * 30} l-40 0 l40 -200 l40 200z" fill="#2F5D45" stroke="${INK}" stroke-width="2.5"/><path d="M${x} ${470 - (k % 2) * 30} l-34 0 l34 -120 l34 120z" fill="#3F7558"/>`).join('')}
        <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
          <path d="M260 300 L600 110 L940 300Z" fill="#4A3A30"/>
          <rect x="300" y="300" width="600" height="230" fill="#B98A5E"/>
          ${Array.from({ length: 11 }, (_, k) => `<path d="M300 ${320 + k * 20} H900" stroke="#9C7048" stroke-width="2"/>`).join('')}
          <path d="M470 300 L600 196 L730 300Z" fill="#FFE7A8"/><path d="M600 196 V300 M535 248 H665" stroke="${INK}" stroke-width="2"/>
          <rect x="360" y="340" width="200" height="150" fill="#FFE7A8"/><rect x="640" y="340" width="200" height="150" fill="#FFE7A8"/>
          <path d="M460 340 V490 M360 415 H560 M740 340 V490 M640 415 H840" stroke="${INK}" stroke-width="2"/>
        </g>
        ${sign(600, 270, 260, 'PHÚC LONG', 'ĐÀ LẠT · ĐỒI THÔNG')}
        <path d="M300 300 Q450 330 600 300 T900 300" stroke="#F6E2A8" stroke-width="2" fill="none"/>${Array.from({ length: 12 }, (_, k) => `<circle cx="${310 + k * 52}" cy="${306 + Math.sin(k) * 6}" r="5" fill="#FFE18A"/>`).join('')}
        ${ground('#CDBB9A')}
        <g transform="translate(600 ${H - 70})"><ellipse rx="70" ry="14" fill="#6B6158" stroke="${INK}" stroke-width="2.5"/><path d="M-30 -6 Q-20 -60 0 -40 Q12 -80 22 -36 Q34 -54 30 -6Z" fill="#F28A3A"/><path d="M-12 -8 Q-6 -36 4 -24 Q12 -40 16 -8Z" fill="#FFD27A"/></g>
        ${[[420, H - 60], [780, H - 60]].map(([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-40" y="-14" width="80" height="18" rx="6" fill="#8A5A36" stroke="${INK}" stroke-width="2.4"/><path d="M-30 4 V30 M30 4 V30" stroke="${INK}" stroke-width="3"/></g>`).join('')}`,
      hanoi: id => `<defs><linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF1E2"/><stop offset="1" stop-color="#D7E6CF"/></linearGradient></defs>
        <rect width="${W}" height="${H}" fill="url(#${id}k)"/>
        <g stroke="${INK}" stroke-width="3" stroke-linejoin="round">
          <rect x="60" y="150" width="300" height="380" fill="#E9C27E"/><path d="M50 150 L210 96 L370 150Z" fill="#8C4A2F"/>
          <rect x="840" y="170" width="300" height="360" fill="#F0D7A2"/><path d="M830 170 L990 116 L1150 170Z" fill="#8C4A2F"/>
          <rect x="380" y="110" width="440" height="420" fill="#F4D58A"/><path d="M366 110 L600 40 L834 110Z" fill="#9C4F2F"/>
          ${[[100, 190], [230, 190], [880, 210], [1010, 210], [100, 330], [230, 330], [880, 340], [1010, 340]].map(([x, y]) => `<rect x="${x}" y="${y}" width="90" height="100" fill="#3E7D5A"/><path d="M${x + 45} ${y} V${y + 100}" stroke="${INK}" stroke-width="2"/>${[1, 2, 3, 4].map(r => `<path d="M${x} ${y + r * 20} H${x + 90}" stroke="#2F6347" stroke-width="2"/>`).join('')}`).join('')}
          <rect x="420" y="150" width="160" height="120" fill="#0B6B3A"/><rect x="620" y="150" width="160" height="120" fill="#0B6B3A"/>
          ${[420, 620].map(x => [1, 2, 3, 4, 5].map(r => `<path d="M${x} ${150 + r * 20} H${x + 160}" stroke="#08502C" stroke-width="2"/>`).join('') + `<path d="M${x + 80} 150 V270" stroke="${INK}" stroke-width="2"/>`).join('')}
          <rect x="400" y="282" width="400" height="14" fill="#5A3A28"/>${Array.from({ length: 17 }, (_, k) => `<path d="M${408 + k * 24} 296 V326" stroke="#5A3A28" stroke-width="3"/>`).join('')}<rect x="400" y="322" width="400" height="8" fill="#5A3A28"/>
          <rect x="440" y="360" width="320" height="170" fill="#FFE7A8"/><path d="M600 360 V530 M440 445 H760" stroke="${INK}" stroke-width="2"/>
        </g>
        ${[[420, 300], [470, 292], [520, 300], [700, 296], [750, 300], [780, 292]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#E0457B"/><circle cx="${x + 10}" cy="${y + 6}" r="9" fill="#F27AA4"/>`).join('')}
        ${sign(600, 80, 280, 'PHÚC LONG', 'PHỐ CỔ HÀ NỘI')}
        <g transform="translate(250 ${H - 110})"><path d="M-8 0 Q-4 -120 -14 -240 L14 -240 Q6 -120 10 0Z" fill="#6B4A34" stroke="${INK}" stroke-width="2.5"/>${[[-70, -260, 60, '#5E9A55'], [10, -300, 70, '#4F8A4A'], [80, -250, 56, '#C8463B'], [-30, -210, 44, '#E07A3A'], [50, -200, 40, '#5E9A55']].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".95"/>`).join('')}</g>
        ${ground('#D8CDB8')}
        ${[[480, H - 70], [620, H - 64], [740, H - 70]].map(([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-26" y="-10" width="52" height="12" rx="3" fill="#2F7AB8" stroke="${INK}" stroke-width="2"/><path d="M-20 2 V24 M20 2 V24" stroke="#2F7AB8" stroke-width="5"/></g>${[-56, 56].map(dx => `<g transform="translate(${x + dx} ${y + 12})"><rect x="-12" y="-6" width="24" height="8" rx="2" fill="#E5473B" stroke="${INK}" stroke-width="1.6"/><path d="M-9 2 V14 M9 2 V14" stroke="#E5473B" stroke-width="4"/></g>`).join('')}`).join('')}
        <g transform="translate(960 ${H - 60})" stroke="${INK}" stroke-width="3" fill="none"><circle cx="-50" cy="20" r="26"/><circle cx="50" cy="20" r="26"/><path d="M-50 20 L-10 -20 L40 -20 L50 20 M-10 -20 L0 20 L-50 20 M40 -20 L36 -36 M-14 -28 H6"/><rect x="18" y="-46" width="54" height="26" fill="#C8A26A"/></g>
        ${[[978, H - 116, '#E0457B'], [998, H - 124, '#F6C85F'], [1018, H - 116, '#FFFFFF'], [1036, H - 122, '#E0457B']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="11" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`).join('')}`,
    };
    return wrap(W, H, bodies[idh] || bodies.hanoi, 'scene', 'xMidYMid slice');
  }

  function storeInside(idh) {
    const W = 1200, H = 640;
    const theme = { hoian: { wall: '#F4D58A', floor: '#B98A5E', accent: '#C8463B' }, dalat: { wall: '#E8D8BE', floor: '#8A6446', accent: '#3F7558' }, hanoi: { wall: '#EFE4CC', floor: '#C9B08A', accent: '#2F7AB8' } }[idh] || { wall: '#EFE4CC', floor: '#C9B08A', accent: '#0B6B3A' };
    const tins = Array.from({ length: 4 }, (_, r) => Array.from({ length: 9 }, (_, k) => `<rect x="${110 + k * 44}" y="${126 + r * 70}" width="30" height="42" rx="5" fill="${['#0B6B3A', '#C8463B', '#E9B44C', '#2F7AB8'][(k + r) % 4]}" stroke="${INK}" stroke-width="2"/><rect x="${114 + k * 44}" y="${138 + r * 70}" width="22" height="10" fill="#FFF8EC"/>`).join('') + `<rect x="96" y="${168 + r * 70}" width="408" height="8" fill="#6B4A34"/>`).join('');
    const decor = {
      hoian: [[700, 70, '#E5473B'], [800, 60, '#F2C14E'], [900, 74, '#2F7A55'], [1000, 62, '#E5473B'], [1100, 70, '#2F7AB8']].map(([x, y, c]) => lantern(x, y, c, 1.1)).join(''),
      dalat: `<g transform="translate(980 250)" stroke="${INK}" stroke-width="3"><rect x="-110" y="-80" width="220" height="230" fill="#8A7E74"/><rect x="-70" y="10" width="140" height="140" rx="70" fill="#2E2420"/><path d="M-40 140 Q-30 60 0 90 Q12 30 30 90 Q50 70 40 140Z" fill="#F28A3A" stroke="none"/><rect x="-130" y="-96" width="260" height="20" fill="#6B4A34"/></g>`,
      hanoi: `<g transform="translate(980 300)" stroke="${INK}" stroke-width="2.5"><path d="M-40 0 Q-60 -60 -24 -110 L24 -110 Q60 -60 40 0Z" fill="#F4F6FA"/><path d="M-30 -40 Q0 -20 30 -40 M-34 -70 Q0 -54 34 -70" stroke="#2F6FB8" stroke-width="4" fill="none"/>${[[-30, -150], [0, -170], [30, -150]].map(([x, y]) => `<path d="M0 -110 Q${x / 2} ${y + 40} ${x} ${y}" fill="none" stroke="#3E7D5A" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="18" ry="12" fill="#F27AA4"/>`).join('')}</g>`,
    }[idh] || '';
    return wrap(W, H, id => `<rect width="${W}" height="${H}" fill="${theme.wall}"/>
      <rect x="80" y="100" width="440" height="300" rx="8" fill="#8A5A36" stroke="${INK}" stroke-width="3"/>${tins}
      <text x="300" y="92" text-anchor="middle" font-family="Josefin Sans, sans-serif" font-size="20" letter-spacing="4" fill="${INK}">BỨC TƯỜNG TRÀ DI SẢN · 1986</text>
      ${[640, 780, 920].map(x => `<path d="M${x} 0 V120" stroke="${INK}" stroke-width="2"/><path d="M${x - 28} 120 h56 l-10 24 h-36z" fill="${theme.accent}" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="160" r="40" fill="#FFE7A8" opacity=".35"/>`).join('')}
      ${decor}
      <rect x="0" y="420" width="${W}" height="220" fill="${theme.floor}"/>
      <g stroke="rgba(0,0,0,.1)" stroke-width="2">${Array.from({ length: 12 }, (_, k) => `<path d="M0 ${430 + k * 20} H${W}"/>`).join('')}</g>
      <rect x="60" y="400" width="520" height="130" rx="10" fill="#0B6B3A" stroke="${INK}" stroke-width="3"/><rect x="60" y="400" width="520" height="22" rx="8" fill="#F4EEE2" stroke="${INK}" stroke-width="3"/>
      <circle cx="320" cy="470" r="26" fill="#FFF8EC"/><path d="M320 452 q-12 12 0 36 q12 -24 0 -36Z" fill="#0B6B3A"/>
      ${table(760, 520)}${table(960, 540)}${table(1110, 500)}
      ${[[720, 560], [800, 560], [920, 580], [1000, 580]].map(([x, y]) => `<rect x="${x - 14}" y="${y}" width="28" height="10" rx="3" fill="${theme.accent}" stroke="${INK}" stroke-width="2"/><path d="M${x - 10} ${y + 10} v22 M${x + 10} ${y + 10} v22" stroke="${INK}" stroke-width="3"/>`).join('')}`, 'scene', 'xMidYMid slice');
  }

  return { storefront, teaHills, nightField, forest, hub, market, misty, storeOutside, storeInside };
})();
