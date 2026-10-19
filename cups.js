// Minh hoạ ly nước & bánh Phúc Long bằng SVG (ly nhựa trong in logo lá trà xanh, ly giấy cho món nóng)
const Cups = (() => {
  const GREEN = '#0B6B3A';
  let n = 0;

  const fruitSvg = (f, x, y, s = 1) => {
    const t = `transform="translate(${x} ${y}) scale(${s})"`;
    switch (f) {
      case 'dao': return `<g ${t}><path d="M-12 0 A12 12 0 0 1 12 0 Q0 6 -12 0Z" fill="#F5A25D"/><path d="M-9 -1 A9 9 0 0 1 9 -1" fill="none" stroke="#FCE3B0" stroke-width="2"/></g>`;
      case 'vai': return `<g ${t}><circle r="8" fill="#FBF6EC"/><circle r="8" fill="none" stroke="#EADCC4" stroke-width="1.5"/><circle cx="-2" cy="-2" r="2.5" fill="#fff"/></g>`;
      case 'chanh': return `<g ${t}><circle r="10" fill="#F4E26A"/><circle r="8" fill="#FBF2A8"/>${[0, 60, 120, 180, 240, 300].map(a => `<path d="M0 0 L${(8 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(8 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="#F4E26A" stroke-width="1.2"/>`).join('')}</g>`;
      case 'dau': return `<g ${t}><path d="M0 10 Q-11 0 -8 -6 Q0 -10 8 -6 Q11 0 0 10Z" fill="#D9363E"/><path d="M-5 -7 L0 -12 L5 -7Z" fill="#4F8A3A"/>${[[-3, -2], [3, -1], [0, 4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".9" fill="#FCE3B0"/>`).join('')}</g>`;
      case 'nhan': return `<g ${t}><circle r="6.5" fill="#F7F1E0" stroke="#E2D2AE" stroke-width="1"/><circle cx="10" cy="4" r="5.5" fill="#F7F1E0" stroke="#E2D2AE" stroke-width="1"/><circle cx="-1" cy="-1" r="2" fill="#5A3A26"/></g>`;
      case 'thom': return `<g ${t}><rect x="-7" y="-7" width="14" height="12" rx="2" fill="#F7C93A"/><path d="M-7 -1 h14 M0 -7 v12" stroke="#E6A92A" stroke-width="1"/></g>`;
      case 'buoi': return `<g ${t}><path d="M-10 0 A10 10 0 0 1 10 0Z" fill="#F38C78"/>${[-6, -2, 2, 6].map(a => `<path d="M0 0 L${a} -8" stroke="#FCD6C8" stroke-width="1"/>`).join('')}</g>`;
      case 'mangcau': return `<g ${t}><circle r="8" fill="#B7D07A"/>${[[-3, -3], [3, -2], [0, 3]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.4" fill="#9CBC5C"/>`).join('')}</g>`;
    }
    return '';
  };

  const logo = (cx, cy, r = 13) => `<g transform="translate(${cx} ${cy})"><circle r="${r}" fill="#fff" opacity=".92"/><circle r="${r - 2}" fill="none" stroke="${GREEN}" stroke-width="1.6"/>
    <path d="M0 ${-r + 5} q-${r * .5} ${r * .5} 0 ${r * 1.2} q${r * .5} -${r * .7} 0 -${r * 1.2}Z" fill="${GREEN}"/><path d="M0 ${-r + 6} V${r - 5}" stroke="#fff" stroke-width="1"/></g>`;

  function cake(d, id) {
    const plate = `<ellipse cx="60" cy="150" rx="50" ry="12" fill="#fff" stroke="#E2E8E0" stroke-width="2"/><ellipse cx="60" cy="148" rx="36" ry="7" fill="#F4F7F2"/>`;
    switch (d.cake) {
      case 'flan': return `${plate}<path d="M32 146 L38 112 Q60 104 82 112 L88 146 Q60 152 32 146Z" fill="#F6D27A"/><path d="M38 112 Q60 104 82 112 Q60 122 38 112Z" fill="#8A4B1E"/><path d="M40 116 q4 10 2 18 M78 116 q-3 8 -1 14" stroke="#8A4B1E" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      case 'tiramisu': return `${plate}<path d="M26 146 L30 106 L94 98 L94 140Z" fill="#F4E7D3"/>${[112, 124, 134].map((y, k) => `<path d="M29 ${y + 2} L94 ${y - 6}" stroke="${k % 2 ? '#7A4E2D' : '#C9A27E'}" stroke-width="5"/>`).join('')}<path d="M30 106 L94 98 L94 104 L30 112Z" fill="#6B4127"/>`;
      case 'pannacotta': return `<path d="M34 70 L86 70 L80 150 L40 150Z" fill="#fff" opacity=".6" stroke="#DCE5DA" stroke-width="2"/><path d="M38 104 L82 104 L80 148 L40 148Z" fill="#FBF6EC"/><path d="M36 86 L84 86 L82 104 L38 104Z" fill="#F7C531"/>${[[50, 94], [64, 92], [72, 97]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#3A2A18"/>`).join('')}<ellipse cx="60" cy="70" rx="26" ry="5" fill="#F4F7F2" stroke="#DCE5DA" stroke-width="2"/>`;
      case 'croissant': return `${plate}<g transform="translate(60 124)"><path d="M-46 8 Q-40 -26 0 -28 Q40 -26 46 8 Q30 0 22 10 Q12 -6 0 8 Q-12 -6 -22 10 Q-30 0 -46 8Z" fill="#E3A44A"/><path d="M-30 -10 Q-22 4 -22 10 M0 -26 Q-2 -6 0 8 M30 -10 Q22 4 22 10" stroke="#B9722B" stroke-width="3" fill="none"/><path d="M-20 -22 Q0 -30 20 -22" stroke="#F6D08A" stroke-width="4" fill="none" stroke-linecap="round"/>${d.choco ? '<path d="M-8 8 q8 10 16 0" fill="#5A321E"/>' : ''}</g>`;
      case 'banana': return `${plate}<path d="M24 146 L28 108 Q60 96 92 108 L96 146Z" fill="#B97A45"/><path d="M28 108 Q60 96 92 108 L92 116 Q60 104 28 116Z" fill="#8A5530"/>${[[40, 104], [56, 100], [72, 101], [84, 105]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3" fill="#E9D9A8"/>`).join('')}${[[44, 130], [70, 126], [58, 138]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#6B4127"/>`).join('')}`;
    }
    return plate;
  }

  // d: món trong DATA.drinks (hoặc {look, c, fruit, top})
  function render(d, size = 120, cls = 'pl-cup') {
    const id = 'cp' + (++n);
    const h = Math.round(size * 1.5);
    // ảnh sản phẩm thật (nếu có); lỗi tải ảnh → quay về ly vẽ
    if (d.img) return `<img class="${cls} pl-photo" src="${d.img}" alt="${(d.name || '').replace(/"/g, '')}" width="${size}" height="${h}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.outerHTML=Cups.render({...Cups.byId('${d.id}'),img:null},${size},'${cls}')">`;
    const head = `<svg class="${cls}" width="${size}" height="${h}" viewBox="0 0 120 180" role="img" aria-label="${(d.name || 'Ly Phúc Long').replace(/"/g, '')}">`;
    if (d.look === 'cake') return `${head}<defs/>${cake(d, id)}</svg>`;
    const [c0, c1] = d.c || ['#E9D9B4', '#C9A27E'];
    const grad = `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient>`;
    const shadow = `<ellipse cx="60" cy="172" rx="34" ry="5" fill="#0B3B22" opacity=".12"/>`;

    if (d.look === 'hot') {
      return `${head}<defs>${grad}</defs>${shadow}
        <path d="M46 22 q-6 -8 0 -16 M60 20 q-6 -8 0 -16 M74 22 q-6 -8 0 -16" stroke="#C9D6CC" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M28 44 L92 44 L84 168 L36 168Z" fill="#FFFFFF" stroke="#DDE6DF" stroke-width="2"/>
        <path d="M31 84 L89 84 L86 128 L34 128Z" fill="${GREEN}"/>${logo(60, 106, 15)}
        <rect x="24" y="34" width="72" height="12" rx="5" fill="#F4F7F2" stroke="#DDE6DF" stroke-width="2"/><path d="M34 34 Q60 22 86 34Z" fill="#fff" stroke="#DDE6DF" stroke-width="2"/>
        <path d="M36 48 L40 160" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round"/></svg>`;
    }

    const blend = d.look === 'blend';
    const body = 'M24 46 L96 46 L88 168 L32 168Z';
    let inside = `<rect x="0" y="${blend ? 46 : 56}" width="120" height="130" fill="url(#${id}g)"/>`;
    if (d.look === 'milk' && d.id === 'yen-mach-matcha') inside = `<rect x="0" y="56" width="120" height="60" fill="${c0}"/><rect x="0" y="112" width="120" height="70" fill="${c1}"/><path d="M0 112 Q30 104 60 114 T120 110 V118 H0Z" fill="${c1}" opacity=".6"/>`;
    if (d.look === 'coffee' && ['bac-xiu', 'phin-sua'].includes(d.id)) inside = `<rect x="0" y="56" width="120" height="70" fill="${c1}"/><rect x="0" y="120" width="120" height="60" fill="${c0}"/><path d="M0 122 Q40 112 70 124 T120 118 V126 H0Z" fill="${c0}" opacity=".7"/>`;
    const ice = blend ? '' : [[36, 62], [58, 58], [74, 66], [46, 78], [66, 84]].map(([x, y]) => `<rect x="${x}" y="${y}" width="15" height="13" rx="3" fill="#fff" opacity=".38" transform="rotate(${(x % 17) - 8} ${x + 7} ${y + 6})"/>`).join('');
    const fruits = d.fruit ? [[44, 104, 1], [72, 118, .9], [56, 140, 1.05], [80, 92, .8]].map(([x, y, s]) => fruitSvg(d.fruit, x, y, s)).join('') : '';
    let tops = '';
    if (d.top === 'tranchau') tops = Array.from({ length: 16 }, (_, k) => `<circle cx="${36 + (k % 8) * 7 + (k > 7 ? 3 : 0)}" cy="${162 - (k > 7 ? 7 : 0)}" r="3.4" fill="#2B1B12"/>`).join('');
    if (d.top === 'thach') tops = Array.from({ length: 8 }, (_, k) => `<rect x="${36 + k * 6.5}" y="${146 + (k % 3) * 5}" width="4" height="14" rx="2" fill="#FFFFFF" opacity=".75" transform="rotate(${k * 17 % 40 - 20} ${38 + k * 6.5} ${152})"/>`).join('');
    const cream = d.top === 'kem' && !blend ? `<path d="M24 46 L96 46 L95 60 Q60 66 25 60Z" fill="#FBF6EC"/>` : '';
    const lid = blend
      ? `<path d="M22 46 Q24 10 60 8 Q96 10 98 46Z" fill="#fff" opacity=".45" stroke="#D5E2D8" stroke-width="2"/>
         <path d="M30 46 Q30 26 44 26 Q46 14 60 14 Q74 14 76 26 Q90 26 90 46Z" fill="#FDF9F1"/><path d="M40 34 Q60 26 80 34 M46 24 Q60 18 74 24" stroke="#EDE3D2" stroke-width="2" fill="none"/>
         <path d="M44 30 q6 6 12 0 q6 -6 12 0 q6 6 12 0" stroke="${c1}" stroke-width="3" fill="none" opacity=".8"/>`
      : `<rect x="20" y="40" width="80" height="9" rx="4" fill="#fff" opacity=".85" stroke="#D5E2D8" stroke-width="2"/>`;
    return `${head}<defs>${grad}<clipPath id="${id}c"><path d="${body}"/></clipPath></defs>${shadow}
      <path d="M66 46 L78 2" stroke="${GREEN}" stroke-width="6" stroke-linecap="round"/>
      <g clip-path="url(#${id}c)">${inside}${cream}${ice}${fruits}${tops}</g>
      <path d="${body}" fill="none" stroke="#CFDDD3" stroke-width="2"/>
      ${logo(60, 110, 14)}
      <path d="M31 52 L38 160" stroke="#fff" stroke-width="5" opacity=".45" stroke-linecap="round"/>
      ${lid}</svg>`;
  }

  const byId = id => DATA.drinks.find(x => x.id === id) || {};
  return { byId, render, GREEN };
})();
