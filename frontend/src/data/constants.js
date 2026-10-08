/**
 * Builds a full Unsplash image URL from a photo ID.
 * All IDs below are verified fashion/lifestyle photos from Unsplash with high-definition settings.
 */
const U = (id, w = 1080, h = 1350) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=90`;

/** Master image map — every key maps to a luxury image */
export const IMG = {
  // ── 25 Men's Wardrobe Luxury Pieces (from public/wardrobe) ─────────────────
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

  // ── Backward-compatible Aliases (mapped to new luxury images) ───────────────
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
  'white-sneakers':   '/wardrobe/other 2.png',
  'black-sneakers':   '/wardrobe/other 2.png',
  'formal-shoes':     '/wardrobe/other 2.png',
  'sports-shoes':     '/wardrobe/other 2.png',
  'chelsea-boots':    '/wardrobe/other 2.png',
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
  'casual':         U('photo-1516826957135-700dedea698c', 1080, 1350),  // Ultra HD luxury Italian street casual
  'gym':            U('photo-1517838277536-f5f99be501cd', 1080, 1350),  // Ultra HD luxury fitness/gym
  'brunch':         U('photo-1554118811-1e0d58224f24', 1080, 1350),  // Aesthetic luxury cafe brunch
  'family':         U('photo-1511895426328-dc8714191300', 1080, 1350),  // Rich elegant celebration
  'beach':          U('photo-1507525428034-b723cf961d3e', 1080, 1350),  // High-res luxury tropical resort
  'mountain':       U('photo-1464822759023-fed622ff2c3b', 1080, 1350),  // Cinematic alpine mountain landscape
  'city':           U('photo-1477959858617-67f85cf4f1df', 1080, 1350),  // Metropolitan skyline
  'international':  U('photo-1500835556837-99ac94a94552', 1080, 1350),  // High-res international travel
  'summer':         U('photo-1523381294911-8d3cead13475', 1080, 1350),  // Crisp sunlit summer aesthetic
  'monsoon':        U('photo-1515694346937-94d85e41e6f0', 1080, 1350),  // London luxury wet-weather trench
  'winter':         U('photo-1483985988355-763728e1935b', 1080, 1350),  // High-fashion winter coat
  'festive':        U('photo-1514222709107-a180c68d72b4', 1080, 1350),  // Rich festive celebration
  'interview':      U('photo-1507679799987-c73779587ccf', 1080, 1350),  // Bespoke tailored suit
  'concert':        U('photo-1470225620780-dba8ba36b745', 1080, 1350),  // High-energy vibrant concert
  'religious':      U('photo-1519817650390-64a93db51149', 1080, 1350),  // Serene traditional architecture

  // ── UI Hero / Auth Images ─────────────────────────────────────────────────
  'hero-home':      '/img/hero-luxury.jpg',
  'hero-wardrobe':  '/img/hero-wardrobe-luxury.jpg',
  'hero-profile':   U('photo-1558769132-cb1aea458c5e', 1400, 700),
  'auth-login':     U('photo-1483985988355-763728e1935b', 900, 1200),
  'auth-signup':    U('photo-1469334031218-e382a71b716b', 900, 1200),
  'avatar':         U('photo-1534528741775-53994a69daeb', 400, 400),
};

/** Get a catalog image URL by key, with a safe fallback */
export const getImg = (key) =>
  IMG[key] ?? '/img/hero-wardrobe-luxury.jpg';

/** Internal helper — keeps catalog builder functions short */
const I = (id) => getImg(id);

// ── Catalog builders ───────────────────────────────────────────────────────

export const occ = (id, t, s, g) => ({ id, title: t, sub: s, group: g, img: I(id) });

export const occasions = [
  occ('wedding',     'Wedding',            'Elegant & Traditional',   'Popular'),
  occ('college',     'College',            'Casual & Comfortable',    'Popular'),
  occ('office',      'Office',             'Formal & Professional',    'Popular'),
  occ('date',        'Date',               'Stylish & Trendy',         'Popular'),
  occ('party',       'Party',              'Bold & Confident',         'Popular'),
  occ('travel',      'Travel',             'Comfy & Functional',       'Popular'),
  occ('casual',      'Casual Day',         'Comfortable & Effortless', 'Personal'),
  occ('gym',         'Workout / Gym',      'Sporty & Functional',      'Personal'),
  occ('brunch',      'Brunch',             'Chic & Relaxed',           'Personal'),
  occ('family',      'Family Function',    'Traditional & Classy',     'Personal'),
  occ('beach',       'Beach Vacation',     'Breezy & Stylish',         'Travel'),
  occ('mountain',    'Mountain Trip',      'Warm & Comfortable',       'Travel'),
  occ('city',        'City Travel',        'Trendy & Versatile',       'Travel'),
  occ('international','International Travel','Stylish & Global',       'Travel'),
  occ('summer',      'Summer',             'Light & Breathable',       'Seasonal'),
  occ('monsoon',     'Monsoon',            'Practical & Stylish',      'Seasonal'),
  occ('winter',      'Winter',             'Warm & Layered',           'Seasonal'),
  occ('festive',     'Festive (Diwali)',   'Traditional & Elegant',    'Seasonal'),
  occ('interview',   'Interview',          'Formal & Minimal',         'Special'),
  occ('concert',     'Concert',            'Edgy & Modern',            'Special'),
  occ('religious',   'Religious Visit',    'Traditional & Modest',     'Special'),
];

const w = (cat, list, defaultTag = 'Casual') =>
  list.map(([id, name, t]) => ({ id, name, cat, tag: t || defaultTag, img: I(id) }));

/**
 * Curated 25 Men's Wardrobe Items across exactly 5 categories:
 * - Shirts (5)
 * - Pants (5)
 * - Accessories (5)
 * - Jewelry (5)
 * - Others (5)
 * Outerwear is completely removed.
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

export const cats = ['Shirts', 'Pants', 'Accessories', 'Jewelry', 'Others'];

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
  L('outfit-1',  'Camel Blazer Smart Casual',        'casual',  ['Casual', 'Smart', 'Autumn'],           ['w-shirt-1', 'w-pant-2', 'w-acc-1', 'w-other-2'],                '/img/outfits/outfit-1.png',  'Men', 95),
  L('outfit-2',  'Romantic Candlelight Dinner',      'date',    ['Date', 'Evening', 'Minimal'],          ['w-shirt-1', 'w-pant-1', 'w-acc-1', 'w-jewel-1'],                '/img/outfits/outfit-2.png',  'Men', 88),
  L('outfit-3',  'Urban Cafe Stroll',                'casual',  ['Casual', 'Street', 'Coffee'],          ['w-shirt-2', 'w-pant-4', 'w-acc-3', 'w-acc-1'],                  '/img/outfits/outfit-3.png',  'Men', 90),
  L('outfit-4',  'Ivory Chikankari Festive Kurta',   'festive', ['Festive', 'Traditional', 'Diwali'],    ['w-shirt-1', 'w-pant-1', 'w-other-2', 'w-jewel-3'],               '/img/outfits/outfit-4.png',  'Men', 93),
  L('outfit-5',  'Gym Pro All-Black Performance',    'gym',     ['Sporty', 'Workout', 'Athletic'],       ['w-shirt-5', 'w-pant-5', 'w-acc-1', 'w-acc-5'],                  '/img/outfits/outfit-5.png',  'Men', 94),
  L('outfit-6',  'Airport Ready Jetsetter',          'travel',  ['Travel', 'Airport', 'Streetwear'],     ['w-shirt-3', 'w-pant-4', 'w-acc-3', 'w-other-1'],                '/img/outfits/outfit-6.png',  'Men', 91),
  L('outfit-7',  'Nightclub Lounge Athleisure',      'gym',     ['Athletic', 'Fitness', 'Modern'],       ['w-shirt-2', 'w-pant-5', 'w-acc-1', 'w-jewel-1'],                '/img/outfits/outfit-7.jpg',  'Men', 98),
  L('outfit-8',  'Executive Power Suit',             'office',  ['Formal', 'Office', 'Corporate'],       ['w-shirt-1', 'w-pant-3', 'w-acc-1', 'w-acc-2', 'w-other-2'],      '/img/outfits/outfit-8.png',  'Men', 92),
  L('outfit-9',  'Mediterranean Beach Resort',       'beach',   ['Summer', 'Beach', 'Resort'],           ['w-shirt-5', 'w-pant-4', 'w-acc-3', 'w-acc-1'],                  '/img/outfits/outfit-9.png',  'Men', 93),
  L('outfit-10', 'Urban Crossbody Athleisure',       'casual',  ['Streetwear', 'Casual', 'Sporty'],       ['w-shirt-2', 'w-pant-5', 'w-acc-1', 'w-acc-5'],                  '/img/outfits/outfit-10.jpg', 'Men', 98),
  L('outfit-11', 'Imperial Ivory Groom Sherwani',     'wedding', ['Wedding', 'Royal', 'Traditional'],     ['w-shirt-1', 'w-pant-1', 'w-jewel-1', 'w-other-2'],              '/img/outfits/outfit-11.png', 'Men', 95),
  L('outfit-12', 'Emerald 3-Piece Tuxedo',           'wedding', ['Wedding', 'Reception', 'Luxury'],      ['w-shirt-4', 'w-pant-1', 'w-acc-1', 'w-other-2'],                '/img/outfits/outfit-12.png', 'Men', 93),
  L('outfit-13', 'Sage Green Festive Kurta Ensemble', 'festive', ['Festive', 'Traditional', 'Silk'],      ['w-shirt-4', 'w-pant-2', 'w-jewel-3', 'w-other-2'],              '/img/outfits/outfit-13.png', 'Men', 94),
  L('outfit-14', 'Gallery Art Curator Chic',         'office',  ['Office', 'Smart Casual', 'Creative'],   ['w-shirt-3', 'w-pant-1', 'w-acc-3', 'w-other-5'],                '/img/outfits/outfit-14.jpg', 'Men', 98),
  L('outfit-15', 'Royal Black & Gold Indo-Western',  'wedding', ['Wedding', 'Sangeet', 'Royal'],         ['w-shirt-4', 'w-pant-3', 'w-jewel-1', 'w-other-2'],              '/img/outfits/outfit-15.png', 'Men', 96),
  L('outfit-16', 'Dusty Rose Pastel Sherwani',       'wedding', ['Wedding', 'Pastel', 'Celebration'],    ['w-shirt-1', 'w-pant-2', 'w-jewel-2', 'w-other-2'],              '/img/outfits/outfit-16.png', 'Men', 92),
  L('outfit-17', 'Midnight Navy Satin Shawl Tuxedo', 'party',   ['Party', 'Black Tie', 'Gala'],          ['w-shirt-3', 'w-pant-1', 'w-acc-1', 'w-jewel-2'],                '/img/outfits/outfit-17.png', 'Men', 97),
  L('outfit-18', 'Olive Utility Overshirt & Cargos', 'casual',  ['Streetwear', 'Casual', 'Everyday'],    ['w-shirt-5', 'w-pant-5', 'w-acc-1', 'w-other-1'],                '/img/outfits/outfit-18.png', 'Men', 95),
  L('outfit-19', 'Mocha Linen Minimalist Cafe',      'date',    ['Casual', 'Date', 'Minimal'],           ['w-shirt-2', 'w-pant-2', 'w-acc-1', 'w-other-2'],                '/img/outfits/outfit-19.png', 'Men', 93),
  L('outfit-20', 'Autumn Quarter-Zip Knitwear',      'winter',  ['Autumn', 'Casual', 'Campus'],          ['w-shirt-3', 'w-pant-4', 'w-other-3', 'w-acc-1'],                '/img/outfits/outfit-20.png', 'Men', 94),

  // ── 22 Curated High-Fashion Women Looks (Local Outfit Images) ──
  L('outfit-w1',  'Glam Black Night-Out Mini',        'party',   ['Party', 'Evening', 'Glam'],            ['w-jewel-1', 'w-jewel-4', 'w-acc-1'],                             '/img/outfits/outfit-w1.png',  'Women', 97),
  L('outfit-w2',  'Cosy Heart Pyjama Set',            'casual',  ['Casual', 'Loungewear', 'Home'],         ['w-jewel-5', 'w-jewel-2'],                                        '/img/outfits/outfit-w2.png',  'Women', 93),
  L('outfit-w3',  'Sky Blue Flowy Maxi Gown',         'date',    ['Date', 'Romantic', 'Elegant'],          ['w-jewel-1', 'w-jewel-4', 'w-acc-1'],                             '/img/outfits/outfit-w3.png',  'Women', 96),
  L('outfit-w4',  'Brown Ribbed Top & Jeans OOTD',   'casual',  ['Casual', 'Everyday', 'Street'],         ['w-acc-1', 'w-jewel-3'],                                          '/img/outfits/outfit-w4.png',  'Women', 94),
  L('outfit-w5',  'Blush Floral Lehenga Choli',       'wedding', ['Wedding', 'Traditional', 'Festive'],    ['w-jewel-4', 'w-jewel-2', 'w-jewel-1'],                           '/img/outfits/outfit-w5.png',  'Women', 98),
  L('outfit-w6',  'Emerald Royal Velvet Lehenga',     'wedding', ['Wedding', 'Traditional', 'Royal'],      ['w-jewel-1', 'w-jewel-4', 'w-jewel-3', 'w-jewel-2'],              '/img/outfits/outfit-w6.png',  'Women', 97),
  L('outfit-w7',  'Modern Ivory Blazer & Slip Dress', 'office',  ['Formal', 'Chic', 'Corporate'],          ['w-shirt-1', 'w-acc-1', 'w-other-2'],                             '/img/outfits/outfit-w7.png',  'Women', 94),
  L('outfit-w8',  'Boho Sunset Resort Maxi Dress',    'beach',   ['Summer', 'Vacation', 'Resort'],         ['w-acc-3', 'w-jewel-1', 'w-acc-1'],                               '/img/outfits/outfit-w8.png',  'Women', 95),
  L('outfit-w9',  'Varsity Streetwear Oversized Fit', 'casual',  ['Streetwear', 'Casual', 'Trendy'],       ['w-shirt-5', 'w-acc-5', 'w-acc-1'],                               '/img/outfits/outfit-w9.png',  'Women', 92),
  L('outfit-w10', 'Satin Slip Date Night Gown',       'date',    ['Date', 'Glamour', 'Evening'],           ['w-jewel-1', 'w-jewel-4', 'w-jewel-2', 'w-other-2'],              '/img/outfits/outfit-w10.png', 'Women', 96),
  L('outfit-w11', 'Cozy Cashmere Winter Layering',    'winter',  ['Winter', 'Warmth', 'Layered'],          ['w-shirt-4', 'w-pant-1', 'w-other-3'],                            '/img/outfits/outfit-w11.png', 'Women', 93),
  L('outfit-w12', 'Festive Banarasi Silk Saree',      'festive', ['Festive', 'Traditional', 'Celebration'],['w-jewel-1', 'w-jewel-4', 'w-jewel-3', 'w-jewel-2'],              '/img/outfits/outfit-w12.png', 'Women', 97),
  L('outfit-w13', 'High-Performance Activewear Set',  'gym',     ['Sporty', 'Workout', 'Athletic'],        ['w-acc-1', 'w-other-2'],                                          '/img/outfits/outfit-w13.png', 'Women', 98),
  L('outfit-w14', 'Pastel Floral Summer Sundress',    'brunch',  ['Brunch', 'Casual', 'Summery'],          ['w-acc-3', 'w-jewel-1', 'w-other-2'],                             '/img/outfits/outfit-w14.png', 'Women', 93),
  L('outfit-w15', 'Deep Green Anarkali Kurta Set',    'festive', ['Festive', 'Ethnic', 'Traditional'],     ['w-jewel-4', 'w-jewel-1', 'w-other-2'],                           '/img/outfits/outfit-w15.png', 'Women', 96),
  L('outfit-w16', 'Chic Trench Coat Office Look',     'office',  ['Office', 'Formal', 'Smart'],            ['w-shirt-1', 'w-acc-1', 'w-other-2'],                             '/img/outfits/outfit-w16.png', 'Women', 94),
  L('outfit-w17', 'Sangeet Night Sequin Lehenga',     'party',   ['Party', 'Wedding', 'Sangeet', 'Glam'], ['w-jewel-4', 'w-jewel-2', 'w-jewel-3', 'w-jewel-1'],              '/img/outfits/outfit-w17.png', 'Women', 98),
  L('outfit-w18', 'Cream Minimalist Kurti Palazzo',   'casual',  ['Casual', 'Ethnic', 'Minimal'],          ['w-jewel-4', 'w-jewel-3'],                                        '/img/outfits/outfit-w18.png', 'Women', 91),
  L('outfit-w19', 'Luxe Airport Travel OOTD',         'travel',  ['Travel', 'Airport', 'Chic'],            ['w-acc-3', 'w-acc-1', 'w-other-1'],                               '/img/outfits/outfit-w19.png', 'Women', 92),
  L('outfit-w20', 'Burgundy Velvet Evening Gown',     'party',   ['Party', 'Gala', 'Evening', 'Luxury'],  ['w-jewel-1', 'w-jewel-4', 'w-jewel-2', 'w-other-2'],              '/img/outfits/outfit-w20.png', 'Women', 97),
  L('outfit-w21', 'Rose Gold Bridal Lehenga',         'wedding', ['Wedding', 'Bridal', 'Royal', 'Luxury'],['w-jewel-1', 'w-jewel-4', 'w-jewel-3', 'w-jewel-2'],              '/img/outfits/outfit-w21.png', 'Women', 99),
  L('outfit-w22', 'Smart Casual Denim Co-ord',        'casual',  ['Casual', 'Street', 'Denim'],            ['w-other-2', 'w-acc-1', 'w-acc-3'],                               '/img/outfits/outfit-w22.png', 'Women', 90),
];

export const lookTabs = ['All Looks', 'Casual', 'Formal', 'Party', 'Traditional', 'Travel', 'Seasonal'];

const P = (id, name, price, r, n, cat, g, brand) => ({
  id, name, price, rating: r, reviews: n, cat, g, brand: brand || '',
  img: I(id),
});

/**
 * 25 Men's Shopping Products matching the 25 wardrobe luxury images without repeating
 */
export const products = [
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

export const shopCats = [
  ['Shirts',      'w-shirt-1'],
  ['Pants',       'w-pant-1'],
  ['Accessories', 'w-acc-1'],
  ['Jewelry',     'w-jewel-1'],
  ['Others',      'w-other-1'],
];

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
