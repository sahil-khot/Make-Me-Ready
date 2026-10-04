/**
 * Builds a full Unsplash image URL from a photo ID.
 * All IDs below are verified fashion/lifestyle photos from Unsplash.
 */
const U = (id, w = 540, h = 680) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/** Master image map — every key maps to a unique Unsplash photo */
export const IMG = {
  // ── Tops ──────────────────────────────────────────────────────────────────
  'white-shirt':    U('photo-1596755094514-f87e34085b2c'),  // crisp white dress shirt
  'black-polo':     U('photo-1581655353564-df123a1eb820'),  // black polo t-shirt flat lay (no human)
  'beige-sweater':  U('photo-1576566588028-4147f3842f27'),  // cosy beige knit sweater
  'green-shirt':    U('photo-1602810318383-e386cc2a3ccf'),  // olive green button-up
  'black-hoodie':   '/img/black-hoodie.jpg',                 // black pullover hoodie

  // ── Bottoms ───────────────────────────────────────────────────────────────
  'blue-jeans':     U('photo-1542272604-787c3835535d'),     // classic blue denim jeans
  'black-trousers': U('photo-1473966968600-fa801b869a1a'),  // slim black dress trousers
  'beige-chinos':   U('photo-1567401893414-76b7b1e5a7a5'),  // khaki/beige chinos
  'grey-cargo':     U('photo-1624378439575-d8705ad7ae80'),  // grey cargo pants
  'black-shorts':   '/img/black-shorts.jpg',                 // black athletic shorts

  // ── Outerwear ─────────────────────────────────────────────────────────────
  'denim-jacket':   U('photo-1551537482-f2075a1d41f2'),     // light-wash denim jacket
  'black-blazer':   U('photo-1594938298603-c8148c4dae35'),  // fitted black suit blazer
  'leather-jacket': U('photo-1551028719-00167b16eac5'),     // black biker leather jacket
  'bomber-jacket':  '/img/bomber-jacket.jpg',                // olive bomber jacket
  'puffer-jacket':  U('photo-1545594861-3bef43ff2fc8'),     // black quilted down puffer jacket

  // ── Shoes ─────────────────────────────────────────────────────────────────
  'white-sneakers': U('photo-1600269452121-4f2416e55c28'),  // white leather sneakers
  'black-sneakers': U('photo-1542291026-7eec264c27ff'),     // black Nike Air sneakers
  'formal-shoes':   U('photo-1543163521-1bf539c55dd2'),     // classic brown oxford shoes
  'sports-shoes':   U('photo-1491553895911-0055eca6402d'),  // running / sports shoes
  'chelsea-boots':  '/img/chelsea-boots.jpg',                // brown suede chelsea boots

  // ── Accessories ───────────────────────────────────────────────────────────
  'watch':          U('photo-1523275335684-37898b6baf30', 500, 500),  // luxury wristwatch
  'belt':           '/img/belt.jpg',                                   // leather belt
  'sunglasses':     U('photo-1572635196237-14b3f281503f', 500, 500),  // stylish sunglasses
  'cap':            U('photo-1588850561407-ed78c282e89b', 500, 500),  // white baseball cap
  'wallet':         '/img/wallet.jpg',                                 // bifold leather wallet

  // ── Jewelry ───────────────────────────────────────────────────────────────
  'chain':          U('photo-1611591437281-460bfbe1220a', 500, 500),  // gold chain necklace
  'ring':           U('photo-1605100804763-247f67b3557e', 500, 500),  // elegant gold ring
  'bracelet':       '/img/bracelet.jpg',                               // gold chain bracelet
  'earrings':       U('photo-1615655406736-b37c4fabf923', 500, 500),  // gold hoop earrings
  'pendant':        U('photo-1599643478518-a784e5dc4c8f', 500, 500),  // minimal pendant

  // ── Occasions ─────────────────────────────────────────────────────────────
  'wedding':        '/img/occ-wedding.jpg',
  'college':        '/img/occ-college.jpg',
  'office':         '/img/occ-office.jpg',
  'date':           '/img/occ-date.jpg',
  'party':          '/img/occ-party.jpg',
  'travel':         '/img/occ-travel.jpg',
  'casual':         '/img/casual.jpg',                       // verified local relaxed casual day outfit
  'gym':            U('photo-1534438327276-14e5300c3a48', 700, 520),  // athletic fitness performance wear
  'brunch':         U('photo-1561758033-7e924f619b47', 700, 520),  // brunch cafe aesthetic outfit
  'family':         U('photo-1583391733956-3750e0ff4e8b', 700, 520),  // rich traditional family attire
  'beach':          U('photo-1507525428034-b723cf961d3e', 700, 520),  // breezy beach resort wear
  'mountain':       '/img/mountain.jpg',
  'city':           U('photo-1477959858617-67f85cf4f1df', 700, 520),  // modern urban street style
  'international':  U('photo-1436491865332-7a61a109cc05', 700, 520),  // airport travel fashion
  'summer':         U('photo-1537640538966-79f369143f8f', 700, 520),  // breathable summer style
  'monsoon':        '/img/monsoon.jpg',                      // stylish wet-weather trench style
  'winter':         U('photo-1418985991508-e47386d96a71', 700, 520),  // warm layered winter outerwear
  'festive':        U('photo-1514222709107-a180c68d72b4', 700, 520),  // festive celebration attire
  'interview':      U('photo-1487222477894-8943e31ef7b2', 700, 520),  // sharp corporate interview attire
  'concert':        U('photo-1540039155733-5bb30b53aa14', 700, 520),  // edgy music concert outfit
  'religious':      U('photo-1517483000871-1dbf64a6e1c6', 700, 520),  // traditional modest ceremonial attire

  // ── Products ──────────────────────────────────────────────────────────────
  'linen-shirt':      U('photo-1620012253295-c15cc3e65df4'),   // linen button shirt
  'tailored-trouser': U('photo-1614252235316-8c857d38b5f4'),   // tailored trousers
  'classic-sneakers': U('photo-1539185441755-769473a23570'),   // clean white sneakers
  'chronograph':      U('photo-1546868871-7041f2a55e12', 500, 500),  // Titan chronograph watch
  'sunglasses-p':     U('photo-1508296695146-257a814070b4', 500, 500),  // Ray-Ban sunglasses
  'tshirt-p':         U('photo-1583743814966-8936f5b7be1a'),   // oversized white tshirt
  'denim-p':          U('photo-1591047139829-d91aecb6caea'),   // women's denim jacket
  'cargo-p':          U('photo-1517841905240-472988babdf9'),   // cargo pants model
  'smartwatch':       U('photo-1523395243481-163f8f6155ab', 500, 500),  // Apple/smart watch
  'necklace':         U('photo-1515562141207-7a88fb7ce338', 500, 500),  // unique diamond & gemstone necklace

  // ── UI Hero / Auth Images ─────────────────────────────────────────────────
  'hero-home':      '/img/hero-luxury.jpg',
  'hero-wardrobe':  '/img/hero-wardrobe-luxury.jpg',
  'hero-profile':   U('photo-1558769132-cb1aea458c5e', 1400, 700),      // luxury boutique wardrobe room
  'auth-login':     U('photo-1483985988355-763728e1935b', 900, 1200),   // women fashion shopping
  'auth-signup':    U('photo-1469334031218-e382a71b716b', 900, 1200),   // luxury fashion editorial
  'avatar':         U('photo-1534528741775-53994a69daeb', 300, 300),    // aesthetic fashion model portrait
};

