/**
 * Builds a full Unsplash image URL from a photo ID.
 * All IDs below are verified fashion/lifestyle photos from Unsplash with high-definition settings.
 */
const U = (id, w = 1080, h = 1350) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=90`;

/** Master image map — every key maps to a luxury image */
export const IMG = {
  // ── 30 Men's Wardrobe Luxury Pieces (from public/wardrobe) ─────────────────
  // 5 Shirts
  'w-shirt-1': '/wardrobe/shirt 1.png',
  'w-shirt-2': '/wardrobe/shirt 2.png',
  'w-shirt-3': '/wardrobe/shirt 3.png',
  'w-shirt-4': '/wardrobe/shirt 4.png',
  'w-shirt-5': '/wardrobe/shirt 5.png',

  // 5 Pants
  'w-pant-1': '/wardrobe/pant 1.png',
  'w-pant-2': '/wardrobe/pant 2.png',
  'w-pant-3': '/wardrobe/pant 3.png',
  'w-pant-4': '/wardrobe/pant 4.png',
  'w-pant-5': '/wardrobe/pant 5.png',

  // 5 Shoes
  'w-shoe-1': '/wardrobe/shoe 1.png',
  'w-shoe-2': '/wardrobe/shoe 2.png',
  'w-shoe-3': '/wardrobe/shoe 3.png',
  'w-shoe-4': '/wardrobe/shoe 4.png',
  'w-shoe-5': '/wardrobe/shoe 5.png',

  // 5 Accessories
  'w-acc-1': '/wardrobe/a1.png',
  'w-acc-2': '/wardrobe/a2.png',
  'w-acc-3': '/wardrobe/a3.png',
  'w-acc-4': '/wardrobe/a4.png',
  'w-acc-5': '/wardrobe/a5.png',

  // 5 Jewelry
  'w-jewel-1': '/wardrobe/j1.png',
  'w-jewel-2': '/wardrobe/j2.png',
  'w-jewel-3': '/wardrobe/j3.png',
  'w-jewel-4': '/wardrobe/j4.png',
  'w-jewel-5': '/wardrobe/j5.png',

  // 5 Others
  'w-other-1': '/wardrobe/other 1.png',
  'w-other-2': '/wardrobe/other 2.png',
  'w-other-3': '/wardrobe/other 3.png',
  'w-other-4': '/wardrobe/other 4.png',
  'w-other-5': '/wardrobe/other 5.png',

  // ── 35 Women's Wardrobe Luxury Pieces (from public/wardrobe) ───────────────
  'women-dress-1': '/wardrobe/dress 1.png',
  'women-dress-2': '/wardrobe/dress 2.png',
  'women-dress-3': '/wardrobe/dress 3.png',
  'women-dress-4': '/wardrobe/dress 4.png',
  'women-dress-5': '/wardrobe/dress 5.png',
  'women-top-1':   '/wardrobe/top 1.png',
  'women-top-2':   '/wardrobe/top 2.png',
  'women-top-3':   '/wardrobe/top 3.png',
  'women-top-4':   '/wardrobe/top 4.png',
  'women-top-5':   '/wardrobe/top 5.png',
  'women-pant-1':  '/wardrobe/panty 1.png',
  'women-pant-2':  '/wardrobe/panty 2.png',
  'women-pant-3':  '/wardrobe/panty 3.png',
  'women-pant-4':  '/wardrobe/panty 4.png',
  'women-pant-5':  '/wardrobe/panty 5.png',
  'women-shoe-1':  '/wardrobe/footware 1.png',
  'women-shoe-2':  '/wardrobe/footware 2.png',
  'women-shoe-3':  '/wardrobe/footware 3.png',
  'women-shoe-4':  '/wardrobe/footware 4.png',
  'women-shoe-5':  '/wardrobe/footware 5.png',
  'women-jewel-1': '/wardrobe/jewel 1.png',
  'women-jewel-2': '/wardrobe/jewel 2.png',
  'women-jewel-3': '/wardrobe/jewel 3.png',
  'women-jewel-4': '/wardrobe/jewel 4.png',
  'women-jewel-5': '/wardrobe/jewel 5.png',
  'women-acc-1':   '/wardrobe/access 1.png',
  'women-acc-2':   '/wardrobe/access 2.png',
  'women-acc-3':   '/wardrobe/access 3.png',
  'women-acc-4':   '/wardrobe/access 4.png',
  'women-acc-5':   '/wardrobe/access 5.png',
  'women-other-1': '/wardrobe/other 1.png',
  'women-other-2': '/wardrobe/other 2.png',
  'women-other-3': '/wardrobe/other 3.png',
  'women-other-4': '/wardrobe/other 4.png',
  'women-other-5': '/wardrobe/other 5.png',

  // ── Backward-compatible Aliases ───────────────────────────────────────────
  'white-shirt':      '/wardrobe/shirt 1.png',
  'black-polo':       '/wardrobe/shirt 2.png',
  'green-shirt':      '/wardrobe/shirt 3.png',
  'beige-sweater':    '/wardrobe/shirt 4.png',
  'black-hoodie':     '/wardrobe/shirt 5.png',
  'blue-jeans':       '/wardrobe/pant 1.png',
  'black-trousers':   '/wardrobe/pant 2.png',
  'beige-chinos':     '/wardrobe/pant 3.png',
  'grey-cargo':       '/wardrobe/pant 4.png',
  'black-shorts':     '/wardrobe/pant 5.png',
  'watch':            '/wardrobe/a1.png',
  'belt':             '/wardrobe/a2.png',
  'sunglasses':       '/wardrobe/a3.png',
  'wallet':           '/wardrobe/a4.png',
  'cap':              '/wardrobe/a5.png',
  'chain':            '/wardrobe/j1.png',
  'ring':             '/wardrobe/j2.png',
  'bracelet':         '/wardrobe/j3.png',
  'earrings':         '/wardrobe/j4.png',
  'pendant':          '/wardrobe/j5.png',
  'white-sneakers':   '/wardrobe/shoe 3.png',
  'black-sneakers':   '/wardrobe/shoe 1.png',
  'formal-shoes':     '/wardrobe/shoe 2.png',
  'sports-shoes':     '/wardrobe/shoe 3.png',
  'chelsea-boots':    '/wardrobe/shoe 4.png',
  'denim-jacket':     '/wardrobe/shirt 3.png',
  'black-blazer':     '/wardrobe/shirt 4.png',
  'leather-jacket':   '/wardrobe/shirt 2.png',
  'bomber-jacket':    '/wardrobe/shirt 5.png',
  'puffer-jacket':    '/wardrobe/other 3.png',

  // ── Occasions (High-Definition Luxury Imagery) ─────────────────────────────
  'wedding':        '/img/occ-wedding.jpg',
  'college':        '/img/occ-college.jpg',
  'office':         '/img/occ-office.jpg',
  'date':           '/img/occ-date.jpg',
  'party':          '/img/occ-party.jpg',
  'travel':         '/img/occ-travel.jpg',
  'casual':         U('photo-1516826957135-700dedea698c', 1080, 1350),
  'gym':            U('photo-1517838277536-f5f99be501cd', 1080, 1350),
  'brunch':         U('photo-1554118811-1e0d58224f24', 1080, 1350),
  'family':         U('photo-1511895426328-dc8714191300', 1080, 1350),
  'beach':          U('photo-1507525428034-b723cf961d3e', 1080, 1350),
  'mountain':       U('photo-1464822759023-fed622ff2c3b', 1080, 1350),
  'city':           U('photo-1477959858617-67f85cf4f1df', 1080, 1350),
  'international':  U('photo-1500835556837-99ac94a94552', 1080, 1350),
  'summer':         U('photo-1523381294911-8d3cead13475', 1080, 1350),
  'monsoon':        U('photo-1515694346937-94d85e41e6f0', 1080, 1350),
  'winter':         U('photo-1483985988355-763728e1935b', 1080, 1350),
  'festive':        U('photo-1514222709107-a180c68d72b4', 1080, 1350),
  'interview':      U('photo-1507679799987-c73779587ccf', 1080, 1350),
  'concert':        U('photo-1470225620780-dba8ba36b745', 1080, 1350),
  'religious':      U('photo-1519817650390-64a93db51149', 1080, 1350),

  // ── UI Hero / Auth Images (Stored in public/BackGround Images/) ──────────
  'hero-home':              '/BackGround Images/Home BackGround Image.png',
  'hero-wardrobe':          '/BackGround Images/Wardrobe BackGround Image.png',
  'hero-create-outfit':     '/BackGround Images/Create Outfit BackGround Image.png',
  'hero-occasions':         '/BackGround Images/Occasions BackGround Image.png',
  'hero-profile':           '/BackGround Images/Profile BG.png',
  'hero-recommendations':   '/BackGround Images/Recommendations BackGround Image.png',
  'hero-saved-looks':       '/BackGround Images/Saved Looks BG.png',
  'hero-shopping':          '/BackGround Images/Shopping BackGround Image.png',
  'auth-login':             '/BackGround Images/Login BG.png',
  'auth-signup':            '/BackGround Images/Create Account BG.png',
  'avatar':                 U('photo-1534528741775-53994a69daeb', 400, 400),
};

/** Get a catalog image URL by key, with a safe fallback */
export const getImg = (key) =>
  IMG[key] ?? '/BackGround Images/Wardrobe BackGround Image.png';

/** Internal helper — keeps catalog builder functions short */
const I = (id) => getImg(id);

// ── Catalog builders ───────────────────────────────────────────────────────

export const occ = (id, t, s, g) => ({ id, title: t, sub: s, group: g, img: I(id) });

/**
 * 20 Curated Occasions classified into:
 * - Personal (4): Birthday, Date Night, Family Gathering, Casual Outing
 * - Professional (4): Job Interview, Office / Work, Formal Event, Business / Networking
 * - Social (4): Party, Concert / Night Out, Wedding, Engagement
 * - Travel (4): Travel / Vacation, Beach / Resort, Outdoor / Adventure, Shopping / City Outing
 * - Seasonal (4): Summer, Monsoon, Winter, Festive / Diwali
 * - Traditional: Wedding, Festive / Diwali, Engagement, Family Gathering
 */
export const occasionList = [
  // ── PERSONAL (4) ────────────────────────────────────────────────────────────
  {
    id: "birthday",
    name: "Birthday",
    title: "Birthday",
    image: "/Occasions/Birthday.png",
    img: "/Occasions/Birthday.png",
    category: "personal",
    group: "Personal",
    sub: "Celebration & Style",
  },
  {
    id: "date-night",
    name: "Date Night",
    title: "Date Night",
    image: "/Occasions/Date night.png",
    img: "/Occasions/Date night.png",
    category: "personal",
    group: "Personal",
    sub: "Chic & Romantic",
  },
  {
    id: "family-gathering",
    name: "Family Gathering",
    title: "Family Gathering",
    image: "/Occasions/Family Gathering.png",
    img: "/Occasions/Family Gathering.png",
    category: "personal",
    group: "Personal",
    isTraditional: true,
    sub: "Warm & Traditional",
  },
  {
    id: "casual-outing",
    name: "Casual Outing",
    title: "Casual Outing",
    image: "/Occasions/Casual Outing.png",
    img: "/Occasions/Casual Outing.png",
    category: "personal",
    group: "Personal",
    sub: "Relaxed & Effortless",
  },

  // ── PROFESSIONAL (4) ────────────────────────────────────────────────────────
  {
    id: "job-interview",
    name: "Job Interview",
    title: "Job Interview",
    image: "/Occasions/Job Interview.png",
    img: "/Occasions/Job Interview.png",
    category: "professional",
    group: "Professional",
    sub: "Sharp & Confident",
  },
  {
    id: "office-work",
    name: "Office / Work",
    title: "Office / Work",
    image: "/Occasions/Office.png",
    img: "/Occasions/Office.png",
    category: "professional",
    group: "Professional",
    sub: "Formal & Smart Casual",
  },
  {
    id: "formal-event",
    name: "Formal Event",
    title: "Formal Event",
    image: "/Occasions/Formal Event.png",
    img: "/Occasions/Formal Event.png",
    category: "professional",
    group: "Professional",
    sub: "Black Tie & Elegant",
  },
  {
    id: "business-networking",
    name: "Business / Networking",
    title: "Business / Networking",
    image: "/Occasions/Business Event.png",
    img: "/Occasions/Business Event.png",
    category: "professional",
    group: "Professional",
    sub: "Polished & Executive",
  },

  // ── SOCIAL (4) ──────────────────────────────────────────────────────────────
  {
    id: "party",
    name: "Party",
    title: "Party",
    image: "/Occasions/Party.png",
    img: "/Occasions/Party.png",
    category: "social",
    group: "Social",
    sub: "Glamorous & Festive",
  },
  {
    id: "concert-night-out",
    name: "Concert / Night Out",
    title: "Concert / Night Out",
    image: "/Occasions/Night Out.png",
    img: "/Occasions/Night Out.png",
    category: "social",
    group: "Social",
    sub: "Trendy & Edgy",
  },
  {
    id: "wedding",
    name: "Wedding",
    title: "Wedding",
    image: "/Occasions/Wedding.png",
    img: "/Occasions/Wedding.png",
    category: "social",
    group: "Social",
    isTraditional: true,
    sub: "Grand & Traditional",
  },
  {
    id: "engagement",
    name: "Engagement",
    title: "Engagement",
    image: "/Occasions/Engagement.png",
    img: "/Occasions/Engagement.png",
    category: "social",
    group: "Social",
    isTraditional: true,
    sub: "Celebratory & Regal",
  },

  // ── TRAVEL (4) ──────────────────────────────────────────────────────────────
  {
    id: "travel-vacation",
    name: "Travel / Vacation",
    title: "Travel / Vacation",
    image: "/Occasions/Travel.png",
    img: "/Occasions/Travel.png",
    category: "travel",
    group: "Travel",
    sub: "Comfort & Exploration",
  },
  {
    id: "beach-resort",
    name: "Beach / Resort",
    title: "Beach / Resort",
    image: "/Occasions/Beach.png",
    img: "/Occasions/Beach.png",
    category: "travel",
    group: "Travel",
    sub: "Breezy & Coastal",
  },
  {
    id: "outdoor-adventure",
    name: "Outdoor / Adventure",
    title: "Outdoor / Adventure",
    image: "/Occasions/Adventure.png",
    img: "/Occasions/Adventure.png",
    category: "travel",
    group: "Travel",
    sub: "Rugged & Functional",
  },
  {
    id: "shopping-city-outing",
    name: "Shopping / City Outing",
    title: "Shopping / City Outing",
    image: "/Occasions/Shopping.png",
    img: "/Occasions/Shopping.png",
    category: "travel",
    group: "Travel",
    sub: "Urban & Streetwear",
  },

  // ── SEASONAL (4) ────────────────────────────────────────────────────────────
  {
    id: "summer",
    name: "Summer",
    title: "Summer",
    image: "/Occasions/Summer.png",
    img: "/Occasions/Summer.png",
    category: "seasonal",
    group: "Seasonal",
    sub: "Light & Breathable",
  },
  {
    id: "monsoon",
    name: "Monsoon",
    title: "Monsoon",
    image: "/Occasions/Monsoon.png",
    img: "/Occasions/Monsoon.png",
    category: "seasonal",
    group: "Seasonal",
    sub: "Fresh & Weather-Ready",
  },
  {
    id: "winter",
    name: "Winter",
    title: "Winter",
    image: "/Occasions/Winter.png",
    img: "/Occasions/Winter.png",
    category: "seasonal",
    group: "Seasonal",
    sub: "Warm & Layered",
  },
  {
    id: "festive-diwali",
    name: "Festive / Diwali",
    title: "Festive / Diwali",
    image: "/Occasions/Festive.png",
    img: "/Occasions/Festive.png",
    category: "seasonal",
    group: "Seasonal",
    isTraditional: true,
    sub: "Ethnic & Vibrant",
  },
];

export const occasions = occasionList;

const w = (cat, list, defaultTag = 'Casual') =>
  list.map(([id, name, t]) => ({ id, name, cat, tag: t || defaultTag, img: I(id) }));

/**
 * Curated 30 Men's Wardrobe Items across 6 categories:
 * - Shirts (5)
 * - Pants (5)
 * - Shoes (5)
 * - Accessories (5)
 * - Jewelry (5)
 * - Others (5)
 */
export const wardrobe = [
  ...w('Shirts', [
    ['w-shirt-1', 'Classic Tailored White Shirt', 'Formal'],
    ['w-shirt-2', 'Charcoal Luxury Linen Shirt', 'Casual'],
    ['w-shirt-3', 'Navy Oxford Slim Dress Shirt', 'Formal'],
    ['w-shirt-4', 'Emerald Silk Blend Party Shirt', 'Party'],
    ['w-shirt-5', 'Earthy Textured Casual Shirt', 'Casual'],
  ]),
  ...w('Pants', [
    ['w-pant-1', 'Pleated Slate Dress Trousers', 'Formal'],
    ['w-pant-2', 'Slim Italian Chino Trousers', 'Casual'],
    ['w-pant-3', 'Tailored Charcoal Wool Trousers', 'Formal'],
    ['w-pant-4', 'Relaxed Cotton Tapered Pants', 'Casual'],
    ['w-pant-5', 'Modern Minimalist Cargo Pants', 'Casual'],
  ]),
  ...w('Shoes', [
    ['w-shoe-1', 'Italian Derby Leather Shoes', 'Formal'],
    ['w-shoe-2', 'Monk Strap Brogues', 'Formal'],
    ['w-shoe-3', 'Classic White Court Sneakers', 'Casual'],
    ['w-shoe-4', 'Hand-Stitched Suede Chelsea Boots', 'Casual'],
    ['w-shoe-5', 'Artisan Velvet Evening Slippers', 'Party'],
  ]),
  ...w('Accessories', [
    ['w-acc-1', 'Luxe Chronograph Steel Watch', 'Accessory'],
    ['w-acc-2', 'Italian Leather Reversible Belt', 'Accessory'],
    ['w-acc-3', 'Designer Polarized Sunglasses', 'Accessory'],
    ['w-acc-4', 'Handcrafted Bifold Leather Wallet', 'Accessory'],
    ['w-acc-5', 'Premium Silk Square & Cap', 'Accessory'],
  ]),
  ...w('Jewelry', [
    ['w-jewel-1', '18K Gold Cuban Link Chain', 'Jewelry'],
    ['w-jewel-2', 'Platinum Signet Ring', 'Jewelry'],
    ['w-jewel-3', 'Handcrafted Sterling Cuff Bracelet', 'Jewelry'],
    ['w-jewel-4', 'Solitaire Diamond Studs', 'Jewelry'],
    ['w-jewel-5', 'Obsidian Geometric Pendant', 'Jewelry'],
  ]),
  ...w('Others', [
    ['w-other-1', 'Heritage Full-Grain Leather Duffle', 'Luxury'],
    ['w-other-2', 'Artisan Handcrafted Loafers', 'Footwear'],
    ['w-other-3', 'Monogram Pure Cashmere Scarf', 'Winter'],
    ['w-other-4', 'Luxury Eau de Parfum & Grooming', 'Grooming'],
    ['w-other-5', 'Executive Leather Travel Folio', 'Travel'],
  ]),
];

export const cats = ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Jewelry', 'Others'];

const L = (id, title, occName, tags, items, customImg, gender = 'Men', matchScore = 95) => ({
  id,
  title,
  occ: occName,
  tags,
  img: customImg || I(occName),
  items,
  gender,
  matchScore,
});

export const looks = [
  // ── 20 AI Generated Master Looks (Men) ──
  L('outfit-1',  'Camel Blazer Smart Casual',        'casual',  ['Casual', 'Smart', 'Autumn'],           ['w-shirt-1', 'w-pant-2', 'w-acc-1', 'w-shoe-3'],                  '/img/outfits/outfit-1.png',  'Men', 95),
  L('outfit-2',  'Romantic Candlelight Dinner',      'date',    ['Date', 'Evening', 'Minimal'],          ['w-shirt-1', 'w-pant-1', 'w-acc-1', 'w-shoe-1'],                  '/img/outfits/outfit-2.png',  'Men', 88),
  L('outfit-3',  'Urban Cafe Stroll',                'casual',  ['Casual', 'Street', 'Coffee'],          ['w-shirt-2', 'w-pant-4', 'w-acc-3', 'w-shoe-3'],                  '/img/outfits/outfit-3.png',  'Men', 90),
  L('outfit-4',  'Ivory Chikankari Festive Kurta',   'festive', ['Festive', 'Traditional', 'Diwali'],    ['w-shirt-1', 'w-pant-1', 'w-shoe-1', 'w-jewel-3'],                 '/img/outfits/outfit-4.png',  'Men', 93),
  L('outfit-5',  'Gym Pro All-Black Performance',    'gym',     ['Sporty', 'Workout', 'Athletic'],       ['w-shirt-5', 'w-pant-5', 'w-acc-1', 'w-shoe-3'],                  '/img/outfits/outfit-5.png',  'Men', 94),
  L('outfit-6',  'Airport Ready Jetsetter',          'travel',  ['Travel', 'Airport', 'Streetwear'],     ['w-shirt-3', 'w-pant-4', 'w-acc-3', 'w-shoe-3', 'w-other-1'],     '/img/outfits/outfit-6.png',  'Men', 91),
  L('outfit-7',  'Nightclub Lounge Athleisure',      'gym',     ['Athletic', 'Fitness', 'Modern'],       ['w-shirt-2', 'w-pant-5', 'w-acc-1', 'w-shoe-3'],                  '/img/outfits/outfit-7.jpg',  'Men', 98),
  L('outfit-8',  'Executive Power Suit',             'office',  ['Formal', 'Office', 'Corporate'],       ['w-shirt-1', 'w-pant-3', 'w-shoe-1', 'w-acc-1', 'w-acc-2'],       '/img/outfits/outfit-8.png',  'Men', 92),
  L('outfit-9',  'Mediterranean Beach Resort',       'beach',   ['Summer', 'Beach', 'Resort'],           ['w-shirt-5', 'w-pant-4', 'w-acc-3', 'w-shoe-3'],                  '/img/outfits/outfit-9.png',  'Men', 93),
  L('outfit-10', 'Urban Crossbody Athleisure',       'casual',  ['Streetwear', 'Casual', 'Sporty'],       ['w-shirt-2', 'w-pant-5', 'w-shoe-3', 'w-acc-1'],                  '/img/outfits/outfit-10.jpg', 'Men', 98),
  L('outfit-11', 'Imperial Ivory Groom Sherwani',     'wedding', ['Wedding', 'Royal', 'Traditional'],     ['w-shirt-1', 'w-pant-1', 'w-shoe-5', 'w-jewel-1'],                 '/img/outfits/outfit-11.png', 'Men', 95),
  L('outfit-12', 'Emerald 3-Piece Tuxedo',           'wedding', ['Wedding', 'Reception', 'Luxury'],      ['w-shirt-4', 'w-pant-1', 'w-shoe-1', 'w-acc-1'],                  '/img/outfits/outfit-12.png', 'Men', 93),
  L('outfit-13', 'Sage Green Festive Kurta Ensemble', 'festive', ['Festive', 'Traditional', 'Silk'],      ['w-shirt-4', 'w-pant-2', 'w-shoe-5', 'w-jewel-3'],                 '/img/outfits/outfit-13.png', 'Men', 94),
  L('outfit-14', 'Gallery Art Curator Chic',         'office',  ['Office', 'Smart Casual', 'Creative'],   ['w-shirt-3', 'w-pant-1', 'w-shoe-4', 'w-acc-3'],                  '/img/outfits/outfit-14.jpg', 'Men', 98),
  L('outfit-15', 'Royal Black & Gold Indo-Western',  'wedding', ['Wedding', 'Sangeet', 'Royal'],         ['w-shirt-4', 'w-pant-3', 'w-shoe-1', 'w-jewel-1'],                 '/img/outfits/outfit-15.png', 'Men', 96),
  L('outfit-16', 'Dusty Rose Pastel Sherwani',       'wedding', ['Wedding', 'Pastel', 'Celebration'],    ['w-shirt-1', 'w-pant-2', 'w-shoe-5', 'w-jewel-2'],                 '/img/outfits/outfit-16.png', 'Men', 92),
  L('outfit-17', 'Midnight Navy Satin Shawl Tuxedo', 'party',   ['Party', 'Black Tie', 'Gala'],          ['w-shirt-3', 'w-pant-1', 'w-shoe-1', 'w-acc-1', 'w-jewel-2'],     '/img/outfits/outfit-17.png', 'Men', 97),
  L('outfit-18', 'Olive Utility Overshirt & Cargos', 'casual',  ['Streetwear', 'Casual', 'Everyday'],    ['w-shirt-5', 'w-pant-5', 'w-shoe-3', 'w-acc-1', 'w-other-1'],     '/img/outfits/outfit-18.png', 'Men', 95),
  L('outfit-19', 'Mocha Linen Minimalist Cafe',      'date',    ['Casual', 'Date', 'Minimal'],           ['w-shirt-2', 'w-pant-2', 'w-shoe-4', 'w-acc-1'],                  '/img/outfits/outfit-19.png', 'Men', 93),
  L('outfit-20', 'Autumn Quarter-Zip Knitwear',      'winter',  ['Autumn', 'Casual', 'Campus'],          ['w-shirt-3', 'w-pant-4', 'w-shoe-4', 'w-other-3', 'w-acc-1'],     '/img/outfits/outfit-20.png', 'Men', 94),

  // ── 22 Curated High-Fashion Women Looks (Local Outfit Images) ──
  L('outfit-w1',  'Glam Black Night-Out Mini',        'party',   ['Party', 'Evening', 'Glam'],            ['w-jewel-1', 'w-jewel-4', 'w-acc-1'],                             '/img/outfits/outfit-w1.png',  'Women', 97),
  L('outfit-w2',  'Cosy Heart Pyjama Set',            'casual',  ['Casual', 'Loungewear', 'Home'],         ['w-jewel-5', 'w-jewel-2'],                                        '/img/outfits/outfit-w2.png',  'Women', 93),
  L('outfit-w3',  'Sky Blue Flowy Maxi Gown',         'date',    ['Date', 'Romantic', 'Elegant'],          ['w-jewel-1', 'w-jewel-4', 'w-acc-1'],                             '/img/outfits/outfit-w3.png',  'Women', 96),
  L('outfit-w4',  'Brown Ribbed Top & Jeans OOTD',   'casual',  ['Casual', 'Everyday', 'Street'],         ['w-acc-1', 'w-jewel-3'],                                          '/img/outfits/outfit-w4.png',  'Women', 94),
  L('outfit-w5',  'Blush Floral Lehenga Choli',       'wedding', ['Wedding', 'Traditional', 'Festive'],    ['w-jewel-4', 'w-jewel-2', 'w-jewel-1'],                           '/img/outfits/outfit-w5.png',  'Women', 98),
  L('outfit-w6',  'Emerald Royal Velvet Lehenga',     'wedding', ['Wedding', 'Traditional', 'Royal'],      ['w-jewel-1', 'w-jewel-4', 'w-jewel-3', 'w-jewel-2'],              '/img/outfits/outfit-w6.png',  'Women', 97),
  L('outfit-w7',  'Modern Ivory Blazer & Slip Dress', 'office',  ['Formal', 'Chic', 'Corporate'],          ['w-shirt-1', 'w-acc-1', 'w-shoe-1'],                              '/img/outfits/outfit-w7.png',  'Women', 94),
  L('outfit-w8',  'Boho Sunset Resort Maxi Dress',    'beach',   ['Summer', 'Vacation', 'Resort'],         ['w-acc-3', 'w-jewel-1', 'w-acc-1'],                               '/img/outfits/outfit-w8.png',  'Women', 95),
  L('outfit-w9',  'Varsity Streetwear Oversized Fit', 'casual',  ['Streetwear', 'Casual', 'Trendy'],       ['w-shirt-5', 'w-acc-5', 'w-shoe-3'],                              '/img/outfits/outfit-w9.png',  'Women', 92),
  L('outfit-w10', 'Satin Slip Date Night Gown',       'date',    ['Date', 'Glamour', 'Evening'],           ['w-jewel-1', 'w-jewel-4', 'w-jewel-2', 'w-shoe-1'],               '/img/outfits/outfit-w10.png', 'Women', 96),
  L('outfit-w11', 'Cozy Cashmere Winter Layering',    'winter',  ['Winter', 'Warmth', 'Layered'],          ['w-shirt-4', 'w-pant-1', 'w-shoe-4'],                             '/img/outfits/outfit-w11.png', 'Women', 93),
  L('outfit-w12', 'Festive Banarasi Silk Saree',      'festive', ['Festive', 'Traditional', 'Celebration'],['w-jewel-1', 'w-jewel-4', 'w-jewel-3', 'w-jewel-2'],              '/img/outfits/outfit-w12.png', 'Women', 97),
  L('outfit-w13', 'High-Performance Activewear Set',  'gym',     ['Sporty', 'Workout', 'Athletic'],        ['w-acc-1', 'w-shoe-3'],                                           '/img/outfits/outfit-w13.png', 'Women', 98),
  L('outfit-w14', 'Pastel Floral Summer Sundress',    'brunch',  ['Brunch', 'Casual', 'Summery'],          ['w-acc-3', 'w-jewel-1', 'w-shoe-3'],                              '/img/outfits/outfit-w14.png', 'Women', 93),
  L('outfit-w15', 'Deep Green Anarkali Kurta Set',    'festive', ['Festive', 'Ethnic', 'Traditional'],     ['w-jewel-4', 'w-jewel-1', 'w-shoe-5'],                            '/img/outfits/outfit-w15.png', 'Women', 96),
  L('outfit-w16', 'Chic Trench Coat Office Look',     'office',  ['Office', 'Formal', 'Smart'],            ['w-shirt-1', 'w-acc-1', 'w-shoe-1'],                              '/img/outfits/outfit-w16.png', 'Women', 94),
  L('outfit-w17', 'Sangeet Night Sequin Lehenga',     'party',   ['Party', 'Wedding', 'Sangeet', 'Glam'], ['w-jewel-4', 'w-jewel-2', 'w-jewel-3', 'w-jewel-1'],              '/img/outfits/outfit-w17.png', 'Women', 98),
  L('outfit-w18', 'Cream Minimalist Kurti Palazzo',   'casual',  ['Casual', 'Ethnic', 'Minimal'],          ['w-jewel-4', 'w-jewel-3'],                                        '/img/outfits/outfit-w18.png', 'Women', 91),
  L('outfit-w19', 'Luxe Airport Travel OOTD',         'travel',  ['Travel', 'Airport', 'Chic'],            ['w-acc-3', 'w-acc-1', 'w-other-1'],                               '/img/outfits/outfit-w19.png', 'Women', 92),
  L('outfit-w20', 'Burgundy Velvet Evening Gown',     'party',   ['Party', 'Gala', 'Evening', 'Luxury'],  ['w-jewel-1', 'w-jewel-4', 'w-jewel-2', 'w-shoe-1'],               '/img/outfits/outfit-w20.png', 'Women', 97),
  L('outfit-w21', 'Rose Gold Bridal Lehenga',         'wedding', ['Wedding', 'Bridal', 'Royal', 'Luxury'],['w-jewel-1', 'w-jewel-4', 'w-jewel-3', 'w-jewel-2'],              '/img/outfits/outfit-w21.png', 'Women', 99),
  L('outfit-w22', 'Smart Casual Denim Co-ord',        'casual',  ['Casual', 'Street', 'Denim'],            ['w-shoe-3', 'w-acc-1', 'w-acc-3'],                                '/img/outfits/outfit-w22.png', 'Women', 90),
];

export const lookTabs = ['All Looks', 'Casual', 'Formal', 'Party', 'Traditional', 'Travel', 'Seasonal'];

const P = (id, name, price, r, n, cat, g, brand, customImg) => ({
  id,
  name,
  price,
  rating: r,
  reviews: n,
  cat,
  category: cat,
  g,
  gender: g === 'Women' ? 'Female' : 'Male',
  brand: brand || '',
  img: customImg || I(id),
  image: customImg || I(id),
  available: true,
});

/**
 * 35 Women's / Girls' Shopping & Wardrobe Products
 * Organized across 7 categories using existing assets in public/wardrobe/
 */
export const womenProducts = [
  // ── 5 Dresses ──────────────────────────────────────────────
  P('women-dress-1', 'Ethereal Floral Silk Maxi Dress',   3499, 4.9, '1.4k', 'Dresses',     'Women', 'ZARA',          '/wardrobe/dress 1.png'),
  P('women-dress-2', 'Velvet Evening Cocktail Dress',     4299, 4.8, '920',  'Dresses',     'Women', 'Mango',         '/wardrobe/dress 2.png'),
  P('women-dress-3', 'Pastel Tiered Ruffle Sundress',     2799, 4.7, '1.1k', 'Dresses',     'Women', 'H&M',           '/wardrobe/dress 3.png'),
  P('women-dress-4', 'Sculpted Satin Slip Midi Dress',    3899, 4.9, '850',  'Dresses',     'Women', 'Massimo Dutti', '/wardrobe/dress 4.png'),
  P('women-dress-5', 'Embroidered Festive Anarkali Gown', 5499, 4.8, '670',  'Dresses',     'Women', 'FabIndia',      '/wardrobe/dress 5.png'),

  // ── 5 Tops ─────────────────────────────────────────────────
  P('women-top-1',   'Ribbed Knit High-Neck Crop Top',    1499, 4.7, '1.2k', 'Tops',        'Women', 'ZARA',          '/wardrobe/top 1.png'),
  P('women-top-2',   'Organza Puff-Sleeve Peplum Blouse', 2199, 4.8, '880',  'Tops',        'Women', 'Mango',         '/wardrobe/top 2.png'),
  P('women-top-3',   'Breezy Linen Oversized Shirt Top',  1899, 4.6, '950',  'Tops',        'Women', 'H&M',           '/wardrobe/top 3.png'),
  P('women-top-4',   'Classic Satin Button-Down Shirt',   2499, 4.9, '1.0k', 'Tops',        'Women', 'Massimo Dutti', '/wardrobe/top 4.png'),
  P('women-top-5',   'Embroidered Boho Tunic Top',        1999, 4.7, '760',  'Tops',        'Women', 'FabIndia',      '/wardrobe/top 5.png'),

  // ── 5 Pants ────────────────────────────────────────────────
  P('women-pant-1',  'High-Waist Tailored Wide-Leg Pants',2999, 4.8, '1.3k', 'Pants',       'Women', 'ZARA',          '/wardrobe/panty 1.png'),
  P('women-pant-2',  'Flared Pleated Linen Palazzo Pants',2299, 4.7, '910',  'Pants',       'Women', 'Mango',         '/wardrobe/panty 2.png'),
  P('women-pant-3',  'Straight-Fit Vintage Denim Jeans',  3199, 4.9, '1.5k', 'Pants',       'Women', 'Levi\'s',       '/wardrobe/panty 3.png'),
  P('women-pant-4',  'Slim Cigarette Ankle Pants',        2699, 4.6, '840',  'Pants',       'Women', 'H&M',           '/wardrobe/panty 4.png'),
  P('women-pant-5',  'Relaxed Paperbag Waist Culottes',   2499, 4.8, '690',  'Pants',       'Women', 'Massimo Dutti', '/wardrobe/panty 5.png'),

  // ── 5 Footwear ─────────────────────────────────────────────
  P('women-shoe-1',  'Strappy Stiletto Evening Heels',    4499, 4.8, '890',  'Footwear',    'Women', 'Steve Madden',  '/wardrobe/footware 1.png'),
  P('women-shoe-2',  'Classic Court Platform Block Heels',3799, 4.7, '780',  'Footwear',    'Women', 'Aldo',          '/wardrobe/footware 2.png'),
  P('women-shoe-3',  'Minimalist Leather Mules & Slides', 2999, 4.6, '1.1k', 'Footwear',    'Women', 'ZARA',          '/wardrobe/footware 3.png'),
  P('women-shoe-4',  'Chunky Sole Designer Sneakers',     4999, 4.9, '1.4k', 'Footwear',    'Women', 'PUMA',          '/wardrobe/footware 4.png'),
  P('women-shoe-5',  'Artisan Handcrafted Ethnic Juttis', 2499, 4.8, '630',  'Footwear',    'Women', 'FabIndia',      '/wardrobe/footware 5.png'),

  // ── 5 Jewelry ──────────────────────────────────────────────
  P('women-jewel-1', '18K Gold Plated Layered Pendant',   3499, 4.9, '1.2k', 'Jewelry',     'Women', 'Tanishq',       '/wardrobe/jewel 1.png'),
  P('women-jewel-2', 'Kundan Polki Choker Necklace',      6999, 4.8, '520',  'Jewelry',     'Women', 'CaratLane',     '/wardrobe/jewel 2.png'),
  P('women-jewel-3', 'Diamond Studded Drop Earrings',     4299, 4.9, '940',  'Jewelry',     'Women', 'Malabar',       '/wardrobe/jewel 3.png'),
  P('women-jewel-4', 'Zircon Tennis Bracelet',            2999, 4.8, '780',  'Jewelry',     'Women', 'Swarovski',     '/wardrobe/jewel 4.png'),
  P('women-jewel-5', 'Statement Pearl Cocktail Ring',     1999, 4.7, '610',  'Jewelry',     'Women', 'Tanishq',       '/wardrobe/jewel 5.png'),

  // ── 5 Accessories ──────────────────────────────────────────
  P('women-acc-1',   'Structured Leather Crossbody Bag',  5499, 4.9, '1.3k', 'Accessories', 'Women', 'Coach',         '/wardrobe/access 1.png'),
  P('women-acc-2',   'Designer Cat-Eye UV Sunglasses',    3999, 4.8, '1.0k', 'Accessories', 'Women', 'Ray-Ban',       '/wardrobe/access 2.png'),
  P('women-acc-3',   'Rose Gold Mesh Luxury Watch',       8999, 4.9, '890',  'Accessories', 'Women', 'TITAN',         '/wardrobe/access 3.png'),
  P('women-acc-4',   'Printed Pure Mulberry Silk Scarf',  2499, 4.7, '540',  'Accessories', 'Women', 'Massimo Dutti', '/wardrobe/access 4.png'),
  P('women-acc-5',   'Reversible Italian Leather Belt',   1899, 4.6, '710',  'Accessories', 'Women', 'Tommy Hilfiger', '/wardrobe/access 5.png'),

  // ── 5 Other ────────────────────────────────────────────────
  P('women-other-1', 'Signature Floral Luxury Eau De Parfum',4999, 4.9, '1.5k','Other',     'Women', 'Dior',          '/wardrobe/other 1.png'),
  P('women-other-2', 'Handwoven Straw Beach Tote & Hat',  2299, 4.7, '620',  'Other',       'Women', 'Mango',         '/wardrobe/other 2.png'),
  P('women-other-3', 'Thermal Fleece Touchscreen Gloves', 1499, 4.6, '490',  'Other',       'Women', 'Uniqlo',        '/wardrobe/other 3.png'),
  P('women-other-4', 'Velvet Jewellery Travel Organizer', 1799, 4.8, '740',  'Other',       'Women', 'FOSSIL',        '/wardrobe/other 4.png'),
  P('women-other-5', 'Compact Quilted Vanity Case',       2799, 4.8, '880',  'Other',       'Women', 'ZARA',          '/wardrobe/other 5.png'),
];

/**
 * 30 Men's Shopping Products matching the 30 wardrobe luxury images without repeating
 */
export const menProducts = [
  // 5 Shirts (Men)
  P('w-shirt-1', 'Classic Tailored White Shirt',      2999, 4.8, '1.2k', 'Shirts',      'Men', 'ZARA'),
  P('w-shirt-2', 'Charcoal Luxury Linen Shirt',       3499, 4.7, '980',  'Shirts',      'Men', 'Massimo Dutti'),
  P('w-shirt-3', 'Navy Oxford Slim Dress Shirt',      2799, 4.6, '1.1k', 'Shirts',      'Men', 'Ralph Lauren'),
  P('w-shirt-4', 'Emerald Silk Blend Party Shirt',    3999, 4.9, '750',  'Shirts',      'Men', 'Armani'),
  P('w-shirt-5', 'Earthy Textured Casual Shirt',      2499, 4.5, '860',  'Shirts',      'Men', 'H&M'),

  // 5 Pants (Men)
  P('w-pant-1',  'Pleated Slate Dress Trousers',      3299, 4.7, '920',  'Pants',       'Men', 'ZARA'),
  P('w-pant-2',  'Slim Italian Chino Trousers',       2999, 4.6, '1.0k', 'Pants',       'Men', 'Tommy Hilfiger'),
  P('w-pant-3',  'Tailored Charcoal Wool Trousers',   3799, 4.8, '640',  'Pants',       'Men', 'Hugo Boss'),
  P('w-pant-4',  'Relaxed Cotton Tapered Pants',      2599, 4.5, '810',  'Pants',       'Men', 'Levi\'s'),
  P('w-pant-5',  'Modern Minimalist Cargo Pants',     2899, 4.7, '1.1k', 'Pants',       'Men', 'Calvin Klein'),

  // 5 Shoes (Men)
  P('w-shoe-1',  'Italian Derby Leather Shoes',       6999, 4.8, '840',  'Shoes',       'Men', 'Clarks'),
  P('w-shoe-2',  'Monk Strap Brogues',                5499, 4.7, '620',  'Shoes',       'Men', 'Steve Madden'),
  P('w-shoe-3',  'Classic White Court Sneakers',      4299, 4.9, '1.4k', 'Shoes',       'Men', 'NIKE'),
  P('w-shoe-4',  'Hand-Stitched Suede Chelsea Boots', 7999, 4.8, '510',  'Shoes',       'Men', 'Massimo Dutti'),
  P('w-shoe-5',  'Artisan Velvet Evening Slippers',   4999, 4.6, '380',  'Shoes',       'Men', 'ZARA'),

  // 5 Accessories (Men)
  P('w-acc-1',   'Luxe Chronograph Steel Watch',     12999, 4.9, '1.5k', 'Accessories', 'Men', 'TITAN'),
  P('w-acc-2',   'Italian Leather Reversible Belt',   2499, 4.6, '730',  'Accessories', 'Men', 'Tommy Hilfiger'),
  P('w-acc-3',   'Designer Polarized Sunglasses',     6999, 4.8, '1.2k', 'Accessories', 'Men', 'Ray-Ban'),
  P('w-acc-4',   'Handcrafted Bifold Leather Wallet', 1999, 4.7, '950',  'Accessories', 'Men', 'FOSSIL'),
  P('w-acc-5',   'Premium Silk Square & Cap',         1499, 4.5, '620',  'Accessories', 'Men', 'PUMA'),

  // 5 Jewelry (Men)
  P('w-jewel-1', '18K Gold Cuban Link Chain',         8499, 4.8, '670',  'Jewelry',     'Men', 'Tanishq'),
  P('w-jewel-2', 'Platinum Signet Ring',              4999, 4.7, '510',  'Jewelry',     'Men', 'CaratLane'),
  P('w-jewel-3', 'Handcrafted Sterling Cuff Bracelet',3499, 4.6, '440',  'Jewelry',     'Men', 'Malabar'),
  P('w-jewel-4', 'Solitaire Diamond Studs',           5999, 4.9, '390',  'Jewelry',     'Men', 'Tanishq'),
  P('w-jewel-5', 'Obsidian Geometric Pendant',        2799, 4.6, '580',  'Jewelry',     'Men', 'Kalyan'),

  // 5 Others (Men)
  P('w-other-1', 'Heritage Full-Grain Leather Duffle', 9999, 4.9, '820', 'Others',      'Men', 'Coach'),
  P('w-other-2', 'Artisan Handcrafted Loafers',        5499, 4.7, '910', 'Others',      'Men', 'Clarks'),
  P('w-other-3', 'Monogram Pure Cashmere Scarf',       3999, 4.8, '480', 'Others',      'Men', 'Burberry'),
  P('w-other-4', 'Luxury Eau de Parfum & Grooming',    4499, 4.9, '1.3k','Others',      'Men', 'Dior'),
  P('w-other-5', 'Executive Leather Travel Folio',     3299, 4.6, '390', 'Others',      'Men', 'Montblanc'),
];

export const products = [...womenProducts, ...menProducts];

export const womenCats = [
  'Dresses',
  'Tops',
  'Pants',
  'Footwear',
  'Jewelry',
  'Accessories',
  'Other',
];

export const menCats = [
  'Shirts',
  'Pants',
  'Shoes',
  'Accessories',
  'Jewelry',
  'Others',
];

export const womenShopCats = [
  ['Dresses',     '/wardrobe/dress 1.png'],
  ['Tops',        '/wardrobe/top 1.png'],
  ['Pants',       '/wardrobe/panty 1.png'],
  ['Footwear',    '/wardrobe/footware 1.png'],
  ['Jewelry',     '/wardrobe/jewel 1.png'],
  ['Accessories', '/wardrobe/access 1.png'],
  ['Other',       '/wardrobe/other 1.png'],
];

export const menShopCats = [
  ['Shirts',      'w-shirt-1'],
  ['Pants',       'w-pant-1'],
  ['Shoes',       'w-shoe-1'],
  ['Accessories', 'w-acc-1'],
  ['Jewelry',     'w-jewel-1'],
  ['Others',      'w-other-1'],
];

export const shopCats = womenShopCats;

/**
 * Normalizes any category string into the standardized category name
 */
export const normalizeCategory = (category, gender = 'Female') => {
  if (!category) return gender === 'Female' ? 'Other' : 'Others';
  const c = String(category).toLowerCase().trim();
  if (c.includes('dress')) return 'Dresses';
  if (c.includes('top')) return 'Tops';
  if (c.includes('shirt') || c.includes('blouse') || c.includes('tunic')) {
    return gender === 'Female' ? 'Tops' : 'Shirts';
  }
  if (c.includes('pant') || c.includes('trouser') || c.includes('jean') || c.includes('cargo') || c.includes('chino') || c.includes('palazzo') || c.includes('culotte')) {
    return 'Pants';
  }
  if (c.includes('foot') || c.includes('shoe') || c.includes('heel') || c.includes('boot') || c.includes('mule') || c.includes('sneaker') || c.includes('juttis') || c.includes('slide')) {
    return gender === 'Female' ? 'Footwear' : 'Shoes';
  }
  if (c.includes('jewel') || c.includes('ring') || c.includes('chain') || c.includes('pendant') || c.includes('earring') || c.includes('bracelet') || c.includes('necklace') || c.includes('choker')) {
    return 'Jewelry';
  }
  if (c.includes('access') || c.includes('belt') || c.includes('watch') || c.includes('sunglass') || c.includes('wallet') || c.includes('cap') || c.includes('bag') || c.includes('scarf')) {
    return 'Accessories';
  }
  return gender === 'Female' ? 'Other' : 'Others';
};

/**
 * Returns true if the user's profile or account indicates female / woman / girl
 */
export const isFemaleUser = (user) => {
  const g = String(user?.gender || user?.profile?.gender || '').toLowerCase().trim();
  return (
    g === 'female' ||
    g === 'woman' ||
    g === 'girl' ||
    g === 'women' ||
    g === 'f'
  );
};

export const brands = ['ZARA', 'H&M', 'NIKE', 'adidas', 'PUMA', 'FOSSIL', 'TITAN', 'Levi\'s', 'Ray-Ban', 'Tommy Hilfiger'];

export const colors = [
  ['Black',  '#000000'],
  ['White',  '#d8d8d8'],
  ['Navy',   '#1e3a6e'],
  ['Olive',  '#4a5a2a'],
  ['Beige',  '#d8b99a'],
  ['Brown',  '#8a4b22'],
  ['Red',    '#c8102e'],
  ['Pink',   '#d9619b'],
  ['Purple', '#6b2fb3'],
  ['Orange', '#f59e0b'],
];

export const styles = [
  'Casual', 'Formal', 'Streetwear', 'Traditional',
  'Minimal', 'Sporty', 'Trendy', 'Others',
];

export const nav = [
  ['Home',              '/home',               'Home'],
  ['My Wardrobe',       '/wardrobe',           'Shirt'],
  ['Create Outfit',     '/create-outfit',      'Wand2'],
  ['Occasions',         '/occasions',          'CalendarCheck'],
  ['Fashion Assistant', '/fashion-assistant',  'Sparkles'],
  ['Recommendations',   '/recommendations',   'Gem'],
  ['Saved Looks',       '/saved-looks',       'Heart'],
  ['Shopping',          '/shopping',          'ShoppingBag'],
  ['Profile',           '/profile',           'User'],
];
