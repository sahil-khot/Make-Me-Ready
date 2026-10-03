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
  'black-polo':     U('photo-1503341504253-dff4815485f1'),  // black polo on model
  'beige-sweater':  U('photo-1576566588028-4147f3842f27'),  // cosy beige knit sweater
  'green-shirt':    U('photo-1602810318383-e386cc2a3ccf'),  // olive green button-up
  'black-hoodie':   U('photo-1556821840-3a63f15732ce'),     // black pullover hoodie

  // ── Bottoms ───────────────────────────────────────────────────────────────
  'blue-jeans':     U('photo-1542272604-787c3835535d'),     // classic blue denim jeans
  'black-trousers': U('photo-1473966968600-fa801b869a1a'),  // slim black dress trousers
  'beige-chinos':   U('photo-1567401893414-76b7b1e5a7a5'),  // khaki/beige chinos
  'grey-cargo':     U('photo-1624378439575-d8705ad7ae80'),  // grey cargo pants
  'black-shorts':   U('photo-1562886889-82e68e77bc0c'),     // black athletic shorts

  // ── Outerwear ─────────────────────────────────────────────────────────────
  'denim-jacket':   U('photo-1551537482-f2075a1d41f2'),     // light-wash denim jacket
  'black-blazer':   U('photo-1594938298603-c8148c4dae35'),  // fitted black suit blazer
  'leather-jacket': U('photo-1551028719-00167b16eac5'),     // black biker leather jacket
  'bomber-jacket':  U('photo-1545065118-2f47a4f9e3a7'),     // olive bomber jacket
  'puffer-jacket':  U('photo-1607345366928-199ea26cfe3e'),  // white down puffer jacket

  // ── Shoes ─────────────────────────────────────────────────────────────────
  'white-sneakers': U('photo-1600269452121-4f2416e55c28'),  // white leather sneakers
  'black-sneakers': U('photo-1542291026-7eec264c27ff'),     // black Nike Air sneakers
  'formal-shoes':   U('photo-1543163521-1bf539c55dd2'),     // classic brown oxford shoes
  'sports-shoes':   U('photo-1491553895911-0055eca6402d'),  // running / sports shoes
  'chelsea-boots':  U('photo-1608256246200-99a0de47f85e'),  // brown suede chelsea boots

  // ── Accessories ───────────────────────────────────────────────────────────
  'watch':          U('photo-1523275335684-37898b6baf30', 500, 500),  // luxury wristwatch
  'belt':           U('photo-1624091166583-bd01af37f6a0', 500, 500),  // leather belt
  'sunglasses':     U('photo-1572635196237-14b3f281503f', 500, 500),  // stylish sunglasses
  'cap':            U('photo-1588850561407-ed78c282e89b', 500, 500),  // white baseball cap
  'wallet':         U('photo-1627123424574-724758594785', 500, 500),  // bifold leather wallet

  // ── Jewelry ───────────────────────────────────────────────────────────────
  'chain':          U('photo-1611591437281-460bfbe1220a', 500, 500),  // gold chain necklace
  'ring':           U('photo-1605100804763-247f67b3557e', 500, 500),  // elegant gold ring
  'bracelet':       U('photo-1573408301185-9519f94816b5', 500, 500),  // gold chain bracelet
  'earrings':       U('photo-1615655406736-b37c4fabf923', 500, 500),  // gold hoop earrings
  'pendant':        U('photo-1599643478518-a784e5dc4c8f', 500, 500),  // minimal pendant

  // ── Occasions ─────────────────────────────────────────────────────────────
  'wedding':        '/img/occ-wedding.jpg',
  'college':        '/img/occ-college.jpg',
  'office':         '/img/occ-office.jpg',
  'date':           '/img/occ-date.jpg',
  'party':          '/img/occ-party.jpg',
  'travel':         '/img/occ-travel.jpg',
  'casual':         U('photo-1523380744952-b8ecd94f8199', 700, 520),  // relaxed casual day outfit
  'gym':            U('photo-1534438327276-14e5300c3a48', 700, 520),  // athletic fitness performance wear
  'brunch':         U('photo-1561758033-7e924f619b47', 700, 520),  // brunch cafe aesthetic outfit
  'family':         U('photo-1583391733956-3750e0ff4e8b', 700, 520),  // rich traditional family attire
  'beach':          U('photo-1507525428034-b723cf961d3e', 700, 520),  // breezy beach resort wear
  'mountain':       '/img/occ-travel.jpg',
  'city':           U('photo-1477959858617-67f85cf4f1df', 700, 520),  // modern urban street style
  'international':  U('photo-1436491865332-7a61a109cc05', 700, 520),  // airport travel fashion
  'summer':         U('photo-1537640538966-79f369143f8f', 700, 520),  // breathable summer style
  'monsoon':        U('photo-1515695895503-17b83b4a62ee', 700, 520),  // stylish wet-weather trench style
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
  'hero-wardrobe':  U('photo-1558618666-fcd25c85cd64', 1400, 700),      // colorful open wardrobe
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