/** Get a catalog image URL by key, with a safe fallback */
export const getImg = (key) =>
  IMG[key] ?? U('photo-1558618666-fcd25c85cd64');

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

const w = (cat, list, tag) =>
  list.map(([id, name, t]) => ({ id, name, cat, tag: t || tag, img: I(id) }));

export const wardrobe = [
  ...w('Tops', [
    ['white-shirt',   'White Dress Shirt'],
    ['black-polo',    'Black Polo T-Shirt'],
    ['beige-sweater', 'Beige Knit Sweater',  'Winter'],
    ['green-shirt',   'Olive Green Shirt'],
    ['black-hoodie',  'Black Hoodie'],
  ], 'Casual'),
  ...w('Bottoms', [
    ['blue-jeans',     'Classic Blue Jeans'],
    ['black-trousers', 'Black Dress Trousers', 'Formal'],
    ['beige-chinos',   'Beige Chinos'],
    ['grey-cargo',     'Grey Cargo Pants'],
    ['black-shorts',   'Black Athletic Shorts'],
  ], 'Casual'),
  ...w('Outerwear', [
    ['denim-jacket',   'Denim Jacket'],
    ['black-blazer',   'Black Blazer',    'Formal'],
    ['leather-jacket', 'Leather Jacket'],
    ['bomber-jacket',  'Bomber Jacket'],
    ['puffer-jacket',  'Puffer Jacket',   'Winter'],
  ], 'Casual'),
  ...w('Shoes', [
    ['white-sneakers', 'White Sneakers'],
    ['black-sneakers', 'Black Sneakers'],
    ['formal-shoes',   'Oxford Formal Shoes', 'Formal'],
    ['sports-shoes',   'Running Shoes',        'Sports'],
    ['chelsea-boots',  'Chelsea Boots',         'Formal'],
  ], 'Casual'),
  ...w('Accessories', [
    ['watch',          'Luxury Watch'],
    ['belt',           'Leather Belt'],
    ['sunglasses',     'Sunglasses'],
    ['cap',            'Baseball Cap'],
    ['wallet',         'Bifold Leather Wallet'],
  ], 'Accessory'),
  ...w('Jewelry', [
    ['chain',    'Gold Chain'],
    ['ring',     'Gold Ring'],
    ['bracelet', 'Chain Bracelet'],
    ['earrings', 'Gold Hoop Earrings'],
    ['pendant',  'Minimal Pendant'],
  ], 'Jewelry'),
];

