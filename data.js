// Dữ liệu tĩnh mô phỏng theo đề án Tea Lab / #TràĐộcBản & "Tắc Kè Hoa"
const DATA = {
  bases: [
    { id: 'olong', name: 'Ô long', desc: 'Đậm, hậu ngọt, hương rang', color: '#B5651D', price: 35000, caffeine: 3 },
    { id: 'hong', name: 'Hồng trà', desc: 'Chát nhẹ, thơm mạch nha', color: '#8B2E16', price: 32000, caffeine: 3 },
    { id: 'xanh', name: 'Trà xanh', desc: 'Thanh mát, tươi cỏ non', color: '#9CBF4A', price: 32000, caffeine: 2 },
    { id: 'lai', name: 'Trà lài', desc: 'Dịu, thơm hoa nhài', color: '#D9C46A', price: 30000, caffeine: 1 },
  ],
  flavors: [
    { id: 'dao', name: 'Đào', emoji: '🍑', color: '#F6A27A', price: 8000 },
    { id: 'vai', name: 'Vải', emoji: '🔴', color: '#F3B6C2', price: 8000 },
    { id: 'chanh', name: 'Chanh', emoji: '🍋', color: '#E8E36B', price: 5000 },
    { id: 'nhai', name: 'Nhài', emoji: '🌼', color: '#F3EBC0', price: 5000 },
    { id: 'nhan', name: 'Nhãn', emoji: '🟤', color: '#D9C29A', price: 8000 },
    { id: 'matcha', name: 'Matcha', emoji: '🍵', color: '#7FA650', price: 10000 },
    { id: 'cacao', name: 'Cacao', emoji: '🍫', color: '#6B3E26', price: 10000 },
  ],
  toppings: [
    { id: 'tranchau', name: 'Trân châu', color: '#2B1B12', price: 7000 },
    { id: 'pudding', name: 'Pudding', color: '#F2C14E', price: 8000 },
    { id: 'thachdua', name: 'Thạch dừa', color: '#F4F1E8', price: 6000 },
    { id: 'nhadam', name: 'Nha đam', color: '#D8EFD3', price: 6000 },
    { id: 'suongsao', name: 'Sương sáo', color: '#1E1E1E', price: 6000 },
  ],
  sizes: [
    { id: 'M', name: 'M · 500ml', add: 0 },
    { id: 'L', name: 'L · 700ml', add: 10000 },
  ],
  maxToppings: 2,
  // Guided Creativity: loại bỏ tổ hợp khó uống
  badCombos: [
    { a: 'cacao', b: 'chanh', why: 'Cacao + Chanh dễ bị vón và chua gắt.' },
    { a: 'matcha', b: 'vai', why: 'Matcha át hoàn toàn vị vải thanh nhẹ.' },
    { a: 'cacao', b: 'lai', why: 'Cacao lấn át hương nhài của Trà lài.' },
  ],
  presets: [
    { name: 'Độc bản của hệ chạy deadline', base: 'olong', flavor: 'cacao', toppings: ['tranchau'], sugar: 30, ice: 50, caffeine: 3, note: 'Ô long đậm đặc, tỉnh táo cả đêm' },
    { name: 'Độc bản của hệ chữa lành', base: 'lai', flavor: 'nhai', toppings: ['nhadam'], sugar: 30, ice: 70, caffeine: 1, note: 'Trà lài + ít ngọt + nha đam' },
    { name: 'Nắng sớm Sài Gòn', base: 'xanh', flavor: 'dao', toppings: ['thachdua'], sugar: 50, ice: 70, caffeine: 2, note: 'Hợp buổi sáng' },
    { name: 'Đêm dịu dàng', base: 'lai', flavor: 'nhan', toppings: ['pudding'], sugar: 50, ice: 30, caffeine: 1, note: 'Ít caffeine, hợp buổi tối' },
  ],

  hubs: [
    { id: 'hoian', type: 'Destination', city: 'Hội An', name: 'Phúc Long Phố Cổ', color: '#E0A526',
      space: 'Nhà cổ mái ngói âm dương, tường vôi vàng, đèn lồng lụa xanh, giếng trời tiểu cảnh và "Bức tường Trà Di sản".',
      signature: { name: 'Trà nhài mắt rồng củ sen', price: 55000 },
      collector: { name: 'Ly gốm Đèn Lồng Hội An', price: 290000, total: 500, left: 137 },
      workshop: 'Thưởng trà & làm đèn lồng – sáng Chủ nhật' },
    { id: 'dalat', type: 'Destination', city: 'Đà Lạt', name: 'Phúc Long Đồi Thông', color: '#3F7D58',
      space: 'Villa gỗ thông Bắc Âu – Á Đông, không gian mở 360° nhìn đồi núi, sân vườn có lò sưởi ngoài trời.',
      signature: { name: 'Trà ô long kem bơ Đà Lạt', price: 59000 },
      collector: { name: 'Bình giữ nhiệt Rừng Thông', price: 350000, total: 400, left: 52 },
      workshop: 'Pha trà nóng bên lò sưởi – tối thứ Bảy' },
    { id: 'hanoi', type: 'Destination', city: 'Phố cổ Hà Nội', name: 'Phúc Long Hàng Gai', color: '#3E7D5A',
      space: 'Nhà ống mái ngói phố cổ, cửa chớp gỗ xanh lá, ban công hoa giấy, cây bàng trước hiên và góc ngồi nhìn ra phố như quán trà đá ngày xưa.',
      signature: { name: 'Trà sen Tây Hồ', price: 59000 },
      collector: { name: 'Ly gốm men lam Bát Tràng', price: 280000, total: 500, left: 188 },
      workshop: 'Ướp trà sen thủ công – sáng Chủ nhật' },
    { id: 'urban', type: 'Urban', city: 'TP.HCM', name: 'Phúc Long Urban Hub – Làng Đại học', color: '#0E6B3B',
      space: 'Dual-Zone: Focus Zone bàn cá nhân có vách, ổ cắm Type-C, đèn ấm; Chill/Social Zone sofa nhóm, gương check-in, art-installation.',
      signature: null, collector: null, workshop: null },
  ],
  focusSlots: ['07:00–09:00', '09:00–11:00', '11:00–13:00', '13:00–15:00', '15:00–17:00', '17:00–19:00', '19:00–21:00'],

  menu: ['Trà Sữa Phúc Long', 'Hồng Trà Đào', 'Hồng Trà Sữa', 'Trà Vải Lài', 'Yến Mạch Matcha Latte', 'Trà Ô Long Sữa', 'Trà nhài mắt rồng củ sen', 'Trà ô long kem bơ Đà Lạt', 'Trà sen Tây Hồ'],
  stores: ['Phúc Long Phố Cổ (Hội An)', 'Phúc Long Đồi Thông (Đà Lạt)', 'Phúc Long Hàng Gai (Phố cổ Hà Nội)', 'Urban Hub – Làng Đại học', 'Phúc Long Nguyễn Huệ', 'Phúc Long Hai Bà Trưng'],

  prizes: [
    { name: 'Câu Chuyện Độc Bản của Năm', rule: 'Hội đồng chấm: chân thật, truyền cảm hứng', reward: 'Ly trà giới hạn mang tên bạn; Tea Pass 12 tháng; một phần doanh thu góp quỹ cộng đồng' },
    { name: 'Cộng Đồng Chọn', rule: 'Bình chọn thật từ cộng đồng', reward: 'Tea Pass 6 tháng, ly tái sử dụng khắc tên' },
    { name: 'Công Thức Độc Bản', rule: 'Sáng tạo, ngon, dễ làm', reward: 'Thử đưa vào menu theo mùa cùng đội R&D' },
    { name: 'Nhà Kể Chuyện Trẻ', rule: 'Cách kể và dựng video sáng tạo', reward: 'Hỗ trợ sản xuất nội dung, đồng hành cùng thương hiệu' },
  ],
  maxVotes: 3,
  bannedWords: ['ngu', 'đần', 'khùng', 'xấu xí', 'đồ điên'],

  seedUsers: [
    { id: 'u1', name: 'Minh Thư', handle: 'minhthu.tea', avatar: { v: 4, face: 1, skin: '#fbd5bf', hair: 4, hairColor: '#3b2a24', fringe: 0, eyes: 1, eyeColor: '#6b4a32', brows: 0, mouth: 1, blush: 0, top: 2, topColor: '#ffffff', outer: -1, dress: -1, bottom: 2, bottomColor: '#2f3a4a', shoes: 1, socks: 1, accessories: [2], pose: 1, bg: 3 } },
    { id: 'u2', name: 'Gia Bảo', handle: 'baodeadline', avatar: { v: 4, face: 4, skin: '#e6a77e', hair: 6, hairColor: '#3b2a24', fringe: 5, eyes: 5, eyeColor: '#3b2a24', brows: 1, mouth: 5, blush: -1, top: 7, topColor: '#2f3a4a', outer: -1, dress: -1, bottom: 1, bottomColor: '#9aa6b8', shoes: 0, socks: -1, accessories: [5], pose: 7, bg: 1 } },
    { id: 'u3', name: 'Lan Chi', handle: 'chi.chualanh', avatar: { v: 4, face: 0, skin: '#ffe4d6', hair: 2, hairColor: '#b07a4a', fringe: 3, eyes: 2, eyeColor: '#4a8fd0', brows: 6, mouth: 0, blush: 3, top: -1, outer: 1, outerColor: '#ffffff', dress: 2, dressColor: '#9fd8b4', bottom: -1, shoes: 3, socks: -1, accessories: [9], pose: 6, bg: 6 } },
    { id: 'u4', name: 'Quốc Huy', handle: 'huy.dalat', avatar: { v: 4, face: 5, skin: '#c4805a', hair: 5, hairColor: '#3b2a24', fringe: 6, eyes: 0, eyeColor: '#3f9a6a', brows: 2, mouth: 6, blush: -1, top: 0, topColor: '#e5735a', outer: 0, outerColor: '#8fc7f0', dress: -1, bottom: 4, bottomColor: '#c9a27e', shoes: 2, socks: -1, accessories: [7], pose: 2, bg: 7 } },
    { id: 'u5', name: 'Thảo Vy', handle: 'vy.hoian', avatar: { v: 4, face: 2, skin: '#f6c7a8', hair: 7, hairColor: '#5a3a2a', fringe: 1, eyes: 7, eyeColor: '#e06aa0', brows: 0, mouth: 1, blush: 6, top: -1, outer: -1, dress: 3, dressColor: '#f49ab8', bottom: -1, shoes: 1, socks: 5, accessories: [10], pose: 4, bg: 4 } },
    { id: 'u6', name: 'Đức Anh', handle: 'ducanh.reviews', avatar: { v: 4, face: 6, skin: '#fff1e8', hair: 1, hairColor: '#f2d38a', fringe: 2, eyes: 3, eyeColor: '#6b5bb5', brows: 3, mouth: 2, blush: 1, top: 6, topColor: '#b79be0', outer: -1, dress: -1, bottom: 7, bottomColor: '#b79be0', shoes: 6, socks: 3, accessories: [0, 3], pose: 3, bg: 5 } },
  ],
};

