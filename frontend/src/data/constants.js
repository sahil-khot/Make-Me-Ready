const I = (n) => `/img/${n}.jpg`;

export const occ = (id, t, s, g) => ({ id, title: t, sub: s, group: g, img: I(id) });

export const occasions = [
  occ('wedding', 'Wedding', 'Elegant & Traditional', 'Popular'),
  occ('party', 'Party', 'Bold & Trendy', 'Popular'),
  occ('date', 'Date', 'Stylish & Confident', 'Popular'),
  occ('office', 'Office', 'Formal & Professional', 'Popular'),
  occ('casual', 'Casual Day', 'Comfortable & Effortless', 'Personal'),
  occ('gym', 'Workout / Gym', 'Sporty & Functional', 'Personal'),
  occ('brunch', 'Brunch', 'Chic & Relaxed', 'Personal'),
  occ('family', 'Family Function', 'Traditional & Classy', 'Personal'),
  occ('beach', 'Beach Vacation', 'Breezy & Stylish', 'Travel'),
  occ('mountain', 'Mountain Trip', 'Warm & Comfortable', 'Travel'),
  occ('city', 'City Travel', 'Trendy & Versatile', 'Travel'),
  occ('international', 'International Travel', 'Stylish & Global', 'Travel'),
  occ('summer', 'Summer', 'Light & Breathable', 'Seasonal'),
  occ('monsoon', 'Monsoon', 'Practical & Stylish', 'Seasonal'),
  occ('winter', 'Winter', 'Warm & Layered', 'Seasonal'),
  occ('festive', 'Festive (Diwali)', 'Traditional & Elegant', 'Seasonal'),
  occ('interview', 'Interview', 'Formal & Minimal', 'Special'),
  occ('college', 'College', 'Casual & Smart', 'Special'),
  occ('concert', 'Concert', 'Edgy & Modern', 'Special'),
  occ('religious', 'Religious Visit', 'Traditional & Modest', 'Special'),
];

const w = (cat, list, tag) =>
  list.map(([id, name, t]) => ({ id, name, cat, tag: t || tag, img: I(id) }));

export const wardrobe = [
  ...w('Tops', [
    ['white-shirt', 'White Shirt'],
    ['black-polo', 'Black Polo T-shirt'],
    ['beige-sweater', 'Beige Sweater', 'Winter'],
    ['green-shirt', 'Green Shirt'],
    ['black-hoodie', 'Black Hoodie'],
  ], 'Casual'),
  ...w('Bottoms', [
    ['blue-jeans', 'Blue Jeans'],
    ['black-trousers', 'Black Trousers', 'Formal'],
    ['beige-chinos', 'Beige Chinos'],
    ['grey-cargo', 'Grey Cargo'],
    ['black-shorts', 'Black Shorts'],
  ], 'Casual'),
  ...w('Outerwear', [
    ['denim-jacket', 'Denim Jacket'],
    ['black-blazer', 'Black Blazer', 'Formal'],
    ['leather-jacket', 'Leather Jacket', 'Formal'],
    ['bomber-jacket', 'Bomber Jacket'],
    ['puffer-jacket', 'Puffer Jacket', 'Winter'],
  ], 'Casual'),
  ...w('Shoes', [
    ['white-sneakers', 'White Sneakers'],
    ['black-sneakers', 'Black Sneakers'],
    ['formal-shoes', 'Formal Shoes', 'Formal'],
    ['sports-shoes', 'Sports Shoes', 'Sports'],
    ['chelsea-boots', 'Chelsea Boots', 'Formal'],
  ], 'Casual'),
  ...w('Accessories', [
    ['watch', 'Watch'],
    ['belt', 'Belt'],
    ['sunglasses', 'Sunglasses'],
    ['cap', 'Cap'],
    ['wallet', 'Wallet'],
  ], 'Accessory'),
  ...w('Jewelry', [
    ['chain', 'Chain'],
    ['ring', 'Ring'],
    ['bracelet', 'Bracelet'],
    ['earrings', 'Earrings'],
    ['pendant', 'Pendant'],
  ], 'Jewelry'),
];

export const cats = ['Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories', 'Jewelry'];

const L = (id, title, occName, tags, items) => ({
  id,
  title,
  occ: occName,
  tags,
  img: I(occName),
  items,
});