export const cats = ['Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories', 'Jewelry'];

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
  L('outfit-1',  'Camel Blazer Smart Casual',        'casual',  ['Casual', 'Smart', 'Autumn'],           ['black-blazer', 'white-shirt', 'beige-chinos', 'watch', 'white-sneakers'], '/img/outfits/outfit-1.png', 'Men', 95),
  L('outfit-2',  'Romantic Candlelight Dinner',      'date',    ['Date', 'Evening', 'Minimal'],          ['white-shirt', 'beige-chinos', 'watch', 'white-sneakers'],                  '/img/outfits/outfit-2.png', 'Men', 88),
  L('outfit-3',  'Urban Cafe Stroll',                'casual',  ['Casual', 'Street', 'Coffee'],          ['green-shirt', 'white-shirt', 'beige-chinos', 'watch', 'white-sneakers'],  '/img/outfits/outfit-3.png', 'Men', 90),
  L('outfit-4',  'Ivory Chikankari Festive Kurta',   'festive', ['Festive', 'Traditional', 'Diwali'],    ['white-shirt', 'beige-chinos', 'formal-shoes', 'watch'],                     '/img/outfits/outfit-4.png', 'Men', 93),
  L('outfit-5',  'Gym Pro All-Black Performance',    'gym',     ['Sporty', 'Workout', 'Athletic'],       ['black-polo', 'grey-cargo', 'sports-shoes', 'watch'],                        '/img/outfits/outfit-5.png', 'Men', 94),
  L('outfit-6',  'Airport Ready Jetsetter',          'travel',  ['Travel', 'Airport', 'Streetwear'],     ['black-hoodie', 'blue-jeans', 'watch', 'white-sneakers'],                   '/img/outfits/outfit-6.png', 'Men', 91),
  L('outfit-7',  'Nightclub Lounge Athleisure',      'gym',     ['Athletic', 'Fitness', 'Modern'],       ['black-polo', 'black-shorts', 'sports-shoes', 'watch'],                     '/img/outfits/outfit-7.jpg', 'Men', 98),
  L('outfit-8',  'Executive Power Suit',             'office',  ['Formal', 'Office', 'Corporate'],       ['black-blazer', 'white-shirt', 'black-trousers', 'formal-shoes', 'watch'],   '/img/outfits/outfit-8.png', 'Men', 92),
  L('outfit-9',  'Mediterranean Beach Resort',       'beach',   ['Summer', 'Beach', 'Resort'],           ['green-shirt', 'black-shorts', 'sunglasses', 'watch', 'white-sneakers'],    '/img/outfits/outfit-9.png', 'Men', 93),
  L('outfit-10', 'Urban Crossbody Athleisure',       'casual',  ['Streetwear', 'Casual', 'Sporty'],       ['black-polo', 'grey-cargo', 'white-sneakers', 'watch'],                     '/img/outfits/outfit-10.jpg', 'Men', 98),
  L('outfit-11', 'Imperial Ivory Groom Sherwani',     'wedding', ['Wedding', 'Royal', 'Traditional'],     ['white-shirt', 'beige-chinos', 'formal-shoes', 'watch'],                     '/img/outfits/outfit-11.png', 'Men', 95),
  L('outfit-12', 'Emerald 3-Piece Tuxedo',           'wedding', ['Wedding', 'Reception', 'Luxury'],      ['black-blazer', 'white-shirt', 'black-trousers', 'formal-shoes', 'watch'],   '/img/outfits/outfit-12.png', 'Men', 93),
  L('outfit-13', 'Sage Green Festive Kurta Ensemble', 'festive', ['Festive', 'Traditional', 'Silk'],      ['white-shirt', 'beige-chinos', 'formal-shoes', 'watch'],                     '/img/outfits/outfit-13.png', 'Men', 94),
  L('outfit-14', 'Gallery Art Curator Chic',         'office',  ['Office', 'Smart Casual', 'Creative'],   ['black-blazer', 'white-shirt', 'blue-jeans', 'watch', 'white-sneakers'],     '/img/outfits/outfit-14.jpg', 'Men', 98),
  L('outfit-15', 'Royal Black & Gold Indo-Western',  'wedding', ['Wedding', 'Sangeet', 'Royal'],         ['black-blazer', 'white-shirt', 'black-trousers', 'formal-shoes', 'watch'],   '/img/outfits/outfit-15.png', 'Men', 96),
  L('outfit-16', 'Dusty Rose Pastel Sherwani',       'wedding', ['Wedding', 'Pastel', 'Celebration'],    ['white-shirt', 'beige-chinos', 'formal-shoes', 'watch'],                     '/img/outfits/outfit-16.png', 'Men', 92),
  L('outfit-17', 'Midnight Navy Satin Shawl Tuxedo', 'party',   ['Party', 'Black Tie', 'Gala'],          ['black-blazer', 'white-shirt', 'black-trousers', 'formal-shoes', 'watch'],   '/img/outfits/outfit-17.png', 'Men', 97),
  L('outfit-18', 'Olive Utility Overshirt & Cargos', 'casual',  ['Streetwear', 'Casual', 'Everyday'],    ['green-shirt', 'white-shirt', 'grey-cargo', 'watch', 'white-sneakers'],     '/img/outfits/outfit-18.png', 'Men', 95),
  L('outfit-19', 'Mocha Linen Minimalist Cafe',      'date',    ['Casual', 'Date', 'Minimal'],           ['beige-sweater', 'white-shirt', 'beige-chinos', 'watch', 'white-sneakers'], '/img/outfits/outfit-19.png', 'Men', 93),
  L('outfit-20', 'Autumn Quarter-Zip Knitwear',      'winter',  ['Autumn', 'Casual', 'Campus'],          ['beige-sweater', 'white-shirt', 'grey-cargo', 'watch', 'white-sneakers'],    '/img/outfits/outfit-20.png', 'Men', 94),

  // ── 22 Curated High-Fashion Women Looks (Local Outfit Images) ──
  L('outfit-w1',  'Glam Black Night-Out Mini',        'party',   ['Party', 'Evening', 'Glam'],            ['necklace', 'earrings', 'watch'],                                            '/img/outfits/outfit-w1.png',  'Women', 97),
  L('outfit-w2',  'Cosy Heart Pyjama Set',            'casual',  ['Casual', 'Loungewear', 'Home'],         ['pendant', 'ring'],                                                          '/img/outfits/outfit-w2.png',  'Women', 93),
  L('outfit-w3',  'Sky Blue Flowy Maxi Gown',         'date',    ['Date', 'Romantic', 'Elegant'],          ['necklace', 'earrings', 'watch'],                                            '/img/outfits/outfit-w3.png',  'Women', 96),
  L('outfit-w4',  'Brown Ribbed Top & Jeans OOTD',   'casual',  ['Casual', 'Everyday', 'Street'],         ['watch', 'bracelet'],                                                        '/img/outfits/outfit-w4.png',  'Women', 94),
  L('outfit-w5',  'Blush Floral Lehenga Choli',       'wedding', ['Wedding', 'Traditional', 'Festive'],    ['earrings', 'ring', 'necklace'],                                             '/img/outfits/outfit-w5.png',  'Women', 98),
  L('outfit-w6',  'Emerald Royal Velvet Lehenga',     'wedding', ['Wedding', 'Traditional', 'Royal'],      ['necklace', 'earrings', 'bracelet', 'ring'],                                 '/img/outfits/outfit-w6.png',  'Women', 97),
  L('outfit-w7',  'Modern Ivory Blazer & Slip Dress', 'office',  ['Formal', 'Chic', 'Corporate'],          ['black-blazer', 'white-shirt', 'watch', 'formal-shoes'],                     '/img/outfits/outfit-w7.png',  'Women', 94),
  L('outfit-w8',  'Boho Sunset Resort Maxi Dress',    'beach',   ['Summer', 'Vacation', 'Resort'],         ['sunglasses', 'necklace', 'white-sneakers'],                                 '/img/outfits/outfit-w8.png',  'Women', 95),
  L('outfit-w9',  'Varsity Streetwear Oversized Fit', 'casual',  ['Streetwear', 'Casual', 'Trendy'],       ['black-hoodie', 'cap', 'white-sneakers'],                                    '/img/outfits/outfit-w9.png',  'Women', 92),
  L('outfit-w10', 'Satin Slip Date Night Gown',       'date',    ['Date', 'Glamour', 'Evening'],           ['necklace', 'earrings', 'ring', 'formal-shoes'],                             '/img/outfits/outfit-w10.png', 'Women', 96),
  L('outfit-w11', 'Cozy Cashmere Winter Layering',    'winter',  ['Winter', 'Warmth', 'Layered'],          ['beige-sweater', 'blue-jeans', 'chelsea-boots'],                             '/img/outfits/outfit-w11.png', 'Women', 93),
  L('outfit-w12', 'Festive Banarasi Silk Saree',      'festive', ['Festive', 'Traditional', 'Celebration'],['necklace', 'earrings', 'bracelet', 'ring'],                                 '/img/outfits/outfit-w12.png', 'Women', 97),
  L('outfit-w13', 'High-Performance Activewear Set',  'gym',     ['Sporty', 'Workout', 'Athletic'],        ['sports-shoes', 'watch'],                                                    '/img/outfits/outfit-w13.png', 'Women', 98),
  L('outfit-w14', 'Pastel Floral Summer Sundress',    'brunch',  ['Brunch', 'Casual', 'Summery'],          ['sunglasses', 'necklace', 'white-sneakers'],                                 '/img/outfits/outfit-w14.png', 'Women', 93),
  L('outfit-w15', 'Deep Green Anarkali Kurta Set',    'festive', ['Festive', 'Ethnic', 'Traditional'],     ['earrings', 'necklace', 'formal-shoes'],                                     '/img/outfits/outfit-w15.png', 'Women', 96),
  L('outfit-w16', 'Chic Trench Coat Office Look',     'office',  ['Office', 'Formal', 'Smart'],            ['black-blazer', 'watch', 'formal-shoes'],                                    '/img/outfits/outfit-w16.png', 'Women', 94),
  L('outfit-w17', 'Sangeet Night Sequin Lehenga',     'party',   ['Party', 'Wedding', 'Sangeet', 'Glam'], ['earrings', 'ring', 'bracelet', 'necklace'],                                  '/img/outfits/outfit-w17.png', 'Women', 98),
  L('outfit-w18', 'Cream Minimalist Kurti Palazzo',   'casual',  ['Casual', 'Ethnic', 'Minimal'],          ['earrings', 'bracelet'],                                                     '/img/outfits/outfit-w18.png', 'Women', 91),
  L('outfit-w19', 'Luxe Airport Travel OOTD',         'travel',  ['Travel', 'Airport', 'Chic'],            ['sunglasses', 'watch', 'white-sneakers'],                                    '/img/outfits/outfit-w19.png', 'Women', 92),
  L('outfit-w20', 'Burgundy Velvet Evening Gown',     'party',   ['Party', 'Gala', 'Evening', 'Luxury'],  ['necklace', 'earrings', 'ring', 'formal-shoes'],                             '/img/outfits/outfit-w20.png', 'Women', 97),
  L('outfit-w21', 'Rose Gold Bridal Lehenga',         'wedding', ['Wedding', 'Bridal', 'Royal', 'Luxury'],['necklace', 'earrings', 'bracelet', 'ring'],                                  '/img/outfits/outfit-w21.png', 'Women', 99),
  L('outfit-w22', 'Smart Casual Denim Co-ord',        'casual',  ['Casual', 'Street', 'Denim'],            ['white-sneakers', 'watch', 'sunglasses'],                                    '/img/outfits/outfit-w22.png', 'Women', 90),
];