// Bài đăng mẫu cho feed Cộng đồng (thời gian tính theo phút trước)
DATA.seedPosts = [
  { id: 'p1', user: 'u2', ago: 25, type: 'recipe', contest: true,
    text: 'Độc bản của hệ chạy deadline đây 🫡 Ô long đậm + cacao + trân châu, ít đá. Uống xong làm 3 cái slide liền. #TràĐộcBản #HệDeadline',
    recipe: { name: 'Deadline Không Sợ', base: 'olong', flavor: 'cacao', toppings: ['tranchau'], sugar: 30, ice: 30, caffeine: 3, size: 'L' },
    likes: 312, reposts: 41, replies: [{ user: 'u1', text: 'Công thức cứu mạng mùa thi 😭', ago: 12 }] },
  { id: 'p2', user: 'u3', ago: 60, type: 'recipe', contest: true,
    text: 'Mình là hệ chữa lành. Mỗi chiều thứ Sáu tự thưởng một ly thật dịu, ít ngọt, có nha đam mát lạnh. Câu chuyện độc bản của mình là: chậm lại cũng không sao 🌿 #TràĐộcBản',
    recipe: { name: 'Chậm Lại Cũng Được', base: 'lai', flavor: 'nhai', toppings: ['nhadam'], sugar: 30, ice: 70, caffeine: 1, size: 'M' },
    likes: 528, reposts: 97, replies: [{ user: 'u5', text: 'Đọc mà thấy nhẹ lòng ghê', ago: 40 }, { user: 'u4', text: 'Mai ra Tea Lab thử liền', ago: 30 }] },
  { id: 'p3', user: 'u4', ago: 120, type: 'review',
    text: 'Ngồi bên lò sưởi ngoài trời ở Đà Lạt, gọi ly ô long kem bơ. Kem bơ béo mà không ngấy, ô long gánh vị rất tốt. View đồi thông buổi tối đỉnh thật sự 🌲',
    review: { item: 'Trà ô long kem bơ Đà Lạt', store: 'Phúc Long Đồi Thông (Đà Lạt)', stars: 5 },
    likes: 204, reposts: 18, replies: [] },
  { id: 'p4', user: 'u5', ago: 180, type: 'review',
    text: 'Bức tường Trà Di sản ở Hội An đẹp xỉu. Trà nhài mắt rồng củ sen thơm, ngọt thanh. Mua luôn ly gốm Đèn Lồng số #0363 🏮',
    review: { item: 'Trà nhài mắt rồng củ sen', store: 'Phúc Long Phố Cổ (Hội An)', stars: 5 },
    likes: 389, reposts: 52, replies: [{ user: 'u1', text: 'Ly đẹp quá, còn hàng không bạn?', ago: 150 }] },
  { id: 'p5', user: 'u6', ago: 240, type: 'review',
    text: 'Focus Zone ở Urban Hub: bàn có vách, ổ Type-C từng chỗ, không gọi loa nên yên tĩnh. Điểm trừ: giờ cao điểm phải đặt chỗ trước trên app.',
    review: { item: 'Trà sữa Phúc Long', store: 'Urban Hub – Làng Đại học', stars: 4 },
    likes: 156, reposts: 22, replies: [] },
  { id: 'p6', user: 'u1', ago: 300, type: 'recipe', contest: true,
    text: 'Màu hồng đào là màu của mình 🍑 Trà xanh + đào + thạch dừa, 50% đường. Đặt tên là "Nắng Tháng Ba" vì gặp crush đúng hôm đó hihi #TràĐộcBản',
    recipe: { name: 'Nắng Tháng Ba', base: 'xanh', flavor: 'dao', toppings: ['thachdua'], sugar: 50, ice: 70, caffeine: 2, size: 'M' },
    likes: 441, reposts: 60, replies: [] },
  { id: 'p7', user: 'u6', ago: 420, type: 'review',
    text: 'Trà đào cam sả vẫn là chân ái, đào miếng giòn. Hôm nay hơi ngọt hơn mọi khi một chút.',
    review: { item: 'Trà đào cam sả', store: 'Phúc Long Nguyễn Huệ', stars: 4 },
    likes: 87, reposts: 4, replies: [] },
  { id: 'p8', user: 'u3', ago: 600, type: 'free',
    text: 'Ai đi Tea Passport đủ 3 dấu chưa? Mình còn thiếu Phố cổ Hà Nội 🥲 hè này nhất định phải đủ bộ.',
    likes: 73, reposts: 3, replies: [{ user: 'u5', text: 'Mình đủ rồi nè, mở khóa được áo khoác Đà Lạt cho nhân vật luôn', ago: 500 }] },
  { id: 'p9', user: 'u2', ago: 800, type: 'recipe',
    text: 'Combo cho buổi tối không mất ngủ: Trà lài + nhãn + pudding, caffeine thấp. Thử đi rồi cảm ơn mình sau.',
    recipe: { name: 'Ngủ Ngon Nha', base: 'lai', flavor: 'nhan', toppings: ['pudding'], sugar: 50, ice: 30, caffeine: 1, size: 'M' },
    likes: 198, reposts: 15, replies: [] },
  { id: 'p10', user: 'u4', ago: 1000, type: 'recipe', contest: true,
    text: 'Độc bản của dân leo núi ⛰️ Hồng trà + vải + sương sáo, nhiều đá. Uống ở đỉnh Langbiang là hết sảy. #TràĐộcBản',
    recipe: { name: 'Đỉnh Langbiang', base: 'hong', flavor: 'vai', toppings: ['suongsao'], sugar: 70, ice: 100, caffeine: 3, size: 'L' },
    likes: 267, reposts: 30, replies: [] },
  { id: 'p11', user: 'u5', ago: 1300, type: 'review',
    text: 'Matcha latte hôm nay hơi nhạt, nhưng nhân viên đổi ly mới rất nhanh và thân thiện. Vẫn 4 sao vì thái độ phục vụ 💚',
    review: { item: 'Matcha latte', store: 'Phúc Long Hai Bà Trưng', stars: 4 },
    likes: 64, reposts: 2, replies: [] },
  { id: 'p12', user: 'u1', ago: 1600, type: 'recipe',
    text: 'Công thức matcha cho người mê màu xanh: Trà xanh + matcha + nha đam, 30% đường. Xanh từ trong ra ngoài 🍵',
    recipe: { name: 'Xanh Toàn Tập', base: 'xanh', flavor: 'matcha', toppings: ['nhadam'], sugar: 30, ice: 70, caffeine: 2, size: 'M' },
    likes: 143, reposts: 9, replies: [] },
];