export const looks = [
  L('casual-day', 'Casual Day Look', 'casual', ['Casual', 'Everyday'], ['white-shirt', 'beige-chinos', 'white-sneakers', 'watch', 'sunglasses']),
  L('office-pro', 'Office Professional', 'office', ['Office', 'Formal'], ['black-blazer', 'white-shirt', 'black-trousers', 'formal-shoes', 'watch']),
  L('dinner-date', 'Dinner Date Look', 'date', ['Date', 'Trendy'], ['green-shirt', 'black-trousers', 'white-sneakers', 'watch', 'sunglasses']),
  L('festive-trad', 'Festive Traditional', 'festive', ['Traditional', 'Festive'], ['white-shirt', 'beige-chinos', 'formal-shoes', 'watch', 'belt']),
  L('mountain-trip', 'Mountain Trip', 'mountain', ['Travel', 'Outdoor'], ['green-shirt', 'grey-cargo', 'sports-shoes', 'cap', 'sunglasses']),
  L('beach-vac', 'Beach Vacation', 'beach', ['Travel', 'Summer'], ['white-shirt', 'black-shorts', 'white-sneakers', 'sunglasses', 'cap']),
  L('winter-layers', 'Winter Layers', 'winter', ['Winter', 'Layered'], ['puffer-jacket', 'black-hoodie', 'black-trousers', 'chelsea-boots', 'belt']),
  L('gym-fit', 'Gym Fit', 'gym', ['Sporty', 'Gym'], ['black-polo', 'black-shorts', 'sports-shoes', 'watch', 'cap']),
  L('wedding-look', 'Wedding Look', 'wedding', ['Traditional', 'Formal'], ['black-blazer', 'white-shirt', 'black-trousers', 'formal-shoes', 'watch']),
  L('street', 'Street Style', 'city', ['Streetwear', 'Trendy'], ['black-hoodie', 'grey-cargo', 'black-sneakers', 'cap', 'chain']),
  L('monsoon-ready', 'Monsoon Ready', 'monsoon', ['Monsoon', 'Practical'], ['denim-jacket', 'black-polo', 'blue-jeans', 'black-sneakers', 'watch']),
  L('summer-ess', 'Summer Essentials', 'summer', ['Summer', 'Minimal'], ['white-shirt', 'beige-chinos', 'white-sneakers', 'sunglasses', 'belt']),
];

export const lookTabs = ['All Looks', 'Casual', 'Formal', 'Party', 'Traditional', 'Travel', 'Seasonal'];

const P = (id, name, price, r, n, cat, g) => ({
  id,
  name,
  price,
  rating: r,
  reviews: n,
  cat,
  g,
  img: I(id),
});

export const products = [
  P('linen-shirt', 'Linen Shirt', 1999, 4.5, '1.2k', 'Tops', 'Men'),
  P('tailored-trouser', 'Tailored Trouser', 2499, 4.4, '890', 'Bottoms', 'Men'),
  P('classic-sneakers', 'Classic Sneakers', 3299, 4.6, '2.1k', 'Shoes', 'Men'),
  P('chronograph', 'Titan Chronograph', 8999, 4.7, '1.4k', 'Accessories', 'Men'),
  P('sunglasses-p', 'Ray-Ban Sunglasses', 7499, 4.6, '990', 'Accessories', 'Women'),
  P('tshirt-p', 'Oversized T-Shirt', 1499, 4.3, '640', 'Tops', 'Men'),
  P('denim-p', 'Denim Jacket', 2999, 4.5, '720', 'Tops', 'Women'),
  P('cargo-p', 'Cargo Pants', 2199, 4.4, '510', 'Bottoms', 'Men'),
  P('smartwatch', 'Smart Watch', 4999, 4.6, '1.1k', 'Accessories', 'Women'),
  P('necklace', 'Minimal Necklace', 1299, 4.5, '430', 'Accessories', 'Women'),
];

export const shopCats = [
  ['Tops', 'linen-shirt'],
  ['Bottoms', 'tailored-trouser'],
  ['Outerwear', 'denim-p'],
  ['Shoes', 'classic-sneakers'],
  ['Watches', 'chronograph'],
  ['Accessories', 'sunglasses-p'],
  ['Jewelry', 'necklace'],
  ['Bags', 'cap'],
];

export const brands = ['ZARA', 'H&M', 'NIKE', 'adidas', 'PUMA', 'FOSSIL', 'TITAN', 'boAt'];

export const colors = [
  ['Black', '#000000'],
  ['White', '#d8d8d8'],
  ['Navy', '#1e3a6e'],
  ['Olive', '#4a5a2a'],
  ['Beige', '#d8b99a'],
  ['Brown', '#8a4b22'],
  ['Red', '#c8102e'],
  ['Pink', '#d9619b'],
  ['Purple', '#6b2fb3'],
  ['Orange', '#f59e0b'],
];

export const styles = [
  'Casual',
  'Formal',
  'Streetwear',
  'Traditional',
  'Minimal',
  'Sporty',
  'Trendy',
  'Others',
];

export const nav = [
  ['Home', '/home', 'Home'],
  ['My Wardrobe', '/wardrobe', 'Shirt'],
  ['Create Outfit', '/create-outfit', 'Wand2'],
  ['Occasions', '/occasions', 'CalendarCheck'],
  ['Recommendations', '/recommendations', 'Gem'],
  ['Saved Looks', '/saved-looks', 'Heart'],
  ['Shopping', '/shopping', 'ShoppingBag'],
  ['Profile', '/profile', 'User'],
];