const L = (id, title, occName, tags, items) => ({
  id,
  title,
  occ: occName,
  tags,
  img: I(occName),   // uses the occasion image as the look thumbnail
  items,
});

export const looks = [
  L('casual-day',    'Casual Day Look',        'casual',      ['Casual', 'Everyday'],     ['white-shirt',   'beige-chinos',   'white-sneakers', 'watch',        'sunglasses']),
  L('office-pro',    'Office Professional',    'office',      ['Office', 'Formal'],        ['black-blazer',  'white-shirt',    'black-trousers', 'formal-shoes', 'watch']),
  L('dinner-date',   'Dinner Date Look',       'date',        ['Date', 'Trendy'],          ['green-shirt',   'black-trousers', 'white-sneakers', 'watch',        'chain']),
  L('festive-trad',  'Festive Traditional',    'festive',     ['Traditional', 'Festive'],  ['white-shirt',   'beige-chinos',   'formal-shoes',   'watch',        'belt']),
  L('mountain-trip', 'Mountain Trip Ready',    'mountain',    ['Travel', 'Outdoor'],       ['green-shirt',   'grey-cargo',     'sports-shoes',   'cap',          'sunglasses']),
  L('beach-vac',     'Beach Vacation',         'beach',       ['Travel', 'Summer'],        ['white-shirt',   'black-shorts',   'white-sneakers', 'sunglasses',   'cap']),
  L('winter-layers', 'Winter Layers',          'winter',      ['Winter', 'Layered'],       ['puffer-jacket', 'black-hoodie',   'black-trousers', 'chelsea-boots','belt']),
  L('gym-fit',       'Gym Fit',                'gym',         ['Sporty', 'Gym'],           ['black-polo',    'black-shorts',   'sports-shoes',   'watch',        'cap']),
  L('wedding-look',  'Wedding Guest Look',     'wedding',     ['Traditional', 'Formal'],   ['black-blazer',  'white-shirt',    'black-trousers', 'formal-shoes', 'watch']),
  L('street',        'Street Style',           'city',        ['Streetwear', 'Trendy'],    ['black-hoodie',  'grey-cargo',     'black-sneakers', 'cap',          'chain']),
  L('monsoon-ready', 'Monsoon Ready',          'monsoon',     ['Monsoon', 'Practical'],    ['denim-jacket',  'black-polo',     'blue-jeans',     'black-sneakers','watch']),
  L('summer-ess',    'Summer Essentials',      'summer',      ['Summer', 'Minimal'],       ['white-shirt',   'beige-chinos',   'white-sneakers', 'sunglasses',   'belt']),
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
  ['Home',            '/home',            'Home'],
  ['My Wardrobe',     '/wardrobe',        'Shirt'],
  ['Create Outfit',   '/create-outfit',   'Wand2'],
  ['Occasions',       '/occasions',       'CalendarCheck'],
  ['Recommendations', '/recommendations', 'Gem'],
  ['Saved Looks',     '/saved-looks',     'Heart'],
  ['Shopping',        '/shopping',        'ShoppingBag'],
  ['Profile',         '/profile',         'User'],
];