// ---------- Menu Phúc Long (tham khảo phuclong.com.vn, 10/2026) ----------
// look: kiểu ly để vẽ minh hoạ – ice (trà trái cây), milk (trà sữa), coffee, hot (ly giấy), blend (đá xay), cake
DATA.menuCats = [
  { id: 'fruit', name: 'Trà trái cây', icon: '🍑' },
  { id: 'milk', name: 'Trà sữa', icon: '🧋' },
  { id: 'coffee', name: 'Cà phê', icon: '☕' },
  { id: 'blend', name: 'Đá xay', icon: '🧊' },
  { id: 'cake', name: 'Bánh Phúc Long', icon: '🥐' },
];
DATA.drinks = [
  { id: 'vai-lai', cat: 'fruit', name: 'Trà Vải Lài', m: 55000, l: 65000, desc: 'Trà lài thơm dịu, vải tươi mọng', look: 'ice', c: ['#F6E7C6', '#EED39C'], fruit: 'vai', best: true, moods: ['relax', 'healthy', 'heal'] },
  { id: 'hong-tra-dao', cat: 'fruit', name: 'Hồng Trà Đào', m: 55000, l: 65000, desc: 'Hồng trà đậm, đào miếng giòn', look: 'ice', c: ['#E9A25A', '#C9662A'], fruit: 'dao', moods: ['relax', 'energy', 'date'] },
  { id: 'hong-tra-chanh', cat: 'fruit', name: 'Hồng Trà Chanh', m: 45000, l: 55000, desc: 'Chua thanh, tỉnh táo tức thì', look: 'ice', c: ['#E58C4A', '#B8521F'], fruit: 'chanh', moods: ['energy', 'focus'] },
  { id: 'lucky-tea', cat: 'fruit', name: 'Trà Lucky Tea', m: 60000, l: 70000, desc: 'Ly trà may mắn nhiều tầng hương', look: 'ice', c: ['#F7C6CF', '#E9879A'], fruit: 'dau', best: true, moods: ['date', 'heal'] },
  { id: 'nhan-sen', cat: 'fruit', name: 'Trà Nhãn Sen', m: 55000, l: 65000, desc: 'Nhãn ngọt thanh, hạt sen bùi', look: 'ice', c: ['#F3E6C9', '#E3CC9C'], fruit: 'nhan', best: true, moods: ['relax', 'heal'] },
  { id: 'nhan-lai', cat: 'fruit', name: 'Trà Nhãn - Lài', m: 55000, l: 65000, desc: 'Nhãn lồng và hương lài', look: 'ice', c: ['#F2E4B8', '#DCC27E'], fruit: 'nhan', moods: ['relax'] },
  { id: 'lai-dac-thom', cat: 'fruit', name: 'Trà Lài Đác Thơm', m: 55000, l: 65000, desc: 'Hạt đác dẻo, thơm chua ngọt', look: 'ice', c: ['#F7E08A', '#E7BD3A'], fruit: 'thom', moods: ['healthy', 'energy'] },
  { id: 'olong-dau', cat: 'fruit', name: 'Trà Ô Long Dâu', m: 55000, l: 65000, desc: 'Ô long rang thơm, dâu tây chín', look: 'ice', c: ['#F2A4A4', '#C9473F'], fruit: 'dau', moods: ['date', 'energy'] },
  { id: 'lai-mang-cau', cat: 'fruit', name: 'Trà Lài Mãng Cầu Thạch Dừa Sợi', m: 60000, l: 70000, desc: 'Mãng cầu xay, thạch dừa sợi', look: 'ice', c: ['#E8F0C8', '#C6D98E'], fruit: 'mangcau', top: 'thach', moods: ['healthy', 'heal'] },
  { id: 'olong-lai-buoi', cat: 'fruit', name: 'Trà Ô Long Lài Bưởi', m: 65000, l: 75000, desc: 'Tép bưởi hồng, hậu vị lài', look: 'ice', c: ['#F9D3C0', '#EE9A86'], fruit: 'buoi', moods: ['healthy', 'focus'] },
  { id: 'tra-sua-pl', cat: 'milk', name: 'Trà Sữa Phúc Long', m: 50000, l: 60000, desc: 'Vị trà đậm chất Phúc Long', look: 'milk', c: ['#D8B48C', '#B98758'], top: 'tranchau', best: true, moods: ['focus', 'date'] },
  { id: 'olong-sua', cat: 'milk', name: 'Trà Ô Long Sữa', m: 50000, l: 60000, desc: 'Ô long rang hoà quyện sữa', look: 'milk', c: ['#D2AA80', '#A97A4E'], best: true, moods: ['focus', 'relax'] },
  { id: 'tra-sua-socola', cat: 'milk', name: 'Trà Sữa Socola', m: 60000, l: 70000, desc: 'Socola đậm, béo mịn', look: 'milk', c: ['#9C6B4A', '#6B4127'], top: 'tranchau', moods: ['date', 'heal'] },
  { id: 'hong-tra-sua', cat: 'milk', name: 'Hồng Trà Sữa', m: 50000, l: 60000, desc: 'Hồng trà chát nhẹ, sữa thơm', look: 'milk', c: ['#D49A72', '#A9643F'], moods: ['focus'] },
  { id: 'tra-sua-nhan-sen', cat: 'milk', name: 'Trà Sữa Nhãn Sen', m: 60000, l: 70000, desc: 'Nhãn sen phiên bản trà sữa', look: 'milk', c: ['#EBDDC2', '#D6BE94'], moods: ['relax', 'heal'] },
  { id: 'tra-sua-lai', cat: 'milk', name: 'Trà Sữa Lài', m: 55000, l: 65000, desc: 'Nhẹ nhàng hương hoa lài', look: 'milk', c: ['#EFE3C9', '#DCC79E'], moods: ['relax'] },
  { id: 'tra-sua-konjac', cat: 'milk', name: 'Trà Sữa Ô Long Lài Thạch Konjac', m: 59000, l: 69000, desc: 'Thạch konjac giòn dai', look: 'milk', c: ['#E2C9A4', '#C29A6C'], top: 'thach', moods: ['date'] },
  { id: 'yen-mach-matcha', cat: 'milk', name: 'Yến Mạch Matcha Latte', m: 59000, l: 69000, desc: 'Matcha và sữa yến mạch', look: 'milk', c: ['#E9E4CF', '#7FA650'], moods: ['healthy', 'focus'] },
  { id: 'phin-den', cat: 'coffee', name: 'Phin Đen Đá', m: 35000, l: 45000, desc: 'Cà phê phin đậm vị Việt', look: 'coffee', c: ['#5A3A26', '#24150D'], moods: ['focus', 'energy'] },
  { id: 'phin-sua', cat: 'coffee', name: 'Phin Sữa Đá', m: 39000, l: 49000, desc: 'Phin truyền thống, sữa đặc', look: 'coffee', c: ['#B9875C', '#6E4429'], moods: ['energy', 'focus'] },
  { id: 'bac-xiu', cat: 'coffee', name: 'Bạc Xỉu', m: 39000, l: 45000, desc: 'Nhiều sữa, chút cà phê', look: 'coffee', c: ['#EBD7BD', '#9C6B44'], moods: ['relax', 'energy'] },
  { id: 'silky', cat: 'coffee', name: 'Cà Phê Sữa Kem Silky', m: 55000, l: 65000, desc: 'Lớp kem silky mịn màng', look: 'coffee', c: ['#C79A6E', '#5E3A22'], top: 'kem', moods: ['energy', 'date'] },
  { id: 'americano', cat: 'coffee', name: 'Americano', m: 50000, l: 60000, desc: 'Espresso pha loãng thanh nhẹ', look: 'coffee', c: ['#6B4430', '#2F1C12'], moods: ['focus'] },
  { id: 'latte', cat: 'coffee', name: 'Cà phê Latte', m: 55000, l: 65000, desc: 'Espresso và sữa tươi', look: 'hot', c: ['#E7D2B4', '#B4865A'], moods: ['relax', 'focus'] },
  { id: 'cappuccino', cat: 'coffee', name: 'Cà phê Cappuccino', m: 55000, l: 65000, desc: 'Bọt sữa dày, hương espresso', look: 'hot', c: ['#E2C9A6', '#A87A50'], moods: ['focus'] },
  { id: 'mocha', cat: 'coffee', name: 'Mocha', m: 55000, l: 65000, desc: 'Cà phê và socola', look: 'hot', c: ['#B48464', '#6B4127'], moods: ['date', 'heal'] },
  { id: 'oreo-da-xay', cat: 'blend', name: 'Oreo Kem Đá Xay', l: 69000, desc: 'Bánh Oreo xay cùng kem', look: 'blend', c: ['#EDE6DE', '#6B5A50'], top: 'kem', moods: ['date', 'heal'] },
  { id: 'cafe-da-xay', cat: 'blend', name: 'Cà Phê Đá Xay', l: 70000, desc: 'Cà phê mát lạnh sánh mịn', look: 'blend', c: ['#C9A07A', '#8A5E3E'], top: 'kem', moods: ['energy', 'focus'] },
  { id: 'hong-tra-dac-cam', cat: 'blend', name: 'Hồng Trà Đác Cam Đá Xay', l: 75000, desc: 'Cam tươi, hạt đác dẻo', look: 'blend', c: ['#F6B067', '#E07B2E'], moods: ['energy', 'healthy'] },
  { id: 'sua-chua-xoai', cat: 'blend', name: 'Sữa Chua Xoài Đác Thơm', l: 75000, desc: 'Sữa chua xoài chua dịu', look: 'blend', c: ['#FBE3A2', '#F2B53B'], moods: ['healthy', 'heal'] },
  { id: 'sua-chua-phuc-bon-tu', cat: 'blend', name: 'Sữa Chua Phúc Bồn Tử Đác Cam', l: 75000, desc: 'Phúc bồn tử và cam', look: 'blend', c: ['#F6C2D0', '#C9466A'], moods: ['healthy', 'date'] },
  { id: 'chanh-da-xay', cat: 'blend', name: 'Chanh Đá Xay', l: 59000, desc: 'Chua mát, sảng khoái', look: 'blend', c: ['#F2F2C6', '#C9D96A'], moods: ['energy', 'healthy'] },
  { id: 'flan', cat: 'cake', name: 'Bánh Flan Phúc Long', l: 20000, desc: 'Mềm mịn, caramel đắng nhẹ', look: 'cake', cake: 'flan', moods: ['heal'] },
  { id: 'tiramisu', cat: 'cake', name: 'Bánh Tiramisu', l: 38000, desc: 'Cacao, mascarpone, cà phê', look: 'cake', cake: 'tiramisu', moods: ['date'] },
  { id: 'panna-cotta', cat: 'cake', name: 'Bánh Passion Panna Cotta', l: 35000, desc: 'Chanh dây chua ngọt', look: 'cake', cake: 'pannacotta', moods: ['healthy'] },
  { id: 'croissant', cat: 'cake', name: 'Bánh croissant 60g', l: 35000, desc: 'Ngàn lớp bơ giòn', look: 'cake', cake: 'croissant', moods: ['energy'] },
  { id: 'croissant-choco', cat: 'cake', name: 'Bánh croissant choco 45g', l: 22000, desc: 'Nhân socola chảy', look: 'cake', cake: 'croissant', choco: true, moods: ['heal'] },
  { id: 'banh-chuoi', cat: 'cake', name: 'Bánh Chuối Hạt Dinh Dưỡng', l: 39000, desc: 'Chuối chín và các loại hạt', look: 'cake', cake: 'banana', moods: ['healthy', 'focus'] },
];
DATA.menuExtras = {
  toppings: [['Trân châu trắng', 10000], ['Thạch dừa sợi', 10000], ['Thạch konjac', 10000], ['Kem silky', 15000], ['Đào miếng', 15000]],
  sugar: ['Không đường', 'Ít đường', 'Bình thường', 'Nhiều đường'],
  ice: ['Không đá', 'Ít đá', 'Bình thường'],
};