export const lookTabs = ['All Looks', 'Casual', 'Formal', 'Party', 'Traditional', 'Travel', 'Seasonal'];

const P = (id, name, price, r, n, cat, g, brand) => ({
  id, name, price, rating: r, reviews: n, cat, g, brand: brand || '',
  img: I(id),
});

export const products = [
  P('linen-shirt',      'Premium Linen Shirt',        1999, 4.5, '1.2k', 'Tops',        'Men',   'ZARA'),
  P('tailored-trouser', 'Tailored Slim Trouser',       2499, 4.4, '890',  'Bottoms',     'Men',   'H&M'),
  P('classic-sneakers', 'Classic White Sneakers',      3299, 4.6, '2.1k', 'Shoes',       'Men',   'NIKE'),
  P('chronograph',      'Titan Chronograph Watch',     8999, 4.7, '1.4k', 'Accessories', 'Men',   'TITAN'),
  P('sunglasses-p',     'Ray-Ban Wayfarer',            7499, 4.6, '990',  'Accessories', 'Women', 'Ray-Ban'),
  P('tshirt-p',         'Oversized Drop-Shoulder Tee', 1499, 4.3, '640',  'Tops',        'Men',   'H&M'),
  P('denim-p',          'Relaxed Denim Jacket',        2999, 4.5, '720',  'Outerwear',   'Women', 'Levi\'s'),
  P('cargo-p',          'Utility Cargo Pants',         2199, 4.4, '510',  'Bottoms',     'Men',   'adidas'),
  P('smartwatch',       'Fossil Gen 6 Smartwatch',     4999, 4.6, '1.1k', 'Accessories', 'Women', 'FOSSIL'),
  P('necklace',         'Minimal Gold Necklace',       1299, 4.5, '430',  'Jewelry',     'Women', 'Malabar'),
];

export const shopCats = [
  ['Tops',       'linen-shirt'],
  ['Bottoms',    'tailored-trouser'],
  ['Outerwear',  'denim-p'],
  ['Shoes',      'classic-sneakers'],
  ['Watches',    'chronograph'],
  ['Accessories','sunglasses-p'],
  ['Jewelry',    'necklace'],
  ['Bags',       'cap'],
];

export const brands = ['ZARA', 'H&M', 'NIKE', 'adidas', 'PUMA', 'FOSSIL', 'TITAN', 'boAt', 'Levi\'s', 'Ray-Ban'];

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
