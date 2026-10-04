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

const L = (id, title, occName, tags, items, customImg) => ({
  id,
  title,
  occ: occName,
  tags,
  img: customImg || I(occName),
  items,
});

export const looks = [
  // ── Casual Looks ──
  L('casual-day',        'Casual Day Look',        'casual',      ['Casual', 'Everyday'],     ['white-shirt',   'beige-chinos',   'white-sneakers', 'watch',        'sunglasses'], U('photo-1552374196-1ab2a1c593e8', 700, 520)),
  L('casual-relaxed',    'Relaxed Weekend Fit',    'casual',      ['Casual', 'Comfort'],      ['black-polo',    'blue-jeans',     'white-sneakers', 'belt',         'sunglasses'], U('photo-1516257984-b1b4d707412e', 700, 520)),
  L('casual-denim',      'Classic Denim Everyday', 'casual',      ['Casual', 'Timeless'],     ['denim-jacket',  'white-shirt',    'blue-jeans',     'black-sneakers', 'watch'],      '/img/casual.jpg'),

  // ── College Looks ──
  L('college-campus',    'Campus Cool',            'college',     ['College', 'Youth'],       ['black-hoodie',  'blue-jeans',     'white-sneakers', 'cap',          'watch'],      '/img/occ-college.jpg'),
  L('college-varsity',   'Varsity Streetwear',     'college',     ['College', 'Trendy'],      ['denim-jacket',  'black-polo',     'grey-cargo',     'black-sneakers', 'chain'],      U('photo-1539109136881-3be0616acf4b', 700, 520)),
  L('college-smart',     'Smart Campus Casual',    'college',     ['College', 'Clean'],       ['white-shirt',   'beige-chinos',   'white-sneakers', 'watch',        'sunglasses'], U('photo-1507679799987-c73779587ccf', 700, 520)),

  // ── Office Looks ──
  L('office-pro',        'Executive Formal Suit',  'office',      ['Office', 'Formal'],       ['black-blazer',  'white-shirt',    'black-trousers', 'formal-shoes', 'watch'],      '/img/occ-office.jpg'),
  L('office-smart-casual','Smart Business Casual', 'office',      ['Office', 'Semi-Formal'],  ['green-shirt',   'beige-chinos',   'chelsea-boots',  'belt',         'watch'],      U('photo-1507679799987-c73779587ccf', 700, 520)),
  L('office-monochrome', 'Modern Minimalist Office','office',     ['Office', 'Sharp'],        ['black-blazer',  'black-polo',     'black-trousers', 'formal-shoes', 'belt'],       '/img/office.jpg'),

  // ── Wedding Looks ──
  L('wedding-royal',     'Royal Wedding Grandeur', 'wedding',     ['Wedding', 'Traditional'], ['black-blazer',  'white-shirt',    'black-trousers', 'formal-shoes', 'watch'],      '/img/occ-wedding.jpg'),
  L('wedding-reception', 'Celebration Glam',       'wedding',     ['Wedding', 'Reception'],   ['black-blazer',  'white-shirt',    'black-trousers', 'formal-shoes', 'chain'],      U('photo-1583391733956-3750e0ff4e8b', 700, 520)),
  L('wedding-chic',      'Contemporary Reception', 'wedding',     ['Wedding', 'Elegant'],     ['white-shirt',   'beige-chinos',   'chelsea-boots',  'watch',        'ring'],       U('photo-1519741497674-611481863552', 700, 520)),

  // ── Date Looks ──
  L('dinner-date',       'Romantic Dinner Date',   'date',        ['Date', 'Trendy'],         ['green-shirt',   'black-trousers', 'white-sneakers', 'watch',        'chain'],      '/img/occ-date.jpg'),
  L('date-sophisticated','Sophisticated Evening',  'date',        ['Date', 'Chic'],           ['black-polo',    'beige-chinos',   'chelsea-boots',  'watch',        'ring'],       U('photo-1506794778202-cad84cf45f1d', 700, 520)),
  L('date-leather',      'Chic Night Out',         'date',        ['Date', 'Bold'],           ['leather-jacket', 'white-shirt',   'black-trousers', 'black-sneakers', 'watch'],      U('photo-1534528741775-53994a69daeb', 700, 520)),

  // ── Party Looks ──
  L('party-vip',         'VIP Nightclub Look',     'party',       ['Party', 'Nightlife'],     ['leather-jacket', 'black-polo',     'black-trousers', 'chelsea-boots', 'chain'],      '/img/occ-party.jpg'),
  L('party-urban',       'Downtown Clubbing Fit',  'party',       ['Party', 'Urban'],         ['bomber-jacket', 'white-shirt',    'grey-cargo',     'black-sneakers', 'chain'],      U('photo-1492562080023-ab3db95bfbce', 700, 520)),
  L('party-statement',   'Midnight Party Statement','party',      ['Party', 'Statement'],     ['black-blazer',  'black-hoodie',   'black-trousers', 'white-sneakers', 'watch'],      '/img/party.jpg'),

  // ── Mountain Looks ──
  L('mountain-trip',     'Alpine Trail Ready',     'mountain',    ['Travel', 'Outdoor'],      ['puffer-jacket', 'grey-cargo',     'sports-shoes',   'cap',          'sunglasses'], '/img/mountain.jpg'),
  L('mountain-trek',     'Summit Explorer',        'mountain',    ['Travel', 'Adventure'],    ['green-shirt',   'grey-cargo',     'sports-shoes',   'watch',        'sunglasses'], U('photo-1501555088652-021faa106b9b', 700, 520)),
  L('mountain-knit',     'Cozy Highland Layering', 'mountain',    ['Travel', 'Warmth'],       ['beige-sweater', 'blue-jeans',     'chelsea-boots',  'belt',         'cap'],        U('photo-1464822759023-fed622ff2c3b', 700, 520)),

  // ── Seasonal & Special Looks ──
  L('festive-trad',      'Festive Celebration',    'festive',     ['Traditional', 'Festive'], ['white-shirt',   'beige-chinos',   'formal-shoes',   'watch',        'belt'],       '/img/festive.jpg'),
  L('beach-vac',         'Breezy Beach Resort',    'beach',       ['Travel', 'Summer'],       ['white-shirt',   'black-shorts',   'white-sneakers', 'sunglasses',   'cap'],        '/img/beach.jpg'),
  L('winter-layers',     'Winter Down Warmth',     'winter',      ['Winter', 'Layered'],      ['puffer-jacket', 'black-hoodie',   'black-trousers', 'chelsea-boots', 'belt'],       '/img/winter.jpg'),
  L('gym-fit',           'Athletic Performance',   'gym',         ['Sporty', 'Gym'],          ['black-polo',    'black-shorts',   'sports-shoes',   'watch',        'cap'],        '/img/gym.jpg'),
  L('street-style',      'Urban Streetwear',       'city',        ['Streetwear', 'Trendy'],   ['black-hoodie',  'grey-cargo',     'black-sneakers', 'cap',          'chain'],      '/img/city.jpg'),
  L('summer-ess',        'Summer Linen Breeze',    'summer',      ['Summer', 'Minimal'],      ['white-shirt',   'beige-chinos',   'white-sneakers', 'sunglasses',   'belt'],       '/img/summer.jpg'),
  L('monsoon-ready',     'Monsoon Weather Shield', 'monsoon',     ['Monsoon', 'Practical'],   ['denim-jacket',  'black-polo',     'blue-jeans',     'black-sneakers', 'watch'],      '/img/monsoon.jpg'),
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