// ---------- Mood Mix (gợi ý theo tâm trạng – kiểu playlist Spotify) ----------
DATA.moods = [
  { id: 'relax', name: 'Thư giãn cuối ngày', emoji: '🌿', desc: 'Nhẹ nhàng, ít caffeine, hương hoa thơm dịu', colors: ['#8CC9A0', '#1F6B45'] },
  { id: 'focus', name: 'Tập trung chạy deadline', emoji: '🎧', desc: 'Đậm vị, tỉnh táo, giữ nhịp làm việc', colors: ['#4E6B5C', '#14281D'] },
  { id: 'healthy', name: 'Healthy & thanh mát', emoji: '🥗', desc: 'Trái cây tươi, ít ngọt, nhiều vitamin', colors: ['#C6E39B', '#4F8A3A'] },
  { id: 'energy', name: 'Nạp năng lượng buổi sáng', emoji: '⚡', desc: 'Chua thanh, cà phê, khởi động ngày mới', colors: ['#F6D06A', '#C7782A'] },
  { id: 'heal', name: 'Chữa lành tâm hồn', emoji: '🫶', desc: 'Ngọt ngào, béo mịn, ôm lấy ngày dài', colors: ['#F2C1CF', '#9C4F78'] },
  { id: 'date', name: 'Hẹn hò ngọt ngào', emoji: '💞', desc: 'Món đẹp để chụp, vị ngọt để nhớ', colors: ['#F6A6A0', '#B8394A'] },
];

// ---------- Bạn bè & chuỗi Phúc Long ----------
DATA.friendCodes = { u1: 'PL-1986', u2: 'PL-2207', u3: 'PL-0811', u4: 'PL-1503', u5: 'PL-3009', u6: 'PL-0402' };
DATA.friendStreaks = { u1: 12, u2: 5, u3: 21, u4: 3, u5: 8, u6: 1 };
DATA.friendActivity = [
  { user: 'u1', drink: 'vai-lai', ago: 18, store: 'Phúc Long Nguyễn Huệ', note: 'Chiều nay nắng đẹp quá ☀️', bg: 0, reacts: { '💚': 4, '😍': 2 } },
  { user: 'u3', drink: 'nhan-sen', ago: 55, store: 'Phúc Long Hàng Gai', note: 'Ngồi nhìn phố cổ, chill', bg: 2, reacts: { '💚': 7 } },
  { user: 'u2', drink: 'phin-den', ago: 130, store: 'Urban Hub – Làng Đại học', note: 'Ly thứ 2 trong ngày, deadline ơi 😵', bg: 4, reacts: { '😂': 5, '💪': 3 } },
  { user: 'u5', drink: 'lucky-tea', ago: 240, store: 'Phúc Long Phố Cổ (Hội An)', note: 'Đèn lồng + Lucky Tea = hết nước chấm', bg: 3, reacts: { '😍': 9 } },
  { user: 'u4', drink: 'olong-sua', ago: 420, store: 'Phúc Long Đồi Thông (Đà Lạt)', note: 'Lạnh 14 độ mà vẫn phải uống đá', bg: 1, reacts: { '🥶': 6, '💚': 2 } },
  { user: 'u6', drink: 'hong-tra-dao', ago: 900, store: 'Phúc Long Hai Bà Trưng', note: 'Chân ái muôn đời', bg: 5, reacts: { '💚': 3 } },
];
DATA.streakRewards = [
  { days: 3, title: 'Giảm 10% đơn bất kỳ', code: 'CHUOI3' },
  { days: 7, title: 'Giảm 20% + sticker lá trà', code: 'CHUOI7' },
  { days: 14, title: 'Miễn phí 1 ly size L', code: 'CHUOI14' },
  { days: 30, title: 'Ly giữ nhiệt Phúc Long phiên bản chuỗi', code: 'CHUOI30' },
];

// ---------- Ảnh đồ uống thật (lấy theo đường dẫn ảnh trên menu phuclong.com.vn) ----------
// Món không có ảnh (ly tự phối, món signature theo địa điểm) vẫn dùng hình ly vẽ SVG.
(() => {
  const S = 'https://s3-hcmc02.higiocloud.vn/images/';
  const IMG = {
    'vai-lai': '2026/03/tra-vai-lai100-20260312081006.jpg', 'hong-tra-dao': '2026/03/tra-dao100-20260312043430.jpg', 'hong-tra-chanh': '2026/03/hong-tra-chanh100-20260312043052.jpg',
    'lucky-tea': '2026/09/lucky-tea100-20260911175745.jpg', 'nhan-sen': '2026/03/tra-nhan-lai100-20260312082056.jpg', 'nhan-lai': '2026/03/tra-nhan-lai100-20260312050025.jpg',
    'lai-dac-thom': '2026/03/tra-lai-dac-thom100-20260312044702.jpg', 'olong-dau': '2026/03/tra-o-long-thach-dau100-20260312080658.jpg', 'lai-mang-cau': '2026/03/tra-lai-thach-dua100-20260312044833.jpg',
    'olong-lai-buoi': '2026/03/tra-lai-buoi100-20260312081807.jpg', 'tra-sua-pl': '2026/03/ts-phuc-long100-20260312080904.jpg', 'olong-sua': '2026/03/ts-o-long100-20260312080734.jpg',
    'tra-sua-socola': '2026/03/ts-socola100-20260312080933.jpg', 'hong-tra-sua': '2026/03/hong-tra-sua100-20260312044444.jpg', 'tra-sua-nhan-sen': '2026/03/ts-nhan-sen100-20260312082111.jpg',
    'tra-sua-lai': '2026/03/ts-lai100-20260312081917.jpg', 'tra-sua-konjac': '2026/03/ts-o-long-lai-tc-trang100-20260312080807.jpg', 'yen-mach-matcha': '2026/09/tra-oatcha-matcha-latte_thumbnail-20260908025555.jpg',
    'phin-den': '2026/03/cf-da100-20260312042539.jpg', 'phin-sua': '2026/03/cf-sua100-20260312042819.jpg', 'bac-xiu': '2026/09/bac-xiu100-20260908083822.jpg',
    'silky': '2026/03/cf-sua-silky100-20260312082407.jpg', 'americano': '2026/09/americano100-20260908084037.jpg', 'latte': '2026/03/latte100-20260312042711.jpg',
    'cappuccino': '2026/03/cappucinno100-20260312050327.jpg', 'mocha': '2026/09/mocha100-20260908084442.jpg', 'oreo-da-xay': '2026/03/oreo-da-xay100-20260312044530.jpg',
    'cafe-da-xay': '2026/03/cappuccino-da-xay100-20260312043002.jpg', 'hong-tra-dac-cam': '2026/03/hong-tra-dac-cam100-20260312043252.jpg', 'sua-chua-xoai': '2026/03/sua-chua-dac-thom100-20260312044633.jpg',
    'sua-chua-phuc-bon-tu': '2026/03/sua-chua-phuc-bon-tu100-20260312044612.jpg', 'chanh-da-xay': '2026/03/chanh-da-xay100-20260312043017.jpg',
    'flan': '2024/10/flan-20241004031750.png', 'tiramisu': '2022/60000643-tiramisu-mini_b87000d1-71a7-4652-9c41-6565acf281f7-og.png',
    'panna-cotta': '2022/60000644-passion-panna-cotta_225037c1-1c48-40f1-bab1-f26d54a6ce6b-og.png', 'croissant': '2023/03/68000021-pure-butter-croissant-banh-sung-bo-60g-20230328024455.png',
    'croissant-choco': '2022/60000639-butter-chocolate-croissant-45g_08fa60a8-dcbc-4e71-aabc-95c0370b9352-og.png', 'banh-chuoi': '2025/03/chuoi-20250305103953.png',
  };
  DATA.drinks.forEach(d => { if (IMG[d.id]) d.img = S + IMG[d.id]; });
})();

// ---------- Ảnh thật của từng cửa hàng (theo tài liệu đề án) ----------
DATA.storePhotos = {
  hoian: [1, 2, 3].map(i => `./hoian-${i}.jpg`),
  dalat: [1, 2, 3].map(i => `./dalat-${i}.jpg`),
  hanoi: [1, 2, 3].map(i => `./hanoi-${i}.jpg`),
  urban: [1, 2, 3].map(i => `./urban-${i}.jpg`),
};
